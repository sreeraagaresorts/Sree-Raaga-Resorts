import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Phone, 
  Mail, 
  Clock, 
  Calendar, 
  Tag, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// Custom "Window Open" Reveal scroll animation component
function WindowReveal({ src, alt, className = "", delay = 0 }) {
  return (
    <div className={`relative overflow-hidden ${className} group `}>
      <motion.div
        initial={{ clipPath: "inset(15% 15% 15% 15% round 24px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 1.4, ease: [0.25, 1, 0.35, 1], delay }}
        className="w-full h-full"
      >
        <motion.img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1.0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.25, 1, 0.35, 1], delay }}
        />
      </motion.div>
    </div>
  );
}
// Custom outline SVG icon for Water Sports (Paddleboarder / Surfer silhouette)
function WaterSportsIcon({ className = "w-12 h-12" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Wave lines at the bottom */}
      <path d="M2 18c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2.5-1 4-1" />
      <path d="M2 21c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1 2.5-1 4-1" />
      
      {/* Paddleboard / Surfboard outline */}
      <path d="M3 14.5c2-0.5 8-1.5 18-0.5 1 0.1 1.5 0.8 1 1.5-0.5 0.7-1.5 0.5-2.5 0.5H4.5c-1 0-1.8-0.8-1.5-1.5z" />
      
      {/* Paddle */}
      <line x1="8" y1="16" x2="16" y2="4" />
      <path d="M15 5.5l1.5-2.2c0.3-0.4 0.9-0.4 1.2 0l0.8 1.2c0.3 0.4 0.1 1-.4 1.2L16.6 6.5" />
      
      {/* Surfer/Paddleboarder body */}
      <circle cx="11.5" cy="6.5" r="1.5" />
      <path d="M9.5 11l1.5-3 2 0.5 1.5 2.5" />
      <path d="M11 8v4" />
    </svg>
  );
}

const sliderImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=800",
    title: "Surfing Action",
    category: "WAVE RIDING"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800",
    title: "Wakeboarding Thrill",
    category: "SPEED SPORTS"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800",
    title: "Jet Ski Adventure",
    category: "MOTOR WATER SPORTS"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1517176118179-65244903d13c?q=80&w=800",
    title: "Paddleboard Exploring",
    category: "RELAXING RIDES"
  }
];

const Amenities = () => {
  const [sliderIndex, setSliderIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine items visible per page on different screens
  const getItemsPerPage = () => {
    if (windowWidth < 640) return 1;
    if (windowWidth < 1024) return 2;
    return 4; // Full desktop view shows all 4 in a grid row as in the screenshot
  };

  const itemsPerPage = getItemsPerPage();
  const maxIndex = Math.max(0, sliderImages.length - itemsPerPage);

  const handlePrev = () => {
    setSliderIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSliderIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e] overflow-x-hidden ">
        
        {/* ================= HERO SECTION ================= */}
        <section
          className="relative h-[85vh] flex flex-col justify-between items-center bg-cover bg-center pt-32 pb-12"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/45"></div>
          
          {/* Main Hero Text */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl select-none my-auto">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold ">
              Sree Raaga Resorts Amenities
            </span>
            <h1 className="text-5xl md:text-7xl font-light  leading-tight mb-6">
              Experiences For Every Occasion
            </h1>
            {/* Details Row */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 pt-8 border-t border-white/20  text-[10px] md:text-xs uppercase tracking-widest text-white/80">
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-[#c8a64d]" />
                <span>+91 89045 61155</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-[#c8a64d]" />
                <span>info@sreeraagaresorts.in</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅 Mon - Sun</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🕒 24/7 Front Desk</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= EXPERIENCES GRID ================= */}
        <section className="bg-white text-[#0d2b4e]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { 
                title: "Luxury Stay", 
                image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800" 
              },
              { 
                title: "Grand Celebrations", 
                image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800" 
              },
              { 
                title: "Day Out & Play", 
                image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800" 
              },
              { 
                title: "Multi-Cuisine Dining", 
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800" 
              }
            ].map((exp, index) => (
              <div key={index} className="relative h-[400px] sm:h-[500px] lg:h-[650px] group overflow-hidden shadow-lg">
                <WindowReveal 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full"
                  delay={index * 0.15}
                />
                
                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-20 text-white text-center">
                  <h3 className="text-xl font-light tracking-wide uppercase drop-shadow mb-1">
                    {exp.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#c8a64d] mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= DETAILED AMENITIES LIST SECTION ================= */}
        <section className="py-24 px-6 bg-[#fcfaf2]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 select-none">
              <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold ">
                Experiences For Every Occasion
              </span>
              <h2 className="text-4xl md:text-6xl font-light  text-[#0d2b4e]">
                Resort Amenities & Offerings
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                {
                  category: "Stay",
                  items: [
                    "Executive Rooms (35 Well-appointed)",
                    "1 BHK Villas (9 suitable for couples/groups)",
                    "Compact Villas (5 Row-house style)",
                    "Duplex Villa (1 Unique unit with Private Pool)"
                  ]
                },
                {
                  category: "Work",
                  items: [
                    "Dedicated Co-Working Space",
                    "Corporate Retreat Facilities",
                    "Meeting & Networking Areas",
                    "High-Speed Connectivity"
                  ]
                },
                {
                  category: "Play",
                  items: [
                    "60ft x 30ft Swimming Pool",
                    "Rain Dance Arena",
                    "Indoor Games & TT",
                    "Outdoor Games (Cricket, Volleyball)",
                    "Adventure Activities",
                    "Children's Play Area"
                  ]
                },
                {
                  category: "Celebrate",
                  items: [
                    "Grand Banquet Hall (800 Capacity)",
                    "Landscaped Event Lawn (500 Capacity)",
                    "Mini Banquet Hall (150 Capacity)",
                    "Wedding & Reception Venues",
                    "Community & Cultural Events"
                  ]
                },
                {
                  category: "Dine",
                  items: [
                    "Multi-Cuisine Dining Hall",
                    "Coffee Shop",
                    "Bar & Restaurant (150 Seating)",
                    "Sports Bar (Snooker, TT, DJ setup)"
                  ]
                }
              ].map((group, idx) => (
                <div key={idx} className="bg-white border border-gray-100 p-8 shadow-md rounded-sm flex flex-col">
                  <h3 className="text-xl  text-[#0d2b4e] border-b border-[#c8a64d]/30 pb-3 mb-4 uppercase tracking-[2px] font-semibold text-center">
                    {group.category}
                  </h3>
                  <ul className="space-y-3  text-xs text-gray-500 leading-relaxed font-light flex-grow">
                    {group.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#c8a64d] rounded-full shrink-0 mt-1.5"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Amenities;
