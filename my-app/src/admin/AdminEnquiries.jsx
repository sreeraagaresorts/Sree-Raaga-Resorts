import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { RefreshCw, MessageSquare, Mail, Phone, Calendar, Users } from "lucide-react";
import { useToast } from "../ui/components/Toast";
import { API_URL } from "../config/api";
import { formatPhoneNumber } from "../utils/phoneFormatter";

const AdminEnquiries = () => {
  const toast = useToast();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab state: "event" or "contact"
  const [activeTab, setActiveTab] = useState("event");

  // Event enquiries states
  const [eventEnquiries, setEventEnquiries] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventSearch, setEventSearch] = useState("");

  // Contact enquiries states
  const [contactEnquiries, setContactEnquiries] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState("");

  // Sync active tab with search parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "contact") {
      setActiveTab("contact");
    } else {
      setActiveTab("event");
    }
  }, [searchParams]);

  // Handle tab switch
  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    setActiveTab(tab);
  };

  // ----------------------------------------------------
  // Event Enquiries Operations
  // ----------------------------------------------------
  const fetchEventEnquiries = async (silent = false) => {
    if (!silent) setEventLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/events/enquiries/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEventEnquiries(data.data);
      } else {
        throw new Error(data.message || "Failed to load event enquiries.");
      }
    } catch (err) {
      console.error(err);
      if (!silent) toast.error(err.message);
    } finally {
      if (!silent) setEventLoading(false);
    }
  };

  const handleMarkEventEnquiryAsRead = async (id) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/events/enquiries/admin/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark enquiry as read.");
      }
      toast.success("Event enquiry marked as read!");
      fetchEventEnquiries();
      // Dispatch custom event to let AdminLayout know immediately
      window.dispatchEvent(new CustomEvent("eventEnquiryMarkedRead", { detail: { id } }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteEventEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/events/enquiries/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete enquiry.");
      }
      toast.success("Event enquiry deleted successfully!");
      fetchEventEnquiries();
      // Dispatch event to also remove it from notifications just in case
      window.dispatchEvent(new CustomEvent("eventEnquiryDeleted", { detail: { id } }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ----------------------------------------------------
  // Contact Form Enquiries Operations
  // ----------------------------------------------------
  const fetchContactEnquiries = async (silent = false) => {
    if (!silent) setContactLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setContactEnquiries(data.data);
      } else {
        throw new Error(data.message || "Failed to load contact inquiries.");
      }
    } catch (err) {
      console.error(err);
      if (!silent) toast.error(err.message);
    } finally {
      if (!silent) setContactLoading(false);
    }
  };

  const handleMarkContactEnquiryAsRead = async (id) => {
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/contact/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to mark message as read.");
      }
      toast.success("Contact message marked as read!");
      fetchContactEnquiries();
      // Dispatch custom event to let AdminLayout know immediately
      window.dispatchEvent(new CustomEvent("inquiryMarkedRead", { detail: { id } }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteContactEnquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete message.");
      }
      toast.success("Contact message deleted successfully!");
      fetchContactEnquiries();
      window.dispatchEvent(new CustomEvent("inquiryDeleted", { detail: { id } }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Fetch initial data for both categories on mount and run periodic syncs
  useEffect(() => {
    fetchEventEnquiries();
    fetchContactEnquiries();

    const interval = setInterval(() => {
      fetchEventEnquiries(true);
      fetchContactEnquiries(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Filter lists
  const filteredEventEnquiries = eventEnquiries.filter((enq) => {
    const term = eventSearch.toLowerCase();
    return (
      enq.name?.toLowerCase().includes(term) ||
      enq.email?.toLowerCase().includes(term) ||
      enq.eventName?.toLowerCase().includes(term) ||
      enq.phone?.includes(term)
    );
  });

  const filteredContactEnquiries = contactEnquiries.filter((enq) => {
    const term = contactSearch.toLowerCase();
    return (
      enq.name?.toLowerCase().includes(term) ||
      enq.email?.toLowerCase().includes(term) ||
      enq.subject?.toLowerCase().includes(term) ||
      enq.message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Enquiries Dashboard</h1>
        <p className="text-white/50 text-sm">
          Monitor and manage incoming enquiries from event planning and contact submissions.
        </p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-2 gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange("event")}
              className={`pb-3 px-1 font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "event"
                  ? "text-[#C8A64D] border-b-2 border-[#C8A64D]"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              Event Enquiries ({eventEnquiries.filter(e => e.status !== "Read").length})
            </button>
            <button
              onClick={() => handleTabChange("contact")}
              className={`pb-3 px-1 font-bold text-sm tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                activeTab === "contact"
                  ? "text-[#C8A64D] border-b-2 border-[#C8A64D]"
                  : "text-white/40 hover:text-white/80"
              }`}
            >
              Contact Form Enquiries ({contactEnquiries.filter(c => c.status !== "Read").length})
            </button>
          </div>

          {/* Search and Refresh */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={activeTab === "event" ? "Search event enquiries..." : "Search contact messages..."}
              value={activeTab === "event" ? eventSearch : contactSearch}
              onChange={(e) => (activeTab === "event" ? setEventSearch(e.target.value) : setContactSearch(e.target.value))}
              className="bg-[#081A2F] border border-white/10 rounded-lg px-4 py-1.5 text-xs text-white outline-none focus:border-[#C8A64D] transition w-52 sm:w-64"
            />
            <button
              onClick={() => (activeTab === "event" ? fetchEventEnquiries() : fetchContactEnquiries())}
              className="p-2 text-[#C8A64D] hover:bg-[#C8A64D]/10 rounded transition cursor-pointer"
              title="Refresh"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  (activeTab === "event" ? eventLoading : contactLoading) ? "animate-spin" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* ----------------------------------------------------
            TAB 1: EVENT ENQUIRIES
            ---------------------------------------------------- */}
        {activeTab === "event" && (
          <div className="bg-[#081A2F] border border-white/10 rounded-xl overflow-hidden shadow-xl">
            {eventLoading && eventEnquiries.length === 0 ? (
              <div className="flex items-center gap-2 text-white/60 justify-center py-12">
                <RefreshCw className="animate-spin w-6 h-6 text-[#C8A64D]" />
                <span>Loading event enquiries...</span>
              </div>
            ) : filteredEventEnquiries.length === 0 ? (
              <div className="p-12 text-center text-white/40">
                <Calendar className="w-12 h-12 mx-auto text-[#C8A64D]/40 mb-3" />
                <p className="text-base font-semibold">No event enquiries found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-white/80">
                  <thead className="bg-[#071524] text-[#C8A64D] text-xs uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Client Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Event Package</th>
                      <th className="px-6 py-4 text-center">Guests</th>
                      <th className="px-6 py-4">Submitted At</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredEventEnquiries.map((enquiry) => (
                      <tr key={enquiry.id || enquiry._id} className="hover:bg-white/2 text-white transition">
                        <td className="px-6 py-4 font-bold text-[#C8A64D]">#{enquiry.id}</td>
                        <td className="px-6 py-4 font-semibold text-white">{enquiry.name}</td>
                        <td className="px-6 py-4 text-white">
                          {formatPhoneNumber(enquiry.phone)} <br />
                          <span className="text-xs text-white">{enquiry.email}</span>
                        </td>
                        <td className="px-6 py-4 font-medium text-white">{enquiry.eventName}</td>
                        <td className="px-6 py-4 text-center font-bold">{enquiry.guests}</td>
                        <td className="px-6 py-4 text-white">
                          {new Date(enquiry.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${
                              enquiry.status === "Read"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}
                          >
                            {enquiry.status || "Unread"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center items-center gap-2">
                            {enquiry.status !== "Read" && (
                              <button
                                onClick={() => handleMarkEventEnquiryAsRead(enquiry.id || enquiry._id)}
                                className="bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-xs border-0 whitespace-nowrap"
                                title="Mark as Read"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteEventEnquiry(enquiry.id || enquiry._id)}
                              className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-xs border-0 whitespace-nowrap"
                              title="Delete Enquiry"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: CONTACT FORM ENQUIRIES
            ---------------------------------------------------- */}
        {activeTab === "contact" && (
          <div className="space-y-4">
            {contactLoading && contactEnquiries.length === 0 ? (
              <div className="flex items-center gap-2 text-white/60 justify-center py-12 bg-[#081A2F] border border-white/10 rounded-xl shadow-xl">
                <RefreshCw className="animate-spin w-6 h-6 text-[#C8A64D]" />
                <span>Loading contact enquiries...</span>
              </div>
            ) : filteredContactEnquiries.length === 0 ? (
              <div className="p-12 text-center text-white/40 bg-[#081A2F] border border-white/10 rounded-xl shadow-xl">
                <MessageSquare className="w-12 h-12 mx-auto text-[#C8A64D]/40 mb-3" />
                <p className="text-base font-semibold">No contact inquiries found</p>
              </div>
            ) : (
              <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2">
                {filteredContactEnquiries.map((inq) => (
                  <div
                    key={inq.id || inq._id}
                    className="bg-[#081A2F] border border-white/10 p-5 rounded-xl hover:border-[#C8A64D]/30 transition flex flex-col gap-4 shadow-md"
                  >
                    {/* Header Row: client details on left, action buttons on right */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="font-bold text-white text-base">{inq.name}</span>
                          <span className="text-xs text-white/30">•</span>
                          <span className="text-xs text-white/50">
                            {new Date(inq.created_at || Date.now()).toLocaleString()}
                          </span>
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ml-2 ${
                              inq.status === "Read"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}
                          >
                            {inq.status || "Unread"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/60">
                          <a
                            href={`mailto:${inq.email}`}
                            className="text-white text-[16px] flex items-center gap-1.5 transition"
                          >
                            <Mail className="w-3.5 h-3.5" /> {inq.email}
                          </a>
                          {inq.phone && (
                            <a
                              href={`tel:${inq.phone}`}
                              className="text-white text-[16px] flex items-center gap-1.5 transition"
                            >
                              <Phone className="w-3.5 h-3.5" /> {formatPhoneNumber(inq.phone)}
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row gap-2 shrink-0 self-stretch sm:self-auto justify-end">
                        {inq.status !== "Read" && (
                          <button
                            type="button"
                            onClick={() => handleMarkContactEnquiryAsRead(inq.id || inq._id)}
                            className="bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-xs border-0 whitespace-nowrap"
                            title="Mark as Read"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteContactEnquiry(inq.id || inq._id)}
                          className="bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition cursor-pointer font-bold text-xs border-0 whitespace-nowrap"
                          title="Delete Inquiry"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Subject and Message details stretch fully below */}
                    <div className="border-t border-white/5 pt-3">
                      <p className="text-xs text-[#C8A64D] font-bold uppercase tracking-wider">
                        Subject: {inq.subject}
                      </p>
                      <p className="text-white/90 text-[16px] mt-1.5 leading-relaxed bg-[#071524] p-4 rounded-lg border border-white/5 whitespace-pre-line w-full">
                        {inq.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEnquiries;
