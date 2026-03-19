import { useState } from 'react'
import { Pencil, Trash2, Check, X, Plus, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react'
import { formatCurrency } from '../lib/data'

export default function PackageCard({ pkg, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(pkg)

  function save() {
    onUpdate({
      ...draft,
      price: parseFloat(draft.price) || 0,
      guestCount: parseInt(draft.guestCount) || 0,
      hours: parseFloat(draft.hours) || 0,
      extraGuestPrice: parseFloat(draft.extraGuestPrice) || 0,
      includes: draft.includes.filter(Boolean),
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-plum-50 rounded-xl border border-plum-200 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Package Name</label>
            <input className="input" value={draft.name}
              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Price ($)</label>
            <input className="input" type="number" value={draft.price}
              onChange={e => setDraft(d => ({ ...d, price: e.target.value }))} />
          </div>
          <div>
            <label className="label">Guests</label>
            <input className="input" type="number" value={draft.guestCount}
              onChange={e => setDraft(d => ({ ...d, guestCount: e.target.value }))} />
          </div>
          <div>
            <label className="label">Hours</label>
            <input className="input" type="number" value={draft.hours}
              onChange={e => setDraft(d => ({ ...d, hours: e.target.value }))} />
          </div>
          <div>
            <label className="label">Extra Guest Price ($ / person)</label>
            <input className="input" type="number" placeholder="e.g. 51" value={draft.extraGuestPrice || ''}
              onChange={e => setDraft(d => ({ ...d, extraGuestPrice: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="label">What's Included</label>
          {draft.includes.map((item, i) => (
            <div key={i} className="flex gap-2 mb-1.5">
              <input className="input text-sm" value={item}
                onChange={e => setDraft(d => ({ ...d, includes: d.includes.map((v, j) => j === i ? e.target.value : v) }))} />
              <button onClick={() => setDraft(d => ({ ...d, includes: d.includes.filter((_, j) => j !== i) }))}
                className="shrink-0 p-1.5 text-plum-300 hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => setDraft(d => ({ ...d, includes: [...d.includes, ''] }))}
            className="text-xs text-plum-500 hover:text-plum-700 flex items-center gap-1 mt-1">
            <Plus className="w-3.5 h-3.5" /> Add item
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={save} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Save
          </button>
          <button onClick={() => { setDraft(pkg); setEditing(false) }} className="btn-secondary text-xs px-3 py-1.5">
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-plum-100 rounded-xl overflow-hidden bg-white hover:border-plum-200 transition-all group">
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-parchment transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0 flex-wrap">
          <span className="font-serif text-plum-800 text-base">{pkg.name}</span>
          <span className="font-serif text-plum-600 font-semibold text-sm whitespace-nowrap">
            {formatCurrency(pkg.price)}
          </span>
          {pkg.guestCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-plum-400 font-sans bg-plum-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              <Users className="w-3 h-3" /> {pkg.guestCount} guests
            </span>
          )}
          {pkg.hours > 0 && (
            <span className="flex items-center gap-1 text-xs text-plum-400 font-sans bg-plum-50 px-2 py-0.5 rounded-full whitespace-nowrap">
              <Clock className="w-3 h-3" /> {pkg.hours} hrs
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <span className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-plum-100 text-plum-400 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(pkg.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-plum-400 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </span>
          {open
            ? <ChevronUp className="w-4 h-4 text-plum-400" />
            : <ChevronDown className="w-4 h-4 text-plum-400" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-plum-50">
          {pkg.extraGuestPrice > 0 && (
            <p className="text-xs text-plum-400 font-sans mt-3 mb-2 flex items-center gap-1.5">
              <span className="inline-block w-4 h-4 rounded-full bg-blush-100 text-blush-500 text-center leading-4 text-xs font-bold">+</span>
              Additional guests: <span className="font-semibold text-plum-600">{formatCurrency(pkg.extraGuestPrice)} / person</span> beyond {pkg.guestCount} included
            </p>
          )}
          {pkg.includes?.length > 0 && (
            <ul className="space-y-2 mt-3">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-plum-600 font-sans">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-sage-200 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-sage-500" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
