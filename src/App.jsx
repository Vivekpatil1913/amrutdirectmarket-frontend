import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// The public site is a single page. Former page URLs land on the matching
// home-page section so existing links and bookmarks keep working.
const LEGACY = [
  ['about', 'about'],
  ['categories', 'about'],
  ['exhibitions/*', 'participate'],
  ['stall-booking/*', 'register'],
  ['beneficiaries', 'highlights'],
  ['gallery', 'home'],
  ['contact', 'register'],
]

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        {LEGACY.map(([path, section]) => (
          <Route key={path} path={path} element={<Navigate to={{ pathname: '/', hash: `#${section}` }} replace />} />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
