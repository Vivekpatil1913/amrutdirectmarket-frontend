import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, clearToken, getToken, setToken, UNAUTHORIZED_EVENT } from '../api/client.js'

const AdminAuthContext = createContext(null)

const RANK = { editor: 1, admin: 2, superadmin: 3 }

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    api
      .get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false))
  }, [])

  // Any 401 from an authenticated call means the session ended server-side.
  useEffect(() => {
    const onExpired = () => {
      clearToken()
      setExpired(true)
      setUser(null)
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onExpired)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onExpired)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setToken(res.data.token)
    setExpired(false)
    setUser(res.data.user)
    return res.data.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      /* the local session is cleared regardless */
    }
    clearToken()
    setUser(null)
  }, [])

  const updateUser = useCallback(updates => setUser(cur => (cur ? { ...cur, ...updates } : cur)), [])

  const value = useMemo(
    () => ({
      user,
      loading,
      expired,
      login,
      logout,
      updateUser,
      can: role => Boolean(user) && (RANK[user.role] ?? 0) >= RANK[role],
    }),
    [user, loading, expired, login, logout, updateUser]
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
