import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, RefreshCw, Rocket, Search, Undo2 } from 'lucide-react'
import { api } from '../api/client.js'
import { useMutation, useResource } from '../hooks/useApi.js'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { ConfirmModal } from '../components/ui/Modal.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { PageHeader } from '../components/ui/ViewRow.jsx'
import { fmtStamp } from '../lib/format.js'

export const ADMIN_ONLY_SECTIONS = ['settings', 'contact']

export function SectionStatus({ row }) {
  if (!row.is_published) return <Badge tone="warn">Never published</Badge>
  if (row.has_unpublished_changes) return <Badge tone="info">Draft changes</Badge>
  return <Badge tone="ok">Published</Badge>
}

// The website's single-record blocks (hero, about, footer …). Each has a
// working draft and a published copy; the site only ever shows the latter.
export default function SectionsList() {
  const navigate = useNavigate()
  const toast = useToast()
  const { can } = useAdminAuth()
  const { data, loading, error, refetch } = useResource('/admin/sections')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [discardKey, setDiscardKey] = useState(null)
  const { mutate, loading: busy } = useMutation()

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (data || [])
      .map(r => ({ ...r, id: r.key, state: !r.is_published ? 'never' : r.has_unpublished_changes ? 'draft' : 'published' }))
      .filter(r => !status || r.state === status)
      .filter(r => !q || `${r.title} ${r.description}`.toLowerCase().includes(q))
  }, [data, search, status])

  const editable = key => !ADMIN_ONLY_SECTIONS.includes(key) || can('admin')

  async function publish(key) {
    await mutate(async () => {
      try {
        await api.post(`/admin/sections/${key}/publish`)
        toast.show('Published — the website is updated', 'ok')
        refetch()
      } catch (err) {
        toast.show(err.details?.[0] ? `${err.details[0].field}: ${err.details[0].message}` : err.message, 'bad')
      }
    })
  }

  async function discard() {
    await mutate(async () => {
      try {
        await api.post(`/admin/sections/${discardKey}/discard`)
        toast.show('Draft reset to the published version', 'ok')
        setDiscardKey(null)
        refetch()
      } catch (err) {
        toast.show(err.message, 'bad')
      }
    })
  }

  const columns = [
    {
      key: 'title',
      label: 'Section',
      render: (v, r) => (
        <>
          <span className="td-bold">{v}</span>
          <span className="a-row-sub">{r.description}</span>
        </>
      ),
    },
    { key: 'fields', label: 'Fields', render: v => <span className="a-tabular">{v}</span> },
    { key: 'state', label: 'Status', render: (_v, r) => <SectionStatus row={r} /> },
    { key: 'published_at', label: 'Published', render: v => <span className="a-text-sm">{fmtStamp(v)}</span> },
    {
      key: 'updated_at',
      label: 'Last Updated',
      render: (v, r) => (
        <span className="a-text-sm">
          {fmtStamp(v)}
          {r.updated_by_name && <span className="a-row-sub">by {r.updated_by_name}</span>}
        </span>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Page Sections" desc="Edit the content blocks of the home page. Changes are saved as a draft until you publish them." />
      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        error={error}
        onRetry={refetch}
        meta={{ total: rows.length, page: 1, pageSize: Math.max(rows.length, 1), totalPages: 1 }}
        onPage={() => {}}
        emptyText="Nothing matches these filters"
        toolbar={
          <>
            <div className="a-search-wrap">
              <Search className="a-search-icon" size={16} />
              <input className="a-search" placeholder="Search sections…" value={search} onChange={e => setSearch(e.target.value)} aria-label="Search" />
            </div>
            <select className="a-select" value={status} onChange={e => setStatus(e.target.value)} aria-label="Filter by status">
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft changes</option>
              <option value="never">Never published</option>
            </select>
            <div className="a-toolbar-right">
              <button type="button" className="a-btn a-btn-ghost" onClick={refetch}>
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </>
        }
        actions={r => (
          <>
            <button type="button" className="a-action-btn" onClick={() => navigate(`/admin/sections/${r.key}/view`)} title="View" aria-label="View">
              <Eye size={15} />
            </button>
            {editable(r.key) && (
              <>
                <button type="button" className="a-action-btn" onClick={() => navigate(`/admin/sections/${r.key}`)} title="Edit" aria-label="Edit">
                  <Pencil size={15} />
                </button>
                {r.state !== 'published' && (
                  <button type="button" className="a-action-btn success" onClick={() => publish(r.key)} disabled={busy} title="Publish draft" aria-label="Publish draft">
                    <Rocket size={15} />
                  </button>
                )}
                {r.state === 'draft' && (
                  <button type="button" className="a-action-btn danger" onClick={() => setDiscardKey(r.key)} title="Discard draft" aria-label="Discard draft">
                    <Undo2 size={15} />
                  </button>
                )}
              </>
            )}
          </>
        )}
      />
      <ConfirmModal
        open={!!discardKey}
        onClose={() => setDiscardKey(null)}
        onConfirm={discard}
        loading={busy}
        title="Discard draft"
        message="Throw away the draft and start again from the published version?"
        subMessage="The live website is not affected."
        confirmLabel="Discard draft"
        busyLabel="Discarding…"
      />
    </>
  )
}
