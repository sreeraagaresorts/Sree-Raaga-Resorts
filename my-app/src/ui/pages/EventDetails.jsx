import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Maximize, 
  Users, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Calendar,
  Sparkles,
  VolumeX,
  Clock,
  Ban,
  X
} from "lucide-react";
import Navbar from "../components/RoomNav";
import Footer from "../components/Footer";
import { useToast } from "../components/Toast";
import { API_URL } from "../../config/api";
import { Helmet } from "react-helmet";

const fallbackEventDetails = {
  "1": {
    id: 1,
    name: "Luxury Wedding Ceremony",
    price: 150000,
    sqft: "5,000 Sq Ft",
    show_price: true,
    description: "Experience the wedding of your dreams in our luxury resort gardens. Includes premium catering options, stunning decorations, a dedicated coordinator, and seating for up to 300 guests.",
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800"
  },
  "2": {
    id: 2,
    name: "Corporate Annual Conference",
    price: 75000,
    sqft: "3,500 Sq Ft",
    show_price: false,
    description: "Host your corporate seminars, product launches, or annual retreats. Equipped with high-speed internet, state-of-the-art audio-visual systems, and professional corporate styling.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800"
  }
};

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [similarEvents, setSimilarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquireLoading, setEnquireLoading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91");
  const [email, setEmail] = useState("");
  const [selectedEventName, setSelectedEventName] = useState("");
  const [guests, setGuests] = useState("");

  // Slider State
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [is360ModalOpen, setIs360ModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/events/${id}`);
        if (!response.ok) {
          throw new Error("Event not found");
        }
        const data = await response.json();
        if (data.success) {
          setEvent(data.data);
          setSelectedEventName(data.data.name);
        } else {
          throw new Error(data.message || "Failed to load event details");
        }

        // Fetch other events for similar events section
        const allRes = await fetch(`${API_URL}/api/events`);
        if (allRes.ok) {
          const allData = await allRes.json();
          if (allData.success) {
            setAllEvents(allData.data);
            setSimilarEvents(allData.data.filter(e => e.id !== Number(id) && e.id !== id));
          }
        }
      } catch (err) {
        console.warn("API Offline or event not found, using fallback details:", err.message);
        const mockEvent = fallbackEventDetails[id] || fallbackEventDetails["1"];
        setEvent(mockEvent);
        setSelectedEventName(mockEvent.name);
        setAllEvents(Object.values(fallbackEventDetails));
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${API_URL}/uploads/${image}`;
  };

  const getGalleryImages = () => {
    const mainImg = getImageUrl(event?.image);
    const extraImgs = (event?.images || []).map(img => getImageUrl(img));
    return [mainImg, ...extraImgs].filter(Boolean);
  };
const handleEnquiry = async (e) => {
  e.preventDefault();

  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phone)) {
    toast.error("Phone number must be a valid 10-digit number starting with +91");
    return;
  }

  setEnquireLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/events/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
        email,
        eventName: selectedEventName,
        guests: Number(guests),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to submit enquiry.");
    }

    // Success Toast
    toast.success("Your enquiry has been submitted successfully!");

    // Reset Form
    setName("");
    setPhone("+91");
    setEmail("");
    setGuests("");

  } catch (err) {
    console.error(err);

    // Error Toast
    toast.error(err.message || "Something went wrong. Please try again.");
  } finally {
    setEnquireLoading(false);
  }
};

  const getSimilarEventsList = () => {
    if (similarEvents.length > 0) return similarEvents.slice(0, 3);
    return Object.values(fallbackEventDetails).filter(e => e.id !== Number(id) && e.id !== id).slice(0, 3);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="bg-[#fdfeff] text-[#0d2b4e] min-h-screen flex items-center justify-center">
          <p className="text-[#c8a64d] text-2xl font-light">Loading event details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error && !event) {
    return (
      <>
        <Navbar />
        <div className="bg-[#fdfeff] text-[#0d2b4e] min-h-screen flex items-center justify-center">
          <p className="text-red-500 text-2xl font-light">Error: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  const gallery = getGalleryImages();

  return (
    <>
    {/* 2. ADD HELMET COMPONENT HERE */}
      <Helmet>
  <title>Event Details | Sree Raaga Resorts</title>

  <meta
    name="description"
    content="Explore event details at Sree Raaga Resorts. Discover weddings, corporate events, family celebrations, conferences, and special occasions hosted in our elegant venues with exceptional hospitality."
  />

  <meta
    name="keywords"
    content="Sree Raaga Resorts events, event details, wedding venue, corporate events, conference venue, birthday celebration, anniversary party, banquet hall, resort events, event booking"
  />

  {/* Open Graph Tags */}
  <meta
    property="og:title"
    content="Event Details | Sree Raaga Resorts"
  />

  <meta
    property="og:description"
    content="Learn more about upcoming and featured events at Sree Raaga Resorts, including weddings, celebrations, corporate gatherings, and exclusive experiences."
  />

  <meta property="og:type" content="website" />
</Helmet>
      <Navbar />
      <div className="bg-[#fdfeff] text-[#0d2b4e] overflow-x-hidden min-h-screen pt-28 md:pt-36">
        
        {/* ================= MAIN CONTENT DETAILS GRID ================= */}
        <section className="py-12 max-w-7xl mx-auto md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[6.8fr_4.2fr] gap-16 items-start">
            
            {/* LEFT COLUMN */}
            <div className="space-y-8">
              
              {/* Gallery Image Slider */}
              <div className="relative overflow-hidden aspect-[80/55] shadow-md group select-none bg-black/5">
                {event?.view360Iframe && (
                  <button
                    onClick={() => setIs360ModalOpen(true)}
                    className="absolute top-4 left-4 z-30 bg-[#c8a64d] text-white px-2 py-1 md:px-4 md:py-2 text-sm font-bold shadow-xl hover:bg-[#b09141] transition cursor-pointer border border-white/20 uppercase tracking-widest"
                  >
                    360° View
                  </button>
                )}
                {gallery.map((src, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-all duration-750 ease-in-out ${
                      idx === galleryIndex ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0 pointer-events-none"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`Event Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Left/Right chevrons */}
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setGalleryIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1))}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-[#c8a64d] backdrop-blur-md text-white flex items-center justify-center transition-all z-20 border border-white/10 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft className="w-7 h-7" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setGalleryIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1))}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-[#c8a64d] backdrop-blur-md text-white flex items-center justify-center transition-all z-20 border border-white/10 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Price, Title & Specs */}
              <div className="select-none space-y-4 px-4 md:px-0">
                {event.show_price && event.price && (
                  <div className="font-semibold text-[25px] uppercase tracking-[2px] font-jost text-[#c8a64d]">
                    ₹{parseFloat(event.price).toLocaleString()} / Person
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium font-corm text-[#0d2b4e] leading-tight">
                  {event.name}
                </h1>
                
                {/* Specs Row */}
                <div className="flex flex-wrap items-center gap-6 text-[17px] text-gray-500 font-jost">
                  {event.sqft && (
                    <div className="flex items-center">
                      <Maximize className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                      <span>{event.sqft}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-[#c8a64d] mr-2" strokeWidth={1.2} />
                    <span>Flexible Capacity</span>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* About event */}
              <div className="space-y-4 max-w-3xl px-4 md:px-0">
                <h3 className="text-3xl font-medium font-corm text-[#0d2b4e]">
                  About Event & Celebration
                </h3>
                <p className="text-gray-500 text-sm md:text-[17px] leading-relaxed text-justify ">
                  {event.description}
                </p>
        
              </div>

              <hr className="border-gray-200/60" />

              {/* Event Amenities */}
              <div className="space-y-6 px-4 md:px-0">
                <h3 className="text-3xl font-medium font-corm text-[#0d2b4e] select-none">
                  Event Amenities
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 select-none">
                  {[
                    { 
                      icon: <Sparkles className="w-5 h-5 text-[#c8a64d]" strokeWidth={1.2} />, 
                      name: "Bespoke Styling & Decor" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="M2 12h20" />
                        </svg>
                      ), 
                      name: "Premium Catering Systems" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="14" rx="2" /><path d="M12 16v4" /><path d="M8 20h8" />
                        </svg>
                      ), 
                      name: "Advanced AV Equipment" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      ), 
                      name: "Guest Coordinator Support" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" />
                        </svg>
                      ), 
                      name: "High Speed Internet" 
                    },
                    { 
                      icon: (
                        <svg className="w-5 h-5 text-[#c8a64d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                        </svg>
                      ), 
                      name: "Ample Valet Parking" 
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs text-gray-700">
                      {item.icon}
                      <span className="text-[17px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-200/60" />

              {/* Event Rules */}
              <div className="space-y-6 px-4 md:px-0">
                <h3 className="text-3xl font-medium font-corm text-[#0d2b4e] select-none">
                  Event Policies & Rules
                </h3>
                
                <div className="space-y-4 select-none ">
                  {[
                    { icon: <Clock className="w-5 h-5 text-[#c8a64d]" strokeWidth={1.2} />, text: "Standard booking slot covers up to 12 hours" },
                    { icon: <VolumeX className="w-5 h-5 text-[#c8a64d]" strokeWidth={1.2} />, text: "Loud music is prohibited after 10:00 PM (Local Noise Regulations)" },
                    { icon: <ShieldAlert className="w-5 h-5 text-[#c8a64d]" strokeWidth={1.2} />, text: "Refunds on cancellations are governed by booking terms" },
                    { icon: <Ban className="w-5 h-5 text-[#c8a64d]" strokeWidth={1.2} />, text: "Outside catering is subject to kitchen approval and corkage charges" }
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-[17px] text-gray-700">
                      <div className="mt-0.5">{rule.icon}</div>
                      <span>{rule.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN (BOOKING SIDEBAR CARD) */}
            <div className="lg:sticky">
              <div className="border border-[#0d2b4e]/20 p-8 space-y-14 shadow-xl max-w-[400px] w-full mx-auto lg:ml-auto">
                
                <h3 className="text-3xl md:text-[30px] font-semibold font-corm text-[#0d2b4e] select-none text-center lg:text-left">
                  Book Your Event
                </h3>
                
                <form onSubmit={handleEnquiry} className="space-y-5 font-jost text-[#0d2b4e]">
                  <div>
                    <input 
                      type="text" 
                      required 
                      placeholder="NAME" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-white border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition-all font-jost"
                    />
                  </div>
                  
                  <div>
                    <input 
                      type="tel" 
                      required 
                      placeholder="PHONE (e.g. +91 90000 00000)" 
                      value={phone} 
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith("+91")) {
                          val = "+91";
                        }
                        const digits = val.slice(3).replace(/\D/g, "").slice(0, 10);
                        setPhone("+91" + digits);
                      }} 
                      className="w-full bg-white border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition-all font-jost"
                    />
                  </div>
                  
                  <div>
                    <input 
                      type="email" 
                      required 
                      placeholder="EMAIL" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-white border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition-all font-jost"
                    />
                  </div>
                  
                  <div>
                    <select 
                      value={selectedEventName} 
                      onChange={(e) => setSelectedEventName(e.target.value)} 
                      className="w-full bg-white border border-gray-200 px-4 py-5 text-[13px] text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition-all font-jost uppercase cursor-pointer"
                    >
                      {allEvents.map((evt) => (
                        <option key={evt.id || evt._id} value={evt.name}>
                          {evt.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <input 
                      type="number" 
                      required 
                      min="1" 
                      placeholder="NO OF GUESTS" 
                      value={guests} 
                      onChange={(e) => setGuests(e.target.value)} 
                      className="w-full bg-white border border-gray-200 px-4 py-5 text-[17px] text-[#0d2b4e] outline-none focus:border-[#c8a64d] transition-all font-jost"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={enquireLoading}
                    className="w-full mt-4 py-5 bg-[#f5d7b8] hover:bg-[#0d2b4e] text-[#0d2b4e] hover:text-white transition font-bold uppercase tracking-[2.5px] text-[17px] shadow-md disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer"
                  >
                    {enquireLoading ? "Processing..." : "ENQUIRE NOW"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>

   {/* ================= SIMILAR EVENTS SECTION ================= */}
<section className="py-20 md:py-28 px-4 sm:px-6 bg-[#fdfeff] border-t border-gray-100">
  <div className="max-w-[1400px] mx-auto">

    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end text-center sm:text-left gap-5 mb-12 md:mb-16 select-none">
      <div>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium font-corm text-[#0d2b4e]">
          Similar Events
        </h2>
      </div>

      <Link
        to="/events"
        className="group inline-flex items-center justify-center text-sm md:text-base font-bold uppercase tracking-[2px] text-[#0d2b4e] hover:text-[#c8a64d] transition-colors"
      >
        <span className="mr-2 border-b border-transparent group-hover:border-[#c8a64d] pb-0.5">
          View All Events
        </span>
        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>

    {/* Events Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
      {getSimilarEventsList().map((item) => (
        <div
          key={item.id || item._id}
          className="group flex flex-col items-center md:items-start text-center md:text-left"
        >
          {/* Image */}
          <Link
            to={`/events/${item.id || item._id}`}
            className="block relative overflow-hidden aspect-[76/62] w-full  shadow-md mb-6"
          >
            <div className="absolute inset-0 bg-[#0d2b4e]/10 group-hover:bg-[#0d2b4e]/40 transition-all duration-500 z-10"></div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-36 md:h-36 rounded-full border border-white/20 bg-[#c8a64d]/85 hover:bg-[#c8a64d] text-white flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 z-20 backdrop-blur-sm select-none">
              <span className="text-xs md:text-sm font-semibold tracking-[3px]">
                VIEW DETAILS
              </span>
            </div>

            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          {/* Content */}
          <div className="w-full select-none">
            <div className="flex flex-row justify-between items-start md:items-end gap-3 border-b border-gray-100 pb-4 mb-4">

              <div>
                <h4 className="text-2xl sm:text-3xl md:text-4xl font-medium font-corm text-[#0d2b4e] transition-colors duration-300">
                  {item.name}
                </h4>

                {item.sqft && (
                  <span className="text-sm text-[#c8a64d] font-bold tracking-[2px] text-start  uppercase font-jost mt-2 block">
                    {item.sqft}
                  </span>
                )}
              </div>

              {item.show_price && item.price && (
                <div className="text-center md:text-right">
                  <span className="text-xl md:text-2xl font-bold text-[#c8a64d]">
                    ₹{parseFloat(item.price).toLocaleString()}
                  </span>

                  <span className="block text-sm md:text-base text-gray-700 tracking-wider uppercase font-semibold">
                    / Package
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

      </div>
      {/* 360 View Modal */}
      {is360ModalOpen && event?.view360Iframe && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          {/* Click outside overlay */}
          <div className="absolute inset-0" onClick={() => setIs360ModalOpen(false)}></div>
          
          {/* 360 View Container */}
          <div className="w-full h-full max-w-6xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl relative flex items-center justify-center border border-white/10 z-10 bg-black">
            <button 
              onClick={() => setIs360ModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-[#c8a64d] z-[110] transition p-2 cursor-pointer bg-black/50 hover:bg-black/80 rounded-full"
              title="Close 360 View"
            >
              <X className="w-6 h-6" />
            </button>
            <div 
              className="w-full h-full [&_iframe]:!w-full [&_iframe]:!h-full [&_iframe]:!max-w-full [&_iframe]:!border-0"
              dangerouslySetInnerHTML={{ __html: event.view360Iframe }}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default EventDetails;
