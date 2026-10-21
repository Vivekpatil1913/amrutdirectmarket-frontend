// One label/value line in a details view; renders an em dash when empty.
export function ViewRow({ label, children, empty }) {
  return (
    <div className="a-view-row">
      <span className="a-view-label">{label}</span>
      <div className={`a-view-value${empty ? ' is-empty' : ''}`}>{empty ? '—' : children}</div>
    </div>
  )
}

export function PageHeader({ title, desc, children }) {
  return (
    <div className="a-page-header">
      <div>
        <h1 className="a-page-title">{title}</h1>
        {desc && <p className="a-page-desc">{desc}</p>}
      </div>
      {children && <div className="a-flex a-gap-2" style={{ flexWrap: 'wrap' }}>{children}</div>}
    </div>
  )
}

export function Tabs({ value, onChange, tabs }) {
  return (
    <div className="a-tabs" role="tablist">
      {tabs.map(t => (
        <button
          key={t.value}
          type="button"
          role="tab"
          aria-selected={value === t.value}
          className={`a-tab ${value === t.value ? 'active' : ''}`}
          onClick={() => onChange(t.value)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
