import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const testimonials = [
  {
    quote: "Some places are so good to visit but you don't want to leave at end, in short The Sree Raaga Resorts descriptions leads to same choice. Good!",
    author: "Maria Silva"
  },
  {
    quote: "The culinary experiences at the restaurant were absolutely spectacular. Every meal felt like a masterpiece. Highly recommended!",
    author: "James Miller"
  },
  {
    quote: "A perfect escape from reality. The spa treatment was rejuvenating, and the staff was extremely professional and attentive.",
    author: "Sophia Chen"
  }
];

const About = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e] overflow-x-hidden ">
        
        {/* ================= HERO SECTION ================= */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white select-none">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold font-sans">
              Sree Raaga Resorts
            </span>
            <h1 className="text-4xl md:text-6xl font-light  leading-tight">
              About Sree Raaga Resorts
            </h1>
          </div>
        </section>

        {/* ================= WELCOME & STATS SECTION ================= */}
          {/* ================= SHOWCASE / ABOUT SECTION ================= */}
        <section className="relative pt-24 pb-24 px-6 bg-[#f7faff] text-[#0d2b4e] overflow-hidden">
          
          {/* Outlined brand text behind the staggered images */}
          <div 
            className="absolute top-[8%] lg:top-[-1%] left-1/2 -translate-x-1/2 text-[7vw]  uppercase tracking-[10px] font-medium text-[#c8a64d]/10 select-none pointer-events-none text-center whitespace-nowrap z-0"
          >
            Sree Raaga
          </div>

          {/* Staggered Images Grid */}
          <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-14 items-center px-4 z-10 mb-12">
            <WindowReveal 
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800" 
              alt="Villa Exterior" 
              className="h-[280px] md:h-[350px] lg:h-[400px] rounded-xl"
            />
            
            {/* Center image is taller and offset upwards, overlapping background text */}
            <WindowReveal 
              src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800" 
              alt="Villa Interior" 
              className="h-[340px] md:h-[430px] lg:h-[550px] md:-translate-y-6 rounded-xl"
            />
            
            <WindowReveal 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" 
              alt="Luxury Pool" 
              className="h-[280px] md:h-[350px] lg:h-[400px] rounded-xl"
            />
          </div>

          {/* Large Title Below Staggered Images */}
          <h2 className="text-5xl md:text-8xl  text-[#0d2b4e] tracking-[12px] uppercase text-center relative z-20 -mt-16 md:-mt-28 mb-6">
            Resorts
          </h2>

          {/* Centered Curated Description */}
          <p className="max-w-3xl mx-auto text-gray-500 text-center leading-relaxed text-xs lg:text-sm font-sans px-4 mb-20">
            Discover a world of luxury and relaxation with our carefully curated hotel offers, designed to enhance your stay and create lasting memories. Whether you're planning a romantic getaway, a family vacation, or a business trip, we have the perfect offer to suit your needs and elevate your experience.
          </p>

          {/* Stats Bar */}
          <div className="max-w-5xl mx-auto border-t border-b border-gray-100 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1,200+", label: "Guest Reviews" },
              { number: "24/7", label: "Front Desk" },
              { number: "15+", label: "Villa Suites" },
              { number: "17+", label: "Amenities" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-light text-[#c8a64d] mb-1">{stat.number}</span>
                <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>
        {/* ================= SPLIT FEATURE ROWS ================= */}
        <section className="py-24 px-6 bg-white">
          <div className=" space-y-32">
            
            {/* Row 1: Sophisticated Comfort */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="w-full h-[400px] md:h-[480px]">
                <WindowReveal 
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800"
                  alt="Sophisticated Comfort"
                  className="w-full h-full  shadow-xl"
                />
              </div>
              <div className="flex flex-col items-start select-none">
                <span className="text-[#c8a64d] uppercase tracking-[4px] text-[10px] font-sans font-bold block mb-4">
                  Sree Raaga Resorts
                </span>
                <h2 className="text-3xl md:text-4xl font-light  text-[#0d2b4e] mb-6">
                  Sophisticated Comfort
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed font-sans mb-8">
                  Every element of our rooms has been carefully curated to provide the
                  highest standard of comfort. From the fine linens and custom furnishings
                  to the stunning views of the surrounding natural landscape, we ensure
                  your stay is peaceful and relaxing.
                </p>
              </div>
            </div>

            {/* Row 2: A Unique Experience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
              <div className="flex flex-col items-start select-none">
                <span className="text-[#c8a64d] uppercase tracking-[4px] text-[10px] font-sans font-bold block mb-4">
                  Our Experience
                </span>
                <h2 className="text-3xl md:text-4xl font-light  text-[#0d2b4e] mb-6">
                  A Unique Experience
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed font-sans mb-8">
                  Immerse yourself in unique experiences tailored to your lifestyle.
                  Whether you choose to unwind by the pool, indulge in luxury dining,
                  or explore nature trails, our resort offers a perfect balance of leisure
                  and adventure.
                </p>
              </div>
                <div className="w-full h-[400px] md:h-[480px]">
                <WindowReveal 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800"
                  alt="A Unique Experience"
                  className="w-full h-full rounded-lg shadow-xl"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ================= AMENITIES ICONS ROW ================= */}
        <section className="py-20 px-6 bg-[#f7f5ee]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-center items-center">
            {[
              { 
                icon: (
                  <svg className="w-10 h-10 text-[#0d2b4e]/70 group-hover:text-[#c8a64d] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12a10 10 0 0 1 14 0" />
                    <path d="M8.5 15a5 5 0 0 1 7 0" />
                    <circle cx="12" cy="18" r="1" fill="currentColor" />
                    <path d="M15 10v2.5c0 1.2.8 2.2 2 2.5 1.2-.3 2-1.3 2-2.5V10l-2-1-2 1z" />
                    <path d="M16.5 12l0.7 0.7 1.3-1.3" />
                  </svg>
                ), 
                name: "Wifi & Internet" 
              },
              { 
                icon: (
                  <svg className="w-10 h-10 text-[#0d2b4e]/70 group-hover:text-[#c8a64d] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    {/* Golf cart / buggy wheels */}
                    <circle cx="6" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />
                    {/* Frame and canopy */}
                    <path d="M3 18h18" />
                    <path d="M8 18V8h7v10" />
                    <path d="M5 8h12v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1z" />
                    {/* Steering wheel */}
                    <line x1="8" y1="12" x2="11" y2="10" />
                    <circle cx="11" cy="10" r="1" />
                  </svg>
                ), 
                name: "Buggy services" 
              },
              { 
                icon: (
                  <svg className="w-10 h-10 text-[#0d2b4e]/70 group-hover:text-[#c8a64d] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="6" width="14" height="10" rx="1" />
                    <path d="M8 16v3h4v-3H8zM6 19h8" />
                    <rect x="19" y="8" width="2" height="8" rx="0.5" />
                    <circle cx="20" cy="10" r="0.5" fill="currentColor" />
                    <line x1="20" y1="12" x2="20" y2="15" strokeWidth="1" />
                  </svg>
                ), 
                name: "Smart TV" 
              },
              { 
                icon: (
                  <svg className="w-10 h-10 text-[#0d2b4e]/70 group-hover:text-[#c8a64d] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17h18" />
                    <path d="M6 17a6 6 0 0 1 12 0" />
                    <circle cx="12" cy="9.5" r="1.5" />
                    <path d="M2 20h20" />
                  </svg>
                ), 
                name: "Room Service" 
              },
              { 
                icon: (
                  <svg className="w-10 h-10 text-[#0d2b4e]/70 group-hover:text-[#c8a64d] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="4" width="14" height="16" rx="2" />
                    <circle cx="12" cy="13" r="5" />
                    <circle cx="12" cy="13" r="3" strokeDasharray="2 1" />
                    <circle cx="8" cy="7" r="0.8" fill="currentColor" />
                    <circle cx="10" cy="7" r="0.8" fill="currentColor" />
                    <line x1="13" y1="7" x2="16" y2="7" />
                  </svg>
                ), 
                name: "Laundry Services" 
              },
              { 
                icon: (
                  <svg className="w-10 h-10 text-[#0d2b4e]/70 group-hover:text-[#c8a64d] transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12h8l-1 8H5l-1-8z" />
                    <path d="M4 12a4 4 0 0 1 8 0" />
                    <line x1="18" y1="4" x2="10" y2="20" />
                    <path d="M16 4l3 3-1.5 1.5-3-3L16 4z" fill="currentColor" />
                    <path d="M20 12l0.5 0.5-0.5 0.5-0.5-0.5z" fill="currentColor" />
                    <path d="M15 18l0.4 0.4-0.4 0.4-0.4-0.4z" fill="currentColor" />
                  </svg>
                ), 
                name: "Housekeeper Services" 
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                <div className="mb-4 text-[#0d2b4e]/60 group-hover:text-[#c8a64d] transition-colors duration-300">
                  {item.icon}
                </div>
                <span className="text-sm md:text-base font-light text-gray-500  group-hover:text-[#0d2b4e] transition-colors duration-300">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= THREE COLUMNS ACTIVITIES ================= */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Restaurant & Bars",
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800"
              },
              {
                title: "Spa & Wellness",
                image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
              },
              {
                title: "Fitness Center",
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800"
              }
            ].map((act, idx) => (
              <div key={idx} className="relative overflow-hidden group  aspect-[3/4] shadow-md">
                <WindowReveal src={act.image} alt={act.title} className="w-full h-full" delay={idx * 0.1} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
                  <h3 className="text-xl md:text-2xl  font-light text-white uppercase tracking-wide">
                    {act.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= TESTIMONIALS SLIDER ================= */}
    
        {/* ================= CALL TO ACTION (CTA) ================= */}
        <section
          className="relative py-28 px-6 bg-cover bg-center flex flex-col items-center justify-center text-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/60"></div>
          <div className="relative z-10 text-white select-none max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-light  leading-snug mb-8">
              Luxury Awaits, <br /> Book Your Stay Today!
            </h2>
            <Link
              to="/rooms"
              className="inline-block px-10 py-4 bg-[#c8a64d] text-[#0d2b4e] hover:bg-[#b08e3d] hover:text-white transition duration-300 text-xs uppercase tracking-widest font-semibold font-sans rounded"
            >
              Book Now
            </Link>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default About;