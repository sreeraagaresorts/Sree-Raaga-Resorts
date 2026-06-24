import React from "react";
import { Routes, Route } from "react-router-dom";



import Home from "./ui/pages/Home";
import About from "./ui/pages/About";
import Amenities from "./ui/pages/Amenities";
import Rooms from "./ui/pages/Rooms";
import RoomDetails from "./ui/pages/RoomDetails";
import Events from "./ui/pages/Events";
import Dine from "./ui/pages/Dine";
import Contact from "./ui/pages/Contact";
import Menu from "./ui/pages/Menu";
import Login from "./ui/UserReg/Login";
import Register from "./ui/UserReg/Register";
import FAQ from "./ui/pages/FAQ";
import PrivacyPolicy from "./ui/pages/PrivacyPolicy";
import TermsConditions from "./ui/pages/TermsConditions";
import NotFound from "./ui/pages/NotFound";
import DayOut from "./ui/pages/DayOut";
import Corporate from "./ui/pages/Corporate";

// PRIVACY SUBPAGES
import PrivacyGeneral from "./ui/pages/privacy/General";
import PrivacyCookies from "./ui/pages/privacy/Cookies";

// TERMS SUBPAGES
import TermsGeneral from "./ui/pages/terms/General";
import TermsRefunds from "./ui/pages/terms/Refunds";
import TermsShipping from "./ui/pages/terms/Shipping";
import TermsResortPolicies from "./ui/pages/terms/ResortPolicies";
import TermsDisclaimer from "./ui/pages/terms/Disclaimer";
import TermsUserAccount from "./ui/pages/terms/UserAccount";

// USER DASHBOARD
import UserDashboard from "./ui/pages/userprofile/UserDashboard";
import UserProfile from "./ui/pages/userprofile/UserProfile";
import UserBookings from "./ui/pages/userprofile/UserBookings";
import UserWishlist from "./ui/pages/userprofile/UserWishlist";
import UserNotifications from "./ui/pages/userprofile/UserNotifications";
import UserSettings from "./ui/pages/userprofile/UserSettings";
import UserLayout from "./ui/pages/userprofile/UserLayout";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLogin from "./admin/AdminLogin";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBookings from "./admin/AdminBookings";
import AdminRooms from "./admin/AdminRooms";
import AdminEvents from "./admin/AdminEvents";
import AdminMenu from "./admin/AdminMenu";
import AdminUsers from "./admin/AdminUsers";
import AdminBilling from "./admin/AdminBilling";
import AdminSettings from "./admin/AdminSettings";
import AdminContent from "./admin/AdminContent";

const App = () => {
  return (
    <>
    

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/amenities" element={<Amenities />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dine" element={<Dine />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/day-out" element={<DayOut />} />
        <Route path="/corporate" element={<Corporate />} />
        <Route path="/faq" element={<FAQ />} />
        {/* PRIVACY POLICY PAGES */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />}>
          <Route index element={<PrivacyGeneral />} />
          <Route path="cookies" element={<PrivacyCookies />} />
        </Route>

        {/* TERMS & CONDITIONS PAGES */}
        <Route path="/terms-conditions" element={<TermsConditions />}>
          <Route index element={<TermsGeneral />} />
          <Route path="refunds" element={<TermsRefunds />} />
          <Route path="shipping" element={<TermsShipping />} />
          <Route path="resort-policies" element={<TermsResortPolicies />} />
          <Route path="disclaimer" element={<TermsDisclaimer />} />
          <Route path="user-account" element={<TermsUserAccount />} />
        </Route>

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



          <Route path="/admin/login" element={<AdminLogin />} />

      {/* ADMIN PANEL (PROTECTED) */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="content" element={<AdminContent />} />
      </Route>
      
      {/* CATCH ALL 404 */}
      <Route path="*" element={<NotFound />} />

      </Routes>

  
    </>
  );
};

export default App;