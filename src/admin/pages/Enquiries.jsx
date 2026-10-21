import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, RefreshCw, RotateCcw, Search, Trash2 } from 'lucide-react'
import { api } from '../api/client.js'
import { useDebounce, useList, useMutation, useResource } from '../hooks/useApi.js'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { ConfirmModal } from '../components/ui/Modal.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { PageHeader, Tabs } from '../components/ui/ViewRow.jsx'
import { ENQUIRY_STATUS, fmtStamp } from '../lib/format.js'

export const EnquiryBadge = ({ status }) => (
  <Badge tone={ENQUIRY_STATUS[status]?.tone || 'neutral'}>{ENQUIRY_STATUS[status]?.label || status}</Badge>
)

export default function Enquiries() {
  const navigate = useNavigate()
  const toast = useToast()
  const { can } = useAdminAuth()
  const [tab, setTab] = useState('active')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [subject, setSubject] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [sort, setSort] = useState({ key: 'created_at', order: 'desc' })
  const [confirm, setConfirm] = useState(null)
  const debouncedSearch = useDebounce(search)
  const { mutate, loading: busy } = useMutation()
  const trash = tab === 'trash'

  const subjects = useResource('/admin/enquiry-subjects?limit=100&sort=display_order')
  const { data, meta, loading, error, refetch } = useList('/admin/enquiries', {
    page, limit, search: debouncedSearch, status, subject, from, to,
    sort: sort.key, order: sort.order, trash: trash ? 'true' : '',
  })

  const reset = fn => v => {
    fn(v)
    setPage(1)
  }
  const hasFilters = Boolean(search || status || subject || from || to)

  async function runConfirm() {
    const { type, row } = confirm
    await mutate(async () => {
      try {
        if (type === 'delete') await api.del(`/admin/enquiries/${row.id}`)
        else await api.post(`/admin/enquiries/${row.id}/restore`)
        toast.show(type === 'delete' ? 'Enquiry moved to trash' : 'Enquiry restored', 'ok')
        setConfirm(null)
        refetch()
      } catch (err) {
        toast.show(err.message, 'bad')
      }
    })
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (v, r) => (
        <>
          <span className="td-bold">{v}</span>
          <span className="a-row-sub">{r.email}{r.phone ? ` · ${r.phone}` : ''}</span>
        </>
      ),
    },
    { key: 'subject_label', label: 'Subject', render: v => v || '—' },
    { key: 'message', label: 'Message', render: v => <span className="td-truncate" title={v}>{v}</span> },
    { key: 'status', label: 'Status', sortable: true, render: v => <EnquiryBadge status={v} /> },
    { key: 'created_at', label: 'Received', sortable: true, render: v => <span className="a-text-sm">{fmtStamp(v)}</span> },
  ]

  return (
    <>
      <PageHeader title="Enquiries" desc="Registration and contact enquiries submitted from the website." />
      <Tabs value={tab} onChange={reset(setTab)} tabs={[{ value: 'active', label: 'Inbox' }, { value: 'trash', label: 'Trash' }]} />
      <DataTable
        columns={columns}
        rows={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        meta={meta}
        onPage={setPage}
        onPageSize={n => { setLimit(n); setPage(1) }}
        sort={sort}
        onSort={(key, order) => setSort({ key, order })}
        emptyText={trash ? 'The trash is empty' : hasFilters ? 'No enquiries match these filters' : 'No enquiries yet'}
        emptyAction={hasFilters ? (
          <button type="button" className="a-btn a-btn-secondary a-mt-1" onClick={() => { setSearch(''); setStatus(''); setSubject(''); setFrom(''); setTo('') }}>
            Clear filters
          </button>
        ) : null}
        toolbar={
          <>
            <div className="a-search-wrap">
              <Search className="a-search-icon" size={16} />
              <input className="a-search" placeholder="Search name, email, phone, message…" value={search} onChange={e => reset(setSearch)(e.target.value)} aria-label="Search" />
            </div>
            <select className="a-select" value={status} onChange={e => reset(setStatus)(e.target.value)} aria-label="Filter by status">
              <option value="">All statuses</option>
              {Object.entries(ENQUIRY_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className="a-select" value={subject} onChange={e => reset(setSubject)(e.target.value)} aria-label="Filter by subject">
              <option value="">All subjects</option>
              {(subjects.data || []).map(s => <option key={s.id} value={s.code}>{s.label_en || s.label_mr}</option>)}
            </select>
            <input type="date" className="a-input a-input-date" value={from} max={to || undefined} onChange={e => reset(setFrom)(e.target.value)} aria-label="Received from" title="Received from" />
            <input type="date" className="a-input a-input-date" value={to} min={from || undefined} onChange={e => reset(setTo)(e.target.value)} aria-label="Received to" title="Received to" />
            <div className="a-toolbar-right">
              <button type="button" className="a-btn a-btn-ghost" onClick={refetch}><RefreshCw size={16} /> Refresh</button>
            </div>
          </>
        }
        actions={row => (
          <>
            <button type="button" className="a-action-btn" onClick={() => navigate(`/admin/enquiries/${row.id}${trash ? '?trash=true' : ''}`)} title="View" aria-label="View">
              <Eye size={15} />
            </button>
            {can('admin') && (trash ? (
              <button type="button" className="a-action-btn success" onClick={() => setConfirm({ type: 'restore', row })} title="Restore" aria-label="Restore">
                <RotateCcw size={15} />
              </button>
            ) : (
              <button type="button" className="a-action-btn danger" onClick={() => setConfirm({ type: 'delete', row })} title="Delete" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            ))}
          </>
        )}
      />
      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        loading={busy}
        title={confirm?.type === 'restore' ? 'Restore enquiry' : 'Delete enquiry'}
        message={confirm?.type === 'restore' ? `Restore the enquiry from ${confirm?.row?.name}?` : `Delete the enquiry from ${confirm?.row?.name}?`}
        subMessage={confirm?.type === 'restore' ? 'It returns to the inbox.' : undefined}
        confirmLabel={confirm?.type === 'restore' ? 'Restore' : 'Delete'}
        busyLabel={confirm?.type === 'restore' ? 'Restoring…' : 'Deleting…'}
        tone={confirm?.type === 'restore' ? 'primary' : 'danger'}
      />
    </>
  )
}
