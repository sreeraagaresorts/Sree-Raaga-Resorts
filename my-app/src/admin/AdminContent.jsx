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

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

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

          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminContent;