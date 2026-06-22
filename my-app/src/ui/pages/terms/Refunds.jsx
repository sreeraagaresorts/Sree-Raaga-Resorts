import React from "react";

const Refunds = () => {
  return (
    <div className="space-y-6">
      <p>Cancellations and refund requests are governed by the specific room tariff selected at the time of reservation.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Cancellation Fees</h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 font-sans text-xs md:text-sm">
        <li><strong>Over 7 Days Prior to Arrival:</strong> Full refund minus a minimal payment processing gateway fee.</li>
        <li><strong>2 to 7 Days Prior to Arrival:</strong> 50% cancellation fee applies.</li>
        <li><strong>Within 48 Hours of Arrival:</strong> 100% cancellation fee applies.</li>
      </ul>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Refund Settlements</h3>
      <p>Approved refunds are processed to the original bank account or card within 5 to 7 working days. Cash refunds are not provided for digital bookings.</p>
    </div>
  );
};

export default Refunds;
