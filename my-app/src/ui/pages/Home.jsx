import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Experience from "../components/ExperienceSlider"
import "swiper/css";
import { Helmet } from "react-helmet";
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
  Sparkles ,
  ArrowDown 
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
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

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
    {/* 2. ADD HELMET COMPONENT HERE */}
      <Helmet>
        <title>Sree Raaga Resorts | Experience Unparalleled Comfort</title>
        <meta 
          name="description" 
          content="Stay with us and feel like home at Sree Raaga Resorts. Book luxury private villas, enjoy exceptional gastronomy, and discover unique day-out packages." 
        />
        <meta 
          name="keywords" 
          content="Sree Raaga Resorts, luxury resorts, private villas, resort booking, multi-cuisine restaurant, day-out packages" 
        />
        {/* Optional Open Graph tags for better social sharing */}
        <meta property="og:title" content="Sree Raaga Resorts | Luxury Stay & Experiences" />
        <meta property="og:description" content="Experience unparalleled comfort with our luxury villas, exceptional dining, and unique day-out packages." />
        <meta property="og:type" content="website" />
      </Helmet>
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

          <div className="relative z-10 text-center px-5 max-w-5xl text-white mt-[-130px] md:mt-0">
            <span className="text-white uppercase tracking-[3px] text-[13px] font-jost font-medium block mb-4 md:hidden">
              Stay With Us Feel Like Home
            </span>
            <h1 className="text-[36px] font-corm md:text-6xl lg:text-[92px] font-medium leading-tight mb-0 md:mb-8 drop-shadow-md">
              Experience Unparalleled<br />
              <span className="font-medium">
                Comfort
              </span>
            </h1>
          </div>

          {/* Sleek Pill-shaped Booking Panel */}
          <div className="absolute bottom-0 translate-y-1/2 w-full z-20 px-4 md:px-10">
      <form
  onSubmit={handleSearch}
  className="max-w-[100vh] mx-auto bg-black/50 md:bg-transparent backdrop-blur-xl md:backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-full px-0 md:px-3 md:py-[10px] flex flex-col md:flex-row items-center shadow-2xl md:mt-[-120px] mt-[-230px] "
