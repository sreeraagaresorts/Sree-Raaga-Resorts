import React from "react";

const General = () => {
  return (
    <div className="space-y-6">
      <p>At Sree Raaga Resorts, we prioritize the privacy and security of our guests' personal data. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you visit our resort, use our website, or make reservations.</p>
      <p>By using our services, you consent to the data collection and usage practices described in this policy. We reserve the right to update this policy periodically to reflect changes in legal or operational standards.</p>
      
      <h3 className="text-xl font-serif text-[#0d2b4e] mt-8 mb-4">1. Information We Collect</h3>
      <ul className="list-disc pl-6 space-y-2 text-gray-600 font-sans text-xs md:text-sm">
        <li><strong>Personal Identifiable Information:</strong> Name, email address, phone number, passport or ID details for check-in compliance.</li>
        <li><strong>Payment Information:</strong> Credit/debit card numbers, billing addresses, and transaction histories securely processed through our gateway partners.</li>
        <li><strong>Technical Data:</strong> IP address, browser type, cookies, and usage patterns gathered during your visits to our online portal.</li>
      </ul>
    </div>
  );
};

export default General;
