import React from "react";
import { motion } from "motion/react";
import { Phone, Mail, ArrowRight } from "lucide-react";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Custom "Window Open" Reveal scroll animation component
function WindowReveal({ src, alt, className = "", delay = 0 }) {
  return (
    <div className={`relative overflow-hidden ${className} group `}>
      <motion.div
        initial={{ clipPath: "inset(15% 15% 15% 15% round 24px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 1.4, ease: [0.25, 1, 0.35, 1], delay }}
        className="w-full h-full"
      >
        <motion.img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1.0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.25, 1, 0.35, 1], delay }}
        />
      </motion.div>
    </div>
  );
}

const Events = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e] font-sans min-h-screen overflow-x-hidden">

        {/* HERO SECTION */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=2000')", // Ambient lit dinner table
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative z-10 text-center text-white px-4 mt-20 select-none max-w-3xl space-y-4">
            <span className="text-[#c8a64d] text-xs uppercase tracking-[6px] font-semibold block mb-2">
              MEET & CELEBRATE
            </span>
            <h1 className="text-4xl md:text-7xl font-light font-serif leading-tight">
              Meet & Celebrate
            </h1>
            <p className="text-white/80 font-light text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
              At the Sree Raaga Resorts, we can host anything from a business meeting to a wedding, a banquet, a private celebration.
            </p>
          </div>
        </section>

        {/* INTRODUCTION BLOCK */}
        <section className="py-24 px-6 bg-[#fcfaf2] text-center max-w-4xl mx-auto space-y-8">
          <span className="text-[#c8a64d] text-[10px] uppercase tracking-[4px] font-semibold block">
            MEET & CELEBRATE
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-[#0d2b4e] leading-relaxed max-w-3xl mx-auto">
            Elevate your events to new heights at the Sree Raaga Resorts. With state-of-the-art technology, luxurious facilities, and unparalleled service, our expert team will ensure your event is a success. Plus, our prime location near Bangalore offers a breathtaking backdrop for your attendees to enjoy.
          </h2>

          {/* Quick Contact links under introduction */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-12 pt-6 font-sans text-xs uppercase tracking-widest text-[#0d2b4e]/80">
            <a href="tel:08904561155" className="flex items-center gap-3 hover:text-[#c8a64d] transition-colors">
              <Phone size={14} className="text-[#c8a64d]" />
              <span>089045 61155</span>
            </a>
            <a href="mailto:info@sreeraagaresorts.in" className="flex items-center gap-3 hover:text-[#c8a64d] transition-colors">
              <Mail size={14} className="text-[#c8a64d]" />
              <span>info@sreeraagaresorts.in</span>
            </a>
          </div>
        </section>

        {/* ALTERNATING EVENTS SECTIONS */}
        <section className="pb-24 px-6 max-w-7xl mx-auto space-y-24 md:space-y-32">
          
          {/* Section 1: Meetings (Image Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-6">
              <WindowReveal 
                src="https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=800" 
                alt="Meetings" 
                className="aspect-[4/3] rounded-sm shadow-md"
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-3xl md:text-4xl font-serif font-light text-[#0d2b4e]">
                Meetings
              </h3>
              <p className="text-gray-500 font-sans text-xs md:text-sm leading-relaxed font-light">
                The resort features state-of-the-art conference rooms and co-working facilities ideal for corporate events, annual meetings, and leadership seminars. Complete with high-speed internet, audiovisual setups, and dedicated dining halls.
              </p>
              <p className="text-gray-500 font-sans text-xs md:text-sm leading-relaxed font-light">
                We offer tailored delegate packages, team outings, and a massive outdoor kitchen setup suitable for hosting large groups and custom retreats.
              </p>
              <div className="pt-4">
                <a
                  href="https://wa.me/918904561155?text=I%20am%20interested%20in%20booking%20a%20meeting%20venue%20at%20Sree%20Raaga%20Resorts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#c8a64d] text-[#0d2b4e] hover:bg-[#c8a64d] hover:text-white text-xs font-semibold uppercase tracking-[2px] transition duration-300 rounded-sm"
                >
                  Enquire Now <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

          {/* Section 2: Weddings (Text Left, Image Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            {/* Text on Mobile goes first, but on Desktop goes left */}
            <div className="lg:col-span-6 order-2 lg:order-1 space-y-6">
              <h3 className="text-3xl md:text-4xl font-serif font-light text-[#0d2b4e]">
                Weddings
              </h3>
              <p className="text-gray-500 font-sans text-xs md:text-sm leading-relaxed font-light">
                Celebrate the most special day of your life at Sree Raaga Resorts. With our 800-capacity Grand Banquet Hall and 500-capacity landscaped event lawn, we ensure your wedding is a spectacular and memorable affair.
              </p>
              <p className="text-gray-500 font-sans text-xs md:text-sm leading-relaxed font-light">
                Our culinary team will craft a customized veg & non-veg buffet while our events team takes care of all setup, decor, and guest accommodation needs.
              </p>
              <div className="pt-4">
                <a
                  href="https://wa.me/918904561155?text=I%20am%20interested%20in%20hosting%20a%20wedding%20at%20Sree%20Raaga%20Resorts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#c8a64d] text-[#0d2b4e] hover:bg-[#c8a64d] hover:text-white text-xs font-semibold uppercase tracking-[2px] transition duration-300 rounded-sm"
                >
                  Enquire Now <ArrowRight size={14} />
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 order-1 lg:order-2">
              <WindowReveal 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800" 
                alt="Weddings" 
                className="aspect-[4/3] rounded-sm shadow-md"
              />
            </div>
          </div>

          {/* Section 3: Private Events (Image Left, Text Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-6">
              <WindowReveal 
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800" 
                alt="Private Events" 
                className="aspect-[4/3] rounded-sm shadow-md"
              />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <h3 className="text-3xl md:text-4xl font-serif font-light text-[#0d2b4e]">
                Private Events
              </h3>
              <p className="text-gray-500 font-sans text-xs md:text-sm leading-relaxed font-light">
                Looking to celebrate a special occasion? The resort is an ideal choice for birthdays, family gatherings, corporate team picnics, and reunions.
              </p>
              <p className="text-gray-500 font-sans text-xs md:text-sm leading-relaxed font-light">
                Our Sports Bar (snooker, TT, Carrom) and private club setup with DJ equipment provide options to entertain guests of all age groups. Enjoy customized catering and recreational activities like the rain dance and pool.
              </p>
              <div className="pt-4">
                <a
                  href="https://wa.me/918904561155?text=I%20am%20interested%20in%20booking%20a%20private%20event%20at%20Sree%20Raaga%20Resorts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#c8a64d] text-[#0d2b4e] hover:bg-[#c8a64d] hover:text-white text-xs font-semibold uppercase tracking-[2px] transition duration-300 rounded-sm"
                >
                  Enquire Now <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>

        </section>

      </div>
      <Footer />
    </>
  );
};

export default Events;