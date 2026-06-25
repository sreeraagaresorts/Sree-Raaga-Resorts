import React from "react";

const Refunds = () => {
  return (
    <div className="space-y-8 text-[#0d2b4e]">
      <div>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] leading-relaxed">
          Please read the cancellation and refund policy carefully. All bookings are subject to the following non-refundable terms.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Room Bookings</h3>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[15px]">
          <li>All cancellations are non-refundable.</li>
          <li>No-show bookings are non-refundable.</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Day Out Packages</h3>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[15px]">
          <li>All cancellations are non-refundable.</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Event & Banquet Bookings</h3>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[15px]">
          <li>All advance payments for weddings, receptions, corporate events, and banquet bookings are strictly non-refundable.</li>
          <li>Date changes are subject to availability.</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Refund Processing</h3>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[15px]">
          <li>No refunds will be processed under any circumstances.</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Force Majeure</h3>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[15px]">
          <li>No refunds will be provided for cancellations caused by natural disasters, government restrictions, pandemics, or circumstances beyond our control.</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Contact Information</h3>
        <div className="bg-[#fcfaf2] p-6 rounded-sm border border-[#0d2b4e]/5 space-y-2 text-[#2d5b8a] font-jost font-light text-sm md:text-[15px]">
          <p className="font-semibold text-[#0d2b4e]">Sree Raaga Resorts</p>
          <p>Email: <a href="mailto:support@sreeraagaresorts.in" className="hover:text-[#c8a64d] text-[#0d2b4e] transition duration-300 font-medium">support@sreeraagaresorts.in</a></p>
          <p>Phone: +91 89045 61155 | +91 8904381155</p>
        </div>
      </div>
    </div>
  );
};

export default Refunds;
