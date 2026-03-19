import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, Users, Globe, Pencil, Trash2, Plus, Check, Star, FileText, ExternalLink, Image } from 'lucide-react'
import { formatCurrency } from '../lib/data'
import PackageCard from './PackageCard'
import AddOnRow from './AddOnRow'
import VenueForm from './VenueForm'

export default function VenueCard({ venue, onUpdate, onDelete, isHighlighted }) {
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [showAddPackage, setShowAddPackage] = useState(false)
  const [showAddAddon, setShowAddAddon] = useState(false)
  const [newPkg, setNewPkg] = useState({ name: '', price: '', guestCount: '', hours: '', extraGuestPrice: '', includes: [''] })
  const [newAddon, setNewAddon] = useState({ name: '', price: '', description: '', perPerson: false })

  const lowestPrice = venue.packages.length
    ? Math.min(...venue.packages.map(p => p.price))
    : null

  function addPackage() {
    if (!newPkg.name || !newPkg.price) return
    const pkg = {
      ...newPkg,
      id: `pkg-${Date.now()}`,
      price: parseFloat(newPkg.price) || 0,
      guestCount: parseInt(newPkg.guestCount) || 0,
      hours: parseFloat(newPkg.hours) || 0,
      extraGuestPrice: parseFloat(newPkg.extraGuestPrice) || 0,
      includes: newPkg.includes.filter(Boolean),
    }
    onUpdate({ ...venue, packages: [...venue.packages, pkg] })
    setNewPkg({ name: '', price: '', guestCount: '', hours: '', extraGuestPrice: '', includes: [''] })
    setShowAddPackage(false)
  }

  function updatePackage(pkg) {
    onUpdate({ ...venue, packages: venue.packages.map(p => p.id === pkg.id ? pkg : p) })
  }

  function deletePackage(pkgId) {
    onUpdate({ ...venue, packages: venue.packages.filter(p => p.id !== pkgId) })
  }

  function addAddon() {
    if (!newAddon.name || !newAddon.price) return
    const ao = { ...newAddon, id: `ao-${Date.now()}`, price: parseFloat(newAddon.price) || 0, perPerson: !!newAddon.perPerson }
    onUpdate({ ...venue, addons: [...(venue.addons || []), ao] })
    setNewAddon({ name: '', price: '', description: '', perPerson: false })
    setShowAddAddon(false)
  }

  function updateAddon(ao) {
    onUpdate({ ...venue, addons: venue.addons.map(a => a.id === ao.id ? ao : a) })
  }

  function deleteAddon(aoId) {
    onUpdate({ ...venue, addons: venue.addons.filter(a => a.id !== aoId) })
  }

  if (editing) {
    return (
      <VenueForm
        initial={venue}
        onSave={(updated) => { onUpdate(updated); setEditing(false) }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className={`card transition-all duration-300 relative group ${isHighlighted ? 'ring-2 ring-plum-400 shadow-lg' : ''}`}>
      {/* Cover Image */}
      {venue.coverImage && (
        <div className="h-48 overflow-hidden rounded-t-2xl bg-plum-50">
          <img
            src={venue.coverImage}
            alt={venue.name}
            className="w-full h-full object-cover"
            onError={e => e.target.parentElement.style.display = 'none'}
          />
        </div>
      )}

      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif text-xl font-semibold text-plum-800">{venue.name}</h2>
              {isHighlighted && (
                <span className="inline-flex items-center gap-1 bg-plum-100 text-plum-600 text-xs font-sans font-medium px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" /> Top Pick
                </span>
              )}
            </div>
            <div className="flex items-center flex-wrap gap-3 mt-1.5">
              {venue.location && (
                <span className="flex items-center gap-1 text-sm text-plum-400 font-sans">
                  <MapPin className="w-3.5 h-3.5" /> {venue.location}
                </span>
              )}
              {venue.capacity > 0 && (
                <span className="flex items-center gap-1 text-sm text-plum-400 font-sans">
                  <Users className="w-3.5 h-3.5" /> Up to {venue.capacity} guests
                </span>
              )}
              {venue.website && (
                <a href={venue.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-plum-400 hover:text-plum-600 font-sans transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Website
                </a>
              )}
            </div>
            {venue.notes && (
              <p className="mt-2 text-sm text-plum-500 font-sans italic">{venue.notes}</p>
            )}
          </div>
          {/* Expand/collapse button — always visible */}
          <button onClick={() => setExpanded(!expanded)} className="p-2 rounded-full hover:bg-plum-50 text-plum-400 transition-colors shrink-0">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Edit/Delete — absolutely positioned on hover so they never affect layout */}
      <div className="absolute top-4 right-12 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-lg px-1 py-0.5 shadow-sm z-10">
        <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-plum-50 text-plum-400 hover:text-plum-600 transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => { if (confirm(`Remove "${venue.name}"? This cannot be undone.`)) onDelete(venue.id) }}
          className="p-1.5 rounded-lg hover:bg-red-50 text-plum-400 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {expanded && (
        <div className="px-6 pb-6 space-y-6">
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-plum-100 to-transparent" />

          {/* Packages */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-semibold text-plum-700 text-sm uppercase tracking-wider">Packages</h3>
              <button onClick={() => setShowAddPackage(!showAddPackage)} className="btn-ghost text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Package
              </button>
            </div>

            <div className="space-y-2">
              {venue.packages.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} onUpdate={updatePackage} onDelete={deletePackage} />
              ))}
            </div>

            {showAddPackage && (
              <div className="mt-4 p-4 bg-plum-50 rounded-xl border border-plum-100 space-y-3">
                <p className="font-sans font-semibold text-plum-700 text-sm">New Package</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label">Package Name *</label>
                    <input className="input" placeholder="e.g. Garden Ceremony" value={newPkg.name}
                      onChange={e => setNewPkg(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Price *</label>
                    <input className="input" placeholder="e.g. 4500" type="number" value={newPkg.price}
                      onChange={e => setNewPkg(p => ({ ...p, price: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Max Guests</label>
                    <input className="input" placeholder="e.g. 150" type="number" value={newPkg.guestCount}
                      onChange={e => setNewPkg(p => ({ ...p, guestCount: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Hours Included</label>
                    <input className="input" placeholder="e.g. 6" type="number" value={newPkg.hours}
                      onChange={e => setNewPkg(p => ({ ...p, hours: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Extra Guest Price ($ / person)</label>
                    <input className="input" placeholder="e.g. 51" type="number" value={newPkg.extraGuestPrice}
                      onChange={e => setNewPkg(p => ({ ...p, extraGuestPrice: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="label">What's Included</label>
                  {newPkg.includes.map((item, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input className="input" placeholder={`Item ${i + 1}`} value={item}
                        onChange={e => setNewPkg(p => ({ ...p, includes: p.includes.map((v, j) => j === i ? e.target.value : v) }))} />
                      {i === newPkg.includes.length - 1 && (
                        <button onClick={() => setNewPkg(p => ({ ...p, includes: [...p.includes, ''] }))}
                          className="shrink-0 p-2 rounded-lg bg-plum-100 text-plum-600 hover:bg-plum-200 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={addPackage} className="btn-primary flex items-center gap-1">
                    <Check className="w-4 h-4" /> Save Package
                  </button>
                  <button onClick={() => setShowAddPackage(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-semibold text-plum-700 text-sm uppercase tracking-wider">Add-ons & Extensions</h3>
              <button onClick={() => setShowAddAddon(!showAddAddon)} className="btn-ghost text-xs flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Option
              </button>
            </div>

            {(venue.addons || []).length > 0 ? (
              <div className="border border-plum-100 rounded-xl overflow-hidden divide-y divide-plum-50">
                {(venue.addons || []).map(ao => (
                  <AddOnRow key={ao.id} addon={ao} onUpdate={updateAddon} onDelete={deleteAddon} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-plum-300 font-sans italic">No add-ons added yet.</p>
            )}

            {showAddAddon && (
              <div className="mt-3 p-4 bg-sage-100 rounded-xl border border-sage-200 space-y-3">
                <p className="font-sans font-semibold text-plum-700 text-sm">New Add-on</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="label">Name *</label>
                    <input className="input" placeholder="e.g. Valet Parking" value={newAddon.name}
                      onChange={e => setNewAddon(a => ({ ...a, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Price *</label>
                    <input className="input" placeholder="e.g. 600" type="number" value={newAddon.price}
                      onChange={e => setNewAddon(a => ({ ...a, price: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Description</label>
                    <input className="input" placeholder="Brief details" value={newAddon.description}
                      onChange={e => setNewAddon(a => ({ ...a, description: e.target.value }))} />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer w-fit">
                  <div
                    onClick={() => setNewAddon(a => ({ ...a, perPerson: !a.perPerson }))}
                    className={`w-8 h-4 rounded-full transition-colors relative ${newAddon.perPerson ? 'bg-plum-400' : 'bg-plum-200'}`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${newAddon.perPerson ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="text-xs font-sans text-plum-600">Charge per extra guest</span>
                </label>
                <div className="flex gap-2">
                  <button onClick={addAddon} className="btn-primary flex items-center gap-1">
                    <Check className="w-4 h-4" /> Save Add-on
                  </button>
                  <button onClick={() => setShowAddAddon(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Documents */}
          {(venue.documents || []).length > 0 && (
            <div>
              <h3 className="font-sans font-semibold text-plum-700 text-sm uppercase tracking-wider mb-3">Documents & PDFs</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {(venue.documents || []).map(doc => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-parchment rounded-xl border border-plum-100 hover:border-plum-300 hover:bg-plum-50 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-plum-100 flex items-center justify-center shrink-0 group-hover:bg-plum-200 transition-colors">
                      <FileText className="w-4 h-4 text-plum-500" />
                    </div>
                    <span className="font-sans text-sm text-plum-700 flex-1 truncate">{doc.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-plum-300 group-hover:text-plum-500 shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
