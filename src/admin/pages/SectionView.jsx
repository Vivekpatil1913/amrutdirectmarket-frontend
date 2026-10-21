import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react'
import { useResource } from '../hooks/useApi.js'
import { useMeta } from '../context/MetaContext.jsx'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { mediaUrl } from '../../services/config.js'
import { PageHeader, Tabs, ViewRow } from '../components/ui/ViewRow.jsx'
import { ADMIN_ONLY_SECTIONS, SectionStatus } from './SectionsList.jsx'
import { fmtStamp } from '../lib/format.js'

function Value({ field, value }) {
  if (field.type === 'image') {
    return value?.url ? <img src={mediaUrl(value.url)} alt="" className="a-view-image" /> : null
  }
  if (field.type === 'boolean') return value ? 'Yes' : 'No'
  if (field.type === 'url') {
    return (
      <a className="a-view-link" href={value} target="_blank" rel="noopener noreferrer">
        {value} <ExternalLink size={13} />
      </a>
    )
  }
  return <span style={{ whiteSpace: 'pre-wrap' }}>{value}</span>
}

// Read-only view of a section: the live (published) copy or the working draft.
export default function SectionView() {
  const { key } = useParams()
  const navigate = useNavigate()
  const { meta } = useMeta()
  const { can } = useAdminAuth()
  const { data, loading, error } = useResource(`/admin/sections/${key}`)
  const [which, setWhich] = useState('published')
  const def = meta?.sections?.find(s => s.key === key)

  if (error) return <div className="a-notice a-notice-bad"><span className="a-notice-title">{error}</span></div>
  if (loading || !data || !def) return <div className="a-spinner">Loading…</div>

  const values = which === 'published' ? data.published : data.draft
  const canEdit = !ADMIN_ONLY_SECTIONS.includes(key) || can('admin')
  const isEmpty = v => v === '' || v == null || (typeof v === 'object' && !v.url)

  return (
    <>
      <PageHeader title={def.title} desc={def.description}>
        <button type="button" className="a-btn a-btn-ghost" onClick={() => navigate('/admin/sections')}>
          <ArrowLeft size={16} /> All sections
        </button>
        {canEdit && (
          <button type="button" className="a-btn a-btn-primary" onClick={() => navigate(`/admin/sections/${key}`)}>
            <Pencil size={16} /> Edit
          </button>
        )}
      </PageHeader>

      <div className="a-view-tags">
        <SectionStatus row={data} />
        <span className="a-text-sm a-text-muted">
          Published {fmtStamp(data.published_at)} · Last saved {fmtStamp(data.updated_at)}
        </span>
      </div>

      <Tabs
        value={which}
        onChange={setWhich}
        tabs={[
          { value: 'published', label: 'Live on website' },
          { value: 'draft', label: data.has_unpublished_changes ? 'Draft (unpublished changes)' : 'Draft' },
        ]}
      />

      <div className="a-card a-panel">
        <div className="a-panel-body a-view-list">
          {def.fields.flatMap(f =>
            (f.bi ? ['mr', 'en'] : [null]).map(lang => {
              const k = lang ? `${f.key}_${lang}` : f.key
              const label = lang ? `${f.label} (${lang === 'mr' ? 'Marathi' : 'English'})` : f.label
              return (
                <ViewRow key={k} label={label} empty={f.type !== 'boolean' && isEmpty(values[k])}>
                  <Value field={f} value={values[k]} />
                </ViewRow>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}
