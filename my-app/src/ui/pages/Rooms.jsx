import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import { API_URL } from "../../config/api";

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
        setError(err.message);
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
  return (
   <>
    <Navbar/>
    <div className="bg-black text-white">

      {/* Hero Banner */}
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            Rooms & Suites
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Home / Rooms
          </p>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">
          <p className="text-yellow-500 uppercase tracking-[4px] mb-4 text-xs font-semibold">
            Accommodation
          </p>

          <h2 className="text-5xl font-light mb-6">
            Stay With Comfort
          </h2>
          
          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed text-sm mb-12">
            Choose from a range of comfortable accommodations designed for families, couples, and groups. Sree Raaga Resort features 55 total units across distinct categories, offering cozy rooms and premium villas. All rooms and villas accommodate 2 guests, except our signature Duplex Villa which accommodates 4.
          </p>

          {/* Quick Categories Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border border-yellow-500/10 p-6 bg-zinc-950 mb-16">
            {[
              { title: "Executive Rooms", desc: "35 well-appointed rooms" },
              { title: "1 BHK Villas", desc: "9 villas for couples/families" },
              { title: "Compact Villas", desc: "5 private villas" },
              { title: "Duplex Villa", desc: "Private pool & premium experience" }
            ].map((cat, idx) => (
              <div key={idx} className="text-center">
                <h4 className="text-yellow-500 font-semibold text-xs tracking-wider uppercase mb-1">{cat.title}</h4>
                <p className="text-[10px] text-gray-500">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center text-yellow-500 py-12 text-xl">
            Loading rooms...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-12 text-xl">
            Error: {error}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="text-center text-white/50 py-12 text-xl">
            No rooms available at the moment.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
          {rooms.map((room, idx) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: idx * 0.1,
              }}
              className="group"
            >
              <Link to={`/rooms/${room.id}`} className="block relative overflow-hidden mb-6 aspect-[4/3]">

                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition duration-500"></div>

                <img
                  src={getImageUrl(room.image)}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                />

                <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur px-4 py-2 border border-yellow-500/30 text-white">
                  <span className="text-xs uppercase tracking-widest">
                    Starts at ₹{parseFloat(room.price).toLocaleString()}
                  </span>
                </div>
              </Link>

              <h3 className="text-3xl font-light mb-1 group-hover:text-yellow-500 transition">
                {room.name}
              </h3>

              {room.category && (
                <div className="text-[10px] text-yellow-500/80 uppercase tracking-widest font-bold mb-3">
                  {room.category}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 text-white/50 text-xs uppercase tracking-wider mb-5">
                <span>{room.area}</span>
                <span>•</span>
                <span>{room.beds}</span>
                <span>•</span>
                <span>{room.bathrooms}</span>
              </div>

              <p className="text-gray-400 leading-relaxed mb-6">
                {room.description}
              </p>

              <Link
                to={`/rooms/${room.id}`}
                className="text-yellow-500 uppercase text-xs tracking-widest flex items-center gap-3"
              >
                Room Details

                <span className="w-8 h-[1px] bg-yellow-500 group-hover:w-12 transition-all duration-300"></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950 border-t border-yellow-500/10">
        <div className="max-w-4xl mx-auto text-center px-6">

          <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
            Reserve Today
          </p>

          <h2 className="text-5xl font-light mb-8">
            Experience Luxury Like Never Before
          </h2>

          <p className="text-gray-400 mb-10">
            Choose from our collection of luxury rooms and suites crafted
            for comfort, elegance, and unforgettable memories.
          </p>

          <Link
            to="/contact"
            className="inline-block px-10 py-4 bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition"
          >
            Book Your Stay
          </Link>
        </div>
      </section>

    </div>
      <Footer/>
   </>
  );
};

export default Rooms;