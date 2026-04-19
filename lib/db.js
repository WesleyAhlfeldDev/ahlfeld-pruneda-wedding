import { supabase } from './supabase'

const ROW_ID = 'shared'
const LOCAL_KEY = 'wedding-venues-data'

// ─── Shape ────────────────────────────────────────────────────────────────────
export function emptyState() {
  return {
    venues: [],
    notes: [],
    todos: [],
    guests: [],
    comparisons: [{ id: 'cmp-default', leftId: '', rightId: '' }],
    estimate: {
      selectedVenue: '', selectedPackage: '',
      selectedAddons: [], selectedPerPersonAddons: [],
      guestCount: '', overrideGuestPrice: '', notes: '',
    },
    guestCount: '',
    weddingDate: '',
  }
}

// Map app state (camelCase) → DB columns (snake_case)
function stateToRow(state) {
  return {
    id: ROW_ID,
    venues: state.venues ?? [],
    notes: state.notes ?? [],
    todos: state.todos ?? [],
    guests: state.guests ?? [],
    comparisons: state.comparisons ?? emptyState().comparisons,
    estimate: state.estimate ?? emptyState().estimate,
    guest_count: state.guestCount ?? '',
    wedding_date: state.weddingDate ?? '',
    updated_at: new Date().toISOString(),
  }
}

const DEFAULT_ESTIMATE = {
  selectedVenue: '', selectedPackage: '',
  selectedAddons: [], selectedPerPersonAddons: [],
  guestCount: '', overrideGuestPrice: '', notes: '',
}

// Map DB row (snake_case) → app state (camelCase)
function rowToState(row) {
  return {
    venues: row.venues ?? [],
    notes: row.notes ?? [],
    todos: row.todos ?? [],
    guests: row.guests ?? [],
    comparisons: row.comparisons ?? emptyState().comparisons,
    estimate: { ...DEFAULT_ESTIMATE, ...(row.estimate ?? {}) },
    guestCount: row.guest_count ?? '',
    weddingDate: row.wedding_date ?? '',
  }
}

// ─── Supabase ─────────────────────────────────────────────────────────────────
export async function loadFromDB() {
  if (!supabase) return loadFromLocal()
  try {
    const { data, error } = await supabase
      .from('wedding_data')
      .select('*')
      .eq('id', ROW_ID)
      .single()
    if (error || !data) return loadFromLocal()
    return { ...emptyState(), ...rowToState(data) }
  } catch {
    return loadFromLocal()
  }
}

export async function saveToDB(state) {
  if (!supabase) { saveToLocal(state); return }
  try {
    const { error } = await supabase
      .from('wedding_data')
      .upsert(stateToRow(state))
    if (error) {
      console.error('Supabase save error:', error.message)
      saveToLocal(state)
    }
  } catch (e) {
    console.error('Supabase save exception:', e)
    saveToLocal(state)
  }
}

export function subscribeToChanges(callback) {
  if (!supabase) return () => {}
  const channel = supabase
    .channel('wedding_data_changes')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'wedding_data',
      filter: `id=eq.${ROW_ID}`,
    }, payload => {
      try {
        callback({ ...emptyState(), ...rowToState(payload.new) })
      } catch (e) {
        console.error('Real-time update error:', e)
      }
    })
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// ─── localStorage fallback ────────────────────────────────────────────────────
export function loadFromLocal() {
  try {
    const saved = localStorage.getItem(LOCAL_KEY)
    if (saved) return { ...emptyState(), ...JSON.parse(saved) }
  } catch {}
  return emptyState()
}

export function saveToLocal(state) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
  } catch {}
}

export const isUsingSupabase = () => !!supabase
