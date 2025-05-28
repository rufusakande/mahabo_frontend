import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/CSS/StylesGenerale.css';
import Home from './Pages/Home';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import VerifyKYC from './Pages/VerifyKYC';
import Tracking from './Pages/Tracking';
import Contact from './Pages/Contact';
import KYCModification from './Pages/KYCModification';
import Dashboard from './Pages/admin/Dashboard';
import Login from './Pages/admin/Login';
import Demandes from './Pages/admin/Demandes';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';
import KycRequestDetails from './Pages/admin/KycRequestDetails';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsOfUse from './Pages/TermsOfUse';
import RGPD from './Pages/RGPD';
import Cookie from './Pages/cookie';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/verifykyc" element={<VerifyKYC/>} />
          <Route path="/tracking" element={<Tracking/>} />
          <Route path="/modification" element={<KYCModification/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
          <Route path="/termsofuse" element={<TermsOfUse/>} />
          <Route path="/rgpd" element={<RGPD/>} />
          <Route path="/cookies" element={<Cookie/>} />
          { /**
           * Routes admin
           */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } />
          <Route path="/admin/login" element={<Login/>} />
          <Route path="/admin/demandes" element={
            <ProtectedRoute>
              <Demandes/>
            </ProtectedRoute>
          } />
          <Route path="/admin/kyc/:id" element={
            <ProtectedRoute>
              <KycRequestDetails/>
            </ProtectedRoute>
          } />
        </Routes>
    </Router>
  </StrictMode>,
)
