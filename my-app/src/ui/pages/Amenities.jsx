import React, { useState, useRef,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronDown, ArrowRight ,ArrowDown } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";

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

// Custom Icons for Gastronomy and Water Sports
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

function WindowReveal({ src, alt, className = "", delay = 0 }) {
  return (
    <div className={`relative overflow-hidden ${className} group`}>
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



const Amenities = () => {
  const [activeTab, setActiveTab] = useState("multicuisine");

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
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

  const checkInRef = useRef(null);
  const checkOutRef = useRef(null);

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
    navigate("/rooms", { state: { checkIn, checkOut, guests: adultsCount + childrenCount, rooms: roomsCount } });
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e] overflow-x-hidden">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517176118179-65244903d13c?q=80&w=2000')"
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white px-4 max-w-3xl space-y-4">
            <span className="text-white uppercase tracking-[6px]  text-[17px] font-semibold font-jost">
              Sree Raaga Resorts 
            </span>
            <h1 className="text-5xl md:text-[92px] font-medium font-corm leading-tight tracking-wide text-white">
              Our Amenities
            </h1>
            {/* <p className="text-white/80 font-jost font-light text-xs md:text-sm tracking-widest uppercase max-w-2xl mx-auto leading-relaxed">
              Active recreation is an integral part of your stay. Paddle boarding is the perfect way to explore the beauty of the resort.
            </p> */}
          </div>
        </section>

        {/* ================= 2. WATER SPORTS DESCRIPTION SECTION ================= */}
        <section className="py-24 px-6 bg-[] text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-[#c8a64d] flex justify-center">
              <WaterSportsIcon className="w-12 h-12" />
            </div>
            <span className="text-[#c8a64d] text-[17px] uppercase tracking-[4px] font-semibold font-jost block">
              LUXURY RESORT
            </span>
            <h2 className="text-3xl md:text-6xl font-semibold font-corm text-[#0d2b4e] leading-snug">
              Water Sports you Must Try
            </h2>
            <p className="text-[#2d5b8a] font-jost font-medium text-sm md:text-[17px] leading-relaxed max-w-2xl mx-auto">
              An integral part of relax and perfect experience of your stay is water sports. Paddle boarding, kayaking, and surfing activities are designed to create memorable moments for you and your family.
            </p>
            <div className="pt-4">
           <Link
                   to="/rooms"
                   className="inline-flex items-center gap-4 px-10 py-5  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
                 >
                   <span>—</span>
                   Book now
                 </Link>
            </div>
          </div>
        </section>

        {/* ================= 3. ALTERNATING AMENITIES SECTION ================= */}
        <section className="py-24 px-6 bg-[#fdfeff]">
          <div className="max-w-7xl mx-auto space-y-28">
            
            {/* ITEM 01: Restaurant & Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-6 h-[350px] lg:h-[500px]">
                <WindowReveal 
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800" 
                  alt="Restaurant & Bar"
                  className="h-full w-full"
                />
              </div>
              <div className="lg:col-span-6 space-y-6">
                <span className="font-corm text-[#c8a64d]/30 text-8xl font-light block leading-none select-none">
                  01
                </span>
                <h3 className="text-3xl md:text-5xl font-corm font-medium text-[#0d2b4e] tracking-wide">
                  Restaurant & Bar
                </h3>
                <p className="text-[#2d5b8a] font-jost font-medium text-sm md:text-[17px] leading-relaxed">
                  An integral part of relax and perfect experience of your stay is exceptional gastronomy. Chefs' team prepares daily delicious meals from domestic and international cuisine with love for you.
                </p>
                <div className="pt-4">
                     <Link
                   to="/about"
                   className="inline-flex items-center gap-4 px-10 py-5  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
                 >
                   <span>—</span>
                   Discover More
                 </Link>
                </div>
              </div>
            </div>

            {/* ITEM 02: Spa & Wellness */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-6 lg:order-2 h-[350px] lg:h-[500px]">
                <WindowReveal 
                  src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800" 
                  alt="Spa & Wellness"
                  className="h-full w-full"
                />
              </div>
              <div className="lg:col-span-6 lg:order-1 space-y-6">
                <span className="font-corm text-[#c8a64d]/30 text-8xl font-light block leading-none select-none">
                  02
                </span>
                <h3 className="text-3xl md:text-5xl font-corm font-medium text-[#0d2b4e] tracking-wide">
                  Spa & Wellness
                </h3>
                <p className="text-[#2d5b8a] font-jost font-medium text-sm md:text-[17px] leading-relaxed">
                  Indulge in absolute relaxation. Rejuvenate your mind, body, and soul with our curated therapies, healing massages, and organic spa treatments administered by expert therapists.
                </p>
                <div className="pt-4">
                <Link
                   to="/about"
                   className="inline-flex items-center gap-4 px-10 py-5  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
                 >
                   <span>—</span>
                   Discover More
                 </Link>
                </div>
              </div>
            </div>

            {/* ITEM 03: Fitness Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <div className="lg:col-span-6 h-[350px] lg:h-[500px]">
                <WindowReveal 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800" 
                  alt="Fitness Center"
                  className="h-full w-full"
                />
              </div>
              <div className="lg:col-span-6 space-y-6">
                <span className="font-corm text-[#c8a64d]/30 text-8xl font-light block leading-none select-none">
                  03
                </span>
                <h3 className="text-3xl md:text-5xl font-corm font-medium text-[#0d2b4e] tracking-wide">
                  Fitness Center
                </h3>
                <p className="text-[#2d5b8a] font-jost font-mediumBook Your Stay Now text-sm md:text-[17px] leading-relaxed">
                  Keep up with your fitness regime. Our state-of-the-art gym is equipped with premium cardio machines, strength training equipment, and free weights for a complete workout.
                </p>
                <div className="pt-4">
                   <Link
                   to="/about"
                   className="inline-flex items-center gap-4 px-10 py-5  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
                 >
                   <span>—</span>
                   Discover More
                 </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 4. BOOK YOUR STAY NOW BANNER ================= */}
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
              <div className="absolute top-[105%] md:top-[120%] left-0 w-full md:w-64 bg-white text-neutral-800 rounded-2xl p-5 shadow-2xl border border-neutral-100 z-50 font-jost text-left select-none animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Rooms</span>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (roomsCount > 1) setRoomsCount(roomsCount - 1);
                      }}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
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
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
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
            className="relative w-full md:flex-1 flex items-center justify-between px-4 md:px-6 py-4 md:py-3 select-none cursor-pointer booking-field group"
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
              <div className="absolute top-[105%] md:top-[120%] right-0 md:left-0 w-full md:w-72 bg-white text-neutral-800 rounded-2xl p-5 shadow-2xl border border-neutral-100 z-50 font-jost text-left select-none space-y-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Adults</div>
                    <div className="text-xs text-neutral-400">Ages 13 or above</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (adultsCount > 0) setAdultsCount(adultsCount - 1);
                      }}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
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
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="border-t border-neutral-100"></div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Children</div>
                    <div className="text-xs text-neutral-400">Ages 0 - 12</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (childrenCount > 0)
                          setChildrenCount(childrenCount - 1);
                      }}
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
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
                      className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 hover:text-black transition cursor-pointer"
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
              className="w-full md:w-auto px-8 py-4 md:py-4 rounded-2xl md:rounded-xl bg-[#f3dac6] hover:bg-[#011b3c] hover:text-white text-neutral-900 font-medium tracking-[1px] uppercase text-xs md:text-sm transition-all duration-300 shadow-sm hover:shadow shrink-0 cursor-pointer flex items-center justify-center whitespace-nowrap"
            >
              Check Availability
            </button>
          </div>
        </form>
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
    
          <span className="text-sm md:text-[26px] font-semibold text-gray-500 font-corm group-hover:text-[#0d2b4e] transition-colors duration-300">
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
                            className={`text-xl md:text-4xl font-semibold tracking-wide font-corm mb-1  transition-colors duration-300 ${tabColor}`}
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

      </div>
      <Footer />
    </>
  );
};

export default Amenities;
