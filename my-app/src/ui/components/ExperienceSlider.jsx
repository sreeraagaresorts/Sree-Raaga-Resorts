import React, { useState, useEffect, useCallback, useRef } from 'react';
import { API_URL } from '../../config/api';

const Exp = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // We use a ref to track the previous index so we know when an item is wrapping around
  const prevActiveIndexRef = useRef(0);
  useEffect(() => {
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Fallback static items shown while loading or if API returns nothing
  const fallbackExperiences = [
    {
      id: '01',
      title: 'Bike Rides',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2070&auto=format&fit=crop',
      height: 'h-[300px] md:h-[460px]',
    },
    {
      id: '02',
      title: 'Boat Trips',
      image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop',
      height: 'h-[300px] md:h-[460px]',
    },
    {
      id: '03',
      title: 'New Experience',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2070&auto=format&fit=crop',
      height: 'h-[300px] md:h-[460px]',
    },
    {
      id: '04',
      title: 'Hot Air Balloons',
      image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1974&auto=format&fit=crop',
      height: 'h-[300px] md:h-[460px]',
    },
  ];

  const [baseExperiences, setBaseExperiences] = useState(fallbackExperiences);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const mapped = data.data.map((event, i) => ({
            id: String(i + 1).padStart(2, '0'),
            title: event.name,
            image: event.image
              ? event.image.startsWith('http')
                ? event.image
                : `${API_URL}/uploads/${event.image}`
              : 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
            description: event.description || '',
            height: 'h-[300px] md:h-[460px]',
          }));
          setBaseExperiences(mapped);
        }
      } catch (err) {
        console.error('Error fetching events for slider:', err);
        // keeps fallback
      }
    };
    fetchEvents();
  }, []);

  // CLONE THE ARRAY: This gives us 12 total items (a large invisible buffer) 
  // so items can wrap around seamlessly in the background.
  const experiences = [...baseExperiences, ...baseExperiences, ...baseExperiences];
  const total = experiences.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => prev + 1); // Continuous addition (no modulo here)
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => prev - 1); // Continuous subtraction
  }, []);

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  // Calculates offset mathematically while safely handling negative numbers
  const getOffset = (index, active) => {
    let offset = ((index - active) % total + total) % total;
    if (offset > total / 2) offset -= total;
    return offset;
  };

  return (
    <div className="hidden md:flex min-h-screen bg-[#fdfeff] py-20 flex-col justify-center overflow-hidden font-jost relative">
      
      {/* Required Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap');
        
        .font-corm { font-family: "Cormorant Garamond", serif; }
        .font-jost { font-family: "Jost", sans-serif; }
      `}</style>

      {/* Main Slider Container */}
      <div className="relative w-full max-w-[1600px] mx-auto h-[450px] md:h-[600px]  flex items-center justify-center">
        
        {experiences.map((item, index) => {
          const offset = getOffset(index, activeIndex);
          const prevOffset = getOffset(index, prevActiveIndexRef.current);
          
          const isCenter = offset === 0;
          
          // DETECT JUMP: If the item jumps from one far side to the other, we turn off its transition
          const isJumping = Math.abs(offset - prevOffset) > 1 && activeIndex !== prevActiveIndexRef.current;

          return (
            <div
              key={`${item.id}-${index}`} 
              // --- CHANGED HERE: Increased widths (w-[90vw] md:w-[55vw] lg:w-[45vw]) ---
              className="absolute top-1/2 left-1/2 w-[90vw] md:w-[55vw] lg:w-[35vw] group"
              style={{
                // Shifts active slide UP (-40px) and separates X positions
                transform: `translate(calc(-50% + ${offset * 115}%), calc(-50% - ${isCenter ? 90 : 0}px))`,
                
                // Hide items entirely if they are further away than the immediate left/right
                opacity: Math.abs(offset) > 1 ? 0 : (isCenter ? 1 : 1),
                visibility: Math.abs(offset) > 1 ? 'hidden' : 'visible',
                
                zIndex: 10 - Math.abs(offset),
                pointerEvents: isCenter ? 'auto' : 'none',
                
                // If it is wrapping around the back, transition is instantly removed to prevent visual flying
                transition: isJumping ? 'none' : 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
            >
              <div className="flex flex-col relative w-full h-full">
                
                {/* Image Container */}
                <div className={`relative overflow-hidden mb-6 ${item.height}`}>
                  {/* --- CHANGED HERE: w-[700px] changed to w-full --- */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full md:h-[443px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>

                {/* Text Container */}
                <div className="px-2 text-left">
                  <h3 className="text-3xl lg:text-[28px] font-bold text-gray-500 font-corm hover:text-[#c8a64d] transition duration-300">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-12 top-[40%] -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-[rgba(30,30,30,0.5)] backdrop-blur-md flex items-center justify-center text-white hover:bg-[rgba(200,166,77,0.9)] hover:text-[#0d2b4e] transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-12 top-[40%] -translate-y-1/2 z-50 w-14 h-14 rounded-full bg-[rgba(30,30,30,0.5)] backdrop-blur-md flex items-center justify-center text-white hover:bg-[rgba(200,166,77,0.9)] hover:text-[#0d2b4e] transition-all duration-300"
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Exp;