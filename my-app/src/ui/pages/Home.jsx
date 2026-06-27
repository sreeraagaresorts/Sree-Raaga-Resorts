import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";
// import { motion } from "framer-motion";
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
  BedDouble ,
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  CalendarDays,
  Sparkles 
} from "lucide-react";

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

const experiences = [
  {
    id: "01",
    title: "Balloon Rides",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
  },
  {
    id: "02",
    title: "Bike Rides",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800",
  },
  {
    id: "03",
    title: "Poolside Retreats",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800",
  },
   {
    id: "04",
    title: "Poolside Retreats",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
  },
   {
    id: "05",
    title: "Poolside Retreats",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800",
  },
];

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

function SportsBarIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
    </svg>
  );
}

function CoffeeIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
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

import restaurantIcon from "../../assets/icons/restaurant.png";
import barIcon from "../../assets/icons/bar.png";
import sportsIcon from "../../assets/icons/sports.png";
import coffeeIcon from "../../assets/icons/coffee.png";

const tabData = {
  multicuisine: {
    title: "Multi Cuisine Restaurant",
    description:
      "Embark on a culinary journey with an extensive selection of Indian, Asian, and international delicacies, thoughtfully prepared by our expert chefs using the finest ingredients.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
    iconImage: restaurantIcon,
  },

  barrestaurant: {
    title: "Bar & Restaurant",
    description:
      "Unwind in an elegant setting where handcrafted cocktails, premium spirits, and gourmet cuisine come together to create the perfect dining and social experience.",
    image:
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200",
    iconImage: barIcon,
  },

  sportsbar: {
    title: "Sports Bar",
    description:
      "Feel the excitement of every match on large HD screens while enjoying refreshing beverages, signature appetizers, and an energetic atmosphere with fellow fans.",
    image:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1200",
    iconImage: sportsIcon,
  },

  coffeeshop: {
    title: "Coffee Shop",
    description:
      "Relax with freshly brewed coffee, aromatic teas, freshly baked pastries, and light bites in a warm and inviting café designed for casual meetings and quiet moments.",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200",
    iconImage: coffeeIcon,
  },
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
  const [activeTab, setActiveTab] = useState("multicuisine");
  const [isRoomsOpen, setIsRoomsOpen] = useState(false);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".booking-field")) {
        setIsRoomsOpen(false);
        setIsGuestsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (key) => {
    setActiveTab(key);
  };


  // Booking search inputs & refs
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

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
    navigate("/rooms", { state: { checkIn, checkOut, guests: adultsCount + childrenCount, rooms: roomsCount } });
  };
 


return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e] overflow-x-hidden ">
        
        {/* ================= HERO SECTION ================= */}
        <section className="relative h-screen flex items-center justify-center">
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
            <h1 className="text-4xl font-corm md:text-6xl lg:text-7xl font-light leading-tight mb-8 drop-shadow-md">
              A Premier Destination for Getaways, <br />
              <span className="italic font-normal text-[#D8BF72]">
                Celebrations & Grand Events
              </span>
            </h1>
          </div>

          {/* Sleek Pill-shaped Booking Panel */}
          <div className="absolute bottom-0 translate-y-1/2 w-full z-20 px-4 md:px-10">
      <form
  onSubmit={handleSearch}
  className="max-w-5xl mx-auto bg-transparent backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-full px-4 md:px-6 py-4 md:py-3 flex flex-col md:flex-row items-center shadow-2xl mt-[-120px]"
