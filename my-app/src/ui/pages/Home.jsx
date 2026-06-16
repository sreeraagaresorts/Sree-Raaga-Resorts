import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export default function Home() {

      const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const imageY = useTransform(scrollY, [0, 1000], [0, -100]);
const [rooms, setRooms] = useState([]);
const [loadingRooms, setLoadingRooms] = useState(true);

useEffect(() => {
  fetchRooms();
}, []);

const fetchRooms = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/rooms"
    );

    const data = await response.json();

    if (data.success) {
      setRooms(data.data);
    }
  } catch (error) {
    console.log(error);
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

  return `http://localhost:5000/uploads/${image}`;
};

  return (
<>
  <Navbar/>
    <div className="bg-black text-white">
      {/* HERO SECTION */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60"></div>
        </motion.div>

        <div className="relative z-10 text-center px-5 max-w-5xl">
          <span className="text-yellow-500 uppercase tracking-[5px] block mb-6">
            Sree Raaga Resorts
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8">
            A Symphony of <br />
            <span className="italic text-yellow-500">
              Nature & Luxury
            </span>
          </h1>

          <div className="flex justify-center gap-5 flex-wrap">
            <button className="px-8 py-3 bg-yellow-500 text-black font-medium hover:bg-yellow-400 transition">
              Discover Rooms
            </button>

            <button className="px-8 py-3 border border-white hover:bg-white hover:text-black transition">
              Our Story
            </button>
          </div>
        </div>

        {/* Booking Card */}
        <div className="absolute bottom-0 translate-y-1/2 w-full hidden lg:block px-10">
          <div className="max-w-6xl mx-auto bg-zinc-900 p-8 shadow-2xl border border-yellow-500/20">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <label className="text-yellow-500 text-xs uppercase">
                  Check In
                </label>
                <input
                  type="date"
                  className="w-full bg-transparent border-b border-gray-500 py-2 outline-none"
                />
              </div>

              <div>
                <label className="text-yellow-500 text-xs uppercase">
                  Check Out
                </label>
                <input
                  type="date"
                  className="w-full bg-transparent border-b border-gray-500 py-2 outline-none"
                />
              </div>

              <div>
                <label className="text-yellow-500 text-xs uppercase">
                  Guests
                </label>
                <select className="w-full bg-transparent border-b border-gray-500 py-2 outline-none">
                  <option className="text-black">
                    2 Adults
                  </option>
                </select>
              </div>

              <div>
                <label className="text-yellow-500 text-xs uppercase">
                  Room
                </label>
                <select className="w-full bg-transparent border-b border-gray-500 py-2 outline-none">
                  <option className="text-black">
                    Any Suite
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button className="px-8 py-3 bg-yellow-500 text-black font-semibold">
                Book Stay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WELCOME SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
              Welcome
            </p>

            <h2 className="text-5xl font-light mb-8">
              Experience the <br />
              Pinnacle of Luxury
            </h2>

            <p className="text-gray-400 leading-relaxed mb-8">
              Welcome to Sree Raaga Resorts, where architectural brilliance
              meets natural landscapes. We strive to create a sanctuary that
              tantalizes your senses and leaves unforgettable memories.
            </p>

            <button className="border border-yellow-500 px-8 py-3 hover:bg-yellow-500 hover:text-black transition">
              Explore Resort
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <img
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800"
              alt=""
              className="h-[400px] object-cover mt-12"
            />

            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"
              alt=""
              className="h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

{/* ROOMS SECTION */}
<section className="py-24 px-6 bg-zinc-950">
  <div className="max-w-7xl mx-auto">

    <div className="text-center mb-16">
      <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
        Accommodation
      </p>

      <h2 className="text-5xl font-light">
        Rooms & Suites
      </h2>
    </div>

    {loadingRooms ? (
      <div className="text-center py-10 text-yellow-500">
        Loading Rooms...
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">

        {rooms.slice(0, 4).map((room, idx) => (
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
            <Link
              to={`/rooms/${room.id}`}
              className="block"
            >
              <div className="relative overflow-hidden mb-6 aspect-[4/3]">

                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition duration-500"></div>

                <img
                  src={getImageUrl(room.image)}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                />

                <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur px-4 py-2 border border-yellow-500/30">
                  <span className="text-xs uppercase tracking-widest">
                    Starts at ₹
                    {Number(room.price).toLocaleString()}
                  </span>
                </div>

              </div>

              <h3 className="text-3xl mb-3 group-hover:text-yellow-500 transition">
                {room.name}
              </h3>

              <div className="flex flex-wrap gap-3 text-yellow-500 text-xs uppercase mb-4">
                <span>{room.area}</span>
                <span>•</span>
                <span>{room.beds}</span>
                <span>•</span>
                <span>{room.bathrooms}</span>
              </div>

              <p className="text-gray-400 mb-5 leading-relaxed">
                {room.description}
              </p>

              <div className="text-yellow-500 uppercase text-xs tracking-widest flex items-center gap-3">
                Room Details

                <span className="w-8 h-[1px] bg-yellow-500 group-hover:w-12 transition-all duration-300"></span>
              </div>
            </Link>
          </motion.div>
        ))}

      </div>
    )}

    <div className="text-center mt-16">
      <Link
        to="/rooms"
        className="inline-block px-10 py-4 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition duration-300"
      >
        View All Rooms
      </Link>
    </div>

  </div>
</section>
      {/* PARALLAX QUOTE SECTION */}
      <section
        className="relative py-32 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <div className="text-6xl text-yellow-500 mb-6">"</div>

          <p className="text-3xl italic leading-relaxed mb-10">
            Their talented team of passionate chefs masterfully crafts each
            dish, combining the finest ingredients with innovative techniques.
          </p>

          <h4 className="text-yellow-500 uppercase tracking-[4px]">
            Steven K. Roberts
          </h4>

          <p className="text-gray-400 mt-2">
            From USA
          </p>
        </div>
      </section>
    </div>
        <Footer/>
</>
  );
}