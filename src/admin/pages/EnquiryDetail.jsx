import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Save, Trash2 } from 'lucide-react'
import { api } from '../api/client.js'
import { useMutation, useResource } from '../hooks/useApi.js'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { ConfirmModal } from '../components/ui/Modal.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { PageHeader, ViewRow } from '../components/ui/ViewRow.jsx'
import { ENQUIRY_STATUS, fmtStamp } from '../lib/format.js'
import { EnquiryBadge } from './Enquiries.jsx'

export default function EnquiryDetail() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { can } = useAdminAuth()
  const { data, setData, loading, error } = useResource(`/admin/enquiries/${id}${params.get('trash') ? '?trash=true' : ''}`)
  const [status, setStatus] = useState('new')
  const [notes, setNotes] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { mutate, loading: saving } = useMutation()

  useEffect(() => {
    if (data) {
      setStatus(data.status)
      setNotes(data.admin_notes || '')
    }
  }, [data])

  if (error) return <div className="a-notice a-notice-bad"><span className="a-notice-title">{error}</span></div>
  if (loading || !data) return <div className="a-spinner">Loading…</div>

  const deleted = Boolean(data.deleted_at)
  const dirty = status !== data.status || notes !== (data.admin_notes || '')

  async function save() {
    if (notes.length > 2000) {
      toast.show('Notes must be at most 2000 characters', 'bad')
      return
    }
    await mutate(async () => {
      try {
        const res = await api.patch(`/admin/enquiries/${id}`, { status, admin_notes: notes })
        setData(res.data)
        toast.show('Enquiry updated', 'ok')
      } catch (err) {
        toast.show(err.details?.[0]?.message || err.message, 'bad')
      }
    })
  }

  async function remove() {
    await mutate(async () => {
      try {
        await api.del(`/admin/enquiries/${id}`)
        toast.show('Enquiry moved to trash', 'ok')
        navigate('/admin/enquiries')
      } catch (err) {
        toast.show(err.message, 'bad')
      }
    })
  }

  return (
    <>
      <PageHeader title={`Enquiry from ${data.name}`} desc={`Received ${fmtStamp(data.created_at)}`}>
        <button type="button" className="a-btn a-btn-ghost" onClick={() => navigate('/admin/enquiries')}>
          <ArrowLeft size={16} /> All enquiries
        </button>
        {!deleted && can('admin') && (
          <button type="button" className="a-btn a-btn-danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} /> Delete
          </button>
        )}
      </PageHeader>

      <div className="a-detail-grid">
        <div className="a-detail-main">
          <section className="a-card a-panel">
            <header className="a-panel-head"><h2 className="a-panel-title">Enquiry</h2></header>
            <div className="a-panel-body a-view-list">
              <ViewRow label="Name"><span className="a-view-strong">{data.name}</span></ViewRow>
              <ViewRow label="Email">
                <a className="a-view-link" href={`mailto:${data.email}`}><Mail size={13} /> {data.email}</a>
              </ViewRow>
              <ViewRow label="Mobile" empty={!data.phone}>
                <a className="a-view-link" href={`tel:+91${data.phone}`}><Phone size={13} /> {data.phone}</a>
              </ViewRow>
              <ViewRow label="Subject">{data.subject_label} <span className="a-text-muted">({data.subject_code})</span></ViewRow>
              <ViewRow label="Message"><span style={{ whiteSpace: 'pre-wrap' }}>{data.message}</span></ViewRow>
              <ViewRow label="Consent given">{data.consent ? 'Yes' : 'No'}</ViewRow>
              <ViewRow label="Site language">{data.language === 'en' ? 'English' : 'Marathi'}</ViewRow>
            </div>
          </section>
        </div>

        <aside className="a-detail-side">
          <section className="a-card a-panel">
            <header className="a-panel-head"><h2 className="a-panel-title">Follow-up</h2></header>
            <div className="a-panel-body a-form-section">
              <div className="a-view-tags">
                <EnquiryBadge status={data.status} />
                {deleted && <Badge tone="bad">In trash</Badge>}
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="enq-status">Status</label>
                <select id="enq-status" className="a-input" value={status} onChange={e => setStatus(e.target.value)} disabled={deleted}>
                  {Object.entries(ENQUIRY_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="a-field">
                <label className="a-label" htmlFor="enq-notes">Internal notes</label>
                <textarea id="enq-notes" className="a-input a-textarea" rows={5} maxLength={2000} value={notes} onChange={e => setNotes(e.target.value)} disabled={deleted} placeholder="Visible to CMS users only" />
                <span className="a-field-note">{notes.length}/2000</span>
              </div>
              {!deleted && (
                <button type="button" className="a-btn a-btn-primary" onClick={save} disabled={saving || !dirty}>
                  <Save size={16} /> {saving ? 'Saving…' : 'Save'}
                </button>
              )}
              <p className="a-text-xs a-text-muted">
                {data.reviewed_at ? `Last reviewed ${fmtStamp(data.reviewed_at)}${data.reviewed_by_name ? ` by ${data.reviewed_by_name}` : ''}` : 'Not reviewed yet'}
              </p>
            </div>
          </section>
        </aside>
      </div>

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={remove}
        loading={saving}
        title="Delete enquiry"
        message={`Delete the enquiry from ${data.name}?`}
      />
    </>
  )
}
