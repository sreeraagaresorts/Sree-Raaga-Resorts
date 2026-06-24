import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const termsTabs = [
  { key: "general", title: "Terms & Conditions", path: "/terms-conditions" },
  { key: "refunds", title: "Cancellation & Refund", path: "/terms-conditions/refunds" },
  { key: "shipping", title: "Shipping & Delivery", path: "/terms-conditions/shipping" },
  { key: "resort-policies", title: "Resort Policies & House Rules", path: "/terms-conditions/resort-policies" },
  { key: "disclaimer", title: "Disclaimer", path: "/terms-conditions/disclaimer" },
  { key: "user-account", title: "User Account Policy", path: "/terms-conditions/user-account" }
];

const TermsConditions = () => {
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.endsWith("/refunds")) return "refunds";
    if (path.endsWith("/shipping")) return "shipping";
    if (path.endsWith("/resort-policies")) return "resort-policies";
    if (path.endsWith("/disclaimer")) return "disclaimer";
    if (path.endsWith("/user-account")) return "user-account";
    return "general";
  };

  const activeTab = getActiveTab();
  const activeTitle = termsTabs.find(t => t.key === activeTab)?.title || "Terms & Conditions";

  return (
    <>
      <Navbar />
      <div 
        className="text-[#0d2b4e] min-h-screen bg-cover bg-center bg-no-repeat bg-fixed relative"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(252, 250, 242, 0.94), rgba(252, 250, 242, 0.97)), url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200')"
        }}
      >
        
        {/* Hero Section */}
        <section
          className="relative h-[45vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/60"></div>
          <div className="relative z-10 text-center px-4 max-w-3xl space-y-4">
            <span className="text-[#c8a64d] text-xs uppercase tracking-[6px] font-semibold font-jost">
              Legal
            </span>
            <h1 className="text-4xl md:text-6xl font-light text-white tracking-wide font-corm leading-tight">
              Terms & Conditions
            </h1>
          </div>
        </section>

        {/* Content Tabs Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 self-start space-y-2">
            {termsTabs.map((tab) => (
              <Link
                key={tab.key}
                to={tab.path}
                className={`block w-full text-left px-5 py-4 text-xs md:text-sm uppercase tracking-[2px] font-semibold rounded-sm transition-all duration-300 font-jost ${
                  activeTab === tab.key
                    ? "bg-[#c8a64d] text-white shadow-sm"
                    : "bg-[#f7f5ee] text-[#0d2b4e]/70 hover:bg-[#ebd0b0]/20 hover:text-[#0d2b4e]"
                }`}
              >
                {tab.title}
              </Link>
            ))}
          </div>

          {/* Terms Detail Pane */}
          <div className="lg:col-span-9 bg-white border border-gray-100 p-8 md:p-12 shadow-sm rounded-sm">
            <h2 className="text-3xl font-corm font-light mb-8 text-[#0d2b4e] pb-4 border-b border-[#0d2b4e]/10 tracking-wide">
              {activeTitle}
            </h2>
            <div className="text-sm md:text-[15px] text-[#2d5b8a] leading-relaxed font-jost font-light">
              <Outlet />
            </div>
          </div>

        </section>

      </div>
      <Footer />
    </>
  );
};

export default TermsConditions;
