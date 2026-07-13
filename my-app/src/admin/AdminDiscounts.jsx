import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { API_URL } from "../config/api";
import {
  Tag,
  Plus,
  Trash2,
  Edit3,
  X,
  ChevronDown,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart2,
  RefreshCw,
  Ticket,
  Calendar,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const today = () => new Date().toISOString().split("T")[0];
const monthLater = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
};
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
};
const statusBadge = (s) => {
  if (s === "active")   return "bg-green-500/10 text-green-400 border-green-500/20";
  if (s === "expired")  return "bg-red-500/10   text-red-400   border-red-500/20";
  return                       "bg-amber-500/10 text-amber-400 border-amber-500/20";
};

const EMPTY_FORM = {
  code:            "",
  name:            "",
  description:     "",
  discount_type:   "percentage",
  discount_value:  "",
  max_cap:         "",
  target_service:  "ALL",
  start_date:      today(),
  expiry_date:     monthLater(),
  total_uses:      100,
  uses_per_user:   1,
};

/* ── shared input style (dark admin theme) ── */
const inp =
  "w-full bg-[#071524] border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-[#C8A64D] transition placeholder:text-white/20";

/* ─────────────────────────────────────────────
   SelectField
───────────────────────────────────────────── */
function SelectField({ value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inp} appearance-none pr-8 cursor-pointer`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#071524]">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Field label wrapper
───────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#C8A64D] text-xs uppercase tracking-widest font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Campaign Modal
───────────────────────────────────────────── */
function CampaignModal({ mode, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.code.trim())      { alert("Promo code is required.");    return; }
    if (!form.discount_value)   { alert("Discount value is required."); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#081A2F] w-full max-w-2xl rounded-xl border border-white/10 my-8">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
          <div>
            <span className="text-[#C8A64D] text-xs uppercase tracking-widest font-semibold block mb-1">
              Discount Campaign
            </span>
            <h2 className="text-xl font-bold text-white">
              {mode === "edit" ? "Edit Campaign Rule" : "Create New Campaign Rule"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">

          {/* Promo Code + Name */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Promo Code">
              <input
                className={inp}
                placeholder="E.G. SUMMER20"
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
              />
            </Field>
            <Field label="Campaign Name">
              <input
                className={inp}
                placeholder="Summer Flash Sale"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Field>
          </div>

          {/* Description */}
          <Field label="Description (Internal Notes)">
            <textarea
              className={`${inp} resize-none`}
              rows={3}
              placeholder="Get 20% off during the summer timeframe…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          {/* Discount Logic */}
          <div className="border border-white/10 rounded-xl p-5 bg-[#071524]/60">
            <p className="text-[#C8A64D] text-xs uppercase tracking-widest font-bold mb-4">
              Discount Logic
            </p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Field label="Discount Type">
                <SelectField
                  value={form.discount_type}
                  onChange={(v) => set("discount_type", v)}
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "flat",       label: "Flat Amount" },
                  ]}
                />
              </Field>
              <Field label="Value / Amount">
                <input
                  type="number" min="0"
                  className={inp}
                  placeholder="0"
                  value={form.discount_value}
                  onChange={(e) => set("discount_value", e.target.value)}
                />
              </Field>
              <Field label="Max Cap (₹)">
                <input
                  type="number" min="0"
                  className={inp}
                  placeholder="Leave blank for none"
                  value={form.max_cap}
                  onChange={(e) => set("max_cap", e.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Field label="Target Service">
                <SelectField
                  value={form.target_service}
                  onChange={(v) => set("target_service", v)}
                  options={[
                    { value: "ALL",    label: "ALL" },
                    { value: "ROOMS",  label: "Rooms" },
                    { value: "VILLAS", label: "Villas" },
                    // { value: "EVENTS", label: "Events" },
                    // { value: "FOOD",   label: "Food" },
                  ]}
                />
              </Field>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <div className="relative flex items-center">
                <DatePicker
                  selected={form.start_date ? new Date(form.start_date) : null}
                  onChange={(date) => {
                    if (date) {
                      const tzOffset = date.getTimezoneOffset() * 60000;
                      set("start_date", new Date(date.getTime() - tzOffset).toISOString().split("T")[0]);
                    } else {
                      set("start_date", "");
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className={inp + " pl-10 cursor-pointer"}
                  placeholderText="DD/MM/YYYY"
                  wrapperClassName="w-full"
                />
                <Calendar className="w-4 h-4 text-[#C8A64D] absolute left-3.5 pointer-events-none" />
              </div>
            </Field>
            <Field label="Expiration Date">
              <div className="relative flex items-center">
                <DatePicker
                  selected={form.expiry_date ? new Date(form.expiry_date) : null}
                  onChange={(date) => {
                    if (date) {
                      const tzOffset = date.getTimezoneOffset() * 60000;
                      set("expiry_date", new Date(date.getTime() - tzOffset).toISOString().split("T")[0]);
                    } else {
                      set("expiry_date", "");
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  className={inp + " pl-10 cursor-pointer"}
                  placeholderText="DD/MM/YYYY"
                  wrapperClassName="w-full"
                />
                <Calendar className="w-4 h-4 text-[#C8A64D] absolute left-3.5 pointer-events-none" />
              </div>
            </Field>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Total Uses Allowed">
              <input type="number" min="1" className={inp} value={form.total_uses}
                onChange={(e) => set("total_uses", e.target.value)} />
            </Field>
            <Field label="Uses Per Customer">
              <input type="number" min="1" className={inp} value={form.uses_per_user}
                onChange={(e) => set("uses_per_user", e.target.value)} />
            </Field>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white text-sm transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#C8A64D] text-black font-bold rounded-lg hover:bg-[#b09141] transition cursor-pointer text-sm"
            >
              {mode === "edit" ? "Update Campaign Rule" : "Save Campaign Rule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Delete Modal
───────────────────────────────────────────── */
function DeleteModal({ coupon, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#081A2F] w-full max-w-sm rounded-xl border border-white/10 p-6">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white text-center mb-2">Delete Coupon?</h3>
        <p className="text-sm text-white/50 text-center mb-6">
          "<span className="font-bold text-white">{coupon.code}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg font-bold transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Copy Code badge
───────────────────────────────────────────── */
function CopyCode({ code }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handle}
      title="Copy code"
      className="inline-flex items-center gap-1.5   bg-[#C8A64D]/10 hover:bg-[#C8A64D]/20 border border-[#C8A64D]/20 text-[#C8A64D] text-[17px] font-bold tracking-widest rounded transition cursor-pointer group"
    >
      <Tag className="w-1 h-1" />
      {code}
      {copied
        ? <CheckCircle2 className="w-2 h-2 text-green-400" />
        : <Copy className="w-2 h-2 text-white group-hover:text-[#C8A64D]" />}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function AdminDiscounts() {
  const [coupons, setCoupons]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showModal, setShowModal]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMsg, setToastMsg]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3000);
  };

  /* ── fetch ── */
  const fetchCoupons = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res   = await fetch(`${API_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data  = await res.json();
      if (data.success) setCoupons(data.data || []);
      else setCoupons([]);
    } catch {
      setCoupons([]);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
    const iv = setInterval(() => fetchCoupons(true), 10000);
    return () => clearInterval(iv);
  }, []);

  /* ── stats ── */
  const now = new Date();
  const stats = {
    total:       coupons.length,
    active:      coupons.filter((c) => c.status === "active"  || (!c.status && new Date(c.expiry_date) >= now)).length,
    expired:     coupons.filter((c) => c.status === "expired" || (!c.status && new Date(c.expiry_date) <  now)).length,
    redemptions: coupons.reduce((a, c) => a + (Number(c.used_count) || 0), 0),
  };

  /* ── save ── */
  const handleSave = async (form) => {
    const token  = localStorage.getItem("adminToken") || localStorage.getItem("token");
    const isEdit = Boolean(editTarget);
    const url    = isEdit ? `${API_URL}/api/coupons/${editTarget._id || editTarget.id}` : `${API_URL}/api/coupons`;
    try {
      const res  = await fetch(url, {
        method:  isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast(isEdit ? "Coupon updated!" : "Coupon created!");
        fetchCoupons(true);
      } else {
        throw new Error(data.message);
      }
    } catch {
      // optimistic local update when backend not wired
      if (isEdit) {
        setCoupons((p) => p.map((c) => (c === editTarget ? { ...editTarget, ...form } : c)));
      } else {
        setCoupons((p) => [{ ...form, _id: Date.now(), used_count: 0, status: "active" }, ...p]);
      }
      showToast(isEdit ? "Updated (local)" : "Created (local)");
    }
    setShowModal(false);
    setEditTarget(null);
  };

  /* ── delete ── */
  const handleDelete = async () => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    const id    = deleteTarget._id || deleteTarget.id;
    try {
      await fetch(`${API_URL}/api/coupons/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
    setCoupons((p) => p.filter((c) => c !== deleteTarget));
    showToast("Coupon deleted.", "error");
    setDeleteTarget(null);
  };

  const openCreate = () => { setEditTarget(null); setShowModal(true); };
  const openEdit   = (c)  => { setEditTarget(c);   setShowModal(true); };

  const couponStatus = (c) => {
    if (c.status) return c.status;
    return new Date(c.expiry_date) >= new Date() ? "active" : "expired";
  };

  /* ─────────────── render ─────────────── */
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-white/60 justify-center py-24">
        <RefreshCw className="animate-spin w-8 h-8 text-[#C8A64D]" />
        <span className="text-xl">Loading coupons...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white max-w-[180vh] mx-auto">

      {/* ── Toast ── */}
      {toastMsg && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold border ${
          toastMsg.type === "error"
            ? "bg-red-500/10 border-red-500/20 text-red-400"
            : "bg-green-500/10 border-green-500/20 text-green-400"
        }`}>
          {toastMsg.type === "error"
            ? <XCircle className="w-4 h-4" />
            : <CheckCircle2 className="w-4 h-4" />}
          {toastMsg.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Discounts &amp; Coupons</h1>
          <p className="text-white/50 text-sm mt-0.5">Manage promo codes, discounts and marketing campaigns.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#C8A64D] text-black font-bold rounded-lg hover:bg-[#b09141] transition cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Created",     value: stats.total,       Icon: Ticket,       bg: "bg-[#061A2F]/80 border-white/5",          ic: "bg-white/5 border-white/5",              iconCls: "text-[#C8A64D]" },
          { label: "Active Now",        value: stats.active,      Icon: CheckCircle2, bg: "bg-[#062419]/80 border-green-500/20",     ic: "bg-green-500/10 border-green-500/10",    iconCls: "text-green-400" },
          { label: "Expired",           value: stats.expired,     Icon: XCircle,      bg: "bg-[#240606]/80 border-red-500/20",       ic: "bg-red-500/10   border-red-500/10",      iconCls: "text-red-400" },
          { label: "Total Redemptions", value: stats.redemptions, Icon: BarChart2,    bg: "bg-[#1a1206]/80 border-amber-500/20",    ic: "bg-amber-500/10 border-amber-500/10",    iconCls: "text-amber-400" },
        ].map(({ label, value, Icon, bg, ic, iconCls }) => (
          <div key={label} className={`${bg} p-5 rounded-xl border hover:border-white/10 transition`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/50 text-xs">{label}</p>
                <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
              </div>
              <div className={`${ic} border p-2.5 rounded-lg`}>
                <Icon className={`w-5 h-5 ${iconCls}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Directory table ── */}
      <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden">
        {/* <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Coupon Directory</h2>
            <p className="text-white/40 text-xs mt-0.5">All active and past promo codes</p>
          </div>
          <span className="text-white text-xs font-semibold">{coupons.length} entries</span>
        </div> */}

        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <Ticket className="w-7 h-7 text-[#C8A64D]" />
            </div>
            <p className="text-white/40 text-sm">No coupons yet. Create your first campaign!</p>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2 bg-[#C8A64D] text-black font-bold rounded-lg hover:bg-[#b09141] transition cursor-pointer text-sm"
            >
              <Plus className="w-4 h-4" /> Create Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-white/2">
                  {["Coupon Code", "Campaign", "Discount Details", "Usage", "Validity", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-center px-5 py-3 text-[14px] uppercase tracking-widest text-[#c8a64d] font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => {
                  const status = couponStatus(c);
                  const discLabel =
                    c.discount_type === "percentage"
                      ? `${c.discount_value}% OFF`
                      : `₹${Number(c.discount_value).toLocaleString("en-IN")} OFF`;
                  return (
                    <tr key={c._id || i} className="border-b border-white/5 hover:bg-white/2 transition">
                      <td className="px-2 py-4 text-center">
                        <CopyCode code={c.code} />
                       
                      </td>
                      <td className="px-5 py-4 text-center text-white font-medium">
                        {c.name || "—"}
                        {c.target_service && c.target_service !== "ALL" && (
                          <span className="ml-1.5 text-[10px] text-[#C8A64D] bg-[#C8A64D]/10 border border-[#C8A64D]/20 px-1.5 py-0.5 rounded">
                            {c.target_service}
                            
                          </span>
                        )}
                         {c.description && (
                          <p className="text-[14px] px-4 py-2 text-white mx-auto mt-1 max-w-[250px] truncate">{c.description}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="font-bold text-white">{discLabel}</div>
                        <div className="text-[10px] uppercase text-white tracking-wider">{c.discount_type}</div>
                      </td>
                      <td className="px-5 py-4 text-center text-white">
                        <span className="font-bold">{c.used_count || 0}</span>
                        <span className="text-white"> / {c.total_uses || "∞"}</span>
                      </td>
                      <td className="px-5 py-4 text-center text-white text-xs whitespace-nowrap">
                        <div>{fmtDate(c.start_date)}</div>
                        <div className="text-white/20">→</div>
                        <div>{fmtDate(c.expiry_date)}</div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border rounded-full ${statusBadge(status)}`}>
                          {status === "active"  && <CheckCircle2 className="w-3 h-3" />}
                          {status === "expired" && <XCircle className="w-3 h-3" />}
                          {status === "inactive"&& <Clock className="w-3 h-3" />}
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(c)}
                            title="Edit"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(c)}
                            title="Delete"
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <CampaignModal
          mode={editTarget ? "edit" : "create"}
          initial={editTarget ? { ...editTarget } : undefined}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          coupon={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}


