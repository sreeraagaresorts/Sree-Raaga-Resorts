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
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    if (!input) {
      setPhone("");
      return;
    }

    let cleaned = input;
    if (input.startsWith("+91")) {
      cleaned = input.slice(3);
    }
    const digits = cleaned.replace(/\D/g, "").slice(0, 10);

   let formatted = "";

if (digits.length > 0) {
  if (digits.length <= 3) {
    formatted = `+91 ${digits}`;
  } else if (digits.length <= 6) {
    formatted = `+91 ${digits.slice(0, 3)} ${digits.slice(3)}`;
  } else {
    formatted = `+91 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  }
}

setPhone(formatted);
  };

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
          phone,
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
      setPhone("");
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
      <div className=" text-[#0d2b4e]  overflow-x-hidden">
        
        {/* HERO BANNER SECTION */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white select-none">
            <span className="text-white uppercase tracking-[6px] block mb-2 text-[17px]  font-semibold ">
              contact us
            </span>
            <h1 className="text-5xl md:text-[92px] font-medium font-corm leading-tight">
              Get in touch with us today
            </h1>
          </div>
        </section>

        {/* LEAVE US YOUR INFO FORM SECTION */}
        <section className="py-24 px-6 bg-[#fdfeff] text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#c8a64d]/10 flex items-center justify-center text-[#c8a64d] mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[#c8a64d] text-[17px] uppercase tracking-[4px] font-medium mb-2 block">
                GET IN TOUCH
              </span>
              <h2 className="text-3xl md:text-[70px]  text-[#0d2b4e] font-medium font-corm">
                Leave Us Your Info
              </h2>
              <p className="text-gray-500 text-[17px] max-w-xl leading-relaxed mt-4 font-medium">
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
                    className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-[17px]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-[17px]"
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
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-[17px]"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-[17px]"
                />
              </div>

              <div>
                <textarea
                  rows="6"
                  required
                  placeholder="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-5 py-4 text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition text-[17px] resize-none"
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
                  className="w-full py-5 bg-[#f5dec2] text-[#0d2b4e] hover:bg-[#ebd0b0] font-semibold uppercase tracking-[2px] text-[17px] transition cursor-pointer shadow-sm disabled:bg-gray-200"
                >
                  {status === "sending" ? "SENDING MESSAGE..." : "SEND YOUR MESSAGE"}
                </button>
              )}
            </form>
          </div>
        </section>

        {/* LOCATION MAP SECTION */}
        <section className="flex flex-col lg:flex-row items-stretch lg:h-[781px]">
          {/* Map Left */}
          <div className="w-full lg:w-1/2 min-h-[450px] lg:min-h-0 lg:h-full bg-gray-100 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.413190293874!2d77.74043089999999!3d13.1363168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1ba595b168bb%3A0xca9bfc4b61cad568!2sSree%20Raaga%20Resorts!5e0!3m2!1sen!2sin!4v1782304690046!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              className="w-full h-full min-h-[450px] lg:min-h-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Sree Raaga Resorts Location Map"
            />
          </div>

          {/* Info Right */}
          <div className="w-full lg:w-1/2 bg-[#011b3c] text-white p-12 md:p-20 lg:pl-34 flex flex-col justify-center items-start lg:h-full">
            <div className="flex flex-col items-start text-left space-y-6 max-w-md w-full">
              <div>
                <span className="text-[#c8a64d] text-[36px] tracking-[4px] font-medium uppercase block">
                  CONTACT
                </span>
              </div>

              <div className="space-y-4 text-lg md:text-[24px] font-medium text-[#fefdff] leading-relaxed border-t border-white/5 pt-6 w-full">
                <p>
                  No. 1246, Budigere Bypass Road,<br />
                  Devanahalli Hobli, Taluk Chamarayapatna,<br />
                  Karnataka 562129.<br />
                </p>
                <p className="text-lg md:text-[24px]">
                  <span className="text-white font-semibold">Email:</span><span className="text-[#c8a64d] break-all sm:break-normal"> info@sreeraagaresorts.in</span><br />
                  <span className="text-white font-semibold">Phone:</span> <span className="text-[#c8a64d] ">+91 89045 61155</span>
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Budigere+Bypass+Road+Devanahalli+Karnataka"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit border border-[#c8a64d] bg-[#c8a64d] text-[#071524] hover:bg-transparent hover:text-white transition duration px-8 py-4 text-[17px] uppercase tracking-[2px] font-semibold mt-4"
              >
                Get Directions
              </a>
            </div>
          </div>
        </section>

        {/* INSTAGRAM SECTION */}
        <section className="pt-24 bg-[#fdfeff] text-center">
          <div className=" space-y-12">
            <div>
              <span className="text-[#c8a64d] text-[17px] uppercase tracking-[4px] font-semibold mb-2 block">
                INSTAGRAM
              </span>
              <h2 className="text-3xl md:text-[70px] font-corm  text-[#0d2b4e] font-medium">
                Follow us on Instagram
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5  ">
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