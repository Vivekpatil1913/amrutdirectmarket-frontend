import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Exhibitions from './pages/Exhibitions'
import ExhibitionDetail from './pages/ExhibitionDetail'
import StallBooking from './pages/StallBooking'
import Categories from './pages/Categories'
import Gallery from './pages/Gallery'
import Beneficiaries from './pages/Beneficiaries'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="exhibitions" element={<Exhibitions />} />
        <Route path="exhibitions/:id" element={<ExhibitionDetail />} />
        <Route path="stall-booking" element={<StallBooking />} />
        <Route path="stall-booking/:exhibitionId" element={<StallBooking />} />
        <Route path="categories" element={<Categories />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="beneficiaries" element={<Beneficiaries />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
