import React, { useState, useEffect } from "react";
import { Save, RefreshCw, Building, Shield, Settings, Mail, Phone, MapPin, Clock, Percent, CalendarDays } from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";

const AdminSettings = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [resortName, setResortName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [minAdvanceDays, setMinAdvanceDays] = useState("");
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);

  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        const s = data.data;
        setResortName(s.resortName || "");
        setContactEmail(s.contactEmail || "");
        setContactPhone(s.contactPhone || "");
        setAddress(s.address || "");
        setCheckInTime(s.checkInTime || "");
        setCheckOutTime(s.checkOutTime || "");
        setGstRate(s.gstRate !== undefined ? s.gstRate : "");
        setMinAdvanceDays(s.minAdvanceDays !== undefined ? s.minAdvanceDays : "");
        setEnableEmailAlerts(s.enableEmailAlerts !== undefined ? s.enableEmailAlerts : true);
      } else {
        toast.error(data.message || "Failed to load settings.");
      }
    } catch (err) {
      toast.error("Error connecting to settings server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          resortName,
          contactEmail,
          contactPhone,
          address,
          checkInTime,
          checkOutTime,
          gstRate: Number(gstRate),
          minAdvanceDays: Number(minAdvanceDays),
          enableEmailAlerts,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save settings.");
      }
    } catch (err) {
      toast.error("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        <RefreshCw className="animate-spin text-yellow-500 mb-4" size={32} />
        <p className="text-white/60">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="text-[#C8A64D]" size={24} /> Settings Panel
          </h1>
          <p className="text-white/50 text-sm">
            Configure resort metadata, guest reservation rules, and email options.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: Resort Details */}
        <div className="bg-[#081A2F] border border-white/10 p-6 rounded-xl space-y-6">
          <h2 className="text-lg font-semibold text-[#C8A64D] border-b border-white/5 pb-3 flex items-center gap-2">
            <Building size={20} /> Resort Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Resort Name</label>
              <input
                type="text"
                required
                value={resortName}
                onChange={(e) => setResortName(e.target.value)}
                className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 outline-none focus:border-yellow-500 transition text-white"
                placeholder="e.g. Sree Raaga Resorts"
              />
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Contact Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 pl-10 outline-none focus:border-yellow-500 transition text-white"
                  placeholder="support@sreeraagaresorts.in"
                />
                <Mail className="absolute left-3 top-3.5 text-white/40" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Contact Phone</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 pl-10 outline-none focus:border-yellow-500 transition text-white"
                  placeholder="+91 98765 43210"
                />
                <Phone className="absolute left-3 top-3.5 text-white/40" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Address</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 pl-10 outline-none focus:border-yellow-500 transition text-white"
                  placeholder="Resort address"
                />
                <MapPin className="absolute left-3 top-3.5 text-white/40" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Rules & Policy */}
        <div className="bg-[#081A2F] border border-white/10 p-6 rounded-xl space-y-6">
          <h2 className="text-lg font-semibold text-[#C8A64D] border-b border-white/5 pb-3 flex items-center gap-2">
            <Shield size={20} /> Booking & Policy Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Check-In Time</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 pl-10 outline-none focus:border-yellow-500 transition text-white"
                  placeholder="e.g. 12:00 PM"
                />
                <Clock className="absolute left-3 top-3.5 text-white/40" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Check-Out Time</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 pl-10 outline-none focus:border-yellow-500 transition text-white"
                  placeholder="e.g. 11:00 AM"
                />
                <Clock className="absolute left-3 top-3.5 text-white/40" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">GST Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 pl-10 outline-none focus:border-yellow-500 transition text-white"
                  placeholder="e.g. 12"
                />
                <Percent className="absolute left-3 top-3.5 text-white/40" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-yellow-500 text-xs uppercase tracking-widest mb-2">Min Advance (Days)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="0"
                  value={minAdvanceDays}
                  onChange={(e) => setMinAdvanceDays(e.target.value)}
                  className="w-full bg-[#071524] border border-white/10 rounded-lg p-3 pl-10 outline-none focus:border-yellow-500 transition text-white"
                  placeholder="e.g. 1"
                />
                <CalendarDays className="absolute left-3 top-3.5 text-white/40" size={18} />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={enableEmailAlerts}
                onChange={(e) => setEnableEmailAlerts(e.target.checked)}
                className="w-5 h-5 rounded border-white/10 bg-[#071524] text-yellow-500 focus:ring-yellow-500 accent-[#C8A64D]"
              />
              <span className="text-sm text-white/80">Send automated email alerts to customers on registration and booking updates.</span>
            </label>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#C8A64D] text-black px-6 py-3 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin" size={18} /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;