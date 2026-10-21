import { useState } from 'react'
import { Eye, EyeOff, Pencil, Plus, RefreshCw, RotateCcw, Search, Trash2 } from 'lucide-react'
import { api, fieldErrors } from '../api/client.js'
import { useDebounce, useList, useMutation } from '../hooks/useApi.js'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { DataTable } from '../components/ui/DataTable.jsx'
import { ConfirmModal, Modal } from '../components/ui/Modal.jsx'
import { Badge, Switch } from '../components/ui/Badge.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { PageHeader, Tabs } from '../components/ui/ViewRow.jsx'
import { fmtStamp, ROLE_LABEL } from '../lib/format.js'

const EMPTY = { name: '', email: '', role: 'editor', is_active: true, password: '' }
const ROLE_DESC = {
  superadmin: 'Everything, including managing admin users',
  admin: 'All content, settings, deleting and restoring records',
  editor: 'Create, edit and publish content; cannot delete or change settings',
}

function validate(form, isNew) {
  const e = {}
  if (form.name.trim().length < 2) e.name = 'Name must contain at least 2 characters'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address'
  if (isNew || form.password) {
    if (form.password.length < 8) e.password = 'Password must contain at least 8 characters'
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password)) e.password = 'Password must contain a letter and a number'
  }
  return e
}

