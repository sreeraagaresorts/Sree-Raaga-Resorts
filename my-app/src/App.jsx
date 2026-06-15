import React from "react";
import { Routes, Route } from "react-router-dom";



import Home from "./ui/pages/Home";
import About from "./ui/pages/About";
import Rooms from "./ui/pages/Rooms";
import RoomDetails from "./ui/pages/RoomDetails";
import Events from "./ui/pages/Events";
import Contact from "./ui/pages/Contact";
import Login from "./ui/UserReg/Login";
import Register from "./ui/UserReg/Register";

// USER DASHBOARD
import UserDashboard from "./ui/pages/userprofile/UserDashboard";
import UserProfile from "./ui/pages/userprofile/UserProfile";
import UserBookings from "./ui/pages/userprofile/UserBookings";
import UserWishlist from "./ui/pages/userprofile/UserWishlist";
import UserNotifications from "./ui/pages/userprofile/UserNotifications";
import UserSettings from "./ui/pages/userprofile/UserSettings";
import UserLayout from "./ui/pages/userprofile/UserLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <>
    

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER DASHBOARD (NO Navbar/Footer) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="bookings" element={<UserBookings />} />
          <Route path="wishlist" element={<UserWishlist />} />
          <Route path="notifications" element={<UserNotifications />} />
          <Route path="settings" element={<UserSettings />} />
        </Route>

      </Routes>

  
    </>
  );
};

export default App;