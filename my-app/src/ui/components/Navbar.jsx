import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  User, 
  Phone, 
  ChevronDown, 
  Mail, 
  MapPin
} from "lucide-react";

// Custom inline Instagram SVG icon to avoid lucide-react compatibility issue
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
import { gsap } from "gsap";
import { useToast } from "./Toast";

// Custom Magnetic Link component for luxury hover feel
function MagneticLink({ to, children, className = "", onClick, onMouseEnter, onMouseLeave }) {
  const linkRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!linkRef.current) return;
    const { clientX, clientY } = e;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    // Magnetic intensity factor (0.25)
    setCoords({ x: dx * 0.25, y: dy * 0.25 });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
    if (onMouseLeave) onMouseLeave();
  };

  return (
    <Link
      ref={linkRef}
      to={to}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{
        transform: `translate(${coords.x}px, ${coords.y}px)`,
        transition: coords.x === 0 ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
      }}
      className={`relative group inline-block ${className}`}
    >
      {children}
    </Link>
  );
}

const menuLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Rooms", path: "/rooms" },
  { name: "Day Out", path: "/day-out" },
  { name: "Corporate Outings", path: "/corporate" },
  { name: "Amenities", path: "/amenities" },
  { name: "Dine", path: "/dine" },
  { name: "Resort Menu", path: "/menu" },
  { name: "Events", path: "/events" },
  { name: "Contact", path: "/contact" }
];