export default function Users() {
  const toast = useToast()
  const { user: me } = useAdminAuth()
  const [tab, setTab] = useState('active')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [active, setActive] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [confirm, setConfirm] = useState(null)
  const debounced = useDebounce(search)
  const { mutate, loading: saving } = useMutation()
  const trash = tab === 'trash'

  const { data, meta, loading, error, refetch } = useList('/admin/users', {
    page, limit, search: debounced, role, active, trash: trash ? 'true' : '',
  })

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }))
  }

  function openNew() {
    setEditId(null)
    setForm(EMPTY)
    setErrors({})
    setShowPwd(false)
    setFormOpen(true)
  }

  function openEdit(row) {
    setEditId(row.id)
    setForm({ name: row.name, email: row.email, role: row.role, is_active: row.is_active, password: '' })
    setErrors({})
    setShowPwd(false)
    setFormOpen(true)
  }

  async function save(e) {
    e?.preventDefault()
    const errs = validate(form, !editId)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    await mutate(async () => {
      try {
        const body = { ...form, name: form.name.trim(), email: form.email.trim() }
        if (editId) await api.put(`/admin/users/${editId}`, body)
        else await api.post('/admin/users', body)
        toast.show(editId ? 'User updated' : 'User created', 'ok')
        setFormOpen(false)
        refetch()
      } catch (err) {
        setErrors(fieldErrors(err))
        toast.show(err.details?.[0]?.message || err.message, 'bad')
      }
    })
  }

  async function runConfirm() {
    const { type, row } = confirm
    await mutate(async () => {
      try {
        if (type === 'delete') await api.del(`/admin/users/${row.id}`)
        else await api.post(`/admin/users/${row.id}/restore`)
        toast.show(type === 'delete' ? 'User deleted' : 'User restored (inactive — activate to allow sign-in)', 'ok')
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
      render: (v, r) => (
        <>
          <span className="td-bold">{v}{r.id === me?.id && <span className="a-text-muted"> (you)</span>}</span>
          <span className="a-row-sub">{r.email}</span>
        </>
      ),
    },
    { key: 'role', label: 'Role', render: v => <Badge tone={v === 'superadmin' ? 'accent' : v === 'admin' ? 'info' : 'neutral'}>{ROLE_LABEL[v]}</Badge> },
    {
      key: 'is_active',
      label: 'Status',
      render: (v, r) => (
        <>
          <Badge tone={v ? 'ok' : 'neutral'}>{v ? 'Active' : 'Inactive'}</Badge>
          {r.locked_until && new Date(r.locked_until) > new Date() && <Badge tone="bad">Locked</Badge>}
        </>
      ),
    },
    { key: 'last_login_at', label: 'Last sign-in', render: v => <span className="a-text-sm">{fmtStamp(v)}</span> },
    { key: 'created_at', label: 'Created', render: v => <span className="a-text-sm">{fmtStamp(v)}</span> },
  ]

  return (
    <>
      <PageHeader title="Admin Users" desc="People who can sign in to this CMS and what they may do." />
      <Tabs value={tab} onChange={v => { setTab(v); setPage(1) }} tabs={[{ value: 'active', label: 'Users' }, { value: 'trash', label: 'Deleted' }]} />
      <DataTable
        columns={columns}
        rows={data}
        loading={loading}
        error={error}
        onRetry={refetch}
        meta={meta}
        onPage={setPage}
        onPageSize={n => { setLimit(n); setPage(1) }}
        emptyText={trash ? 'No deleted users' : 'No users match these filters'}
        toolbar={
          <>
            <div className="a-search-wrap">
              <Search className="a-search-icon" size={16} />
              <input className="a-search" placeholder="Search name or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} aria-label="Search" />
            </div>
            <select className="a-select" value={role} onChange={e => { setRole(e.target.value); setPage(1) }} aria-label="Filter by role">
              <option value="">All roles</option>
              {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select className="a-select" value={active} onChange={e => { setActive(e.target.value); setPage(1) }} aria-label="Filter by status">
              <option value="">Active and inactive</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <div className="a-toolbar-right">
              <button type="button" className="a-btn a-btn-ghost" onClick={refetch}><RefreshCw size={16} /> Refresh</button>
              {!trash && <button type="button" className="a-btn a-btn-primary" onClick={openNew}><Plus size={16} /> Add user</button>}
            </div>
          </>
        }
        actions={row => (
          <>
            {!trash && (
              <button type="button" className="a-action-btn" onClick={() => openEdit(row)} title="Edit" aria-label="Edit"><Pencil size={15} /></button>
            )}
            {trash ? (
              <button type="button" className="a-action-btn success" onClick={() => setConfirm({ type: 'restore', row })} title="Restore" aria-label="Restore"><RotateCcw size={15} /></button>
            ) : row.id !== me?.id && (
              <button type="button" className="a-action-btn danger" onClick={() => setConfirm({ type: 'delete', row })} title="Delete" aria-label="Delete"><Trash2 size={15} /></button>
            )}
          </>
        )}
      />

      <Modal
        open={formOpen}
        onClose={() => !saving && setFormOpen(false)}
        title={editId ? 'Edit user' : 'New user'}
        footer={
          <>
            <button type="button" className="a-btn a-btn-ghost" onClick={() => setFormOpen(false)} disabled={saving}>Cancel</button>
            <button type="submit" form="user-form" className="a-btn a-btn-primary" disabled={saving}>{saving ? 'Saving…' : editId ? 'Save changes' : 'Create user'}</button>
          </>
        }
      >
        <form id="user-form" className="a-form-section" onSubmit={save} noValidate>
          <div className={`a-field ${errors.name ? 'has-error' : ''}`}>
            <label className="a-label a-label-required" htmlFor="u-name">Name</label>
            <input id="u-name" className="a-input" maxLength={100} value={form.name} onChange={e => set('name', e.target.value)} />
            {errors.name && <span className="a-field-error">{errors.name}</span>}
          </div>
          <div className={`a-field ${errors.email ? 'has-error' : ''}`}>
            <label className="a-label a-label-required" htmlFor="u-email">Email</label>
            <input id="u-email" type="email" className="a-input" maxLength={255} value={form.email} onChange={e => set('email', e.target.value)} />
            {errors.email && <span className="a-field-error">{errors.email}</span>}
          </div>
          <div className="a-field">
            <label className="a-label a-label-required" htmlFor="u-role">Role</label>
            <select id="u-role" className="a-input" value={form.role} onChange={e => set('role', e.target.value)}>
              {Object.entries(ROLE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <span className="a-field-note">{ROLE_DESC[form.role]}</span>
          </div>
          <div className={`a-field ${errors.password ? 'has-error' : ''}`}>
            <label className={`a-label ${editId ? '' : 'a-label-required'}`} htmlFor="u-pwd">{editId ? 'New password' : 'Password'}</label>
            <div style={{ position: 'relative' }}>
              <input id="u-pwd" type={showPwd ? 'text' : 'password'} className="a-input" maxLength={128} autoComplete="new-password" value={form.password} onChange={e => set('password', e.target.value)} style={{ paddingRight: '2.5rem' }} placeholder={editId ? 'Leave empty to keep the current password' : ''} />
              <button type="button" onClick={() => setShowPwd(s => !s)} aria-label={showPwd ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-muted)', display: 'flex' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password ? <span className="a-field-error">{errors.password}</span> : <span className="a-field-note">At least 8 characters with a letter and a number.</span>}
          </div>
          <div className="a-field">
            <span className="a-label">Active</span>
            <div className="a-flex-center a-gap-2">
              <Switch on={form.is_active} onToggle={() => set('is_active', !form.is_active)} disabled={editId === me?.id} />
              <span className="a-text-sm a-text-muted">{form.is_active ? 'Can sign in' : 'Cannot sign in'}</span>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        loading={saving}
        title={confirm?.type === 'restore' ? 'Restore user' : 'Delete user'}
        message={confirm?.type === 'restore' ? `Restore ${confirm?.row?.email}?` : `Delete ${confirm?.row?.email}?`}
        subMessage={confirm?.type === 'restore' ? 'The account is restored inactive; activate it to allow sign-in.' : 'They are signed out immediately and can no longer sign in. The account can be restored.'}
        confirmLabel={confirm?.type === 'restore' ? 'Restore' : 'Delete'}
        busyLabel={confirm?.type === 'restore' ? 'Restoring…' : 'Deleting…'}
        tone={confirm?.type === 'restore' ? 'primary' : 'danger'}
      />
    </>
  )
}
