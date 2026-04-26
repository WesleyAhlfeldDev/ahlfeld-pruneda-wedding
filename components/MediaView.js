import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Upload, Link2, Trash2, ExternalLink, FileText, File, Plus, X, Images, ChevronDown } from 'lucide-react'

const CATEGORIES = [
  { id: 'all', label: 'All Files' },
  { id: 'save-the-date', label: 'Save the Date' },
  { id: 'invitations', label: 'Invitations & RSVP' },
  { id: 'engagement', label: 'Engagement Photos' },
  { id: 'contracts', label: 'Contracts' },
  { id: 'budget', label: 'Budget & Receipts' },
  { id: 'inspiration', label: 'Inspiration' },
  { id: 'other', label: 'Other' },
]

const CATEGORY_COLORS = {
  'save-the-date': 'bg-plum-800 text-plum-200 border-plum-600/40',
  'invitations': 'bg-sage-100 text-sage-500 border-sage-300/40',
  'engagement': 'bg-blush-600/20 text-blush-200 border-blush-400/30',
  'contracts': 'bg-moon-600 text-moon-200 border-moon-500/40',
  'budget': 'bg-forest-400 text-moon-200 border-plum-700/40',
  'inspiration': 'bg-plum-600/30 text-plum-200 border-plum-500/40',
  'other': 'bg-forest-400 text-moon-300 border-plum-700/40',
}

function getFileType(mimeType = '') {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  return 'file'
}

function FileIcon({ mimeType, className }) {
  const type = getFileType(mimeType)
  if (type === 'pdf') return <FileText className={className} />
  return <File className={className} />
}

