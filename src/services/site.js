import { API_BASE } from './config.js'

async function call(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: 'application/json', ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
      ...options,
    })
  } catch {
    throw Object.assign(new Error('network'), { status: 0 })
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw Object.assign(new Error(data?.error?.message || `HTTP ${res.status}`), {
      status: res.status,
      code: data?.error?.code,
      details: data?.error?.details || [],
    })
  }
  return data.data
}

// Everything the home page renders: published sections and collections.
export const fetchSiteContent = signal => call('/public/site', { signal })

export const submitEnquiry = payload =>
  call('/public/enquiries', { method: 'POST', body: JSON.stringify(payload) })
