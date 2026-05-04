import { BrowserRouter, Routes, Route } from "react-router-dom";
// @ts-ignore
import LandingPage from './Home/LandingPage.jsx';
// @ts-ignore
import LoginPage from './auth/LoginPage.jsx';
// @ts-ignore
import SignupPage from "./auth/SignupPage.jsx";
import Dashboard from "./Dashboard/Dashboard.tsx";
import RenterDetails from "./Dashboard/components/RenterDetail.tsx";
import PrivacyPolicy from "./pages/Privacypolicy.jsx";
import TermsOfService from "./pages/Termsofservice.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignupPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboard/Renter/:id/:ownerId" element={<RenterDetails />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}