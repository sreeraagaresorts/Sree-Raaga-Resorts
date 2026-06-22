import React from "react";
import { Bell, Calendar, Info, ShieldCheck } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "booking",
    title: "Booking Confirmed",
    message: "Your reservation (BK-0001) for the Luxury Suite has been confirmed. See you on June 20th!",
    time: "2 hours ago",
    icon: Calendar,
  },
  {
    id: 2,
    type: "info",
    title: "Welcome to Sree Raaga Resorts",
    message: "Thank you for creating an account. Enjoy premium luxury guest privileges in our portal.",
    time: "1 day ago",
    icon: Info,
  },
  {
    id: 3,
    type: "security",
    title: "Account Setup Complete",
    message: "Your profile phone and email details have been verified successfully.",
    time: "2 days ago",
    icon: ShieldCheck,
  }
];

const UserNotifications = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#0d2b4e]">
      <h1 className="text-3xl font-serif font-light mb-6 text-[#0d2b4e] border-b border-gray-200/50 pb-3">My Notifications</h1>

      {mockNotifications.length === 0 ? (
        <div className="bg-white border border-gray-200/50 rounded-none p-12 text-center text-gray-500 font-light shadow-sm">
          <Bell size={40} className="mx-auto text-[#c8a64d]/50 mb-3" />
          <p className="text-lg font-medium">No new notifications.</p>
          <p className="text-xs mt-1 text-gray-400">We'll alert you here when there are updates on your stays!</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200/50 rounded-none overflow-hidden shadow-sm divide-y divide-gray-200/50">
          {mockNotifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div key={notif.id} className="p-5 flex gap-4 hover:bg-gray-50 transition duration-200 items-start">
                <div className="p-2.5 rounded-none border border-[#c8a64d]/25 bg-[#fcfaf2] text-[#c8a64d] shrink-0">
                  <Icon size={18} />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-sm text-[#0d2b4e] tracking-wide uppercase text-xs">{notif.title}</h4>
                    <span className="text-[10px] text-gray-500 font-light">{notif.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{notif.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserNotifications;