import { NavLink, useLocation } from 'react-router-dom'
import { LogOut, Store } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { NAV_GROUPS } from '../../config/navigation.js'
import { initials } from '../../lib/format.js'

// Sidebar from the reference admin: dark warm rail, grouped navigation,
// signed-in user and sign-out at the foot.
export function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const { user, logout, can } = useAdminAuth()
  const { pathname } = useLocation()

  // Exact match, or the deepest nav entry the path sits under — so
  // /admin/sections/settings lights "Site Settings", not "Page Sections".
  const all = NAV_GROUPS.flatMap(g => g.items.map(i => i.to))
  const activeTo = all
    .filter(to => pathname === to || pathname.startsWith(`${to}/`))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <>
      {mobileOpen && <div className="a-scrim visible" onClick={onMobileClose} />}

      <aside className={`a-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="a-sidebar-brand">
          <div className="a-sidebar-logo">
            <Store size={16} />
          </div>
          {!collapsed && (
            <div>
              <div className="a-sidebar-title">AMRUT Peth</div>
              <div className="a-sidebar-subtitle">CMS Admin</div>
            </div>
          )}
        </div>

        <nav className="a-sidebar-nav" aria-label="Admin navigation">
          {NAV_GROUPS.map(group => {
            const items = group.items.filter(i => !i.role || can(i.role))
            if (!items.length) return null
            return (
              <div key={group.label} className="a-nav-group">
                {!collapsed && <div className="a-nav-group-label">{group.label}</div>}
                {items.map(item => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end
                      className={`a-nav-item ${activeTo === item.to ? 'active' : ''}`}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className="a-nav-item-icon" size={18} />
                      {!collapsed && <span className="a-nav-item-label">{item.label}</span>}
                    </NavLink>
                  )
                })}
              </div>
            )
          })}
        </nav>

        <div className="a-sidebar-footer">
          <div className="a-sidebar-user">
            <div className="a-avatar">{initials(user?.name)}</div>
            {!collapsed && (
              <div className="a-sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--a-nav-fg-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.email}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={logout}
              className="a-action-btn muted"
              title="Sign out"
              aria-label="Sign out"
              style={{ flexShrink: 0, color: 'var(--a-nav-fg-muted)' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
