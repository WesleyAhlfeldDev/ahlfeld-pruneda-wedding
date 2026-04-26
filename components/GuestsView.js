import { useState, useMemo } from 'react'
import { Plus, Trash2, Pencil, Check, X, ChevronDown, Users, UserCheck, UserX, Clock, Search } from 'lucide-react'

const ROLES = [
  { id: 'bride', label: 'Bride' },
  { id: 'groom', label: 'Groom' },
  { id: 'maid_of_honor', label: 'Maid of Honor' },
  { id: 'best_man', label: 'Best Man' },
  { id: 'bridesmaid', label: 'Bridesmaid' },
  { id: 'groomsman', label: 'Groomsman' },
  { id: 'flower_girl', label: 'Flower Girl' },
  { id: 'ring_bearer', label: 'Ring Bearer' },
  { id: 'officiant', label: 'Officiant' },
  { id: 'family', label: 'Family' },
  { id: 'friend', label: 'Friend' },
  { id: 'coworker', label: 'Coworker' },
  { id: 'other', label: 'Guest' },
]

const RSVP = [
  { id: 'pending', label: 'Pending', color: 'bg-moon-600 text-moon-200 border-moon-500', icon: Clock },
  { id: 'attending', label: 'Attending', color: 'bg-sage-100 text-sage-500 border-sage-300/40', icon: UserCheck },
  { id: 'declined', label: 'Declined', color: 'bg-red-900/40 text-red-300 border-red-700/40', icon: UserX },
]

