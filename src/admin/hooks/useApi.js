import { useCallback, useEffect, useRef, useState } from 'react'
import { api, buildQuery } from '../api/client.js'

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

const EMPTY_META = { total: 0, page: 1, pageSize: 10, totalPages: 1 }

// Paginated list. Responses that arrive after a newer request (fast typing in
// the search box) are ignored, so the table never shows stale results.
export function useList(endpoint, params = {}) {
  const [data, setData] = useState([])
  const [meta, setMeta] = useState(EMPTY_META)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const seq = useRef(0)
  const qs = buildQuery(params)

  const load = useCallback(async () => {
    const mine = ++seq.current
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`${endpoint}${qs}`)
      if (mine !== seq.current) return
      setData(res.data || [])
      setMeta(res.meta || EMPTY_META)
    } catch (e) {
      if (mine === seq.current) setError(e.message)
    } finally {
      if (mine === seq.current) setLoading(false)
    }
  }, [endpoint, qs])

  useEffect(() => {
    load()
  }, [load])

  return { data, meta, loading, error, refetch: load }
}

export function useResource(path) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!path) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(path)
      setData(res.data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    load()
  }, [load])

  return { data, setData, loading, error, refetch: load }
}

export function useMutation() {
  const [loading, setLoading] = useState(false)
  const mutate = useCallback(async fn => {
    setLoading(true)
    try {
      return await fn()
    } finally {
      setLoading(false)
    }
  }, [])
  return { mutate, loading }
}
