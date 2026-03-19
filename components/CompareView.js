import { Plus, Trash2, Check, ChevronDown, GitCompare } from 'lucide-react'
import { formatCurrency } from '../lib/data'

function generateComparisonId() {
  return `cmp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function PackageSelect({ label, allPackages, value, onChange, exclude }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-sans font-medium text-plum-400 uppercase tracking-wider mb-1.5">{label}</p>
      <div className="relative">
        <select
          className="input appearance-none pr-8 cursor-pointer text-sm"
          value={value}
          onChange={e => onChange(e.target.value)}
        >
          <option value="">— Select a package —</option>
          {allPackages.map(({ venue, pkg }) => (
            <option key={pkg.id} value={pkg.id} disabled={pkg.id === exclude}>
              {venue.name} · {pkg.name} ({formatCurrency(pkg.price)})
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-plum-300 pointer-events-none" />
      </div>
    </div>
  )
}

function ComparisonCard({ comparison, allPackages, onUpdate, onDelete, index }) {
  const leftEntry = allPackages.find(e => e.pkg.id === comparison.leftId)
  const rightEntry = allPackages.find(e => e.pkg.id === comparison.rightId)
  const leftPkg = leftEntry?.pkg
  const rightPkg = rightEntry?.pkg
  const leftVenue = leftEntry?.venue
  const rightVenue = rightEntry?.venue

  return (
    <div className="card overflow-hidden">
      {/* Selectors */}
      <div className="p-5 bg-parchment border-b border-plum-100">
        <div className="flex items-center justify-between mb-3">
          <span className="font-serif text-plum-600 text-sm">Comparison {index + 1}</span>
          <button onClick={() => onDelete(comparison.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-plum-300 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <PackageSelect label="Package A" allPackages={allPackages}
            value={comparison.leftId}
            onChange={val => onUpdate(comparison.id, 'leftId', val)}
            exclude={comparison.rightId} />
          <div className="shrink-0 mt-5">
            <GitCompare className="w-4 h-4 text-plum-300" />
          </div>
          <PackageSelect label="Package B" allPackages={allPackages}
            value={comparison.rightId}
            onChange={val => onUpdate(comparison.id, 'rightId', val)}
            exclude={comparison.leftId} />
        </div>
      </div>

      {leftPkg && rightPkg ? (
        <div>
          {/* Price diff banner */}
          <div className="px-5 py-3 bg-plum-50 border-b border-plum-100 text-sm font-sans">
            {leftPkg.price === rightPkg.price ? (
              <span className="text-plum-400">Same price</span>
            ) : (
              <span className="font-semibold text-plum-600">
                {leftPkg.price < rightPkg.price ? leftPkg.name : rightPkg.name} is {formatCurrency(Math.abs(leftPkg.price - rightPkg.price))} less
              </span>
            )}
          </div>

          {/* Mobile: stacked cards */}
          <div className="sm:hidden divide-y divide-plum-50">
            {[{ pkg: leftPkg, venue: leftVenue, label: 'Package A' }, { pkg: rightPkg, venue: rightVenue, label: 'Package B' }].map(({ pkg, venue, label }) => (
              <div key={pkg.id} className="p-5 space-y-3">
                <div>
                  <p className="text-xs font-sans text-plum-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="font-serif font-semibold text-plum-800 text-lg">{pkg.name}</p>
                  <p className="text-xs text-plum-400 font-sans">{venue.name}</p>
                  <p className="font-serif text-2xl font-bold text-plum-600 mt-1">{formatCurrency(pkg.price)}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-plum-400 font-sans mb-0.5">Location</p>
                    <p className="text-plum-700">{venue.location || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-plum-400 font-sans mb-0.5">Guests</p>
                    <p className="text-plum-700">
                      {pkg.guestCount > 0 ? `Up to ${pkg.guestCount}` : '—'}
                      {pkg.extraGuestPrice > 0 && <span className="block text-xs text-plum-400">+{formatCurrency(pkg.extraGuestPrice)}/extra</span>}
                    </p>
                  </div>
                  {pkg.hours > 0 && (
                    <div>
                      <p className="text-xs text-plum-400 font-sans mb-0.5">Hours</p>
                      <p className="text-plum-700">{pkg.hours}h</p>
                    </div>
                  )}
                </div>
                {(pkg.includes || []).length > 0 && (
                  <div>
                    <p className="text-xs text-plum-400 font-sans mb-2">Includes</p>
                    <ul className="space-y-1.5">
                      {(pkg.includes || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-plum-600">
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-sage-200 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-sage-500" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: side-by-side table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm font-sans table-fixed">
              <colgroup>
                <col style={{ width: '120px' }} />
                <col style={{ width: '50%' }} />
                <col style={{ width: '50%' }} />
              </colgroup>
              <thead>
                <tr className="border-b border-plum-100">
                  <th className="text-left px-5 py-3 text-plum-400 font-medium text-xs uppercase tracking-wider">Detail</th>
                  <th className="text-left px-5 py-3">
                    <p className="font-serif font-semibold text-plum-800 text-base">{leftPkg.name}</p>
                    <p className="text-xs text-plum-400 font-normal">{leftVenue.name}</p>
                    <p className="font-serif text-xl font-bold text-plum-600 mt-0.5">{formatCurrency(leftPkg.price)}</p>
                  </th>
                  <th className="text-left px-5 py-3">
                    <p className="font-serif font-semibold text-plum-800 text-base">{rightPkg.name}</p>
                    <p className="text-xs text-plum-400 font-normal">{rightVenue.name}</p>
                    <p className="font-serif text-xl font-bold text-plum-600 mt-0.5">{formatCurrency(rightPkg.price)}</p>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-plum-50">
                <tr>
                  <td className="px-5 py-3 text-plum-400">Venue</td>
                  <td className="px-5 py-3 text-plum-700">{leftVenue.name}</td>
                  <td className="px-5 py-3 text-plum-700">{rightVenue.name}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-plum-400">Location</td>
                  <td className="px-5 py-3 text-plum-700">{leftVenue.location || '—'}</td>
                  <td className="px-5 py-3 text-plum-700">{rightVenue.location || '—'}</td>
                </tr>
                <tr>
                  <td className="px-5 py-3 text-plum-400">Guests</td>
                  <td className="px-5 py-3 text-plum-700">
                    {leftPkg.guestCount > 0 ? `Up to ${leftPkg.guestCount}` : '—'}
                    {leftPkg.extraGuestPrice > 0 && <span className="text-xs text-plum-400 ml-1">(+{formatCurrency(leftPkg.extraGuestPrice)}/extra)</span>}
                  </td>
                  <td className="px-5 py-3 text-plum-700">
                    {rightPkg.guestCount > 0 ? `Up to ${rightPkg.guestCount}` : '—'}
                    {rightPkg.extraGuestPrice > 0 && <span className="text-xs text-plum-400 ml-1">(+{formatCurrency(rightPkg.extraGuestPrice)}/extra)</span>}
                  </td>
                </tr>
                {(leftPkg.hours > 0 || rightPkg.hours > 0) && (
                  <tr>
                    <td className="px-5 py-3 text-plum-400">Hours</td>
                    <td className="px-5 py-3 text-plum-700">{leftPkg.hours > 0 ? `${leftPkg.hours}h` : '—'}</td>
                    <td className="px-5 py-3 text-plum-700">{rightPkg.hours > 0 ? `${rightPkg.hours}h` : '—'}</td>
                  </tr>
                )}
                <tr>
                  <td className="px-5 py-3 text-plum-400 align-top">Includes</td>
                  <td className="px-5 py-3 align-top">
                    <ul className="space-y-1.5">
                      {(leftPkg.includes || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-plum-600">
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-sage-200 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-sage-500" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-3 align-top">
                    <ul className="space-y-1.5">
                      {(rightPkg.includes || []).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-plum-600">
                          <span className="mt-0.5 w-4 h-4 rounded-full bg-sage-200 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-sage-500" />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="px-5 py-8 text-center text-plum-300 font-sans text-sm">
          Select two packages above to see the comparison
        </div>
      )}
    </div>
  )
}

export default function CompareView({ venues, comparisons, setComparisons }) {

  const allPackages = venues.flatMap(venue =>
    venue.packages.map(pkg => ({ venue, pkg }))
  )

  if (allPackages.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="font-serif text-plum-400 text-lg">Add venues and packages to start comparing.</p>
      </div>
    )
  }

  function addComparison() {
    setComparisons(prev => [...prev, { id: generateComparisonId(), leftId: '', rightId: '' }])
  }

  function deleteComparison(id) {
    setComparisons(prev =>
      prev.length === 1
        ? [{ id: generateComparisonId(), leftId: '', rightId: '' }]
        : prev.filter(c => c.id !== id)
    )
  }

  function updateComparison(id, field, value) {
    setComparisons(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  return (
    <div className="space-y-5">
      {comparisons.map((comparison, index) => (
        <ComparisonCard
          key={comparison.id}
          comparison={comparison}
          allPackages={allPackages}
          onUpdate={updateComparison}
          onDelete={deleteComparison}
          index={index}
        />
      ))}
      <button
        onClick={addComparison}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-plum-200 text-plum-400 hover:border-plum-300 hover:text-plum-600 transition-all font-sans text-sm flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" /> Add another comparison
      </button>
    </div>
  )
}
