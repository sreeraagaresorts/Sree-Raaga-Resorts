import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import restaurantIcon from "../../assets/images/icons/restaurant.svg";
import spaIcon from "../../assets/images/icons/spa.svg";
import fitnessIcon from "../../assets/images/icons/fitness.svg";

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
import wifiIcon from "../../assets/icons/wifi.png";
import buggyIcon from "../../assets/icons/car.png";
import tvIcon from "../../assets/icons/tv.png";
import roomServiceIcon from "../../assets/icons/services.png";
import laundryIcon from "../../assets/icons/laundry.png";
import housekeepingIcon from "../../assets/icons/cleaning.png";


const amenities = [
  { icon: wifiIcon, name: "Wifi & Internet" },
  { icon: buggyIcon, name: "Buggy Services" },
  { icon: tvIcon, name: "Smart TV" },
  { icon: roomServiceIcon, name: "Room Service" },
  { icon: laundryIcon, name: "Laundry Services" },
  { icon: housekeepingIcon, name: "Housekeeper Services" },
];

const About = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e] overflow-x-hidden ">
        
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
            <span className="text-white uppercase tracking-[6px] block mb-2 text-[17px]  font-semibold ">
              Sree Raaga Resorts
            </span>
            <h1 className="text-4xl md:text-[92px] font-medium  font-corm leading-tight">
              About Sree Raaga Resorts
            </h1>
          </div>
        </section>

        {/* ================= WELCOME & STATS SECTION ================= */}
          {/* ================= SHOWCASE / ABOUT SECTION ================= */}
       <section className="relative py-20 md:py-48 px-6 bg-[#fdfeff]  text-[#0d2b4e] overflow-hidden">
               
               {/* Outlined brand text behind the staggered images */}
               <div 
                 className="absolute top-[8%] lg:top-[4%] left-1/2 -translate-x-1/2 text-[9vw] font-corm  uppercase tracking-[5px] font-medium text-[#3fbcc3]/10 select-none pointer-events-none text-center whitespace-nowrap z-0"
               >
                 Sree Raaga
               </div>
     
               {/* Staggered Images Grid */}
               <div className="relative max-w-[150vh] mx-auto grid grid-cols-1 md:grid-cols-3 gap-24 items-center px-4 z-10 mb-12">
                 <WindowReveal 
                   src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800" 
                   alt="Villa Exterior" 
                   className="h-[280px] md:h-[350px] lg:h-[400px] "
                 />
                 
                 {/* Center image is taller and offset upwards, overlapping background text */}
                 <WindowReveal 
                   src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800" 
                   alt="Villa Interior" 
                   className="h-[340px] md:h-[430px] lg:h-[520px] md:-translate-y-6 "
                 />
                 
                 <WindowReveal 
                   src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" 
                   alt="Luxury Pool" 
                   className="h-[280px] md:h-[350px] lg:h-[400px] "
                 />
               </div>
     
               {/* Large Title Below Staggered Images */}
               <h2 className="text-5xl md:text-[120px] font-[400]  text-[#c18e35] tracking-[12px] font-corm uppercase text-center relative z-20 -mt-16 md:-mt-30 mb-6">
                 Resorts
               </h2>
     
               {/* Centered Curated Description */}
               <p className="max-w-3xl mx-auto text-gray-500 text-center font-jost leading-relaxed text-xs lg:text-[17px]   mb-20">
     Discover a world of luxury and relaxation with our carefully curated hotel offers, designed to enhance your stay and create
     lasting memories. Whether you’re planning a romantic getaway, a family vacation, or a business trip, we have the perfect
     offer to suit your needs and elevate your experience.          </p>
     
     
     <div className="flex justify-center mb-20">
       <button className="group flex items-center gap-4 uppercase tracking-wide text-sm font-medium text-black">
         <span className="w-9 h-9 rounded-full border border-black flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white">
           <svg
             xmlns="http://www.w3.org/2000/svg"
             className="w-4 h-4"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             strokeWidth={2}
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M5 12h14m-5-5 5 5-5 5"
             />
           </svg>
         </span>
     
      <Link to="/about" className="group inline-block">
       <span className="relative">
         DISCOVER MORE
         <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full"></span>
       </span>
     </Link>
       </button>
     </div>
     
           <div className="max-w-5xl mx-auto  py-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
       {[
         { number: "1,200+", label: "Guest Reviews" },
         { number: "24/7", label: "Front Desk" },
         { number: "15", label: "Villa Suites" },
         { number: "17+", label: "Amenities" },
       ].map((stat, i) => (
         <motion.div
           key={i}
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, amount: 0.3 }}
           transition={{
             duration: 0.8,
             delay: i * 0.2,
             ease: "easeOut",
           }}
           className="flex flex-col items-center"
         >
           <span className="text-3xl md:text-[92px] font-medium font-corm text-[#c8a64d] mb-1">
             {stat.number}
           </span>
     
           <span className="text-sm uppercase tracking-widest w-50 text-gray-500 font-medium">
             {stat.label}
           </span>
         </motion.div>
       ))}
     </div>
             </section>
     
        {/* ================= SPLIT FEATURE ROWS ================= */}
        <section className="py-24 px-6 bg-[#fdfeff] ">
          <div className=" space-y-32">
            
            {/* Row 1: Sophisticated Comfort */}
            <div className=" max-w-[150vh]  mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="w-full h-[400px] md:h-[480px]">
                <WindowReveal 
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=800"
                  alt="Sophisticated Comfort"
                  className="w-full h-full  shadow-xl"
                />
              </div>
              <div className="flex flex-col items-start select-none">
                {/* <span className="text-[#c8a64d] uppercase tracking-[4px] text-[10px]  font-bold block mb-4">
                  Sree Raaga Resorts
                </span> */}
                <h2 className="text-3xl md:text-5xl font-medium font-corm  text-[#0d2b4e] mb-6">
                  Sophisticated Comfort
                </h2>
                <p className="text-gray-500 text-[17px] leading-relaxed  mb-8  text-start ">
                  Every element of our rooms has been carefully curated to provide the
                  highest standard of comfort. From the fine linens and custom furnishings
                  to the stunning views of the surrounding natural landscape, we ensure
                  your stay is peaceful and relaxing.
                </p>
              </div>
            </div>

            {/* Row 2: A Unique Experience */}
            <div className=" max-w-[150vh]  mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
              <div className="flex flex-col items-start select-none">
                {/* <span className="text-[#c8a64d] uppercase tracking-[4px] text-[10px]  font-bold block mb-4">
                  Our Experience
                </span> */}
                <h2 className="text-3xl md:text-5xl font-medium font-corm  text-[#0d2b4e] mb-6">
                  A Unique Experience
                </h2>
                <p className="text-gray-500 text-[17px] leading-relaxed  mb-8 text-start">
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
                  className="w-full h-full  shadow-xl"
                />
              </div>
            </div>

          </div>
        </section>

            {/* Icons Row */}
            <div className="max-w-[160vh] bg-[#fdfeff]  mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4 justify-center items-center ">
  {amenities.map((item, idx) => (
    <div
      key={idx}
      className="flex flex-col items-center text-center group cursor-default"
    >
      <div className=" overflow-hidden">
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

        {/* ================= THREE COLUMNS ACTIVITIES ================= */}
        <section className="py-24 px-6 bg-[#fdfeff] ">
          <div className="max-w-[150vh] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Restaurant & Bars",
                image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
                icon: restaurantIcon
              },
              {
                title: "Spa & Wellness",
                image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800",
                icon: spaIcon
              },
              {
                title: "Fitness Center",
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
                icon: fitnessIcon
              }
            ].map((act, idx) => (
              <div key={idx} className="relative overflow-hidden group aspect-[3/4] shadow-md">
                <WindowReveal src={act.image} alt={act.title} className="w-full h-full" delay={idx * 0.1} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent z-10"></div>
                <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center justify-center gap-3 text-center text-[#c8a64d]">
                  <img src={act.icon} alt={act.title} className="w-8 h-8 group-hover:scale-110  transition-transform duration-300 object-contain" />
                  <h3 className="text-xl md:text-3xl font-medium font-corm text-white  tracking-wide">
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
          className="relative py-42 px-6 bg-cover bg-center flex flex-col items-center justify-center text-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/60"></div>
          <div className="relative z-10 text-white select-none max-w-3xl">
            <h2 className="text-3xl md:text-6xl font-medium font-corm   mb-8">
              Luxury Awaits, <br /> Book Your Stay Today!
            </h2>
            <Link
              to="/rooms"
              className="inline-block px-10 py-4 border border-white text-white hover:bg-white  hover:text-black transition duration-300 text-xs uppercase tracking-widest font-semibold  "
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