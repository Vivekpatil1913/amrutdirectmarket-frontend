import { useState } from 'react'
import { Copy, Pencil, RefreshCw, RotateCcw, Search, Trash2, UploadCloud } from 'lucide-react'
import { api } from '../api/client.js'
import { useDebounce, useList, useMutation } from '../hooks/useApi.js'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { ConfirmModal, Modal } from '../components/ui/Modal.jsx'
import { Pager } from '../components/ui/Pager.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { useImageUpload } from '../components/ui/ImageField.jsx'
import { PageHeader, Tabs, ViewRow } from '../components/ui/ViewRow.jsx'
import { mediaUrl } from '../../services/config.js'
import { fmtBytes, fmtStamp } from '../lib/format.js'
import { DatabaseBackup, Loader2 } from 'lucide-react'

const TYPES = [
  { value: '', label: 'All types' },
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
  { value: 'image/gif', label: 'GIF' },
]

export default function Media() {
  const toast = useToast()
  const { can } = useAdminAuth()
  const [tab, setTab] = useState('active')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(24)
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [selected, setSelected] = useState(null)
  const [alt, setAlt] = useState('')
  const [confirm, setConfirm] = useState(null)
  const debounced = useDebounce(search)
  const { upload, progress, maxMb } = useImageUpload()
  const { mutate, loading: busy } = useMutation()
  const trash = tab === 'trash'

  const { data, meta, loading, error, refetch } = useList('/admin/media', {
    page, limit, search: debounced, type, trash: trash ? 'true' : '',
  })

  async function onFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const asset = await upload(file)
    if (asset) {
      setPage(1)
      refetch()
    }
  }

  async function openDetails(asset) {
    try {
      const res = await api.get(`/admin/media/${asset.id}`)
      setSelected(res.data)
      setAlt(res.data.alt_text || '')
    } catch (err) {
      toast.show(err.message, 'bad')
    }
  }

  async function saveAlt() {
    await mutate(async () => {
      try {
        await api.put(`/admin/media/${selected.id}`, { alt_text: alt })
        toast.show('Alt text saved', 'ok')
        setSelected(null)
        refetch()
      } catch (err) {
        toast.show(err.details?.[0]?.message || err.message, 'bad')
      }
    })
  }

  async function runConfirm() {
    const { type: action, asset } = confirm
    await mutate(async () => {
      try {
        if (action === 'delete') await api.del(`/admin/media/${asset.id}`)
        else await api.post(`/admin/media/${asset.id}/restore`)
        toast.show(action === 'delete' ? 'Image moved to trash' : 'Image restored', 'ok')
        setConfirm(null)
        setSelected(null)
        refetch()
      } catch (err) {
        toast.show(err.message, 'bad')
        setConfirm(null)
      }
    })
  }

  return (
    <>
      <PageHeader title="Media Library" desc={`Images used across the website. JPEG, PNG, WebP or GIF up to ${maxMb} MB.`}>
        <label className="a-btn a-btn-primary">
          <UploadCloud size={16} /> {progress !== null ? `Uploading… ${progress}%` : 'Upload image'}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={onFile} disabled={progress !== null} />
        </label>
      </PageHeader>
      {progress !== null && <div className="a-progress" style={{ marginBottom: '1rem' }}><i style={{ width: `${progress}%` }} /></div>}

      <Tabs value={tab} onChange={v => { setTab(v); setPage(1) }} tabs={[{ value: 'active', label: 'Library' }, { value: 'trash', label: 'Trash' }]} />

      <div className="a-card">
        <div className="a-toolbar">
          <div className="a-search-wrap">
            <Search className="a-search-icon" size={16} />
            <input className="a-search" placeholder="Search file name or alt text…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} aria-label="Search" />
          </div>
          <select className="a-select" value={type} onChange={e => { setType(e.target.value); setPage(1) }} aria-label="Filter by type">
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <div className="a-toolbar-right">
            <button type="button" className="a-btn a-btn-ghost" onClick={refetch}><RefreshCw size={16} /> Refresh</button>
          </div>
        </div>

        {error ? (
          <div className="a-empty-state">
            <p className="a-empty-title">Failed to load media</p>
            <p className="a-text-muted a-text-sm">{error}</p>
            <button type="button" className="a-btn a-btn-secondary a-mt-1" onClick={refetch}>Try again</button>
          </div>
        ) : loading && data.length === 0 ? (
          <div className="a-spinner"><Loader2 className="a-spin" size={20} /> Loading…</div>
        ) : data.length === 0 ? (
          <div className="a-empty-state">
            <DatabaseBackup className="a-empty-icon" />
            <p className="a-empty-title">{trash ? 'The trash is empty' : 'No images found'}</p>
          </div>
        ) : (
          <>
            <div className="a-media-library">
              {data.map(a => (
                <figure key={a.id} className="a-media-card">
                  <button type="button" className="a-media-card-img" onClick={() => openDetails(a)} title="Details">
                    <img src={mediaUrl(a.url)} alt={a.alt_text || a.original_name} loading="lazy" />
                  </button>
                  <figcaption>
                    <span className="a-media-card-name" title={a.original_name}>{a.original_name}</span>
                    <span className="a-text-xs a-text-muted">{fmtBytes(a.size_bytes)} · {fmtStamp(a.created_at)}</span>
                    <span className="a-media-card-actions">
                      {!trash && (
                        <button type="button" className="a-action-btn" onClick={() => openDetails(a)} title="Edit alt text" aria-label="Edit alt text"><Pencil size={14} /></button>
                      )}
                      {can('admin') && (trash ? (
                        <button type="button" className="a-action-btn success" onClick={() => setConfirm({ type: 'restore', asset: a })} title="Restore" aria-label="Restore"><RotateCcw size={14} /></button>
                      ) : (
                        <button type="button" className="a-action-btn danger" onClick={() => setConfirm({ type: 'delete', asset: a })} title="Delete" aria-label="Delete"><Trash2 size={14} /></button>
                      ))}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <Pager page={meta.page} pageSize={meta.pageSize} total={meta.total} totalPages={meta.totalPages} onPage={setPage} onPageSize={n => { setLimit(n); setPage(1) }} />
          </>
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Image details"
        size="lg"
        footer={
          <>
            <button type="button" className="a-btn a-btn-ghost" onClick={() => setSelected(null)}>Close</button>
            {selected && !selected.deleted_at && (
              <button type="button" className="a-btn a-btn-primary" onClick={saveAlt} disabled={busy || alt.length > 300}>{busy ? 'Saving…' : 'Save alt text'}</button>
            )}
          </>
        }
      >
        {selected && (
          <div className="a-form-section">
            <img src={mediaUrl(selected.url)} alt={selected.alt_text} className="a-view-image" style={{ maxHeight: '18rem' }} />
            <div className="a-view-list">
              <ViewRow label="File">{selected.original_name}</ViewRow>
              <ViewRow label="Type / size">{selected.mime_type} · {fmtBytes(selected.size_bytes)}</ViewRow>
              <ViewRow label="URL">
                <span className="a-flex-center a-gap-2">
                  <code className="a-code">{selected.url}</code>
                  <button type="button" className="a-action-btn" title="Copy URL" aria-label="Copy URL"
                    onClick={() => navigator.clipboard?.writeText(mediaUrl(selected.url)).then(() => toast.show('URL copied', 'ok'), () => toast.show('Copy failed', 'bad'))}>
                    <Copy size={14} />
                  </button>
                </span>
              </ViewRow>
              <ViewRow label="Uploaded">{fmtStamp(selected.created_at)}</ViewRow>
              <ViewRow label="Used by" empty={!selected.usage?.length}>
                {selected.usage?.map(u => `${u.title}${u.published ? ' (live)' : ' (draft)'}`).join(', ')}
              </ViewRow>
            </div>
            {!selected.deleted_at && (
              <div className="a-field">
                <label className="a-label" htmlFor="media-alt">Alt text</label>
                <input id="media-alt" className="a-input" maxLength={300} value={alt} onChange={e => setAlt(e.target.value)} placeholder="Describe the image for screen readers" />
                <span className="a-field-note">{alt.length}/300</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        loading={busy}
        title={confirm?.type === 'restore' ? 'Restore image' : 'Delete image'}
        message={confirm?.type === 'restore' ? `Restore “${confirm?.asset?.original_name}”?` : `Delete “${confirm?.asset?.original_name}”?`}
        subMessage={confirm?.type === 'restore' ? 'It returns to the media library.' : 'Images still used by a page section cannot be deleted. Deleted images can be restored.'}
        confirmLabel={confirm?.type === 'restore' ? 'Restore' : 'Delete'}
        busyLabel={confirm?.type === 'restore' ? 'Restoring…' : 'Deleting…'}
        tone={confirm?.type === 'restore' ? 'primary' : 'danger'}
      />
    </>
  )
}
