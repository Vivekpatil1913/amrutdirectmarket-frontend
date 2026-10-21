import { useMemo, useState } from 'react'
import { Eye, Pencil, Plus, RefreshCw, RotateCcw, Search, Trash2 } from 'lucide-react'
import { api, fieldErrors } from '../api/client.js'
import { useDebounce, useList, useMutation } from '../hooks/useApi.js'
import { useMeta } from '../context/MetaContext.jsx'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { COLLECTION_UI } from '../config/collections.js'
import { DataTable } from '../components/ui/DataTable.jsx'
import { ConfirmModal, Modal } from '../components/ui/Modal.jsx'
import { Badge, Switch } from '../components/ui/Badge.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { blankValues, pickValues, SpecField, validateSpec } from '../components/ui/SpecField.jsx'
import { PageHeader, Tabs, ViewRow } from '../components/ui/ViewRow.jsx'
import { fmtStamp } from '../lib/format.js'
import Icon from '../../components/ui/Icon.jsx'

const StatusBadge = ({ status }) =>
  status === 'published' ? <Badge tone="ok">Published</Badge> : <Badge tone="warn">Draft</Badge>

// Generic list + add/edit/view/status/delete/restore screen for one content
// collection. Fields come from the server spec; columns from COLLECTION_UI.
export default function CollectionPage({ name }) {
  const ui = COLLECTION_UI[name]
  const { meta, error: metaError } = useMeta()
  const spec = meta?.collections?.[name]

  if (metaError) {
    return (
      <div className="a-notice a-notice-bad">
        <span className="a-notice-title">Could not load form definitions: {metaError}</span>
      </div>
    )
  }
  if (!spec) return <div className="a-spinner">Loading…</div>
  return <CollectionScreen key={name} name={name} ui={ui} spec={spec} meta={meta} />
}

