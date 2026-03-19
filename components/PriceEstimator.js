import { useEffect, useMemo } from 'react'
import { Calculator, Check, ChevronDown } from 'lucide-react'
import { formatCurrency } from '../lib/data'

export default function PriceEstimator({ venues, globalGuestCount, estimate, setEstimate }) {
  const { selectedVenue, selectedPackage, selectedAddons, selectedPerPersonAddons, guestCount, overrideGuestPrice, notes } = estimate

  function set(patch) {
    setEstimate(prev => ({ ...prev, ...patch }))
  }

  const setSelectedVenue = val => set({ selectedVenue: val })
  const setSelectedPackage = val => set({ selectedPackage: val })
  const setSelectedAddons = fn => setEstimate(prev => ({ ...prev, selectedAddons: typeof fn === 'function' ? fn(prev.selectedAddons) : fn }))
  const setSelectedPerPersonAddons = fn => setEstimate(prev => ({ ...prev, selectedPerPersonAddons: typeof fn === 'function' ? fn(prev.selectedPerPersonAddons) : fn }))
  const setGuestCount = val => set({ guestCount: val })
  const setOverrideGuestPrice = val => set({ overrideGuestPrice: val })
  const setNotes = val => set({ notes: val })

  // Pre-fill guest count from the global stat whenever it changes
  useEffect(() => {
    if (globalGuestCount && !guestCount) {
      setGuestCount(String(globalGuestCount))
    }
  }, [globalGuestCount])

  const venue = venues.find(v => v.id === selectedVenue)
  const pkg = venue?.packages.find(p => p.id === selectedPackage)

  const flatAddons = useMemo(() => (venue?.addons || []).filter(a => !a.perPerson), [venue])
  const perPersonAddons = useMemo(() => {
    const all = (venue?.addons || []).filter(a => a.perPerson)
    // Exclude add-ons whose price matches the package's own extraGuestPrice
    // to prevent double-counting the base entry fee
    if (pkg?.extraGuestPrice > 0) {
      return all.filter(a => a.price !== pkg.extraGuestPrice)
    }
    return all
  }, [venue, pkg])

  const extraGuests = useMemo(() => {
    if (!pkg || !guestCount || !pkg.guestCount) return 0
    const over = parseInt(guestCount) - pkg.guestCount
    return over > 0 ? over : 0
  }, [pkg, guestCount])

  const extraGuestCost = useMemo(() => {
    const pricePerPerson = overrideGuestPrice !== '' ? (parseFloat(overrideGuestPrice) || 0) : 0
    if (!pricePerPerson || extraGuests === 0) return 0
    return extraGuests * pricePerPerson
  }, [pkg, extraGuests, overrideGuestPrice])

  const perPersonAddonCost = useMemo(() => {
    if (extraGuests === 0) return 0
    return selectedPerPersonAddons.reduce((sum, aoId) => {
      const ao = perPersonAddons.find(a => a.id === aoId)
      return ao ? sum + ao.price * extraGuests : sum
    }, 0)
  }, [selectedPerPersonAddons, perPersonAddons, extraGuests])

  const subtotal = useMemo(() => {
    let total = pkg?.price || 0
    total += extraGuestCost
    total += perPersonAddonCost
    selectedAddons.forEach(aoId => {
      const ao = flatAddons.find(a => a.id === aoId)
      if (ao) total += ao.price
    })
    return total
  }, [pkg, extraGuestCost, perPersonAddonCost, selectedAddons, flatAddons])

  function toggleAddon(id) {
    setSelectedAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  function togglePerPersonAddon(id) {
    setSelectedPerPersonAddons(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  function reset() {
    setEstimate({
      selectedVenue: '',
      selectedPackage: '',
      selectedAddons: [],
      selectedPerPersonAddons: [],
      guestCount: '',
      overrideGuestPrice: '',
      notes: '',
    })
  }

  return (
    <div className="card overflow-visible">
      <div className="p-6 border-b border-plum-100">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-plum-400" />
          <h2 className="font-serif text-xl font-semibold text-plum-800">Price Estimator</h2>
        </div>
        <p className="text-sm text-plum-400 font-sans mt-1">Build out an estimate for any venue + package combination</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Venue Select */}
        <div>
          <label className="label">Select Venue</label>
          <div className="relative">
            <select className="input appearance-none pr-10 cursor-pointer"
              value={selectedVenue}
              onChange={e => { setSelectedVenue(e.target.value); setSelectedPackage(''); setSelectedAddons([]); setSelectedPerPersonAddons([]); setOverrideGuestPrice('') }}>
              <option value="">— Choose a venue —</option>
              {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-plum-300 pointer-events-none" />
          </div>
        </div>

        {/* Package Select */}
        {venue && (
          <div>
            <label className="label">Select Package</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {venue.packages.map(p => (
                <button key={p.id}
                  onClick={() => {
                    setSelectedPackage(p.id)
                    setOverrideGuestPrice('')
                    setSelectedPerPersonAddons([])
                  }}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    selectedPackage === p.id
                      ? 'border-plum-400 bg-plum-50'
                      : 'border-plum-100 hover:border-plum-200 bg-white'
                  }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-plum-800">{p.name}</span>
                    {selectedPackage === p.id && <Check className="w-4 h-4 text-plum-500" />}
                  </div>
                  <p className="font-serif text-xl font-bold text-plum-600 mt-1">{formatCurrency(p.price)}</p>
                  {p.guestCount > 0 && (
                    <p className="text-xs text-plum-400 font-sans mt-1">Up to {p.guestCount} guests{p.hours > 0 ? ` · ${p.hours}h` : ''}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Flat Add-ons (non per-person) */}
        {venue && flatAddons.length > 0 && (
          <div>
            <label className="label">Add-ons & Extensions</label>
            <div className="space-y-2">
              {flatAddons.map(ao => (
                <button key={ao.id}
                  onClick={() => toggleAddon(ao.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    selectedAddons.includes(ao.id)
                      ? 'border-sage-400 bg-sage-100'
                      : 'border-plum-100 hover:border-plum-200 bg-white'
                  }`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    selectedAddons.includes(ao.id) ? 'border-sage-400 bg-sage-400' : 'border-plum-200'
                  }`}>
                    {selectedAddons.includes(ao.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-sans font-medium text-sm text-plum-700">{ao.name}</span>
                    {ao.description && (
                      <span className="ml-1.5 text-xs text-plum-400">{ao.description}</span>
                    )}
                  </div>
                  <span className="font-sans font-semibold text-plum-600 text-sm">{formatCurrency(ao.price)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Guest Count */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Estimated Guest Count</label>
            <input className="input" type="number" placeholder="e.g. 120"
              value={guestCount} onChange={e => setGuestCount(e.target.value)} />
            {pkg && guestCount && pkg.guestCount > 0 && (
              <p className="text-xs text-plum-400 mt-1 font-sans">
                Package includes up to {pkg.guestCount} guests
              </p>
            )}
          </div>
          <div>
            <label className="label">Notes</label>
            <input className="input" placeholder="Any questions or reminders..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        </div>

        {/* Extra guest box — only shown when over the limit */}
        {pkg && extraGuests > 0 && (
          <div className="bg-blush-50 border border-blush-200 rounded-xl p-4 space-y-4">
            <p className="text-sm font-sans font-semibold text-plum-700">
              {extraGuests} {extraGuests === 1 ? 'guest' : 'guests'} over the {pkg.guestCount} included
            </p>

            {/* Base per-person entry cost */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-plum-500 font-sans whitespace-nowrap">$ per person</span>
              <input
                className="input w-32"
                type="number"
                placeholder={pkg.extraGuestPrice > 0 ? String(pkg.extraGuestPrice) : 'e.g. 51'}
                value={overrideGuestPrice}
                onChange={e => setOverrideGuestPrice(e.target.value)}
              />
              {extraGuestCost > 0 && (
                <span className="text-sm font-sans text-plum-500">
                  {extraGuests} × {formatCurrency(parseFloat(overrideGuestPrice) || 0)} = <span className="font-semibold text-plum-700">{formatCurrency(extraGuestCost)}</span>
                </span>
              )}
            </div>

            {/* Per-person add-ons as checkboxes */}
            {perPersonAddons.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-blush-200">
                <p className="text-xs font-sans text-plum-400 pt-1">Per-person add-ons</p>
                {perPersonAddons.map(ao => {
                  const checked = selectedPerPersonAddons.includes(ao.id)
                  const lineCost = ao.price * extraGuests
                  return (
                    <button
                      key={ao.id}
                      onClick={() => togglePerPersonAddon(ao.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-2 transition-all text-left ${
                        checked ? 'border-plum-300 bg-plum-50' : 'border-blush-200 bg-white hover:border-plum-200'
                      }`}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        checked ? 'border-plum-400 bg-plum-400' : 'border-plum-200'
                      }`}>
                        {checked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className="font-sans text-sm text-plum-700 flex-1">{ao.name}</span>
                      <div className="text-right shrink-0">
                        <span className="font-sans font-semibold text-sm text-plum-600">{formatCurrency(lineCost)}</span>
                        <span className="text-xs text-plum-400 font-sans ml-1">({extraGuests} × {formatCurrency(ao.price)})</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Total */}
        {pkg && (
          <div className="bg-gradient-to-br from-plum-600 to-plum-800 rounded-2xl p-6 text-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm font-sans text-plum-200">
                <span>Package: {pkg.name}</span>
                <span>{formatCurrency(pkg.price)}</span>
              </div>
              {selectedAddons.map(aoId => {
                const ao = flatAddons.find(a => a.id === aoId)
                if (!ao) return null
                return (
                  <div key={aoId} className="flex justify-between text-sm font-sans text-plum-200">
                    <span>+ {ao.name}</span>
                    <span>{formatCurrency(ao.price)}</span>
                  </div>
                )
              })}
              {extraGuestCost > 0 && (
                <div className="flex justify-between text-sm font-sans text-plum-200">
                  <span>+ {extraGuests} extra guests × {formatCurrency(parseFloat(overrideGuestPrice) || 0)}</span>
                  <span>{formatCurrency(extraGuestCost)}</span>
                </div>
              )}
              {selectedPerPersonAddons.map(aoId => {
                const ao = perPersonAddons.find(a => a.id === aoId)
                if (!ao) return null
                return (
                  <div key={aoId} className="flex justify-between text-sm font-sans text-plum-200">
                    <span>+ {ao.name} (× {extraGuests})</span>
                    <span>{formatCurrency(ao.price * extraGuests)}</span>
                  </div>
                )
              })}
              <div className="h-px bg-plum-500 my-2" />
              <div className="flex justify-between items-center">
                <span className="font-serif text-lg text-white">Estimated Total</span>
                <span className="font-serif text-3xl font-bold text-white">{formatCurrency(subtotal)}</span>
              </div>
              {notes && <p className="text-xs text-plum-300 font-sans mt-2 italic">{notes}</p>}
            </div>
            <button onClick={reset} className="w-full text-center text-xs text-plum-300 hover:text-white transition-colors font-sans">
              Reset estimator
            </button>
          </div>
        )}

        {!pkg && !selectedVenue && (
          <div className="text-center py-6 text-plum-300 font-sans text-sm">
            Select a venue and package to see your estimate
          </div>
        )}
      </div>
    </div>
  )
}

