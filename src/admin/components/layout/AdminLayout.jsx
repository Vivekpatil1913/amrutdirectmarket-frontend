import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Sidebar } from './Sidebar.jsx'
import { Topbar } from './Topbar.jsx'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { MetaProvider } from '../../context/MetaContext.jsx'

const COLLAPSE_KEY = 'ap_sidebar_collapsed'

export function AdminSpinner() {
  return (
    <div className="admin-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
      <div className="a-spinner">
        <Loader2 className="a-spin" size={20} />
        Loading…
      </div>
    </div>
  )
}

// Guards every admin page: unauthenticated visitors go to the login screen
// (remembering where they were heading).
export function AdminLayout() {
  const { user, loading } = useAdminAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === 'true'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) return <AdminSpinner />
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname + location.search }} />

  function toggleCollapsed() {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(COLLAPSE_KEY, String(next))
    } catch {
      /* ignore */
    }
  }

  return (
    <MetaProvider>
      <div className="admin-root a-shell">
        <Sidebar collapsed={collapsed} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className={`a-body ${collapsed ? 'collapsed' : ''}`}>
          <Topbar collapsed={collapsed} onToggle={toggleCollapsed} onMobileMenu={() => setMobileOpen(true)} />
          <main className="a-main">
            <Outlet />
          </main>
        </div>
      </div>
    </MetaProvider>
  )
}

// Wraps pages restricted to a role; the API enforces the same rule.
export function RequireRole({ role, children }) {
  const { can } = useAdminAuth()
  if (!can(role)) {
    return (
      <div className="a-card">
        <div className="a-empty-state">
          <p className="a-empty-title">You do not have access to this page</p>
          <p className="a-text-muted a-text-sm">Ask a super admin if you need it.</p>
        </div>
      </div>
    )
  }
  return children
}
