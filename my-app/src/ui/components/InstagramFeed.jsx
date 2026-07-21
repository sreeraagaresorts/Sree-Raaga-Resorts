import React, { useRef, useEffect, useState } from "react";

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
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const instagramGalleryImages = [
  "/1.avif",
  "/2.avif",
  "/3.avif",
  "/4.avif",
  "/5.avif",
  "/6.avif",
  "/7.avif",
  "/8.avif",
  "/9.avif",
  "/10.avif",
  "/11.avif",
  "/12.avif",
  "/13.avif",
  "/14.avif",
  "/15.avif",
  "/r1 (1).avif",
  "/r1 (2).avif",
  "/r1 (3).avif",
  "/r1 (4).avif",
  "/r1 (5).avif",
  "/r1 (6).avif",
  "/r1 (7).avif",
  "/r1 (8).avif",
  "/r1 (9).avif",
  "/r1 (10).avif",
];

const InstagramFeed = () => {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const container = scrollRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const cardWidth = container.firstElementChild?.clientWidth || 280;
      const maxScroll = container.scrollWidth - container.clientWidth;
      
      if (container.scrollLeft >= maxScroll - 10) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="bg-[#fdfeff] text-[#0d2b4e] py-0 overflow-hidden">
      <div className="py-8 md:py-12 text-center mb-6 md:mb-12">
        <span className="text-[#c8a64d] uppercase tracking-[4px] text-[15px] md:text-[17px] font-jost font-semibold block mb-2">
          Social Media
        </span>
        <a 
          href="https://www.instagram.com/sreeraagaresorts"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#c8a64d] transition-colors inline-block"
        >
          <h2 className="text-[33px] md:text-6xl font-medium font-corm flex items-center justify-center gap-2">
            Follow us on Instagram
          </h2>
        </a>
      </div>

      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth transform-gpu"
      >
        {instagramGalleryImages.map((img, i) => (
          <a
            key={i}
            href="https://www.instagram.com/sreeraagaresorts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none w-[75%] sm:w-[33.333%] lg:w-[20%] snap-center relative aspect-square overflow-hidden group shadow-sm transform-gpu"
          >
            <img 
              src={img} 
              alt={`Instagram Showcase ${i + 1}`} 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#0d2b4e]/60 opacity-0 group-hover:opacity-100 transition duration-300 z-10 flex items-center justify-center">
              <InstagramIcon size={28} className="text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;