>
<div className="relative w-full md:flex-1 flex items-center gap-3 px-5 py-5 md:py-2 border-b border-white/15 md:border-b-0 md:border-r md:border-white/20 cursor-pointer z-[9999] group transition-all duration-300">
  <DatePicker
    selectsRange={true}
    startDate={checkIn ? new Date(checkIn) : null}
    endDate={checkOut ? new Date(checkOut) : null}
    // 1. ADD THIS PROP HERE:
    wrapperClassName="w-full" 
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
    onCalendarOpen={() => setIsDatePickerOpen(true)}
    onCalendarClose={() => setIsDatePickerOpen(false)}
    customInput={
      <div className="flex items-center justify-between w-full">
        <span className="text-white/90 text-[15px] lg:text-[17px] font-jost">
          {checkIn
            ? `${new Date(checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}${
                checkOut
                  ? ` - ${new Date(checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
                  : " - Check Out"
              }`
            : "Check In - Check Out"}
        </span>
       {/* Wrap the icon to prevent flexbox layout shifts during rotation */}
<span className="flex items-center justify-center w-4 h-4 mr-1 md:mr-0 shrink-0">
  <ChevronDown
    size={16}
    className={`text-white/60 transition-transform duration-300 origin-center ${
      isDatePickerOpen ? "rotate-180" : ""
    }`}
  />
</span>
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
  <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-6 md:py-2 border-b md:border-b-0 md:border-r border-white/20 select-none cursor-pointer booking-field"
       onClick={() => {
         setIsRoomsOpen(!isRoomsOpen);
         setIsGuestsOpen(false);
       }}
  >
    <div className="flex-1">
    
      <span className="text-white text-[15px] lg:text-[17px]">
        Rooms 
      </span>
    </div>
    <ChevronDown
      size={14}
      className={`text-white/60 transition-transform duration-300 mr-1 md:mr-0 ${isRoomsOpen ? "rotate-180" : ""}`}
    />

    {isRoomsOpen && (
      <div className="absolute top-[110%] left-0 md:w-84 w-full bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl py-7 px-3 md:py-8 md:px-4 shadow-2xl z-60 font-jost text-left select-none">
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
  <div className="relative w-full  md:flex-1 flex items-center gap-3 px-4 py-6 md:py-2 select-none cursor-pointer booking-field"
       onClick={() => {
         setIsGuestsOpen(!isGuestsOpen);
         setIsRoomsOpen(false);
       }}
  >
    <div className="flex-1">
  
      <span className="text-white text-[15px] lg:text-[17px]">
        {adultsCount + childrenCount === 0
          ? "Guests"
          : adultsCount + childrenCount === 1
          ? " Guest"
          : `${adultsCount + childrenCount} Guests`}
      </span>
    </div>
    <ChevronDown
      size={14}
      className={`text-white/60 transition-transform duration-300 mr-1 md:mr-0 ${isGuestsOpen ? "rotate-180" : ""}`}
    />

    {isGuestsOpen && (
      <div className="absolute top-[110%] left-0 md:w-84 w-full bg-[#f7d6b8] text-[#0d2b4e] rounded-3xl py-7 px-3 md:py-8 md:px-4 shadow-2xl z-50 font-jost text-left select-none space-y-4">
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
{/* SEARCH BUTTON */}
  <button
    type="submit"
    className="group mt-0 md:ml-4 h-14 md:h-12 md:w-12 w-full rounded-b-2xl md:rounded-full bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white text-[#0d2b4e] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shrink-0 cursor-pointer"
  >
    <span className="font-jost font-semibold md:text-xs text-sm tracking-wider uppercase">GO</span>
  </button>
</form>
          </div>
        </section>

<section className="relative py-30  md:py-48 px-4 md:px-6 bg-[#fdfeff] text-[#0d2b4e] overflow-hidden">
      
      {/* Outlined brand text behind the staggered images */}
      <div 
        className="absolute top-[6%] lg:top-[4%] left-1/2 -translate-x-1/2 text-[12vw] md:text-[9vw] font-corm uppercase tracking-[5px] font-bold md:font-medium md:text-[#3fbcc3]/10 text-[#011b3c]/30 select-none pointer-events-none text-center whitespace-nowrap z-0"
      >
        Sree Raaga
      </div>

      {/* Staggered Images Grid - Now maintaining 3 columns on mobile */}
      <div className="relative max-w-[170vh] mx-auto grid grid-cols-3 gap-2 sm:gap-6 md:gap-12 lg:gap-24 items-center z-10 mb-8 md:mb-12">
        <WindowReveal 
          src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800" 
          alt="Villa Exterior" 
          className="h-[110px] mb-6 md:mb-0 sm:h-[220px] md:h-[350px] lg:h-[420px] w-full object-cover rounded-sm"
        />
        
        {/* Center image is taller and offset upwards, overlapping background text */}
        <WindowReveal 
          src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800" 
          alt="Villa Interior" 
          className="h-[140px] sm:h-[280px] md:h-[430px] lg:h-[520px] -translate-y-3 md:-translate-y-6 w-full object-cover rounded-sm"
        />
        
        <WindowReveal 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800" 
          alt="Luxury Pool" 
          className="h-[110px] mb-6 md:mb-0 sm:h-[220px] md:h-[350px] lg:h-[420px] w-full object-cover rounded-sm"
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

{/* ================= ROOMS & SUITES SECTION ================= */}
        <section className="py-16 md:py-24 px-0 md:px-6 bg-[#011b3c] text-white relative overflow-hidden">
          <div className="max-w-[180vh] mx-auto w-full">
            
            {/* Header - Updated for mobile stacking (flex-col on small, flex-row on md) */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-0 mb-12 md:mb-16 border-b border-white/10 pb-6 px-4 md:px-0">
              <div>
                <span className="text-[#c8a64d] uppercase font-jost tracking-[4px] text-xs md:text-sm font-semibold block mb-2 md:mb-4">
                  Explore
                </span>
                <h2 className="text-4xl md:text-6xl font-corm font-medium">
                  Rooms & Suites
                </h2>
              </div>
              <div className="flex items-center justify-center">
                <button className="group flex items-center gap-4 uppercase tracking-wide text-xs md:text-sm font-medium text-white">
                  <span className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-white flex items-center justify-center transition-all duration-300 group-hover:bg-[#c8a64d] group-hover:border-[#c8a64d] group-hover:text-white">
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
              // Added 'relative' and 'group/slider' to container to position arrows
              <div className="relative w-full overflow-hidden touch-pan-y group/slider">
                
                {/* --- LEFT ARROW --- */}
                <button
                  onClick={() => {
                    setAnimate(true);
                    // Safe boundary check so it doesn't scroll past the first slide
                    setCurrentIndex(prev => Math.max(0, prev - 1));
                  }}
                  className={`absolute left-2 md:left-4 top-[40%] md:top-[45%] -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#c8a64d] hover:border-[#c8a64d] transition-all duration-300 shadow-xl ${
                    currentIndex === 0 ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}
                  aria-label="Previous Room"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                </button>

                {/* --- RIGHT ARROW --- */}
                <button
                  onClick={() => {
                    setAnimate(true);
                    // Safe boundary check (adjust depending on how many slides you show at once)
                    setCurrentIndex(prev => Math.min(allSlides.length - (isMobile ? 1 : 2), prev + 1));
                  }}
                  className={`absolute right-2 md:right-4 top-[40%] md:top-[45%] -translate-y-1/2 z-30 w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#c8a64d] hover:border-[#c8a64d] transition-all duration-300 shadow-xl ${
                    currentIndex >= allSlides.length - (isMobile ? 1 : 2) ? "opacity-50 pointer-events-none" : "opacity-100"
                  }`}
                  aria-label="Next Room"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </button>

                <motion.div 
                  // Native Swipe Detection
                  onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                  onTouchMove={(e) => {
                    if (touchStart === null) return;
                    
                    const currentTouch = e.touches[0].clientX;
                    const diff = touchStart - currentTouch;

                    // Swiped left (Next Slide)
                    if (diff > 50) {
                      setAnimate(true);
                      setCurrentIndex(prev => Math.min(allSlides.length - (isMobile ? 1 : 2), prev + 1));
                      setTouchStart(null); 
                    } 
                    // Swiped right (Previous Slide)
                    else if (diff < -50) {
                      setAnimate(true);
                      setCurrentIndex(prev => Math.max(0, prev - 1));
                      setTouchStart(null); 
                    }
                  }}
                  animate={{ x: `-${currentIndex * (100 / allSlides.length)}%` }}
                  transition={{ duration: animate ? 0.8 : 0, ease: [0.25, 1, 0.35, 1] }}
                  style={{ width: isMobile ? `${allSlides.length * 100}%` : `${allSlides.length * 50}%` }}
                  className="flex" 
                >
                  {allSlides.map((room, idx) => (
                    <div
                      key={`${room.id}-${idx}`}
                      style={{ width: `${100 / allSlides.length}%` }}
                      className="shrink-0 px-0 md:px-4 group"
                    >
                      <Link 
                        to={`/rooms/${room.id}`} 
                        className="block" 
                      >
                        <div>
                          <div className="relative mb-4 md:mb-6 aspect-[4/3] overflow-hidden group/image  md:rounded-none">
                            <WindowReveal
                              src={getImageUrl(room.image)}
                              alt={room.name}
                              className="w-full h-full pointer-events-none" 
                            />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/image:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
                              <button className="px-4 py-3 md:px-5 md:py-14 rounded-full bg-[#D8BF72] text-black font-jost uppercase tracking-widest text-xs md:text-sm font-semibold hover:bg-white transition-all duration-300 transform translate-y-4 group-hover/image:translate-y-0">
                                Book Now
                              </button>
                            </div>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-semibold mb-2 px-4 md:px-0 font-jost group-hover:text-[#c8a64d] transition duration-300">
                            {room.name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-2 md:gap-3 px-4 md:px-0 text-[#D8C8A5] text-[13px] md:text-[16px] font-medium font-jost uppercase tracking-widest mb-4">
                            <span>{room.area} SQM</span>
                            <span>•</span>
                            <span>{room.beds}</span>
                            <span>•</span>
                            <span>{room.bathrooms} Bath</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            {/* Slider Dots Indicator */}
            <div className="flex justify-center gap-2 md:gap-3 mt-8 md:mt-12 items-center">
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
                        ? "w-6 md:w-8 bg-[#c8a64d] opacity-100" 
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
               <div className="max-w-6xl mx-auto text-center ">
          
              <h2 className="text-4xl md:text-6xl font-medium font-corm  text-[#0d2b4e]">
                Resort Facilities
              </h2>
            </div>
        

            {/* Icons Row */}
            <div className="max-w-[180vh] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4 justify-center items-center py-4 mb-12 md:mb-32">
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

      <span className="text-[16px] md:text-[26px] font-semibold text-gray-500 font-corm group-hover:text-[#0d2b4e] transition-colors duration-300">
        {item.name}
      </span>
    </div>
  ))}
</div>

            {/* Exceptional Gastronomy Header */}
            <div className="text-center mb-20 select-none">
             <span className="uppercase tracking-[3px] text-sm font-semibold font-jost text-[#c8a64d]">
          Sree Raaga Resorts
        </span>
              <h2 className="text-3xl md:text-[60px] font-medium font-corm px-2  text-[#0d2b4e] leading-snug">
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
                      className="cursor-pointer group flex flex-col items-start justify-center px-7 md:px-0 transition-all duration-300 py-6 border-b border-[#0d2b4e]/5 last:border-b-0"
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
                        className={`text-2xl md:text-4xl font-bold md:font-semibold tracking-wide font-corm mb-1  transition-colors duration-300 ${tabColor}`}
                      >
                        {tabData[key].title}
                      </h3>

                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive ? "max-h-[200px] opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}>
                        <p className="text-sm md:text-[17px] block  text-gray-500 leading-relaxed font-jost font-medium font-jost mr-2">
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
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {[
     {
  title: "Swimming Pool",
  image:
    "https://images.unsplash.com/photo-1572331165267-854da2b10ccc?q=80&w=1200",
  description:
    "Enjoy our refreshing swimming pool, perfect for relaxation, leisure, and a rejuvenating experience.",
},
{
  title: "Activities",
  image:
    "./adv1.jpg",
  description:
    "Take part in exciting indoor and outdoor activities designed for fun, recreation, and memorable experiences for guests of all ages.",
},
{
  title: "Indoor Games",
  image:
    "./indoor.jpg",
  description:
    "Enjoy a variety of indoor games including table tennis, carrom, chess, and more for hours of entertainment.",
},
{
  title: "Play Area",
  image:
    "./play.jpg",
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
            Amenities
          </span>

          <h3 className="font-corm text-4xl lg:text-6xl font-light leading-tight mb-8">
            {exp.title}
          </h3>

          <p className="max-w-xs text-sm lg:text-base text-white/90 mb-12 font-medium">
            {exp.description}
          </p>

        <button
  className="
    block
    w-full sm:w-auto
    px-12 py-4
    border border-white
    uppercase
    tracking-widest
    text-sm
    font-semibold

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
</button>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* ================= A WARM, EXPRESSIVE URBAN SPACE ================= */}
<section className="pt-10 lg:pt-24 pb-8 bg-[#fdfeff] overflow-hidden">
      <div className="relative flex flex-col lg:block px-4 lg:px-0">
        
        {/* FIX: Removed bg-[#fdfeff] from this div so it doesn't cover the images behind it */}
        <div className="order-2 lg:order-none relative z-10 min-h-[350px] lg:min-h-[700px] flex items-center justify-center lg:px-8 mt-10 lg:mt-0 pointer-events-none">
          {/* Added pointer-events-none to the wrapper, and pointer-events-auto to the content so buttons still work, preventing the transparent box from blocking clicks to the images if needed */}
          <div className="max-w-3xl text-center pointer-events-auto">
            <span className="uppercase tracking-[3px] text-[12px] lg:text-sm font-semibold font-jost text-[#c8a64d]">
              Sree Raaga Resorts
            </span>

            <h2 className="font-corm text-[#0d2b4e] text-[32px] md:text-5xl lg:text-[60px] leading-[1.2] font-semibold mt-4 mb-6 lg:mb-10">
              DayOut Packages
              <br />
            </h2>

            <p className="text-gray-600 text-[15px] lg:text-[17px] leading-relaxed max-w-2xl font-medium mx-auto mb-10 lg:mb-12">
              Enjoy a perfect day of relaxation, adventure, delicious cuisine, and
              memorable experiences crafted for families, friends, and corporate
              groups.
            </p>

            <Link
              to="/about"
              className="inline-flex items-center gap-4 px-8 lg:px-10 py-4 lg:py-5 bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transition duration-300 text-black uppercase tracking-wider font-medium text-xs lg:text-sm"
            >
              <span>—</span>
              Discover More
            </Link>
          </div>
        </div>

        {/* Images Wrapper */}
        <div className="order-1 lg:order-none flex flex-row gap-4 lg:block w-full z-0 max-w-lg mx-auto lg:max-w-none">
          
          {/* Left Image */}
          <div className="w-1/2 lg:w-auto lg:absolute lg:left-12 lg:top-16">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200"
              alt="Restaurant"
              className="w-full lg:w-[500px] h-[260px] sm:h-[350px] lg:h-[520px] object-cover shadow-sm lg:shadow-xl"
            />
          </div>

          {/* Right Image */}
          <div className="w-1/2 lg:w-auto lg:absolute lg:right-12 lg:top-16">
            <img
              src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200"
              alt="Pool Bar"
              className="w-full lg:w-[500px] h-[260px] sm:h-[350px] lg:h-[520px] object-cover shadow-sm lg:shadow-xl"
            />
          </div>

        </div>
      </div>
    </section>

        {/* ================= UNIQUE EXPERIENCES ================= */}
        <div className="bg-[#fdfeff] ">
          <div className="max-w-6xl mx-auto text-center mb-16">
  <span className="text-[#c8a64d] uppercase tracking-[3px] text-[14px] font-jost font-semibold block mt-14 md:mt-0 md:mb-8">
    There's so much to discover
  </span>

  <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold font-corm text-[#0d2b4e] ">
    Unique Experiences
  </h2>
  </div>
  <Experience/>
        </div>

  
   <section
      className="relative py-32 md:py-49 bg-fixed bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center px-4 md:px-6">
        <span className="text-[#D8BF72] uppercase tracking-[2px] text-[13px] md:text-[15px] font-semibold block mb-3 md:mb-4">
          Instant Booking
        </span>
        <h2 className="text-white text-3xl md:text-[64px] font-bold mb-10 font-corm leading-tight">
          Book Your Stay Now
        </h2>

        {/* Clean White Pill Booking Panel */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-6xl mx-auto bg-white rounded-3xl md:rounded-2xl p-3.5 md:p-4 flex flex-col md:flex-row items-stretch md:items-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-neutral-800"
        >
          {/* DATE */}
          <div className="relative w-full md:flex-1 flex items-center justify-between px-4 md:px-6 py-4 md:py-3 border-b md:border-b-0 md:border-r border-neutral-200 cursor-pointer group transition-all duration-300">
            <DatePicker
              selectsRange={true}
              startDate={checkIn ? new Date(checkIn) : null}
              endDate={checkOut ? new Date(checkOut) : null}
              onChange={(update) => {
                const [start, end] = update;
                const formatDate = (date) => {
                  if (!date) return "";
                  const tzOffset = date.getTimezoneOffset() * 60000;
                  return new Date(date.getTime() - tzOffset)
                    .toISOString()
                    .split("T")[0];
                };
                setCheckIn(start ? formatDate(start) : "");
                setCheckOut(end ? formatDate(end) : "");
              }}
              minDate={new Date()}
              customInput={
                <div className="flex-1 text-left flex items-center justify-between w-full select-none">
                  <span className="text-neutral-800 font-normal text-sm md:text-[17px] tracking-wide truncate">
                    {checkIn
                      ? `${new Date(checkIn).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}${
                          checkOut
                            ? ` - ${new Date(checkOut).toLocaleDateString(
                                "en-IN",
                                { day: "2-digit", month: "short" }
                              )}`
                            : " - Check Out"
                        }`
                      : "Check In - Check Out"}
                  </span>
                  <ArrowDown
                    size={14}
                    strokeWidth={1.5}
                    className="text-neutral-500 group-hover:text-neutral-900 transition ml-4 shrink-0"
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

          {/* ROOMS */}
          <div
            className="relative w-full md:flex-1 flex items-center justify-between px-4 md:px-6 py-4 md:py-3 border-b md:border-b-0 md:border-r border-neutral-200 select-none cursor-pointer booking-field group"
            onClick={() => {
              setIsRoomsOpen(!isRoomsOpen);
              setIsGuestsOpen(false);
            }}
          >
            <span className="text-neutral-800 font-normal text-sm md:text-[17px] tracking-wide">
              Rooms
            </span>
            <ArrowDown
              size={14}
              strokeWidth={1.5}
              className={`text-neutral-500 group-hover:text-neutral-900 transition-transform duration-300 shrink-0 ${
                isRoomsOpen ? "rotate-180" : ""
              }`}
            />

            {/* Rooms Dropdown */}
            {isRoomsOpen && (
              <div className="absolute top-[105%] md:top-[120%] left-0 w-full md:w-74 bg-[#f7d6b8] text-neutral-800 rounded-2xl py-7 px-3 shadow-2xl  z-50 font-jost text-left select-none animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Rooms</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (roomsCount > 1) setRoomsCount(roomsCount - 1);
                      }}
                      className="w-8 h-8 rounded-full  flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">
                      {roomsCount}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRoomsCount(roomsCount + 1);
                      }}
                      className="w-8 h-8 rounded-full  flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GUESTS */}
          <div
            className="relative w-full md:flex-1 flex items-center  justify-between px-4 md:px-6 py-4 md:py-3 select-none cursor-pointer booking-field group"
            onClick={() => {
              setIsGuestsOpen(!isGuestsOpen);
              setIsRoomsOpen(false);
            }}
          >
            <span className="text-neutral-800 font-normal text-sm md:text-[17px] tracking-wide">
              {adultsCount + childrenCount === 0
                ? "Guests"
                : adultsCount + childrenCount === 1
                ? "Guest"
                : `${adultsCount + childrenCount} Guests`}
            </span>
            <ArrowDown
              size={14}
              strokeWidth={1.5}
              className={`text-neutral-500 group-hover:text-neutral-900 transition-transform duration-300 shrink-0 ${
                isGuestsOpen ? "rotate-180" : ""
              }`}
            />

            {/* Guests Dropdown */}
            {isGuestsOpen && (
              <div className="absolute top-[105%] md:top-[120%] right-0 md:left-0 w-full md:w-72 bg-[#f7d6b8] text-neutral-800 rounded-2xl p-5 shadow-2xl  z-50 font-jost text-left select-none space-y-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">Adults</div>
                    {/* <div className="text-xs text-neutral-400">Ages 13 or above</div> */}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (adultsCount > 0) setAdultsCount(adultsCount - 1);
                      }}
                      className="w-8 h-8 rounded-full  flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">
                      {adultsCount}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAdultsCount(adultsCount + 1);
                      }}
                      className="w-8 h-8 rounded-full  flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className=""></div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm">Children</div>
                    {/* <div className="text-xs text-neutral-400">Ages 0 - 12</div> */}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (childrenCount > 0)
                          setChildrenCount(childrenCount - 1);
                      }}
                      className="w-8 h-8 rounded-full  flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">
                      {childrenCount}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChildrenCount(childrenCount + 1);
                      }}
                      className="w-8 h-8 rounded-full  flex items-center  justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* CHECK AVAILABILITY BUTTON */}
          <div className="p-1 mt-2 md:mt-0 w-full md:w-auto shrink-0">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-4 md:py-4 rounded-2xl md:rounded-xl bg-[#C8A64D] hover:bg-[#011b3c] hover:text-white text-neutral-900 font-medium tracking-[1px] uppercase text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow shrink-0 cursor-pointer flex items-center justify-center whitespace-nowrap"
            >
              Check Availability
            </button>
          </div>
        </form>
      </div>
    </section>

  {/* ================= FOLLOW US ON INSTAGRAM ================= */}
      <section className="bg-[#fdfeff] text-[#0d2b4e]">
        <div className="py-8 md:py-12 text-center mb-12">
          <span className="text-[#c8a64d] uppercase tracking-[4px] text-[17px] font-jost font-semibold block mb-2">
            Social Media
          </span>
          <h2 className="text-[33px] md:text-6xl font-medium font-corm flex items-center justify-center gap-2">
            Follow us on Instagram <InstagramIcon size={26} className="text-[#c8a64d] mt-2" />
          </h2>
        </div>

        {/* 
          Wrapper Changes: 
          - Mobile: flex, overflow-x-auto, snap-x (for swiping), hidden scrollbars
          - Desktop (sm+): switch to grid, remove overflow and snapping 
        */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 overflow-x-auto snap-x snap-mandatory sm:overflow-visible sm:snap-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600"
          ].map((img, i) => (
            <div 
              key={i} 
              /* 
                Item Changes:
                - Mobile: flex-none, fixed width (75% of screen), snap to center
                - Desktop (sm+): auto width (fills grid cell), disable snapping
              */
              className="flex-none w-[100%] sm:w-auto snap-center sm:snap-align-none relative aspect-square overflow-hidden group shadow-sm"
            >
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

