import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './Home/LandingPage.jsx'
import LoginPage from './auth/LoginPage.jsx'
import SignupPage from "./auth/SignupPage.jsx"
import Dashboard from "./Dashboard/Dashboard.tsx";
import RenterDetails from "./Dashboard/components/RenterDetail.tsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Dashboard/Renter/:id" element={<RenterDetails />} />
      
      </Routes>
    </BrowserRouter>
  );
}