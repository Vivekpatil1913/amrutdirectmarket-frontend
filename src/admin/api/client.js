import { API_BASE } from '../../services/config.js'

const TOKEN_KEY = 'ap_admin_token'
let _token = null

export function setToken(t) {
  _token = t
  try { localStorage.setItem(TOKEN_KEY, t) } catch { /* private mode */ }
}
export function getToken() {
  if (_token) return _token
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}
export function clearToken() {
  _token = null
  try { localStorage.removeItem(TOKEN_KEY) } catch { /* ignore */ }
}

// Fired when an authenticated call comes back 401 (expired or revoked
// session); AdminAuthContext listens and returns the user to the login page.
export const UNAUTHORIZED_EVENT = 'ap-admin-unauthorized'

function toError(res, data) {
  const err = new Error(data?.error?.message || `Request failed (HTTP ${res.status})`)
  err.status = res.status
  err.code = data?.error?.code
  err.details = data?.error?.details || []
  return err
}

async function request(method, path, body) {
  const token = getToken()
  const headers = { Accept: 'application/json' }
  if (body != null) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body == null ? undefined : JSON.stringify(body),
    })
  } catch {
    const err = new Error('Cannot reach the server. Check your connection and try again.')
    err.status = 0
    throw err
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && token && !path.startsWith('/auth/login')) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw toError(res, data)
  }
  return data
}

// Multipart upload with progress (fetch cannot report upload progress).
function upload(path, formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE}${path}`)
    xhr.withCredentials = true
    const token = getToken()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.upload.onprogress = e => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let data = {}
      try { data = JSON.parse(xhr.responseText) } catch { /* non-JSON */ }
      if (xhr.status >= 200 && xhr.status < 300) return resolve(data)
      if (xhr.status === 401) window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
      reject(toError({ status: xhr.status }, data))
    }
    xhr.onerror = () => reject(Object.assign(new Error('Upload failed — cannot reach the server.'), { status: 0 }))
    xhr.send(formData)
  })
}

export const api = {
  get: path => request('GET', path),
  post: (path, body) => request('POST', path, body ?? {}),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  del: path => request('DELETE', path),
  upload,
}

export function buildQuery(params = {}) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== '' && v !== null && v !== undefined) q.set(k, String(v))
  }
  const s = q.toString()
  return s ? `?${s}` : ''
}

// Turns a 422 response's details into { field: message } for inline display.
export function fieldErrors(err) {
  const out = {}
  for (const d of err?.details || []) if (d.field && !out[d.field]) out[d.field] = d.message
  return out
}
