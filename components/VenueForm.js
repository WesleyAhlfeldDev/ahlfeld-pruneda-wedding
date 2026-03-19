import { useState } from 'react'
import { Check, X, Plus, Upload, Loader2, FileText, Image, File } from 'lucide-react'
import { supabase } from '../lib/supabase'

function getFileIcon(type) {
  if (type?.startsWith('image/')) return Image
  if (type === 'application/pdf') return FileText
  return File
}

function getFileType(type) {
  if (type?.startsWith('image/')) return 'image'
  if (type === 'application/pdf') return 'pdf'
  return 'file'
}

export default function VenueForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '',
    location: '',
    capacity: '',
    website: '',
    notes: '',
    coverImage: '',
    documents: [],
    packages: [],
    addons: [],
  })
  const [newDoc, setNewDoc] = useState({ name: '', url: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }))
  }

  async function handleFileUpload(e) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    if (!supabase) {
      setUploadError('Supabase not connected — add files via URL link instead.')
      return
    }

    setUploading(true)
    setUploadError('')

    const uploaded = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `${form.id || `venue-${Date.now()}`}/${Date.now()}-${file.name.replace(/[^a-z0-9.\-_]/gi, '_')}`
      const { data, error } = await supabase.storage
        .from('venue-files')
        .upload(path, file, { upsert: true })

      if (error) {
        setUploadError(`Failed to upload ${file.name}: ${error.message}`)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('venue-files')
        .getPublicUrl(path)

      uploaded.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        url: urlData.publicUrl,
        type: getFileType(file.type),
        mimeType: file.type,
        size: file.size,
      })
    }

    if (uploaded.length > 0) {
      set('documents', [...(form.documents || []), ...uploaded])
    }

    setUploading(false)
    e.target.value = ''
  }

  function addDoc() {
    if (!newDoc.name.trim() || !newDoc.url.trim()) return
    set('documents', [...(form.documents || []), {
      id: `doc-${Date.now()}`,
      name: newDoc.name,
      url: newDoc.url,
      type: 'link',
    }])
    setNewDoc({ name: '', url: '' })
  }

  async function removeDoc(doc) {
    // If it's a Supabase uploaded file, delete from storage too
    if (supabase && doc.url?.includes('supabase')) {
      const path = doc.url.split('/venue-files/')[1]
      if (path) await supabase.storage.from('venue-files').remove([path])
    }
    set('documents', (form.documents || []).filter(d => d.id !== doc.id))
  }

  function save() {
    if (!form.name.trim()) return
    onSave({
      ...form,
      capacity: parseInt(form.capacity) || 0,
      id: form.id || `venue-${Date.now()}`,
    })
  }

  function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-white">
          {initial?.id ? 'Edit Venue' : 'New Venue'}
        </h3>
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-forest-600 text-moon-300">
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
          <label className="label">Cover Image URL</label>
          <input className="input" placeholder="https://... (link to a photo of the venue)"
            value={form.coverImage || ''}
            onChange={e => set('coverImage', e.target.value)} />
          {form.coverImage && (
            <div className="mt-2 rounded-xl overflow-hidden h-32 bg-forest-600">
              <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover"
                onError={e => e.target.style.display = 'none'} />
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="label">Notes</label>
          <textarea className="input resize-none" rows={2} placeholder="Any notes, contacts, impressions..."
            value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        {/* Files & Documents */}
        <div className="sm:col-span-2">
          <label className="label">Files & Documents</label>
          <p className="text-xs text-moon-300 font-sans mb-3">Upload PDFs, images, brochures — or add a link to an external file</p>

          {/* Upload area */}
          <label className={`flex flex-col items-center justify-center w-full h-28 rounded-xl border-2 border-dashed transition-all cursor-pointer mb-3 ${uploading ? 'border-plum-300 bg-forest-600' : 'border-plum-600 hover:border-plum-400 hover:bg-forest-600'}`}>
            <div className="flex flex-col items-center gap-2">
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 text-moon-300 animate-spin" />
                  <span className="text-sm text-moon-300 font-sans">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6 text-white0" />
                  <span className="text-sm text-white0 font-sans font-medium">Click to upload files</span>
                  <span className="text-xs text-white0 font-sans">PDFs, images, Word docs, and more</span>
                </>
              )}
            </div>
            <input type="file" multiple className="hidden" onChange={handleFileUpload} disabled={uploading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.xlsx,.xls,.pptx,.txt" />
          </label>

          {uploadError && (
            <p className="text-xs text-red-500 font-sans mb-2">{uploadError}</p>
          )}

          {/* Uploaded files list */}
          {(form.documents || []).length > 0 && (
            <div className="space-y-2 mb-3">
              {(form.documents || []).map(doc => {
                const Icon = getFileIcon(doc.mimeType)
                return (
                  <div key={doc.id} className="flex items-center gap-3 bg-forest-600 rounded-xl px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-forest-500 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-white0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm text-plum-50 truncate">{doc.name}</p>
                      {doc.size && <p className="text-xs text-moon-300 font-sans">{formatSize(doc.size)}</p>}
                      {doc.type === 'link' && <p className="text-xs text-moon-300 font-sans truncate">{doc.url}</p>}
                    </div>
                    <button onClick={() => removeDoc(doc)} className="shrink-0 p-1 text-white0 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* Manual link entry */}
          <div className="border-t border-plum-700/50 pt-3">
            <p className="text-xs text-moon-300 font-sans mb-2">Or add an external link (Google Drive, Dropbox, etc.)</p>
            <div className="flex gap-2">
              <input className="input flex-1" placeholder="Label (e.g. Wedding Packages PDF)"
                value={newDoc.name} onChange={e => setNewDoc(d => ({ ...d, name: e.target.value }))} />
              <input className="input flex-1" placeholder="URL (https://...)"
                value={newDoc.url} onChange={e => setNewDoc(d => ({ ...d, url: e.target.value }))} />
              <button onClick={addDoc} className="btn-secondary shrink-0 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>
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