>
  {/* DATE */}
  <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-white/10 cursor-pointer z-9999 group transition-all duration-300">
    <DatePicker
      selectsRange={true}
      startDate={checkIn ? new Date(checkIn) : null}
      endDate={checkOut ? new Date(checkOut) : null}
      onChange={(update) => {
        const [start, end] = update;
        const formatDate = (date) => {
          if (!date) return "";
          const tzOffset = date.getTimezoneOffset() * 60000;
          return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
        };
        setCheckIn(start ? formatDate(start) : "");
        setCheckOut(end ? formatDate(end) : "");
      }}
      minDate={new Date()}
      customInput={
        <div className="flex-1 text-left flex items-center justify-between w-full ">
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
              Dates
            </p>
            <span className="text-white text-xs lg:text-sm">
              {checkIn
                ? `${new Date(checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}${
                    checkOut
                      ? ` - ${new Date(checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                      : " - Check Out"
                  }`
                : "Check In - Check Out"}
            </span>
          </div>
          <ChevronDown
            size={14}
            className="text-white/60 group-hover:text-white transition ml-4"
          />
        </div>
      }
      calendarClassName="custom-datepicker"
      popperModifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
          },
        },
      ]}
    />
  </div>

  {/* ROOM */}
  <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10 select-none cursor-pointer booking-field"
       onClick={() => {
         setIsRoomsOpen(!isRoomsOpen);
         setIsGuestsOpen(false);
       }}
  >
    <div className="flex-1">
      <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
        Room Type
      </p>
      <span className="text-white text-xs lg:text-sm">
        Rooms {roomsCount}
      </span>
    </div>
    <ChevronDown
      size={14}
      className={`text-white/60 transition-transform duration-300 ${isRoomsOpen ? "rotate-180" : ""}`}
    />

    {isRoomsOpen && (
      <div className="absolute top-[110%] left-0 w-64 bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Rooms</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (roomsCount > 1) setRoomsCount(roomsCount - 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              -
            </button>
            <span className="font-semibold text-sm w-4 text-center">{roomsCount}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRoomsCount(roomsCount + 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              +
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* GUESTS */}
  <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3 select-none cursor-pointer booking-field"
       onClick={() => {
         setIsGuestsOpen(!isGuestsOpen);
         setIsRoomsOpen(false);
       }}
  >
    <div className="flex-1">
      <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
        Guests
      </p>
      <span className="text-white text-xs lg:text-sm">
        {adultsCount + childrenCount === 0
          ? "Guests"
          : adultsCount + childrenCount === 1
          ? "1 Guest"
          : `${adultsCount + childrenCount} Guests`}
      </span>
    </div>
    <ChevronDown
      size={14}
      className={`text-white/60 transition-transform duration-300 ${isGuestsOpen ? "rotate-180" : ""}`}
    />

    {isGuestsOpen && (
      <div className="absolute top-[110%] left-0 w-64 bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none space-y-4">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Adults</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (adultsCount > 0) setAdultsCount(adultsCount - 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              -
            </button>
            <span className="font-semibold text-sm w-4 text-center">{adultsCount}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAdultsCount(adultsCount + 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              +
            </button>
          </div>
        </div>

        <div className="border-t border-[#0d2b4e]/10"></div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Children</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (childrenCount > 0) setChildrenCount(childrenCount - 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              -
            </button>
            <span className="font-semibold text-sm w-4 text-center">{childrenCount}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setChildrenCount(childrenCount + 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              +
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* SEARCH BUTTON */}
  <button
    type="submit"
    className="group mt-4 md:mt-0 md:ml-4 h-12 w-12 rounded-full bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white text-[#0d2b4e] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shrink-0 cursor-pointer"
  >
    <span className="font-jost font-semibold text-xs tracking-wider uppercase">GO</span>
  </button>
</form>
          </div>
        </section>

        {/* ================= SHOWCASE / ABOUT SECTION ================= */}
        <section className="relative py-48 px-6 bg-[#fdfeff] text-[#0d2b4e] overflow-hidden">
          
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

      <div className="max-w-5xl mx-auto border-t border-b border-gray-100 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
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

        {/* ================= ROOMS & SUITES SECTION ================= */}
        <section className="py-24 px-6 bg-[#011b3c] text-white relative overflow-hidden">
          <div className="max-w-[180vh] mx-auto w-full">
            
            {/* Header */}
            <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
              <div>
                <span className="text-[#c8a64d] uppercase font-jost tracking-[4px] text-sm font-semibold block mb-4">
                  Explore
                </span>
                <h2 className="text-3xl md:text-6xl font-corm font-medium">
                  Rooms & Suites
                </h2>
              </div>
             <div className="flex justify-center mb-20">
  <button className="group flex items-center gap-4 uppercase tracking-wide text-sm font-medium text-white">
    <span className="w-9 h-9 rounded-full border border-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#c8a64d] group-hover:text-white">
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

    <span className="relative">
      DISCOVER MORE
      <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
    </span>
  </button>
</div>
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
                       <div className="relative mb-6 aspect-[4/3] overflow-hidden group">
  <WindowReveal
    src={getImageUrl(room.image)}
    alt={room.name}
    className="w-full h-full"
  />

  {/* Price Tag */}
  {/* <div className="absolute bottom-6 left-6 z-20 bg-black/75 backdrop-blur-sm px-4 py-2 border border-[#c8a64d]/30 text-white rounded">
    <span className="text-xs uppercase tracking-widest font-jost font-semibold text-[#D8BF72]">
      Starts at ₹{Number(room.price).toLocaleString()}
    </span>
  </div> */}

  {/* Hover Overlay */}
  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
    <button className="px-5 py-14 rounded-full bg-[#D8BF72] text-black font-jost uppercase tracking-widest text-sm font-semibold hover:bg-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
      Book Now
    </button>
  </div>
</div>

                        <h3 className="text-2xl md:text-3xl font-light mb-2 font-corm group-hover:text-[#c8a64d] transition duration-300">
                          {room.name}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-[#D8C8A5] text-sm font-medium font-jost uppercase tracking-widest mb-4">
                          <span>{room.area} SQM</span>
                          <span>•</span>
                          <span>{room.beds}</span>
                          <span>•</span>
                          <span>{room.bathrooms} Bathroom</span>
                        </div>

                        {/* <p className="text-gray-400 mb-6 text-sm leading-relaxed max-w-xl ">
                          {room.description}
                        </p> */}
{/* 
                        <div className="text-[#c8a64d] uppercase text-xs tracking-widest flex items-center gap-3 font-semibold group-hover:text-white transition">
                          Room Details
                          <span className="w-8 h-[1px] bg-[#c8a64d] group-hover:bg-white group-hover:w-12 transition-all duration-300"></span>
                        </div> */}
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
        <section className="pt-24  bg-[#fdfeff] text-[#0d2b4e]">
          <div className="">
               <div className="max-w-6xl mx-auto text-center mb-16">
          
              <h2 className="text-4xl md:text-6xl font-medium font-corm  text-[#0d2b4e]">
                Resort Facilities
              </h2>
            </div>
        

            {/* Icons Row */}
            <div className="max-w-[160vh] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6  justify-center items-center py-4 mb-32">
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

            {/* Exceptional Gastronomy Header */}
            <div className="text-center mb-20 select-none">
              <span className="text-gray-400 uppercase tracking-[4px] text-[12px]  font-medium block mb-4">
                Sree Raaga Resorts Luxury Hotel
              </span>
              <h2 className="text-3xl md:text-[60px] font-medium font-corm  text-[#0d2b4e] leading-snug">
                Exceptional Gastronomy In <br className="hidden md:inline" /> Beautiful Spaces
              </h2>
            </div>
            

            {/* Gastronomy Interactive Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left: Dynamic tab image */}
              <div className="lg:col-span-6 relative group w-full  h-[450px] md:h-[90vh]">
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
                  <span className="text-[11px]  font-bold tracking-widest uppercase transition-transform duration-300 group-hover/btn:scale-105">
                    Book Now
                  </span>
                </Link>
              </div>

              {/* Right: Static Tabs List */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                {Object.keys(tabData).map((key) => {
                  const isActive = activeTab === key;
                  const tabColor = isActive
                    ? "text-[#0d2b4e]"
                    : "text-[#0d2b4e]/35 hover:text-[#0d2b4e]/60";

                  return (
                    <div
                      key={key}
                      onClick={() => handleTabClick(key)}
                      className="cursor-pointer group flex flex-col items-start justify-center transition-all duration-300 py-6 border-b border-[#0d2b4e]/5 last:border-b-0"
                    >
                     <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive ? "max-h-[200px] opacity-100 mt-2" : "max-h-[100px] opacity-30 "
                      }`}>
    <img
      src={tabData[key].iconImage}
      alt={tabData[key].title}
      className="w-10 h-10 m-2  transition-all duration-300"
    />
  </div>

                      <h3
                        className={`text-xl md:text-4xl font-medium tracking-wide font-corm mb-1  transition-colors duration-300 ${tabColor}`}
                      >
                        {tabData[key].title}
                      </h3>

                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive ? "max-h-[200px] opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}>
                        <p className="text-sm md:text-[17px] text-gray-500 leading-relaxed font-jost font-medium font-jost mr-2">
                          {tabData[key].description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </section>

        {/* ================= EXPERIENCES GRID ================= */}
      <section className="bg-white">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
    {[
      {
        title: "Yoga On Beach",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200",
      },
      {
        title: "Water Sports",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
      },
      {
        title: "Scuba Diving",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200",
      },
      {
        title: "Island Activities",
        image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200",
      },
    ].map((exp, index) => (
      <div
        key={index}
        className="relative h-[500px] lg:h-[850px] overflow-hidden group "
      >
        {/* Background Image */}
        <img
          src={exp.image}
          alt={exp.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/35"></div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 text-white">
          
          <span className="uppercase tracking-widest text-sm font-jost mb-10">
            Experiences
          </span>

          <h3 className="font-corm text-4xl lg:text-6xl font-light leading-tight mb-8">
            {exp.title}
          </h3>

          <p className="max-w-xs text-sm lg:text-base text-white/90 mb-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

        <button
  className="
    px-12 py-4
    border border-white
    
    uppercase
    tracking-widest
    text-sm
    font-semibold
    opacity-0
    translate-y-4
    group-hover:opacity-100
    group-hover:translate-y-0
    hover:bg-white
    hover:text-black
    transition-all
    duration-500
  "
>
  Discover More
</button>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* ================= A WARM, EXPRESSIVE URBAN SPACE ================= */}
   <section className="py-24 bg-[#fdfeff] overflow-hidden">
  <div className=" relative">

    {/* Main Center Box */}
    <div className="bg-[#fdfeff] min-h-[700px] flex items-center justify-center px-8">
      <div className="max-w-3xl text-center">

        <span className="uppercase tracking-[3px] text-sm font-jost text-[#0d2b4e]">
          Sree Raaga Resorts
        </span>

        <h2 className="font-corm text-[#0d2b4e] text-5xl md:text-[60px]  leading-[1.15] font-medium mt-6 mb-10">
          DayOut Packages
          <br />
          
        </h2>

        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl  mx-auto mb-12">
         Enjoy a perfect day of relaxation, adventure, delicious cuisine, and memorable experiences crafted for families, friends, and corporate groups.
        </p>

        <Link
          to="/about"
          className="inline-flex items-center gap-4 px-10 py-5  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
        >
          <span>—</span>
          Discover More
        </Link>

      </div>
    </div>

    {/* Left Floating Image */}
    <div className="hidden lg:block absolute left-12 top-16">
      {/* <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🍽</span>
        <span className="font-corm text-4xl text-[#0d2b4e]">
          Restaurant
        </span>
      </div> */}

      <img
        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200"
        alt=""
        className="w-[500px] h-[520px] object-cover shadow-xl"
      />
    </div>

    {/* Right Floating Image */}
    <div className="hidden lg:block absolute right-12 top-16">
      <img
        src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200"
        alt=""
        className="w-[500px] h-[520px] object-cover shadow-xl"
      />

      {/* <div className="flex items-center gap-3 mt-8">
        <span className="text-3xl ">🍹</span>
        <span className="font-corm text-4xl text-[#0d2b4e]">
          Pool Bar
        </span>
      </div> */}
    </div>

  </div>
</section>

        {/* ================= UNIQUE EXPERIENCES ================= */}
        <div className="bg-[#fdfeff] pb-20">
          <div className="max-w-6xl mx-auto text-center mb-16">
  <span className="text-gray-500 uppercase tracking-[4px] text-xs font-jost font-semibold block mb-3">
    There's so much to discover
  </span>

  <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium font-corm text-[#0d2b4e] mb-4">
    Unique Experiences
  </h2>
  </div>
     <Swiper
  modules={[Autoplay]}
  loop={true}
  centeredSlides={true}
  slidesPerView={1.2}
  spaceBetween={40}
  speed={1000}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  breakpoints={{
    768: {
      slidesPerView: 3,
    },
  }}
  className="unique-experience-slider"
>
  
  {experiences.map((item) => (
    <SwiperSlide key={item.id}>
      <div className="group flex flex-col relative transition-all duration-700">
        <div
          className={`relative overflow-hidden mb-6 ${item.height}`}
        >
          <WindowReveal
            src={item.image}
            alt={item.title}
            className="w-full h-full"
          />
        </div>

        <div className="px-2">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">
            {item.id}
          </span>

          <h3 className="text-2xl font-light text-[#0d2b4e] font-jost hover:text-[#c8a64d] transition duration-300">
            {item.title}
          </h3>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>
        </div>

        {/* ================= BOOK YOUR STAY NOW BANNER ================= */}
        <section 
          className="relative py-32 bg-fixed bg-cover bg-center  flex items-center justify-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 w-full max-w-[100vh] mx-auto text-center px-6 text-white">
            <span className="text-[#D8BF72] uppercase tracking-[4px] text-xs font-semibold block mb-4">
              Instant Booking
            </span>
            <h2 className="text-4xl md:text-5xl font-medium mb-8  font-corm leading-tight">
              Book Your Stay Now
            </h2>
            
            {/* Sleek Pill-shaped Booking Panel */}
          <form
  onSubmit={handleSearch}
  className=" max-w-7xl mx-auto bg-transparent backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-full px-4  py-4 md:py-0 flex flex-col md:flex-row items-center shadow-2xl"
>
  {/* DATE */}
  <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-white/10 cursor-pointer group transition-all duration-300">
    <DatePicker
      selectsRange={true}
      startDate={checkIn ? new Date(checkIn) : null}
      endDate={checkOut ? new Date(checkOut) : null}
      onChange={(update) => {
        const [start, end] = update;
        const formatDate = (date) => {
          if (!date) return "";
          const tzOffset = date.getTimezoneOffset() * 60000;
          return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
        };
        setCheckIn(start ? formatDate(start) : "");
        setCheckOut(end ? formatDate(end) : "");
      }}
      minDate={new Date()}
      customInput={
        <div className="flex-1 text-left flex items-center justify-between w-full select-none">
          <div>
            <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
              Dates
            </p>
            <span className="text-white text-xs lg:text-sm">
              {checkIn
                ? `${new Date(checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}${
                    checkOut
                      ? ` - ${new Date(checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                      : " - Check Out"
                  }`
                : "Check In - Check Out"}
            </span>
          </div>
          <ChevronDown
            size={14}
            className="text-white/60 group-hover:text-white transition ml-4"
          />
        </div>
      }
      calendarClassName="custom-datepicker"
      popperModifiers={[
        {
          name: "preventOverflow",
          options: {
            boundary: "viewport",
          },
        },
      ]}
    />
  </div>

  {/* ROOM */}
  <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10 select-none cursor-pointer booking-field"
       onClick={() => {
         setIsRoomsOpen(!isRoomsOpen);
         setIsGuestsOpen(false);
       }}
  >
    <div className="flex-1">
      <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
        Room Type
      </p>
      <span className="text-white text-xs lg:text-sm">
        Rooms {roomsCount}
      </span>
    </div>
    <ChevronDown
      size={14}
      className={`text-white/60 transition-transform duration-300 ${isRoomsOpen ? "rotate-180" : ""}`}
    />

    {isRoomsOpen && (
      <div className="absolute top-[110%] left-0 w-64 bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Rooms</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (roomsCount > 1) setRoomsCount(roomsCount - 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              -
            </button>
            <span className="font-semibold text-sm w-4 text-center">{roomsCount}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRoomsCount(roomsCount + 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              +
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* GUESTS */}
  <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3 select-none cursor-pointer booking-field"
       onClick={() => {
         setIsGuestsOpen(!isGuestsOpen);
         setIsRoomsOpen(false);
       }}
  >
    <div className="flex-1">
      <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
        Guests
      </p>
      <span className="text-white text-xs lg:text-sm">
        {adultsCount + childrenCount === 0
          ? "Guests"
          : adultsCount + childrenCount === 1
          ? "1 Guest"
          : `${adultsCount + childrenCount} Guests`}
      </span>
    </div>
    <ChevronDown
      size={14}
      className={`text-white/60 transition-transform duration-300 ${isGuestsOpen ? "rotate-180" : ""}`}
    />

    {isGuestsOpen && (
      <div className="absolute top-[110%] left-0 w-64 bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl p-5 shadow-2xl z-50 font-jost text-left select-none space-y-4">
        {/* Adults */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Adults</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (adultsCount > 0) setAdultsCount(adultsCount - 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              -
            </button>
            <span className="font-semibold text-sm w-4 text-center">{adultsCount}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAdultsCount(adultsCount + 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              +
            </button>
          </div>
        </div>

        <div className="border-t border-[#0d2b4e]/10"></div>

        {/* Children */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">Children</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (childrenCount > 0) setChildrenCount(childrenCount - 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              -
            </button>
            <span className="font-semibold text-sm w-4 text-center">{childrenCount}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setChildrenCount(childrenCount + 1);
              }}
              className="text-[#0d2b4e] font-semibold text-lg hover:text-[#c8a64d] transition cursor-pointer px-2"
            >
              +
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* SEARCH BUTTON */}
  <button
    type="submit"
    className="group mt-4 md:mt-0 md:ml-4 h-12 w-12 rounded-full bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white text-[#0d2b4e] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shrink-0 cursor-pointer"
  >
    <span className="font-jost font-semibold text-xs tracking-wider uppercase">GO</span>
  </button>
</form>
          </div>
        </section>

        {/* ================= FOLLOW US ON INSTAGRAM ================= */}
        <section className="  bg-[#fdfeff] text-[#0d2b4e]">
          <div className="py-12 text-center mb-12">
            <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-jost font-semibold block mb-2">
              Social Media
            </span>
            <h2 className="text-2xl md:text-6xl font-medium font-corm  flex items-center justify-center gap-2">
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