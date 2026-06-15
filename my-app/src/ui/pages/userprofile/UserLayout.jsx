import { Link, Outlet } from "react-router-dom";


const UserLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#111", color: "#fff", padding: "20px" }}>
        <h2>User Panel</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/dashboard/profile">Profile</Link>
          <Link to="/dashboard/bookings">Bookings</Link>
          <Link to="/dashboard/wishlist">Wishlist</Link>
          <Link to="/dashboard/notifications">Notifications</Link>
          <Link to="/dashboard/settings">Settings</Link>
        </nav>
      </div>

      {/* Page Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;