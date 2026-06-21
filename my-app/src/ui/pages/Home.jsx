import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Wifi, 
  Dumbbell, 
  Waves, 
  Compass, 
  Utensils, 
  Car, 
  ArrowRight, 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Sparkles 
} from "lucide-react";

// Inline Instagram SVG component to avoid lucide-react version compatibility issues
function InstagramIcon({ size = 20, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

import { API_URL } from "../../config/api";

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

// Custom Icons for Gastronomy to match screenshot exactly
function RestaurantIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      <path d="M18 8a3 3 0 0 0-3-3H9" />
    </svg>
  );
}

function MartiniIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 22h8" />
      <path d="M12 11v11" />
      <path d="M19 3H5l7 8z" />
      <circle cx="11" cy="7" r="1.5" fill="currentColor" />
    </svg>
  );
}

function FishIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12c.5-2.5 2.5-4.5 5.5-5.5 5-1.5 11 .5 14.5 5.5-3.5 5-9.5 7-14.5 5.5-3-1-5-3-5.5-5.5z" />
      <path d="M22 12H18" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M6.5 16.5c-1-1.5-1-3.5 0-5" />
    </svg>
  );
}

function GolfIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20" />
      <path d="M12 2l7 4-7 4" />
      <circle cx="8" cy="20" r="2" />
    </svg>
  );
}

function SunsetIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 18a5 5 0 0 0-10 0" />
      <path d="M12 2v4M4.22 10.22l2.83-2.83M2 18h2M20 18h2M16.95 7.39l2.83 2.83" />
      <path d="M2 22h20" />
    </svg>
  );
}

// Gastronomy Tab details (Static Constant)
const tabData = {
  dining: {
    title: "Signature Restaurant",
    description: "A wonderful little place that serves up tasty food at affordable prices.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
    icon: <RestaurantIcon className="w-6 h-6 mb-3" />
  },
  poolbar: {
    title: "Pool Bar",
    description: "A wonderful little place that serves up tasty food at affordable prices.",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200",
    icon: <MartiniIcon className="w-6 h-6 mb-3" />
  },
  zumafish: {
    title: "Zuma Fish",
    description: "A wonderful little place that serves up tasty food at affordable prices.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200", // Matches the bedroom image from screenshot!
    icon: <FishIcon className="w-6 h-6 mb-3" />
  },
  golf: {
    title: "Golf",
    description: "A wonderful little place that serves up tasty food at affordable prices.",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200",
    icon: <GolfIcon className="w-6 h-6 mb-3" />
  },
  lounge: {
    title: "Sunset Lounge",
    description: "A wonderful little place that serves up tasty food at affordable prices.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200",
    icon: <SunsetIcon className="w-6 h-6 mb-3" />
  }
};

