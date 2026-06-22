import React from "react";

const Payments = () => {
  return (
    <div className="space-y-6">
      <p>We implement strict financial security controls to guarantee safe online and offline payment handling. Your account registration details and billing credentials are encrypted using industry-standard Secure Socket Layer (SSL) technology.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Financial Privacy Protection</h3>
      <p>We do not store raw credit card numbers or sensitive payment authentication pins on our servers. All online reservations are processed via certified external gateways (Razorpay, Stripe) under compliance with PCI-DSS guidelines.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Account Integrity</h3>
      <p>Guests are responsible for maintaining the confidentiality of their portal login credentials. If you detect unauthorized login activity on your account, please reach out to us at support@sreeraagaresorts.in immediately.</p>
    </div>
  );
};

export default Payments;
