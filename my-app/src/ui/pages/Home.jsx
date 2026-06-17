import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


import { API_URL } from "../../config/api";

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
      `${API_URL}/api/rooms`
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

  return `${API_URL}/uploads/${image}`;
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

      {/* WELCOME & POSITIONING SECTION */}
      <section className="py-24 px-6 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4 text-xs font-semibold">
              A Destination for Work, Leisure, Celebrations & Community
            </p>

            <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
              A Premier Destination for Getaways, Celebrations & Grand Events <br />
              <span className="italic text-yellow-500">Near Bangalore</span>
            </h2>

            <p className="text-gray-300 leading-relaxed mb-8 text-base">
              More than a resort, Sree Raaga is a vibrant destination where luxury stays, productive workspaces, memorable celebrations, corporate retreats, and family experiences come together. Whether you're planning a weekend getaway, a wedding, a team outing, or a productive workcation, every experience is designed to inspire connection and create lasting memories.
            </p>

            {/* Core Services Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                "Luxury Stays",
                "Day Outs",
                "Co-Working",
                "Weddings",
                "Corporate Retreats",
                "Grand Events"
              ].map((service, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs tracking-wider uppercase font-medium rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>

            <button className="border border-yellow-500 px-8 py-3 text-sm tracking-widest uppercase hover:bg-yellow-500 hover:text-black transition duration-300">
              Explore Resort
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <img
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=800"
              alt="Resort Poolside"
              className="h-[420px] w-full object-cover mt-12 rounded shadow-2xl border border-white/5"
            />

            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800"
              alt="Luxury Stay Villa"
              className="h-[420px] w-full object-cover rounded shadow-2xl border border-white/5"
            />
          </div>
        </div>
      </section>

      {/* FACILITIES & CAPACITY SECTION */}
      <section className="py-20 px-6 border-t border-yellow-500/10 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4 text-xs">
              World-Class Infrastructure
            </p>
            <h2 className="text-4xl md:text-5xl font-light">
              Spaces Designed for Impact
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "800-Capacity Banquet Hall",
                description: "Perfect for grand weddings, receptions, conferences, and massive celebrations.",
                icon: "🏛️"
              },
              {
                title: "500-Capacity Lawn",
                description: "Vibrant open-air lawn space, ideal for scenic outdoor gatherings, cocktail dinners, and corporate team events.",
                icon: "🌿"
              },
              {
                title: "Mini Banquet Hall",
                description: "Specially tailored for intimate parties, boardroom discussions, private meetings, and community gatherings.",
                icon: "🚪"
              },
              {
                title: "Villas, Pool & Recreation",
                description: "Luxury villas for cozy stays, a sparkling swimming pool, and multiple indoor/outdoor sports & recreational spaces.",
                icon: "🏊"
              }
            ].map((facility, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-yellow-500/10 hover:border-yellow-500/30 p-8 rounded transition duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-5">{facility.icon}</div>
                <h3 className="text-xl text-yellow-500 font-light mb-3">
                  {facility.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">
                  {facility.description}
                </p>
              </div>
            ))}
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

      {/* EXPERIENCES FOR EVERY OCCASION */}
      <section className="py-24 px-6 bg-zinc-950 border-t border-yellow-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4 text-xs font-semibold">
              Customized Packages
            </p>
            <h2 className="text-4xl md:text-5xl font-light">
              Experiences for Every Occasion
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                title: "Stay",
                items: ["Executive Rooms", "Private Villas", "Duplex Villa"],
                icon: "🏨",
                desc: "Comfortable accommodations designed for families, couples, and groups."
              },
              {
                title: "Work",
                items: ["Dedicated Co-Working Space", "Corporate Retreat Facilities", "Meeting & Networking Areas", "High-Speed Connectivity"],
                icon: "💻",
                desc: "A productive, high-speed workspace surrounded by tranquil nature."
              },
              {
                title: "Play",
                items: ["Swimming Pool", "Rain Dance", "Adventure Activities", "Indoor Games", "Outdoor Recreation"],
                icon: "🎮",
                desc: "Exciting recreational activities, water fun, and adventure challenges."
              },
              {
                title: "Celebrate",
                items: ["Grand Banquet Hall", "Landscaped Event Lawn", "Mini Banquet Hall", "Wedding & Reception Venues"],
                icon: "🎉",
                desc: "Spectacular venues for grand weddings and corporate celebrations."
              },
              {
                title: "Dine",
                items: ["Multi-Cuisine Dining", "Coffee Shop", "Bar & Restaurant", "Sports Bar"],
                icon: "🍽️",
                desc: "Delicious culinary experiences crafted by our expert chefs."
              }
            ].map((exp, index) => (
              <div key={index} className="bg-zinc-900 border border-yellow-500/10 hover:border-yellow-500/30 p-6 rounded transition duration-300 flex flex-col justify-between hover:-translate-y-1">
                <div>
                  <div className="text-3xl mb-4">{exp.icon}</div>
                  <h3 className="text-sm text-yellow-500 uppercase tracking-widest font-bold mb-3">{exp.title}</h3>
                  <p className="text-xs text-white/50 mb-5 leading-relaxed">{exp.desc}</p>
                  <ul className="space-y-2">
                    {exp.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-white/80 flex items-center gap-2">
                        <span className="w-1 h-1 bg-yellow-500 rounded-full shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAY OUT PACKAGE SECTION */}
      <section className="py-24 px-6 bg-black relative overflow-hidden border-t border-yellow-500/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7">
              <p className="text-yellow-500 uppercase tracking-[4px] mb-4 text-xs font-semibold">
                Day Out
              </p>
              <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
                A Premium Day-Out & <br />
                <span className="italic text-yellow-500">Staycation Destination</span>
              </h2>
              <p className="text-gray-300 leading-relaxed mb-8">
                Escape the city's hustle and enjoy a perfect blend of relaxation, adventure, dining, and family entertainment at Sree Raaga Resort. Spend a memorable day with family, friends, colleagues, or corporate teams amidst lush surroundings.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-yellow-500 font-medium uppercase tracking-wider text-xs mb-3">Package Includes</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">✓ Welcome Drink</li>
                    <li className="flex items-center gap-2">✓ Delicious Veg & Non-Veg Lunch Buffet</li>
                    <li className="flex items-center gap-2">✓ Evening High Tea</li>
                    <li className="flex items-center gap-2">✓ Access to Resort Amenities</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-yellow-500 font-medium uppercase tracking-wider text-xs mb-3">Activities Included</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center gap-2">✓ Rain Dance & Swimming Pool</li>
                    <li className="flex items-center gap-2">✓ Adventure Activities & Team Challenges</li>
                    <li className="flex items-center gap-2">✓ Indoor & Outdoor Games</li>
                    <li className="flex items-center gap-2">✓ Dedicated Children's Play Area</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-zinc-900 border border-yellow-500/20 p-8 rounded-xl text-center relative">
              <div className="absolute top-0 right-10 translate-y-[-50%] bg-yellow-500 text-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded">
                Best Value
              </div>
              <h3 className="text-xl font-light text-white mb-2">Day Out Package</h3>
              <p className="text-gray-400 text-xs mb-6">Perfect for corporate teams and family gatherings</p>
              
              <div className="mb-8">
                <span className="text-5xl font-bold text-yellow-500">₹1,800</span>
                <span className="text-gray-400 text-xs ml-1">+ 18% GST / person</span>
              </div>

              <Link 
                to="/contact" 
                className="w-full block py-4 bg-yellow-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-yellow-400 transition"
              >
                Book Your Day of Fun & Relaxation
              </Link>
              <p className="text-[10px] text-gray-500 mt-4">Prior reservation is mandatory for day-out packages.</p>
            </div>

          </div>
        </div>
      </section>

      {/* CORPORATE OUTINGS SECTION */}
      <section className="py-24 px-6 bg-zinc-950 border-t border-yellow-500/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800" 
              alt="Corporate Outing" 
              className="w-full h-[400px] object-cover rounded shadow-2xl border border-white/5"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4 text-xs font-semibold">
              Corporate Retreats
            </p>
            <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight">
              Corporate Team Outings & <br />
              <span className="italic text-yellow-500">Team Building</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              Sree Raaga Resort is the ideal destination for organizational growth and rejuvenation. Large event spaces combined with recreational activities make the resort suitable for companies of all sizes.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                "Team Building Activities",
                "Employee Engagement",
                "Annual Day Celebrations",
                "Leadership Retreats",
                "Corporate Picnics",
                "Training Programs"
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full shrink-0"></span>
                  {activity}
                </div>
              ))}
            </div>

            <Link 
              to="/contact" 
              className="inline-block border border-yellow-500 px-8 py-3 uppercase tracking-widest text-xs font-medium hover:bg-yellow-500 hover:text-black transition duration-300"
            >
              Plan Corporate Event
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