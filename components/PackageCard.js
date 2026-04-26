import { useState } from 'react'
import { Pencil, Trash2, Check, X, Plus, Clock, Users, ChevronDown, ChevronUp, Heart } from 'lucide-react'
import { formatCurrency } from '../lib/data'

export default function PackageCard({ pkg, onUpdate, onDelete, isChosen, onChoose, onClearChoice }) {
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

  function handleDelete(e) {
    e.stopPropagation()
    if (confirm(`Remove "${pkg.name}"? This cannot be undone.`)) {
      onDelete(pkg.id)
    }
  }

  if (editing) {
    return (
      <div className="bg-forest-600 rounded-xl border border-plum-600 p-4 space-y-3">
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
                className="shrink-0 p-1.5 text-white0 hover:text-red-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={() => setDraft(d => ({ ...d, includes: [...d.includes, ''] }))}
            className="text-xs text-white0 hover:text-plum-50 flex items-center gap-1 mt-1">
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
    <div className={`relative border rounded-xl overflow-hidden bg-forest-400 transition-all group
      ${isChosen
        ? 'border-blush-400/60 ring-1 ring-blush-400/30 hover:border-blush-300'
        : 'border-plum-600/50 hover:border-plum-500 hover:bg-forest-300'}`}>
      {/* Accordion Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-forest-400 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0 flex-wrap pr-16">
          <span className="font-serif text-white text-base">{pkg.name}</span>
          <span className="font-serif text-plum-200 font-semibold text-sm whitespace-nowrap">
            {formatCurrency(pkg.price)}
          </span>
          {pkg.guestCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-moon-300 font-sans bg-forest-600 px-2 py-0.5 rounded-full whitespace-nowrap">
              <Users className="w-3 h-3" /> {pkg.guestCount} guests
            </span>
          )}
          {pkg.hours > 0 && (
            <span className="flex items-center gap-1 text-xs text-moon-300 font-sans bg-forest-600 px-2 py-0.5 rounded-full whitespace-nowrap">
              <Clock className="w-3 h-3" /> {pkg.hours} hrs
            </span>
          )}
          {isChosen && (
            <span className="inline-flex items-center gap-1 bg-blush-600/30 text-blush-200 text-xs font-sans font-medium px-2 py-0.5 rounded-full border border-blush-400/40 whitespace-nowrap">
              <Heart className="w-3 h-3 fill-current" /> Our Package
            </span>
          )}
        </div>

        <div className="shrink-0">
          {open
            ? <ChevronUp className="w-4 h-4 text-moon-300" />
            : <ChevronDown className="w-4 h-4 text-moon-300" />}
        </div>
      </button>

      {/* Action buttons — hidden on mobile, absolutely positioned on hover for desktop */}
      <div
        className="hidden sm:flex items-center gap-2 absolute right-10 top-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}
      >
        {!isChosen && (
          <button onClick={onChoose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blush-600/20 border border-blush-400/40 text-blush-200 hover:bg-blush-600/30 hover:border-blush-300 text-xs font-sans font-semibold transition-all">
            <Heart className="w-3.5 h-3.5" /> I Do
          </button>
        )}
        <div className="flex gap-1 bg-forest-500/90 rounded-lg px-1 py-0.5 shadow-sm">
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-forest-500 text-moon-300 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-white0 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-plum-800">
          {pkg.extraGuestPrice > 0 && (
            <p className="text-xs text-moon-300 font-sans mt-3 mb-2 flex items-center gap-1.5">
              <span className="inline-block w-4 h-4 rounded-full bg-blush-100 text-blush-200 text-center leading-4 text-xs font-bold">+</span>
              Additional guests: <span className="font-semibold text-plum-200">{formatCurrency(pkg.extraGuestPrice)} / person</span> beyond {pkg.guestCount} included
            </p>
          )}
          {pkg.includes?.length > 0 && (
            <ul className="space-y-2 mt-3">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-plum-200 font-sans">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-sage-200 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-sage-600" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 pt-3 border-t border-plum-800/50" onClick={e => e.stopPropagation()}>
            {isChosen ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-blush-300 font-sans flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current" /> This is our chosen package
                </span>
                <button onClick={onClearChoice} className="text-xs text-moon-300 hover:text-white font-sans transition-colors">
                  Change
                </button>
              </div>
            ) : (
              <button onClick={onChoose}
                className="w-full py-2 rounded-lg border border-blush-400/40 bg-blush-600/10 text-blush-200 hover:bg-blush-600/20 hover:border-blush-300 text-xs font-sans font-medium transition-all flex items-center justify-center gap-1.5">
                <Heart className="w-3.5 h-3.5" /> Choose This Package
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
