import { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X, Pin, Tag } from 'lucide-react'

const CATEGORIES = [
  { id: 'general', label: 'General', color: 'bg-forest-500 text-plum-200 border-plum-600' },
  { id: 'venue', label: 'Venue', color: 'bg-sage-100 text-sage-600 border-sage-200' },
  { id: 'budget', label: 'Budget', color: 'bg-blush-100 text-blush-200 border-plum-700/40' },
  { id: 'todo', label: 'To-Do', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { id: 'question', label: 'Question', color: 'bg-blue-100 text-blue-600 border-blue-200' },
]

function getCategoryStyle(id) {
  return CATEGORIES.find(c => c.id === id)?.color || CATEGORIES[0].color
}

function getCategoryLabel(id) {
  return CATEGORIES.find(c => c.id === id)?.label || 'General'
}

function generateId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function NoteCard({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(note)

  function save() {
    if (!draft.content.trim()) return
    onUpdate({ ...draft, updatedAt: Date.now() })
    setEditing(false)
  }

  function cancel() {
    setDraft(note)
    setEditing(false)
  }

  const dateStr = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })

  if (editing) {
    return (
      <div className="bg-forest-500 rounded-2xl border-2 border-plum-300 p-5 space-y-3 shadow-sm">
        <input
          className="input font-serif text-lg font-semibold"
          placeholder="Note title..."
          value={draft.title}
          onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
        />
        <textarea
          className="input resize-none text-sm leading-relaxed"
          rows={5}
          placeholder="Write your note here..."
          value={draft.content}
          onChange={e => setDraft(d => ({ ...d, content: e.target.value }))}
          autoFocus
        />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-moon-300 font-sans">Category:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setDraft(d => ({ ...d, category: cat.id }))}
              className={`text-xs font-sans px-3 py-1 rounded-full border transition-all ${
                draft.category === cat.id
                  ? cat.color + ' font-semibold'
                  : 'bg-forest-500 text-moon-300 border-plum-600 hover:border-plum-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button onClick={save} className="btn-primary flex items-center gap-1.5 text-sm">
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button onClick={cancel} className="btn-secondary text-sm">Cancel</button>
          <label className="ml-auto flex items-center gap-1.5 cursor-pointer">
            <div
              onClick={() => setDraft(d => ({ ...d, pinned: !d.pinned }))}
              className={`w-7 h-4 rounded-full transition-colors relative ${draft.pinned ? 'bg-plum-400' : 'bg-forest-400'}`}
            >
              <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-forest-500 transition-all ${draft.pinned ? 'left-3.5' : 'left-0.5'}`} />
            </div>
            <span className="text-xs font-sans text-white0">Pin</span>
          </label>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-forest-500 rounded-2xl border p-5 shadow-sm group transition-all hover:shadow-md ${note.pinned ? 'border-plum-300 ring-1 ring-plum-200' : 'border-plum-700/50'}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {note.pinned && <Pin className="w-3.5 h-3.5 text-moon-300 fill-current shrink-0" />}
          <span className={`text-xs font-sans px-2.5 py-0.5 rounded-full border ${getCategoryStyle(note.category)}`}>
            {getCategoryLabel(note.category)}
          </span>
          <span className="text-xs text-white0 font-sans">{dateStr}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-forest-600 text-moon-300 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(note.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-white0 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {note.title && (
        <h3 className="font-serif text-white text-lg mb-1.5">{note.title}</h3>
      )}
      <p className="font-sans text-sm text-plum-200 leading-relaxed whitespace-pre-wrap">{note.content}</p>
    </div>
  )
}

export default function NotesView({ notes, setNotes }) {
  const [showNew, setShowNew] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'general', pinned: false })
  const [filterCategory, setFilterCategory] = useState('all')

  function addNote() {
    if (!newNote.content.trim()) return
    const note = {
      ...newNote,
      id: generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setNotes(prev => [note, ...prev])
    setNewNote({ title: '', content: '', category: 'general', pinned: false })
    setShowNew(false)
  }

  function updateNote(updated) {
    setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
  }

  function deleteNote(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const filtered = notes
    .filter(n => filterCategory === 'all' || n.category === filterCategory)
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt)
    })

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Category filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all ${
              filterCategory === 'all'
                ? 'bg-plum-600 text-white border-plum-600'
                : 'bg-forest-500 text-moon-300 border-plum-600 hover:border-plum-400'
            }`}
          >
            All ({notes.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = notes.filter(n => n.category === cat.id).length
            if (count === 0) return null
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all ${
                  filterCategory === cat.id
                    ? cat.color + ' font-semibold'
                    : 'bg-forest-500 text-moon-300 border-plum-600 hover:border-plum-400'
                }`}
              >
                {cat.label} ({count})
              </button>
            )
          })}
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="btn-primary flex items-center gap-1.5 ml-auto"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </div>

      {/* New note form */}
      {showNew && (
        <div className="bg-forest-500 rounded-2xl border-2 border-plum-300 p-5 space-y-3 shadow-sm">
          <input
            className="input font-serif text-lg"
            placeholder="Title (optional)"
            value={newNote.title}
            onChange={e => setNewNote(n => ({ ...n, title: e.target.value }))}
          />
          <textarea
            className="input resize-none text-sm leading-relaxed"
            rows={4}
            placeholder="What's on your mind?"
            value={newNote.content}
            onChange={e => setNewNote(n => ({ ...n, content: e.target.value }))}
            autoFocus
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-moon-300 font-sans">Category:</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setNewNote(n => ({ ...n, category: cat.id }))}
                className={`text-xs font-sans px-3 py-1 rounded-full border transition-all ${
                  newNote.category === cat.id
                    ? cat.color + ' font-semibold'
                    : 'bg-forest-500 text-moon-300 border-plum-600 hover:border-plum-400'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button onClick={addNote} className="btn-primary flex items-center gap-1.5 text-sm">
              <Check className="w-3.5 h-3.5" /> Save Note
            </button>
            <button onClick={() => { setShowNew(false); setNewNote({ title: '', content: '', category: 'general', pinned: false }) }} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          ))}
        </div>
      ) : (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-forest-500 flex items-center justify-center mx-auto mb-4">
            <Pencil className="w-6 h-6 text-moon-300" />
          </div>
          <h3 className="font-serif text-xl text-plum-50 mb-2">No notes yet</h3>
          <p className="text-sm text-moon-300 font-sans mb-5">Jot down questions, ideas, or reminders as you plan.</p>
          <button onClick={() => setShowNew(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Write your first note
          </button>
        </div>
      )}
    </div>
  )
}
