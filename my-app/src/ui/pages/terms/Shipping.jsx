import React from "react";

const Shipping = () => {
  return (
    <div className="space-y-8 text-[#0d2b4e]">
      <div>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] leading-relaxed">
          Sree Raaga Resorts does not sell or ship physical products through its website.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Service Delivery</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] mb-4 leading-relaxed">
          Upon successful booking and payment:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[15px]">
          <li>Booking confirmation will be sent by email and/or SMS.</li>
          <li>Reservation details will be available upon arrival at the resort.</li>
          <li>Event bookings will be confirmed through written communication from our team.</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Electronic Delivery</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] leading-relaxed">
          All services purchased through the website are delivered electronically in the form of booking confirmations and reservation records.
        </p>
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

export default Shipping;
