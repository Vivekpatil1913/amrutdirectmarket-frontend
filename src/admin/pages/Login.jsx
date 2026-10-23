import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Store } from 'lucide-react'
import { useAdminAuth } from '../context/AdminAuthContext.jsx'
import { AdminSpinner } from '../components/layout/AdminLayout.jsx'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AdminLogin() {
  const { user, loading: checking, login, expired } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState(false)

  const target = location.state?.from && location.state.from !== '/admin/login' ? location.state.from : '/admin/dashboard'

  if (checking) return <AdminSpinner />
  if (user) return <Navigate to={target} replace />

  const emailError = touched && !EMAIL_RE.test(form.email.trim()) ? 'Enter a valid email address' : ''
  const passwordError = touched && !form.password ? 'Password is required' : ''

  async function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    setError('')
    if (!EMAIL_RE.test(form.email.trim()) || !form.password) return
    setLoading(true)
    try {
      await login(form.email.trim(), form.password)
      navigate(target, { replace: true })
    } catch (err) {
      setError(err.message || 'Sign-in failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-root a-login-root">
      <div className="a-login-card">
        <div className="a-login-band">
          <div className="a-login-logo">
            <Store size={24} />
          </div>
          <h1 className="a-login-heading">AMRUT Peth Direct Market CMS</h1>
          <p className="a-login-sub">Sign in to manage the Direct Market website</p>
        </div>

        <form className="a-login-body" onSubmit={handleSubmit} noValidate>
          {expired && !error && (
            <div className="a-notice a-notice-warn" style={{ marginBottom: '1rem' }}>
              <span className="a-notice-title">Your session has ended. Please sign in again.</span>
            </div>
          )}
          {error && (
            <div className="a-notice a-notice-bad" role="alert" style={{ marginBottom: '1rem' }}>
              <span className="a-notice-title">{error}</span>
            </div>
          )}

          <div className="a-form-grid" style={{ gap: '1rem' }}>
            <div className={`a-field ${emailError ? 'has-error' : ''}`}>
              <label className="a-label a-label-required" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="a-input"
                placeholder="admin@amritpeth.local"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                autoComplete="username"
                autoFocus
              />
              {emailError && <span className="a-field-error">{emailError}</span>}
            </div>

            <div className={`a-field ${passwordError ? 'has-error' : ''}`}>
              <label className="a-label a-label-required" htmlFor="password">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  className="a-input"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-muted)', display: 'flex' }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordError && <span className="a-field-error">{passwordError}</span>}
            </div>
          </div>

          <button type="submit" className="a-btn a-btn-primary" style={{ width: '100%', marginTop: '1.25rem', height: '2.75rem' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>

          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--a-muted)' }}>
            <a href="/" style={{ color: 'var(--a-accent)' }}>
              ← Back to website
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
