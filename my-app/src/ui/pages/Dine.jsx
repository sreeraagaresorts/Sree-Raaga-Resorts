import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Dine = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e]  min-h-screen">
        
        {/* Hero Section */}
        <section
          className="relative h-[55vh] flex items-center justify-center bg-cover bg-center select-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000')"
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white select-none">
            <span className="text-white uppercase tracking-[6px] block mb-2 text-[17px]  font-semibold ">
              Sree Raaga Resorts
            </span>
            <h1 className="text-4xl md:text-[92px] font-medium font-corm leading-tight">
              Dine & Drink
            </h1>
          </div>
        </section>

        {/* Intro Section */}
        <section className="py-20 max-w-4xl mx-auto px-6 text-center select-none">
          <span className="text-[#c8a64d] uppercase tracking-[4px] mb-4 text-xs font-semibold  block">
            Culinary Delights
          </span>
          <h2 className="text-3xl md:text-4xl font-light font-corm text-[#0d2b4e] leading-relaxed mb-8">
            Elevate your senses with our fine culinary offerings. From refreshing morning brews to upscale multi-cuisine dining.
          </h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16 pt-6 border-t border-[#0d2b4e]/10 max-w-3xl mx-auto  text-sm  tracking-wider text-gray-500 font-semibold">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#c8a64d]" />
              <span><a href="tel:918904381155">+91 89045 61155</a></span>
              <Phone size={16} className="text-[#c8a64d]" />
              <span><a href="tel:918904381155">+91 8904381155</a></span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-[#c8a64d]" />
              <span className="text-lg">info@sreeraagaresorts.in</span>
            </div>
          </div>
        </section>

        {/* Dining Sections (Alternating Grid) */}
        <section className="max-w-[180vh] mx-auto py-12  pb-28 space-y-24 md:space-y-32">
          
          {/* Section 1: Multi-Cuisine Dining */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/3]  overflow-hidden shadow-lg select-none">
              <img 
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200" 
                alt="Multi-Cuisine Dining" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold  block">
                Restaurant
              </span>
              <h3 className="text-4xl font-medium font-corm text-[#0d2b4e]">
                Multi-Cuisine Dining
              </h3>
              <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed  font-medium mr-4">
                Experience a rich canvas of global and local flavors at our main dining hall. Serving curated breakfast, lunch, and dinner, our chefs craft every dish using fresh local ingredients, farm-to-table vegetables, and premium imports in an upscale dining environment.
              </p>
              <div className="pt-2">
                <Link 
                  to="/menu"
                  className="inline-block border border-[#0d2b4e] px-8 py-3 text-[#0d2b4e] hover:bg-[#0d2b4e] hover:text-white uppercase tracking-widest text-xs font-bold  transition duration-300"
                >
                  Explore Menu
                </Link>
              </div>
            </div>
          </div>

          {/* Section 2: Coffee Shop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 px-6 lg:order-1 order-2">
              <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold  block">
                Garden Cafe
              </span>
              <h3 className="text-4xl font-medium font-corm text-[#0d2b4e]">
                Coffee Shop
              </h3>
              <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed  font-medium">
                Start your day with freshly brewed espresso, premium loose-leaf teas, and artisanal baked goods. Our cozy garden coffee shop is the perfect spot for casual meetings, morning reading, or a quiet sunset beverage amidst lush resort greenery.
              </p>
              <div className="pt-2">
                <Link 
                  to="/menu"
                  className="inline-block border border-[#0d2b4e] px-8 py-3 text-[#0d2b4e] hover:bg-[#0d2b4e] hover:text-white uppercase tracking-widest text-xs font-bold  transition duration-300"
                >
                  Explore Cafe Menu
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3]  overflow-hidden shadow-lg select-none lg:order-2 order-1">
              <img 
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200" 
                alt="Coffee Shop" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Section 3: Bar & Restaurant */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/3]  overflow-hidden shadow-lg select-none">
              <img 
                src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200" 
                alt="Bar & Restaurant" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="space-y-6">
              <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold  block">
                Lounge
              </span>
              <h3 className="text-4xl font-medium font-corm text-[#0d2b4e]">
                Bar & Restaurant
              </h3>
              <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed mr-4 font-medium">
                Sip custom cocktails, fine wines, and premium single malts in an atmosphere of refined luxury. Indulge in custom catering, chef-crafted pairings, and premium seating next to our pool area for a relaxing, stylish night.
              </p>
              <div className="pt-2">
                <Link 
                  to="/contact"
                  className="inline-block border border-[#0d2b4e] px-8 py-3 text-[#0d2b4e] hover:bg-[#0d2b4e] hover:text-white uppercase tracking-widest text-xs font-bold  transition duration-300"
                >
                  Reserve A Table
                </Link>
              </div>
            </div>
          </div>

          {/* Section 4: Sports Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 px-6 lg:order-1 order-2">
              <span className="text-[#c8a64d] uppercase tracking-[4px] text-xs font-semibold  block">
                Gaming Lounge
              </span>
              <h3 className="text-4xl font-medium font-corm text-[#0d2b4e]">
                Sports Bar
              </h3>
              <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed  font-medium ">
                Unwind with games and drinks in our lively sports lounge. Fully equipped with snooker tables, table tennis, board games, and large high-definition screens to watch your favorite matches with friends and family.
              </p>
              <div className="pt-2">
                <Link 
                  to="/amenities"
                  className="inline-block border border-[#0d2b4e] px-8 py-3 text-[#0d2b4e] hover:bg-[#0d2b4e] hover:text-white uppercase tracking-widest text-xs font-bold  transition duration-300"
                >
                  Explore Games
                </Link>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-lg select-none lg:order-2 order-1">
              <img 
                src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200" 
                alt="Sports Bar" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

        </section>

      </div>
      <Footer />
    </>
  );
};

export default Dine;
