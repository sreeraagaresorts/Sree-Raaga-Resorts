import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronDown } from "lucide-react";

const faqData = {
  payments: {
    title: "Payments",
    items: [
      {
        question: "Do I have to pay extra fees?",
        answer: "No, all local taxes and resort service charges are included in the final price shown during booking. Optional add-ons such as room service, spa treatments, or excursions will be charged separately to your room."
      },
      {
        question: "Can I change my reservation?",
        answer: "Yes, you can modify your reservation details up to 48 hours prior to check-in through your Guest Dashboard or by contacting our reservation desk directly. Changes are subject to room availability."
      },
      {
        question: "What happens if a host cancels?",
        answer: "In the extremely rare event that the resort must cancel or modify a confirmed booking due to maintenance or force majeure, you will receive a full immediate refund or a complimentary upgrade to an equivalent or higher room category."
      },
      {
        question: "How do I cancel my reservation?",
        answer: "Navigate to your User Dashboard -> Bookings list, select the active booking, and click 'Cancel Booking'. Alternatively, send an email to our support team with your booking reference."
      },
      {
        question: "If I cancel, will I get a full refund?",
        answer: "Cancellations made 7 days or more prior to the check-in date qualify for a 100% refund. Cancellations made between 2 to 7 days receive a 50% refund, while cancellations within 48 hours of arrival are non-refundable."
      }
    ]
  },
  reservation: {
    title: "Reservation",
    items: [
      {
        question: "Do I have to pay extra fees?",
        answer: "No, our room prices are all-inclusive of standard amenities, Wi-Fi, swimming pool access, and gym facilities. High-speed premium internet or dining upgrades are optional."
      },
      {
        question: "Can I change my reservation?",
        answer: "Yes, modifications to dates, number of guests, or room preferences can be made online. Note that seasonal rates may apply when shifting dates."
      },
      {
        question: "What happens if a host cancels?",
        answer: "We guarantee all confirmed reservations. In case of emergency room re-allocation, we arrange equivalent luxury accommodation and handle all transfers without extra costs to you."
      },
      {
        question: "How do I cancel my reservation?",
        answer: "You can cancel either by logging into your guest portal or by calling our customer care desk at +91 99000 11550."
      },
      {
        question: "If I cancel, will I get a full refund?",
        answer: "Refunds are processed back to the original payment method within 5-7 business days, depending on the cancellation notice period relative to your arrival date."
      }
    ]
  }
};

const FAQ = () => {
  const [activeAccordion, setActiveAccordion] = useState(null); // format: 'category-index'

  const toggleAccordion = (key) => {
    if (activeAccordion === key) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(key);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#fcfaf2] text-[#0d2b4e]  min-h-screen">
        
        {/* Hero Section */}
        <section
          className="relative h-[65vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542314831-c6a4d27ece91?q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-[#04121a]/60"></div>

          <div className="relative z-10 text-center px-4 max-w-7xl space-y-4">
            <span className="text-[#c8a64d] text-xs uppercase tracking-[6px] font-semibold">
              FAQ
            </span>
            <h1 className="text-4xl md:text-6xl font-light  text-white tracking-wide leading-tight">
              Frequently Asked Questions
            </h1>
          </div>
        </section>

        {/* FAQ Content Section */}
        <section className="py-24 px-6 max-w-4xl mx-auto">
          {Object.entries(faqData).map(([catKey, category]) => (
            <div key={catKey} className="mb-20">
              <h2 className="text-3xl  font-light mb-10 pb-4 border-b border-[#0d2b4e]/10">
                {category.title}
              </h2>

              <div className="space-y-4">
                {category.items.map((item, index) => {
                  const itemKey = `${catKey}-${index}`;
                  const isOpen = activeAccordion === itemKey;

                  return (
                    <div 
                      key={index} 
                      className="bg-[#f7f5ee] border border-gray-200/50 rounded-sm overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleAccordion(itemKey)}
                        className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-[#ebd0b0]/20 transition cursor-pointer"
                      >
                        <span className=" text-[#0d2b4e] text-sm md:text-base font-light">
                          {item.question}
                        </span>
                        <ChevronDown 
                          size={18} 
                          className={`text-gray-400 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-[#c8a64d]" : ""
                          }`}
                        />
                      </button>

                      {/* Animated expandable content panel */}
                      <div 
                        className={`transition-all duration-500 ease-in-out overflow-hidden ${
                          isOpen ? "max-h-[300px] border-t border-gray-200/35" : "max-h-0"
                        }`}
                      >
                        <div className="px-6 py-5 text-[#0d2b4e]/85 text-xs md:text-sm leading-relaxed  font-light">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

      </div>
      <Footer />
    </>
  );
};

export default FAQ;
