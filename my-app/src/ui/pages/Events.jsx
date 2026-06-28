import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Phone, Mail, ArrowRight, Calendar, AlertCircle, Sparkles, Maximize, Users } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from "../../config/api";

import wifiIcon from "../../assets/icons/wifi.png";
import buggyIcon from "../../assets/icons/car.png";
import tvIcon from "../../assets/icons/tv.png";
import roomServiceIcon from "../../assets/icons/services.png";
import laundryIcon from "../../assets/icons/laundry.png";
import housekeepingIcon from "../../assets/icons/cleaning.png";

const amenitiesList = [
  { icon: wifiIcon, name: "Wifi & Internet" },
  { icon: buggyIcon, name: "Buggy Services" },
  { icon: tvIcon, name: "Smart TV" },
  { icon: roomServiceIcon, name: "Room Service" },
  { icon: laundryIcon, name: "Laundry Services" },
  { icon: housekeepingIcon, name: "Housekeeper Services" },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/api/events`);
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          throw new Error(data.message || "Failed to load events.");
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };
function WaterSportsIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2.5-1 4-1" />
      <path d="M2 21c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2.5-1 4-1" />
      <path d="M3 14.5c2-0.5 8-1.5 18-0.5 1 0.1 1.5 0.8 1 1.5-0.5 0.7-1.5 0.5-2.5 0.5H4.5c-1 0-1.8-0.8-1.5-1.5z" />
      <line x1="8" y1="16" x2="16" y2="4" />
      <path d="M15 5.5l1.5-2.2c0.3-0.4 0.9-0.4 1.2 0l0.8 1.2c0.3 0.4 0.1 1-.4 1.2L16.6 6.5" />
      <circle cx="11.5" cy="6.5" r="1.5" />
      <path d="M9.5 11l1.5-3 2 0.5 1.5 2.5" />
      <path d="M11 8v4" />
    </svg>
  );
}
  return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e]  min-h-screen overflow-x-hidden">

        {/* HERO SECTION */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2000')", // Ambient lit dinner table
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 text-center text-white px-4 mt-20 select-none  space-y-4">
            <span className="text-white text-[17px] uppercase tracking-[6px] font-semibold block mb-2">
              Events & Packages
            </span>
            <h1 className="text-4xl md:text-[92px] font-medium font-corm  leading-tight">
              Tailored Packages for Every Celebration
            </h1>
            {/* <p className="text-white/80 font-medium text-xs md:text-[17px] max-w-xl mx-auto leading-relaxed">
              At Sree Raaga Resorts, we host custom weddings, corporate conferences, and private celebrations tailored to your expectations.
            </p> */}
          </div>
        </section>

        {/* INTRODUCTION BLOCK */}
     <section className="py-24 px-6 bg-[] text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-[#c8a64d] flex justify-center">
              <WaterSportsIcon className="w-12 h-12" />
            </div>
            <span className="text-[#c8a64d] text-xs uppercase tracking-[4px] font-semibold font-jost block">
              LUXURY RESORT
            </span>
            <h2 className="text-3xl md:text-6xl font-medium font-corm text-[#0d2b4e] leading-snug">
              Water Sports you Must Try
            </h2>
            <p className="text-[#2d5b8a] font-jost font-light text-sm md:text-[17px] leading-relaxed max-w-2xl mx-auto">
              An integral part of relax and perfect experience of your stay is water sports. Paddle boarding, kayaking, and surfing activities are designed to create memorable moments for you and your family.
            </p>
            <div className="pt-4">
           <Link
                   to="/rooms"
                   className="inline-flex items-center gap-4 px-10 py-5  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transition duration-300 text-black uppercase tracking-wider font-medium"
                 >
                   <span>—</span>
                   Book now
                 </Link>
            </div>
          </div>
        </section>

        {/* DYNAMIC UPLOADED EVENTS SECTION */}
        <section className="py-12 pb-24 px-6 bg-[#fdfeff]">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c8a64d]"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-red-500 space-y-2 bg-white/50 rounded p-6 max-w-md mx-auto shadow-xs">
                <AlertCircle size={32} />
                <p className="text-sm font-semibold">Failed to fetch uploaded events</p>
                <p className="text-xs text-gray-400">{error}</p>
              </div>
            ) : events.length === 0 ? (
              <div className="bg-white border border-[#0d2b4e]/5 p-12 text-center rounded-sm max-w-lg mx-auto shadow-sm space-y-4">
                <Sparkles className="mx-auto text-[#c8a64d]" size={28} />
                <h4 className="text-lg  font-medium text-[#0d2b4e]">No Custom Packages Uploaded Yet</h4>
                <p className="text-xs md:text-sm text-gray-500  font-light">
                  We are currently custom-designing premium event templates. Contact us to design a bespoke event tailor-made for your celebration.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/918904561155?text=I%20want%20to%20plan%20a%20custom%20event%20at%20Sree%20Raaga%20Resorts."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c8a64d] text-white hover:bg-[#b09141] text-xs font-semibold uppercase tracking-[1px] transition rounded-sm"
                  >
                    Custom Planning
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-24">
                {events.map((event, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div
                      key={event.id || idx}
                      initial={{ opacity: 0, y: 35 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                    >
                      {/* Event Image */}
                      <div className={`lg:col-span-7 w-full ${isEven ? "" : "lg:order-last"}`}>
                        <Link 
                          to={`/events/${event.id || event._id}`}
                          className="block relative overflow-hidden aspect-[3/2] bg-gray-100 group shadow-sm "
                        >
                          <img
                            src={getImageUrl(event.image)}
                            alt={event.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          {event.sqft && (
                            <span className="absolute top-6 left-6 bg-white/95 backdrop-blur-xs text-[#0d2b4e] text-[15px] uppercase tracking-widest font-medium px-6 py-3  border border-[#c8a64d]/30 shadow-xs">
                              {event.sqft} SQft
                            </span>
                          )}
                        </Link>
                      </div>

                      {/* Event Details */}
                      <div className={`lg:col-span-5 ${isEven ? "lg:offset-1" : ""} flex flex-col justify-center h-full py-2 md:ml-22 text-left`}>
                        <div>
                          <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                            <div>
                              <h3 className="text-3xl md:text-[40px] font-medium font-corm text-[#0d2b4e]">
                                {event.name}
                              </h3>
                            </div>
                            {event.show_price && (
                              <div className="text-right">
                                <span className="text-lg md:text-xl font-semibold text-gray-800">
                                  ₹{Number(event.price || 0).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Event Specs Row */}
                          <div className="flex flex-wrap items-center gap-6 pb-6 text-[15px] md:text-[17px] text-gray-500 font-medium border-b border-gray-100 mb-6">
                            {event.sqft && (
                              <div className="flex items-center">
                                <Maximize className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                                <span>{event.sqft} Sqft</span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed mb-8 font-medium font-jost whitespace-pre-line line-clamp-2">
                            {event.description}
                          </p>
                        </div>

                        {/* Actions CTA Link (same style as Rooms.jsx) */}
                        <div>
                         <Link
  to={`/events/${event.id || event._id}`}
  className="inline-flex items-center gap-2 px-6 py-4 border border-black bg-transparent text-[#0d2b4e] text-sm font-bold uppercase tracking-[2px] transition-all duration-300 hover:bg-gray-700 hover:text-white hover:border-gray-700 group"
>
  <span>
    {event.show_price ? "Book Package" : "Enquire Now"}
  </span>

  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
</Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ================= RESORT FACILITIES SECTION ================= */}
        <section className="py-24 px-6 bg-[#fdfeff] border-t border-gray-100">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-medium font-corm text-[#0d2b4e]">
              Resort Facilities
            </h2>
          </div>

          {/* Icons Row */}
          <div className="max-w-[160vh] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 justify-center items-center py-4 gap-y-8">
            {amenitiesList.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center group cursor-default"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.icon}
                    alt={item.name}
                    className="w-20 h-20 px-4 object-contain transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm md:text-[24px] font-semibold text-gray-500 font-corm group-hover:text-[#0d2b4e] transition-colors duration-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Events;