function CollectionScreen({ name, ui, spec, meta }) {
  const toast = useToast()
  const { can } = useAdminAuth()
  const endpoint = `/admin/${name}`
  const [tab, setTab] = useState('active')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState({ key: 'display_order', order: 'asc' })
  const debouncedSearch = useDebounce(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [values, setValues] = useState(() => blankValues(spec.fields))
  const [errors, setErrors] = useState({})
  const [viewRow, setViewRow] = useState(null)
  const [confirm, setConfirm] = useState(null) // { type: 'delete'|'restore', row }
  const { mutate, loading: saving } = useMutation()

  const trash = tab === 'trash'
  const { data, meta: pageMeta, loading, error, refetch } = useList(endpoint, {
    page,
    limit,
    search: debouncedSearch,
    status,
    sort: sort.key,
    order: sort.order,
    trash: trash ? 'true' : '',
    ...filters,
  })

  const sectionLabel = useMemo(
    () => Object.fromEntries((meta.sectionTargets || []).map(t => [t.value, t.label])),
    [meta.sectionTargets]
  )
  const filterFields = spec.filters.map(key => spec.fields.find(f => f.key === key)).filter(Boolean)
  const entity = spec.entity
  const titleOf = row => row?.[spec.titleField] || row?.[`${spec.fields[0].key}_mr`] || row?.[spec.fields[0].key] || `#${row?.id}`

  const resetPage = fn => v => {
    fn(v)
    setPage(1)
  }

  function openNew() {
    setEditId(null)
    setValues(blankValues(spec.fields))
    setErrors({})
    setFormOpen(true)
  }

  async function openEdit(row) {
    try {
      const res = await api.get(`${endpoint}/${row.id}`)
      setEditId(row.id)
      setValues(pickValues(spec.fields, res.data))
      setErrors({})
      setFormOpen(true)
    } catch (err) {
      toast.show(err.message, 'bad')
    }
  }

  function setField(key, v) {
    setValues(cur => ({ ...cur, [key]: v }))
    if (errors[key]) setErrors(cur => ({ ...cur, [key]: undefined }))
  }

  async function handleSave(e) {
    e?.preventDefault()
    const clientErrors = validateSpec(spec.fields, values)
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors)
      toast.show('Please fix the highlighted fields', 'bad')
      return
    }
    await mutate(async () => {
      try {
        const body = { ...values, display_order: Number(values.display_order) || 0 }
        if (editId) {
          await api.put(`${endpoint}/${editId}`, body)
          toast.show(`${entity} updated`, 'ok')
        } else {
          await api.post(endpoint, body)
          toast.show(`${entity} created`, 'ok')
        }
        setFormOpen(false)
        refetch()
      } catch (err) {
        const fe = fieldErrors(err)
        setErrors(fe)
        toast.show(Object.keys(fe).length ? err.details[0].message : err.message, 'bad')
      }
    })
  }

  async function toggleStatus(row) {
    const next = row.status === 'published' ? 'draft' : 'published'
    await mutate(async () => {
      try {
        await api.patch(`${endpoint}/${row.id}/status`, { status: next })
        toast.show(next === 'published' ? 'Published — now visible on the website' : 'Moved to draft — hidden from the website', 'ok')
        refetch()
      } catch (err) {
        toast.show(err.message, 'bad')
      }
    })
  }

  async function runConfirm() {
    const { type, row } = confirm
    await mutate(async () => {
      try {
        if (type === 'delete') await api.del(`${endpoint}/${row.id}`)
        else await api.post(`${endpoint}/${row.id}/restore`)
        toast.show(type === 'delete' ? `${entity} moved to trash` : `${entity} restored`, 'ok')
        setConfirm(null)
        setViewRow(null)
        refetch()
      } catch (err) {
        toast.show(err.message, 'bad')
      }
    })
  }

  const renderCell = (col, row) => {
    const v = row[col.key]
    switch (col.kind) {
      case 'bi':
        return (
          <>
            <span className="td-bold">{row[`${col.key}_mr`] || '—'}</span>
            {row[`${col.key}_en`] && <span className="a-row-sub">{row[`${col.key}_en`]}</span>}
          </>
        )
      case 'section':
        return <Badge tone="info">{sectionLabel[v] || v}</Badge>
      case 'icon':
        return (
          <span className="a-flex-center a-gap-2">
            <Icon name={v} size={16} /> <span className="a-text-sm a-text-muted">{v}</span>
          </span>
        )
      case 'bool':
        return v ? <Badge tone="ok">Yes</Badge> : <span className="td-muted">No</span>
      case 'code':
        return <code className="a-code">{v}</code>
      case 'url':
        return (
          <a className="a-view-link td-truncate" href={v} target="_blank" rel="noopener noreferrer">
            {v}
          </a>
        )
      default:
        return <span className="td-bold">{v || '—'}</span>
    }
  }

  const columns = [
    ...ui.columns.map(col => ({
      key: col.sortable || col.key,
      label: col.label,
      sortable: Boolean(col.sortable),
      render: (_v, row) => renderCell(col, row),
    })),
    { key: 'display_order', label: 'Order', sortable: true, render: v => <span className="a-tabular">{v}</span> },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (v, row) =>
        trash ? (
          <StatusBadge status={v} />
        ) : (
          <span className="a-flex-center a-gap-2">
            <Switch on={v === 'published'} onToggle={() => toggleStatus(row)} disabled={saving} />
            <StatusBadge status={v} />
          </span>
        ),
    },
    trash
      ? { key: 'deleted_at', label: 'Deleted', render: v => <span className="a-text-sm">{fmtStamp(v)}</span> }
      : { key: 'updated_at', label: 'Last Updated', sortable: true, render: v => <span className="a-text-sm">{fmtStamp(v)}</span> },
  ]

  const toolbar = (
    <>
      <div className="a-search-wrap">
        <Search className="a-search-icon" size={16} />
        <input
          className="a-search"
          placeholder={`Search ${ui.title.toLowerCase()}…`}
          value={search}
          onChange={e => resetPage(setSearch)(e.target.value)}
          aria-label="Search"
        />
      </div>
      <select className="a-select" value={status} onChange={e => resetPage(setStatus)(e.target.value)} aria-label="Filter by status">
        <option value="">All statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      {filterFields.map(f => (
        <select
          key={f.key}
          className="a-select"
          value={filters[f.key] || ''}
          aria-label={`Filter by ${f.label}`}
          onChange={e => resetPage(setFilters)({ ...filters, [f.key]: e.target.value })}
        >
          <option value="">All {f.label.toLowerCase()}s</option>
          {f.options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      ))}
      <div className="a-toolbar-right">
        <button type="button" className="a-btn a-btn-ghost" onClick={refetch} title="Reload">
          <RefreshCw size={16} /> Refresh
        </button>
        {!trash && (
          <button type="button" className="a-btn a-btn-primary" onClick={openNew}>
            <Plus size={16} /> Add new
          </button>
        )}
      </div>
    </>
  )

  const hasFilters = Boolean(search || status || Object.values(filters).some(Boolean))

  return (
    <>
      <PageHeader title={ui.title} desc={ui.desc} />

      <Tabs
        value={tab}
        onChange={v => {
          setTab(v)
          setPage(1)
        }}
        tabs={[
          { value: 'active', label: 'Records' },
          { value: 'trash', label: 'Trash' },
        ]}
      />

      <DataTable
        columns={columns}
        rows={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        meta={pageMeta}
        onPage={setPage}
        onPageSize={n => {
          setLimit(n)
          setPage(1)
        }}
        sort={sort}
        onSort={(key, order) => setSort({ key, order })}
        toolbar={toolbar}
        emptyText={trash ? 'The trash is empty' : hasFilters ? 'Nothing matches these filters' : `No ${ui.title.toLowerCase()} yet`}
        emptyAction={
          hasFilters ? (
            <button
              type="button"
              className="a-btn a-btn-secondary a-mt-1"
              onClick={() => {
                setSearch('')
                setStatus('')
                setFilters({})
              }}
            >
              Clear filters
            </button>
          ) : null
        }
        actions={row => (
          <>
            <button type="button" className="a-action-btn" onClick={() => setViewRow(row)} title="View" aria-label="View">
              <Eye size={15} />
            </button>
            {!trash && (
              <button type="button" className="a-action-btn" onClick={() => openEdit(row)} title="Edit" aria-label="Edit">
                <Pencil size={15} />
              </button>
            )}
            {can('admin') &&
              (trash ? (
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

      {/* View */}
      <Modal
        open={!!viewRow}
        onClose={() => setViewRow(null)}
        title={`${entity} details`}
        size="lg"
        footer={
          <>
            <button type="button" className="a-btn a-btn-ghost" onClick={() => setViewRow(null)}>
              Close
            </button>
            {viewRow && !viewRow.deleted_at && (
              <button
                type="button"
                className="a-btn a-btn-primary"
                onClick={() => {
                  const row = viewRow
                  setViewRow(null)
                  openEdit(row)
                }}
              >
                <Pencil size={15} /> Edit
              </button>
            )}
          </>
        }
      >
        {viewRow && (
          <>
            <div className="a-view-tags">
              <StatusBadge status={viewRow.status} />
              {viewRow.deleted_at && <Badge tone="bad">In trash</Badge>}
            </div>
            <div className="a-view-list">
              {spec.fields
                .filter(f => f.key !== 'status')
                .flatMap(f =>
                  (f.bi ? ['mr', 'en'] : [null]).map(lang => {
                    const key = lang ? `${f.key}_${lang}` : f.key
                    const v = viewRow[key]
                    const label = lang ? `${f.label} (${lang === 'mr' ? 'Marathi' : 'English'})` : f.label
                    const shown =
                      f.type === 'boolean' ? (v ? 'Yes' : 'No')
                        : f.key === 'section' ? sectionLabel[v] || v
                          : v
                    return (
                      <ViewRow key={key} label={label} empty={shown === '' || shown == null}>
                        {f.type === 'url' ? (
                          <a className="a-view-link" href={v} target="_blank" rel="noopener noreferrer">
                            {v}
                          </a>
                        ) : f.key === 'icon' ? (
                          <span className="a-flex-center a-gap-2">
                            <Icon name={v} size={16} /> {v}
                          </span>
                        ) : (
                          String(shown)
                        )}
                      </ViewRow>
                    )
                  })
                )}
              <ViewRow label="Created">{fmtStamp(viewRow.created_at)}</ViewRow>
              <ViewRow label="Last updated">
                {fmtStamp(viewRow.updated_at)}
                {viewRow.updated_by_name ? ` by ${viewRow.updated_by_name}` : ''}
              </ViewRow>
              {viewRow.deleted_at && <ViewRow label="Deleted">{fmtStamp(viewRow.deleted_at)}</ViewRow>}
            </div>
          </>
        )}
      </Modal>

      {/* Add / Edit */}
      <Modal
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        title={editId ? `Edit ${entity.toLowerCase()}` : `New ${entity.toLowerCase()}`}
        size="lg"
        footer={
          <>
            <button type="button" className="a-btn a-btn-ghost" onClick={() => setFormOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" form="collection-form" className="a-btn a-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editId ? 'Save changes' : 'Create'}
            </button>
          </>
        }
      >
        <form id="collection-form" onSubmit={handleSave} noValidate>
          <div className="a-form-section">
            {spec.fields.map(f => (
              <SpecField key={f.key} field={f} values={values} errors={errors} onChange={setField} />
            ))}
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        loading={saving}
        title={confirm?.type === 'restore' ? `Restore ${entity.toLowerCase()}` : `Delete ${entity.toLowerCase()}`}
        message={
          confirm?.type === 'restore'
            ? `Restore “${titleOf(confirm?.row)}”?`
            : `Delete “${titleOf(confirm?.row)}”?`
        }
        subMessage={
          confirm?.type === 'restore'
            ? 'It returns to the list with its previous status.'
            : 'It is removed from the website and moved to the trash. It can be restored later.'
        }
        confirmLabel={confirm?.type === 'restore' ? 'Restore' : 'Delete'}
        busyLabel={confirm?.type === 'restore' ? 'Restoring…' : 'Deleting…'}
        tone={confirm?.type === 'restore' ? 'primary' : 'danger'}
      />
    </>
  )
}
