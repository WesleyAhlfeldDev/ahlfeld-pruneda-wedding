import { useState } from 'react'
import { ChevronDown, ChevronUp, MapPin, ExternalLink, BedDouble, Plane, Utensils, Dumbbell, Sparkles, Baby, Wine, Info, Compass, Phone, Building2, Heart, Globe, Car, Check, Plus, X, Pencil, Trash2 } from 'lucide-react'

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
      { key: 'wifiInfo',          label: 'Wi-Fi Info',                         type: 'input',    placeholder: 'e.g. Free throughout hotel, password: ...' },
      { key: 'websites',          label: 'Website URLs',                       type: 'urls' },
      { key: 'checkIn',           label: 'Check-in Time',                      type: 'input',    placeholder: 'e.g. 3:00 PM' },
      { key: 'checkOut',          label: 'Check-out Time',                     type: 'input',    placeholder: 'e.g. 12:00 PM' },
      { key: 'checkInOutPolicy',  label: 'Early Check-in / Late Check-out Policy', type: 'textarea', placeholder: 'Policy details, fees, how to request...' },
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
      {
        key: 'airportTransfer', label: 'Airport Transfers', type: 'list',
        addLabel: 'Add Transfer Option',
        schema: [
          { key: 'name',     label: 'Provider / Service', type: 'input', placeholder: 'e.g. Hotel Shuttle',    span: 2 },
          { key: 'type',     label: 'Type',               type: 'input', placeholder: 'e.g. Shared Shuttle' },
          { key: 'cost',     label: 'Cost',               type: 'input', placeholder: 'e.g. $25/person' },
          { key: 'pickup',   label: 'Pickup Location',    type: 'input', placeholder: 'e.g. Terminal 2, Door 4', span: 2 },
          { key: 'notes',    label: 'Booking Notes',      type: 'input', placeholder: 'e.g. Reserve 48hrs in advance', span: 2 },
        ],
      },
      {
        key: 'parkingInfo', label: 'Parking Options', type: 'list',
        addLabel: 'Add Parking Option',
        schema: [
          { key: 'name',     label: 'Type',     type: 'input', placeholder: 'e.g. Valet, Self-Park', span: 2 },
          { key: 'location', label: 'Location', type: 'input', placeholder: 'e.g. Main entrance' },
          { key: 'rate',     label: 'Daily Rate',type: 'input', placeholder: 'e.g. $35/night' },
          { key: 'notes',    label: 'Notes',    type: 'input', placeholder: 'e.g. In/out privileges included', span: 2 },
        ],
      },
      {
        key: 'onPropertyTransportation', label: 'On-Property Transportation', type: 'list',
        addLabel: 'Add Transport Type',
        schema: [
          { key: 'name',     label: 'Type',        type: 'input', placeholder: 'e.g. Golf Cart Shuttle', span: 2 },
          { key: 'route',    label: 'Route / Area', type: 'input', placeholder: 'e.g. Beach ↔ Main Lobby' },
          { key: 'hours',    label: 'Hours',        type: 'input', placeholder: 'e.g. 7 AM – 11 PM' },
          { key: 'cost',     label: 'Cost',         type: 'input', placeholder: 'e.g. Complimentary' },
        ],
      },
      { key: 'additionalInfo',      label: 'Additional Info',                  type: 'textarea', placeholder: 'Any other travel tips...' },
    ],
  },
  {
    id: 'roomInfo',
    label: 'Room Info',
    icon: BedDouble,
    fields: [
      {
        key: 'roomCategories', label: 'Room Categories in Block', type: 'list',
        addLabel: 'Add Room Type',
        schema: [
          { key: 'name',         label: 'Room Type',        type: 'input',  placeholder: 'e.g. Ocean View Suite',   span: 2 },
          { key: 'bedConfig',    label: 'Bed Configuration',type: 'input',  placeholder: 'e.g. King, Double Queen' },
          { key: 'view',         label: 'View',             type: 'input',  placeholder: 'e.g. Ocean, Garden, Pool' },
          { key: 'maxOccupancy', label: 'Max Occupancy',    type: 'input',  placeholder: 'e.g. 4 guests' },
          { key: 'rate',         label: 'Rate',             type: 'input',  placeholder: 'e.g. $350/night' },
          { key: 'notes',        label: 'Notes',            type: 'input',  placeholder: 'e.g. Connecting rooms available', span: 2 },
        ],
      },
      {
        key: 'inRoomAmenities', label: 'In-Room Amenities', type: 'list',
        addLabel: 'Add Amenity',
        schema: [
          { key: 'name',  label: 'Amenity', type: 'input', placeholder: 'e.g. Mini Bar', span: 2 },
          { key: 'notes', label: 'Notes',   type: 'input', placeholder: 'e.g. Restocked daily', span: 2 },
        ],
      },
      {
        key: 'bedConfigurations', label: 'Bed Configuration Options', type: 'list',
        addLabel: 'Add Bed Type',
        schema: [
          { key: 'name',  label: 'Bed Type',      type: 'input', placeholder: 'e.g. King', span: 2 },
          { key: 'notes', label: 'Availability',  type: 'input', placeholder: 'e.g. Limited — request early', span: 2 },
        ],
      },
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
      {
        key: 'restaurants', label: 'Restaurants', type: 'list',
        addLabel: 'Add Restaurant',
        schema: [
          { key: 'name',                label: 'Name',                 type: 'input',  placeholder: 'e.g. La Trattoria',   span: 2 },
          { key: 'cuisine',             label: 'Cuisine',              type: 'input',  placeholder: 'e.g. Italian' },
          { key: 'hours',               label: 'Hours',                type: 'input',  placeholder: 'e.g. 6–10 PM' },
          { key: 'dressCode',           label: 'Dress Code',           type: 'input',  placeholder: 'e.g. Smart casual' },
          { key: 'reservationRequired', label: 'Reservation Required', type: 'select', options: ['—', 'Yes', 'No', 'Recommended'] },
        ],
      },
      {
        key: 'barsLounges', label: 'Bars & Lounges', type: 'list',
        addLabel: 'Add Bar / Lounge',
        schema: [
          { key: 'name',     label: 'Name',     type: 'input', placeholder: 'e.g. Sunset Bar',  span: 2 },
          { key: 'location', label: 'Location', type: 'input', placeholder: 'e.g. Pool deck' },
          { key: 'hours',    label: 'Hours',    type: 'input', placeholder: 'e.g. 12 PM – 2 AM' },
        ],
      },
      {
        key: 'twentyFourHourDining', label: '24-Hour Dining', type: 'list',
        addLabel: 'Add Option',
        schema: [
          { key: 'name',     label: 'Name',     type: 'input', placeholder: 'e.g. The Late Night Grill', span: 2 },
          { key: 'location', label: 'Location', type: 'input', placeholder: 'e.g. Lobby level' },
          { key: 'hours',    label: 'Hours',    type: 'input', placeholder: 'e.g. Open 24 hours' },
          { key: 'notes',    label: 'Notes',    type: 'input', placeholder: 'e.g. Limited menu after midnight', span: 2 },
        ],
      },
      { key: 'buffetHours',        label: 'Buffet Hours',                                                       type: 'input',    placeholder: 'e.g. Breakfast 7–11 AM, Lunch 12–3 PM, Dinner 6–10 PM' },
      {
        key: 'specialtyDining', label: 'Specialty / Upgrade Dining', type: 'list',
        addLabel: 'Add Specialty Venue',
        schema: [
          { key: 'name',                label: 'Name',                 type: 'input',  placeholder: 'e.g. The Chef\'s Table', span: 2 },
          { key: 'cuisine',             label: 'Cuisine / Type',       type: 'input',  placeholder: 'e.g. Tasting Menu' },
          { key: 'surcharge',           label: 'Surcharge',            type: 'input',  placeholder: 'e.g. $45/person' },
          { key: 'dressCode',           label: 'Dress Code',           type: 'input',  placeholder: 'e.g. Formal' },
          { key: 'reservationRequired', label: 'Reservation Required', type: 'select', options: ['—', 'Yes', 'No', 'Recommended'] },
        ],
      },
      { key: 'additionalInfo',     label: 'Additional Info',                                                    type: 'textarea', placeholder: 'Anything else about dining...' },
    ],
  },
  {
    id: 'amenities',
    label: 'Hotel Amenities & Activities',
    icon: Dumbbell,
    fields: [
      {
        key: 'pools', label: 'Pools', type: 'list',
        addLabel: 'Add Pool',
        schema: [
          { key: 'name',     label: 'Pool Name',  type: 'input',  placeholder: 'e.g. Infinity Pool',  span: 2 },
          { key: 'location', label: 'Location',   type: 'input',  placeholder: 'e.g. Building B' },
          { key: 'hours',    label: 'Hours',      type: 'input',  placeholder: 'e.g. 7 AM – 10 PM' },
          { key: 'type',     label: 'Type',       type: 'select', options: ['—', 'Family', 'Adults Only', 'Both'] },
          { key: 'notes',    label: 'Notes',      type: 'input',  placeholder: 'e.g. Towels provided', span: 2 },
        ],
      },
      { key: 'beachInfo',            label: 'Beach Info',                                        type: 'textarea', placeholder: 'Chairs, umbrellas, towels provided, hours, reserved section...' },
      { key: 'fitnessCenter',        label: 'Fitness Center (location, hours)',                  type: 'textarea', placeholder: 'Equipment available, classes offered, booking required...' },
      {
        key: 'includedActivities', label: 'Included Activities', type: 'list',
        addLabel: 'Add Activity',
        schema: [
          { key: 'name',        label: 'Activity',    type: 'input', placeholder: 'e.g. Kayaking',          span: 2 },
          { key: 'description', label: 'Description', type: 'input', placeholder: 'e.g. Ocean kayaks at beach hut' },
          { key: 'schedule',    label: 'Schedule',    type: 'input', placeholder: 'e.g. Daily 9 AM – 5 PM' },
        ],
      },
      {
        key: 'paidActivities', label: 'Paid Activities', type: 'list',
        addLabel: 'Add Activity',
        schema: [
          { key: 'name',    label: 'Activity',    type: 'input', placeholder: 'e.g. Deep Sea Fishing', span: 2 },
          { key: 'cost',    label: 'Cost',        type: 'input', placeholder: 'e.g. $120/person' },
          { key: 'booking', label: 'How to Book', type: 'input', placeholder: 'e.g. Tour desk, lobby level' },
          { key: 'notes',   label: 'Notes',       type: 'input', placeholder: 'e.g. Min. 4 guests',  span: 2 },
        ],
      },
      {
        key: 'nightlyEntertainment', label: 'Nightly Entertainment', type: 'list',
        addLabel: 'Add Show / Event',
        schema: [
          { key: 'name',     label: 'Show / Event', type: 'input', placeholder: 'e.g. Fire Dance Show', span: 2 },
          { key: 'time',     label: 'Time',         type: 'input', placeholder: 'e.g. 9:30 PM' },
          { key: 'location', label: 'Location',     type: 'input', placeholder: 'e.g. Main Stage' },
          { key: 'notes',    label: 'Notes',        type: 'input', placeholder: 'e.g. Mon / Wed / Fri', span: 2 },
        ],
      },
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
      {
        key: 'featuredTreatments', label: 'Featured Treatments', type: 'list',
        addLabel: 'Add Treatment',
        schema: [
          { key: 'name',     label: 'Treatment',  type: 'input', placeholder: 'e.g. Hot Stone Massage', span: 2 },
          { key: 'duration', label: 'Duration',   type: 'input', placeholder: 'e.g. 60 min' },
          { key: 'price',    label: 'Price',      type: 'input', placeholder: 'e.g. $120' },
          { key: 'notes',    label: 'Notes',      type: 'input', placeholder: 'e.g. Book 48hrs ahead', span: 2 },
        ],
      },
      {
        key: 'couplesTreatments', label: 'Couples Treatments', type: 'list',
        addLabel: 'Add Treatment',
        schema: [
          { key: 'name',     label: 'Treatment',  type: 'input', placeholder: 'e.g. Couples Ritual',  span: 2 },
          { key: 'duration', label: 'Duration',   type: 'input', placeholder: 'e.g. 90 min' },
          { key: 'price',    label: 'Price',      type: 'input', placeholder: 'e.g. $280/couple' },
          { key: 'notes',    label: 'Notes',      type: 'input', placeholder: 'e.g. Includes champagne', span: 2 },
        ],
      },
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
      {
        key: 'familyDining', label: 'Family-Friendly Dining', type: 'list',
        addLabel: 'Add Restaurant',
        schema: [
          { key: 'name',     label: 'Name',     type: 'input', placeholder: 'e.g. The Garden Café', span: 2 },
          { key: 'location', label: 'Location', type: 'input', placeholder: 'e.g. Pool level' },
          { key: 'hours',    label: 'Hours',    type: 'input', placeholder: 'e.g. 7 AM – 9 PM' },
          { key: 'notes',    label: 'Notes',    type: 'input', placeholder: 'e.g. High chairs available', span: 2 },
        ],
      },
      { key: 'cribRollaway',  label: 'Crib / Rollaway Availability and Cost', type: 'input',  placeholder: 'e.g. Crib free on request, rollaway $25/night' },
      { key: 'additionalInfo', label: 'Additional Info',                    type: 'textarea', placeholder: 'Anything else for families...' },
    ],
  },
  {
    id: 'adultOnly',
    label: 'Adult-Only Areas',
    icon: Wine,
    fields: [
      {
        key: 'adultPools', label: 'Adults-Only Pools', type: 'list',
        addLabel: 'Add Pool',
        schema: [
          { key: 'name',     label: 'Pool Name', type: 'input', placeholder: 'e.g. Temptation Pool', span: 2 },
          { key: 'location', label: 'Location',  type: 'input', placeholder: 'e.g. East wing' },
          { key: 'hours',    label: 'Hours',     type: 'input', placeholder: 'e.g. 9 AM – 8 PM' },
          { key: 'notes',    label: 'Notes',     type: 'input', placeholder: 'e.g. 18+ strictly enforced', span: 2 },
        ],
      },
      {
        key: 'adultRestaurants', label: 'Adults-Only Restaurants', type: 'list',
        addLabel: 'Add Restaurant',
        schema: [
          { key: 'name',                label: 'Name',                 type: 'input',  placeholder: 'e.g. Desires',  span: 2 },
          { key: 'cuisine',             label: 'Cuisine',              type: 'input',  placeholder: 'e.g. Fusion' },
          { key: 'hours',               label: 'Hours',                type: 'input',  placeholder: 'e.g. 6–10 PM' },
          { key: 'reservationRequired', label: 'Reservation Required', type: 'select', options: ['—', 'Yes', 'No', 'Recommended'] },
        ],
      },
      {
        key: 'adultSections', label: 'Adults-Only Sections & Lounges', type: 'list',
        addLabel: 'Add Section / Lounge',
        schema: [
          { key: 'name',     label: 'Name',     type: 'input', placeholder: 'e.g. Preferred Club Lounge', span: 2 },
          { key: 'location', label: 'Location', type: 'input', placeholder: 'e.g. Building A, 3rd floor' },
          { key: 'hours',    label: 'Hours',    type: 'input', placeholder: 'e.g. 10 AM – 11 PM' },
          { key: 'notes',    label: 'Notes',    type: 'input', placeholder: 'e.g. Complimentary drinks included', span: 2 },
        ],
      },
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
      {
        key: 'recommendedExcursions', label: 'Recommended Excursions', type: 'list',
        addLabel: 'Add Excursion',
        schema: [
          { key: 'name',        label: 'Excursion',   type: 'input', placeholder: 'e.g. Chichen Itza Tour', span: 2 },
          { key: 'description', label: 'Description', type: 'input', placeholder: 'e.g. Full-day guided tour', span: 2 },
          { key: 'cost',        label: 'Approx. Cost',type: 'input', placeholder: 'e.g. $89/person' },
          { key: 'duration',    label: 'Duration',    type: 'input', placeholder: 'e.g. 10 hours' },
          { key: 'booking',     label: 'How to Book', type: 'input', placeholder: 'e.g. Tour desk in lobby', span: 2 },
        ],
      },
      { key: 'bookingInstructions',   label: 'Booking Instructions (tour desk, concierge, third party)', type: 'textarea', placeholder: 'Where to book, how far in advance, cancellation policy...' },
      { key: 'nearestTown',           label: 'Nearest Town / Shopping Area',                            type: 'textarea', placeholder: 'Distance, transportation options, what to find there...' },
      {
        key: 'transportation', label: 'Transportation to Off-Site', type: 'list',
        addLabel: 'Add Option',
        schema: [
          { key: 'name',  label: 'Type',  type: 'input', placeholder: 'e.g. Taxi', span: 2 },
          { key: 'cost',  label: 'Cost',  type: 'input', placeholder: 'e.g. ~$15 each way' },
          { key: 'notes', label: 'Notes', type: 'input', placeholder: 'e.g. Available at main entrance', span: 2 },
        ],
      },
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

function UrlsField({ fieldKey, data, onChange }) {
  const raw = data[fieldKey]
  const urls = Array.isArray(raw)
    ? raw
    : raw ? [{ label: '', url: raw }] : []

  const [editingIndex, setEditingIndex] = useState(null)
  const [draft, setDraft] = useState({ label: '', url: '' })

  function addNew() {
    const next = [...urls, { label: '', url: '' }]
    onChange(fieldKey, next)
    setDraft({ label: '', url: '' })
    setEditingIndex(next.length - 1)
  }

  function startEdit(i) {
    setDraft({ ...urls[i] })
    setEditingIndex(i)
  }

  function save(i) {
    if (!draft.url.trim()) { cancel(i); return }
    onChange(fieldKey, urls.map((u, idx) => idx === i ? { ...draft } : u))
    setEditingIndex(null)
  }

  function cancel(i) {
    if (!urls[i]?.url) onChange(fieldKey, urls.filter((_, idx) => idx !== i))
    setEditingIndex(null)
  }

  function remove(i) {
    onChange(fieldKey, urls.filter((_, idx) => idx !== i))
    if (editingIndex === i) setEditingIndex(null)
  }

  return (
    <div className="space-y-2">
      {urls.map((entry, i) =>
        editingIndex === i ? (
          <div key={i} className="flex gap-2 items-center">
            <input autoFocus className="input w-28 shrink-0" placeholder="Label (optional)"
              value={draft.label} onChange={e => setDraft(d => ({ ...d, label: e.target.value }))} />
            <input className="input flex-1" placeholder="https://..."
              value={draft.url} onChange={e => setDraft(d => ({ ...d, url: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && save(i)} />
            <button onClick={() => save(i)}
              className="p-1.5 rounded-lg text-sage-400 hover:text-sage-300 transition-colors shrink-0">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={() => cancel(i)}
              className="p-1.5 rounded-lg text-moon-400 hover:text-red-300 transition-colors shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div key={i} className="flex items-center gap-2 group">
            <a href={entry.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-forest-600 border border-plum-700/50 hover:border-plum-400 hover:bg-forest-500 text-sm font-sans text-plum-100 hover:text-white transition-all flex-1 min-w-0">
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-moon-400" />
              <span className="truncate">{entry.label || entry.url}</span>
            </a>
            <button onClick={() => startEdit(i)}
              className="p-1.5 rounded-lg text-moon-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => remove(i)}
              className="p-1.5 rounded-lg text-moon-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      )}
      <button onClick={addNew}
        className="flex items-center gap-1.5 text-xs font-sans text-moon-300 hover:text-plum-100 transition-colors">
        <Plus className="w-3.5 h-3.5" /> Add URL
      </button>
    </div>
  )
}

function ListField({ fieldKey, schema, addLabel, data, onChange }) {
  const items = Array.isArray(data[fieldKey]) ? data[fieldKey] : []
  const [editingIndex, setEditingIndex] = useState(null)
  const [draft, setDraft] = useState({})

  function emptyItem() {
    return schema.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})
  }

  function addNew() {
    const next = [...items, emptyItem()]
    onChange(fieldKey, next)
    setDraft(emptyItem())
    setEditingIndex(next.length - 1)
  }

  function startEdit(i) {
    setDraft({ ...items[i] })
    setEditingIndex(i)
  }

  function save(i) {
    if (!draft.name?.trim()) { cancel(i); return }
    onChange(fieldKey, items.map((item, idx) => idx === i ? { ...draft } : item))
    setEditingIndex(null)
  }

  function cancel(i) {
    if (!items[i]?.name) onChange(fieldKey, items.filter((_, idx) => idx !== i))
    setEditingIndex(null)
  }

  function remove(i) {
    onChange(fieldKey, items.filter((_, idx) => idx !== i))
    if (editingIndex === i) setEditingIndex(null)
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) =>
        editingIndex === i ? (
          <div key={i} className="bg-forest-600 border border-plum-600/40 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {schema.map(f => (
                <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
                  <label className="label">{f.label}</label>
                  {f.type === 'select' ? (
                    <div className="relative">
                      <select className="input appearance-none pr-8 cursor-pointer"
                        value={draft[f.key] || ''}
                        onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}>
                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
                    </div>
                  ) : (
                    <input className="input" placeholder={f.placeholder}
                      value={draft[f.key] || ''}
                      autoFocus={f.key === 'name'}
                      onChange={e => setDraft(d => ({ ...d, [f.key]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && save(i)} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => save(i)} className="btn-primary text-xs flex items-center gap-1.5">
                <Check className="w-3 h-3" /> Save
              </button>
              <button onClick={() => cancel(i)} className="btn-secondary text-xs">Cancel</button>
            </div>
          </div>
        ) : (
          <div key={i} className="flex items-start gap-3 px-4 py-3 bg-forest-600 border border-plum-700/50 rounded-xl group hover:border-plum-500 transition-all">
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-plum-50 text-sm">{item.name || '—'}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                {schema.filter(f => f.key !== 'name' && item[f.key] && item[f.key] !== '—').map(f => (
                  <span key={f.key} className="text-xs font-sans text-moon-400">
                    {f.label}: <span className="text-moon-200">{item[f.key]}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => startEdit(i)} className="p-1.5 rounded-lg text-moon-400 hover:text-white transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-moon-400 hover:text-red-300 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      )}
      <button onClick={addNew} className="flex items-center gap-1.5 text-xs font-sans text-moon-300 hover:text-plum-100 transition-colors">
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </div>
  )
}

function SectionFields({ fields, data, onChange }) {
  return (
    <div className="mt-4 grid sm:grid-cols-2 gap-3">
      {fields.map(field => (
        <div key={field.key} className={field.type === 'textarea' || field.type === 'urls' || field.type === 'list' ? 'sm:col-span-2' : ''}>
          <label className="label">{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              className="input w-full resize-none min-h-20"
              placeholder={field.placeholder}
              value={data[field.key] || ''}
              onChange={e => onChange(field.key, e.target.value)}
            />
          ) : field.type === 'urls' ? (
            <UrlsField fieldKey={field.key} data={data} onChange={onChange} />
          ) : field.type === 'list' ? (
            <ListField fieldKey={field.key} schema={field.schema} addLabel={field.addLabel} data={data} onChange={onChange} />
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
  return Object.values(data).some(v => {
    if (Array.isArray(v)) return v.length > 0
    return v && String(v).trim().length > 0
  })
}

function SectionReadView({ fields, data, onChange }) {
  const textFields = fields.filter(f =>
    (f.type === 'input' || f.type === 'textarea') && data[f.key]?.toString().trim()
  )
  const interactiveFields = fields.filter(f => f.type === 'urls' || f.type === 'list')

  return (
    <div className="mt-4 grid sm:grid-cols-2 gap-3">
      {textFields.map(f => (
        <div key={f.key} className={`bg-forest-600 border border-plum-700/50 rounded-xl p-4 ${f.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
          <p className="font-sans font-semibold text-moon-400 uppercase tracking-wider mb-2" style={{ fontSize: '16px' }}>{f.label}</p>
          <p className={`text-sm font-sans text-plum-100 leading-relaxed ${f.type === 'textarea' ? 'whitespace-pre-wrap' : ''}`}>
            {data[f.key]}
          </p>
        </div>
      ))}
      {interactiveFields.map(f => (
        <div key={f.key} className="sm:col-span-2 bg-forest-600 border border-plum-700/50 rounded-xl p-4">
          <p className="font-sans font-semibold text-moon-400 uppercase tracking-wider mb-3" style={{ fontSize: '16px' }}>{f.label}</p>
          {f.type === 'urls'
            ? <UrlsField fieldKey={f.key} data={data} onChange={onChange} />
            : <ListField fieldKey={f.key} schema={f.schema} addLabel={f.addLabel} data={data} onChange={onChange} />
          }
        </div>
      ))}
    </div>
  )
}

function SectionAccordion({ section, data, onChange, defaultOpen = false, extraContent }) {
  const [open, setOpen] = useState(defaultOpen)
  const [editing, setEditing] = useState(false)
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
          <span className="font-serif font-bold text-white" style={{ fontSize: '16px' }}>{section.label}</span>
          {!open && filled && <span className="w-1.5 h-1.5 rounded-full bg-plum-300 shrink-0" />}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {open && filled && !editing && (
            <span
              onClick={e => { e.stopPropagation(); setEditing(true) }}
              className="flex items-center gap-1 text-xs text-moon-400 hover:text-plum-100 font-sans px-2 py-1 rounded-lg hover:bg-forest-500 transition-colors"
            >
              <Pencil className="w-3 h-3" /> Edit
            </span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-moon-300" />
            : <ChevronDown className="w-4 h-4 text-moon-300" />}
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-plum-800/60">
          {extraContent && <div className="mt-4">{extraContent}</div>}

          {editing ? (
            <>
              <SectionFields fields={section.fields} data={data} onChange={onChange} />
              <button
                onClick={() => setEditing(false)}
                className="mt-4 btn-primary text-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Done
              </button>
            </>
          ) : filled ? (
            <SectionReadView fields={section.fields} data={data} onChange={onChange} />
          ) : (
            <div className="mt-4 py-6 text-center">
              <p className="text-sm text-moon-400 font-sans mb-3">No info added yet.</p>
              <button onClick={() => setEditing(true)} className="btn-secondary text-sm flex items-center gap-1.5 mx-auto">
                <Plus className="w-3.5 h-3.5" /> Add info
              </button>
            </div>
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

      {/* Hotel Basics */}
      <SectionAccordion
        section={resortSection}
        data={travelInfo.resortBasics || {}}
        onChange={(key, value) => updateSection('resortBasics', key, value)}
        defaultOpen
        extraContent={venueSameAsHotel && chosenVenue && (
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
      />

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
