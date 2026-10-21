import { useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { useDebounce, useList } from '../hooks/useApi.js'
import { DataTable } from '../components/ui/DataTable.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { PageHeader } from '../components/ui/ViewRow.jsx'
import { fmtStamp } from '../lib/format.js'

export const ACTION_TONE = {
  create: 'ok', update: 'info', publish: 'accent', status: 'info', delete: 'bad',
  restore: 'warn', discard: 'warn', upload: 'ok', login: 'neutral',
}
const ACTIONS = Object.keys(ACTION_TONE)

export default function ActivityLog() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(25)
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('')
  const debounced = useDebounce(search)
  const { data, meta, loading, error, refetch } = useList('/admin/activity', { page, limit, search: debounced, action })

  const columns = [
    { key: 'created_at', label: 'When', render: v => <span className="a-text-sm">{fmtStamp(v)}</span> },
    { key: 'user_name', label: 'User', render: v => <span className="td-bold">{v || '—'}</span> },
    { key: 'action', label: 'Action', render: v => <Badge tone={ACTION_TONE[v] || 'neutral'}>{v}</Badge> },
    { key: 'entity', label: 'Module', render: v => <code className="a-code">{v}</code> },
    { key: 'summary', label: 'Details' },
  ]

  return (
    <>
      <PageHeader title="Activity Log" desc="Who changed what, and when. Read-only." />
      <DataTable
        columns={columns}
        rows={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        meta={meta}
        onPage={setPage}
        onPageSize={n => { setLimit(n); setPage(1) }}
        emptyText="No activity recorded"
        toolbar={
          <>
            <div className="a-search-wrap">
              <Search className="a-search-icon" size={16} />
              <input className="a-search" placeholder="Search details or user…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} aria-label="Search" />
            </div>
            <select className="a-select" value={action} onChange={e => { setAction(e.target.value); setPage(1) }} aria-label="Filter by action">
              <option value="">All actions</option>
              {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <div className="a-toolbar-right">
              <button type="button" className="a-btn a-btn-ghost" onClick={refetch}><RefreshCw size={16} /> Refresh</button>
            </div>
          </>
        }
      />
    </>
  )
}
