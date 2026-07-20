import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllHouses from "./pages/AllHouses";
import AllRooms from "./pages/AllRooms";
import MyHouses from "./pages/MyHouses";
import AddHouse from "./pages/AddHouse";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScrollToTop from "./components/ScrollToTop";
import HouseDetails from "./pages/HouseDetails";
import RoomDetails from "./pages/RoomDetails";
import EditHouse from "./pages/EditHouse"; 
import InfoPopup from "./components/InfoPopup";
import AllCommercial from "./pages/AllCommercial";
import CommercialDetails from "./pages/CommercialDetails";
import EditCommercial from "./pages/EditCommercial";
import AdminDashboard from "./pages/AdminDashboard";
import EditHotel from "./pages/EditHotel";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute"; // [ADDED]
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PASTE_YOUR_GOOGLE_CLIENT_ID_HERE";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <InfoPopup />
        <Routes>
          <Route path="/" element={<AllHouses />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/business" element={<AllCommercial />} />
          <Route path="/house/:id" element={<HouseDetails />} />
          <Route path="/room/:id" element={<RoomDetails />} />
          <Route path="/commercial/:id" element={<CommercialDetails />} />
          
          {/* Protected Routes */}
          <Route path="/edit-house/:id" element={<ProtectedRoute><EditHouse /></ProtectedRoute>} />
          <Route path="/edit-room/:id" element={<ProtectedRoute><EditHotel /></ProtectedRoute>} />
          <Route path="/edit-commercial/:id" element={<ProtectedRoute><EditCommercial /></ProtectedRoute>} />
          <Route path="/my-houses" element={<ProtectedRoute><MyHouses /></ProtectedRoute>} />
          <Route path="/add-house" element={<ProtectedRoute><AddHouse /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}




// today changes
// myhouse - 1701 - 1711