import { useState, useEffect, useMemo, useRef } from 'react'
import Head from 'next/head'
import { Plus, LayoutList, GitCompare, Calculator, Download, Upload, Heart, Sparkles, NotebookPen, ListChecks, Cloud, HardDrive, Users } from 'lucide-react'
import VenueCard from '../components/VenueCard'
import VenueForm from '../components/VenueForm'
import PriceEstimator from '../components/PriceEstimator'
import CompareView from '../components/CompareView'
import NotesView from '../components/NotesView'
import TodoView from '../components/TodoView'
import GuestsView from '../components/GuestsView'
import { loadFromDB, saveToDB, subscribeToChanges, saveToLocal, isUsingSupabase, emptyState } from '../lib/db'
import { DEFAULT_DATA } from '../lib/data'

const TABS = [
  { id: 'venues', label: 'Venues', icon: LayoutList },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'estimate', label: 'Estimate', icon: Calculator },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'todos', label: 'To-Do', icon: ListChecks },
  { id: 'notes', label: 'Notes', icon: NotebookPen },
]

export default function Home() {
  const [venues, setVenues] = useState([])
  const [guestCount, setGuestCount] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [comparisons, setComparisons] = useState(emptyState().comparisons)
  const [estimate, setEstimate] = useState(emptyState().estimate)
  const [notes, setNotes] = useState([])
  const [todos, setTodos] = useState([])
  const [guests, setGuests] = useState([])
  const [tab, setTab] = useState('venues')
  const [showAddVenue, setShowAddVenue] = useState(false)
  const [highlightedId, setHighlightedId] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const saveTimeout = useRef(null)
  const isRemoteUpdate = useRef(false)

  // Load on mount
  useEffect(() => {
    loadFromDB().then(data => {
      const d = { ...emptyState(), ...data }
      setVenues(d.venues?.length ? d.venues : DEFAULT_DATA.venues)
      setGuestCount(d.guestCount || '')
      setWeddingDate(d.weddingDate || '')
      setComparisons(d.comparisons || emptyState().comparisons)
      setEstimate(d.estimate || emptyState().estimate)
      setNotes(d.notes || [])
      setTodos(d.todos || [])
      setGuests(d.guests || [])
      setLoaded(true)
    })
  }, [])

  // Debounced save
  useEffect(() => {
    if (!loaded || isRemoteUpdate.current) {
      isRemoteUpdate.current = false
      return
    }
    const state = { venues, guestCount, weddingDate, comparisons, estimate, notes, todos, guests }
    clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(async () => {
      setSyncing(true)
      await saveToDB(state)
      saveToLocal(state)
      setSyncing(false)
    }, 800)
    return () => clearTimeout(saveTimeout.current)
  }, [venues, guestCount, weddingDate, comparisons, estimate, notes, todos, guests, loaded])

  // Real-time subscription
  useEffect(() => {
    const unsub = subscribeToChanges(data => {
      isRemoteUpdate.current = true
      const d = { ...emptyState(), ...data }
      setVenues(d.venues || [])
      setGuestCount(d.guestCount || '')
      setWeddingDate(d.weddingDate || '')
      setComparisons(d.comparisons || emptyState().comparisons)
      setEstimate(d.estimate || emptyState().estimate)
      setNotes(d.notes || [])
      setTodos(d.todos || [])
      setGuests(d.guests || [])
    })
    return unsub
  }, [])

  // Save before unload
  useEffect(() => {
    if (!loaded) return
    const state = { venues, guestCount, weddingDate, comparisons, estimate, notes, todos, guests }
    const handle = () => { saveToLocal(state); saveToDB(state) }
    window.addEventListener('beforeunload', handle)
    return () => window.removeEventListener('beforeunload', handle)
  }, [loaded, venues, guestCount, weddingDate, comparisons, estimate, notes, todos, guests])

  const daysUntil = useMemo(() => {
    if (!weddingDate) return null
    const diff = new Date(weddingDate) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : null
  }, [weddingDate])

  function addVenue(venue) { setVenues(prev => [...prev, venue]); setShowAddVenue(false) }
  function updateVenue(updated) { setVenues(prev => prev.map(v => v.id === updated.id ? updated : v)) }
  function deleteVenue(id) {
    if (!confirm('Remove this venue?')) return
    setVenues(prev => prev.filter(v => v.id !== id))
    if (highlightedId === id) setHighlightedId(null)
  }

  function exportData() {
    const blob = new Blob([JSON.stringify({ venues }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'wedding-venues.json'; a.click()
    URL.revokeObjectURL(url)
  }

  function importData(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.venues) {
          setVenues(prev => {
            const existingIds = new Set(prev.map(v => v.id))
            const newVenues = data.venues.filter(v => !existingIds.has(v.id))
            const merged = prev.map(v => data.venues.find(u => u.id === v.id) || v)
            return [...merged, ...newVenues]
          })
        }
      } catch { alert('Invalid file format') }
    }
    reader.readAsText(file); e.target.value = ''
  }

  const activeTodos = todos.filter(t => !t.completed).length

  return (
    <>
      <Head>
        <title>Wesley & Leesianna's Wedding Planner 💍</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen pattern-bg">
        <header className="bg-forest-500/80 backdrop-blur-sm border-b border-plum-700/50 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-plum-400 to-plum-600 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                  <h1 className="font-serif font-semibold text-white text-lg leading-none">Wesley & Leesianna's</h1>
                  <p className="text-xs text-moon-300 font-sans">Wedding Planner ✨</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs font-sans">
                  {isUsingSupabase() ? (
                    <span className={`flex items-center gap-1 ${syncing ? 'text-amber-500' : 'text-sage-600'}`}>
                      <Cloud className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{syncing ? 'Saving...' : 'Synced'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-white0">
                      <HardDrive className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Local only</span>
                    </span>
                  )}
                </div>
                <label className="btn-ghost cursor-pointer flex items-center gap-1.5 text-xs">
                  <Upload className="w-3.5 h-3.5" /><span className="hidden sm:inline">Import</span>
                  <input type="file" accept=".json" className="hidden" onChange={importData} />
                </label>
                <button onClick={exportData} className="btn-ghost flex items-center gap-1.5 text-xs">
                  <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span>
                </button>
                <button onClick={() => { setShowAddVenue(true); setTab('venues') }} className="btn-primary flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add Venue</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-4 shadow-sm flex flex-col items-center justify-center min-h-24">
              <p className="font-serif text-2xl font-bold text-plum-50">{venues.length}</p>
              <p className="text-xs text-moon-300 font-sans mt-1">Venues Saved</p>
            </div>
            <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-4 shadow-sm flex flex-col items-center justify-center min-h-24">
              <p className="font-serif text-2xl font-bold text-plum-50">{venues.reduce((s, v) => s + v.packages.length, 0)}</p>
              <p className="text-xs text-moon-300 font-sans mt-1">Total Packages</p>
            </div>
            <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-4 shadow-sm flex flex-col items-center justify-center min-h-24">
              <input type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)} placeholder="—"
                className="w-full text-center font-serif text-2xl font-bold text-plum-50 bg-transparent border-none outline-none placeholder-plum-200 focus:text-plum-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              <p className="text-xs text-moon-300 font-sans mt-1">Est. Guest Count</p>
            </div>
            <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-4 shadow-sm flex flex-col items-center justify-center min-h-24">
              {daysUntil !== null ? (
                <>
                  <p className="font-serif text-2xl font-bold text-plum-50">{daysUntil.toLocaleString()}</p>
                  <p className="text-xs text-moon-300 font-sans mt-1">Days Until Wedding</p>
                  <button onClick={() => setWeddingDate('')} className="text-xs text-white0 hover:text-plum-100 mt-1 font-sans">
                    {new Date(weddingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ×
                  </button>
                </>
              ) : (
                <>
                  <input type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)}
                    className="w-full text-center font-serif text-sm text-white0 bg-transparent border-none outline-none cursor-pointer" />
                  <p className="text-xs text-moon-300 font-sans mt-1">Wedding Date</p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 bg-forest-500 rounded-2xl p-1.5 border border-plum-700/50 shadow-sm mb-6 w-fit flex-wrap">
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all ${tab === t.id ? 'bg-plum-600 text-white shadow-sm' : 'text-white0 hover:text-plum-50 hover:bg-forest-600'}`}>
                  <Icon className="w-4 h-4" />
                  {t.label}
                  {t.id === 'compare' && venues.length >= 2 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-forest-6000' : 'bg-forest-500 text-white0'}`}>{venues.length}</span>
                  )}
                  {t.id === 'guests' && guests.length > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-plum-600' : 'bg-forest-400 text-moon-300'}`}>{guests.length}</span>
                  )}
                  {t.id === 'todos' && activeTodos > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-forest-6000' : 'bg-amber-100 text-amber-600'}`}>{activeTodos}</span>
                  )}
                  {t.id === 'notes' && notes.length > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-forest-6000' : 'bg-forest-500 text-white0'}`}>{notes.length}</span>
                  )}
                </button>
              )
            })}
          </div>

          {tab === 'venues' && (
            <div className="space-y-6">
              {showAddVenue && <VenueForm onSave={addVenue} onCancel={() => setShowAddVenue(false)} />}
              {venues.length === 0 && !showAddVenue && (
                <div className="card p-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-forest-500 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-moon-300" />
                  </div>
                  <h2 className="font-serif text-2xl text-plum-50 mb-2">No venues yet</h2>
                  <p className="text-moon-300 font-sans mb-6">Start adding venues to compare and estimate costs.</p>
                  <button onClick={() => setShowAddVenue(true)} className="btn-primary inline-flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Your First Venue
                  </button>
                </div>
              )}
              {venues.map(venue => (
                <VenueCard key={venue.id} venue={venue} onUpdate={updateVenue} onDelete={deleteVenue} isHighlighted={highlightedId === venue.id} />
              ))}
              {venues.length > 0 && !showAddVenue && (
                <button onClick={() => setShowAddVenue(true)}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-plum-600 text-moon-300 hover:border-plum-400 hover:text-white transition-all font-sans text-sm flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add another venue
                </button>
              )}
            </div>
          )}

          {tab === 'compare' && <CompareView venues={venues} comparisons={comparisons} setComparisons={setComparisons} />}
          {tab === 'estimate' && (
            <div className="max-w-2xl">
              <PriceEstimator venues={venues} globalGuestCount={guestCount} estimate={estimate} setEstimate={setEstimate} />
            </div>
          )}
          {tab === 'guests' && <GuestsView guests={guests} setGuests={setGuests} />}
          {tab === 'todos' && <TodoView todos={todos} setTodos={setTodos} />}
          {tab === 'notes' && <NotesView notes={notes} setNotes={setNotes} />}
        </main>

        <footer className="text-center py-8 text-xs text-white0 font-sans">
          <p>Made with <Heart className="w-3 h-3 inline text-moon-300 fill-current" /> for your special day ·{' '}
            {isUsingSupabase() ? 'Live sync across all devices ☁️' : 'Set up Supabase to share with family'}
          </p>
        </footer>
      </div>
    </>
  )
}
