import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

const Exp = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  // We use a ref to track the previous index so we know when an item is wrapping around
  const prevActiveIndexRef = useRef(0);
  useEffect(() => {
    prevActiveIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Fallback static items shown while loading or if API returns nothing
  const fallbackExperiences = [
    {
      id: '01',
      _id: null,
      title: 'Bike Rides',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2070&auto=format&fit=crop',
      height: 'h-[300px] md:h-[460px]',
    },
    {
      id: '02',
      _id: null,
      title: 'Boat Trips',
      image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=2070&auto=format&fit=crop',
      height: 'h-[300px] md:h-[460px]',
    },
    {
      id: '03',
      _id: null,
      title: 'New Experience',
      image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=2070&auto=format&fit=crop',
      height: 'h-[300px] md:h-[460px]',
    },
    {
      id: '04',
      _id: null,
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
            _id: event._id,
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
    setActiveIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => prev - 1);
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

  const handleSlideClick = (item, isCenter) => {
    if (!isCenter) return;
    if (item._id) {
      navigate(`/events/${item._id}`);
    }
  };

  return (
    <div className="hidden md:flex min-h-screen bg-[#fdfeff] pb-10 flex-col justify-center overflow-hidden font-jost relative">

      {/* Required Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap');

        .font-corm { font-family: "Cormorant Garamond", serif; }
        .font-jost { font-family: "Jost", sans-serif; }
      `}</style>

      {/* Main Slider Container */}
      <div className="relative w-full max-w-[1600px] mx-auto h-[450px] md:h-[600px] flex items-center justify-center">

        {experiences.map((item, index) => {
          const offset = getOffset(index, activeIndex);
          const prevOffset = getOffset(index, prevActiveIndexRef.current);

          const isCenter = offset === 0;

          // DETECT JUMP: If the item jumps from one far side to the other, we turn off its transition
          const isJumping = Math.abs(offset - prevOffset) > 1 && activeIndex !== prevActiveIndexRef.current;

          return (
            <div
              key={`${item.id}-${index}`}
              className="absolute top-1/2 left-1/2 w-[90vw] md:w-[55vw] lg:w-[35vw] group"
              style={{
                transform: `translate(calc(-50% + ${offset * 115}%), calc(-50% - ${isCenter ? 90 : 0}px))`,
                opacity: Math.abs(offset) > 1 ? 0 : 1,
                visibility: Math.abs(offset) > 1 ? 'hidden' : 'visible',
                zIndex: 10 - Math.abs(offset),
                pointerEvents: isCenter ? 'auto' : 'none',
                transition: isJumping ? 'none' : 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
                cursor: isCenter && item._id ? 'pointer' : 'default',
              }}
              onClick={() => handleSlideClick(item, isCenter)}
            >
              <div className="flex flex-col relative w-full h-full">

                {/* Image Container */}
                <div className={`relative overflow-hidden mb-6 ${item.height}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full md:h-[443px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Hover Enquire Overlay — only shown on center slide */}
                  {isCenter && item._id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${item._id}`);
                        }}
                        className="px-5 py-12 rounded-full bg-white/90 backdrop-blur-sm text-[#0d2b4e] text-sm font-semibold font-jost uppercase tracking-[2px] shadow-lg hover:bg-[#efd3b2] hover:text-[#0d2b4e] transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                      >
                        Enquire
                      </button>
                    </div>
                  )}
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