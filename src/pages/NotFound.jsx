import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 'var(--sp-5)',
      textAlign: 'center',
      padding: 'var(--sp-8)',
    }}>
      <div style={{fontSize:'5rem'}}>🏟️</div>
      <h1 style={{fontSize:'clamp(var(--text-3xl), 5vw, var(--text-5xl))'}}>Page Not Found</h1>
      <p style={{fontSize:'var(--text-lg)', color:'var(--muted)', maxWidth:'40ch', lineHeight:1.7}}>
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div style={{display:'flex', gap:'var(--sp-4)', flexWrap:'wrap', justifyContent:'center'}}>
        <Link to="/" className="btn btn--primary">Go Home</Link>
        <Link to="/exhibitions" className="btn btn--outline">View Exhibitions</Link>
      </div>
    </div>
  )
}
