import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Maximize, Users, Bed, Bath, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
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
        // Fallback gracefully without showing error banner to users
        console.warn("API offline, falling back to mock rooms:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const displayRooms = rooms.length > 0 ? rooms : fallbackRooms;

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e] overflow-x-hidden font-serif min-h-screen">
        
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
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold font-sans">
              Sree Raaga Resorts Accommodation
            </span>
            <h1 className="text-5xl md:text-7xl font-light font-serif leading-tight">
              Rooms & Suites
            </h1>
          </div>
        </section>

        {/* ================= MAIN ROOMS SECTION ================= */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          
          {/* Header Introduction */}
          <div className="row justify-center text-center mb-20 select-none">
            <div className="max-w-3xl mx-auto">
              <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold font-sans">
                Our Accommodations
              </span>
              <h2 className="text-4xl md:text-6xl font-light font-serif text-[#0d2b4e] leading-tight mb-6">
                Discover Our Rooms & Suites and Villas
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-sans max-w-2xl mx-auto">
                Come in, take your shoes off and let yourself sink into the mattress.
              </p>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
            {displayRooms.map((room, idx) => (
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
                <Link 
                  to={`/rooms/${room.id || room._id}`} 
                  className="block relative overflow-hidden rounded-sm aspect-[76/62] mb-6 shadow-md"
                >
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-[#0d2b4e]/10 group-hover:bg-[#0d2b4e]/40 transition-all duration-500 z-10"></div>
                  
                  {/* Hover centered circular gold button */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/20 bg-[#c8a64d]/85 hover:bg-[#c8a64d] text-white flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm select-none">
                    <span className="text-xs font-semibold font-sans tracking-[3px]">BOOK NOW</span>
                  </div>

                  <img
                    src={getImageUrl(room.image)}
                    alt={room.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                {/* Card Text Content */}
                <div className="flex flex-col flex-grow select-none">
                  <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-light font-serif text-[#0d2b4e] transition-colors duration-300 group-hover:text-[#c8a64d]">
                        {room.name}
                      </h3>
                      {room.category && (
                        <span className="text-[10px] text-[#c8a64d] font-sans font-bold tracking-[2px] block mt-1 uppercase">
                          {room.category}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm md:text-base font-sans font-semibold text-[#c8a64d]">
                        ₹{parseFloat(room.price).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-sans block tracking-wider uppercase font-semibold">
                        / NIGHT
                      </span>
                    </div>
                  </div>

                  {/* Room Specs Row */}
                  <div className="flex flex-wrap items-center gap-6 pb-6 text-[11px] md:text-xs font-sans text-gray-500 border-b border-gray-100">
                    <div className="flex items-center">
                      <Maximize className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                      <span>{room.area || "30 M²"}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                      <span>{room.guests || "2 Guests"}</span>
                    </div>
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                      <span>{room.beds || "1 Bed"}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                      <span>{room.bathrooms || "1 Bath"}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-sans mt-6 mb-8 flex-grow">
                    {room.description}
                  </p>

                  {/* Action Link */}
                  <div>
                    <Link
                      to={`/rooms/${room.id || room._id}`}
                      className="inline-flex items-center text-[#0d2b4e] hover:text-[#c8a64d] font-sans text-xs font-bold uppercase tracking-[2px] transition-colors group/btn"
                    >
                      <span className="mr-2 border-b border-transparent group-hover/btn:border-[#c8a64d] pb-0.5">
                        Book now
                      </span>
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-20 select-none">
            <button className="px-8 py-3.5 border border-[#c8a64d] text-[#0d2b4e] hover:text-white bg-transparent hover:bg-[#c8a64d] text-xs font-bold uppercase tracking-[3px] rounded-sm transition-all duration-300 shadow-sm">
              LOAD MORE
            </button>
          </div>

        </section>

        {/* ================= HOTEL FACILITIES SECTION ================= */}
        <section className="py-24 px-6 bg-[#f7f5ee]">
          <div className="max-w-6xl mx-auto text-center mb-16 select-none">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold font-sans">
              Our Services
            </span>
            <h2 className="text-4xl md:text-5xl font-light font-serif text-[#0d2b4e]">
              Hotel Facilities
            </h2>
          </div>

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
                    <circle cx="6" cy="18" r="2" />
                    <circle cx="18" cy="18" r="2" />
                    <path d="M3 18h18" />
                    <path d="M8 18V8h7v10" />
                    <path d="M5 8h12v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v1z" />
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
                <span className="text-xs md:text-sm font-semibold tracking-wider text-gray-500 font-sans group-hover:text-[#0d2b4e] transition-colors duration-300 uppercase">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FOLLOW US ON INSTAGRAM SECTION ================= */}
        <section className=" bg-white">
          <div className="py-10 text-center mb-16 select-none">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold font-sans">
              Our Socials
            </span>
            <h2 className="text-4xl md:text-5xl font-light font-serif text-[#0d2b4e]">
              Follow us on Instagram
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 ">
            {[
              "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600",
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
              "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600",
              "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600",
              "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=600"
            ].map((url, idx) => (
              <div key={idx} className="relative overflow-hidden  aspect-square group cursor-pointer shadow-sm">
                <div className="absolute inset-0 bg-[#0d2b4e]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <img
                  src={url}
                  alt={`Instagram Showcase ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
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