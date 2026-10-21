import { useEffect } from 'react'
import { useSection } from '../../content/SiteContent'
import { mediaUrl } from '../../services/config'

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!content) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const absolute = url => (url ? new URL(mediaUrl(url), window.location.origin).href : '')

// Applies the CMS's site settings to <head>: title, description, keywords,
// social-sharing tags and favicon. index.html keeps static defaults for
// crawlers that do not run JavaScript.
export default function SiteHead() {
  const s = useSection('settings')

  useEffect(() => {
    if (!s.site_title) return
    document.title = s.site_title
    setMeta('name', 'description', s.meta_description)
    setMeta('name', 'keywords', s.meta_keywords)
    setMeta('property', 'og:title', s.og_title || s.site_title)
    setMeta('property', 'og:description', s.og_description || s.meta_description)
    setMeta('property', 'og:image', absolute(s.og_image))
    setMeta('property', 'og:url', window.location.origin + window.location.pathname)
    setMeta('name', 'twitter:card', s.og_image ? 'summary_large_image' : 'summary')

    if (s.favicon) {
      let link = document.head.querySelector('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = mediaUrl(s.favicon)
    }
  }, [s])

  return null
}
