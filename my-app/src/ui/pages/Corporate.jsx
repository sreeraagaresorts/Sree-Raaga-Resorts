import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Briefcase, CheckCircle, Flame, Gift, ShieldAlert } from "lucide-react";

const Corporate = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e]  min-h-screen">
        
        {/* Hero Section */}
        <section
          className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/55"></div>
          <div className="relative z-10 text-center text-white px-4 mt-20 select-none">
            <span className="text-[#c8a64d] uppercase tracking-[6px] block mb-4 text-xs font-semibold">
              Sree Raaga Resorts Professional
            </span>
            <h1 className="text-4xl md:text-7xl font-light  leading-tight">
              Corporate Outings
            </h1>
          </div>
        </section>

        {/* Corporate Outings Details */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#c8a64d] text-xs uppercase tracking-[4px] font-bold block">
                Work & Play
              </span>
              <h2 className="text-3xl md:text-5xl  font-light text-[#0d2b4e] leading-snug">
                Corporate Team Outings & Team Building
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed font-light">
                More than a resort, Sree Raaga is a vibrant destination where productive workspaces, memorable celebrations, and custom corporate retreats come together. Large event spaces combined with rich recreational activities make the resort suitable for organizations of all sizes.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-6">
                {[
                  "Team Building Activities",
                  "Employee Engagement Programs",
                  "Annual Day Celebrations",
                  "Leadership Retreats",
                  "Corporate Picnics",
                  "Professional Training Programs"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-[#c8a64d] rounded-full shrink-0"></span>
                    <span className="text-[#0d2b4e] text-sm  font-light">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Facilities Highlight Box */}
            <div className="lg:col-span-5 bg-white border border-[#c8a64d]/10 p-8 md:p-10 shadow-xl rounded-sm">
              <div className="w-12 h-12 rounded-full bg-[#c8a64d]/10 flex items-center justify-center text-[#c8a64d] mb-6">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-2xl  font-light text-[#0d2b4e] mb-6">
                Resort Capabilities
              </h3>
              
              <div className="space-y-5  text-xs md:text-sm font-light text-gray-500">
                <div>
                  <h4 className="text-[#0d2b4e] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Grand Event Capacity
                  </h4>
                  <p>Our 800-capacity Grand Banquet Hall and 500-capacity landscaped lawn provide plenty of room for corporate gala events or dinners.</p>
                </div>
                <div>
                  <h4 className="text-[#0d2b4e] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Sports Bar & DJ Pub Setup
                  </h4>
                  <p>Unwind after sessions with TT, Snooker, Carrom, Chess, Ludo, and a full DJ/sound system, ready to double as a corporate night club/pub.</p>
                </div>
                <div>
                  <h4 className="text-[#0d2b4e] font-semibold mb-1 uppercase tracking-wider text-[10px]">
                    Massive Catering
                  </h4>
                  <p>Equipped with a large outdoor kitchen, we support customized large-scale catering requests for all organization events.</p>
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="https://wa.me/918904561155?text=I%20am%20interested%20in%20arranging%20a%20corporate%20team%20outing%20at%20Sree%20Raaga%20Resorts."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full py-4 bg-[#f5dec2] hover:bg-[#ebd0b0] text-[#0d2b4e] font-semibold uppercase tracking-[2px] text-xs transition"
                >
                  Plan Your Outing
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

export default Corporate;
