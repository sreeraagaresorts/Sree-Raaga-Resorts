import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { API_URL } from "../config/api";
import {
  Save,
  RefreshCw,
  AlertCircle,
  LayoutTemplate,
  MessageSquare,
  Info,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";

const AdminContent=()=> {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  const [content, setContent] = useState({
    homeHeroTitle: "",
    homeHeroSubtitle: "",
    aboutHeadline: "",
    aboutText: "",
    contactText: "",
  });

  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setInquiries(data.data);
      } else {
        throw new Error(data.message || "Failed to load inquiries.");
      }
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/contact/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Inquiry deleted successfully.");
        setTimeout(() => setSuccessMessage(null), 2000);
        setInquiries((prev) => prev.filter((item) => item.id !== id));
      } else {
        throw new Error(data.message || "Failed to delete inquiry.");
      }
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      setSuccessMessage("Content updated (UI demo only).");

      setTimeout(() => setSuccessMessage(null), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Editor</h1>
          <p className="text-white/50 text-sm">
            Update landing pages, marketing copy, and contact info.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#C8A64D] text-[#071524] px-6 py-2.5 rounded-lg font-bold flex items-center gap-2"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Saving..." : "Save Content"}
        </button>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-500/10 text-red-400 rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}

      {/* Layout */}
      <div className="bg-[#081A2F] border border-white/5 rounded-xl flex flex-col md:flex-row overflow-hidden min-h-[600px]">

        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#071524]/50 p-4 flex flex-col gap-2">

          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
              activeTab === "home"
                ? "bg-[#C8A64D]/10 text-[#C8A64D]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutTemplate className="w-4 h-4" />
            Home
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("about")}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
              activeTab === "about"
                ? "bg-[#C8A64D]/10 text-[#C8A64D]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Info className="w-4 h-4" />
            About
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contact")}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 ${
              activeTab === "contact"
                ? "bg-[#C8A64D]/10 text-[#C8A64D]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Contact
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-3 rounded-lg flex items-center justify-between ${
              activeTab === "inquiries"
                ? "bg-[#C8A64D]/10 text-[#C8A64D]"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries</span>
            </div>
            {inquiries.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {inquiries.length}
              </span>
            )}
          </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSave} className="space-y-6">

            {activeTab === "home" && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">Home Content</h2>

                <input
                  placeholder="Hero Title"
                  value={content.homeHeroTitle}
                  onChange={(e) =>
                    setContent({ ...content, homeHeroTitle: e.target.value })
                  }
                  className="w-full p-3 bg-[#071524] text-white rounded"
                />

                <textarea
                  placeholder="Hero Subtitle"
                  value={content.homeHeroSubtitle}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      homeHeroSubtitle: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-[#071524] text-white rounded"
                />
              </div>
            )}

            {activeTab === "about" && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">About Content</h2>

                <input
                  placeholder="Headline"
                  value={content.aboutHeadline}
                  onChange={(e) =>
                    setContent({ ...content, aboutHeadline: e.target.value })
                  }
                  className="w-full p-3 bg-[#071524] text-white rounded"
                />

                <textarea
                  placeholder="About Text"
                  value={content.aboutText}
                  onChange={(e) =>
                    setContent({ ...content, aboutText: e.target.value })
                  }
                  className="w-full p-3 bg-[#071524] text-white rounded h-40"
                />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4">
                <h2 className="text-white font-bold text-lg">
                  Contact Content
                </h2>

                <textarea
                  placeholder="Contact Text"
                  value={content.contactText}
                  onChange={(e) =>
                    setContent({ ...content, contactText: e.target.value })
                  }
                  className="w-full p-3 bg-[#071524] text-white rounded h-40"
                />
              </div>
            )}

            {activeTab === "inquiries" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <h2 className="text-white font-bold text-lg">Contact Form Inquiries</h2>
                  <button
                    type="button"
                    onClick={fetchInquiries}
                    className="p-2 text-[#C8A64D] hover:bg-[#C8A64D]/10 rounded transition cursor-pointer"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingInquiries ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {loadingInquiries && inquiries.length === 0 ? (
                  <div className="flex items-center gap-2 text-white/60 justify-center py-12">
                    <RefreshCw className="animate-spin w-5 h-5 text-[#C8A64D]" />
                    <span>Loading inquiries...</span>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <MessageSquare className="w-12 h-12 mx-auto text-[#C8A64D]/40 mb-3" />
                    <p className="text-base font-semibold">No contact inquiries found</p>
                    <p className="text-xs text-white/30 mt-1">Customer queries submitted via the contact form will show up here.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="bg-[#071524] border border-white/10 p-5 rounded-lg hover:border-[#C8A64D]/30 transition flex flex-col sm:flex-row justify-between gap-4 items-start">
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-white text-base">{inq.name}</span>
                            <span className="text-xs text-white/40">•</span>
                            <span className="text-xs text-white/40">{new Date(inq.created_at || Date.now()).toLocaleString()}</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/60">
                            <a href={`mailto:${inq.email}`} className="hover:text-[#C8A64D] flex items-center gap-1.5 transition">
                              <Mail className="w-3.5 h-3.5" /> {inq.email}
                            </a>
                            {inq.phone && (
                              <a href={`tel:${inq.phone}`} className="hover:text-[#C8A64D] flex items-center gap-1.5 transition">
                                <Phone className="w-3.5 h-3.5" /> {inq.phone}
                              </a>
                            )}
                          </div>

                          <div className="border-t border-white/5 pt-2 mt-2">
                            <p className="text-xs text-[#C8A64D] font-semibold uppercase tracking-wider">Subject: {inq.subject}</p>
                            <p className="text-white/80 text-sm mt-1 leading-relaxed bg-[#081a2f]/40 p-3 rounded border border-white/5 whitespace-pre-line">{inq.message}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition cursor-pointer self-start shrink-0"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminContent;