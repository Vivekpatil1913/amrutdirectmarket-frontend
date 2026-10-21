import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { ToastProvider } from './components/ui/Toast.jsx'
import { AdminLayout, AdminSpinner, RequireRole } from './components/layout/AdminLayout.jsx'
import { COLLECTION_UI } from './config/collections.js'
import './styles/admin.css'

const Login = lazy(() => import('./pages/Login.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const SectionsList = lazy(() => import('./pages/SectionsList.jsx'))
const SectionEdit = lazy(() => import('./pages/SectionEdit.jsx'))
const SectionView = lazy(() => import('./pages/SectionView.jsx'))
const CollectionPage = lazy(() => import('./pages/CollectionPage.jsx'))
const Enquiries = lazy(() => import('./pages/Enquiries.jsx'))
const EnquiryDetail = lazy(() => import('./pages/EnquiryDetail.jsx'))
const Media = lazy(() => import('./pages/Media.jsx'))
const Users = lazy(() => import('./pages/Users.jsx'))
const ActivityLog = lazy(() => import('./pages/ActivityLog.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))

function Collection() {
  const { name } = useParams()
  if (!COLLECTION_UI[name]) return <AdminNotFound />
  return <CollectionPage key={name} name={name} />
}

function AdminNotFound() {
  return (
    <div className="a-card">
      <div className="a-empty-state">
        <p className="a-empty-title">Page not found</p>
        <a href="/admin/dashboard" className="a-btn a-btn-secondary a-mt-1">
          Go to dashboard
        </a>
      </div>
    </div>
  )
}

// Mounted at /admin/* by src/App.jsx.
export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <Suspense fallback={<AdminSpinner />}>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="sections" element={<SectionsList />} />
              <Route path="sections/:key" element={<SectionEdit />} />
              <Route path="sections/:key/view" element={<SectionView />} />
              <Route path="content/:name" element={<Collection />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="enquiries/:id" element={<EnquiryDetail />} />
              <Route path="media" element={<Media />} />
              <Route path="users" element={<RequireRole role="superadmin"><Users /></RequireRole>} />
              <Route path="activity" element={<RequireRole role="admin"><ActivityLog /></RequireRole>} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<AdminNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </AdminAuthProvider>
  )
}
