import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, ExternalLink, BedDouble, Plane, Utensils, Dumbbell, Sparkles, Baby, Wine, Info, Compass, Phone, Building2, Heart, Globe, Car, Check } from 'lucide-react'

// ─── Travel overview questions ────────────────────────────────────────────────

const QUICK_QUESTIONS = [
  {
    key: 'venueSameAsHotel',
    label: 'Venue same as hotel?',
    description: 'Ceremony and accommodations are at the same property',
    icon: Building2,
  },
  {
    key: 'allInclusive',
    label: 'All-inclusive?',
    description: 'Food, drinks, and activities included in room rate',
    icon: Utensils,
  },
  {
    key: 'adultsOnly',
    label: 'Adults-only hotel?',
    description: 'Property is restricted to guests 18+',
    icon: Wine,
  },
  {
    key: 'international',
    label: 'International destination?',
    description: 'Passport, currency, and travel advisory info applies',
    icon: Globe,
  },
  {
    key: 'airportShuttleIncluded',
    label: 'Airport shuttle provided?',
    description: 'Hotel arranges or includes transfers from the airport',
    icon: Car,
  },
  {
    key: 'roomBlockAvailable',
    label: 'Room block reserved?',
    description: 'Group room block with a special rate has been set up',
    icon: BedDouble,
  },
]

