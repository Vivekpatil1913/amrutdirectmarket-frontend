import { useState } from 'react'
import { KeyRound, Save } from 'lucide-react'
import { api, fieldErrors } from '../api/client.js'
import { useMutation } from '../hooks/useApi.js'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { PageHeader } from '../components/ui/ViewRow.jsx'
import { ROLE_LABEL } from '../lib/format.js'

function Field({ id, label, error, required, children, note }) {
  return (
    <div className={`a-field ${error ? 'has-error' : ''}`}>
      <label className={`a-label ${required ? 'a-label-required' : ''}`} htmlFor={id}>{label}</label>
      {children}
      {error ? <span className="a-field-error">{error}</span> : note ? <span className="a-field-note">{note}</span> : null}
    </div>
  )
}

export default function Profile() {
  const toast = useToast()
  const { user, updateUser } = useAdminAuth()
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' })
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [pErr, setPErr] = useState({})
  const [wErr, setWErr] = useState({})
  const saveProfile = useMutation()
  const savePwd = useMutation()

  async function onProfile(e) {
    e.preventDefault()
    const errs = {}
    if (profile.name.trim().length < 2) errs.name = 'Name must contain at least 2 characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) errs.email = 'Enter a valid email address'
    setPErr(errs)
    if (Object.keys(errs).length) return
    await saveProfile.mutate(async () => {
      try {
        const res = await api.put('/auth/profile', { name: profile.name.trim(), email: profile.email.trim() })
        updateUser(res.data)
        toast.show('Profile updated', 'ok')
      } catch (err) {
        setPErr(fieldErrors(err))
        toast.show(err.details?.[0]?.message || err.message, 'bad')
      }
    })
  }

  async function onPassword(e) {
    e.preventDefault()
    const errs = {}
    if (!pwd.currentPassword) errs.currentPassword = 'Current password is required'
    if (pwd.newPassword.length < 8) errs.newPassword = 'Password must contain at least 8 characters'
    else if (!/[A-Za-z]/.test(pwd.newPassword) || !/[0-9]/.test(pwd.newPassword)) errs.newPassword = 'Password must contain a letter and a number'
    if (pwd.confirm !== pwd.newPassword) errs.confirm = 'Passwords do not match'
    setWErr(errs)
    if (Object.keys(errs).length) return
    await savePwd.mutate(async () => {
      try {
        await api.post('/auth/change-password', { currentPassword: pwd.currentPassword, newPassword: pwd.newPassword })
        setPwd({ currentPassword: '', newPassword: '', confirm: '' })
        toast.show('Password changed. Other sessions were signed out.', 'ok')
      } catch (err) {
        setWErr(fieldErrors(err))
        toast.show(err.details?.[0]?.message || err.message, 'bad')
      }
    })
  }

  return (
    <>
      <PageHeader title="My Profile" desc={`Signed in as ${ROLE_LABEL[user?.role] || user?.role}.`} />
      <div className="a-detail-grid">
        <form className="a-card a-panel" onSubmit={onProfile} noValidate>
          <header className="a-panel-head"><h2 className="a-panel-title">Account details</h2></header>
          <div className="a-panel-body a-form-section">
            <Field id="p-name" label="Name" required error={pErr.name}>
              <input id="p-name" className="a-input" maxLength={100} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </Field>
            <Field id="p-email" label="Email" required error={pErr.email}>
              <input id="p-email" type="email" className="a-input" maxLength={255} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
            </Field>
            <div>
              <button type="submit" className="a-btn a-btn-primary" disabled={saveProfile.loading}>
                <Save size={16} /> {saveProfile.loading ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </div>
        </form>

        <form className="a-card a-panel" onSubmit={onPassword} noValidate>
          <header className="a-panel-head"><h2 className="a-panel-title">Change password</h2></header>
          <div className="a-panel-body a-form-section">
            <Field id="w-cur" label="Current password" required error={wErr.currentPassword}>
              <input id="w-cur" type="password" className="a-input" autoComplete="current-password" value={pwd.currentPassword} onChange={e => setPwd({ ...pwd, currentPassword: e.target.value })} />
            </Field>
            <Field id="w-new" label="New password" required error={wErr.newPassword} note="At least 8 characters with a letter and a number.">
              <input id="w-new" type="password" className="a-input" autoComplete="new-password" maxLength={128} value={pwd.newPassword} onChange={e => setPwd({ ...pwd, newPassword: e.target.value })} />
            </Field>
            <Field id="w-conf" label="Confirm new password" required error={wErr.confirm}>
              <input id="w-conf" type="password" className="a-input" autoComplete="new-password" maxLength={128} value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} />
            </Field>
            <div>
              <button type="submit" className="a-btn a-btn-primary" disabled={savePwd.loading}>
                <KeyRound size={16} /> {savePwd.loading ? 'Saving…' : 'Change password'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
