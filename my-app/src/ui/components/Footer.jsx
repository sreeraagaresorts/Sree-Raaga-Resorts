import React from "react";
import { Link } from "react-router-dom";
import { ArrowUp, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

// Reusable custom SVGs for social media icons to avoid lucide-react version compatibility issues
function FacebookIcon({ size = 16, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon({ size = 16, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
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

function LinkedinIcon({ size = 16, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u && u.role === "admin") {
          alert("Administrators cannot subscribe to the newsletter in the user interface.");
          return;
        }
      } catch (err) {}
    }
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <footer className="bg-[#011b3c]  relative border-t border-white/5 text-white ">
      
      {/* Scroll Top Button */}
      {/* <div className="absolute top-0 right-10 -translate-y-1/2">
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "#c8a64d", color: "#030e21", borderColor: "#c8a64d" }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full border border-white/10 bg-[#011b3c]text-white/70 flex items-center justify-center cursor-pointer transition-all duration-300"
        >
          <ArrowUp size={18} />
        </motion.button>
      </div> */}

      <div className="max-w-[180vh] mx-auto px-6 md:py-12 py-8 md:py-0 md:pt-44 md:pb-22">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* About Us Column */}
          <div>
      <img
    src="/logo.png" /* <-- Replace this with your actual logo path */
    alt="Sree Raaga Resorts"
    className="h-[55px] mb-5 md:h-20 lg:h-25 w-auto object-contain" 
  />
            <p className="text-white text-[16px] leading-relaxed max-w-xs">
              Sree Raaga Resorts offers a sanctuary of peace, where luxury meets nature. Escape the city's hustle and enjoy a perfect blend of stays, corporate events, weddings, and family recreation.
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg md:text-4xl font-bold font-corm tracking-wide mb-6">
              Contact
            </h3>
            <div className="space-y-4 text-white text-[16px] leading-relaxed">
              <p>
                No. 1246, Budigere Bypass Road,
                <br />
                Devanahalli Hobli, Taluk Chamarayapatna,
                <br />
                Karnataka 562129
              </p>
              
              <a
                href="mailto:info@sreeraagaresorts.in"
                className="block hover:text-[#c8a64d] transition duration-300"
              >
                info@sreeraagaresorts.in
              </a>

             <div className="flex flex-wrap gap-2">
               <a
                href="tel:918904561155"
                className="block hover:text-[#c8a64d] transition duration-300"
              >
                +91 89045 61155 | 
              </a>
                 <a
                href="tel:918904381155"
                className="block hover:text-[#c8a64d] transition duration-300"
              >
               +91 8904381155
              </a>
             </div>
            </div>
          </div>

          {/* Double column Links */}
          <div>
            <h3 className="text-lg md:text-3xl font-bold font-corm tracking-wide mb-6">
              Links
            </h3>
            
            <div className="grid grid-cols-2 gap-4  text-[16px]">
           <div>
               <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-whitehover:text-[#c8a64d] transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/rooms" className="text-whitehover:text-[#c8a64d] transition">
                    Our Rooms
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="text-whitehover:text-[#c8a64d] transition">
                    Day Out
                  </Link>
                </li>
                    <li>
                  <Link to="/faq" className="text-whitehover:text-[#c8a64d] transition">
                    FAQ
                  </Link>
                </li>
              </ul> 
           </div>
           <div>
            <ul className="space-y-3">
              <li>
                  <Link to="/events" className="text-whitehover:text-[#c8a64d] transition">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/menu" className="text-whitehover:text-[#c8a64d] transition">
                    Restaurant & Bar
                  </Link>
                </li>
                
                <li>
                  <Link to="/contact" className="text-whitehover:text-[#c8a64d] transition">
                    Contact
                  </Link>
                </li>
            </ul>
           </div>

              
             
            </div>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-lg md:text-3xl font-bold font-corm tracking-wide mb-6">
              Legal Pages
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-white hover:text-[#c8a64d] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-white hover:text-[#c8a64d] transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/cancellation-refund" className="text-white hover:text-[#c8a64d] transition">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping-delivery" className="text-white hover:text-[#c8a64d] transition">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link to="/booking-terms" className="text-white hover:text-[#c8a64d] transition">
                  Booking Terms / House Rules
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-white hover:text-[#c8a64d] transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-white hover:text-[#c8a64d] transition">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/user-account-policy" className="text-white hover:text-[#c8a64d] transition">
                  User Account Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

     

      </div>
         {/* Bottom Bar: Copyright, Centered Logo, and Socials */}
        <div className="border-t border-white/5 py-4 md:py-8 flex flex-col md:flex-row justify-center items-center gap-6">
          
      

          {/* Center: Brand Typography */}
          <div className="text-center order-1 md:order-2 flex flex-col items-center">
              {/* Left: Copyright */}
          <div className="text-gray-300 text-[17px] tracking-wider  order-2 md:order-1">
            {/* Copyright ©  by Sree Raaga Resorts */}
            Copyright © {new Date().getFullYear()}. All Right Reserved. Designed By <a className="font-bold text-white/80 hover:text-white/30 transition duration-300" href="https://wa.link/jpp1mq">NEXA DZINE</a>
          </div>
          </div>

         

        </div>
    </footer>
  );
};

export default Footer;