// ─── Section field configs ────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'resortBasics',
    label: 'Hotel Basics',
    icon: Building2,
    defaultOpen: true,
    fields: [
      { key: 'resortName',        label: 'Hotel Name',                         type: 'input',    placeholder: 'e.g. Grand Hyatt Downtown' },
      { key: 'address',           label: 'Address',                            type: 'input',    placeholder: 'Full address' },
      { key: 'mainPhone',         label: 'Main Phone Number',                  type: 'input',    placeholder: 'e.g. +52 998 872 8500' },
      { key: 'website',           label: 'Website URL',                        type: 'input',    placeholder: 'https://...' },
      { key: 'checkIn',           label: 'Check-in Time',                      type: 'input',    placeholder: 'e.g. 3:00 PM' },
      { key: 'checkOut',          label: 'Check-out Time',                     type: 'input',    placeholder: 'e.g. 12:00 PM' },
      { key: 'checkInOutPolicy',  label: 'Early Check-in / Late Check-out Policy', type: 'textarea', placeholder: 'Policy details, fees, how to request...' },
      { key: 'wifiInfo',          label: 'Wi-Fi Info',                         type: 'input',    placeholder: 'e.g. Free throughout hotel, password: ...' },
      { key: 'additionalInfo',    label: 'Additional Info',                    type: 'textarea', placeholder: 'Anything else guests should know about the hotel...' },
    ],
  },
  {
    id: 'gettingThere',
    label: 'Getting There',
    icon: Plane,
    fields: [
      { key: 'nearestAirport',      label: 'Nearest Airport (Name & Code)',    type: 'input',    placeholder: 'e.g. Cancún International Airport (CUN)' },
      { key: 'distanceFromAirport', label: 'Distance / Drive Time from Airport', type: 'input',  placeholder: 'e.g. 45 min, ~25 miles' },
      { key: 'airportTransfer',     label: 'Airport Transfer Details',         type: 'textarea', placeholder: 'Shuttle provider, cost, pickup location, booking instructions...' },
      { key: 'parkingInfo',         label: 'Parking Info and Cost',            type: 'textarea', placeholder: 'On-site parking availability, daily rate, valet...' },
      { key: 'onPropertyTransportation', label: 'On-Property Transportation', type: 'textarea', placeholder: 'Golf carts, trams, walking paths between areas...' },
      { key: 'additionalInfo',      label: 'Additional Info',                  type: 'textarea', placeholder: 'Any other travel tips...' },
    ],
  },
  {
    id: 'roomInfo',
    label: 'Room Info',
    icon: BedDouble,
    fields: [
      { key: 'roomCategories',   label: 'Room Categories in Block',    type: 'textarea', placeholder: 'List room types reserved for the group, categories, view options...' },
      { key: 'inRoomAmenities',  label: 'In-Room Amenities',           type: 'textarea', placeholder: 'Mini bar, coffee maker, jacuzzi, room service menu, safe...' },
      { key: 'bedConfigurations', label: 'Bed Configuration Options',  type: 'textarea', placeholder: 'King, double queen, twin options and availability...' },
      { key: 'smokingPolicy',    label: 'Smoking Policy',              type: 'input',    placeholder: 'e.g. Non-smoking throughout, designated outdoor areas' },
      { key: 'roomService',      label: 'Room Service Info',           type: 'textarea', placeholder: 'Hours, menu highlights, delivery fee...' },
      { key: 'additionalInfo',   label: 'Additional Info',             type: 'textarea', placeholder: 'Anything else about rooms...' },
    ],
  },
  {
    id: 'hotelDining',
    label: 'Hotel Dining',
    icon: Utensils,
    fields: [
      { key: 'restaurants',        label: 'Restaurants (name, cuisine, hours, dress code, reservation required)', type: 'textarea', placeholder: 'List each restaurant on a new line with details...' },
      { key: 'barsLounges',        label: 'Bars and Lounges (name, hours, location)',                            type: 'textarea', placeholder: 'List each bar/lounge...' },
      { key: 'twentyFourHourDining', label: '24-Hour Dining Options',                                           type: 'textarea', placeholder: 'What\'s available, where, how to order...' },
      { key: 'buffetHours',        label: 'Buffet Hours',                                                       type: 'input',    placeholder: 'e.g. Breakfast 7–11 AM, Lunch 12–3 PM, Dinner 6–10 PM' },
      { key: 'specialtyDining',    label: 'Specialty / Upgrade Dining Info',                                    type: 'textarea', placeholder: 'Surcharge restaurants, reservation tips, dress code...' },
      { key: 'additionalInfo',     label: 'Additional Info',                                                    type: 'textarea', placeholder: 'Anything else about dining...' },
    ],
  },
  {
    id: 'amenities',
    label: 'Hotel Amenities & Activities',
    icon: Dumbbell,
    fields: [
      { key: 'pools',                label: 'Pools (location, hours, adults-only or family)',    type: 'textarea', placeholder: 'List each pool with details...' },
      { key: 'beachInfo',            label: 'Beach Info',                                        type: 'textarea', placeholder: 'Chairs, umbrellas, towels provided, hours, reserved section...' },
      { key: 'fitnessCenter',        label: 'Fitness Center (location, hours)',                  type: 'textarea', placeholder: 'Equipment available, classes offered, booking required...' },
      { key: 'includedActivities',   label: 'Included Activities (water sports, classes, etc.)', type: 'textarea', placeholder: 'What\'s included with the stay...' },
      { key: 'paidActivities',       label: 'Paid Activities',                                   type: 'textarea', placeholder: 'Cost, booking instructions, availability...' },
      { key: 'nightlyEntertainment', label: 'Nightly Entertainment',                             type: 'textarea', placeholder: 'Shows, live music, themed nights, schedule...' },
      { key: 'additionalInfo',       label: 'Additional Info',                                   type: 'textarea', placeholder: 'Anything else about amenities...' },
    ],
  },
  {
    id: 'spa',
    label: 'Spa Info',
    icon: Sparkles,
    fields: [
      { key: 'spaName',             label: 'Spa Name and Location',           type: 'input',    placeholder: 'e.g. Miilé Spa, Building C' },
      { key: 'hours',               label: 'Hours of Operation',              type: 'input',    placeholder: 'e.g. Daily 8 AM – 8 PM' },
      { key: 'bookingInstructions', label: 'Booking Instructions',            type: 'textarea', placeholder: 'How to book, how far in advance, cancellation policy...' },
      { key: 'featuredTreatments',  label: 'Featured Treatments or Packages', type: 'textarea', placeholder: 'Signature services, packages, pricing highlights...' },
      { key: 'couplesTreatments',   label: 'Couples Treatments',              type: 'textarea', placeholder: 'Couples massage, romance packages, bridal specials...' },
      { key: 'pricingNotes',        label: 'Pricing Notes or Included Credits', type: 'textarea', placeholder: 'Any included spa credits, group discounts...' },
      { key: 'additionalInfo',      label: 'Additional Info',                 type: 'textarea', placeholder: 'Anything else about the spa...' },
    ],
  },
  {
    id: 'forFamilies',
    label: 'For Families',
    icon: Baby,
    fields: [
      { key: 'kidsClub',      label: 'Kids Club (ages, hours, cost)',       type: 'textarea', placeholder: 'Age range, hours, what\'s included, cost...' },
      { key: 'babysitting',   label: 'Babysitting Services',                type: 'textarea', placeholder: 'Availability, cost, how to arrange...' },
      { key: 'kidsPool',      label: 'Kids\' Pool / Splash Areas',          type: 'textarea', placeholder: 'Location, hours, lifeguard on duty...' },
      { key: 'familyDining',  label: 'Family-Friendly Dining',              type: 'textarea', placeholder: 'Kid-friendly restaurants, high chairs available, kids menus...' },
      { key: 'cribRollaway',  label: 'Crib / Rollaway Availability and Cost', type: 'input',  placeholder: 'e.g. Crib free on request, rollaway $25/night' },
      { key: 'additionalInfo', label: 'Additional Info',                    type: 'textarea', placeholder: 'Anything else for families...' },
    ],
  },
  {
    id: 'adultOnly',
    label: 'Adult-Only Areas',
    icon: Wine,
    fields: [
      { key: 'adultPools',       label: 'Adults-Only Pools',                type: 'textarea', placeholder: 'Name, location, hours, rules...' },
      { key: 'adultRestaurants', label: 'Adults-Only Restaurants',          type: 'textarea', placeholder: 'Name, cuisine, reservation required, hours...' },
      { key: 'adultSections',    label: 'Adults-Only Sections or Lounges',  type: 'textarea', placeholder: 'Location, access requirements, hours...' },
      { key: 'ageRequirement',   label: 'Age Requirement',                  type: 'input',    placeholder: 'e.g. 18+ for all adult-only areas' },
      { key: 'additionalInfo',   label: 'Additional Info',                  type: 'textarea', placeholder: 'Anything else about adult areas...' },
    ],
  },
  {
    id: 'practicalInfo',
    label: 'Practical Info',
    icon: Info,
    fields: [
      { key: 'currency',            label: 'Currency and USD Acceptance',   type: 'textarea', placeholder: 'Local currency, exchange rate, where USD is accepted...' },
      { key: 'tipping',             label: 'Tipping Guidance',              type: 'textarea', placeholder: 'Customary amounts, who to tip, gratuity included notes...' },
      { key: 'weather',             label: 'Weather / What to Pack',        type: 'textarea', placeholder: 'Expected temps, rain season, recommended clothing...' },
      { key: 'electricalOutlets',   label: 'Electrical Outlets and Adapters', type: 'input',  placeholder: 'e.g. 120V Type A/B, same as US — no adapter needed' },
      { key: 'language',            label: 'Language Spoken',               type: 'input',    placeholder: 'e.g. Spanish; English widely spoken at hotel' },
      { key: 'passportRequirements', label: 'Passport Requirements',        type: 'textarea', placeholder: 'Entry requirements, visa info, tourist card details...' },
      { key: 'travelAdvisory',      label: 'Travel Advisory Notes',         type: 'textarea', placeholder: 'Current advisories, safety tips, areas to avoid...' },
      { key: 'additionalInfo',      label: 'Additional Info',               type: 'textarea', placeholder: 'Anything else guests should know practically...' },
    ],
  },
  {
    id: 'excursions',
    label: 'Excursions & Off-Site',
    icon: Compass,
    fields: [
      { key: 'recommendedExcursions', label: 'Recommended Excursions (name, description, approx. cost)', type: 'textarea', placeholder: 'List each excursion on a new line...' },
      { key: 'bookingInstructions',   label: 'Booking Instructions (tour desk, concierge, third party)', type: 'textarea', placeholder: 'Where to book, how far in advance, cancellation policy...' },
      { key: 'nearestTown',           label: 'Nearest Town / Shopping Area',                            type: 'textarea', placeholder: 'Distance, transportation options, what to find there...' },
      { key: 'transportation',        label: 'Transportation to Off-Site',                              type: 'textarea', placeholder: 'Taxi, shuttle, rental car, rideshare availability and cost...' },
      { key: 'additionalInfo',        label: 'Additional Info',                                         type: 'textarea', placeholder: 'Any other off-site tips...' },
    ],
  },
  {
    id: 'emergency',
    label: 'Emergency Contact Info',
    icon: Phone,
    fields: [
      { key: 'frontDesk',           label: 'Front Desk Number',                              type: 'input',    placeholder: 'e.g. Dial 0 from room, or +52 998 872 8500' },
      { key: 'onSiteMedical',       label: 'On-Site Medical / Clinic',                       type: 'input',    placeholder: 'Location and number' },
      { key: 'nearestHospital',     label: 'Nearest Hospital',                               type: 'input',    placeholder: 'Name, address, distance' },
      { key: 'localEmergency',      label: 'Local Emergency Number (equivalent of 911)',     type: 'input',    placeholder: 'e.g. 911 (Mexico), 999 (Jamaica)' },
      { key: 'weddingCoordinator',  label: 'Wedding Coordinator Contact',                    type: 'input',    placeholder: 'Name and phone number' },
      { key: 'pointPersonContact',  label: 'Your Contact Info (or designated point person)', type: 'input',    placeholder: 'Name and phone number' },
      { key: 'additionalInfo',      label: 'Additional Info',                                type: 'textarea', placeholder: 'Embassy contacts, travel insurance hotline, any other emergency info...' },
    ],
  },
]

