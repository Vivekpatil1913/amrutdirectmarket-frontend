import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CheckCircle, Info, X, XCircle } from 'lucide-react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(1)

  const dismiss = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), [])

  const show = useCallback(
    (message, tone = 'ok', duration = 3500) => {
      const id = nextId.current++
      setToasts(t => [...t, { id, message, tone }])
      setTimeout(() => dismiss(id), tone === 'bad' ? 6000 : duration)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="a-toast-container" role="status" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className={`a-toast a-toast-${t.tone}`}>
            {t.tone === 'ok' && <CheckCircle size={16} style={{ color: 'var(--a-ok)', flexShrink: 0 }} />}
            {t.tone === 'bad' && <XCircle size={16} style={{ color: 'var(--a-bad)', flexShrink: 0 }} />}
            {t.tone === 'info' && <Info size={16} style={{ color: 'var(--a-info)', flexShrink: 0 }} />}
            <span>{t.message}</span>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => dismiss(t.id)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--a-muted)', display: 'flex', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
