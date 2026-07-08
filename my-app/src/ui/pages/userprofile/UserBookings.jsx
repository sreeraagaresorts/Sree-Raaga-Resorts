import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { RefreshCw, Calendar, Users, Maximize, Download } from "lucide-react";
import { API_URL } from "../../../config/api";
import html2pdf from "html2pdf.js";

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const bookingsRes = await axios.get(`${API_URL}/api/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const roomsRes = await axios.get(`${API_URL}/api/rooms`);
        
        if (bookingsRes.data.success) {
          setBookings(bookingsRes.data.data);
        } else {
          throw new Error(bookingsRes.data.message || "Failed to fetch bookings.");
        }
        
        if (roomsRes.data.success) {
          setRooms(roomsRes.data.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/uploads/")) return `${API_URL}${image}`;
    return `${API_URL}/uploads/${image}`;
  };

  const getBookingPricing = (b) => {
    const matchingRoom = rooms.find(r => r.id === b.room_id || r.name === b.room_name);
    const gstRate = b.room_gst_percentage !== undefined ? b.room_gst_percentage : (matchingRoom && matchingRoom.gst_percentage !== undefined ? matchingRoom.gst_percentage : 12);
    const isNewCalculation = b.subtotal !== undefined && b.subtotal > 0;
    const subtotal = isNewCalculation ? b.subtotal : parseFloat(b.total_price || 0);
    const services = b.services_price || 0;
    const discount = b.discount_price || 0;
    const gst = isNewCalculation ? b.gst_amount : (subtotal * gstRate) / 100;
    const total = isNewCalculation ? b.total_price : (subtotal + gst - discount);
    return { subtotal, services, discount, gst, total };
  };

  const handleDownloadInvoice = (booking) => {
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    const nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
    const pricing = getBookingPricing(booking);
    const amountDue = (booking.payment_method === "online" || booking.status === "confirmed" || booking.status === "checked_in") ? 0 : pricing.total;
    const paidDate = (booking.payment_method === "online" || booking.status === "confirmed" || booking.status === "checked_in")
      ? new Date(booking.created_at).toLocaleDateString("en-GB")
      : "N/A";

    const formattedCreated = new Date(booking.created_at).toLocaleDateString("en-GB");
    const formattedCheckIn = new Date(booking.check_in).toLocaleDateString("en-GB");
    const formattedCheckOut = new Date(booking.check_out).toLocaleDateString("en-GB");

    const storedUser = localStorage.getItem("user");
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const customerName = userObj ? userObj.full_name : "Valued Guest";
    const customerEmail = userObj ? userObj.email : "";
    const customerPhone = userObj ? userObj.phone : "";

    const element = document.createElement("div");
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; color: #0d2b4e; padding: 30px; line-height: 1.6; font-size: 15px; background: white;">
        <!-- Brand & Invoice Number -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr>
        <td style="vertical-align: top;">
  <img
    src="/logo2.png"
    alt="Sree Raaga Resorts"
    style="height: 90px; width: auto; display: block;"
  />
</td>
            <td style="text-align: right; vertical-align: top;">
              <h3 style="font-family: Georgia, serif; font-size: 26px; color: #0d2b4e; margin: 0; font-weight: 300;">Invoice</h3>
              <p style="font-size: 16px; font-weight: bold; margin: 5px 0 0 0; color: #0d2b4e;">#BK-${booking.id.toString().padStart(6, "0")}</p>
            </td>
          </tr>
        </table>

        <!-- Dates divider -->
        <div style="border-top: 1px solid #d1d5db; padding-top: 15px; margin-bottom: 25px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top; width: 50%;">
                <p style="font-size: 13px; color: rgba(13, 43, 78, 0.7); margin: 0; text-transform: uppercase; font-weight: bold;">Invoice date:</p>
                <p style="font-size: 16px; font-weight: bold; margin: 5px 0 0 0; color: #0d2b4e;">${formattedCreated}</p>
              </td>
              <td style="text-align: right; vertical-align: top; width: 50%;">
                <p style="font-size: 13px; color: rgba(13, 43, 78, 0.7); margin: 0; text-transform: uppercase; font-weight: bold;">Due date:</p>
                <p style="font-size: 16px; font-weight: bold; margin: 5px 0 0 0; color: #0d2b4e;">${formattedCheckIn}</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Supplier & Customer -->
        <div style="border-top: 1px solid #d1d5db; padding-top: 15px; margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="vertical-align: top; width: 50%;">
                <h4 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 8px 0; font-weight: normal; color: #0d2b4e;">Supplier</h4>
                <p style="font-size: 15px; font-weight: bold; margin: 0; color: #0d2b4e;">Sree Raaga Resorts</p>
                <p style="font-size: 14px; color: rgba(13, 43, 78, 0.8); margin: 5px 0 0 0; line-height: 1.5;">
                  123 Luxury Road, SRM District,<br />
                  Karnataka, 560001, India
                </p>
              </td>
              <td style="text-align: right; vertical-align: top; width: 50%;">
                <h4 style="font-family: Georgia, serif; font-size: 18px; margin: 0 0 8px 0; font-weight: normal; color: #0d2b4e;">Customer</h4>
                <p style="font-size: 15px; font-weight: bold; margin: 0; color: #0d2b4e;">${customerName}</p>
                <p style="font-size: 14px; color: rgba(13, 43, 78, 0.8); margin: 5px 0 0 0; line-height: 1.5;">
                  ${customerEmail}<br />
                  ${customerPhone}
                </p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Billing Table -->
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #d1d5db; margin-bottom: 30px;">
          <thead>
            <tr style="background-color: #f8f5ee;">
              <th style="padding: 10px; border: 1px solid #d1d5db; text-align: left; font-size: 14px; font-weight: bold; color: #0d2b4e; text-transform: uppercase;">Description</th>
              <th style="padding: 10px; border: 1px solid #d1d5db; text-align: right; font-size: 14px; font-weight: bold; color: #0d2b4e; text-transform: uppercase; width: 150px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; font-size: 14px; color: #0d2b4e; line-height: 1.5;">
                <strong>Room Stay (${booking.rooms || 1} x ${booking.room_name})</strong><br />
                <span style="font-size: 12px; color: rgba(13, 43, 78, 0.7); display: block; margin-top: 3px;">
                  ${formattedCheckIn} to ${formattedCheckOut} (${nights} Nights)
                </span>
              </td>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; text-align: right; font-size: 14px; color: #0d2b4e; vertical-align: top;">
                ₹${pricing.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
            ${pricing.services > 0 ? `
            <tr>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; font-size: 14px; color: #0d2b4e;">
                <strong>Extra Services</strong>
              </td>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; text-align: right; font-size: 14px; color: #0d2b4e;">
                ₹${pricing.services.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
            ` : ''}
            ${pricing.discount > 0 ? `
            <tr>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; font-size: 14px; color: #0d2b4e;">
                <strong>Coupon Discount ${booking.coupon_code ? `('${booking.coupon_code}')` : ''}</strong>
              </td>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; text-align: right; font-size: 14px; color: #10b981; font-weight: bold;">
                - ₹${pricing.discount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; font-size: 14px; color: #0d2b4e;">
                <strong>GST</strong>
              </td>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; text-align: right; font-size: 14px; color: #0d2b4e;">
                ₹${pricing.gst.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
            <tr style="background-color: #f9fafb; font-weight: bold; font-size: 15px;">
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; color: #0d2b4e;">Total</td>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; text-align: right; color: #0d2b4e; font-size: 16px;">
                ₹${pricing.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
            <tr style="background-color: #f9fafb; font-weight: bold; font-size: 15px;">
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; color: #0d2b4e;">Paid Date</td>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; text-align: right; color: #0d2b4e; font-weight: normal;">
                ${paidDate}
              </td>
            </tr>
            <tr style="background-color: #f9fafb; font-weight: bold; font-size: 15px;">
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; color: #0d2b4e;">Amount Due</td>
              <td style="padding: 12px 10px; border: 1px solid #d1d5db; text-align: right; color: #0d2b4e;">
                ₹${amountDue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Footer -->
        <div style="border-top: 1px solid #d1d5db; padding-top: 15px; text-align: center; font-size: 14px; color: rgba(13, 43, 78, 0.8); font-weight: bold; line-height: 1.6;">
          <div>www.sreeraagaresorts.com &nbsp;&nbsp;|&nbsp;&nbsp; info@sreeraagaresorts.com</div>
          <div style="margin-top: 5px;">+91 89045 61155 &nbsp;&nbsp;|&nbsp;&nbsp; +91 89043 81155</div>
        </div>
      </div>
    `;

    const opt = {
      margin:       15,
      filename:     `Invoice-BK-${booking.id.toString().padStart(6, '0')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "checked_in":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[#0d2b4e]/60 justify-center py-24">
        <RefreshCw className="animate-spin w-6 h-6 text-[#c8a64d]" />
        <span className="font-light tracking-wider">Loading your reservations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-none text-center max-w-md mx-auto mt-12 text-sm">
        Error: {error}
      </div>
    );
  }

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(bookings.length / bookingsPerPage);

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-[#0d2b4e]">
      <div className="flex justify-between items-center border-b border-gray-200/50 pb-3 mb-6">
        <h1 className="text-3xl font-medium text-[#0d2b4e]">My Bookings</h1>
        <Link
          to="/rooms"
          className="bg-[#c8a64d] text-white px-5 py-3 font-semibold text-xs uppercase tracking-widest hover:bg-[#b09141] transition cursor-pointer"
        >
          Browse Rooms
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-200/50 rounded-none p-12 text-center text-gray-500 font-light shadow-sm flex flex-col items-center justify-center">
          <p className="text-lg font-medium">No bookings yet.</p>
          <p className="text-xs mt-1 font-medium text-gray-500">Ready to experience luxury? Go book your favorite room!</p>
          <Link
            to="/rooms"
            className="mt-6 inline-block bg-[#c8a64d] text-white px-6 py-4 rounded-none font-semibold text-xs uppercase tracking-widest hover:bg-[#b09141] transition shadow-sm cursor-pointer"
          >
            Book Your Stay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {currentBookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-200/50 rounded-none overflow-hidden shadow-sm flex flex-col md:flex-row hover:border-[#c8a64d]/40 transition duration-300">
              
              {/* Room Image */}
              <div className="md:w-64 h-48 md:h-auto relative">
                <img 
                  src={getImageUrl(booking.room_image)} 
                  alt={booking.room_name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Booking Details */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h2 className="text-2xl   font-medium text-[#0d2b4e]">{booking.room_name}</h2>
                    <span className={`px-2.5 py-0.5 text-[11px] uppercase tracking-wider font-semibold rounded border w-fit ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs text-gray-500">
                    <div>
                      <p className="text-gray-500 text-[11px] uppercase tracking-widest font-medium">Check In</p>
                      <p className="font-semibold mt-1  text-[#0d2b4e]">{new Date(booking.check_in).toLocaleDateString("en-GB")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[11px] uppercase tracking-widest font-medium">Check Out</p>
                      <p className="font-semibold mt-1  text-[#0d2b4e]">{new Date(booking.check_out).toLocaleDateString("en-GB")}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-[11px] uppercase tracking-widest font-medium">Rooms</p>
                      <p className="font-semibold mt-1 text-[#0d2b4e]">
                        {booking.rooms || 1} {(booking.rooms || 1) === 1 ? "Room" : "Rooms"} + {booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ""}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Pricing Details</p>
                      {(() => {
                        const p = getBookingPricing(booking);
                        return (
                          <div className="mt-1 space-y-0.5 text-[11px] text-gray-700">
                            <div>Base Price: ₹{p.subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            {p.services > 0 && (
                              <div>Services: ₹{p.services.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            )}
                            {p.discount > 0 && (
                              <div className="text-emerald-600 font-semibold">Discount: -₹{p.discount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            )}
                            <div>GST: ₹{p.gst.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                            <div className="font-bold text-[#c8a64d] text-[15px] pt-1 border-t border-gray-100 mt-1">Total: ₹{p.total.toLocaleString()}</div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200/50 pt-4 mt-6 font-medium flex justify-between items-center text-[12px] sm:text-[14px] text-gray-500">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span>Booking ID: BK-{booking.id.toString().padStart(4, "0")}</span>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span>Booked on: {new Date(booking.created_at).toLocaleDateString("en-GB")}</span>
                  </div>
                  {(booking.status === "confirmed" || booking.status === "checked_in") && (
                    <button
                      onClick={() => handleDownloadInvoice(booking)}
                      className="px-4 py-2 bg-[#c8a64d] text-white font-semibold uppercase tracking-wider text-[12px] hover:bg-[#b09141] transition inline-flex items-center gap-1.5 cursor-pointer border-0"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Invoice
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition ${
                  currentPage === 1
                    ? "border-gray-200 text-gray-500 cursor-not-allowed bg-gray-50/50"
                    : "border-[#0d2b4e]/20 text-[#0d2b4e] hover:border-[#c8a64d] hover:text-[#c8a64d] cursor-pointer bg-white"
                }`}
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 border text-xs font-semibold transition ${
                    currentPage === page
                      ? "bg-[#c8a64d] border-[#c8a64d] text-white"
                      : "border-[#0d2b4e]/20 text-[#0d2b4e] hover:border-[#c8a64d] hover:text-[#c8a64d] cursor-pointer bg-white"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border text-xs font-semibold uppercase tracking-wider transition ${
                  currentPage === totalPages
                    ? "border-gray-200 text-gray-500 cursor-not-allowed bg-gray-50/50"
                    : "border-[#0d2b4e]/20 text-[#0d2b4e] hover:border-[#c8a64d] hover:text-[#c8a64d] cursor-pointer bg-white"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default UserBookings;

