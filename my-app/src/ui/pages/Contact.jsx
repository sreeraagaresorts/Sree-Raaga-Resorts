import React, { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Mail, Phone } from "lucide-react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useToast } from "../components/Toast";

import { API_URL } from "../../config/api";

const Contact = () => {
  const toast = useToast();

  const userStr = localStorage.getItem("user");
  let isAdmin = false;
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      if (u && u.role === "admin") {
        isAdmin = true;
      }
    } catch (e) {}
  }

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdmin) {
      toast.error("Administrators cannot submit contact forms in the user interface.");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          subject: "Contact Form Submission",
          message: comment,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      toast.success("Thank you! Your message has been sent successfully.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setComment("");
      setStatus("");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send message. Please try again.");
      setStatus("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white text-[#0d2b4e]  overflow-x-hidden">
        
        {/* HERO BANNER SECTION */}
        <section
          className="relative h-[55vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 text-center px-4 max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-7xl font-light  text-white tracking-wide">
              Contact
            </h1>
            <p className="text-white/80 font-light text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
              Would you like to find out how to get to us? Have a question you want to ask? 
              Tell us you want to say hello? Let us know what you need to know.
            </p>
          </div>
        </section>

        {/* LEAVE US YOUR INFO FORM SECTION */}
        <section className="py-24 px-6 bg-[#fcfaf2] text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#c8a64d]/10 flex items-center justify-center text-[#c8a64d] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[#c8a64d] text-[10px] uppercase tracking-[4px] font-semibold mb-2 block">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-5xl  text-[#0d2b4e] font-light">
                Leave Us Your Info
              </h2>
              <p className="text-gray-500 text-xs md:text-sm max-w-xl leading-relaxed mt-4 font-light">
                Please complete the form below. A guest representative from Sree Raaga Resorts 
                will reach out to you within 24 business hours regarding your inquiry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-5 text-left mt-10">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-sm"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-sm"
                  />
                </div>
              </div>

              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-sm"
                />
              </div>

              <div>
                <textarea
                  rows="6"
                  required
                  placeholder="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-sm resize-none"
                />
              </div>

              {isAdmin ? (
                <div className="w-full py-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-sm text-center">
                  Administrators cannot submit contact forms in the user interface.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-4 bg-[#f5dec2] text-[#0d2b4e] hover:bg-[#ebd0b0] font-semibold uppercase tracking-[2px] text-xs transition cursor-pointer shadow-sm disabled:bg-gray-200"
                >
                  {status === "sending" ? "SENDING MESSAGE..." : "SEND YOUR MESSAGE"}
                </button>
              )}
            </form>
          </div>
        </section>

        {/* LOCATION MAP SECTION */}
        <section className="flex flex-col lg:flex-row items-stretch">
          {/* Map Left */}
          <div className="w-full lg:w-1/2 min-h-[400px] bg-gray-100 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.3402484643033!2d77.74797071110034!3d13.14102921115858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1c251f22dfab%3A0xe54d9c79216d7a42!2sBudigere%20Bypass%20Rd%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1719000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sree Raaga Resorts Location Map"
            />
          </div>

          {/* Info Right */}
          <div className="w-full lg:w-1/2 bg-[#071524] text-white p-12 md:p-20 flex flex-col justify-center space-y-6">
            <div>
              <span className="text-[#c8a64d] text-[10px] tracking-[4px] font-semibold uppercase block mb-2">
                CONTACT
              </span>
              <h2 className="text-4xl  font-light tracking-wide">
                Location
              </h2>
            </div>

            <div className="space-y-4  text-sm font-light text-white/80 leading-relaxed border-t border-white/5 pt-6">
              <p>
                No. 1246, Budigere Bypass Road,<br />
                Devanahalli Hobli,<br />
                Taluk Chamarayapatna,<br />
                Karnataka 562129
              </p>
              <p className=" text-xs">
                <span className="text-[#c8a64d] font-semibold">Email:</span> info@sreeraagaresorts.in<br />
                <span className="text-[#c8a64d] font-semibold">Phone:</span> 089045 61155
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Budigere+Bypass+Road+Devanahalli+Karnataka"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit border border-[#c8a64d] text-[#c8a64d] hover:bg-[#c8a64d] hover:text-[#071524] px-8 py-3 text-xs uppercase tracking-[2px] font-semibold transition mt-6"
            >
              Get Directions
            </a>
          </div>
        </section>

        {/* INSTAGRAM SECTION */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-7xl mx-auto space-y-12">
            <div>
              <span className="text-[#c8a64d] text-[10px] uppercase tracking-[4px] font-semibold mb-2 block">
                INSTAGRAM
              </span>
              <h2 className="text-3xl md:text-5xl  text-[#0d2b4e] font-light">
                Follow us on Instagram
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 px-6">
              {[
                "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=600",
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600",
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
                "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600"
              ].map((imgUrl, i) => (
                <div key={i} className="aspect-square overflow-hidden shadow-sm hover:opacity-90 transition duration-300">
                  <img
                    src={imgUrl}
                    alt={`Resort view ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Contact;