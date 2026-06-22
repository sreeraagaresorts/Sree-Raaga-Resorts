import React from "react";

const Payments = () => {
  return (
    <div className="space-y-6">
      <p>All bookings must be secured with a valid credit card or advance digital payment. Room rates are subject to GST (Goods and Services Tax) as per government guidelines, which will be computed at checkout.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Booking Guarantees</h3>
      <p>Advance booking deposits must be received in full to guarantee a reservation. For peak seasons, full pre-payment is required. Payments are non-transferable to other guest accounts without prior approval from resort administration.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Razorpay & Checkout Security</h3>
      <p>For online payments, guests agree to use authentic credit/debit card credentials. The resort is not liable for transaction failures caused by network issues or card issuer limits.</p>
    </div>
  );
};

export default Payments;
