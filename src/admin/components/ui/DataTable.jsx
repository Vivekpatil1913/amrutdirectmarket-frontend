import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, DatabaseBackup, Loader2 } from 'lucide-react'
import { Pager } from './Pager.jsx'

// Table card from the reference admin. Columns marked `sortable` get a header
// button; `sort` / `onSort` are controlled by the page so sorting happens on
// the server across all pages, not just the visible one.
export function DataTable({
  columns,
  rows,
  loading,
  error,
  meta,
  onPage,
  onPageSize,
  toolbar,
  actions,
  sort,
  onSort,
  emptyText = 'No records found',
  emptyAction,
  onRetry,
  sno = true,
}) {
  const page = meta?.page || 1
  const pageSize = meta?.pageSize || 10
  const total = meta?.total || 0
  const totalPages = meta?.totalPages || 1

  const header = col => {
    if (!col.sortable || !onSort) return col.label
    const active = sort?.key === col.key
    const Icon = !active ? ArrowUpDown : sort.order === 'asc' ? ArrowUp : ArrowDown
    return (
      <button
        type="button"
        className="a-th-sort"
        onClick={() => onSort(col.key, active && sort.order === 'asc' ? 'desc' : 'asc')}
        aria-label={`Sort by ${col.label}`}
      >
        {col.label}
        <Icon size={13} className={active ? '' : 'a-text-muted'} />
      </button>
    )
  }

  return (
    <div className="a-card">
      {toolbar && <div className="a-toolbar">{toolbar}</div>}

      {error ? (
        <div className="a-empty-state">
          <AlertCircle className="a-empty-icon" style={{ color: 'var(--a-bad)' }} />
          <p className="a-empty-title">Failed to load data</p>
          <p className="a-text-muted a-text-sm">{error}</p>
          {onRetry && (
            <button type="button" className="a-btn a-btn-secondary a-mt-1" onClick={onRetry}>
              Try again
            </button>
          )}
        </div>
      ) : loading && rows.length === 0 ? (
        <div className="a-spinner">
          <Loader2 className="a-spin" size={20} />
          <span>Loading…</span>
        </div>
      ) : rows.length === 0 ? (
        <div className="a-empty-state">
          <DatabaseBackup className="a-empty-icon" />
          <p className="a-empty-title">{emptyText}</p>
          {emptyAction}
        </div>
      ) : (
        <>
          <div className="a-table-scroll" style={loading ? { opacity: 0.55, transition: 'opacity .15s' } : undefined}>
            <table className="a-table">
              <thead>
                <tr>
                  {sno && <th className="td-sno">Sr No</th>}
                  {columns.map(col => (
                    <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                      {header(col)}
                    </th>
                  ))}
                  {actions && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id ?? i}>
                    {sno && <td className="td-sno">{(page - 1) * pageSize + i + 1}</td>}
                    {columns.map(col => (
                      <td key={col.key} className={col.className || ''}>
                        {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                      </td>
                    ))}
                    {actions && <td className="td-actions">{actions(row)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pager page={page} pageSize={pageSize} total={total} totalPages={totalPages} onPage={onPage} onPageSize={onPageSize} />
        </>
      )}
    </div>
  )
}
