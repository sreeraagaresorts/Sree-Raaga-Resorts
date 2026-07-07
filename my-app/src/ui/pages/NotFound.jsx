import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
const NotFound = () => {
  return (
    <>
    {/* 2. ADD HELMET COMPONENT HERE */}
    <Helmet>
  <title>Page Not Found | Sree Raaga Resorts</title>

  <meta
    name="description"
    content="The page you are looking for could not be found. Return to the Sree Raaga Resorts homepage to explore our luxury accommodations, dining, amenities, and experiences."
  />

  <meta
    name="keywords"
    content="404, page not found, Sree Raaga Resorts"
  />

  {/* Prevent indexing of the 404 page */}
  <meta name="robots" content="noindex, nofollow" />

  {/* Open Graph Tags */}
  <meta
    property="og:title"
    content="Page Not Found | Sree Raaga Resorts"
  />

  <meta
    property="og:description"
    content="The requested page could not be found. Visit Sree Raaga Resorts to explore our accommodations, dining, events, and amenities."
  />

  <meta property="og:type" content="website" />
</Helmet>
      <Navbar />
      <div className="bg-black text-white overflow-x-hidden">
        
        {/* Hero Section Container */}
        <section
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
          }}
        >
          {/* Dark Overlay matching image */}
          <div className="absolute inset-0 bg-[#04121a]/65"></div>

          {/* Centered Content */}
          <div className="relative z-10 text-center px-6 max-w-2xl space-y-6">
            <h1 className="text-8xl md:text-[12rem] font-light  leading-none tracking-wider text-white">
              404
            </h1>
            <h2 className="text-3xl md:text-5xl font-light  text-white tracking-wide">
              Page Not Found
            </h2>
            <p className="text-white/70  text-xs md:text-sm max-w-md mx-auto leading-relaxed">
              Sorry, but we couldn't find the page you are looking for. It might have been moved or deleted.
            </p>

            <div className="pt-6">
              <Link
                to="/"
                className="inline-block px-10 py-4 bg-[#fcebd6] text-[#0d2b4e] hover:bg-[#ebd4b8]  text-xs font-semibold uppercase tracking-[2px] rounded-sm transition-all duration-300 shadow-lg"
              >
                — Back to Homepage
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default NotFound;