// ─── Generic section content ──────────────────────────────────────────────────

function SectionFields({ fields, data, onChange }) {
  return (
    <div className="mt-4 grid sm:grid-cols-2 gap-3">
      {fields.map(field => (
        <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
          <label className="label">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              className="input w-full resize-none min-h-20"
              placeholder={field.placeholder}
              value={data[field.key] || ''}
              onChange={e => onChange(field.key, e.target.value)}
            />
          ) : (
            <input
              className="input"
              placeholder={field.placeholder}
              value={data[field.key] || ''}
              onChange={e => onChange(field.key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function sectionHasContent(data) {
  if (!data || typeof data !== 'object') return false
  return Object.values(data).some(v => v && String(v).trim().length > 0)
}

function SectionAccordion({ section, data, onChange, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const Icon = section.icon
  const filled = sectionHasContent(data)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-forest-400 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-plum-200" />
          </div>
          <span className="font-sans font-semibold text-plum-50 text-sm">{section.label}</span>
          {!open && filled && <span className="w-1.5 h-1.5 rounded-full bg-plum-300 shrink-0" />}
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-moon-300 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-moon-300 shrink-0" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-plum-800/60">
          {children}
          {!children && (
            <SectionFields fields={section.fields} data={data} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TravelView({ travelInfo, setTravelInfo, decision, venues }) {
  const chosenVenue = venues.find(v => v.id === decision?.venueId)
  const venueSameAsHotel = travelInfo.venueSameAsHotel || false

  function toggleField(key) {
    setTravelInfo(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function updateSection(sectionId, key, value) {
    setTravelInfo(prev => ({
      ...prev,
      [sectionId]: { ...(prev[sectionId] || {}), [key]: value },
    }))
  }

  const resortSection = SECTIONS[0]
  const otherSections = SECTIONS.slice(1)

  return (
    <div className="space-y-3">
      {/* Venue header */}
      {chosenVenue && (
        <div className="card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blush-600/20 border border-blush-400/40 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 text-blush-200" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-xs text-blush-300 font-semibold uppercase tracking-wider">Chosen Venue</p>
            <p className="font-serif text-white font-semibold">{chosenVenue.name}</p>
            {chosenVenue.location && <p className="text-sm text-moon-300 font-sans">{chosenVenue.location}</p>}
          </div>
        </div>
      )}

      {/* Travel overview quick questions */}
      <div className="card p-6">
        <p className="font-sans font-semibold text-plum-50 text-sm uppercase tracking-wider mb-4">Travel Overview</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_QUESTIONS.map(q => {
            const Icon = q.icon
            const active = travelInfo[q.key] || false
            return (
              <button
                key={q.key}
                onClick={() => toggleField(q.key)}
                className={`flex flex-col items-start gap-2.5 p-3 rounded-xl border text-left transition-all
                  ${active
                    ? 'bg-plum-700/30 border-plum-400/60'
                    : 'bg-forest-600 border-plum-700/50 hover:border-plum-500'}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? 'bg-plum-500/40' : 'bg-forest-500'}`}>
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-plum-200' : 'text-moon-400'}`} />
                  </div>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-plum-400 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-sans font-semibold leading-tight ${active ? 'text-plum-50' : 'text-moon-300'}`}>{q.label}</p>
                  <p className={`text-xs font-sans mt-0.5 leading-tight ${active ? 'text-plum-300' : 'text-moon-400'}`}>{q.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Hotel Basics — shows venue info card when venue same as hotel is on */}
      <SectionAccordion
        section={resortSection}
        data={travelInfo.resortBasics || {}}
        defaultOpen
      >
        <div className="mt-4 space-y-4">
          {venueSameAsHotel && chosenVenue && (
            <div className="flex items-start gap-3 p-3 bg-blush-600/10 rounded-xl border border-blush-400/30">
              <Heart className="w-4 h-4 text-blush-200 fill-current shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-serif text-white font-semibold">{chosenVenue.name}</p>
                {chosenVenue.location && <p className="text-xs text-moon-300 font-sans mt-0.5">{chosenVenue.location}</p>}
                {chosenVenue.website && (
                  <a href={chosenVenue.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-moon-300 hover:text-white font-sans mt-1 transition-colors w-fit">
                    <ExternalLink className="w-3 h-3" /> Website
                  </a>
                )}
              </div>
            </div>
          )}
          <SectionFields
            fields={resortSection.fields}
            data={travelInfo.resortBasics || {}}
            onChange={(key, value) => updateSection('resortBasics', key, value)}
          />
        </div>
      </SectionAccordion>

      {/* All other sections */}
      {otherSections.map(section => (
        <SectionAccordion
          key={section.id}
          section={section}
          data={travelInfo[section.id] || {}}
          onChange={(key, value) => updateSection(section.id, key, value)}
        />
      ))}
    </div>
  )
}
