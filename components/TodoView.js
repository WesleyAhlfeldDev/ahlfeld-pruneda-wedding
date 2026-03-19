import { useState } from 'react'
import { Plus, Check, Trash2, Pencil, X, ChevronDown } from 'lucide-react'

const PRIORITIES = [
  { id: 'high', label: 'High', color: 'bg-red-100 text-red-600 border-red-200' },
  { id: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-600 border-amber-200' },
  { id: 'low', label: 'Low', color: 'bg-sage-100 text-sage-500 border-sage-200' },
]

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'venue', label: 'Venue' },
  { id: 'budget', label: 'Budget' },
  { id: 'planning', label: 'Planning' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'guests', label: 'Guests' },
  { id: 'other', label: 'Other' },
]

function getPriorityStyle(id) {
  return PRIORITIES.find(p => p.id === id)?.color || PRIORITIES[1].color
}

function generateId() {
  return `todo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function TodoItem({ todo, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo)

  function save() {
    if (!draft.text.trim()) return
    onUpdate({ ...draft })
    setEditing(false)
  }

  function toggle() {
    onUpdate({ ...todo, completed: !todo.completed, completedAt: !todo.completed ? Date.now() : null })
  }

  if (editing) {
    return (
      <div className="bg-white rounded-xl border-2 border-plum-300 p-4 space-y-3">
        <input
          className="input text-sm"
          value={draft.text}
          onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
          autoFocus
          placeholder="What needs to be done?"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-plum-400 font-sans">Priority:</span>
          {PRIORITIES.map(p => (
            <button key={p.id} onClick={() => setDraft(d => ({ ...d, priority: p.id }))}
              className={`text-xs font-sans px-2.5 py-1 rounded-full border transition-all ${draft.priority === p.id ? p.color + ' font-semibold' : 'bg-white text-plum-400 border-plum-200 hover:border-plum-300'}`}>
              {p.label}
            </button>
          ))}
          <span className="text-xs text-plum-400 font-sans ml-2">Category:</span>
          <div className="relative">
            <select
              className="text-xs font-sans px-2.5 py-1 rounded-full border border-plum-200 bg-white text-plum-600 appearance-none pr-6 cursor-pointer"
              value={draft.category || 'other'}
              onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-plum-300 pointer-events-none" />
          </div>
        </div>
        <textarea
          className="input resize-none text-sm"
          rows={2}
          placeholder="Notes (optional)"
          value={draft.notes || ''}
          onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
        />
        <div className="flex gap-2">
          <button onClick={save} className="btn-primary text-sm flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button onClick={() => { setDraft(todo); setEditing(false) }} className="btn-secondary text-sm">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border transition-all group ${
      todo.completed ? 'bg-plum-50 border-plum-100 opacity-60' : 'bg-white border-plum-100 hover:border-plum-200 hover:shadow-sm'
    }`}>
      {/* Checkbox */}
      <button
        onClick={toggle}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          todo.completed ? 'bg-sage-400 border-sage-400' : 'border-plum-300 hover:border-plum-400'
        }`}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`font-sans text-sm ${todo.completed ? 'line-through text-plum-400' : 'text-plum-700'}`}>
          {todo.text}
        </p>
        {todo.notes && !todo.completed && (
          <p className="text-xs text-plum-400 mt-0.5 font-sans">{todo.notes}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className={`text-xs font-sans px-2 py-0.5 rounded-full border ${getPriorityStyle(todo.priority)}`}>
            {PRIORITIES.find(p => p.id === todo.priority)?.label || 'Medium'}
          </span>
          {todo.category && todo.category !== 'other' && (
            <span className="text-xs text-plum-400 font-sans">
              {CATEGORIES.find(c => c.id === todo.category)?.label}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        {!todo.completed && (
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-plum-50 text-plum-400 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        )}
        <button onClick={() => onDelete(todo.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-plum-300 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export default function TodoView({ todos, setTodos }) {
  const [newText, setNewText] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [newCategory, setNewCategory] = useState('other')
  const [newNotes, setNewNotes] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [showCompleted, setShowCompleted] = useState(false)

  function addTodo() {
    if (!newText.trim()) return
    const todo = {
      id: generateId(),
      text: newText.trim(),
      priority: newPriority,
      category: newCategory,
      notes: newNotes.trim(),
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
    }
    setTodos(prev => [todo, ...prev])
    setNewText('')
    setNewNotes('')
    setNewPriority('medium')
    setNewCategory('other')
    setShowForm(false)
  }

  function updateTodo(updated) {
    setTodos(prev => prev.map(t => t.id === updated.id ? updated : t))
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const active = todos.filter(t => !t.completed)
  const completed = todos.filter(t => t.completed)

  const filtered = active
    .filter(t => filter === 'all' || t.category === filter)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
    })

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-plum-100 p-3 text-center shadow-sm">
          <p className="font-serif text-2xl font-bold text-plum-700">{active.length}</p>
          <p className="text-xs text-plum-400 font-sans mt-0.5">Remaining</p>
        </div>
        <div className="bg-white rounded-2xl border border-plum-100 p-3 text-center shadow-sm">
          <p className="font-serif text-2xl font-bold text-sage-500">{completed.length}</p>
          <p className="text-xs text-plum-400 font-sans mt-0.5">Done</p>
        </div>
        <div className="bg-white rounded-2xl border border-plum-100 p-3 text-center shadow-sm">
          <p className="font-serif text-2xl font-bold text-plum-700">
            {todos.length > 0 ? Math.round((completed.length / todos.length) * 100) : 0}%
          </p>
          <p className="text-xs text-plum-400 font-sans mt-0.5">Complete</p>
        </div>
      </div>

      {/* Filter + Add */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap flex-1">
          {CATEGORIES.map(cat => {
            const count = cat.id === 'all' ? active.length : active.filter(t => t.category === cat.id).length
            if (cat.id !== 'all' && count === 0) return null
            return (
              <button key={cat.id} onClick={() => setFilter(cat.id)}
                className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all ${
                  filter === cat.id
                    ? 'bg-plum-600 text-white border-plum-600'
                    : 'bg-white text-plum-400 border-plum-200 hover:border-plum-300'
                }`}>
                {cat.label} {cat.id === 'all' ? `(${count})` : `(${count})`}
              </button>
            )
          })}
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 shrink-0">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </div>

      {/* New task form */}
      {showForm && (
        <div className="bg-white rounded-2xl border-2 border-plum-300 p-5 space-y-3 shadow-sm">
          <input
            autoFocus
            className="input"
            placeholder="What needs to be done?"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-plum-400 font-sans">Priority:</span>
            {PRIORITIES.map(p => (
              <button key={p.id} onClick={() => setNewPriority(p.id)}
                className={`text-xs font-sans px-2.5 py-1 rounded-full border transition-all ${newPriority === p.id ? p.color + ' font-semibold' : 'bg-white text-plum-400 border-plum-200 hover:border-plum-300'}`}>
                {p.label}
              </button>
            ))}
            <span className="text-xs text-plum-400 font-sans ml-2">Category:</span>
            <div className="relative">
              <select
                className="text-xs font-sans px-2.5 py-1 rounded-full border border-plum-200 bg-white text-plum-600 appearance-none pr-6 cursor-pointer"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-plum-300 pointer-events-none" />
            </div>
          </div>
          <textarea
            className="input resize-none text-sm"
            rows={2}
            placeholder="Notes (optional)"
            value={newNotes}
            onChange={e => setNewNotes(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={addTodo} className="btn-primary flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Add Task
            </button>
            <button onClick={() => { setShowForm(false); setNewText(''); setNewNotes('') }} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Active tasks */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(todo => (
            <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-6 h-6 text-sage-500" />
          </div>
          <h3 className="font-serif text-xl text-plum-700 mb-1">
            {active.length === 0 ? 'All caught up!' : 'No tasks in this category'}
          </h3>
          <p className="text-sm text-plum-400 font-sans mb-5">
            {active.length === 0 ? 'Add tasks to keep your planning on track.' : 'Try switching the filter above.'}
          </p>
          {active.length === 0 && (
            <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add your first task
            </button>
          )}
        </div>
      )}

      {/* Completed section */}
      {completed.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setShowCompleted(s => !s)}
              className="flex items-center gap-1.5 text-sm text-plum-400 hover:text-plum-600 font-sans transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showCompleted ? 'rotate-180' : ''}`} />
              {completed.length} completed
            </button>
            <button onClick={clearCompleted} className="text-xs text-plum-300 hover:text-red-400 font-sans transition-colors">
              Clear all
            </button>
          </div>
          {showCompleted && (
            <div className="space-y-2">
              {completed.map(todo => (
                <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
