import React from "react";

const Cookies = () => {
  return (
    <div className="space-y-8 text-[#0d2b4e]">
      <div>
        <p className="text-xs text-[#c8a64d] uppercase tracking-[2px] font-semibold font-jost mb-2">Cookie Policy</p>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] leading-relaxed">
          This Cookie Policy explains how Sree Raaga Resorts uses cookies and similar technologies to improve your experience on our website.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">What Are Cookies?</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] leading-relaxed">
          Cookies are small text files stored on your device that help improve website functionality and user experience.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">How We Use Cookies</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] mb-4 leading-relaxed">
          We use cookies to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-light text-[15px]">
          <li>Remember user preferences</li>
          <li>Improve website performance</li>
          <li>Analyze website traffic</li>
          <li>Enhance security</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Third-Party Cookies</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] leading-relaxed">
          Our website may use third-party services such as analytics tools and payment gateways that may place cookies on your device.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Managing Cookies</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] leading-relaxed">
          You can modify your browser settings to block or delete cookies at any time. Disabling cookies may affect website functionality.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl font-corm font-light tracking-wide mb-4 text-[#0d2b4e]">Contact Information</h3>
        <div className="bg-[#fcfaf2] p-6 rounded-sm border border-[#0d2b4e]/5 space-y-2 text-[#2d5b8a] font-jost font-light text-sm md:text-[15px]">
          <p className="font-semibold text-[#0d2b4e]">Sree Raaga Resorts</p>
          <p>Email: <a href="mailto:support@sreeraagaresorts.in" className="hover:text-[#c8a64d] text-[#0d2b4e] transition duration-300 font-medium">support@sreeraagaresorts.in</a></p>
          <p>Phone: +91 89045 61155 | +91 8904381155</p>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
