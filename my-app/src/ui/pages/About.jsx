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
              { num: "99+", label: "Booking Month" },
              { num: "130+", label: "Visitors Daily" },
              { num: "86+", label: "Positive Feedback" },
              { num: "23+", label: "Awards & Honors" },
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