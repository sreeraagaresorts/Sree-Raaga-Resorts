import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Bell, AlertTriangle, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useToast } from "../../components/Toast";
import { API_URL } from "../../../config/api";

const UserSettings = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error("New passwords do not match!");
      return;
    }

    setUpdatingPassword(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      toast.success("Password updated successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to deactivate your account.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account? This action is irreversible, and your profile and bookings will be deleted."
    );

    if (!confirmDelete) return;

    setDeletingAccount(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          password: deletePassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account.");
      }

      toast.success("Your account has been deleted successfully.");
      
      // Clean up local auth state
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to home page
      navigate("/");
      // Force page reload to update navbar/app state
      window.location.reload();
    } catch (err) {
      toast.error(err.message || "Failed to delete account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#0d2b4e]">
      <h1 className="text-3xl  font-light mb-6 text-[#0d2b4e] border-b border-gray-200/50 pb-3">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SETTINGS LINKS/TABS
        <div className="bg-white border border-gray-200/50 p-5 rounded-none shadow-sm h-fit space-y-3">
          <p className="text-[10px] text-[#c8a64d] uppercase tracking-widest px-3 font-semibold">Preferences</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p className="px-3 py-2.5 bg-[#c8a64d]/10 text-[#c8a64d] rounded-none font-semibold border-l-2 border-[#c8a64d] uppercase tracking-wider text-[10px]">Security Settings</p>
            <p className="px-3 py-2.5 hover:bg-[#fdfeff] hover:text-[#c8a64d] rounded-none cursor-pointer uppercase tracking-wider text-[10px]">Notification Subscriptions</p>
            <p className="px-3 py-2.5 hover:bg-[#fdfeff] hover:text-[#c8a64d] rounded-none cursor-pointer uppercase tracking-wider text-[10px]">Privacy & Data</p>
          </div>
        </div> */}

        {/* FORMS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PASSWORD RESET CARD */}
          <div className="bg-white border border-gray-200/50 p-6 rounded-none shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#c8a64d] uppercase tracking-widest flex items-center gap-2 border-b border-gray-200/50 pb-3">
              <Lock size={14} /> Change Password
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs font-light">
              
              <div>
                <label className="block text-gray-500 mb-2 uppercase tracking-wider text-[12px] font-medium">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrent ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                    className="w-full bg-[#fdfeff] border border-gray-300 rounded-none p-3 pr-10 text-[#0d2b4e] outline-none focus:border-[#c8a64d] focus:bg-white transition text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a64d] cursor-pointer"
                  >
                    {showCurrent ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-2 uppercase tracking-wider text-[12px] font-medium">New Password</label>
                <div className="relative">
                  <input 
                    type={showNew ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                    className="w-full bg-[#fdfeff] border border-gray-300 rounded-none p-3 pr-10 text-[#0d2b4e] outline-none focus:border-[#c8a64d] focus:bg-white transition text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a64d] cursor-pointer"
                  >
                    {showNew ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 mb-2 uppercase tracking-wider text-[12px] font-medium">Confirm New Password</label>
                <div className="relative">
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                    className="w-full bg-[#fdfeff] border border-gray-300 rounded-none p-3 pr-10 text-[#0d2b4e] outline-none focus:border-[#c8a64d] focus:bg-white transition text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c8a64d] cursor-pointer"
                  >
                    {showConfirm ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={updatingPassword}
                  className="bg-[#c8a64d] text-white px-6 py-3 rounded-none font-semibold uppercase tracking-widest text-[14px] hover:bg-[#b09141] transition cursor-pointer shadow-sm flex items-center gap-2 disabled:bg-[#c8a64d]/60"
                >
                  {updatingPassword ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>

            </form>
          </div>

      
          {/* DANGER ZONE */}
          <div className="bg-red-50/50 border border-red-200 p-6 rounded-none shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2 border-b border-red-200 pb-3">
              <AlertTriangle size={14} /> Danger Zone
            </h3>
            <div className="space-y-4 text-xs font-light">
              <div className="space-y-1">
                <h4 className="font-semibold text-red-800 tracking-wide uppercase text-xs">Deactivate Guest Account</h4>
                <p className="text-gray-500 font-medium text-[14px]">Permanently remove your profile details and archive booking logs.</p>
              </div>
              
              <div className="pt-3 border-t border-red-200/50 space-y-2">
                <label className="block text-red-800 uppercase tracking-wider text-[12px] font-semibold">Confirm Password to Delete Account</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="password" 
                    required
                    placeholder="Enter your current password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="flex-1 bg-white border border-red-200 rounded-none p-3 text-[#0d2b4e] outline-none focus:border-red-500 transition text-xs"
                  />
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount || !deletePassword}
                    className="bg-red-600 text-white px-6 py-3 rounded-none font-bold uppercase tracking-widest text-[12px] hover:bg-red-700 transition cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:bg-red-600/40 shrink-0"
                  >
                    {deletingAccount ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" /> Deleting...
                      </>
                    ) : (
                      "Confirm Delete"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserSettings;