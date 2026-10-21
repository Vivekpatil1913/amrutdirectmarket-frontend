import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'

// Field specs and option lists the admin forms are rendered from, loaded once
// per session from GET /admin/meta so the UI always matches server validation.
const MetaContext = createContext(null)

export function MetaProvider({ children }) {
  const [state, setState] = useState({ meta: null, error: null })

  useEffect(() => {
    let alive = true
    api
      .get('/admin/meta')
      .then(res => alive && setState({ meta: res.data, error: null }))
      .catch(err => alive && setState({ meta: null, error: err.message }))
    return () => {
      alive = false
    }
  }, [])

  return <MetaContext.Provider value={state}>{children}</MetaContext.Provider>
}

export function useMeta() {
  return useContext(MetaContext)
}