const MEAL = [
  { id: 'none', label: 'Not set' },
  { id: 'standard', label: 'Standard' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten_free', label: 'Gluten Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
  { id: 'kids', label: "Kids' Meal" },
]

function getRoleLabel(id) {
  return ROLES.find(r => r.id === id)?.label || 'Guest'
}

function getRsvp(id) {
  return RSVP.find(r => r.id === id) || RSVP[0]
}

function generateId() {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

const DEFAULT_GUEST = {
  firstName: '', lastName: '', email: '', phone: '',
  role: 'other', rsvp: 'pending',
  plusOne: false, plusOneName: '', plusOneRsvp: 'pending',
  meal: 'none', plusOneMeal: 'none',
  side: 'both', notes: '',
}

function GuestRow({ guest, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(guest)
  const rsvpInfo = getRsvp(guest.rsvp)
  const RsvpIcon = rsvpInfo.icon

  function save() {
    if (!draft.firstName.trim()) return
    onUpdate({ ...draft })
    setEditing(false)
  }

  function cancel() {
    setDraft(guest)
    setEditing(false)
  }

  function handleDelete() {
    if (confirm(`Remove ${guest.firstName} ${guest.lastName}?`)) onDelete(guest.id)
  }

  if (editing) {
    return (
      <div className="bg-forest-400 border border-plum-500/50 rounded-xl p-5 space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">First Name *</label>
            <input className="input" value={draft.firstName}
              onChange={e => setDraft(d => ({ ...d, firstName: e.target.value }))}
              placeholder="First" autoFocus />
          </div>
          <div>
            <label className="label">Last Name</label>
            <input className="input" value={draft.lastName}
              onChange={e => setDraft(d => ({ ...d, lastName: e.target.value }))}
              placeholder="Last" />
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={draft.email}
              onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
              placeholder="email@example.com" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" type="tel" value={draft.phone}
              onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
              placeholder="(555) 000-0000" />
          </div>
        </div>

        {/* Role, Side, RSVP */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Role</label>
            <div className="relative">
              <select className="input appearance-none pr-8 cursor-pointer"
                value={draft.role} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}>
                {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="label">Side</label>
            <div className="relative">
              <select className="input appearance-none pr-8 cursor-pointer"
                value={draft.side} onChange={e => setDraft(d => ({ ...d, side: e.target.value }))}>
                <option value="both">Both</option>
                <option value="bride">Bride's Side</option>
                <option value="groom">Groom's Side</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="label">RSVP</label>
            <div className="relative">
              <select className="input appearance-none pr-8 cursor-pointer"
                value={draft.rsvp} onChange={e => setDraft(d => ({ ...d, rsvp: e.target.value }))}>
                {RSVP.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Meal */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Meal Preference</label>
            <div className="relative">
              <select className="input appearance-none pr-8 cursor-pointer"
                value={draft.meal} onChange={e => setDraft(d => ({ ...d, meal: e.target.value }))}>
                {MEAL.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Plus one */}
        <div>
          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <div onClick={() => setDraft(d => ({ ...d, plusOne: !d.plusOne }))}
              className={`w-9 h-5 rounded-full transition-colors relative ${draft.plusOne ? 'bg-plum-500' : 'bg-forest-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${draft.plusOne ? 'left-4' : 'left-0.5'}`} />
            </div>
            <span className="text-sm font-sans text-plum-100">Has a +1</span>
          </label>

          {draft.plusOne && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 pl-2 border-l-2 border-plum-600/40">
              <div>
                <label className="label">+1 Name</label>
                <input className="input" value={draft.plusOneName}
                  onChange={e => setDraft(d => ({ ...d, plusOneName: e.target.value }))}
                  placeholder="Name (optional)" />
              </div>
              <div>
                <label className="label">+1 RSVP</label>
                <div className="relative">
                  <select className="input appearance-none pr-8 cursor-pointer"
                    value={draft.plusOneRsvp} onChange={e => setDraft(d => ({ ...d, plusOneRsvp: e.target.value }))}>
                    {RSVP.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="label">+1 Meal</label>
                <div className="relative">
                  <select className="input appearance-none pr-8 cursor-pointer"
                    value={draft.plusOneMeal} onChange={e => setDraft(d => ({ ...d, plusOneMeal: e.target.value }))}>
                    {MEAL.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes</label>
          <textarea className="input resize-none text-sm" rows={2}
            placeholder="Dietary notes, travel info, anything else..."
            value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} />
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={save} className="btn-primary flex items-center gap-1.5 text-sm">
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button onClick={cancel} className="btn-secondary text-sm">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-forest-400 border-b border-plum-700/30 last:border-b-0 hover:bg-forest-300 transition-colors group relative">
      {/* RSVP indicator */}
      <div className={`w-2 h-2 rounded-full shrink-0 ${
        guest.rsvp === 'attending' ? 'bg-sage-500' :
        guest.rsvp === 'declined' ? 'bg-red-400' : 'bg-moon-400'
      }`} />

      {/* Name & details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans font-medium text-plum-50 text-sm">
            {guest.firstName} {guest.lastName}
          </span>
          <span className="text-xs text-moon-300 font-sans">{getRoleLabel(guest.role)}</span>
          {guest.plusOne && (
            <span className="text-xs font-sans px-1.5 py-0.5 rounded-full bg-plum-800 text-plum-200 border border-plum-600/30">
              +1{guest.plusOneName ? ` (${guest.plusOneName})` : ''}
            </span>
          )}
        </div>
        {guest.notes && (
          <p className="text-xs text-moon-400 font-sans mt-0.5 truncate">{guest.notes}</p>
        )}
      </div>

      {/* RSVP badge */}
      <span className={`text-xs font-sans px-2.5 py-1 rounded-full border shrink-0 ${getRsvp(guest.rsvp).color}`}>
        {getRsvp(guest.rsvp).label}
      </span>

      {/* Actions */}
      <div className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-forest-400/90 rounded-lg px-1 py-0.5 shadow-sm">
        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-forest-300 text-moon-300 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-900/40 text-moon-400 hover:text-red-300 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function GuestsView({ guests, setGuests }) {
  const [showForm, setShowForm] = useState(false)
  const [newGuest, setNewGuest] = useState({ ...DEFAULT_GUEST })
  const [search, setSearch] = useState('')
  const [filterRsvp, setFilterRsvp] = useState('all')
  const [filterRole, setFilterRole] = useState('all')
  const [filterSide, setFilterSide] = useState('all')
  const [statFilter, setStatFilter] = useState(null)

  function applyStatFilter(stat) {
    if (stat === 'plusOne') {
      setStatFilter('plusOne')
      setFilterRsvp('all')
    } else if (stat === 'all') {
      setStatFilter(null)
      setFilterRsvp('all')
    } else {
      setStatFilter(null)
      setFilterRsvp(stat)
    }
  }

  function addGuest() {
    if (!newGuest.firstName.trim()) return
    setGuests(prev => [...prev, { ...newGuest, id: generateId(), createdAt: Date.now() }])
    setNewGuest({ ...DEFAULT_GUEST })
    setShowForm(false)
  }

  function updateGuest(updated) {
    setGuests(prev => prev.map(g => g.id === updated.id ? updated : g))
  }

  function deleteGuest(id) {
    setGuests(prev => prev.filter(g => g.id !== id))
  }

  const filtered = useMemo(() => {
    return guests.filter(g => {
      const name = `${g.firstName} ${g.lastName}`.toLowerCase()
      if (search && !name.includes(search.toLowerCase())) return false
      if (statFilter === 'plusOne' && !g.plusOne) return false
      if (filterRsvp !== 'all' && g.rsvp !== filterRsvp) return false
      if (filterRole !== 'all' && g.role !== filterRole) return false
      return true
    })
  }, [guests, search, filterRsvp, filterRole, statFilter])

  const sections = useMemo(() => {
    const sides = filterSide === 'all' ? ['both', 'bride', 'groom'] : [filterSide]
    return sides.map(side => ({
      id: side,
      label: side === 'both' ? 'Both Sides' : side === 'bride' ? "Bride's Side" : "Groom's Side",
      guests: filtered.filter(g => g.side === side),
    })).filter(s => s.guests.length > 0)
  }, [filtered, filterSide])

  // Stats
  const plusOnes = guests.filter(g => g.plusOne)
  const plusOnesAttending = plusOnes.filter(g => g.plusOneRsvp === 'attending')
  const totalAttending = guests.filter(g => g.rsvp === 'attending').length + plusOnesAttending.length
  const pending = guests.filter(g => g.rsvp === 'pending')
  const declined = guests.filter(g => g.rsvp === 'declined')

  // Roles that have guests (for filter)
  const usedRoles = [...new Set(guests.map(g => g.role))]

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <button onClick={() => applyStatFilter('all')}
          className={`bg-forest-500 rounded-2xl border p-4 text-center transition-all hover:opacity-90 ${filterRsvp === 'all' && !statFilter ? 'border-plum-400 ring-1 ring-plum-400/40' : 'border-plum-700/50'}`}>
          <p className="font-serif text-2xl font-bold text-white">{guests.length}</p>
          <p className="text-xs text-moon-300 font-sans mt-0.5">Invited</p>
        </button>
        <button onClick={() => applyStatFilter('plusOne')}
          className={`bg-forest-500 rounded-2xl border p-4 text-center transition-all hover:opacity-90 ${statFilter === 'plusOne' ? 'border-plum-400 ring-1 ring-plum-400/40' : 'border-plum-600/40'}`}>
          <p className="font-serif text-2xl font-bold text-plum-200">{plusOnes.length}</p>
          <p className="text-xs text-moon-300 font-sans mt-0.5">+1s</p>
        </button>
        <button onClick={() => applyStatFilter('all')}
          className="bg-forest-500 rounded-2xl border border-plum-700/50 p-4 text-center transition-all hover:opacity-90">
          <p className="font-serif text-2xl font-bold text-white">{guests.length + plusOnes.length}</p>
          <p className="text-xs text-moon-300 font-sans mt-0.5">Total</p>
        </button>
        <button onClick={() => applyStatFilter('attending')}
          className={`bg-forest-500 rounded-2xl border p-4 text-center transition-all hover:opacity-90 ${filterRsvp === 'attending' && !statFilter ? 'border-sage-400 ring-1 ring-sage-400/30' : 'border-sage-300/30'}`}>
          <p className="font-serif text-2xl font-bold text-sage-500">{totalAttending}</p>
          <p className="text-xs text-moon-300 font-sans mt-0.5">Attending</p>
        </button>
        <button onClick={() => applyStatFilter('pending')}
          className={`bg-forest-500 rounded-2xl border p-4 text-center transition-all hover:opacity-90 ${filterRsvp === 'pending' && !statFilter ? 'border-moon-400 ring-1 ring-moon-400/30' : 'border-plum-700/50'}`}>
          <p className="font-serif text-2xl font-bold text-moon-300">{pending.length}</p>
          <p className="text-xs text-moon-300 font-sans mt-0.5">Pending</p>
        </button>
        <button onClick={() => applyStatFilter('declined')}
          className={`bg-forest-500 rounded-2xl border p-4 text-center transition-all hover:opacity-90 ${filterRsvp === 'declined' && !statFilter ? 'border-red-500 ring-1 ring-red-500/30' : 'border-red-700/30'}`}>
          <p className="font-serif text-2xl font-bold text-red-400">{declined.length}</p>
          <p className="text-xs text-moon-300 font-sans mt-0.5">Declined</p>
        </button>
      </div>

      {/* Search + filters + add */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-moon-400 pointer-events-none" />
            <input className="input pl-9" placeholder="Search guests..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 shrink-0">
            <Plus className="w-4 h-4" /> Add Guest
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* RSVP filter */}
          {['all', 'attending', 'pending', 'declined'].map(r => (
            <button key={r} onClick={() => { setFilterRsvp(r); setStatFilter(null) }}
              className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all capitalize ${
                filterRsvp === r
                  ? 'bg-plum-500 text-white border-plum-500'
                  : 'bg-forest-500 text-moon-300 border-plum-700/40 hover:border-plum-500'
              }`}>
              {r === 'all' ? `All (${guests.length})` : `${r.charAt(0).toUpperCase() + r.slice(1)} (${guests.filter(g => g.rsvp === r).length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Side filter */}
          {[
            { id: 'all', label: 'All Sides' },
            { id: 'bride', label: "Bride's Side" },
            { id: 'groom', label: "Groom's Side" },
            { id: 'both', label: 'Both Sides' },
          ].map(s => (
            <button key={s.id} onClick={() => setFilterSide(s.id)}
              className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all ${
                filterSide === s.id
                  ? 'bg-plum-500 text-white border-plum-500'
                  : 'bg-forest-500 text-moon-300 border-plum-700/40 hover:border-plum-500'
              }`}>
              {s.id === 'all' ? s.label : `${s.label} (${guests.filter(g => g.side === s.id).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Add guest form */}
      {showForm && (
        <div className="bg-forest-400 border border-plum-500/50 rounded-xl p-5 space-y-4">
          <h3 className="font-serif text-plum-50 font-semibold">New Guest</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name *</label>
              <input className="input" value={newGuest.firstName} autoFocus
                onChange={e => setNewGuest(g => ({ ...g, firstName: e.target.value }))} placeholder="First" />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input" value={newGuest.lastName}
                onChange={e => setNewGuest(g => ({ ...g, lastName: e.target.value }))} placeholder="Last" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Role</label>
              <div className="relative">
                <select className="input appearance-none pr-8 cursor-pointer"
                  value={newGuest.role} onChange={e => setNewGuest(g => ({ ...g, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">Side</label>
              <div className="relative">
                <select className="input appearance-none pr-8 cursor-pointer"
                  value={newGuest.side} onChange={e => setNewGuest(g => ({ ...g, side: e.target.value }))}>
                  <option value="both">Both</option>
                  <option value="bride">Bride's Side</option>
                  <option value="groom">Groom's Side</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="label">RSVP</label>
              <div className="relative">
                <select className="input appearance-none pr-8 cursor-pointer"
                  value={newGuest.rsvp} onChange={e => setNewGuest(g => ({ ...g, rsvp: e.target.value }))}>
                  {RSVP.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer w-fit">
            <div onClick={() => setNewGuest(g => ({ ...g, plusOne: !g.plusOne }))}
              className={`w-9 h-5 rounded-full transition-colors relative ${newGuest.plusOne ? 'bg-plum-500' : 'bg-forest-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${newGuest.plusOne ? 'left-4' : 'left-0.5'}`} />
            </div>
            <span className="text-sm font-sans text-plum-100">Has a +1</span>
          </label>

          <div className="flex gap-2">
            <button onClick={addGuest} className="btn-primary flex items-center gap-1.5 text-sm">
              <Check className="w-3.5 h-3.5" /> Add Guest
            </button>
            <button onClick={() => { setShowForm(false); setNewGuest({ ...DEFAULT_GUEST }) }} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Guest list grouped by side */}
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.id}>
              <h3 className="text-xs font-sans font-semibold uppercase tracking-widest text-moon-400 mb-2 px-1">
                {section.label} <span className="text-moon-500">({section.guests.length})</span>
              </h3>
              <div className="bg-forest-500 rounded-2xl border border-plum-700/50 overflow-hidden">
                {section.guests.map(guest => (
                  <GuestRow key={guest.id} guest={guest} onUpdate={updateGuest} onDelete={deleteGuest} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : guests.length === 0 ? (
        <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-plum-800 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-plum-300" />
          </div>
          <h3 className="font-serif text-xl text-plum-50 mb-2">No guests yet</h3>
          <p className="text-sm text-moon-300 font-sans mb-5">Start building your guest list and tracking RSVPs.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add your first guest
          </button>
        </div>
      ) : (
        <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-8 text-center">
          <p className="text-moon-300 font-sans text-sm">No guests match your filters.</p>
        </div>
      )}

    </div>
  )
}
