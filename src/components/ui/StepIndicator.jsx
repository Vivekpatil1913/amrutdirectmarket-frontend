import './StepIndicator.css'

export default function StepIndicator({ steps, current }) {
  return (
    <div className="step-indicator" role="navigation" aria-label="Booking steps">
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'pending'
        return (
          <div key={i} className={`step-item step-item--${state}`}>
            <div className="step-bubble">
              {state === 'done' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className="step-label">{step}</span>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}
