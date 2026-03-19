import { useState } from 'react'
import { Check, X } from 'lucide-react'

export default function VenueForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '',
    location: '',
    capacity: '',
    website: '',
    notes: '',
    packages: [],
    addons: [],
  })

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  function save() {
    if (!form.name.trim()) return
    onSave({
      ...form,
      capacity: parseInt(form.capacity) || 0,
      id: form.id || `venue-${Date.now()}`,
    })
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-plum-800">
          {initial?.id ? 'Edit Venue' : 'New Venue'}
        </h3>
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-plum-50 text-plum-400">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="label">Venue Name *</label>
          <input className="input" placeholder="e.g. The Grand Magnolia Estate" value={form.name}
            onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" placeholder="e.g. Austin, TX" value={form.location}
            onChange={e => set('location', e.target.value)} />
        </div>
        <div>
          <label className="label">Max Capacity</label>
          <input className="input" type="number" placeholder="e.g. 200" value={form.capacity}
            onChange={e => set('capacity', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Website URL</label>
          <input className="input" placeholder="https://..." value={form.website}
            onChange={e => set('website', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Notes</label>
          <textarea className="input resize-none" rows={2} placeholder="Any notes, contacts, impressions..."
            value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={save} className="btn-primary flex items-center gap-1.5">
          <Check className="w-4 h-4" />
          {initial?.id ? 'Update Venue' : 'Add Venue'}
        </button>
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </div>
  )
}
