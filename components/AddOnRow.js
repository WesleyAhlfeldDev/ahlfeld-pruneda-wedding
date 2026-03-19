import { useState } from 'react'
import { Pencil, Trash2, Check, X, Users } from 'lucide-react'
import { formatCurrency } from '../lib/data'

export default function AddOnRow({ addon, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(addon)

  function save() {
    onUpdate({ ...draft, price: parseFloat(draft.price) || 0, perPerson: !!draft.perPerson })
    setEditing(false)
  }

  function handleDelete() {
    if (confirm(`Remove "${addon.name}"? This cannot be undone.`)) {
      onDelete(addon.id)
    }
  }

  if (editing) {
    return (
      <div className="px-4 py-3 bg-sage-100 space-y-2">
        <div className="flex items-center gap-2">
          <input className="input text-sm flex-1" value={draft.name}
            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="Name" />
          <input className="input text-sm w-28" type="number" value={draft.price}
            onChange={e => setDraft(d => ({ ...d, price: e.target.value }))} placeholder="Price" />
          <input className="input text-sm flex-1" value={draft.description}
            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Description" />
          <button onClick={save} className="p-1.5 text-sage-500 hover:text-sage-600 shrink-0">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => { setDraft(addon); setEditing(false) }} className="p-1.5 text-plum-300 hover:text-plum-500 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <div
            onClick={() => setDraft(d => ({ ...d, perPerson: !d.perPerson }))}
            className={`w-8 h-4 rounded-full transition-colors relative ${draft.perPerson ? 'bg-plum-400' : 'bg-plum-200'}`}
          >
            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${draft.perPerson ? 'left-4' : 'left-0.5'}`} />
          </div>
          <span className="text-xs font-sans text-plum-600">Charge per extra guest</span>
        </label>
      </div>
    )
  }

  return (
    <div className="relative flex items-center gap-3 px-4 py-3 bg-white hover:bg-plum-50 transition-colors group">
      <div className="flex-1 min-w-0">
        <span className="font-sans font-medium text-sm text-plum-700">{addon.name}</span>
        {addon.description && (
          <p className="text-xs text-plum-400 font-sans mt-0.5">{addon.description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {addon.perPerson && (
          <span className="flex items-center gap-1 text-xs text-plum-400 font-sans bg-plum-50 px-2 py-0.5 rounded-full whitespace-nowrap border border-plum-100">
            <Users className="w-3 h-3" /> per person
          </span>
        )}
        <span className="font-sans font-semibold text-plum-600 text-sm whitespace-nowrap">
          {formatCurrency(addon.price)}
        </span>
      </div>
      {/* Action buttons — absolutely positioned so they never affect layout */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg px-1 py-0.5 shadow-sm">
        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-plum-100 text-plum-400 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-plum-300 hover:text-red-400 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
