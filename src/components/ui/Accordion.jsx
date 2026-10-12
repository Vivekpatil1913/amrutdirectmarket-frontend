import { useState } from 'react'
import './Accordion.css'

export function AccordionItem({ question, answer, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`accordion-item${open ? ' open' : ''}`}>
      <button
        className="accordion-trigger"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className="accordion-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      <div className="accordion-panel">
        <div className="accordion-body">{answer}</div>
      </div>
    </div>
  )
}

export default function Accordion({ items }) {
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <AccordionItem key={i} question={item.question} answer={item.answer} defaultOpen={i === 0} />
      ))}
    </div>
  )
}
