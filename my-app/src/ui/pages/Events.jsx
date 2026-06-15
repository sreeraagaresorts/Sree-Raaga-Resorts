import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch events");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000/uploads/${image}`;
  };
  return (
   <>
     <Navbar/>
    <div className="bg-black text-white">

      {/* Hero Section */}
      <section
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            Events & Weddings
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Home / Events
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
            Our Events
          </p>

          <h2 className="text-5xl font-light">
            Unforgettable Moments
          </h2>
        </div>

        {loading && (
          <div className="text-center text-yellow-500 py-12 text-xl">
            Loading events...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-12 text-xl">
            Error: {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="text-center text-white/50 py-12 text-xl">
            No events scheduled at the moment.
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              className="group border border-yellow-500/10 bg-zinc-950 overflow-hidden cursor-pointer"
            >
              <div className="relative overflow-hidden aspect-[4/3]">

                <img
                  src={getImageUrl(event.image)}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-1000"
                />

                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur px-3 py-2 border border-yellow-500/30">
                  <span className="text-yellow-500 text-[10px] uppercase tracking-widest">
                    {event.category}
                  </span>
                </div>
              </div>

              <div className="p-8">

                <div className="text-yellow-500 text-xs uppercase tracking-widest mb-3">
                  {event.event_date || event.date}
                </div>

                <h3 className="text-2xl mb-4 group-hover:text-yellow-500 transition">
                  {event.name}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6">
                  {event.description}
                </p>

                <div className="flex items-center gap-3 text-yellow-500 uppercase tracking-widest text-xs">
                  View Setup

                  <span className="w-8 h-[1px] bg-yellow-500 group-hover:w-12 transition-all duration-300"></span>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-zinc-950 border-t border-yellow-500/10">

        <div className="max-w-4xl mx-auto text-center px-6">

          <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
            Plan Your Event
          </p>

          <h2 className="text-5xl font-light mb-8">
            Let's Create Something Special
          </h2>

          <p className="text-gray-400 mb-10">
            From intimate gatherings to grand celebrations, our team is ready
            to make your event truly unforgettable.
          </p>

          <button className="px-10 py-4 bg-yellow-500 text-black hover:bg-yellow-400 transition">
            Enquire Now
          </button>

        </div>

      </section>

    </div>
        <Footer/>
   </>
  );
};

export default Events;