export default function Home() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);

  // API states
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  // Mock rooms for fallback if API is empty or loading fails
  const mockRooms = [
    {
      id: "executive-room",
      name: "Executive Suite Room",
      price: 5000,
      area: "35 sq m",
      beds: "1 Double Bed",
      bathrooms: "1 Bathroom",
      description: "A masterfully designed luxury room combining modern amenities with breathtaking resort views.",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200"
    },
    {
      id: "private-villa",
      name: "Luxury Private Villa",
      price: 8500,
      area: "55 sq m",
      beds: "1 King Bed",
      bathrooms: "1 Bathroom",
      description: "Unwind in your private sanctuary featuring elegant decor, a cozy lounge, and premium amenities.",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200"
    },
    {
      id: "duplex-villa",
      name: "Duplex Royal Villa",
      price: 12000,
      area: "75 sq m",
      beds: "2 King Beds",
      bathrooms: "2 Bathrooms",
      description: "Experience absolute grandeur with two spacious stories, private deck, and bespoke royal butler service.",
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200"
    }
  ];

  // Display rooms from DB or fall back to mock rooms
  const displayRooms = rooms.length > 0 ? rooms.slice(0, 4) : mockRooms;

  // Auto-playing Infinite Loop Carousel for Rooms & Suites Section
  const N = displayRooms.length;
  const [currentIndex, setCurrentIndex] = useState(N); // start at the middle copy
  const [animate, setAnimate] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cloned array for infinite looping
  const allSlides = [...displayRooms, ...displayRooms, ...displayRooms];

  // Auto scroll effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimate(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Snap back silently after sliding beyond the middle set
  useEffect(() => {
    if (currentIndex >= 2 * N) {
      const snapTimer = setTimeout(() => {
        setAnimate(false);
        setCurrentIndex(N);
      }, 800); // matches transition duration (0.8s)
      return () => clearTimeout(snapTimer);
    }
  }, [currentIndex, N]);
  
  // Gastronomy & Amenities interactive tab state
  const [activeTab, setActiveTab] = useState("zumafish");
  const gastronomyRefs = useRef({});
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef("zumafish");

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      if (!isLargeScreen) return;

      const containerCenter = container.scrollTop + container.clientHeight / 2;
      
      let closestKey = "";
      let minDistance = Infinity;

      Object.keys(tabData).forEach((key) => {
        const el = gastronomyRefs.current[key];
        if (el) {
          const elCenter = el.offsetTop + el.clientHeight / 2;
          const distance = Math.abs(containerCenter - elCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestKey = key;
          }
        }
      });

      if (closestKey && closestKey !== activeTabRef.current) {
        setActiveTab(closestKey);
      }
    };

    // Run once on mount to align state
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Smooth click-to-scroll handler centering the item inside the container
  const handleTabClick = (key) => {
    const container = scrollContainerRef.current;
    const target = gastronomyRefs.current[key];
    if (container && target) {
      const containerHeight = container.clientHeight;
      const targetHeight = target.clientHeight;
      const targetTop = target.offsetTop;
      
      const scrollToPosition = targetTop - containerHeight / 2 + targetHeight / 2;
      
      container.scrollTo({
        top: scrollToPosition,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    // Scroll to the default active tab (zumafish) on mount
    const timer = setTimeout(() => {
      handleTabClick("zumafish");
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Booking search inputs & refs
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomType, setRoomType] = useState("Rooms");
  const [guests, setGuests] = useState("Guests");

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);
  const roomRef = useRef(null);
  const guestsRef = useRef(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    }
    if (image.startsWith("http")) {
      return image;
    }
    return `${API_URL}/uploads/${image}`;
  };

  const handleCheckInChange = (e) => {
    setCheckIn(e.target.value);
    setTimeout(() => {
      if (checkOutRef.current) {
        checkOutRef.current.showPicker ? checkOutRef.current.showPicker() : checkOutRef.current.click();
      }
    }, 150);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to rooms with search query state
    navigate("/rooms", { state: { checkIn, checkOut, guests, roomType } });
  };



  // tabData is statically defined outside the component

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e] overflow-x-hidden ">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative h-screen overflow-hidden flex items-center justify-center">
          <motion.div
            style={{ y: heroY }}
            className="absolute inset-0 bg-cover bg-center"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2000')",
              }}
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>

          <div className="relative z-10 text-center px-5 max-w-5xl text-white">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-sm font-semibold">
              Sree Raaga Resorts
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 drop-shadow-md">
              Experience Unparalleled <br />
              <span className="italic font-normal text-[#D8BF72]">
                Comfort
              </span>
            </h1>
          </div>

          {/* Sleek Pill-shaped Booking Panel */}
          <div className="absolute bottom-0 translate-y-1/2 w-full z-20 px-4 md:px-10">
            <form 
              onSubmit={handleSearch}
              className="max-w-4xl mx-auto bg-[#04121a]/65 backdrop-blur-md border border-white/10 rounded-3xl md:rounded-full px-6 py-4 md:py-2.5 flex flex-col md:flex-row items-center justify-between shadow-2xl mb-40"
            >
              
              {/* Check In - Check Out Cell */}
              <div className="relative w-full md:w-auto flex-1 flex items-center justify-between py-3 md:py-1 px-4 border-b md:border-b-0 md:border-r border-white/10 group cursor-pointer">
                <span className="text-white text-xs lg:text-sm font-sans font-light tracking-wide">
                  {checkIn || checkOut 
                    ? `${checkIn ? checkIn : "Check In"} · ${checkOut ? checkOut : "Check Out"}` 
                    : "Check In · Check Out"}
                </span>
                <ChevronDown size={14} className="text-white/60 ml-2 group-hover:text-white transition duration-300" />
                
                {/* Hidden Native Calendar Inputs over the cell */}
                <div className="absolute inset-0 flex">
                  <input 
                    type="date"
                    value={checkIn}
                    onChange={handleCheckInChange}
                    className="w-1/2 h-full opacity-0 cursor-pointer absolute left-0 top-0 z-10"
                    required
                  />
                  <input 
                    ref={checkOutRef}
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-1/2 h-full opacity-0 cursor-pointer absolute right-0 top-0 z-10"
                    required
                  />
                </div>
              </div>

              {/* Rooms Selection Cell */}
              <div className="relative w-full md:w-auto flex-1 flex items-center justify-between py-3 md:py-1 px-4 border-b md:border-b-0 md:border-r border-white/10 group cursor-pointer">
                <span className="text-white text-xs lg:text-sm font-sans font-light tracking-wide">
                  {roomType}
                </span>
                <ChevronDown size={14} className="text-white/60 ml-2 group-hover:text-white transition duration-300" />
                
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  <option value="Rooms" disabled hidden>Rooms</option>
                  <option value="Any Suite">Any Suite</option>
                  <option value="Executive Room">Executive Room</option>
                  <option value="Private Villa">Private Villa</option>
                  <option value="Duplex Villa">Duplex Villa</option>
                </select>
              </div>

              {/* Guests Selection Cell */}
              <div className="relative w-full md:w-auto flex-1 flex items-center justify-between py-3 md:py-1 px-4 group cursor-pointer">
                <span className="text-white text-xs lg:text-sm font-sans font-light tracking-wide">
                  {guests === "Guests" ? "Guests" : (guests === "1" ? "1 Guest" : `${guests} Guests`)}
                </span>
                <ChevronDown size={14} className="text-white/60 ml-2 group-hover:text-white transition duration-300" />
                
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  <option value="Guests" disabled hidden>Guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              {/* Circular GO Button */}
              <button
                type="submit"
                className="w-11 h-11 rounded-full bg-[#fcebd6] text-[#0d2b4e] hover:bg-[#ebd4b8] flex items-center justify-center font-bold tracking-wider transition-all duration-300 ml-0 md:ml-4 mt-3 md:mt-0 shrink-0 cursor-pointer text-xs font-sans shadow-md"
              >
                GO
              </button>
            </form>
          </div>
        </section>

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

        {/* ================= ROOMS & SUITES SECTION ================= */}
        <section className="py-24 px-6 bg-[#011b3c] text-white relative overflow-hidden">
          <div className="max-w-[180vh] mx-auto w-full">
            
            {/* Header */}
            <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
              <div>
                <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold block mb-2">
                  Accommodation
                </span>
                <h2 className="text-3xl md:text-5xl font-light">
                  Rooms & Suites
                </h2>
              </div>
              <Link 
                to="/rooms" 
                className="text-[#c8a64d] hover:text-[#d8bf72] text-sm uppercase tracking-widest flex items-center gap-2 group transition"
              >
                View all <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </Link>
            </div>

            {loadingRooms ? (
              <div className="text-center py-12 text-[#c8a64d] tracking-widest">
                Loading Rooms...
              </div>
            ) : (
              <div className="w-full overflow-hidden">
                <motion.div 
                  animate={{ x: `-${currentIndex * (100 / allSlides.length)}%` }}
                  transition={{ duration: animate ? 0.8 : 0, ease: [0.25, 1, 0.35, 1] }}
                  style={{ width: isMobile ? `${allSlides.length * 100}%` : `${allSlides.length * 50}%` }}
                  className="flex"
                >
                  {allSlides.map((room, idx) => (
                    <div
                      key={`${room.id}-${idx}`}
                      style={{ width: `${100 / allSlides.length}%` }}
                      className="shrink-0 px-4 group"
                    >
                      <Link to={`/rooms/${room.id}`} className="block">
                        <div className="relative mb-6 aspect-[4/3] overflow-hidden ">
                          {/* Custom Window Open Reveal for Room Images */}
                          <WindowReveal 
                            src={getImageUrl(room.image)} 
                            alt={room.name} 
                            className="w-full h-full"
                          />
                          <div className="absolute bottom-6 left-6 z-20 bg-black/75 backdrop-blur-sm px-4 py-2 border border-[#c8a64d]/30 text-white rounded">
                            <span className="text-xs uppercase tracking-widest font-semibold text-[#D8BF72]">
                              Starts at ₹{Number(room.price).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-light mb-2 group-hover:text-[#c8a64d] transition duration-300">
                          {room.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-[#D8C8A5] text-xs uppercase tracking-widest mb-4">
                          <span>{room.area}</span>
                          <span>•</span>
                          <span>{room.beds}</span>
                          <span>•</span>
                          <span>{room.bathrooms}</span>
                        </div>

                        <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-xl font-sans">
                          {room.description}
                        </p>

                        <div className="text-[#c8a64d] uppercase text-xs tracking-widest flex items-center gap-3 font-semibold group-hover:text-white transition">
                          Room Details
                          <span className="w-8 h-[1px] bg-[#c8a64d] group-hover:bg-white group-hover:w-12 transition-all duration-300"></span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Slider Dots Indicator */}
            <div className="flex justify-center gap-3 mt-12 items-center">
              {displayRooms.map((_, idx) => {
                const isDotActive = (currentIndex % N) === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setAnimate(true);
                      setCurrentIndex(N + idx);
                    }}
                    className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                      isDotActive 
                        ? "w-8 bg-[#c8a64d] opacity-100" 
                        : "w-2 bg-white/40 opacity-40 hover:bg-white/60 hover:opacity-60"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= FACILITIES & INTERACTIVE GASTRONOMY ================= */}
        <section className="py-24  bg-[#f7faff] text-[#0d2b4e]">
          <div className="">
               <div className="max-w-6xl mx-auto text-center mb-16">
          
              <h2 className="text-4xl md:text-5xl font-light  text-[#0d2b4e]">
                Resort Facilities
              </h2>
            </div>
        

            {/* Icons Row */}
            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-center items-center py-4 mb-20">
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
                  <span className="text-sm md:text-base font-light text-gray-500 font-serif group-hover:text-[#0d2b4e] transition-colors duration-300">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Exceptional Gastronomy Header */}
            <div className="text-center mb-20 select-none">
              <span className="text-gray-400 uppercase tracking-[4px] text-[10px] font-sans font-bold block mb-4">
                Swiss Resort Luxury Hotel
              </span>
              <h2 className="text-3xl md:text-5xl font-light font-serif text-[#0d2b4e] leading-snug">
                Exceptional Gastronomy In <br className="hidden md:inline" /> Beautiful Spaces
              </h2>
            </div>
            

            {/* Gastronomy Interactive Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left: Dynamic tab image */}
              <div className="lg:col-span-6 relative group w-full h-[450px] md:h-[620px]">
                <WindowReveal 
                  src={tabData[activeTab].image} 
                  alt={tabData[activeTab].title}
                  className="h-full w-full"
                />
                {/* Custom circular interaction overlay: BOOK NOW */}
                <Link 
                  to="/rooms"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-[#0d2b4e]/70 backdrop-blur-[3px] border border-white/20 hover:bg-[#c8a64d] hover:border-[#c8a64d] flex flex-col items-center justify-center text-white transition-all duration-500 shadow-xl group/btn"
                >
                  <span className="text-[11px] font-sans font-bold tracking-widest uppercase transition-transform duration-300 group-hover/btn:scale-105">
                    Book Now
                  </span>
                </Link>
              </div>

              {/* Right: Interactive Tabs List & Side Pagination */}
              <div className="lg:col-span-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-[450px] md:h-[620px] overflow-hidden">
                
                {/* Tabs Column (Internally Scrollable) */}
                <div 
                  ref={scrollContainerRef}
                  className="lg:col-span-10 flex flex-col h-full overflow-y-auto pr-4 scroll-smooth relative pt-[145px] pb-[145px] md:pt-[230px] md:pb-[230px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {Object.keys(tabData).map((key, idx) => {
                    const isActive = activeTab === key;
                    const tabColor = isActive 
                      ? "text-[#0d2b4e]" 
                      : "text-[#0d2b4e]/35 hover:text-[#0d2b4e]/60";
                    
                    return (
                      <div 
                        key={key}
                        ref={(el) => (gastronomyRefs.current[key] = el)}
                        data-key={key}
                        onClick={() => handleTabClick(key)}
                        className="cursor-pointer group flex flex-col items-start justify-center transition-all duration-300 min-h-[160px] py-4"
                      >
                        <div className={`transition-colors duration-300 ${tabColor}`}>
                          {tabData[key].icon}
                        </div>
                        <h3 className={`text-xl md:text-2xl font-light tracking-wide font-serif mb-2 transition-colors duration-300 ${tabColor}`}>
                          {tabData[key].title}
                        </h3>
                        <p className={`text-xs md:text-sm leading-relaxed font-sans transition-colors duration-300 ${
                          isActive ? "text-gray-500" : "text-[#0d2b4e]/20"
                        }`}>
                          {tabData[key].description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Side Pagination Column (Static Indicator aligned on the right) */}
                <div className="hidden lg:col-span-2 lg:flex lg:flex-col lg:items-end lg:justify-center lg:h-full select-none pr-2">
                  <div className="flex flex-col space-y-8">
                    {Object.keys(tabData).map((key, idx) => {
                      const isActive = activeTab === key;
                      return (
                        <div 
                          key={key} 
                          onClick={() => handleTabClick(key)}
                          className="flex items-center gap-3 cursor-pointer group justify-end"
                        >
                          <span className={`h-[1px] transition-all duration-500 ${
                            isActive 
                              ? "w-10 bg-[#0d2b4e]" 
                              : "w-4 bg-[#0d2b4e]/30 group-hover:w-8 group-hover:bg-[#0d2b4e]/50"
                          }`} />
                          <span className={`text-xs font-sans font-bold tracking-widest transition-colors duration-300 ${
                            isActive ? "text-[#0d2b4e]" : "text-[#0d2b4e]/30"
                          }`}>
                            0{idx + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
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

        {/* ================= A WARM, EXPRESSIVE URBAN SPACE ================= */}
        <section className="py-24  bg-[#f7faff] text-[#0d2b4e]">
          <div className=" flex flex-col lg:flex-row items-center ">
            
            {/* Left Image */}
            <div className="w-full lg:w-1/4">
              <WindowReveal 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800" 
                alt="Courtyard" 
                className="h-[300px] lg:h-[600px]  "
              />
            </div>

            {/* Central Box */}
            <div className="w-full lg:w-1/2 text-center  p-8 md:p-12 ">
              <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold block mb-4">
                Sree Raaga Spaces
              </span>
              <h2 className="text-2xl md:text-3xl font-light leading-snug mb-8 mx-4 md:mx-20">
                A Warm, Expressive, Beautiful And Urban Space
              </h2>
              <Link 
                to="/about"
                className="inline-block px-8 py-3 bg-[#0d2b4e] text-white hover:bg-[#153a66] transition duration-300 text-xs uppercase tracking-widest font-semibold rounded"
              >
                Explore Space
              </Link>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-1/4">
              <WindowReveal 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800" 
                alt="Lounge Lobby" 
                className="h-[300px] lg:h-[600px]  shadow-xl"
              />
            </div>

          </div>
        </section>

        {/* ================= UNIQUE EXPERIENCES ================= */}
        <section className="py-24  bg-[#f7faff] text-[#0d2b4e]">
          <div className="">
            <div className="max-w-6xl mx-auto text-center mb-16">
              <span className="text-gray-500 uppercase tracking-[4px] text-xs font-semibold block mb-2 font-sans">
                There's so much to discover
              </span>
              <h2 className="text-4xl md:text-5xl font-light  text-[#0d2b4e]">
                Unique Experiences
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12  ">
              
              {/* Card 1: Poolside/Beach Retreat */}
              <div className="group cursor-default flex flex-col relative">
                <div className="relative overflow-hidden mb-6 h-[280px] lg:h-[420px] ">
                  <WindowReveal 
                    src="https://images.unsplash.com/photo-1473177104440-ffee2f376098?q=80&w=800" 
                    alt="Poolside Retreat" 
                    className="w-full h-full"
                  />
                  {/* Left Circle Arrow Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-[#c8a64d] text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition duration-300 shadow-lg">
                    <ChevronLeft size={20} />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans font-bold mb-2">03</span>
                <h3 className="text-2xl font-light text-[#0d2b4e]  hover:text-[#c8a64d] transition duration-300">
                  Poolside Retreats
                </h3>
              </div>

              {/* Card 2: Hot Air Balloon (Active/Center) */}
              <div className="group cursor-default flex flex-col relative md:-translate-y-10">
                <div className="relative overflow-hidden mb-6 h-[280px] lg:h-[350px] ">
                  <WindowReveal 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800" 
                    alt="Balloon Rides" 
                    className="w-full h-full"
                  />
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans font-bold mb-2">01</span>
                <h3 className="text-2xl font-light text-[#0d2b4e]  hover:text-[#c8a64d] transition duration-300">
                  Balloon Rides
                </h3>
              </div>

              {/* Card 3: Cycling Nature Trails */}
              <div className="group cursor-default flex flex-col relative">
                <div className="relative overflow-hidden mb-6 h-[280px] lg:h-[420px] ">
                  <WindowReveal 
                    src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800" 
                    alt="Bike Rides" 
                    className="w-full h-full"
                  />
                  {/* Right Circle Arrow Overlay */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-[#c8a64d] text-white rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition duration-300 shadow-lg">
                    <ChevronRight size={20} />
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-sans font-bold mb-2">02</span>
                <h3 className="text-2xl font-light text-[#0d2b4e]  hover:text-[#c8a64d] transition duration-300">
                  Bike Rides
                </h3>
              </div>

            </div>
          </div>
        </section>

        {/* ================= BOOK YOUR STAY NOW BANNER ================= */}
        <section 
          className="relative py-32 bg-fixed bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 text-white">
            <span className="text-[#D8BF72] uppercase tracking-[4px] text-xs font-semibold block mb-4">
              Instant Booking
            </span>
            <h2 className="text-4xl md:text-5xl font-light mb-8  leading-tight">
              Book Your Stay Now
            </h2>
            
            {/* Sleek Pill-shaped Booking Panel */}
            <form 
              onSubmit={handleSearch}
              className="max-w-4xl mx-auto bg-[#04121a]/65 backdrop-blur-md border border-white/10 rounded-3xl md:rounded-full px-18 py-4 md:py-2.5 flex flex-col md:flex-row items-center justify-between shadow-2xl text-left"
            >
              
              {/* Check In - Check Out Cell */}
              <div className="relative w-full md:w-auto flex-1 flex items-center justify-between py-3 md:py-1 px-4 border-b md:border-b-0 md:border-r border-white/10 group cursor-pointer">
                <span className="text-white text-xs lg:text-sm font-sans font-light tracking-wide">
                  {checkIn || checkOut 
                    ? `${checkIn ? checkIn : "Check In"} · ${checkOut ? checkOut : "Check Out"}` 
                    : "Check In · Check Out"}
                </span>
                <ChevronDown size={14} className="text-white/60 ml-2 group-hover:text-white transition duration-300" />
                
                {/* Hidden Native Calendar Inputs over the cell */}
                <div className="absolute inset-0 flex">
                  <input 
                    type="date"
                    value={checkIn}
                    onChange={handleCheckInChange}
                    className="w-1/2 h-full opacity-0 cursor-pointer absolute left-0 top-0 z-10"
                    required
                  />
                  <input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-1/2 h-full opacity-0 cursor-pointer absolute right-0 top-0 z-10"
                    required
                  />
                </div>
              </div>

              {/* Rooms Selection Cell */}
              <div className="relative w-full md:w-auto flex-1 flex items-center justify-between py-3 md:py-1 px-4 border-b md:border-b-0 md:border-r border-white/10 group cursor-pointer">
                <span className="text-white text-xs lg:text-sm font-sans font-light tracking-wide">
                  {roomType}
                </span>
                <ChevronDown size={14} className="text-white/60 ml-2 group-hover:text-white transition duration-300" />
                
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  <option value="Rooms" disabled hidden>Rooms</option>
                  <option value="Any Suite">Any Suite</option>
                  <option value="Executive Room">Executive Room</option>
                  <option value="Private Villa">Private Villa</option>
                  <option value="Duplex Villa">Duplex Villa</option>
                </select>
              </div>

              {/* Guests Selection Cell */}
              <div className="relative w-full md:w-auto flex-1 flex items-center justify-between py-3 md:py-1 px-4 group cursor-pointer">
                <span className="text-white text-xs lg:text-sm font-sans font-light tracking-wide">
                  {guests === "Guests" ? "Guests" : (guests === "1" ? "1 Guest" : `${guests} Guests`)}
                </span>
                <ChevronDown size={14} className="text-white/60 ml-2 group-hover:text-white transition duration-300" />
                
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                >
                  <option value="Guests" disabled hidden>Guests</option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              {/* Circular GO Button */}
              <button
                type="submit"
                className="w-11 h-11 rounded-full bg-[#fcebd6] text-[#0d2b4e] hover:bg-[#ebd4b8] flex items-center justify-center font-bold tracking-wider transition-all duration-300 ml-0 md:ml-4 mt-3 md:mt-0 shrink-0 cursor-pointer text-xs font-sans shadow-md"
              >
                GO
              </button>
            </form>
          </div>
        </section>

        {/* ================= FOLLOW US ON INSTAGRAM ================= */}
        <section className="  bg-[#f7faff] text-[#0d2b4e]">
          <div className="py-12 text-center mb-12">
            <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold block mb-2">
              Social Media
            </span>
            <h2 className="text-5xl font-light  flex items-center justify-center gap-2">
              Follow us on Instagram <InstagramIcon size={26} className="text-[#c8a64d] mt-2" />
            </h2>
          </div>

          <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5  ">
            {[
              "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600",
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
              "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600"
            ].map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden group  shadow-sm">
                <img 
                  src={img} 
                  alt={`Instagram Showcase ${i}`} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-[#0d2b4e]/60 opacity-0 group-hover:opacity-100 transition duration-300 z-10 flex items-center justify-center">
                  <InstagramIcon size={28} className="text-white" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}