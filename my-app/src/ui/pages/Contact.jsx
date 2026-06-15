import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Mail, Phone } from "lucide-react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setStatus("sending");

    setTimeout(() => {
      setStatus("success");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setStatus("");
      }, 3000);
    }, 1500);
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
            "url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-light mb-4">
            Contact Us
          </h1>

          <p className="text-yellow-500 uppercase tracking-[4px]">
            Home / Contact
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
              Get In Touch
            </p>

            <h2 className="text-5xl font-light mb-8">
              Contact Us
            </h2>

            <p className="text-gray-400 leading-relaxed mb-10">
              We're here to assist you with reservations, events,
              special requests, and any questions about your stay
              at Sree Raaga Resorts.
            </p>

            {status === "success" && (
              <div className="bg-green-500/10 border border-green-500 text-green-400 p-4 mb-6">
                Thank you! Your message has been sent successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid md:grid-cols-2 gap-6">

                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="bg-transparent border border-yellow-500/20 p-4 outline-none focus:border-yellow-500"
                />

                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="bg-transparent border border-yellow-500/20 p-4 outline-none focus:border-yellow-500"
                />

              </div>

              <input
                type="text"
                placeholder="Subject"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subject: e.target.value,
                  })
                }
                className="w-full bg-transparent border border-yellow-500/20 p-4 outline-none focus:border-yellow-500"
              />

              <textarea
                rows="6"
                placeholder="Message"
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                className="w-full bg-transparent border border-yellow-500/20 p-4 outline-none focus:border-yellow-500 resize-none"
              />

              <button
                type="submit"
                className="px-10 py-4 bg-yellow-500 text-black hover:bg-yellow-400 transition"
              >
                {status === "sending"
                  ? "Sending..."
                  : "Send Message"}
              </button>

            </form>
          </motion.div>

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative min-h-[500px] overflow-hidden border border-yellow-500/20">

              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/60"></div>

              <div className="absolute inset-0 flex items-center justify-center">

                <div className="bg-black/80 backdrop-blur border border-yellow-500/30 p-8 text-center">

                  <MapPin
                    size={35}
                    className="mx-auto mb-4 text-yellow-500"
                  />

                  <h3 className="text-2xl mb-4">
                    Resort Location
                  </h3>

                  <p className="text-gray-400">
                    123 Luxury Avenue
                    <br />
                    Forest Valley, Kerala
                    <br />
                    India
                  </p>

                </div>

              </div>

            </div>
          </motion.div>

        </div>

      </section>

      {/* Contact Cards */}
      <section className="py-24 bg-zinc-950 border-t border-yellow-500/10">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-16">
            <p className="text-yellow-500 uppercase tracking-[4px] mb-4">
              Visit Us
            </p>

            <h2 className="text-5xl font-light">
              Nearby Locations
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            {[
              {
                city: "Kochi Airport",
                distance: "45 KM",
                email: "kochi@sreeraaga.com",
              },
              {
                city: "Trivandrum",
                distance: "120 KM",
                email: "tvm@sreeraaga.com",
              },
              {
                city: "Munnar",
                distance: "60 KM",
                email: "munnar@sreeraaga.com",
              },
              {
                city: "Alleppey",
                distance: "85 KM",
                email: "alpy@sreeraaga.com",
              },
            ].map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                }}
                className="border border-yellow-500/10 p-8 text-center hover:border-yellow-500/40 transition"
              >
                <div className="w-14 h-14 rounded-full border border-yellow-500 flex items-center justify-center mx-auto mb-5">
                  <MapPin
                    size={20}
                    className="text-yellow-500"
                  />
                </div>

                <h3 className="text-xl text-yellow-500 mb-3">
                  {location.city}
                </h3>

                <p className="text-gray-400 mb-3">
                  {location.distance} from resort
                </p>

                <a
                  href={`mailto:${location.email}`}
                  className="text-sm text-gray-500 hover:text-yellow-500"
                >
                  {location.email}
                </a>
              </motion.div>
            ))}

          </div>

        </div>

      </section>

      {/* Contact Info */}
      <section className="py-20 border-t border-yellow-500/10">

        <div className="max-w-5xl mx-auto px-6">

          <div className="grid md:grid-cols-3 gap-10 text-center">

            <div>
              <Phone
                size={30}
                className="mx-auto mb-4 text-yellow-500"
              />
              <h3 className="mb-2">Call Us</h3>
              <p className="text-gray-400">
                +91 9876543210
              </p>
            </div>

            <div>
              <Mail
                size={30}
                className="mx-auto mb-4 text-yellow-500"
              />
              <h3 className="mb-2">Email Us</h3>
              <p className="text-gray-400">
                info@sreeraaga.com
              </p>
            </div>

            <div>
              <MapPin
                size={30}
                className="mx-auto mb-4 text-yellow-500"
              />
              <h3 className="mb-2">Address</h3>
              <p className="text-gray-400">
                Forest Valley, Kerala, India
              </p>
            </div>

          </div>

        </div>

      </section>

    </div>
        <Footer/>
    </>
  );
};

export default Contact;