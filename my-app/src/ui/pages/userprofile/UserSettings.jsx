import React, { useState } from "react";
import { Lock, Bell, AlertTriangle } from "lucide-react";
import { useToast } from "../../components/Toast";

const UserSettings = () => {
  const toast = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully! (UI Demo only)");
    setPasswordData({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      <h1 className="text-3xl font-serif font-light mb-6 text-white border-b border-yellow-500/10 pb-3">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SETTINGS LINKS/TABS */}
        <div className="bg-zinc-950 border border-yellow-500/20 p-5 rounded-none shadow-2xl h-fit space-y-3">
          <p className="text-[10px] text-yellow-500 uppercase tracking-widest px-3 font-semibold">Preferences</p>
          <div className="text-xs text-gray-400 space-y-1">
            <p className="px-3 py-2.5 bg-yellow-500/10 text-yellow-500 rounded-none font-semibold border-l-2 border-yellow-500 uppercase tracking-wider text-[10px]">Security Settings</p>
            <p className="px-3 py-2.5 hover:bg-zinc-900 hover:text-white rounded-none cursor-pointer uppercase tracking-wider text-[10px]">Notification Subscriptions</p>
            <p className="px-3 py-2.5 hover:bg-zinc-900 hover:text-white rounded-none cursor-pointer uppercase tracking-wider text-[10px]">Privacy & Data</p>
          </div>
        </div>

        {/* FORMS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PASSWORD RESET CARD */}
          <div className="bg-zinc-950 border border-yellow-500/20 p-6 rounded-none shadow-2xl space-y-6">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2 border-b border-yellow-500/10 pb-3">
              <Lock size={14} /> Change Password
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs font-light">
              
              <div>
                <label className="block text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Current Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full bg-[#071524] bg-zinc-900 border border-yellow-500/15 rounded-none p-3 text-white outline-none focus:border-yellow-500 transition text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 uppercase tracking-wider text-[10px]">New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full bg-[#071524] bg-zinc-900 border border-yellow-500/15 rounded-none p-3 text-white outline-none focus:border-yellow-500 transition text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 uppercase tracking-wider text-[10px]">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full bg-[#071524] bg-zinc-900 border border-yellow-500/15 rounded-none p-3 text-white outline-none focus:border-yellow-500 transition text-xs"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="bg-yellow-500 text-black px-6 py-3 rounded-none font-semibold uppercase tracking-widest text-[10px] hover:bg-yellow-400 transition cursor-pointer">
                  Update Password
                </button>
              </div>

            </form>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="bg-zinc-950 border border-yellow-500/20 p-6 rounded-none shadow-2xl space-y-6">
            <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2 border-b border-yellow-500/10 pb-3">
              <Bell size={14} /> Notification Channels
            </h3>

            <div className="space-y-4 text-xs font-light">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-semibold text-white tracking-wide uppercase text-xs">Email Subscriptions</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed">Receive booking confirmations, itinerary invoices, and receipt updates via email.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  className="w-4 h-4 accent-yellow-500 cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center border-t border-yellow-500/10 pt-4">
                <div className="space-y-1">
                  <h4 className="font-semibold text-white tracking-wide uppercase text-xs">SMS Booking Updates</h4>
                  <p className="text-gray-400 text-[10px] leading-relaxed">Receive SMS text notifications on status updates (Confirmations, Cancellations, Check-ins).</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={smsAlerts}
                  onChange={() => setSmsAlerts(!smsAlerts)}
                  className="w-4 h-4 accent-yellow-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* DANGER ZONE */}
          <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-none shadow-2xl space-y-4">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 border-b border-red-500/20 pb-3">
              <AlertTriangle size={14} /> Danger Zone
            </h3>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs font-light">
              <div className="space-y-1">
                <h4 className="font-semibold text-red-200 tracking-wide uppercase text-xs">Deactivate Guest Account</h4>
                <p className="text-gray-400 text-[10px]">Permanently remove your profile details and archive booking logs.</p>
              </div>
              <button 
                onClick={() => toast.info("Please contact resort admin at info@sreeraagaresorts.in for account deletion.")}
                className="bg-red-500/10 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-none font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserSettings;