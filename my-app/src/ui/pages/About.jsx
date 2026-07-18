import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import restaurantIcon from "../../assets/images/icons/restaurant.svg";
import { Helmet } from "react-helmet";
import spaIcon from "../../assets/images/icons/spa.svg";
import fitnessIcon from "../../assets/images/icons/fitness.svg";
import wifiIcon from "../../assets/icons/wifi.png";
import buggyIcon from "../../assets/icons/car.png";
import tvIcon from "../../assets/icons/tv.png";
import roomServiceIcon from "../../assets/icons/services.png";
import laundryIcon from "../../assets/icons/laundry.png";
import housekeepingIcon from "../../assets/icons/cleaning.png";
import AOS from "aos";
import "aos/dist/aos.css";

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
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true,     // Animate only once
      offset: 100,    // Trigger animation 100px before element
    });
  }, []);
  return (
    <>
    {/* 2. ADD HELMET COMPONENT HERE */}
     <Helmet>
  <title>About Us | Sree Raaga Resorts</title>

  <meta
    name="description"
    content="Learn about Sree Raaga Resorts, where luxury, comfort, and nature come together. Discover our story, hospitality, premium accommodations, and commitment to creating unforgettable guest experiences."
  />

  <meta
    name="keywords"
    content="About Sree Raaga Resorts, Sree Raaga story, luxury resort, premium resort, nature resort, family resort, hospitality, resort in Karnataka, luxury villas, weekend getaway"
  />

  {/* Open Graph Tags */}
  <meta
    property="og:title"
    content="About Sree Raaga Resorts | Our Story & Hospitality"
  />

  <meta
    property="og:description"
    content="Discover the story behind Sree Raaga Resorts, our passion for hospitality, luxurious accommodations, scenic surroundings, and exceptional guest experiences."
  />

  <meta property="og:type" content="website" />
</Helmet>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e]  ">
        
        {/* ================= HERO SECTION ================= */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/a3.avif')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white select-none">
            <span className="text-white uppercase tracking-[6px] block mb-2 text-[17px]  font-semibold " data-aos="fade-up" >
              Sree Raaga Resorts
            </span>
            <h1 className="text-4xl md:text-[92px] font-medium   font-corm leading-tight" data-aos="fade-up" data-aos-delay="100">
              About Sree Raaga Resorts
            </h1>
          </div>  
        </section>

        <section className="relative py-20  md:py-48 px-4 md:px-6 bg-[#fdfeff] text-[#0d2b4e] overflow-hidden">
      
          {/* Outlined brand text behind the staggered images */}
          <div 
            className="absolute top-[3%] lg:top-[4%] left-1/2 -translate-x-1/2 text-[12vw] md:text-[9vw] font-corm uppercase tracking-[5px] font-bold md:font-medium md:text-[#3fbcc3]/10 text-[#011b3c]/30 select-none pointer-events-none text-center whitespace-nowrap z-0"
          >
            Sree Raaga
          </div>

          {/* Staggered Images Grid */}
          <div className="relative max-w-[170vh] mx-auto grid grid-cols-3 gap-2 sm:gap-6 md:gap-12 lg:gap-24 items-center z-10 mb-8 md:mb-12">
            <WindowReveal 
              src="/al.avif" 
              alt="Villa Exterior" 
              className="h-[110px] mb-6 md:mb-0 sm:h-[220px] md:h-[350px] lg:h-[425px] w-full object-cover "
            />
            
            {/* Center image is taller and offset upwards */}
            <WindowReveal 
              src="/ac.avif" 
              alt="Villa Interior" 
              className="h-[140px] sm:h-[280px] md:h-[430px] lg:h-[520px] -translate-y-3 md:-translate-y-6 w-full object-cover "
            />
            
            <WindowReveal 
              src="/ar.avif" 
              alt="Luxury Pool" 
              className="h-[110px] mb-6 md:mb-0 sm:h-[220px] md:h-[350px] lg:h-[425px] w-full object-cover "
            />
          </div>

          {/* Large Title Below Staggered Images */}
          <h2 className="text-4xl sm:text-6xl md:text-[120px] font-[400] text-[#c18e35] tracking-[6px] md:tracking-[12px] font-corm font-bold md:font-medium uppercase text-center relative z-20 -mt-6 sm:-mt-12 md:-mt-30 mb-6">
            Resorts
          </h2>

          {/* Centered Curated Description */}
          <p className="max-w-3xl mx-auto text-gray-500 text-center font-jost leading-relaxed text-[17px] mb-12 md:mb-20 px-2">
            Discover a world of luxury and relaxation with our carefully curated hotel offers, designed to enhance your stay and create lasting memories. Whether you’re planning a romantic getaway, a family vacation, or a business trip, we have the perfect offer to suit your needs and elevate your experience.
          </p>

          {/* Call to Action Button */}
          <div className="flex justify-center mb-16 md:mb-20">
            <button className="group flex items-center gap-4 uppercase tracking-wide text-xs md:text-sm font-medium text-black">
              <span className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-black flex items-center justify-center transition-all duration-300 group-hover:bg-black group-hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 md:w-4 md:h-4"
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

          {/* Stats Grid */}
          <div className="max-w-5xl mx-auto border-t border-b border-gray-100 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
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
                <span className="text-4xl sm:text-6xl md:text-[92px] font-medium font-corm text-[#c8a64d] mb-1 md:mb-2">
                  {stat.number}
                </span>

                <span className="text-[17px]  uppercase tracking-widest w-full text-gray-500 font-medium">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= VIDEO SECTION ================= */}
        <section 
          className={`relative w-full my-16  flex items-center justify-center bg-cover bg-center transition-all duration-700 ${isVideoOpen ? 'aspect-video max-h-[90vh]' : 'h-[500px] md:h-[750px]'}`}
          style={{
            backgroundImage: !isVideoOpen ? "url('/cd.avif')" : "none",
            backgroundColor: ""
          }}
        >
          {!isVideoOpen ? (
            <>
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-[#04121a]/20"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center text-white select-none px-4">
                <span className="text-white/90 uppercase tracking-[4px] text-xs md:text-[13px] font-medium mb-4 block font-jost">
          
                </span>
                
         
                
                <button  data-aos="fade-up" data-aos-delay="300"
                  onClick={() => setIsVideoOpen(true)}
                  className="group flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-105"
                >
                  <div className="w-16 h-16 md:w-[135px] md:h-[135px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-all">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-5 h-5 md:w-8 md:h-8 text-white ml-1"
                    >
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                  <span className="text-white uppercase tracking-[3px] text-[10px] md:text-xs font-semibold group-hover:text-white transition-colors mt-2">
                    PLAY INTRO VIDEO
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 w-full h-full z-20">
              <button 
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-30 w-10 h-10 bg-black/50 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition backdrop-blur cursor-pointer border border-white/20"
                title="Close Video"
              >
                <X size={20} />
              </button>
              <video
                src="/IMG_3557.MP4"
                title="Sree Raaga Resorts Intro"
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              ></video>
            </div>
          )}
        </section>
      
        {/* ================= SPLIT FEATURE ROWS ================= */}
        <section className="md:py-24 px-6 bg-[#fdfeff] ">
          {/* Increased space-y-32 to space-y-48 for more breathing room between rows */}
          <div className="space-y-48">
            
            {/* Row 1: Sophisticated Comfort */}
            <div className="max-w-[150vh] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Unified Height here */}
              <div className="w-full h-[400px] md:h-[650px]">
                <WindowReveal 
                  src="/director.avif"
                  alt="Sophisticated Comfort"
                  className="w-full h-full shadow-xl "
                />
              </div>
              <div className="flex flex-col items-start select-none" data-aos="fade-left" data-aos-delay="200">
            <h2 className="text-3xl md:text-5xl font-medium font-corm text-[#0d2b4e] mb-6">
  A Message from Our Director
</h2>

<p className="text-gray-500 text-[17px] leading-relaxed mb-0 md:mb-8 text-start">
  At Sree Raaga Resorts, our vision has always been to create a destination where guests can reconnect with nature while enjoying exceptional comfort and warm hospitality. Every detail of our resort has been thoughtfully designed to provide memorable experiences, whether you're visiting for a family getaway, a celebration, or a corporate retreat. We are committed to delivering personalized service, maintaining the highest standards of quality, and ensuring that every guest leaves with cherished memories. Thank you for choosing Sree Raaga Resorts—we look forward to welcoming you.
</p>
              </div>
            </div>

            {/* Row 2: A Unique Experience */}
            <div className="max-w-[150vh] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-[-90px] md:mt-[-60px] ">
              <div className="order-2 md:order-1 flex flex-col items-start select-none" data-aos="fade-right" data-aos-delay="200">
          <h2 className="text-3xl md:text-5xl font-medium font-corm text-[#0d2b4e] mb-6">
  The Sree Raaga Resort Experience
</h2>

<p className="text-gray-500 text-[17px] leading-relaxed mb-8 text-start">
  Discover a destination where refined luxury blends seamlessly with the tranquility of nature. Every stay at Sree Raaga Resorts is thoughtfully curated with elegant accommodations, personalized hospitality, exceptional dining, and world-class amenities. From intimate getaways to grand celebrations, we create experiences that are sophisticated, memorable, and truly extraordinary.
</p>
              </div>
              {/* Unified Height here */}
              <div className="order-1 md:order-2 w-full h-[400px] md:h-[650px]">
                <WindowReveal 
                  src="/train.avif"
                  alt="A Unique Experience"
                  className="w-full h-full shadow-xl "
                />
              </div>
            </div>

          </div>
        </section>

        {/* Icons Row */}
        
       {/* ================= RESORT FACILITIES ================= */}
<section className="bg-[#fdfeff] py-14" data-aos="fade-up" data-aos-delay="200">
  {/* Section Heading */}
  <div className="max-w-6xl mx-auto text-center mb-12">
    <h2 className="text-4xl md:text-6xl font-medium font-corm text-[#0d2b4e]">
      Resort Facilities
    </h2>
  </div>

  {/* Icons Row */}
  <div className="max-w-[160vh] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4 justify-center items-center py-10">
    {amenities.map((item, idx) => (
      <div
        key={idx}
        className="flex flex-col items-center text-center group cursor-default"
      >
        <div className="overflow-hidden mb-4">
          <img
            src={item.icon}
            alt={item.name}
            className="w-20 h-20 px-4 object-contain transition-all duration-300 group-hover:scale-110"
          />
        </div>

        <span className="text-[16px] md:text-[24px] font-semibold text-gray-500 font-corm group-hover:text-[#0d2b4e] transition-colors duration-300">
          {item.name}
        </span>
      </div>
    ))}
  </div>
</section>

        <section className="bg-[#fdfeff] " data-aos="fade-up" data-aos-delay="300">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {[
     {
  title: "Swimming Pool",
  image:
    "/pool.avif",
  description:
    "Enjoy our refreshing swimming pool, perfect for relaxation, leisure, and a rejuvenating experience.",
},
{
  title: "Adventures Activities",
  image:
    "./adv.avif",
  description:
    "Take part in exciting indoor and outdoor activities designed for fun, recreation, and memorable experiences for guests of all ages.",
},
{
  title: "Indoor Games",
  image:
    "./indoor.avif",
  description:
    "Enjoy a variety of indoor games including table tennis, carrom, chess, and more for hours of entertainment.",
},
{
  title: "Play Area",
  image:
    "./play.avif",
  description:
    "A safe and exciting play area where children can have fun, explore, and create unforgettable memories.",
},
    ].map((exp, index) => (
      <div
        key={index}
        className="relative h-[500px] lg:h-[850px] overflow-hidden group"
      >
        {/* Background Image */}
        <img
          src={exp.image}
          alt={exp.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 text-white">
          <span className="uppercase tracking-widest text-[17px] font-jost mb-10">
            Experience
          </span>

          <h3 className="font-corm text-4xl lg:text-6xl font-light  mb-8">
            {exp.title}
          </h3>

          <p className="max-w-xs text-sm lg:text-base text-white/90 mb-12 font-medium">
            {exp.description}
          </p>

    <Link
  to="/amenities"
  className="
    block
    w-full sm:w-auto
    px-12 py-4
    border border-white
    uppercase
    tracking-widest
    text-sm
    font-semibold
    text-center

    opacity-100
    translate-y-0

    md:opacity-0
    md:translate-y-4
    md:group-hover:opacity-100
    md:group-hover:translate-y-0

    hover:bg-white
    hover:text-black
    transition-all
    duration-500
  "
>
  Discover More
</Link>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* ================= CALL TO ACTION (CTA) ================= */}
        {/* <section
          className="relative py-42 px-6 bg-cover bg-center flex flex-col items-center justify-center text-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
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
        </section> */}

      </div>
      <Footer />
    </>
  );
};

export default About;