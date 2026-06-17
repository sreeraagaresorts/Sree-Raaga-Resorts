import React from "react";
import { motion } from "motion/react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const galleryData = [
  "https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=1000",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1000",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1000",
];

const About = () => {
  return (
  <>
  <Navbar/>
    <div className="bg-black text-white">

      {/* Hero Banner */}
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            About Us
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Home / About Us
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
              Welcome
            </p>

            <h2 className="text-5xl font-light mb-8 leading-tight">
              Experience the Pinnacle
              <br />
              of Luxury at
              <span className="text-yellow-500">
                {" "}Sree Raaga
              </span>
            </h2>

            <p className="text-gray-400 leading-relaxed mb-6">
              Welcome to our resort, where culinary artistry meets exceptional
              dining experiences. We strive to create a gastronomic haven that
              tantalizes your taste buds and leaves you with unforgettable
              memories.
            </p>

            <p className="text-gray-400 leading-relaxed mb-8">
              Discover a world where luxury, comfort, and natural beauty come
              together to create unforgettable experiences for every guest.
            </p>

            <h4 className="text-3xl italic text-yellow-500">
              Sree Raaga Hotel
            </h4>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800"
              alt="Luxury Resort"
              className="w-full h-[350px] sm:h-[450px] md:h-[600px] object-cover"
            />
          </motion.div>

        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-zinc-950 border-y border-yellow-500/10">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

            {[
              { num: "55", label: "Luxury Rooms & Villas" },
              { num: "5", label: "Banquet & Dining Spaces" },
              { num: "800+", label: "Event Guest Capacity" },
              { num: "60 ft", label: "Recreational Pool" },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-6xl text-yellow-500 mb-3">
                  {item.num}
                </h2>

                <p className="text-gray-400 italic">
                  {item.label}
                </p>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      {/* PROPERTY OVERVIEW & INFRASTRUCTURE */}
      <section className="py-24 max-w-7xl mx-auto px-6 border-b border-yellow-500/10">
        <div className="text-center mb-16">
          <p className="text-yellow-500 uppercase tracking-[4px] mb-4 text-xs font-semibold">
            Property Overview
          </p>
          <h2 className="text-4xl md:text-5xl font-light">
            Resort Facilities & Infrastructure
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Rooms Inventory Card */}
          <div className="bg-zinc-900/40 border border-yellow-500/10 p-8 rounded hover:border-yellow-500/30 transition duration-300">
            <h3 className="text-2xl font-light text-yellow-500 mb-6 uppercase tracking-wider">Rooms Inventory</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Total 55 well-appointed rooms and luxury villas designed for couples, families, and groups.
            </p>
            <ul className="space-y-3.5 text-sm text-gray-300">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Executive Rooms</span>
                <span className="font-bold text-yellow-500">35 units</span>
              </li>
              <li className="text-xs text-white/50 pl-4 space-y-1">
                <p>• High-end Executive: 24 rooms</p>
                <p>• Executive with Balcony: 9 rooms</p>
                <p>• Executive without Balcony: 3 rooms</p>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2 pt-2">
                <span>Luxury 1 BHK Villas</span>
                <span className="font-bold text-yellow-500">9 units</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>Compact Villas (Row-House Style)</span>
                <span className="font-bold text-yellow-500">5 units</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>Premium Duplex Villa (with private pool)</span>
                <span className="font-bold text-yellow-500">1 unit</span>
              </li>
              <p className="text-[10px] text-yellow-500/70 pt-2 italic leading-relaxed">
                * Note: All units are double occupancy, except the Duplex Villa which accommodates 4.
              </p>
            </ul>
          </div>

          {/* Banquet & Dining Card */}
          <div className="bg-zinc-900/40 border border-yellow-500/10 p-8 rounded hover:border-yellow-500/30 transition duration-300">
            <h3 className="text-2xl font-light text-yellow-500 mb-6 uppercase tracking-wider">Banquet & Dining</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Equipped with 5 elegant banquet and culinary venues to support celebrations and conferences of all sizes.
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="border-b border-white/5 pb-3">
                <span className="font-bold text-yellow-500 block">Big Banquet Hall & Dining Hall</span>
                <span className="text-xs text-gray-400">Hall: 500 seated, 800-900 floating. Attached Dining: 300 seated, 500-600 floating.</span>
              </li>
              <li className="border-b border-white/5 pb-3">
                <span className="font-bold text-yellow-500 block">Mini Banquet Hall</span>
                <span className="text-xs text-gray-400">Capacity: 300 seated, 400-500 floating. Intimate meetings & gatherings.</span>
              </li>
              <li className="border-b border-white/5 pb-3">
                <span className="font-bold text-yellow-500 block">Restaurant & Bar</span>
                <span className="text-xs text-gray-400">Indoor seating capacity for 150 members with multi-cuisine menu options.</span>
              </li>
              <li>
                <span className="font-bold text-yellow-500 block">Sports Bar & Club</span>
                <span className="text-xs text-gray-400">Features Snooker, Table Tennis, Carrom, Chess, Ludo, DJ setup. Perfect as a pub/night club.</span>
              </li>
            </ul>
          </div>

          {/* Recreation & Common Areas Card */}
          <div className="bg-zinc-900/40 border border-yellow-500/10 p-8 rounded hover:border-yellow-500/30 transition duration-300">
            <h3 className="text-2xl font-light text-yellow-500 mb-6 uppercase tracking-wider">Recreation & Outdoors</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Unwind and bond with various leisure spaces, water amenities, and outdoor event venues.
            </p>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="border-b border-white/5 pb-3">
                <span className="font-bold text-yellow-500 block">Luxury Swimming Pool</span>
                <span className="text-xs text-gray-400">Size: 60 ft x 30 ft. Adult pool depth 5 ft. Kids splash pool depth 2.5 ft.</span>
              </li>
              <li className="border-b border-white/5 pb-3">
                <span className="font-bold text-yellow-500 block">Poolside Facilities</span>
                <span className="text-xs text-gray-400">Attached common washrooms, changing rooms, and open showers for convenience.</span>
              </li>
              <li className="border-b border-white/5 pb-3">
                <span className="font-bold text-yellow-500 block">Large Landscaped Lawn</span>
                <span className="text-xs text-gray-400">Spacious multi-utility outdoor lawn for open-air functions, corporate dinners, and team play.</span>
              </li>
              <li>
                <span className="font-bold text-yellow-500 block">Big Outdoor Kitchen</span>
                <span className="text-xs text-gray-400">Fully equipped separate outdoor kitchen for custom large scale catering events.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">

        <div className="mb-16">
          <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
            Welcome
          </p>

          <h2 className="text-5xl font-light">
            Our Story Behind The
            <br />
            Scene
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-8">

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
            <img
              src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800"
              alt=""
              className="w-full h-[300px] md:h-full object-cover"
            />
          </motion.div>

          <div className="md:col-span-7 flex flex-col gap-8">

            <motion.img
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800"
              alt=""
              className="h-[300px] object-cover"
            />

            <motion.img
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800"
              alt=""
              className="h-[300px] object-cover"
            />

          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-24 bg-zinc-950 border-t border-yellow-500/10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
              Gallery
            </p>

            <h2 className="text-5xl font-light">
              Our Gallery
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {galleryData.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden h-64"
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}

          </div>
        </div>
      </section>

    </div>
    <Footer/>
    </>
  );
};

export default About;