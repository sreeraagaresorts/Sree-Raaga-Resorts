import React, { useState } from "react";
import AdminRooms from "./AdminRooms";
import AdminEvents from "./AdminEvents";
import { BedDouble, CalendarDays } from "lucide-react";

const AdminHotelManagement = () => {
  const [activeTab, setActiveTab] = useState("rooms");

  return (
    <div className="space-y-6 text-white max-w-[200vh] mx-auto select-none">
      
      {/* TABS HEADER */}
      <div className="flex gap-4 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("rooms")}
          className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition cursor-pointer text-sm ${
            activeTab === "rooms"
              ? "border-[#C8A64D] text-[#C8A64D]"
              : "border-transparent text-white/60  hover:text-white"
          } bg-transparent border-t-0 uppercase border-x-0 outline-none`}
        >
          <BedDouble size={16} /> Rooms Inventory
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition cursor-pointer text-sm ${
            activeTab === "events"
              ? "border-[#C8A64D] text-[#C8A64D]"
              : "border-transparent text-white/60 hover:text-white"
          } bg-transparent border-t-0 uppercase border-x-0 outline-none`}
        >
          <CalendarDays size={16} /> Event Management
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === "rooms" ? (
          <AdminRooms />
        ) : (
          <AdminEvents />
        )}
      </div>
      
    </div>
  );
};

export default AdminHotelManagement;
