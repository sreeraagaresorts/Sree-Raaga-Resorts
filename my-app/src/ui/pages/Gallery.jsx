import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";

const galleryItems = [
  {
    id: 1,
    type: "photo",
    src: "/a2.avif",
    category: "Villas & Suites",
    title: "Premium Villa Suite",
    description: "Experience the serenity of Sree Raaga Resorts in our modern, rustic villas."
  },
  {
    id: 2,
    type: "video",
    src: "/IMG_3557.MP4",
    thumbnail: "/cd.avif",
    category: "Resort Tour",
    title: "Resort Video Experience",
    description: "A panoramic cinematic tour of the lush green resort properties."
  },
  {
    id: 3,
    type: "photo",
    src: "/a3.avif",
    category: "Lush Outdoors",
    title: "Scenic Pathways",
    description: "Quiet morning paths perfect for bird watching and walking."
  },
  {
    id: 4,
    type: "photo",
    src: "/ctbr.avif",
    category: "Villas & Suites",
    title: "Luxury Cottage Bedroom",
    description: "Lavish wood interiors matching heritage-style architecture."
  },
  // {
  //   id: 5,
  //   type: "video",
  //   src: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-with-swimming-pool-41662-large.mp4",
  //   thumbnail: "/outdoor.jpg",
  //   category: "Pool & Spa",
  //   title: "Poolside Oasis",
  //   description: "Relax by our crystal-clear waters in standard lounge configurations."
  // },
  {
    id: 6,
    type: "photo",
    src: "/indoor.jpg",
    category: "Dining",
    title: "Signature Restaurant Setup",
    description: "Cozy settings for breakfast buffet and culinary plates."
  },
  {
    id: 7,
    type: "photo",
    src: "/play.jpg",
    category: "Activities",
    title: "Children's Playground",
    description: "Safe and delightful outdoor recreation area for kids."
  },
  {
    id: 8,
    type: "photo",
    src: "/rain.jpg",
    category: "Activities",
    title: "Rain Dance Arena",
    description: "Enjoy a splashing good time with high-quality beats."
  },
  {
    id: 9,
    type: "video",
    src: "https://assets.mixkit.co/videos/preview/mixkit-dramatic-drone-shot-of-a-luxury-hotel-41664-large.mp4",
    thumbnail: "/a3.avif",
    category: "Lush Outdoors",
    title: "Aerial Resort Tour",
    description: "High-flying drone views showcasing our pristine property boundaries."
  },
  {
    id: 10,
    type: "photo",
    src: "/adv1.jpg",
    category: "Activities",
    title: "Adventure Rope Courses",
    description: "Challenging rope bridges for family and corporate team building."
  },
  {
    id: 11,
    type: "photo",
    src: "/green.jpg",
    category: "Lush Outdoors",
    title: "Manicured Gardens",
    description: "Meticulously maintained green fields under the evening sun."
  },
  {
    id: 12,
    type: "photo",
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
    category: "Dining",
    title: "Live Barbeque & Grills",
    description: "Fresh meats and vegetarian skewers cooked to your liking."
  },
  {
    id: 13,
    type: "photo",
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800",
    category: "Events & Celebrations",
    title: "Outdoor Lantern Evening",
    description: "Exquisite string lights transforming the lawn into a banquet site."
  },
  {
    id: 14,
    type: "photo",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
    category: "Events & Celebrations",
    title: "Lawn Wedding Mandap",
    description: "Celebrate grand milestones under traditional floral decorations."
  },
  {
    id: 15,
    type: "photo",
    src: "/train.avif",
    category: "Activities",
    title: "Resort Toy Train",
    description: "Fun rides around the garden pathways for guests of all ages."
  },
  {
    id: 16,
    type: "photo",
    src: "/workspace.jpg",
    category: "Events & Meetings",
    title: "Grand Conference Hall",
    description: "Fully equipped indoor halls hosting board meetings and seminars."
  }
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState({ isOpen: false, itemIndex: 0 });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  // Filter items
  const filteredItems = galleryItems.filter((item) => {
    if (activeFilter === "photos") return item.type === "photo";
    if (activeFilter === "videos") return item.type === "video";
    return true; // "all"
  });

  const openLightbox = (index) => {
    setLightbox({
      isOpen: true,
      itemIndex: index,
    });
  };

  const closeLightbox = () => {
    setLightbox({
      ...lightbox,
      isOpen: false,
    });
  };

  const nextItem = () => {
    setLightbox((prev) => ({
      ...prev,
      itemIndex: (prev.itemIndex + 1) % filteredItems.length,
    }));
  };

  const prevItem = () => {
    setLightbox((prev) => ({
      ...prev,
      itemIndex: (prev.itemIndex - 1 + filteredItems.length) % filteredItems.length,
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightbox.isOpen) return;
      if (e.key === "ArrowRight") nextItem();
      if (e.key === "ArrowLeft") prevItem();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen, lightbox.itemIndex, filteredItems.length]);

  const currentItem = lightbox.isOpen ? filteredItems[lightbox.itemIndex] : null;

  return (
    <>
      <Helmet>
        <title>Resort Gallery | Sree Raaga Resorts</title>
        <meta
          name="description"
          content="Explore Sree Raaga Resorts through our visual gallery. Browse through high-quality photos and videos of our luxury villas, amenities, multi-cuisine dining, and events."
        />
        <meta
          name="keywords"
          content="Sree Raaga Resorts photos, resort gallery, villa photos, luxury resort photos, activities videos, Sree Raaga video tour"
        />
        <meta property="og:title" content="Resort Gallery | Sree Raaga Resorts" />
        <meta
          property="og:description"
          content="Discover Sree Raaga Resorts visually. Peek into our luxury suites, infinity pool, lush landscapes, and events venue."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <Navbar />

      <div className="bg-[#fdfeff] text-[#0d2b4e] min-h-screen">
        
        {/* ================= HERO SECTION ================= */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center select-none"
          style={{
            backgroundImage: "url('/a2.avif')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          
          <div className="relative z-10 text-center px-4 max-w-7xl">
            {/* Breadcrumb matching layout */}
            <div 
              className="flex justify-center items-center gap-2 text-white/80 uppercase tracking-[4px] text-[13px] md:text-[15px] font-medium font-jost mb-3" 
              data-aos="fade-up"
            >
              <Link to="/" className="hover:text-[#c8a64d] transition-colors">Home</Link>
              <span className="text-white/40">/</span>
              <span className="text-white">Gallery</span>
            </div>
            
            <h1 
              className="text-4xl md:text-[92px] font-medium font-corm text-white tracking-wide leading-tight" 
              data-aos="fade-up" 
              data-aos-delay="100"
            >
              Gallery
            </h1>
          </div>
        </section>

        {/* ================= GALLERY CONTENT SECTION ================= */}
        <section className="py-20 md:py-28 px-4 sm:px-6 bg-[#fdfeff] text-[#0d2b4e]">
          
          {/* Centered Title Heading */}
          <div className="max-w-7xl mx-auto text-center mb-12">
            <span 
              className="text-[#c8a64d] uppercase tracking-[3px] mb-3 text-[15px] md:text-[17px] font-semibold block" 
              data-aos="fade-up"
            >
              Visual Experience
            </span>
            <h2 
              className="text-3xl md:text-[92px] font-medium font-corm text-[#0d2b4e] leading-tight mb-8" 
              data-aos="fade-up" 
              data-aos-delay="100"
            >
              Captured Moments of Bliss
            </h2>
          </div>

          {/* Centered Filter Links */}
          <div 
            className="flex flex-wrap justify-center items-center gap-3 md:gap-5 mb-16 text-[14px] md:text-[17px] font-medium uppercase tracking-[2px] font-jost" 
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <button 
              onClick={() => {
                setActiveFilter("all");
                setLightbox((l) => ({ ...l, itemIndex: 0 }));
              }} 
              className={`pb-1 transition-all duration-300 relative cursor-pointer font-semibold ${
                activeFilter === "all" ? "text-[#c8a64d]" : "text-[#0d2b4e] hover:text-[#c8a64d]"
              }`}
            >
              All Photos & Videos
              {activeFilter === "all" && (
                <motion.div 
                  layoutId="activeBorder" 
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c8a64d]" 
                />
              )}
            </button>
            
            <span className="text-gray-300 select-none">-</span>
            
            <button 
              onClick={() => {
                setActiveFilter("photos");
                setLightbox((l) => ({ ...l, itemIndex: 0 }));
              }} 
              className={`pb-1 transition-all duration-300 relative cursor-pointer font-semibold ${
                activeFilter === "photos" ? "text-[#c8a64d]" : "text-[#0d2b4e] hover:text-[#c8a64d]"
              }`}
            >
              Photos
              {activeFilter === "photos" && (
                <motion.div 
                  layoutId="activeBorder" 
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c8a64d]" 
                />
              )}
            </button>
            
            <span className="text-gray-300 select-none">-</span>
            
            <button 
              onClick={() => {
                setActiveFilter("videos");
                setLightbox((l) => ({ ...l, itemIndex: 0 }));
              }} 
              className={`pb-1 transition-all duration-300 relative cursor-pointer font-semibold ${
                activeFilter === "videos" ? "text-[#c8a64d]" : "text-[#0d2b4e] hover:text-[#c8a64d]"
              }`}
            >
              Videos
              {activeFilter === "videos" && (
                <motion.div 
                  layoutId="activeBorder" 
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#c8a64d]" 
                />
              )}
            </button>
          </div>

          {/* Three-grid pictures/videos layout */}
          <div className="max-w-[180vh] mx-auto">
            <motion.div 
              layout 
              className={`grid grid-cols-1 md:grid-cols-2 ${activeFilter === "videos" ? "" : "lg:grid-cols-3"} gap-6 sm:gap-8`}
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    key={item.id}
                    onClick={() => openLightbox(index)}
                    className="group relative cursor-pointer overflow-hidden rounded-sm shadow-sm aspect-[4/3] bg-gray-100 border border-gray-100"
                  >
                    {item.type === "photo" ? (
                      <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full relative">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Play Overlay */}
                        <div className="absolute inset-0 bg-[#04121a]/30 flex items-center justify-center transition-all duration-300 group-hover:bg-[#04121a]/10">
                          <div className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c8a64d] group-hover:border-transparent text-white">
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill="currentColor" 
                              className="w-5 h-5 ml-0.5"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gradient & Hover Text Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04121a]/90 via-[#04121a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 select-none">
                      <span className="text-[#c8a64d] text-xs font-semibold uppercase tracking-wider mb-1 font-jost">
                        {item.type === "photo" ? "Photo" : "Video"} • {item.category}
                      </span>
                      <h3 className="text-white text-xl font-medium font-corm leading-tight mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-sm font-jost font-light leading-normal line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ================= LIGHTBOX MODAL ================= */}
        <AnimatePresence>
          {lightbox.isOpen && currentItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-[999] bg-[#04121a]/98 flex items-center justify-center p-4 md:p-8"
            >
              {/* Close Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="absolute top-4 right-4 z-[1000] w-12 h-12 rounded-full bg-white/10 hover:bg-[#c8a64d] text-white flex items-center justify-center transition cursor-pointer border border-white/20 hover:scale-105"
                title="Close"
              >
                <X size={24} />
              </button>

              {/* Prev Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  prevItem();
                }}
                className="absolute left-4 md:left-8 z-[1000] w-12 h-12 rounded-full bg-white/10 hover:bg-[#c8a64d] text-white flex items-center justify-center transition cursor-pointer border border-white/20 hover:scale-105"
                title="Previous"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Next Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  nextItem();
                }}
                className="absolute right-4 md:right-8 z-[1000] w-12 h-12 rounded-full bg-white/10 hover:bg-[#c8a64d] text-white flex items-center justify-center transition cursor-pointer border border-white/20 hover:scale-105"
                title="Next"
              >
                <ChevronRight size={24} />
              </button>

              {/* Lightbox Main Container */}
              <div 
                className="relative max-w-5xl w-full h-[65vh] md:h-[75vh] flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  key={currentItem.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  {currentItem.type === "photo" ? (
                    <img 
                      src={currentItem.src} 
                      alt={currentItem.title} 
                      className="max-w-full max-h-full object-contain rounded-sm shadow-2xl"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-black/40 rounded-sm">
                      <video 
                        src={currentItem.src} 
                        title={currentItem.title}
                        controls
                        autoPlay
                        className="max-w-full max-h-full shadow-2xl"
                      />
                    </div>
                  )}
                </motion.div>

                {/* Media Details at the bottom */}
                <div className="absolute -bottom-20 left-0 right-0 text-center text-white px-4 select-none">
                  <span className="text-[#c8a64d] text-xs font-semibold uppercase tracking-wider block mb-1 font-jost">
                    {currentItem.type === "photo" ? "Photo" : "Video"} • {currentItem.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-medium font-corm">
                    {currentItem.title}
                  </h3>
                  <p className="text-white/60 text-sm font-jost mt-1 leading-normal max-w-2xl mx-auto">
                    {currentItem.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <Footer />
    </>
  );
};

export default Gallery;
