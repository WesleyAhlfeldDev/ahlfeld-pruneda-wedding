export const DEFAULT_DATA = {
  venues: [
    {
      id: 'venue-1',
      name: 'The Grand Magnolia Estate',
      location: 'Southlake, TX',
      capacity: 250,
      website: '',
      notes: 'Beautiful outdoor garden with indoor ballroom backup. Coordinator is Sarah.',
      packages: [
        {
          id: 'pkg-1a',
          name: 'Garden Ceremony',
          price: 4500,
          guestCount: 100,
          hours: 5,
          includes: [
            'Ceremony arch with floral décor',
            'White garden chairs (100)',
            'Bridal suite access',
            '1 venue coordinator',
            'Setup & cleanup',
          ],
        },
        {
          id: 'pkg-1b',
          name: 'Full Estate Celebration',
          price: 9800,
          guestCount: 200,
          hours: 8,
          includes: [
            'Indoor ballroom + outdoor ceremony',
            'Round tables & chiavari chairs (200)',
            'Bridal & groom suites',
            'Day-of venue coordinator',
            'Catering kitchen access',
            'AV system & dance floor',
            'Setup & cleanup',
          ],
        },
      ],
      addons: [
        { id: 'ao-1a', name: 'Cocktail Hour Space', price: 800, description: 'Terrace with bistro lighting' },
        { id: 'ao-1b', name: 'Extra Hour', price: 350, description: 'Per hour beyond package' },
        { id: 'ao-1c', name: 'Valet Parking', price: 600, description: 'Up to 4 hours, 2 attendants' },
        { id: 'ao-1d', name: 'Honeymoon Suite', price: 250, description: 'Night of the wedding' },
      ],
    },
    {
      id: 'venue-2',
      name: 'Riverwalk Loft & Rooftop',
      location: 'Dallas, TX',
      capacity: 150,
      website: '',
      notes: 'Urban chic. Stunning skyline views. Parking garage next door.',
      packages: [
        {
          id: 'pkg-2a',
          name: 'Loft Intimate',
          price: 3200,
          guestCount: 75,
          hours: 5,
          includes: [
            'Loft space rental',
            'Ceremony & reception in one space',
            'Tables & modern chairs (75)',
            'Sound system',
            'Setup & cleanup',
          ],
        },
        {
          id: 'pkg-2b',
          name: 'Rooftop Signature',
          price: 7500,
          guestCount: 150,
          hours: 7,
          includes: [
            'Full rooftop + loft access',
            'Bistro lighting & candles',
            'Tables & chairs (150)',
            'AV system & microphone',
            'Dedicated venue host',
            'Setup & cleanup',
          ],
        },
      ],
      addons: [
        { id: 'ao-2a', name: 'Photo Booth Corner', price: 400, description: 'Backdrop + props setup' },
        { id: 'ao-2b', name: 'Extra Hour', price: 400, description: 'Per additional hour' },
        { id: 'ao-2c', name: 'Bar Setup Fee', price: 300, description: 'Bar station + glassware' },
      ],
    },
  ],
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
}
