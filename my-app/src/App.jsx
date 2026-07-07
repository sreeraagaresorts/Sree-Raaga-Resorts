import React from "react";
import { Routes, Route } from "react-router-dom";



import Home from "./ui/pages/Home";
import About from "./ui/pages/About";
import Amenities from "./ui/pages/Amenities";
import Rooms from "./ui/pages/Rooms";
import RoomDetails from "./ui/pages/RoomDetails";
import Events from "./ui/pages/Events";
import EventDetails from "./ui/pages/EventDetails";
import Dine from "./ui/pages/Dine";
import Contact from "./ui/pages/Contact";
import Menu from "./ui/pages/Menu";
import Login from "./ui/UserReg/Login";
import Register from "./ui/UserReg/Register";
import FAQ from "./ui/pages/FAQ";
import LegalLayout from "./ui/pages/LegalLayout";
import NotFound from "./ui/pages/NotFound";
// import DayOut from "./ui/pages/DayOut";
// import Corporate from "./ui/pages/Corporate";
import CustomCursor from "./ui/components/CustomCursor";

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
import InvoicePage from "./ui/pages/userprofile/InvoicePage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLogin from "./admin/AdminLogin";
import AdminRoute from "./routes/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminBookings from "./admin/AdminBookings";
import AdminRooms from "./admin/AdminRooms";
import AdminRoomsManagement from "./admin/AdminRoomsManagement";
import AdminHotelManagement from "./admin/AdminHotelManagement";
import AdminEvents from "./admin/AdminEvents";
import AdminMenu from "./admin/AdminMenu";
import AdminUsers from "./admin/AdminUsers";
import AdminBilling from "./admin/AdminBilling";
import AdminSettings from "./admin/AdminSettings";
import AdminContent from "./admin/AdminContent";
import AdminEnquiries from "./admin/AdminEnquiries";
import AdminDiscounts from "./admin/AdminDiscounts";

const App = () => {
  return (
    <>
    
<CustomCursor />
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
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/day-out" element={<DayOut />} /> */}
        {/* <Route path="/corporate" element={<Corporate />} /> */}
        <Route path="/faq" element={<FAQ />} />
        {/* LEGAL PAGES WITH UNIFIED LAYOUT */}
        <Route element={<LegalLayout />}>
          <Route path="/privacy-policy" element={<PrivacyGeneral />} />
          <Route path="/terms-conditions" element={<TermsGeneral />} />
          <Route path="/cancellation-refund" element={<TermsRefunds />} />
          <Route path="/shipping-delivery" element={<TermsShipping />} />
          <Route path="/booking-terms" element={<TermsResortPolicies />} />
          <Route path="/cookie-policy" element={<PrivacyCookies />} />
          <Route path="/disclaimer" element={<TermsDisclaimer />} />
          <Route path="/user-account-policy" element={<TermsUserAccount />} />
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

        <Route
          path="/invoice/:bookingId"
          element={
            <ProtectedRoute>
              <InvoicePage />
            </ProtectedRoute>
          }
        />

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
        <Route path="rooms-mgmt" element={<AdminRoomsManagement />} />
        <Route path="hotel-mgmt" element={<AdminHotelManagement />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="content"  element={<AdminContent />} />
        <Route path="discounts" element={<AdminDiscounts />} />
      </Route>
      
      {/* CATCH ALL 404 */}
      <Route path="*" element={<NotFound />} />

      </Routes>

  
    </>
  );
};

export default App;