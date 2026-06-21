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
      <div className="bg-[#fcfaf2] text-[#0d2b4e] overflow-x-hidden font-serif">
        
        {/* ================= HERO SECTION ================= */}
        <section
          className="relative h-[85vh] flex flex-col justify-between items-center bg-cover bg-center pt-32 pb-12"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/45"></div>
          
          {/* Main Hero Text */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl select-none my-auto">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold font-sans">
              Swiss Resort Amenities
            </span>
            <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight mb-6">
              Kayak Surfing
            </h1>
             {/* Quick Info Bar Overlay */}
          <div className="relative z-10 w-full ">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 text-center items-center  pt-8">
              {/* Phone */}
              <div className="flex flex-col items-center justify-center text-white">
                <Phone className="w-5 h-5 text-white/90 mb-3 rotate-[10deg]" strokeWidth={1.2} />
                <a href="tel:+41965677854" className="text-xs md:text-sm font-sans font-light tracking-wider hover:text-[#c8a64d] transition-colors">
                  +41-96567-7854
                </a>
              </div>

              {/* Email */}
              <div className="flex flex-col items-center justify-center text-white">
                <Mail className="w-5 h-5 text-white/90 mb-3" strokeWidth={1.2} />
                <a href="mailto:restaurant@swiss-resort.com" className="w-50 text-xs md:text-sm font-sans font-light tracking-wider hover:text-[#c8a64d] transition-colors break-all">
                  support@sreeraagaresorts.in
                </a>
              </div>

              {/* Days */}
              <div className="flex flex-col items-center justify-center text-white">
                <Phone className="w-5 h-5 text-white/90 mb-3 -rotate-[10deg]" strokeWidth={1.2} />
                <span className="text-xs md:text-sm font-sans font-light tracking-wider">
                  Monday - Sunday
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center text-white">
                <Phone className="w-5 h-5 text-white/90 mb-3 rotate-[35deg]" strokeWidth={1.2} />
                <span className="text-xs md:text-sm font-sans font-light tracking-wider">
                  06:00 am - 22:30 pm
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-col items-center justify-center text-white col-span-2 md:col-span-1">
                <Phone className="w-5 h-5 text-white/90 mb-3 -rotate-[35deg]" strokeWidth={1.2} />
                <span className="text-xs md:text-sm font-sans font-light tracking-wider">
                  $50 - $450
                </span>
              </div>
            </div>
          </div>
          </div>

       
        </section>

  
        {/* ================= EXPERIENCES GRID ================= */}
        <section className=" bg-white text-[#0d2b4e]">
          

          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  ">
            {[
              { 
                title: "Yoga Classes", 
                image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800" 
              },
              { 
                title: "Water Sports", 
                image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" 
              },
              { 
                title: "Scuba Diving", 
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800" 
              },
              { 
                title: "Other Activities", 
                image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800" 
              }
            ].map((exp, index) => (
              <div key={index} className="relative h-[400px] sm:h-[500px] lg:h-[650px] group overflow-hidden shadow-lg">
                <WindowReveal 
                  src={exp.image} 
                  alt={exp.title} 
                  className="w-full h-full"
                  delay={index * 0.15}
                />
                
                {/* Gradient overlay
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10"></div> */}
                
                {/* Content Overlay */}
                <div className="absolute bottom-6 left-6 right-6 z-20 text-white text-center">
                  <h3 className="text-xl font-light tracking-wide uppercase  drop-shadow mb-1">
                    {exp.title}
                  </h3>
                  <div className="w-8 h-[1px] bg-[#c8a64d] mx-auto scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================= TWO COLUMN DETAILED TEXT ================= */}
        <section className="py-24 px-6 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Big Typography Column */}
            <div className="lg:col-span-5 select-none">
              <h3 className="text-2xl md:text-3xl font-light font-serif leading-relaxed text-[#0d2b4e] lg:border-l-2 lg:border-[#c8a64d] lg:pl-8">
                We have some great surfing locations all around the British Isles. The Atlantic 
                coastline of Cornwall, Devon, Wales, Ireland and Scotland together with the 
                North Sea coastline of England and Northern Ireland.
              </h3>
            </div>

            {/* Right Standard Narrative Column */}
            <div className="lg:col-span-7 space-y-6 text-gray-500 font-sans text-xs md:text-sm leading-relaxed">
              <p>
                If you are completely new to surfing and kayaking then taking a lesson from one of the 
                many British Surfing Association coaches and centers around the UK is highly recommended. 
                Plan as much as possible before you head out into the water, educate yourself or get 
                some training on how to surf safely, how to recognize dangerous situations and the 
                etiquette of surfing with others.
              </p>
              <p>
                There are books, web sites, newsletters, and safety notices that outline guidelines 
                and warnings that can help. Everyone surfs for fun, lots of people do this with friends 
                and club members and often enjoy doing this in competition.
              </p>
              <p>
                Competitions are run at every level, from introductory local events right up to World 
                Championships. The best thing about competition is that you'll meet and learn from 
                others, and improve many of the key skills that you need in everyday surfing and water 
                adventures.
              </p>
            </div>
            
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Amenities;
