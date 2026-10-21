// Admin presentation for each content collection. Form fields come from the
// server (/admin/meta); this file only decides titles and table columns.
//
// Column kinds: bi (Marathi + English under it) | text | code | section | icon
//               | url | bool

export const COLLECTION_UI = {
  'nav-items': {
    title: 'Navigation Menu',
    desc: 'Header and footer menu links to the home-page sections.',
    columns: [
      { key: 'label', label: 'Label', kind: 'bi', sortable: 'label_en' },
      { key: 'section', label: 'Target', kind: 'section' },
      { key: 'show_in_header', label: 'Header', kind: 'bool' },
      { key: 'show_in_footer', label: 'Footer', kind: 'bool' },
    ],
  },
  'hero-facts': {
    title: 'Hero Facts',
    desc: 'The facts strip under the hero buttons (Organised by, Open to …).',
    columns: [
      { key: 'label', label: 'Label', kind: 'bi', sortable: 'label_en' },
      { key: 'value', label: 'Value', kind: 'bi' },
    ],
  },
  'quick-links': {
    title: 'Quick Links',
    desc: 'The quick-link cards at the bottom of the hero.',
    columns: [
      { key: 'title', label: 'Title', kind: 'bi', sortable: 'title_en' },
      { key: 'desc', label: 'Description', kind: 'bi' },
      { key: 'icon', label: 'Icon', kind: 'icon' },
      { key: 'section', label: 'Target', kind: 'section' },
    ],
  },
  categories: {
    title: 'Product Categories',
    desc: '“What you’ll find” — the categories listed in the About section.',
    columns: [
      { key: 'name', label: 'Name', kind: 'bi', sortable: 'name_en' },
      { key: 'slug', label: 'Slug', kind: 'code' },
    ],
  },
  highlights: {
    title: 'Highlight Cards',
    desc: 'The “Why AMRUT Peth” benefit cards.',
    columns: [
      { key: 'title', label: 'Title', kind: 'bi', sortable: 'title_en' },
      { key: 'desc', label: 'Description', kind: 'bi' },
      { key: 'icon', label: 'Icon', kind: 'icon' },
    ],
  },
  'eligibility-groups': {
    title: 'Who Can Apply',
    desc: 'Eligible groups listed in the Participation section.',
    columns: [{ key: 'name', label: 'Group', kind: 'bi', sortable: 'name_en' }],
  },
  'participation-steps': {
    title: 'Participation Steps',
    desc: 'The numbered steps of the participation process.',
    columns: [
      { key: 'title', label: 'Title', kind: 'bi', sortable: 'title_en' },
      { key: 'desc', label: 'Description', kind: 'bi' },
      { key: 'icon', label: 'Icon', kind: 'icon' },
    ],
  },
  'enquiry-subjects': {
    title: 'Enquiry Subjects',
    desc: 'Options in the registration form’s subject dropdown.',
    columns: [
      { key: 'label', label: 'Label', kind: 'bi', sortable: 'label_en' },
      { key: 'code', label: 'Code', kind: 'code' },
    ],
  },
  'social-links': {
    title: 'Official & Social Links',
    desc: 'Links in the footer’s “Official” column.',
    columns: [
      { key: 'label', label: 'Label', kind: 'text', sortable: 'label' },
      { key: 'url', label: 'URL', kind: 'url' },
      { key: 'icon', label: 'Icon', kind: 'icon' },
    ],
  },
}
