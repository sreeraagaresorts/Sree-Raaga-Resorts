import React, { useState,useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Mail, Phone } from "lucide-react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useToast } from "../components/Toast";
import { Helmet } from "react-helmet";
import { API_URL } from "../../config/api";
import AOS from "aos";
import "aos/dist/aos.css";

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
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true,     // Animate only once
      offset: 100,    // Trigger animation 100px before element
    });
  }, []);

  return (
    <>
    {/* 2. ADD HELMET COMPONENT HERE */}
     <Helmet>
  <title>Contact Us | Sree Raaga Resorts</title>

  <meta
    name="description"
    content="Get in touch with Sree Raaga Resorts for bookings, inquiries, and event reservations. Contact our team to plan your perfect stay, family getaway, corporate outing, or special celebration."
  />

  <meta
    name="keywords"
    content="Contact Sree Raaga Resorts, resort booking, resort contact, luxury resort, resort reservations, event booking, family resort, corporate outing, weekend getaway"
  />

  {/* Open Graph Tags */}
  <meta
    property="og:title"
    content="Contact Us | Sree Raaga Resorts"
  />

  <meta
    property="og:description"
    content="Have questions or want to book your stay? Contact Sree Raaga Resorts for reservations, events, day-out packages, and personalized assistance."
  />

  <meta property="og:type" content="website" />
</Helmet>
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
            <span className="text-white uppercase tracking-[6px] block mb-2 text-[17px]  font-semibold " data-aos="fade-up" >
              contact us
            </span>
            <h1 className="text-5xl md:text-[92px] font-medium font-corm leading-tight" data-aos="fade-up" data-aos-delay="100">
              Get in touch with us today
            </h1>
          </div>
        </section>

        {/* LEAVE US YOUR INFO FORM SECTION */}
        <section className="py-24 px-6 bg-[#fdfeff] text-center" data-aos="fade-up" data-aos-delay="200">
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
                  className="w-full py-5 bg-[#c8a64d] text-[#0d2b4e] hover:bg-[#eec661]  font-semibold uppercase tracking-[2px] text-[17px] transition cursor-pointer shadow-sm  disabled:bg-gray-200"
                >
                  {status === "sending" ? "SENDING MESSAGE..." : "SEND YOUR MESSAGE"}
                </button>
              )}
            </form>
          </div>
        </section>

        {/* LOCATION MAP SECTION */}
        <section className="flex flex-col lg:flex-row items-stretch lg:h-[781px]" data-aos="fade-in" data-aos-delay="300">
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
            <div className="flex flex-col items-start text-left space-y-6 max-w-lg w-full">
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
               <span className="text-white font-semibold">Phone:</span>{" "}
<a
  href="tel:+918904561155"
  className="text-[#c8a64d] hover:text-white"
>
  +91 890 456 1155
</a>

<span className="mx-2 text-[#c8a64d]">|</span>

<a
  href="tel:+918904381155"
  className="text-[#c8a64d] hover:text-white"
>
  +91 890 438 1155
</a>
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

     {/* ================= FOLLOW US ON INSTAGRAM ================= */}
      <section className="bg-[#fdfeff] text-[#0d2b4e]">
        <div className="py-8 md:py-8 md:py-12 text-center mb-12">
          <span className="text-[#c8a64d] uppercase tracking-[4px] text-[17px] font-jost font-semibold block mb-2">
            Social Media
          </span>
          <h2 className="text-[33px] md:text-6xl font-medium font-corm flex items-center justify-center gap-2">
            Follow us on Instagram 
            {/* <Instagram size={26} className="text-[#c8a64d] mt-2" /> */}
          </h2>
        </div>

        {/* 
          Wrapper Changes: 
          - Mobile: flex, overflow-x-auto, snap-x (for swiping), hidden scrollbars
          - Desktop (sm+): switch to grid, remove overflow and snapping 
        */}
        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 overflow-x-auto snap-x snap-mandatory sm:overflow-visible sm:snap-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {[
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600"
          ].map((img, i) => (
            <div 
              key={i} 
              /* 
                Item Changes:
                - Mobile: flex-none, fixed width (75% of screen), snap to center
                - Desktop (sm+): auto width (fills grid cell), disable snapping
              */
              className="flex-none w-[100%] sm:w-auto snap-center sm:snap-align-none relative aspect-square overflow-hidden group shadow-sm"
            >
              <img 
                src={img} 
                alt={`Instagram Showcase ${i}`} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-[#0d2b4e]/60 opacity-0 group-hover:opacity-100 transition duration-300 z-10 flex items-center justify-center">
                {/* <Instagram size={28} className="text-white" /> */}
              </div>
            </div>
          ))}
        </div>
      </section>


      </div>
      <Footer />
    </>
  );
};

export default Contact;