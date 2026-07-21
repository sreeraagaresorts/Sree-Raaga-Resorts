import React, { useState,useEffect } from "react";
import { motion } from "motion/react";
import { MapPin, Mail, Phone } from "lucide-react";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InstagramFeed from "../components/InstagramFeed";
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


  function InstagramIcon({ size = 20, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
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
              "url('./ctbr.avif')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/60"></div>
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
                  Karnataka - 562129.<br />
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

                {/* Social Media Links - All in exact same line */}
                <div className=" w-full flex items-center flex-wrap sm:flex-nowrap gap-3 sm:gap-4">
                  <span className="text-white font-semibold text-lg md:text-[24px] flex-shrink-0">
                    Social Media:
                  </span>
                  <div className="flex items-center gap-3 sm:gap-4 flex-nowrap">
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/sreeraagaresorts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-13 h-13 md:w-14 md:h-14 rounded-full border-2 border-[#c8a64d] bg-white/5 flex items-center justify-center text-[#c8a64d] hover:bg-[#c8a64d] hover:text-[#011b3c] hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0"
                      title="Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>

                    {/* YouTube */}
                    <a
                      href="https://www.youtube.com/@sreeraaga.resorts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-13 h-13 md:w-14 md:h-14 rounded-full border-2 border-[#c8a64d] bg-white/5 flex items-center justify-center text-[#c8a64d] hover:bg-[#c8a64d] hover:text-[#011b3c] hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0"
                      title="YouTube"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                        <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
                      </svg>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/sreeraagaresorts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-13 h-13 md:w-14 md:h-14 rounded-full border-2 border-[#c8a64d] bg-white/5 flex items-center justify-center text-[#c8a64d] hover:bg-[#c8a64d] hover:text-[#011b3c] hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0"
                      title="Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/918904561155"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-13 h-13 md:w-14 md:h-14 rounded-full border-2 border-[#c8a64d] bg-white/5 flex items-center justify-center text-[#c8a64d] hover:bg-[#c8a64d] hover:text-[#011b3c] hover:scale-110 transition-all duration-300 shadow-md flex-shrink-0"
                      title="WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1zm0 0a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a4 4 0 0 1-4-4V9" />
                      </svg>
                    </a>
                  </div>
                </div>
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
      <InstagramFeed />


      </div>
      <Footer />
    </>
  );
};

export default Contact;