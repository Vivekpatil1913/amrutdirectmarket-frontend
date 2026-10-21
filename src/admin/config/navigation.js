import {
  Activity, BadgeCheck, Building2, ClipboardList, Contact2, FileText, Footprints, Image, Inbox,
  LayoutDashboard, LayoutTemplate, Link2, ListChecks, Menu, Settings, Sparkles, Tags, Users, Zap,
} from 'lucide-react'
import { COLLECTION_UI } from './collections.js'

const c = key => ({ to: `/admin/content/${key}`, label: COLLECTION_UI[key].title })

// Sidebar groups; `role` hides an item from users below that role (the server
// enforces the same rule).
export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    label: 'Website',
    items: [
      { to: '/admin/sections', icon: LayoutTemplate, label: 'Page Sections' },
      { ...c('nav-items'), icon: Menu },
      { ...c('hero-facts'), icon: BadgeCheck },
      { ...c('quick-links'), icon: Zap },
    ],
  },
  {
    label: 'Market Content',
    items: [
      { ...c('categories'), icon: Tags },
      { ...c('highlights'), icon: Sparkles },
      { ...c('eligibility-groups'), icon: Users },
      { ...c('participation-steps'), icon: Footprints },
    ],
  },
  {
    label: 'Enquiries',
    items: [
      { to: '/admin/enquiries', icon: Inbox, label: 'Enquiries' },
      { ...c('enquiry-subjects'), icon: ListChecks },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/sections/settings', icon: Settings, label: 'Site Settings & SEO', role: 'admin' },
      { to: '/admin/sections/contact', icon: Contact2, label: 'Contact Details', role: 'admin' },
      { ...c('social-links'), icon: Link2 },
      { to: '/admin/media', icon: Image, label: 'Media Library' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/admin/users', icon: Building2, label: 'Admin Users', role: 'superadmin' },
      { to: '/admin/activity', icon: Activity, label: 'Activity Log', role: 'admin' },
    ],
  },
]

const EXTRA = [
  { to: '/admin/profile', label: 'My Profile', group: 'Account', icon: ClipboardList },
  { to: '/admin/enquiries/', label: 'Enquiry Details', group: 'Enquiries', icon: FileText },
]

// Breadcrumb trail for the current path: longest matching nav entry wins.
export function trailFor(pathname) {
  const entries = [
    ...NAV_GROUPS.flatMap(g => g.items.map(i => ({ to: i.to, label: i.label, group: g.label }))),
    ...EXTRA,
  ].sort((a, b) => b.to.length - a.to.length)
  const hit = entries.find(e => pathname === e.to || pathname.startsWith(e.to.endsWith('/') ? e.to : `${e.to}/`))
  return hit ? [hit.group, hit.label] : ['Admin', 'Admin']
}
