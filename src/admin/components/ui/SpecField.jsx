import { Switch } from './Badge.jsx'
import { ImageField } from './ImageField.jsx'

// Renders one field from a server field spec (see backend lib/fieldSchema.js).
// A bilingual field renders Marathi and English inputs side by side; only the
// Marathi one is required, matching the server's rule.

const LANG = { mr: 'Marathi', en: 'English' }

function optionsOf(field) {
  return (field.options || []).map(o => (typeof o === 'string' ? { value: o, label: o } : o))
}

function Control({ field, name, value, onChange, required, error, label }) {
  const v = value ?? ''
  const common = {
    id: `f-${name}`,
    name,
    className: 'a-input',
    'aria-invalid': error ? 'true' : undefined,
  }
  const counter = field.max && ['text', 'textarea', 'url', 'email', 'tel', 'slug'].includes(field.type)

  let input
  switch (field.type) {
    case 'textarea':
      input = <textarea {...common} className="a-input a-textarea" rows={3} maxLength={field.max} value={v} onChange={e => onChange(e.target.value)} />
      break
    case 'select':
      input = (
        <select {...common} value={v} onChange={e => onChange(e.target.value)}>
          {!field.default && <option value="">Select…</option>}
          {optionsOf(field).map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    case 'number':
      input = (
        <input {...common} type="number" min={field.min ?? 0} max={field.max ?? 9999} value={v} onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))} />
      )
      break
    default:
      input = (
        <input
          {...common}
          type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : field.type === 'tel' ? 'tel' : 'text'}
          maxLength={field.max}
          placeholder={field.type === 'url' ? 'https://…' : field.type === 'slug' ? 'auto-generated-if-empty' : undefined}
          value={v}
          onChange={e => onChange(field.type === 'slug' ? e.target.value.toLowerCase() : e.target.value)}
        />
      )
  }

  return (
    <div className={`a-field ${error ? 'has-error' : ''}`}>
      <label className={`a-label ${required ? 'a-label-required' : ''}`} htmlFor={common.id}>
        {label}
      </label>
      {input}
      {error ? (
        <span className="a-field-error">{error}</span>
      ) : (
        (field.hint || counter) && (
          <span className="a-field-note">
            {field.hint ? `${field.hint} ` : ''}
            {counter ? `${String(v).length}/${field.max}` : ''}
          </span>
        )
      )}
    </div>
  )
}

export function SpecField({ field, values, onChange, errors = {} }) {
  if (field.type === 'image') {
    return (
      <ImageField
        label={field.label}
        required={field.required}
        hint={field.hint}
        value={values[field.key]}
        error={errors[field.key] || errors[`${field.key}.media_id`]}
        onChange={v => onChange(field.key, v)}
      />
    )
  }

  if (field.type === 'boolean') {
    return (
      <div className="a-field">
        <span className="a-label">{field.label}</span>
        <div className="a-flex-center a-gap-2">
          <Switch on={Boolean(values[field.key])} onToggle={() => onChange(field.key, !values[field.key])} />
          <span className="a-text-sm a-text-muted">{values[field.key] ? 'Yes' : 'No'}</span>
        </div>
        {field.hint && <span className="a-field-note">{field.hint}</span>}
      </div>
    )
  }

  if (field.bi) {
    return (
      <div className="a-form-grid a-form-grid-2">
        {['mr', 'en'].map(lang => {
          const key = `${field.key}_${lang}`
          return (
            <Control
              key={key}
              field={field}
              name={key}
              label={`${field.label} (${LANG[lang]})`}
              required={field.required && lang === 'mr'}
              value={values[key]}
              error={errors[key]}
              onChange={v => onChange(key, v)}
            />
          )
        })}
      </div>
    )
  }

  return (
    <Control
      field={field}
      name={field.key}
      label={field.label}
      required={field.required && field.type !== 'boolean'}
      value={values[field.key]}
      error={errors[field.key]}
      onChange={v => onChange(field.key, v)}
    />
  )
}

// Client-side mirror of the server's required/format rules, so obvious mistakes
// are flagged before a request. The server remains the authority.
export function validateSpec(fields, values) {
  const errors = {}
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  for (const f of fields) {
    const keys = f.bi ? [`${f.key}_mr`, `${f.key}_en`] : [f.key]
    keys.forEach((key, i) => {
      const v = values[key]
      const text = typeof v === 'string' ? v.trim() : v
      if (f.type === 'image') {
        if (f.required && !v?.media_id) errors[key] = `${f.label} is required`
        return
      }
      if (f.required && i === 0 && f.type !== 'boolean' && f.type !== 'number' && (text === '' || text == null)) {
        errors[key] = `${f.label} is required`
        return
      }
      if (typeof text !== 'string' || text === '') return
      if (f.max && f.type !== 'number' && text.length > f.max) errors[key] = `Must be at most ${f.max} characters`
      else if (f.type === 'email' && !emailRe.test(text)) errors[key] = 'Enter a valid email address'
      else if (f.type === 'url' && !/^https?:\/\/[^\s]+$/i.test(text)) errors[key] = 'Enter a valid http(s) URL'
      else if (f.type === 'tel' && !/^\+?[0-9][0-9 -]{5,19}$/.test(text)) errors[key] = 'Enter a valid phone number'
      else if (f.type === 'slug' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(text)) errors[key] = 'Use lowercase letters, numbers and single hyphens'
    })
    if (f.type === 'number') {
      const n = values[f.key]
      if (n === '' || !Number.isInteger(Number(n))) errors[f.key] = `${f.label} must be a whole number`
      else if (n < (f.min ?? 0) || n > (f.max ?? 9999)) errors[f.key] = `${f.label} must be between ${f.min ?? 0} and ${f.max ?? 9999}`
    }
  }
  return errors
}

// Default value for each stored key of the given fields.
export function blankValues(fields) {
  const out = {}
  for (const f of fields) {
    const keys = f.bi ? [`${f.key}_mr`, `${f.key}_en`] : [f.key]
    for (const k of keys) {
      out[k] =
        f.default !== undefined ? f.default
          : f.type === 'boolean' ? false
            : f.type === 'number' ? 0
              : f.type === 'image' ? { media_id: null, url: '' }
                : f.type === 'select' ? (f.options?.[0]?.value ?? f.options?.[0] ?? '')
                  : ''
    }
  }
  return out
}

// Picks only the editable keys of a record (drops ids, timestamps, names).
export function pickValues(fields, record) {
  const base = blankValues(fields)
  for (const k of Object.keys(base)) if (record?.[k] !== undefined && record[k] !== null) base[k] = record[k]
  return base
}
