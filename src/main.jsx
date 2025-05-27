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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header/>
      <main>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/verifykyc" element={<VerifyKYC/>} />
          <Route path="/tracking" element={<Tracking/>} />
          <Route path="/modification" element={<KYCModification/>} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </main>
      <Footer/>
    </Router>
  </StrictMode>,
)
