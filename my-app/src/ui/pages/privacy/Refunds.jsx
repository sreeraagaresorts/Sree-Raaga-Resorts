import React from "react";

const Refunds = () => {
  return (
    <div className="space-y-6">
      <p>Our refund policies aim to offer flexibility while ensuring fair room allocation and resource management for the resort.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Room Cancellation & Refunds</h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 font-sans text-xs md:text-sm">
        <li><strong>7 Days or More Prior:</strong> 100% full refund returned to the original payment source.</li>
        <li><strong>2 to 7 Days Prior:</strong> 50% refund.</li>
        <li><strong>Under 48 Hours:</strong> Non-refundable.</li>
      </ul>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Service & Food Refund Policy</h3>
      <p>Food orders or spa services successfully delivered to guests are generally non-refundable. If you are dissatisfied with a dish or service quality, please notify the supervisor immediately, and we will issue a credit voucher or arrange a replacement.</p>
    </div>
  );
};

export default Refunds;
