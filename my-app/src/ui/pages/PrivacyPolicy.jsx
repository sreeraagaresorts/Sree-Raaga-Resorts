import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const policyTabs = [
  { key: "general", title: "General Policy", path: "/privacy-policy" },
  { key: "payments", title: "Account & Payments", path: "/privacy-policy/payments" },
  { key: "orders", title: "Manage Orders", path: "/privacy-policy/orders" },
  { key: "refunds", title: "Returns & Refunds", path: "/privacy-policy/refunds" }
];

const PrivacyPolicy = () => {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.endsWith("/payments")) return "payments";
    if (path.endsWith("/orders")) return "orders";
    if (path.endsWith("/refunds")) return "refunds";
    return "general";
  };

  const activeTab = getActiveTab();
  const activeTitle = policyTabs.find(t => t.key === activeTab)?.title || "Privacy Policy";

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e] font-sans min-h-screen">
        
        {/* Hero Section */}
        <section
          className="relative h-[45vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/60"></div>
          <div className="relative z-10 text-center px-4 max-w-3xl space-y-4">
            <span className="text-[#c8a64d] text-xs uppercase tracking-[6px] font-semibold">
              Legal
            </span>
            <h1 className="text-4xl md:text-6xl font-light  text-white tracking-wide">
              Privacy Policy
            </h1>
          </div>
        </section>

        {/* Content Tabs Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-2">
            {policyTabs.map((tab) => (
              <Link
                key={tab.key}
                to={tab.path}
                className={`block w-full text-left px-5 py-4 text-xs md:text-sm font-sans uppercase tracking-[2px] font-semibold rounded-sm transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-[#c8a64d] text-white shadow-sm"
                    : "bg-[#f7f5ee] text-[#0d2b4e]/70 hover:bg-[#ebd0b0]/20 hover:text-[#0d2b4e]"
                }`}
              >
                {tab.title}
              </Link>
            ))}
          </div>

          {/* Policy Detail Pane */}
          <div className="lg:col-span-9 bg-white border border-gray-100 p-8 md:p-12 shadow-sm rounded-sm">
            <h2 className="text-3xl  font-light mb-8 text-[#0d2b4e] pb-4 border-b border-[#0d2b4e]/10">
              {activeTitle}
            </h2>
            <div className="font-sans text-xs md:text-sm text-gray-500 leading-relaxed font-light">
              <Outlet />
            </div>
          </div>

        </section>

      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
