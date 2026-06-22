import React from "react";

const Orders = () => {
  return (
    <div className="space-y-6">
      <p>Our guest portal allows you to place, view, and manage dining and service orders online. This section explains the data policies surrounding internal orders and room service deliveries.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Order Information Usage</h3>
      <p>We log your room number, delivery selections, and guest preferences to provide swift room service and accurate billing. This information is shared internally only with kitchen staff, delivery team members, and front-desk accounts.</p>
      
      <h3 className="text-xl  text-[#0d2b4e] mt-8 mb-4">Modifying Service Orders</h3>
      <p>Food and dining orders placed from your room can be cancelled or adjusted within 5 minutes of order placement. Once the kitchen has initiated preparation, modifications or cancellations are no longer permitted.</p>
    </div>
  );
};

export default Orders;
