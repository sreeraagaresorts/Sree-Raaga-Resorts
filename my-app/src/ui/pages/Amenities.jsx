import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronDown, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DatePicker from "react-datepicker";

import wifiIcon from "../../assets/icons/wifi.png";
import buggyIcon from "../../assets/icons/car.png";
import tvIcon from "../../assets/icons/tv.png";
import roomServiceIcon from "../../assets/icons/services.png";
import laundryIcon from "../../assets/icons/laundry.png";
import housekeepingIcon from "../../assets/icons/cleaning.png";

const amenitiesList = [
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

const tabData = {
  dining: {
    title: "Signature Restaurant",
    description: "An integral part of relax and perfect experience of your stay is exceptional gastronomy. Chefs' team prepares daily delicious meals from domestic and international cuisine with love for you.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
    icon: <RestaurantIcon className="w-6 h-6 mb-3" />
  },
  poolbar: {
    title: "Pool Bar",
    description: "Sip classic cocktails, dynamic mocktails, and refreshing spirits by the pool. Our open pool bar serves perfect bites to complement a relaxing day in the sun.",
    image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=1200",
    icon: <MartiniIcon className="w-6 h-6 mb-3" />
  },
  zumafish: {
    title: "Zuma Fish",
    description: "Enjoy a unique, coastal fish-fry and seafood specialty experience. Zuma Fish highlights locally-sourced ingredients prepared using traditional coastal recipes.",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200",
    icon: <FishIcon className="w-6 h-6 mb-3" />
  },
  golf: {
    title: "Golf",
    description: "Unwind on our pristine golf lawns. Complete with high-grade equipment, our golfing turf offers a perfect recreational getaway for beginners and enthusiasts alike.",
    image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200",
    icon: <GolfIcon className="w-6 h-6 mb-3" />
  },
  lounge: {
    title: "Sunset Lounge",
    description: "Overlook the grand landscaped gardens and the setting sun. Our lounge is designed to offer calm seating, signature drinks, and light finger food in beautiful spaces.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200",
    icon: <SunsetIcon className="w-6 h-6 mb-3" />
  }
};

const Amenities = () => {
  const [activeTab, setActiveTab] = useState("zumafish");

  const handleTabClick = (key) => {
    setActiveTab(key);
  };

  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomType, setRoomType] = useState("Rooms");
  const [guests, setGuests] = useState("Guests");

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
    navigate("/rooms", { state: { checkIn, checkOut, guests, roomType } });
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e] overflow-x-hidden">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517176118179-65244903d13c?q=80&w=2000')"
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/30"></div>
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
            <span className="text-[#c8a64d] text-xs uppercase tracking-[4px] font-semibold font-jost block">
              LUXURY RESORT
            </span>
            <h2 className="text-3xl md:text-5xl font-medium font-corm text-[#0d2b4e] leading-snug">
              Water Sports you Must Try
            </h2>
            <p className="text-[#2d5b8a] font-jost font-light text-sm md:text-[16px] leading-relaxed max-w-2xl mx-auto">
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
        <section className="py-24 px-6 bg-[#fcfaf2]">
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
                <h3 className="text-3xl md:text-4xl font-corm font-light text-[#0d2b4e] tracking-wide">
                  Restaurant & Bar
                </h3>
                <p className="text-[#2d5b8a] font-jost font-light text-sm md:text-[15px] leading-relaxed">
                  An integral part of relax and perfect experience of your stay is exceptional gastronomy. Chefs' team prepares daily delicious meals from domestic and international cuisine with love for you.
                </p>
                <div className="pt-4">
                     <Link
                   to="/about"
                   className="inline-flex items-center gap-4 px-6 py-4  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
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
                <h3 className="text-3xl md:text-4xl font-corm font-light text-[#0d2b4e] tracking-wide">
                  Spa & Wellness
                </h3>
                <p className="text-[#2d5b8a] font-jost font-light text-sm md:text-[15px] leading-relaxed">
                  Indulge in absolute relaxation. Rejuvenate your mind, body, and soul with our curated therapies, healing massages, and organic spa treatments administered by expert therapists.
                </p>
                <div className="pt-4">
                <Link
                   to="/about"
                   className="inline-flex items-center gap-4 px-6 py-4  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
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
                <h3 className="text-3xl md:text-4xl font-corm font-light text-[#0d2b4e] tracking-wide">
                  Fitness Center
                </h3>
                <p className="text-[#2d5b8a] font-jost font-light text-sm md:text-[15px] leading-relaxed">
                  Keep up with your fitness regime. Our state-of-the-art gym is equipped with premium cardio machines, strength training equipment, and free weights for a complete workout.
                </p>
                <div className="pt-4">
                   <Link
                   to="/about"
                   className="inline-flex items-center gap-4 px-6 py-4  bg-[#efd3b2] hover:bg-[#0d2b4e] hover:text-white transtion duration-300 text-black uppercase tracking-wider font-medium"
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
          className="relative py-32 bg-fixed bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2000')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 w-full max-w-6xl px-6 text-center space-y-6">
            <span className="text-white text-[17px] uppercase tracking-[6px] font-semibold font-jost">
              Sree Raaga Resorts
            </span>
            <h2 className="text-4xl md:text-5xl font-light font-corm text-white">
              Book Your Stay Now
            </h2>
            <form
              onSubmit={handleSearch}
              className="max-w-5xl w-full mx-auto bg-transparent backdrop-blur-xl border border-white/10 rounded-3xl md:rounded-full px-4 md:px-6 py-4 md:py-3 flex flex-col md:flex-row items-center shadow-2xl mt-8 overflow-hidden"
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
                          {checkIn && checkOut
                            ? `${new Date(checkIn).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} - ${new Date(checkOut).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`
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
              <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
                <div className="flex-1 text-left">
                  <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
                    Room Type
                  </p>
                  <span className="text-white text-xs lg:text-sm">
                    {roomType}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className="text-white/60"
                />
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                >
                  <option value="Rooms" disabled hidden>
                    Rooms
                  </option>
                  <option value="Any Suite">Any Suite</option>
                  <option value="Executive Room">Executive Room</option>
                  <option value="Private Villa">Private Villa</option>
                  <option value="Duplex Villa">Duplex Villa</option>
                </select>
              </div>

              {/* GUESTS */}
              <div className="relative w-full md:flex-1 flex items-center gap-3 px-4 py-3">
                <div className="flex-1 text-left">
                  <p className="text-[10px] uppercase tracking-[3px] text-white/40 mb-1">
                    Guests
                  </p>
                  <span className="text-white text-xs lg:text-sm">
                    {guests === "Guests"
                      ? "Guests"
                      : guests === "1"
                      ? "1 Guest"
                      : `${guests} Guests`}
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className="text-white/60"
                />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                >
                  <option value="Guests" disabled hidden>
                    Guests
                  </option>
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests</option>
                </select>
              </div>

              {/* SEARCH BUTTON */}
              <button
                type="submit"
                className="group mt-4 md:mt-0 md:ml-4 h-12 w-12 rounded-full bg-[#c8a64d] text-[#04121a] flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg shrink-0 cursor-pointer"
              >
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </form>
          </div>
        </section>

        {/* ================= 5. HOTEL FACILITIES SECTION ================= */}
        <section className="py-24 bg-[#f7faff] text-[#0d2b4e]">
          <div className="max-w-[160vh] mx-auto">
            <div className="text-center mb-16 select-none">
              <h2 className="text-4xl md:text-6xl font-medium font-corm text-[#0d2b4e]">
                Hotel Facilities
              </h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 justify-center items-center py-4">
              {amenitiesList.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                  <div className="overflow-hidden">
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
          </div>
        </section>

        {/* ================= 6. EXCEPTIONAL GASTRONOMY SECTION ================= */}
        <section className="pt-24 bg-[#f7faff] ">
          <div className=" ">
            
            <div className="text-center mb-16 select-none">
              <span className="text-gray-400 uppercase tracking-[4px] text-[12px] block mb-4 font-jost">
                Sree Raaga Resorts Luxury Hotel
              </span>
              <h2 className="text-3xl md:text-[56px] font-medium font-corm text-[#0d2b4e] leading-snug">
                Exceptional Gastronomy <br>
                </br>In Beautiful Spaces
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Left Side: Dynamic image display */}
              <div className="lg:col-span-7 h-[450px] lg:h-[800px] relative group w-full overflow-hidden shadow-lg ">
                <WindowReveal 
                  src={tabData[activeTab].image} 
                  alt={tabData[activeTab].title}
                  className="h-full w-full"
                />
               <Link
  to="/rooms"
  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 rounded-full bg-[#0d2b4e]/85 backdrop-blur-[3px] border border-white/20 hover:bg-[#c8a64d] hover:border-[#c8a64d] flex flex-col items-center justify-center text-white transition-all duration-500 shadow-xl group/btn"
>
  <span className="text-[10px] font-bold tracking-widest uppercase transition-transform duration-300 group-hover/btn:scale-105">
    Book Now
  </span>
</Link>
              </div>

              {/* Right Side: Static interactive tabs */}
              <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
                {Object.keys(tabData).map((key) => {
                  const isActive = activeTab === key;
                  const tabColor = isActive
                    ? "text-[#0d2b4e]"
                    : "text-[#0d2b4e]/35 hover:text-[#0d2b4e]/60";

                  return (
                    <div
                      key={key}
                      onClick={() => handleTabClick(key)}
                      className="cursor-pointer group flex flex-col items-start justify-center transition-all duration-300 py-3 px-2 border-b border-[#0d2b4e]/5 last:border-b-0"
                    >
                      <div className={`transition-colors duration-300 ${tabColor}`}>
                        {tabData[key].icon}
                      </div>

                      <h3
                        className={`text-xl md:text-3xl font-medium tracking-wide font-corm mb-1 transition-colors duration-300 ${tabColor}`}
                      >
                        {tabData[key].title}
                      </h3>

                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive ? "max-h-[200px] opacity-100 mt-2" : "max-h-0 opacity-0"
                      }`}>
                        <p className="text-sm text-gray-500 leading-relaxed font-jost font-light">
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
