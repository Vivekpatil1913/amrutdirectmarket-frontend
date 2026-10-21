// Central API configuration for the public site and the admin panel.
//
// VITE_API_URL defaults to the same-origin path "/api/v1": in development the
// Vite dev server proxies it to the backend (see vite.config.js), and in
// production the site is expected behind the same host or VITE_API_URL is set
// to the backend's absolute URL at build time.
export const API_BASE = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/$/, '')

// Media URLs come back from the API as "/uploads/...". With an absolute API URL
// they live on the backend's origin; otherwise they are same-origin too.
const API_ORIGIN = /^https?:\/\//i.test(API_BASE) ? new URL(API_BASE).origin : ''

export function mediaUrl(url) {
  if (!url) return ''
  return /^(https?:|blob:|data:)/i.test(url) ? url : `${API_ORIGIN}${url}`
}
