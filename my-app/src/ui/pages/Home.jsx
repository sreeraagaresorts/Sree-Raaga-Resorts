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

export default function Home() {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  
  // API states
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  
  // Gastronomy & Amenities interactive tab state
  const [activeTab, setActiveTab] = useState("suite");

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
    }
  ];

  // Display rooms from DB or fall back to mock rooms
  const displayRooms = rooms.length > 0 ? rooms.slice(0, 2) : mockRooms;

  // Gastronomy Tab details
  const tabData = {
    suite: {
      title: "Suite Room",
      description: "Indulge in spacious elegance. Our suite rooms offer beautifully tailored interiors, premium luxury bedding, and private balconies that blend indoor comfort with the serene nature outdoors.",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200"
    },
    restaurant: {
      title: "Premium Restaurant",
      description: "Savor gourmet dining crafted by expert chefs. Combining fresh local farm ingredients with global culinary techniques, our dining experiences are set in beautifully designed spaces overlooking the pools.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200"
    },
    spa: {
      title: "Wellness Spa",
      description: "Rejuvenate your senses at our wellness retreat. From specialized massages to full-body treatments, our professional therapists utilize natural botanical oils to heal and refresh your body and mind.",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1200"
    }
  };

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
        <section className="relative pt-24 pb-24 px-6 bg-white text-[#0d2b4e] overflow-hidden">
          
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
        <section className="py-24 px-6 bg-[#07162c] text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
              <div>
                <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold block mb-2">
                  Accommodation
                </span>
                <h2 className="text-3xl md:text-5xl font-light ">
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
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
                {displayRooms.map((room, idx) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                    className="group"
                  >
                    <Link to={`/rooms/${room.id}`} className="block">
                      <div className="relative mb-6 aspect-[4/3] rounded-lg overflow-hidden">
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
                  </motion.div>
                ))}
              </div>
            )}

            {/* Slider Dots Indicator */}
            <div className="flex justify-center gap-2 mt-12">
              <span className="w-8 h-1 bg-[#c8a64d] rounded-full"></span>
              <span className="w-2 h-1 bg-white/30 rounded-full"></span>
              <span className="w-2 h-1 bg-white/30 rounded-full"></span>
            </div>
          </div>
        </section>

        {/* ================= FACILITIES & INTERACTIVE GASTRONOMY ================= */}
        <section className="py-24 px-6 bg-[#f4f7fc] text-[#0d2b4e]">
          <div className="">
            
            {/* Icons Row */}
            <div className="max-w-6xl mx-auto grid grid-cols-3 md:grid-cols-6 gap-6 justify-center items-center py-8 border-b border-[#0d2b4e]/10 mb-20">
              {[
                { icon: <Wifi size={24} />, name: "Free Wi-Fi" },
                { icon: <Dumbbell size={24} />, name: "Gym Center" },
                { icon: <Waves size={24} />, name: "Poolside" },
                { icon: <Sparkles size={24} />, name: "Wellness Spa" },
                { icon: <Utensils size={24} />, name: "Restaurant" },
                { icon: <Car size={24} />, name: "Valet Parking" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                  <div className="w-12 h-12 rounded-full border border-[#0d2b4e]/10 flex items-center justify-center mb-3 text-gray-500 group-hover:text-[#c8a64d] group-hover:border-[#c8a64d] transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider font-semibold text-gray-500 group-hover:text-[#0d2b4e] transition">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Gastronomy Interactive Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left: Dynamic tab image */}
              <div className="relative group">
                <WindowReveal 
                  src={tabData[activeTab].image} 
                  alt={tabData[activeTab].title}
                  className="h-[400px] md:h-[480px]  shadow-2xl"
                />
                {/* Custom circular interaction overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center pointer-events-none scale-0 group-hover:scale-100 transition-all duration-500">
                  <span className="text-[10px] text-white uppercase tracking-widest font-semibold font-sans">View</span>
                </div>
              </div>

              {/* Right: Interactive Tabs List */}
              <div>
                <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold block mb-3">
                  Hotel Facilities
                </span>
                <h2 className="text-3xl md:text-4xl font-light leading-tight mb-8 ">
                  Exceptional Gastronomy, <br />in Beautiful Spaces
                </h2>

                <div className="space-y-6">
                  {Object.keys(tabData).map((key, idx) => {
                    const isActive = activeTab === key;
                    return (
                      <div 
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`p-6 border-l-2 transition-all duration-300 cursor-pointer ${
                          isActive 
                            ? "border-[#c8a64d] bg-white shadow-md" 
                            : "border-gray-200 hover:border-[#c8a64d]/40 hover:bg-white/50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h3 className={`text-lg font-light tracking-wide transition ${isActive ? "text-[#c8a64d]" : "text-gray-500"}`}>
                            0{idx + 1}. {tabData[key].title}
                          </h3>
                          {isActive && <ArrowRight size={18} className="text-[#c8a64d]" />}
                        </div>
                        {isActive && (
                          <motion.p 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-gray-500 text-sm leading-relaxed font-sans"
                          >
                            {tabData[key].description}
                          </motion.p>
                        )}
                      </div>
                    );
                  })}
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
              <div key={index} className="relative h-[650px] group  overflow-hidden shadow-lg">
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
        <section className="py-24 px-6 bg-[#fcfaf2] text-[#0d2b4e]">
          <div className=" flex flex-col lg:flex-row items-center ">
            
            {/* Left Image */}
            <div className="w-full lg:w-1/4">
              <WindowReveal 
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800" 
                alt="Courtyard" 
                className="h-[300px] lg:h-[600px]  shadow-xl"
              />
            </div>

            {/* Central Box */}
            <div className="w-full lg:w-1/2 text-center  p-8 md:p-12 ">
              <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold block mb-4">
                Sree Raaga Spaces
              </span>
              <h2 className="text-2xl md:text-3xl font-light leading-snug mb-8 mx-20 ">
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
        <section className="py-24  bg-[#f0e6d2] text-[#0d2b4e]">
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
        <section className="  bg-white text-[#0d2b4e]">
          <div className="py-12 text-center mb-12">
            <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold block mb-2">
              Social Media
            </span>
            <h2 className="text-5xl font-light  flex items-center justify-center gap-2">
              Follow us on Instagram <InstagramIcon size={20} className="text-[#c8a64d]" />
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