function formatSize(bytes) {
  if (!bytes) return null
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaView({ media, setMedia }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addMode, setAddMode] = useState('upload')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [newCategory, setNewCategory] = useState('other')
  const [linkForm, setLinkForm] = useState({ name: '', url: '', category: 'other' })

  const filtered = activeCategory === 'all' ? media : media.filter(m => m.category === activeCategory)
  const images = filtered.filter(m => m.type === 'image')
  const docs = filtered.filter(m => m.type !== 'image')

  async function handleUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return

    if (!supabase) {
      setUploadError('Supabase not connected — add files via URL link instead.')
      e.target.value = ''
      return
    }

    setUploading(true)
    setUploadError('')
    const uploaded = []

    for (const file of files) {
      const path = `media/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, '_')}`
      const { error } = await supabase.storage.from('venue-files').upload(path, file, { upsert: true })
      if (error) { setUploadError(`Failed: ${file.name} — ${error.message}`); continue }
      const { data: urlData } = supabase.storage.from('venue-files').getPublicUrl(path)
      uploaded.push({
        id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        url: urlData.publicUrl,
        type: getFileType(file.type),
        mimeType: file.type,
        size: file.size,
        category: newCategory,
        uploadedAt: new Date().toISOString(),
      })
    }

    if (uploaded.length) setMedia(prev => [...prev, ...uploaded])
    setUploading(false)
    e.target.value = ''
  }

  function addLink() {
    if (!linkForm.name.trim() || !linkForm.url.trim()) return
    setMedia(prev => [...prev, {
      id: `media-${Date.now()}`,
      name: linkForm.name.trim(),
      url: linkForm.url.trim(),
      type: 'link',
      category: linkForm.category,
      uploadedAt: new Date().toISOString(),
    }])
    setLinkForm({ name: '', url: '', category: 'other' })
    setShowAddForm(false)
  }

  async function deleteItem(item) {
    if (!confirm(`Remove "${item.name}"?`)) return
    if (supabase && item.url?.includes('supabase')) {
      const path = item.url.split('/venue-files/')[1]
      if (path) await supabase.storage.from('venue-files').remove([path])
    }
    setMedia(prev => prev.filter(m => m.id !== item.id))
  }

  const catLabel = id => CATEGORIES.find(c => c.id === id)?.label ?? id

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-xl text-plum-50 font-semibold">Media & Files</h2>
        <button onClick={() => setShowAddForm(v => !v)} className="btn-primary flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Add File
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-forest-400 border border-plum-500/50 rounded-xl p-5 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2">
            <button onClick={() => setAddMode('upload')}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border font-sans transition-all ${addMode === 'upload' ? 'bg-plum-600 text-white border-plum-500' : 'bg-forest-500 text-moon-300 border-plum-700/40 hover:border-plum-500'}`}>
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
            <button onClick={() => setAddMode('link')}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border font-sans transition-all ${addMode === 'link' ? 'bg-plum-600 text-white border-plum-500' : 'bg-forest-500 text-moon-300 border-plum-700/40 hover:border-plum-500'}`}>
              <Link2 className="w-3.5 h-3.5" /> Add Link
            </button>
          </div>

          {addMode === 'upload' && (
            <div className="space-y-3">
              <div>
                <label className="label">Category</label>
                <div className="relative">
                  <select className="input appearance-none pr-8 cursor-pointer"
                    value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
                </div>
              </div>
              {uploadError && <p className="text-xs text-red-400 font-sans">{uploadError}</p>}
              {!supabase ? (
                <p className="text-xs text-amber-400 font-sans">Supabase not connected — use "Add Link" to add files by URL.</p>
              ) : (
                <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${uploading ? 'border-plum-600 opacity-60 pointer-events-none' : 'border-plum-600/40 hover:border-plum-400'}`}>
                  <Upload className="w-6 h-6 text-moon-400" />
                  <span className="text-sm text-moon-300 font-sans">{uploading ? 'Uploading...' : 'Click to select files'}</span>
                  <span className="text-xs text-moon-500 font-sans">Images, PDFs, documents</span>
                  <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              )}
            </div>
          )}

          {addMode === 'link' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Name *</label>
                  <input className="input" placeholder="e.g. RSVP Website"
                    value={linkForm.name} onChange={e => setLinkForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Category</label>
                  <div className="relative">
                    <select className="input appearance-none pr-8 cursor-pointer"
                      value={linkForm.category} onChange={e => setLinkForm(f => ({ ...f, category: e.target.value }))}>
                      {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-moon-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              <div>
                <label className="label">URL *</label>
                <input className="input" placeholder="https://..."
                  value={linkForm.url} onChange={e => setLinkForm(f => ({ ...f, url: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button onClick={addLink} className="btn-primary text-sm flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
                <button onClick={() => setShowAddForm(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category filter */}
      {media.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {CATEGORIES.filter(c => c.id === 'all' || media.some(m => m.category === c.id)).map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)}
              className={`text-xs font-sans px-3 py-1.5 rounded-full border transition-all ${activeCategory === c.id ? 'bg-plum-500 text-white border-plum-500' : 'bg-forest-500 text-moon-300 border-plum-700/40 hover:border-plum-500'}`}>
              {c.label}{c.id !== 'all' && ` (${media.filter(m => m.category === c.id).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {media.length === 0 && (
        <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-plum-800 flex items-center justify-center mx-auto mb-4">
            <Images className="w-6 h-6 text-plum-300" />
          </div>
          <h3 className="font-serif text-xl text-plum-50 mb-2">No files yet</h3>
          <p className="text-sm text-moon-300 font-sans mb-5">Upload save-the-dates, engagement photos, contracts, and more.</p>
          <button onClick={() => setShowAddForm(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add your first file
          </button>
        </div>
      )}

      {/* No results for filter */}
      {media.length > 0 && filtered.length === 0 && (
        <div className="bg-forest-500 rounded-2xl border border-plum-700/50 p-8 text-center">
          <p className="text-moon-300 font-sans text-sm">No files in this category.</p>
        </div>
      )}

      {/* Images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-forest-600 aspect-video">
              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
              {/* Category badge */}
              <span className={`absolute top-2 left-2 text-xs font-sans px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other}`}>
                {catLabel(item.category)}
              </span>
              {/* Actions */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-forest-500/90 text-moon-200 hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => deleteItem(item)}
                  className="p-1.5 rounded-lg bg-forest-500/90 text-moon-200 hover:text-red-300 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs text-white bg-black/50 truncate opacity-0 group-hover:opacity-100 transition-opacity font-sans">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Documents & links list */}
      {docs.length > 0 && (
        <div className="bg-forest-500 rounded-2xl border border-plum-700/50 overflow-hidden">
          {docs.map((item, i) => (
            <div key={item.id} className={`flex items-center gap-3 px-4 py-3 hover:bg-forest-400 transition-colors group ${i < docs.length - 1 ? 'border-b border-plum-700/30' : ''}`}>
              <div className="w-9 h-9 rounded-lg bg-forest-400 flex items-center justify-center shrink-0">
                {item.type === 'link'
                  ? <Link2 className="w-4 h-4 text-plum-300" />
                  : <FileIcon mimeType={item.mimeType} className="w-4 h-4 text-plum-300" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-plum-50 truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-sans px-1.5 py-0.5 rounded-full border ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other}`}>
                    {catLabel(item.category)}
                  </span>
                  {item.size && <span className="text-xs text-moon-400 font-sans">{formatSize(item.size)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-forest-300 text-moon-300 hover:text-white transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => deleteItem(item)}
                  className="p-1.5 rounded-lg hover:bg-red-900/40 text-moon-300 hover:text-red-300 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
