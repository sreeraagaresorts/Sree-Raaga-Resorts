import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Phone, Mail, ArrowRight, Calendar, AlertCircle, Sparkles } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_URL } from "../../config/api";

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

          <div className="relative z-10 text-center text-white px-4 mt-20 select-none max-w-3xl space-y-4">
            <span className="text-white text-[17px] uppercase tracking-[6px] font-semibold block mb-2">
              MEET & CELEBRATE
            </span>
            <h1 className="text-4xl md:text-[92px] font-medium font-corm  leading-tight">
              Meet & Celebrate
            </h1>
            <p className="text-white/80 font-medium text-xs md:text-[17px] max-w-xl mx-auto leading-relaxed">
              At Sree Raaga Resorts, we host custom weddings, corporate conferences, and private celebrations tailored to your expectations.
            </p>
          </div>
        </section>

        {/* INTRODUCTION BLOCK */}
        <section className="py-20 px-6 bg-[#fdfeff] text-center max-w-4xl mx-auto space-y-8">
          <span className="text-[#c8a64d] text-[10px] uppercase tracking-[4px] font-semibold block">
            OUR VENUES & CELEBRATIONS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-5xl  font-medium font-corm text-[#0d2b4e]  max-w-3xl mx-auto">
            Elevate your events to new heights at Sree Raaga Resorts.
          </h2>

          {/* Quick Contact links under introduction */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-12 pt-6  text-xs  tracking-widest text-[#0d2b4e]/80">
            <a href="tel:08904561155" className="flex items-center gap-3 hover:text-[#c8a64d] transition-colors">
              <Phone size={14} className="text-[#c8a64d]" />
               <span className="text-[15px]"><a href="tel:918904561155">+91 89045 61155</a></span>
              <span></span>
            </a>
               <a href="tel:08904561155" className="flex items-center gap-3 hover:text-[#c8a64d] transition-colors">
              <Phone size={14} className="text-[#c8a64d]" />
                  <span className="text-[15px]"><a href="tel:918904381155">+91 8904381155</a></span>
              <span></span>
            </a>
           
            <a href="mailto:info@sreeraagaresorts.in" className="flex items-center gap-3 hover:text-[#c8a64d] transition-colors">
              <Mail size={14} className="text-[#c8a64d]" />
              <span className="text-[15px]">info@sreeraagaresorts.in</span>
            </a>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, idx) => (
                  <motion.div
                    key={event.id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-white border border-[#0d2b4e]/5 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Event Image */}
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(event.image)}
                          alt={event.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs text-[#0d2b4e] text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-sm border border-[#c8a64d]/30">
                          {event.category || "Celebration"}
                        </span>
                      </div>

                      {/* Event Body */}
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl  font-light text-[#0d2b4e]">
                          {event.name}
                        </h3>

                        {event.event_date && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 ">
                            <Calendar size={13} className="text-[#c8a64d]" />
                            <span>{event.event_date}</span>
                          </div>
                        )}

                        <p className="text-gray-500 text-xs md:text-sm  font-light leading-relaxed line-clamp-4">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp Action Button */}
                    <div className="p-6 pt-0">
                      <a
                        href={`https://wa.me/918904561155?text=I%20am%20interested%20in%20booking%20the%20event%20package%20called%20"${encodeURIComponent(event.name)}"%20at%20Sree%20Raaga%20Resorts.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 border border-[#c8a64d] text-[#0d2b4e] hover:bg-[#c8a64d] hover:text-white text-xs font-semibold uppercase tracking-[1px] transition duration-300 rounded-sm"
                      >
                        Enquire Package <ArrowRight size={12} />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Events;