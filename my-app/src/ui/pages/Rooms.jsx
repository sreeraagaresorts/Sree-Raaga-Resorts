import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const rooms = [
  {
    id: 1,
    name: "Luxury Suite",
    price: "8,999",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200",
    area: "600 SQ FT",
    beds: "KING BED",
    bathrooms: "1 BATHROOM",
    description:
      "Experience premium comfort with stunning views and luxury amenities.",
  },
  {
    id: 2,
    name: "Royal Villa",
    price: "12,999",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1200",
    area: "900 SQ FT",
    beds: "2 KING BEDS",
    bathrooms: "2 BATHROOMS",
    description:
      "An elegant villa designed for families and luxury travelers.",
  },
  {
    id: 3,
    name: "Presidential Suite",
    price: "18,999",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200",
    area: "1200 SQ FT",
    beds: "KING BED",
    bathrooms: "2 BATHROOMS",
    description:
      "Ultimate luxury experience with private lounge and premium services.",
  },
  {
    id: 4,
    name: "Garden Cottage",
    price: "7,499",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200",
    area: "500 SQ FT",
    beds: "QUEEN BED",
    bathrooms: "1 BATHROOM",
    description:
      "Surrounded by nature and designed for a peaceful retreat.",
  },
];

const Rooms = () => {
  return (
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

        <div className="text-center mb-16">
          <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
            Accommodation
          </p>

          <h2 className="text-5xl font-light">
            Luxury Rooms & Suites
          </h2>
        </div>

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
              <div className="relative overflow-hidden mb-6 aspect-[4/3]">

                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-transparent transition duration-500"></div>

                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                />

                <div className="absolute bottom-6 left-6 z-20 bg-black/80 backdrop-blur px-4 py-2 border border-yellow-500/30">
                  <span className="text-xs uppercase tracking-widest">
                    Starts at ₹{room.price}
                  </span>
                </div>
              </div>

              <h3 className="text-3xl font-light mb-4 group-hover:text-yellow-500 transition">
                {room.name}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-yellow-500 text-xs uppercase tracking-wider mb-5">
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
  );
};

export default Rooms;