const Navbar = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const location = useLocation();
  
  // States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [showRoomsSubmenu, setShowRoomsSubmenu] = useState(false);

  // Animation Refs
  const overlayRef = useRef(null);
  const bgImageRef = useRef(null);
  const menuLinksRef = useRef(null);
  const infoPanelRef = useRef(null);
  const tlRef = useRef(null);

  // Sync user status on path change
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Signed out successfully!\nHave a wonderful day.");
    navigate("/");
  };

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu and scroll to top on path change
  useEffect(() => {
    setIsOpen(false);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  // Handle scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  // Track mouse coordinates for custom cursor inside menu
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    if (isOpen) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isOpen]);

  // Setup GSAP Menu Timeline
  useEffect(() => {
    if (!overlayRef.current) return;

    // Initial state setting to prevent flashing
    gsap.set(overlayRef.current, { 
      clipPath: "inset(0% 0% 0% 100%)", 
      visibility: "hidden" 
    });
    gsap.set(bgImageRef.current, { scale: 1.25, x: 30 });
    
    const links = menuLinksRef.current?.querySelectorAll(".menu-link-wrapper") || [];
    gsap.set(links, { y: 65, opacity: 0 });
    
    if (infoPanelRef.current) {
      gsap.set(infoPanelRef.current, { x: 80, opacity: 0 });
    }

    // Build timeline
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power4.inOut" }
    });

    tl.to(overlayRef.current, {
      visibility: "visible",
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.2
    })
    .to(bgImageRef.current, {
      scale: 1,
      x: 0,
      duration: 1.4
    }, "<")
    .to(links, {
      y: 0,
      opacity: 1,
      stagger: 0.08,
      duration: 0.9,
      ease: "power3.out"
    }, "-=0.6")
    .to(infoPanelRef.current, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=0.7");

    tlRef.current = tl;
  }, []);

  // Trigger animations on state change
  useEffect(() => {
    if (isOpen) {
      tlRef.current?.play();
    } else {
      tlRef.current?.reverse();
    }
  }, [isOpen]);

  return (
    <>
      {/* ================= DESKTOP & MOBILE HEADER ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-6 lg:py-8 transition-all duration-500 border-b border-white/35 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-md py-4 lg:py-5 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className=" mx-[20px] px-6 flex items-center justify-between">
          
          {/* LEFT PANEL: Menu Toggle & Phone Number */}
          <div className="flex items-center gap-10 flex-1">
            {/* Custom Morphing Menu Toggle */}
            <div 
              className="flex items-center gap-4 cursor-pointer group z-[60]"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="relative w-7 h-5 flex flex-col justify-between">
                <span className={`w-7 h-[1.5px] bg-white transition-all duration-500 origin-center ${isOpen ? "rotate-45 translate-y-[9px]" : ""}`} />
                <span className={`w-5 h-[1.5px] bg-white transition-opacity duration-300 ${isOpen ? "opacity-0" : "group-hover:w-7"}`} />
                <span className={`w-7 h-[1.5px] bg-white transition-all duration-500 origin-center ${isOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
              </div>
              <span className="text-xs lg:text-sm uppercase tracking-[5px] font-semibold text-white select-none font-sans">
                {isOpen ? "Close" : "Menu"}
              </span>
            </div>

            {/* Telephone Line */}
            <div className={`hidden md:flex items-center gap-2.5 text-white/80 hover:text-white transition-all duration-500 ${isOpen ? "opacity-0 pointer-events-none blur-sm" : ""}`}>
              <Phone size={14} className="text-[#c8a64d] shrink-0" />
              <span className="text-xs lg:text-sm tracking-widest font-semibold font-sans">089045 61155</span>
            </div>
          </div>

          {/* CENTER PANEL: Brand Logo */}
          <Link 
            to="/" 
            className={`text-center transition-all duration-500 flex flex-col items-center justify-center flex-1 ${
              isOpen ? "opacity-0 pointer-events-none blur-sm scale-95" : ""
            }`}
          >
            <h1 className="text-3xl lg:text-4xl font-serif text-[#c8a64d] tracking-wide leading-none">
              Sree Raagasss
            </h1>
            <span className="text-[10px] lg:text-[11px] tracking-[6px] uppercase text-white font-sans mt-1">
              Resorts
            </span>
          </Link>

          {/* RIGHT PANEL: Lang Dropdown, Login/Profile, Book Button */}
          <div className={`flex items-center justify-end gap-8 flex-1 transition-all duration-500 ${
            isOpen ? "opacity-0 pointer-events-none blur-sm scale-95" : ""
          }`}>
            
  

            {/* Login & Profile Dashboard */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link
                    to="/dashboard/profile"
                    className="w-10 h-10 rounded-full border border-[#c8a64d] flex items-center justify-center text-[#c8a64d] hover:bg-[#c8a64d] hover:text-black transition duration-300"
                    title={user.full_name}
                  >
                    <User size={15} />
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-[#c8a64d] text-white uppercase tracking-widest text-xs lg:text-sm font-semibold"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Booking Call to Action */}
            <Link
              to="/rooms"
              className="hidden md:inline-block px-6 py-3  text-white hover:bg-[#b08e3b] transition duration-300 rounded uppercase tracking-widest text-xs lg:text-sm font-bold"
            >
              Book Your Stay
            </Link>
          </div>

        </div>
      </header>

      {/* ================= CINEMATIC OVERLAY MENU ================= */}
      <div 
        ref={overlayRef} 
        className="fixed inset-0 bg-[#060c16]/95 backdrop-blur-2xl z-40 flex flex-col lg:flex-row overflow-hidden"
      >
        
        {/* Parallax Background Image */}
        <div 
          ref={bgImageRef}
          className="absolute left-0 top-0 w-full lg:w-[60%] h-full bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2000')",
            opacity: 0.5
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute left-0 top-0 w-full lg:w-[60%] h-full bg-black/60 pointer-events-none" />

        {/* Custom Follower Cursor */}
        {isOpen && (
          <div 
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              transform: `translate(-50%, -50%) scale(${cursorHovered ? 2.8 : 1})`,
              transition: "transform 0.15s ease-out"
            }}
            className={`fixed pointer-events-none z-[100] w-6 h-6 rounded-full border border-[#c8a64d] mix-blend-difference hidden md:block ${
              cursorHovered ? "bg-white/10" : ""
            }`}
          />
        )}

        {/* LEFT COLUMN: Large Serif Menu Links */}
        <div className="relative flex-1 lg:flex-[0_0_60%] flex flex-col justify-center px-6 md:px-24 py-32 z-10 overflow-y-auto max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div ref={menuLinksRef} className="flex flex-col mt-24 gap-5 md:gap-7">
            {menuLinks.map((link, idx) => {
              if (link.name === "Rooms") {
                return (
                  <div 
                    key={idx} 
                    className="relative overflow-visible py-1 flex flex-col lg:flex-row lg:items-center gap-4 group/rooms-item"
                    onMouseEnter={() => {
                      setCursorHovered(true);
                      setShowRoomsSubmenu(true);
                    }}
                    onMouseLeave={() => {
                      setCursorHovered(false);
                      setShowRoomsSubmenu(false);
                    }}
                  >
                    <div className="menu-link-wrapper flex items-center">
                      <MagneticLink 
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className="text-3xl md:text-3xl font-light uppercase tracking-[8px] hover:text-[#c8a64d] text-white transition-colors duration-300 font-serif"
                      >
                        {link.name}
                        <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#c8a64d] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                      </MagneticLink>
                      
                      <ChevronDown 
                        size={18} 
                        className={`text-white/60 ml-2 transform lg:-rotate-90 transition-transform duration-300 group-hover/rooms-item:text-[#c8a64d] ${
                          showRoomsSubmenu ? "rotate-0 text-[#c8a64d]" : ""
                        }`} 
                      />
                    </div>

                    {/* Dropright side submenu */}
                    <div 
                      className={`lg:absolute lg:left-1/3 lg:top-1/2 lg:-translate-y-1/2 flex flex-col gap-3 pl-6 lg:pl-10 lg:border-l border-white/10 lg:ml-4 overflow-hidden transition-all duration-500 ease-in-out ${
                        showRoomsSubmenu 
                          ? "max-h-[250px] opacity-100 visible translate-x-0" 
                          : "max-h-0 lg:max-h-none opacity-0 invisible lg:-translate-x-4 lg:pointer-events-none"
                      }`}
                    >
                      <Link 
                        to="/rooms?category=executive-rooms"
                        onClick={() => setIsOpen(false)}
                        className="text-sm uppercase tracking-[4px] text-white/70 hover:text-[#c8a64d] transition-colors duration-300 font-serif py-1 whitespace-nowrap"
                      >
                        • Executive Rooms
                      </Link>
                      <Link 
                        to="/rooms?category=private-villas"
                        onClick={() => setIsOpen(false)}
                        className="text-sm uppercase tracking-[4px] text-white/70 hover:text-[#c8a64d] transition-colors duration-300 font-serif py-1 whitespace-nowrap"
                      >
                        • Private Villas
                      </Link>
                      <Link 
                        to="/rooms?category=duplex-villa"
                        onClick={() => setIsOpen(false)}
                        className="text-sm uppercase tracking-[4px] text-white/70 hover:text-[#c8a64d] transition-colors duration-300 font-serif py-1 whitespace-nowrap"
                      >
                        • Duplex Villa
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="overflow-hidden py-1">
                  <span className="menu-link-wrapper block">
                    <MagneticLink 
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      onMouseEnter={() => setCursorHovered(true)}
                      onMouseLeave={() => setCursorHovered(false)}
                      className="text-3xl md:text-3xl font-light uppercase tracking-[8px] hover:text-[#c8a64d] text-white transition-colors duration-300 font-serif"
                    >
                      {link.name}
                      {/* Animated Underline */}
                      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#c8a64d] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
                    </MagneticLink>
                  </span>
                </div>
              );
            })}

            {/* Mobile Only Quick Actions */}
            <div className="flex flex-col gap-4 mt-8 md:hidden border-t border-white/10 pt-8 max-w-xs w-full">
              <Link 
                to="/rooms"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-[#c8a64d] text-white text-center rounded uppercase tracking-widest text-xs font-bold font-sans hover:bg-[#b08e3b] transition"
              >
                Book Your Stay
              </Link>
              {user ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="px-6 py-3 border border-red-500/35 text-red-400 text-center rounded uppercase tracking-widest text-xs font-bold font-sans hover:bg-red-500/10 transition cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 border border-white/20 text-white text-center rounded uppercase tracking-widest text-xs font-bold font-sans hover:bg-white/10 transition"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Luxury Beige Panel (Resort Info) */}
        <div className="hidden lg:flex lg:w-[40%] bg-[#f5dec2] text-[#0d2b4e] flex-col justify-center items-center px-12 py-16 relative z-10 overflow-y-auto">
          <div 
            ref={infoPanelRef}
            className="flex flex-col items-center text-center space-y-10 max-w-sm w-full"
          >
            {/* Top Logo / Brand */}
            <div className="flex flex-col items-center font-serif">
              <span className="text-[#0d2b4e] uppercase tracking-[6px] text-xs font-semibold block">
                Sree Raaga
              </span>
              <span className="text-[#c8a64d] uppercase tracking-[4px] text-[9px] font-bold mt-1">
                Luxury Resorts
              </span>
            </div>

            {/* Elegant Tagline / Heading */}
            <h2 className="text-3xl font-light italic font-serif text-[#0d2b4e] leading-tight">
              Resort & Spa Sree Raaga
            </h2>

            {/* Divider line (subtle) */}
            <div className="w-12 h-[1px] bg-[#0d2b4e]/20" />

            {/* Info Sections */}
            <div className="space-y-8 w-full font-serif">
              {/* Location */}
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-[3px] font-bold text-[#0d2b4e] mb-2">
                  Location
                </span>
                <span className="text-xs text-gray-700 font-light leading-relaxed">
                  Devanahalli Hobli, Taluk Chamarayapatna
                </span>
                <span className="text-xs text-gray-700 font-light leading-relaxed mt-0.5">
                  Karnataka 562129, India
                </span>
              </div>

              {/* Phone Support */}
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-[3px] font-bold text-[#0d2b4e] mb-2">
                  Phone Support
                </span>
                <span className="text-xs text-gray-700 font-light">
                  089045 61155
                </span>
                <span className="text-xs text-gray-700 font-light mt-0.5">
                  info@sreeraagaresorts.in
                </span>
              </div>

              {/* Connect With Us */}
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-[3px] font-bold text-[#0d2b4e] mb-2">
                  Connect With Us
                </span>
                <span className="text-xs text-gray-700 font-light">
                  089045 61155
                </span>
                {/* Social icons */}
                <div className="flex gap-4 mt-3">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#0d2b4e]/60 hover:text-[#c8a64d] transition"
                  >
                    <InstagramIcon size={18} />
                  </a>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </>
  );
};

export default Navbar;