import React, { useState, useEffect } from "react";
import {
  Save, RefreshCw, Building, Shield, Settings, Mail, Phone, MapPin,
  Clock, Percent, CalendarDays, UtensilsCrossed, BellRing, UserCheck,
  Users, PackageSearch,MessageCircle , ShieldCheck, MailOpen, Printer, Sparkles,
  ChevronRight,
} from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";

/* ─── Add-on module definitions ─────────────────────────────── */
const ADDONS = [
  {
    id: "restaurant",
    icon: UtensilsCrossed,
    label: "Restaurant & POS",
    desc: "Manage dine-in orders, tables, billing and point-of-sale operations.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.2)",
  },
  {
    id: "roomservice",
    icon: BellRing,
    label: "Room Service",
    desc: "Track and fulfil in-room food & amenity requests from guests.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    id: "attendance",
    icon: UserCheck,
    label: "Attendance",
    desc: "Record daily staff attendance, leaves and shift scheduling.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    id: "staff",
    icon: Users,
    label: "Staff Management",
    desc: "Manage employee profiles, roles, payroll and performance records.",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
  },
  {
    id: "inventory",
    icon: PackageSearch,
    label: "Inventory & Purchases",
    desc: "Monitor stock levels, supplier orders and purchase history.",
    color: "#C8A64D",
    bg: "rgba(200,166,77,0.08)",
    border: "rgba(200,166,77,0.2)",
  },
  {
    id: "roles",
    icon: ShieldCheck,
    label: "Roles Management",
    desc: "Define permission sets and assign granular access control to staff.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
  {
    id: "emailtpl",
    icon: MailOpen,
    label: "Email Templates",
    desc: "Customise automated guest emails for booking, check-in and feedback.",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.2)",
  },
  {
    id: "printer",
    icon: Printer,
    label: "Printer",
    desc: "Configure receipt and invoice printers for front-desk and restaurant.",
    color: "#64748b",
    bg: "rgba(100,116,139,0.08)",
    border: "rgba(100,116,139,0.2)",
  },
];

/* ─── Add-on Card (Now Default Active) ───────────────────────── */
const AddonCard = ({ addon }) => {
  const Icon = addon.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? addon.bg : "rgba(8,26,47,0.6)",
        border: `1px solid ${hovered ? addon.border : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 32px ${addon.bg}` : "none",
      }}
      className="relative rounded-xl p-5 flex flex-col gap-3 cursor-pointer overflow-hidden"
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: addon.bg, border: `1px solid ${addon.border}` }}
      >
        <Icon size={22} style={{ color: addon.color }} />
      </div>

      {/* Text */}
      <div>
        <p className="text-white font-semibold text-sm mb-1">{addon.label}</p>
        <p className="text-white/40 text-xs leading-relaxed">{addon.desc}</p>
      </div>



      {/* Subtle glow circle */}
      {hovered && (
        <div
          className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: addon.color, opacity: 0.07, filter: "blur(20px)" }}
        />
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────── */
const AdminSettings = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
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
    } catch {
      toast.error("Error connecting to settings server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          resortName, contactEmail, contactPhone, address,
          checkInTime, checkOutTime,
          gstRate: Number(gstRate),
          minAdvanceDays: Number(minAdvanceDays),
          enableEmailAlerts,
        }),
      });
      const data = await res.json();
      if (data.success) toast.success("Settings saved successfully!");
      else toast.error(data.message || "Failed to save settings.");
    } catch {
      toast.error("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        <RefreshCw className="animate-spin text-[#C8A64D] mb-4" size={32} />
        <p className="text-white/60">Loading system settings...</p>
      </div>
    );
  }

  const inputCls =
    "w-full bg-[#050F1C] border border-white/10 rounded-lg p-3 outline-none focus:border-[#C8A64D] transition text-white placeholder:text-white/20 text-sm";
  const labelCls = "block text-[#C8A64D] text-[10px] uppercase tracking-widest mb-1.5 font-semibold";

  return (
    <div className="space-y-6 text-white max-w-5xl mx-auto pb-16">

      {/* ── HEADER ── */}
      <div className="flex justify-between items-center border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="text-[#C8A64D]" size={22} /> Add-on Modules
          </h1>
          {/* <p className="text-white/40 text-sm mt-0.5">
            Configure resort metadata, guest reservation rules and feature modules.
          </p> */}
        </div>
      </div>

      {/* ══ SYSTEM MODULES (Active by default) ══ */}
      <div className="space-y-4">
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADDONS.map((addon) => (
            <AddonCard key={addon.id} addon={addon} />
          ))}
        </div>
<div className="text-center text-white">
  <p className="text-lg">
    Expand your Resort management system with powerful add-on modules designed
    for your business.
  </p>

  <div className="flex items-center justify-center gap-2 mt-2 text-lg">
    <span></span>

 <a
  href="https://wa.me/916362604933?text=%F0%9F%91%8B%20Hi!%20I'm%20interested%20in%20adding%20more%20features%20to%20my%20Resort%20Management%20System."
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-white transition-colors"
>
<button className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors text-white font-medium cursor-pointer">
    <span>Contact Us</span>
  <img
    src="/whatsapp.png"
    alt="WhatsApp"
    className="w-5 h-5 invert mb-1"
  />

</button>
</a>
  </div>
</div>

      </div>


    </div>
  );
};

/* ── Reusable Save Button ── */
const SaveBtn = ({ saving }) => (
  <button
    type="submit"
    disabled={saving}
    className="bg-[#C8A64D] text-[#071524] px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold cursor-pointer hover:bg-[#b09141] transition disabled:opacity-50 text-sm"
  >
    {saving ? (
      <><RefreshCw className="animate-spin" size={16} /> Saving...</>
    ) : (
      <><Save size={16} /> Save Settings</>
    )}
  </button>
);

export default AdminSettings;