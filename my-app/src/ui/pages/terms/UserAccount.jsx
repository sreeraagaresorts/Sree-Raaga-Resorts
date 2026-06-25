import React from "react";

const UserAccount = () => {
  return (
    <div className="space-y-8 text-[#0d2b4e]">
      <div>
        <p className="text-[#2d5b8a] font-jost font-medium text-[17px] leading-relaxed">
          Please review the terms regarding the creation, use, security, and management of user accounts on the Sree Raaga Resorts website.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Account Registration</h3>
        <p className="text-[#2d5b8a] font-jost font-medium text-[17px] leading-relaxed">
          Users may create an account to manage bookings, reservations, and communication preferences.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Account Information</h3>
        <p className="text-[#2d5b8a] font-jost font-medium text-[17px] leading-relaxed">
          Users must provide accurate and complete information during registration.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Password Security</h3>
        <p className="text-[#2d5b8a] font-jost font-medium text-[17px] leading-relaxed">
          Users are responsible for maintaining the confidentiality of their login credentials.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Unauthorized Access</h3>
        <p className="text-[#2d5b8a] font-jost font-medium text-[17px] leading-relaxed">
          Users must immediately notify Sree Raaga Resorts if they suspect unauthorized access to their account.
        </p>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Account Suspension</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] mb-4 leading-relaxed">
          We reserve the right to suspend or terminate accounts involved in:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-[#2d5b8a] font-jost font-medium text-[15px]">
          <li>Fraudulent activity</li>
          <li>Misuse of the website</li>
          <li>Violation of resort policies</li>
          <li>Illegal activities</li>
        </ul>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Account Deletion</h3>
        <p className="text-[#2d5b8a] font-jost font-light text-[15px] mb-4 leading-relaxed">
          Users may request account deletion by contacting:
        </p>
        <div className="bg-[#fcfaf2] p-6 rounded-sm border border-[#0d2b4e]/5 space-y-2 text-[#2d5b8a] font-jost font-light text-sm md:text-[15px]">
          <p className="font-semibold text-[#0d2b4e]">Sree Raaga Resorts</p>
          <p className="font-medium">Email: <a href="mailto:info@sreeraagaresorts.in" className="hover:text-[#c8a64d] text-[#0d2b4e] transition duration-300 font-medium">info@sreeraagaresorts.in</a></p>
          <p className="font-medium">Phone: +91 89045 61155 | +91 8904381155</p>
        </div>
      </div>

      <div className="border-t border-[#0d2b4e]/10 pt-6">
        <h3 className="text-2xl  font-corm font-medium tracking-wide mb-4 text-[#0d2b4e]">Limitation of Liability</h3>
        <p className="text-[#2d5b8a] font-jost font-medium text-[17px] leading-relaxed">
          Sree Raaga Resorts shall not be liable for losses resulting from unauthorized access caused by user negligence.
        </p>
      </div>
    </div>
  );
};

export default UserAccount;
