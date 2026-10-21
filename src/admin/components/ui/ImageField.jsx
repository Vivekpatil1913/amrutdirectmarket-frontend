import { useCallback, useEffect, useState } from 'react'
import { Image as ImageIcon, Search, UploadCloud, X } from 'lucide-react'
import { api } from '../../api/client.js'
import { mediaUrl } from '../../../services/config.js'
import { useMeta } from '../../context/MetaContext.jsx'
import { Modal } from './Modal.jsx'
import { Pager } from './Pager.jsx'
import { useToast } from './Toast.jsx'

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif'
const TYPES = ACCEPT.split(',')

// Client-side pre-check; the server re-validates type, size and file content.
export function checkImageFile(file, maxMb) {
  if (!TYPES.includes(file.type)) return 'Only JPEG, PNG, WebP or GIF images are allowed.'
  if (file.size > maxMb * 1024 * 1024) return `The image is larger than ${maxMb} MB.`
  return null
}

export function useImageUpload() {
  const toast = useToast()
  const { meta } = useMeta() ?? {}
  const maxMb = meta?.uploadMaxMb ?? 5
  const [progress, setProgress] = useState(null)

  const upload = useCallback(
    async (file, altText = '') => {
      const problem = checkImageFile(file, maxMb)
      if (problem) {
        toast.show(problem, 'bad')
        return null
      }
      const fd = new FormData()
      fd.append('alt_text', altText)
      fd.append('file', file)
      setProgress(0)
      try {
        const res = await api.upload('/admin/media/upload', fd, setProgress)
        toast.show('Image uploaded', 'ok')
        return res.data
      } catch (err) {
        toast.show(err.message || 'Upload failed', 'bad')
        return null
      } finally {
        setProgress(null)
      }
    },
    [maxMb, toast]
  )

  return { upload, progress, maxMb }
}

// One image slot: the value is { media_id, url }. Upload straight from here or
// pick something already in the media library.
export function ImageField({ label, value, onChange, required, hint, error }) {
  const { upload, progress, maxMb } = useImageUpload()
  const [picking, setPicking] = useState(false)
  const img = value ?? { media_id: null, url: '' }
  const busy = progress !== null

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const asset = await upload(file)
    if (asset) onChange({ media_id: asset.id, url: asset.url })
  }

  return (
    <div className={`a-field ${error ? 'has-error' : ''}`}>
      <label className={`a-label ${required ? 'a-label-required' : ''}`}>{label}</label>
      <div className="a-media-row" style={{ marginBottom: 0 }}>
        <div className="a-media-thumb">
          {img.url ? (
            <img src={mediaUrl(img.url)} alt="" />
          ) : (
            <span className="a-text-muted a-text-xs">No image</span>
          )}
        </div>
        <div className="a-media-actions">
          <label className={`a-btn a-btn-primary ${busy ? 'is-busy' : ''}`} aria-disabled={busy}>
            <UploadCloud size={16} /> {busy ? `Uploading… ${progress}%` : 'Upload image'}
            <input type="file" accept={ACCEPT} hidden onChange={onFile} disabled={busy} />
          </label>
          <button type="button" className="a-btn a-btn-secondary" onClick={() => setPicking(true)} disabled={busy}>
            <ImageIcon size={16} /> Choose from library
          </button>
          {img.media_id && !required && (
            <button type="button" className="a-btn a-btn-ghost" onClick={() => onChange({ media_id: null, url: '' })}>
              <X size={15} /> Remove
            </button>
          )}
          {busy && (
            <div className="a-progress" aria-label="Upload progress">
              <i style={{ width: `${progress}%` }} />
            </div>
          )}
          <span className="a-field-note">
            {hint ? `${hint} ` : ''}PNG, JPG, WebP or GIF, up to {maxMb} MB.
          </span>
        </div>
      </div>
      {error && <span className="a-field-error">{error}</span>}
      <MediaPicker
        open={picking}
        title={`Choose: ${label}`}
        onClose={() => setPicking(false)}
        onPick={asset => {
          onChange({ media_id: asset.id, url: asset.url })
          setPicking(false)
        }}
      />
    </div>
  )
}

// Media library browser with search, paging and an upload shortcut.
export function MediaPicker({ open, title, onClose, onPick }) {
  const toast = useToast()
  const { upload, progress } = useImageUpload()
  const [assets, setAssets] = useState([])
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    const q = new URLSearchParams({ page: String(page), limit: '18' })
    if (search.trim()) q.set('search', search.trim())
    api
      .get(`/admin/media?${q}`)
      .then(res => {
        setAssets(res.data)
        setMeta(res.meta)
      })
      .catch(err => toast.show(err.message || 'Could not load the media library', 'bad'))
      .finally(() => setLoading(false))
  }, [page, search, toast])

  useEffect(() => {
    if (!open) return undefined
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [open, load])

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const asset = await upload(file)
    if (asset) onPick(asset)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <>
          <button type="button" className="a-btn a-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <label className="a-btn a-btn-primary">
            <UploadCloud size={16} /> {progress !== null ? `Uploading… ${progress}%` : 'Upload new'}
            <input type="file" accept={ACCEPT} hidden onChange={onFile} disabled={progress !== null} />
          </label>
        </>
      }
    >
      <div className="a-search-wrap" style={{ marginBottom: '1rem', maxWidth: 'none' }}>
        <Search className="a-search-icon" size={16} />
        <input
          className="a-search"
          placeholder="Search by file name or alt text…"
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>
      {loading && assets.length === 0 ? (
        <div className="a-spinner">Loading…</div>
      ) : assets.length === 0 ? (
        <div className="a-empty-state">
          <p className="a-empty-title">No images found</p>
          <p className="a-text-muted a-text-sm">Upload an image to use it here.</p>
        </div>
      ) : (
        <>
          <div className="a-media-grid">
            {assets.map(a => (
              <button key={a.id} type="button" className="a-media-pick" onClick={() => onPick(a)} title={a.original_name}>
                <img src={mediaUrl(a.url)} alt={a.alt_text || a.original_name} loading="lazy" />
              </button>
            ))}
          </div>
          {meta && meta.totalPages > 1 && (
            <Pager page={meta.page} pageSize={meta.pageSize} total={meta.total} totalPages={meta.totalPages} onPage={setPage} />
          )}
        </>
      )}
    </Modal>
  )
}
