# 💍 Wedding Venue Planner

A beautiful, shareable app for comparing wedding venues, packages, and estimating total costs.

## Features

- **Venues Tab** — Add/edit/delete venues with location, capacity, and notes
- **Packages** — Each venue can have multiple packages with pricing, guest limits, hours, and included items
- **Add-ons** — Optional extensions for each venue (extra hours, valet, honeymoon suite, etc.)
- **Compare Tab** — Side-by-side comparison of all venues and their packages
- **Estimate Tab** — Interactive price estimator: choose a venue + package + add-ons to see total cost
- **Import/Export** — Export your data as JSON to share with your fiancé and parents, or import it back

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Sharing with Family

### Option 1 — Export/Import (easiest)
1. Click **Export** in the top-right to download `wedding-venues.json`
2. Share the JSON file (email, text, Google Drive)
3. Others open the app, click **Import**, and select the file

### Option 2 — Deploy to Vercel (free, always accessible)
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Deploy — Vercel handles everything automatically
4. Share the URL with your fiancé and parents

### Option 3 — Deploy to Netlify (free)
1. Run `npm run build` then `npm run export` (add `output: 'export'` to next.config.js)
2. Drag the `out/` folder to [netlify.com/drop](https://netlify.com/drop)

## Data Storage

Data is stored in your browser's localStorage, so it persists across page refreshes on the same device. Use **Export** to save and share your data.

## Tech Stack

- **Next.js 14** — React framework
- **Tailwind CSS** — Styling
- **Lucide React** — Icons
- **localStorage** — Data persistence
