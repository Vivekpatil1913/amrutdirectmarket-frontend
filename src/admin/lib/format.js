export const fmtStamp = v => (v ? new Date(v).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—')

export const fmtDate = v => (v ? new Date(v).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—')

export const fmtBytes = n => {
  if (!n && n !== 0) return '—'
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export const ENQUIRY_STATUS = {
  new: { label: 'New', tone: 'warn', color: '#d96922' },
  reviewed: { label: 'Reviewed', tone: 'info', color: '#2563eb' },
  actioned: { label: 'Actioned', tone: 'ok', color: '#16a36a' },
  archived: { label: 'Archived', tone: 'neutral', color: '#94a3b8' },
}

export const ROLE_LABEL = { superadmin: 'Super Admin', admin: 'Admin', editor: 'Editor' }

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A'
