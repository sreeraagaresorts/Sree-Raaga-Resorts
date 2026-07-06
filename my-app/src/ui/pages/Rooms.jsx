import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Maximize, Users, Bed, Bath, ArrowRight, Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";

import { API_URL } from "../../config/api";

const fallbackRooms = [
  {
    id: "executive-room",
    name: "Executive Room",
    price: 4990,
    area: "30 M²",
    beds: "1 Double Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "EXECUTIVE ROOMS",
    description: "Our Executive Rooms offer a perfect blend of comfort and style, featuring modern amenities, cozy bedding, and a peaceful atmosphere for business or leisure travelers.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"
  },
  {
    id: "1bhk-villa",
    name: "1 BHK Villa",
    price: 6990,
    area: "45 M²",
    beds: "1 King Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "1 BHK VILLAS",
    description: "Indulge in our private 1 BHK Villas, offering a spacious living area, fully equipped kitchenette, and a private balcony overlooking the resort's lush gardens.",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800"
  },
  {
    id: "compact-villa",
    name: "Compact Villa",
    price: 5990,
    area: "38 M²",
    beds: "1 Queen Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "COMPACT VILLAS",
    description: "Compact yet luxurious, these villas are perfect for couples looking for privacy and comfort, complete with premium fittings and beautiful outdoor patio seating.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"
  },
  {
    id: "duplex-villa",
    name: "Duplex Villa",
    price: 9990,
    area: "75 M²",
    beds: "2 Double Beds",
    bathrooms: "2 Bathrooms",
    guests: "4 Guests",
    category: "DUPLEX VILLA",
    description: "Our signature Duplex Villa is the pinnacle of resort luxury, spanning two levels with separate living spaces, a private pool access, and premium butler service.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800"
  },
  {
    id: "panorama-suite",
    name: "Panorama Suite",
    price: 7990,
    area: "50 M²",
    beds: "1 King Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "PANORAMA SUITE",
    description: "Wake up to stunning panoramic views of the scenic surrounding mountains. Features a luxury jacuzzi, premium sound system, and floor-to-ceiling glass windows.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800"
  },
  {
    id: "garden-cottage",
    name: "Garden Cottage",
    price: 5490,
    area: "35 M²",
    beds: "1 Double Bed",
    bathrooms: "1 Bathroom",
    guests: "2 Guests",
    category: "COMPACT VILLAS",
    description: "Tucked away in the resort's quietest garden corner, this cottage offers rustic charm blended with modern comfort, ideal for a serene nature getaway.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800"
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

const Rooms = () => {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserWishlist = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${API_URL}/api/auth/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setWishlist(data.data.map(r => r.id));
        }
      } catch (err) {
        console.warn("Failed to fetch user wishlist in Rooms catalog:", err.message);
      }
    };
    fetchUserWishlist();
  }, [token]);

  const handleWishlistToggle = async (roomId) => {
    if (!token) {
      toast.error("Please sign in to add rooms to your wishlist!");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/api/auth/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ roomId })
      });
      const data = await response.json();
      if (data.success) {
        if (data.added) {
          setWishlist(prev => [...prev, roomId]);
          toast.success("Room added to wishlist!");
        } else {
          setWishlist(prev => prev.filter(id => id !== roomId));
          toast.success("Room removed from wishlist.");
        }
      } else {
        throw new Error(data.message || "Failed to update wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update wishlist.");
    }
  };

  const isInWishlist = (roomId) => wishlist.includes(roomId);

  const fetchRooms = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/rooms`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data = await response.json();
      if (data.success) {
        setRooms(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch rooms");
      }
    } catch (err) {
      console.warn("API offline, falling back to mock rooms:", err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();

    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/room-categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch room categories:", err.message);
      }
    };
    fetchCategories();

    // Auto-refresh rooms silently every 10 seconds
    const interval = setInterval(() => {
      fetchRooms(true);
      fetchCategories(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const displayRooms = rooms.length > 0 ? rooms : fallbackRooms;

  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const filteredRooms = React.useMemo(() => {
    if (!categoryParam) return displayRooms;

    const lowerParam = categoryParam.toLowerCase().trim();

    return displayRooms.filter((room) => {
      const roomCat = (room.category || "").toLowerCase().trim();
      
      if (lowerParam === "executive-rooms" || lowerParam === "executive rooms") {
        return roomCat.includes("executive");
      }
      if (lowerParam === "private-villas" || lowerParam === "private villas") {
        return (roomCat.includes("villa") || roomCat.includes("cottage")) && !roomCat.includes("duplex");
      }
      if (lowerParam === "duplex-villa" || lowerParam === "duplex villa") {
        return roomCat.includes("duplex");
      }

      return roomCat.includes(lowerParam) || lowerParam.includes(roomCat);
    });
  }, [displayRooms, categoryParam]);

  const villasRooms = React.useMemo(() => {
    return filteredRooms.filter((room) => {
      const lowerCat = (room.category || "").toLowerCase().trim();
      if (lowerCat === "villas" || lowerCat === "villa") return true;
      const cat = categories.find(c => c.name.toLowerCase() === lowerCat);
      if (cat) {
        return (cat.parent || "").toLowerCase() === "villas" || cat.name.toLowerCase() === "villas";
      }
      return lowerCat.includes("villa") || lowerCat.includes("cottage");
    });
  }, [filteredRooms, categories]);

  const roomsRooms = React.useMemo(() => {
    return filteredRooms.filter((room) => {
      const lowerCat = (room.category || "").toLowerCase().trim();
      if (lowerCat === "rooms" || lowerCat === "room") return true;
      const cat = categories.find(c => c.name.toLowerCase() === lowerCat);
      if (cat) {
        return (cat.parent || "").toLowerCase() === "rooms" || cat.name.toLowerCase() === "rooms";
      }
      return !villasRooms.some(v => (v.id || v._id) === (room.id || room._id));
    });
  }, [filteredRooms, categories, villasRooms]);

  const getCategoryTitle = () => {
    if (!categoryParam) return "Rooms & Suites";
    const lowerParam = categoryParam.toLowerCase().trim();
    if (lowerParam === "executive-rooms" || lowerParam === "executive rooms") return "Executive Rooms";
    if (lowerParam === "private-villas" || lowerParam === "private villas") return "Private Villas";
    if (lowerParam === "duplex-villa" || lowerParam === "duplex villa") return "Duplex Villa";
    return categoryParam;
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e] overflow-x-hidden  min-h-screen">
        
        {/* ================= HERO BANNER ================= */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white px-4 mt-20 select-none">
            <span className="text-white uppercase tracking-[6px] block mb-2 text-[17px]  font-semibold ">
              Sree Raaga Resorts Accommodation
            </span>
            <h1 className="text-5xl md:text-[92px] font-medium font-corm  leading-tight">
              {getCategoryTitle()}
            </h1>
          </div>
        </section>

        {/* ================= MAIN ROOMS SECTION ================= */}
        <section className="py-24 max-w-7xl mx-auto md:px-6">
          
          {/* Header Introduction */}
          <div className="row justify-center text-center mb-20 select-none">
            <div className="max-w-2xl mx-auto px-6 md:px-0">
              <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-2 text-[12px]  font-semibold ">
                Our Accommodations
              </span>
              <h2 className="text-4xl md:text-6xl font-medium font-corm  text-[#0d2b4e]  mb-6">
                Discover Our Rooms & Suites and Villas
              </h2>
              {/* <p className="text-gray-500 text-sm md:text-base leading-relaxed  max-w-2xl mx-auto">
                Come in, take your shoes off and let yourself sink into the mattress.
              </p> */}
            </div>
          </div>

          {/* Grouped Rooms Grid */}
          <div className="space-y-20">
            {/* Villas Group */}
            {villasRooms.length > 0 && (
              <div>
                <div className="border-b border-[#0d2b4e]/10 pb-4 mb-12 select-none">
                  <h3 className="text-3xl font-medium font-corm text-[#0d2b4e] tracking-wider uppercase px-6 md:px-0">Villas</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
                  {villasRooms.map((room, idx) => (
                    <motion.div
                      key={room.id || room._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                      transition={{
                        duration: 0.8,
                        delay: (idx % 2) * 0.1,
                        ease: [0.25, 1, 0.35, 1]
                      }}
                      className="group flex flex-col"
                    >
                      {/* Room Image Container with Centered Hover circle */}
                      <div className="relative overflow-hidden aspect-[76/62] mb-6 shadow-md">
                        <Link 
                          to={`/rooms/${room.id || room._id}`} 
                          className="block w-full h-full animate-none"
                        >
                          {/* Subtle overlay */}
                          <div className="absolute inset-0 bg-[#0d2b4e]/10 group-hover:bg-[#0d2b4e]/40 transition-all duration-500 z-10"></div>
                          
                          {/* Hover centered circular gold button */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-white/20 bg-[#c8a64d]/85 hover:bg-[#c8a64d] text-white flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm select-none">
                            <span className="text-sm font-semibold  tracking-[3px]">BOOK NOW</span>
                          </div>

                          <img
                            src={getImageUrl(room.image)}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>

                        {/* Heart / Wishlist Toggle */}
                        <button 
                          onClick={() => handleWishlistToggle(room.id)}
                          className="absolute top-4 right-4 p-2 bg-white/70 hover:bg-white rounded-full text-[#0d2b4e] hover:text-[#c8a64d] transition-all duration-300 z-30 shadow-sm cursor-pointer border-0"
                          title={isInWishlist(room.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors duration-300 ${
                              isInWishlist(room.id) ? "fill-[#c8a64d] text-[#c8a64d]" : "text-gray-400 hover:text-[#c8a64d]"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Room Metadata */}
                      <div className="flex flex-col flex-grow select-none px-6 md:px-0">
                        <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <h3 className="text-3xl md:text-4xl font-medium font-corm  text-[#0d2b4e] transition-colors duration-300 group-hover:text-[#c8a64d]">
                              {room.name}
                            </h3>
                            {room.category && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-[#c8a64d]  font-bold tracking-[2px] block uppercase">
                                  {room.category}
                                </span>
                                {/* {room.availableRooms === 0 && (
                                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                    Sold Out
                                  </span>
                                )} */}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-lg md:text-xl font-semibold text-gray-800">
                              ₹{parseFloat(room.price).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-800 uppercase font-semibold">
                              / NIGHT
                            </span>
                          </div>
                        </div>

                        {/* Details Pills */}
                        <div className="flex flex-wrap items-center gap-6 pb-6 text-[15px] md:text-[17px] text-gray-500 border-b border-gray-100">
                          <div className="flex items-center">
                            <Maximize className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.area || "30 M²"} Sqft</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.guests || "2 Guests"} </span>
                          </div>
                          <div className="flex items-center">
                            <Bed className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.beds || "1 Bed"} Bed</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.bathrooms || "1 Bath"} </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed mt-6 mb-8 flex-grow whitespace-pre-line line-clamp-2">
                          {room.description}
                        </p>

                        {/* Action Link */}
                        <div>
                          <Link
                            to={`/rooms/${room.id || room._id}`}
                            className="inline-flex items-center text-[#0d2b4e] hover:text-[#c8a64d]  text-sm font-bold uppercase tracking-[2px] transition-colors group/btn"
                          >
                            <span className="mr-2 border-b border-transparent group-hover/btn:border-[#c8a64d] pb-0.5">
                              Book now
                            </span>
                            <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>  
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms Group */}
            {roomsRooms.length > 0 && (
              <div>
                <div className="border-b border-[#0d2b4e]/10 pb-4 mb-12 select-none">
                  <h3 className="text-3xl font-medium font-corm text-[#0d2b4e] tracking-wider uppercase px-6 md:px-0">Rooms</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
                  {roomsRooms.map((room, idx) => (
                    <motion.div
                      key={room.id || room._id}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
                      transition={{
                        duration: 0.8,
                        delay: (idx % 2) * 0.1,
                        ease: [0.25, 1, 0.35, 1]
                      }}
                      className="group flex flex-col"
                    >
                      {/* Room Image Container with Centered Hover circle */}
                      <div className="relative overflow-hidden aspect-[76/62] mb-6 shadow-md">
                        <Link 
                          to={`/rooms/${room.id || room._id}`} 
                          className="block w-full h-full animate-none"
                        >
                          {/* Subtle overlay */}
                          <div className="absolute inset-0 bg-[#0d2b4e]/10 group-hover:bg-[#0d2b4e]/40 transition-all duration-500 z-10"></div>
                          
                          {/* Hover centered circular gold button */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 rounded-full border border-white/20 bg-[#c8a64d]/85 hover:bg-[#c8a64d] text-white flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm select-none">
                            <span className="text-sm font-semibold  tracking-[3px]">BOOK NOW</span>
                          </div>

                          <img
                            src={getImageUrl(room.image)}
                            alt={room.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </Link>

                        {/* Heart / Wishlist Toggle */}
                        <button 
                          onClick={() => handleWishlistToggle(room.id)}
                          className="absolute top-4 right-4 p-2 bg-white/70 hover:bg-white rounded-full text-[#0d2b4e] hover:text-[#c8a64d] transition-all duration-300 z-30 shadow-sm cursor-pointer border-0"
                          title={isInWishlist(room.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors duration-300 ${
                              isInWishlist(room.id) ? "fill-[#c8a64d] text-[#c8a64d]" : "text-gray-400 hover:text-[#c8a64d]"
                            }`}
                          />
                        </button>
                      </div>

                      {/* Room Metadata */}
                      <div className="flex flex-col flex-grow select-none px-6 md:px-0">
                        <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                          <div>
                            <h3 className="text-3xl md:text-4xl font-medium font-corm  text-[#0d2b4e] transition-colors duration-300 group-hover:text-[#c8a64d]">
                              {room.name}
                            </h3>
                            {room.category && (
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-xs text-[#c8a64d]  font-bold tracking-[2px] block uppercase">
                                  {room.category}
                                </span>
                                {room.availableRooms === 0 && (
                                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                                    Sold Out
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-lg md:text-xl font-semibold text-gray-800">
                              ₹{parseFloat(room.price).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-800 uppercase font-semibold">
                              / NIGHT
                            </span>
                          </div>
                        </div>

                        {/* Details Pills */}
                        <div className="flex flex-wrap items-center gap-6 pb-6 text-[15px] md:text-[17px] text-gray-500 border-b border-gray-100">
                          <div className="flex items-center">
                            <Maximize className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.area || "30 M²"} Sqft</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.guests || "2 Guests"} </span>
                          </div>
                          <div className="flex items-center">
                            <Bed className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.beds || "1 Bed"} Bed</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-5 h-5 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                            <span>{room.bathrooms || "1 Bath"} </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed mt-6 mb-8 flex-grow whitespace-pre-line line-clamp-2">
                          {room.description}
                        </p>

                        {/* Action Link */}
                        <div>
                          <Link
                            to={`/rooms/${room.id || room._id}`}
                            className="inline-flex items-center text-[#0d2b4e] hover:text-[#c8a64d]  text-sm font-bold uppercase tracking-[2px] transition-colors group/btn"
                          >
                            <span className="mr-2 border-b border-transparent group-hover/btn:border-[#c8a64d] pb-0.5">
                              Book now
                            </span>
                            <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>


        </section>

        {/* ================= HOTEL FACILITIES SECTION ================= */}
        <section className="md:py-24 px-6 bg-[#fdfeff]">
         <div className="max-w-6xl mx-auto text-center mb-16">
          
              <h2 className="text-4xl md:text-6xl font-medium font-corm  text-[#0d2b4e]">
                Resort Facilities
              </h2>
            </div>
        

            {/* Icons Row */}
            <div className="max-w-[160vh] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4 justify-center items-center py-4 mb-12 md:mb-32">
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

      <span className="text-[16px] md:text-[24px] font-semibold text-gray-500 font-corm group-hover:text-[#0d2b4e] transition-colors duration-300">
        {item.name}
      </span>
    </div>
  ))}
</div>
        </section>

     {/* ================= FOLLOW US ON INSTAGRAM ================= */}
      <section className="bg-[#fdfeff] text-[#0d2b4e]">
        <div className="py-12 text-center mb-12">
          <span className="text-[#c8a64d] uppercase tracking-[4px] text-[17px] font-jost font-semibold block mb-2">
            Social Media
          </span>
          <h2 className="text-[36px] md:text-6xl font-medium font-corm flex items-center justify-center gap-2">
            Follow us on Instagram 
            {/* <Instagram size={26} className="text-[#c8a64d] mt-2" /> */}
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
              className="flex-none w-[75%] sm:w-auto snap-center sm:snap-align-none relative aspect-square overflow-hidden group shadow-sm"
            >
              <img 
                src={img} 
                alt={`Instagram Showcase ${i}`} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-[#0d2b4e]/60 opacity-0 group-hover:opacity-100 transition duration-300 z-10 flex items-center justify-center">
                {/* <Instagram size={28} className="text-white" /> */}
              </div>
            </div>
          ))}
        </div>
      </section>

      </div>
      <Footer />
    </>
  );
};

export default Rooms;

