import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchSiteContent } from '../services/site'
import { useLanguage } from '../i18n/LanguageContext'

// Loads the CMS content for the public site once per visit.
//
// The last successful response is kept in localStorage, so a returning visitor
// sees the real (previously published) content instantly and still gets the
// page if the API is briefly unreachable; fresh content replaces it as soon as
// the request completes.
const CACHE_KEY = 'amrut_peth_site_v1'

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const SiteContext = createContext(null)

export function SiteContentProvider({ children }) {
  const [state, setState] = useState(() => {
    const cached = readCache()
    return { data: cached, status: cached ? 'stale' : 'loading', error: null }
  })

  const load = useCallback(signal => {
    setState(s => ({ ...s, status: s.data ? 'stale' : 'loading', error: null }))
    fetchSiteContent(signal)
      .then(data => {
        setState({ data, status: 'ready', error: null })
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data))
        } catch {
          /* storage full or unavailable */
        }
      })
      .catch(error => {
        if (error.name === 'AbortError') return
        setState(s => ({ ...s, status: s.data ? 'offline' : 'error', error }))
      })
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    load(ctrl.signal)
    return () => ctrl.abort()
  }, [load])

  const value = useMemo(() => ({ ...state, reload: () => load() }), [state, load])
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside SiteContentProvider')
  return ctx
}

// Turns { title_mr, title_en, … } into { title, … } for the active language,
// falling back to Marathi (the primary language) when English is empty.
export function localize(record, lang) {
  if (!record) return null
  const out = {}
  for (const [key, value] of Object.entries(record)) {
    const m = key.match(/^(.*)_(mr|en)$/)
    if (!m) {
      out[key] = value
      continue
    }
    const base = m[1]
    out[base] = record[`${base}_${lang}`] || record[`${base}_mr`] || ''
  }
  return out
}

// A published page section, localised; {} until content has loaded.
export function useSection(key) {
  const { data } = useSite()
  const { lang } = useLanguage()
  return useMemo(() => localize(data?.sections?.[key], lang) ?? {}, [data, key, lang])
}

// A published collection, localised; [] until content has loaded.
export function useCollection(key) {
  const { data } = useSite()
  const { lang } = useLanguage()
  return useMemo(() => (data?.collections?.[key] ?? []).map(r => localize(r, lang)), [data, key, lang])
}
