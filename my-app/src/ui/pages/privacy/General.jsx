import React from "react";

const General = () => {
  return (
    <div className="space-y-8 text-[#0d2b4e]">
      <div>
        <p className="text-xs text-[#c8a64d] uppercase tracking-[2px] font-semibold font-jost mb-2">Last Updated: June 2026</p>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] leading-relaxed">
          Sree Raaga Resorts ("we," "our," or "us") values your privacy and is committed to protecting your personal information.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Information We Collect</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] mb-4 leading-relaxed">
          We may collect the following information from our guests and users:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[17px]">
          <li>Name</li>
          <li>Phone Number</li>
          <li>Email Address</li>
          <li>Postal Address</li>
          <li>Booking Details</li>
          <li>Payment Information</li>
          <li>IP Address and Device Information</li>
          <li>Communication Records</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">How We Use Your Information</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] mb-4 leading-relaxed">
          We use the collected information to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[17px]">
          <li>Process resort bookings and reservations</li>
          <li>Provide customer support</li>
          <li>Send booking confirmations and updates</li>
          <li>Improve our services and website</li>
          <li>Comply with legal obligations</li>
          <li>Prevent fraud and unauthorized transactions</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Payment Security</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] leading-relaxed">
          Online payments are processed through secure third-party payment gateways. We do not store complete card or banking information on our servers.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Information Sharing</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] mb-4 leading-relaxed">
          We do not sell or rent personal information. Information may be shared with:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[17px]">
          <li>Payment gateway providers</li>
          <li>Government authorities when legally required</li>
          <li>Service providers involved in reservation management</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Data Security</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] leading-relaxed">
          We implement reasonable security measures to protect personal information from unauthorized access, misuse, or disclosure.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Cookies</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[17px] leading-relaxed">
          Our website may use cookies to improve browsing experience and website performance. For more details, please refer to our Cookie Policy tab.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Contact Information</h3>
        <div className="bg-[#fcfaf2] p-6 rounded-sm border border-[#0d2b4e]/5 space-y-2 text-[#2d5b8a] font-jost font-light text-sm md:text-[17px]">
          <p className="font-semibold text-[#0d2b4e]">Sree Raaga Resorts</p>
          <p>Email: <a href="mailto:support@sreeraagaresorts.in" className="hover:text-[#c8a64d] text-[#0d2b4e] transition duration-300 font-medium">support@sreeraagaresorts.in</a></p>
          <p>Phone: +91 89045 61155 | +91 8904381155</p>
        </div>
      </div>
    </div>
  );
};

export default General;
