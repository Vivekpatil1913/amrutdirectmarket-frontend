import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, Rocket, Save, Undo2 } from 'lucide-react'
import { api, fieldErrors } from '../api/client.js'
import { useMutation, useResource } from '../hooks/useApi.js'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { ConfirmModal } from '../components/ui/Modal.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { SpecField, validateSpec } from '../components/ui/SpecField.jsx'
import { PageHeader } from '../components/ui/ViewRow.jsx'
import { ADMIN_ONLY_SECTIONS, SectionStatus } from './SectionsList.jsx'
import { RequireRole } from '../components/layout/AdminLayout.jsx'
import { useMeta } from '../context/MetaContext.jsx'
import { fmtStamp } from '../lib/format.js'

export default function SectionEdit() {
  const { key } = useParams()
  const page = <SectionEditor key={key} sectionKey={key} />
  return ADMIN_ONLY_SECTIONS.includes(key) ? <RequireRole role="admin">{page}</RequireRole> : page
}

function groupFields(fields) {
  const groups = []
  for (const f of fields) {
    const name = f.group || 'Content'
    let g = groups.find(x => x.name === name)
    if (!g) groups.push((g = { name, fields: [] }))
    g.fields.push(f)
  }
  return groups
}

function SectionEditor({ sectionKey }) {
  const navigate = useNavigate()
  const toast = useToast()
  const { meta } = useMeta()
  const { can } = useAdminAuth()
  const { data, setData, loading, error } = useResource(`/admin/sections/${sectionKey}`)
  const def = meta?.sections?.find(s => s.key === sectionKey)
  const [values, setValues] = useState(null)
  const [errors, setErrors] = useState({})
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const { mutate, loading: saving } = useMutation()

  useEffect(() => {
    if (data) setValues(data.draft)
  }, [data])

  const dirty = useMemo(() => Boolean(values && data) && JSON.stringify(values) !== JSON.stringify(data.draft), [values, data])

  // Warn before leaving the page with unsaved edits.
  useEffect(() => {
    if (!dirty) return undefined
    const warn = ev => {
      ev.preventDefault()
      ev.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  if (error) {
    return (
      <div className="a-notice a-notice-bad">
        <span className="a-notice-title">{error}</span>
      </div>
    )
  }
  if (loading || !values || !def) return <div className="a-spinner">Loading…</div>

  function setField(k, v) {
    setValues(cur => ({ ...cur, [k]: v }))
    if (errors[k]) setErrors(cur => ({ ...cur, [k]: undefined }))
  }

  async function save(publish) {
    const clientErrors = validateSpec(def.fields, values)
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      toast.show('Please fix the highlighted fields', 'bad')
      return
    }
    await mutate(async () => {
      try {
        const res = await api.put(`/admin/sections/${sectionKey}${publish ? '?publish=true' : ''}`, values)
        setData(res.data)
        setErrors({})
        toast.show(publish ? 'Saved and published — the website is updated' : 'Draft saved. Publish it to update the website.', 'ok')
      } catch (err) {
        setErrors(fieldErrors(err))
        toast.show(err.details?.[0]?.message || err.message, 'bad')
      }
    })
  }

  async function publishDraft() {
    await mutate(async () => {
      try {
        const res = await api.post(`/admin/sections/${sectionKey}/publish`)
        setData(res.data)
        toast.show('Published — the website is updated', 'ok')
      } catch (err) {
        toast.show(err.details?.[0]?.message || err.message, 'bad')
      }
    })
  }

  async function discard() {
    await mutate(async () => {
      try {
        const res = await api.post(`/admin/sections/${sectionKey}/discard`)
        setData(res.data)
        setConfirmDiscard(false)
        setErrors({})
        toast.show('Draft reset to the published version', 'ok')
      } catch (err) {
        toast.show(err.message, 'bad')
      }
    })
  }

  const statusRow = { is_published: data.is_published, has_unpublished_changes: data.has_unpublished_changes }

  return (
    <>
      <PageHeader title={def.title} desc={def.description}>
        <button type="button" className="a-btn a-btn-ghost" onClick={() => navigate('/admin/sections')}>
          <ArrowLeft size={16} /> All sections
        </button>
        <button type="button" className="a-btn a-btn-secondary" onClick={() => navigate(`/admin/sections/${sectionKey}/view`)}>
          <Eye size={16} /> View
        </button>
      </PageHeader>

      <div className="a-form-layout">
        <div className="a-form-main">
          {groupFields(def.fields).map(g => (
            <section key={g.name} className="a-card a-panel">
              <header className="a-panel-head">
                <h2 className="a-panel-title">{g.name}</h2>
              </header>
              <div className="a-panel-body a-form-section">
                {g.fields.map(f => (
                  <SpecField key={f.key} field={f} values={values} errors={errors} onChange={setField} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="a-form-side">
          <section className="a-card a-panel">
            <header className="a-panel-head">
              <h2 className="a-panel-title">Publishing</h2>
            </header>
            <div className="a-panel-body">
              <div className="a-view-tags">
                <SectionStatus row={statusRow} />
                {dirty && <span className="a-badge a-badge-warn">Unsaved edits</span>}
              </div>
              <p className="a-text-sm a-text-muted">
                Published: {fmtStamp(data.published_at)}
                <br />
                Last saved: {fmtStamp(data.updated_at)}
                {data.updated_by_name ? ` by ${data.updated_by_name}` : ''}
              </p>
              <p className="a-text-sm a-text-muted">
                <strong>Save draft</strong> keeps your changes without touching the live website. <strong>Save &amp; publish</strong> makes them live immediately.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <div className="a-save-bar">
        <span className="a-save-bar-state">
          {dirty ? 'You have unsaved changes' : data.has_unpublished_changes ? 'Draft saved — not yet published' : 'All changes are live'}
        </span>
        {data.has_unpublished_changes && data.is_published && !dirty && (
          <button type="button" className="a-btn a-btn-ghost" onClick={() => setConfirmDiscard(true)} disabled={saving}>
            <Undo2 size={16} /> Discard draft
          </button>
        )}
        {!dirty && data.has_unpublished_changes && (
          <button type="button" className="a-btn a-btn-secondary" onClick={publishDraft} disabled={saving}>
            <Rocket size={16} /> Publish draft
          </button>
        )}
        <button type="button" className="a-btn a-btn-secondary" onClick={() => save(false)} disabled={saving || !dirty}>
          <Save size={16} /> {saving ? 'Saving…' : 'Save draft'}
        </button>
        <button type="button" className="a-btn a-btn-primary" onClick={() => save(true)} disabled={saving || (!dirty && !data.has_unpublished_changes) || !can('editor')}>
          <Rocket size={16} /> {saving ? 'Saving…' : 'Save & publish'}
        </button>
      </div>

      <ConfirmModal
        open={confirmDiscard}
        onClose={() => setConfirmDiscard(false)}
        onConfirm={discard}
        loading={saving}
        title="Discard draft"
        message="Throw away the saved draft and start again from the published version?"
        subMessage="The live website is not affected."
        confirmLabel="Discard draft"
        busyLabel="Discarding…"
      />
    </>
  )
}
