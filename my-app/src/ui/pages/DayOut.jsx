import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Check, Compass, Ticket, Users, Sun } from "lucide-react";

const DayOut = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e]  min-h-screen">
        
        {/* Hero Section */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white px-4 mt-20 select-none">
            <span className="text-white uppercase tracking-[6px] block mb-4 text-[17px] font-semibold">
              Sree Raaga Resorts Packages
            </span>
            <h1 className="text-4xl md:text-[92px] font-medium font-corm  leading-tight">
              Day Out Experience
            </h1>
          </div>
        </section>

        {/* Introduction & Package Value */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Story */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#c8a64d] text-xs uppercase tracking-[4px] font-bold block">
                Staycation & Fun
              </span>
              <h2 className="text-3xl md:text-5xl  font-light text-[#0d2b4e] leading-snug">
                A Premium Day-Out & Staycation Destination Near Bangalore
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
                Escape the city's hustle and enjoy a perfect blend of relaxation, adventure, dining, and family entertainment at Sree Raaga Resort. Spend a memorable day with family, friends, colleagues, or corporate teams amidst lush surroundings and exciting recreational activities.
              </p>
            </div>

            {/* Right Column: Pricing Ticket Card */}
            <div className="lg:col-span-5 bg-white border border-[#c8a64d]/20 p-8 md:p-10 shadow-xl rounded-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#c8a64d] text-white text-[10px] uppercase font-bold tracking-[2px] px-4 py-1.5 rounded-bl">
                Best Value
              </div>
              <div className="w-12 h-12 rounded-full bg-[#c8a64d]/10 flex items-center justify-center text-[#c8a64d] mb-6">
                <Ticket className="w-6 h-6" />
              </div>
              <h3 className="text-2xl  font-light text-[#0d2b4e] mb-2">
                Day Out Package
              </h3>
              <div className="text-3xl  text-[#c8a64d] font-semibold mb-2">
                ₹1,800 <span className="text-sm  text-gray-400 font-light">+ 18% GST / person</span>
              </div>
              <p className="text-gray-500 text-xs  mb-8">
                Perfect for large groups, families, and corporate outings looking to enjoy our premier facilities for a single day.
              </p>
              <a
                href="https://wa.me/918904561155?text=I%20am%20interested%20in%20booking%20a%20Day%20Out%20package%20at%20Sree%20Raaga%20Resorts."
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full py-4 bg-[#f5dec2] hover:bg-[#ebd0b0] text-[#0d2b4e] font-semibold uppercase tracking-[2px] text-xs transition shadow-sm"
              >
                Book Your Day of Fun
              </a>
            </div>

          </div>
        </section>

        {/* Detailed Package Perks & Inclusions */}
        <section className="py-24 bg-[#f7f5ee] px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
            
            {/* Inclusions */}
            <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
              <h3 className="text-2xl  font-light mb-8 text-[#0d2b4e] flex items-center gap-3">
                <span className="w-2 h-8 bg-[#c8a64d]"></span> Package Includes
              </h3>
              <ul className="space-y-4">
                {[
                  "Welcome Drink on Arrival",
                  "Delicious Vegetarian & Non-Vegetarian Lunch Buffet",
                  "Evening High Tea & Snacks",
                  "Complimentary Access to Resort Amenities & Common Areas"
                ].map((perk, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-gray-600 text-sm md:text-base font-light">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Activities Included */}
            <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
              <h3 className="text-2xl  font-light mb-8 text-[#0d2b4e] flex items-center gap-3">
                <span className="w-2 h-8 bg-[#c8a64d]"></span> Activities Included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Rain Dance Arena",
                  "Swimming Pool (60ft x 30ft)",
                  "Adventure Activities",
                  "Indoor Games & TT",
                  "Outdoor Games & Cricket",
                  "Children's Play Area"
                ].map((act, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5">
                    <span className="w-1.5 h-1.5 bg-[#c8a64d] rounded-full shrink-0"></span>
                    <span className="text-gray-600 text-sm font-light">{act}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default DayOut;
