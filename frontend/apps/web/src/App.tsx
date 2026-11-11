import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider, ProtectedRoute } from '@repo/auth'
import { Toaster } from '@repo/ui'
import { SiteLayout } from './components/SiteLayout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { EnquiryPage } from './pages/EnquiryPage'
import { FleetPage } from './pages/FleetPage'
import { HomePage } from './pages/HomePage'
import { MyEnquiriesPage } from './pages/MyEnquiriesPage'
import { SignInPage } from './pages/SignInPage'
import { VehiclePage } from './pages/VehiclePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/fleet" element={<FleetPage />} />
            <Route path="/vehicles/:vehicleId" element={<VehiclePage />} />
            <Route path="/vehicles/:vehicleId/enquiry" element={<EnquiryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<SignInPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/enquiries" element={<MyEnquiriesPage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}
