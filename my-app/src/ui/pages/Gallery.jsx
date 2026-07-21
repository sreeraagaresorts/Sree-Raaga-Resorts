import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet";
import AOS from "aos";
import "aos/dist/aos.css";

const getEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes("youtube.com/watch")) {
    try {
      const urlParams = new URLSearchParams(new URL(url).search);
      const id = urlParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    } catch (e) {
      return url;
    }
  }
  return url;
};

const isYouTubeUrl = (url) => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const categories = ["Villas & Suites", "Lush Outdoors", "Dining", "Activities", "Events & Celebrations"];

// Dynamically generate entries for images 1 to 60 and r1 (1) to r1 (141)
const generateDynamicGalleryItems = () => {
  const items = [];
  let nextId = 1;

  // Add numbered images 1 to 60 (excluding missing ones like 16)
  const missingNumbered = [16];
  for (let i = 1; i <= 60; i++) {
    if (missingNumbered.includes(i)) continue;
    items.push({
      id: nextId++,
      type: "photo",
      src: `/${i}.avif`,
      category: categories[(i - 1) % categories.length],
      title: `Resort View #${i}`,
      description: "Experience the serene ambience and beauty of Sree Raaga Resorts."
    });
  }

  // Add r1 (1) to r1 (141) images
  for (let i = 1; i <= 141; i++) {
    items.push({
      id: nextId++,
      type: "photo",
      src: `/r1 (${i}).avif`,
      category: categories[(i - 1) % categories.length],
      title: `Resort Experience #${i}`,
      description: "Capturing fine details and beautiful experiences across the resort grounds."
    });
  }

  return items;
};

const galleryItems = generateDynamicGalleryItems();

const ITEMS_PER_PAGE = 24;

const getPageNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
};

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [lightbox, setLightbox] = useState({ isOpen: false, itemIndex: 0 });
  const galleryGridRef = useRef(null);

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

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      galleryGridRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openLightbox = (index) => {
    setLightbox({
      isOpen: true,
      itemIndex: index,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({
      ...prev,
      isOpen: false,
    }));
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
        <section ref={galleryGridRef} className="py-20 md:py-28 px-4 sm:px-6 bg-[#fdfeff] text-[#0d2b4e] scroll-mt-6">
          
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
                setCurrentPage(1);
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
                setCurrentPage(1);
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
                setCurrentPage(1);
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
            <div 
              className={`grid grid-cols-1 md:grid-cols-2 ${activeFilter === "videos" ? "" : "lg:grid-cols-3"} gap-6 sm:gap-8`}
            >
              <AnimatePresence mode="wait">
                {currentItems.map((item) => {
                  const fullIndex = filteredItems.findIndex((fi) => fi.id === item.id);
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      key={item.id}
                      onClick={() => openLightbox(fullIndex >= 0 ? fullIndex : 0)}
                      className="group relative cursor-pointer overflow-hidden rounded-sm shadow-sm aspect-[4/3] bg-gray-100 border border-gray-100 transform-gpu"
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
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/45 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c8a64d] group-hover:border-transparent text-white">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className="w-8 h-8 md:w-10 md:h-10 ml-1"
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
                        <h3 className="text-[#fdfeff] text-xl font-medium font-corm leading-tight mb-1">
                          {item.title}
                        </h3>
                        <p className="text-white/80 text-sm font-jost font-light leading-normal line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ================= PAGINATION CONTROLS ================= */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-16 font-jost select-none">
                {/* Page indicator info */}
                <span className="text-sm text-gray-500 font-medium tracking-wide">
                  Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
                </span>

                {/* Buttons row */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {/* Prev Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-[#0d2b4e]/20 text-[#0d2b4e] hover:bg-[#c8a64d] hover:border-[#c8a64d] hover:text-white cursor-pointer"
                    }`}
                    title="Previous Page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers(currentPage, totalPages).map((page, idx) =>
                    page === "..." ? (
                      <span key={`dots-${idx}`} className="px-2 text-gray-400 font-medium">
                        ...
                      </span>
                    ) : (
                      <button
                        key={`page-${page}`}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 cursor-pointer ${
                          currentPage === page
                            ? "bg-[#0d2b4e] text-white shadow-md"
                            : "bg-gray-50 text-[#0d2b4e] hover:bg-[#c8a64d] hover:text-white border border-gray-200/80"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      currentPage === totalPages
                        ? "border-gray-200 text-gray-300 cursor-not-allowed"
                        : "border-[#0d2b4e]/20 text-[#0d2b4e] hover:bg-[#c8a64d] hover:border-[#c8a64d] hover:text-white cursor-pointer"
                    }`}
                    title="Next Page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
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
                  ) : isYouTubeUrl(currentItem.src) ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black/40 rounded-sm">
                      <iframe 
                        src={getEmbedUrl(currentItem.src)} 
                        title={currentItem.title}
                        className="w-full h-full aspect-video rounded-sm shadow-2xl border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
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
