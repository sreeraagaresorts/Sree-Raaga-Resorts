import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Printer, ArrowLeft, RefreshCw } from "lucide-react";
import { API_URL } from "../../../config/api";

const InvoicePage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const res = await axios.get(`${API_URL}/api/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const foundBooking = res.data.data.find((b) => b.id === Number(bookingId));
          if (foundBooking) {
            setBooking(foundBooking);
          } else {
            setError("Booking not found.");
          }
        } else {
          setError("Failed to load booking details.");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center text-[#0d2b4e]/60">
        <RefreshCw className="animate-spin w-6 h-6 text-[#c8a64d] mr-2" />
        <span className="font-light tracking-wider">Generating invoice...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 max-w-md shadow-sm">
          <p className="font-semibold">Error Loading Invoice</p>
          <p className="text-sm mt-2 text-red-600">{error || "Could not retrieve booking details."}</p>
        </div>
        <button
          onClick={() => navigate("/dashboard/bookings")}
          className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-[#0d2b4e] text-white text-xs font-semibold uppercase tracking-widest hover:bg-black transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Bookings
        </button>
      </div>
    );
  }

  const start = new Date(booking.check_in);
  const end = new Date(booking.check_out);
  const nights = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) || 1;
  const totalPrice = parseFloat(booking.total_price || 0);
  const basePrice = totalPrice / 1.18;
  const gstAmount = totalPrice - basePrice;

  return (
    <div className="min-h-screen bg-[#f9f8f6] flex flex-col items-center py-10 px-4 text-[#0d2b4e]">
      <style>
        {`
          @media print {
            body {
              background: white !important;
              color: black !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .no-print {
              display: none !important;
            }
            #invoice-print-area {
              border: none !important;
              box-shadow: none !important;
              padding: 40px !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              background: white !important;
            }
          }
          .print-color-adjust {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        `}
      </style>

      {/* TOP CONTROL PANEL */}
      <div className="max-w-3xl w-full flex justify-between items-center mb-6 bg-white p-4 shadow-sm no-print border border-gray-200/30">
        <button
          onClick={() => navigate("/dashboard/bookings")}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-[#0d2b4e] uppercase tracking-wider transition bg-transparent border-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bookings
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#0d2b4e] text-white px-5 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-black transition cursor-pointer border-0"
        >
          <Printer className="w-4 h-4" /> Print This Invoice
        </button>
      </div>

      {/* INVOICE CARD */}
      <div 
        id="invoice-print-area" 
        className="bg-white w-full max-w-3xl p-12 md:p-16 border border-gray-200/50 shadow-sm print-color-adjust"
      >
        <div className="space-y-12">
          {/* Brand & Invoice Number */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-serif text-[#0d2b4e] tracking-widest uppercase font-semibold leading-none">
                Sree Raaga
              </h2>
              <span className="text-[12px] tracking-[4px] uppercase text-[#c8a64d] font-bold block mt-1.5">
                Resorts
              </span>
            </div>
            <div className="text-right">
              <h3 className="text-3xl font-serif text-[#0d2b4e] font-light">
                Invoice #
              </h3>
              <p className="text-base font-semibold tracking-wider text-gray-700 mt-1.5">
                BK-{booking.id.toString().padStart(6, "0")}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex justify-between items-start pt-6 border-t border-gray-300">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Invoice date:</p>
              <p className="text-base font-semibold text-[#0d2b4e] mt-1.5">
                {new Date(booking.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Due date:</p>
              <p className="text-base font-semibold text-[#0d2b4e] mt-1.5">
                {new Date(booking.check_in).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Supplier & Customer */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-300">
            <div>
              <h4 className="text-lg font-serif text-[#0d2b4e] font-light mb-3">Supplier</h4>
              <p className="text-sm font-semibold text-[#0d2b4e]">Sree Raaga Resorts</p>
              <p className="text-xs font-light text-gray-500 mt-1.5 leading-relaxed">
                123 Luxury Road, SRM District,<br />
                Karnataka, 560001, India
              </p>
            </div>
            <div className="text-right">
              <h4 className="text-lg font-serif text-[#0d2b4e] font-light mb-3">Customer</h4>
              <p className="text-sm font-semibold text-[#0d2b4e]">{user ? user.full_name : "Valued Guest"}</p>
              <p className="text-xs font-light text-gray-500 mt-1.5 leading-relaxed">
                {user ? user.email : ""}<br />
                {user ? user.phone : ""}
              </p>
            </div>
          </div>

          {/* Billing Table */}
          <div className="pt-6">
            <table className="w-full text-left border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#f8f5ee] text-xs uppercase tracking-wider font-semibold text-gray-600">
                  <th className="py-3.5 px-4 border border-gray-300">Description</th>
                  <th className="py-3.5 px-4 text-right border border-gray-300">Price</th>
                  <th className="py-3.5 px-4 text-right border border-gray-300">GST (18%)</th>
                  <th className="py-3.5 px-4 text-right border border-gray-300">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm font-light text-gray-600">
                <tr>
                  <td className="py-6 px-4 font-normal text-[#0d2b4e] leading-relaxed border border-gray-300">
                    {booking.room_name} Room Stay<br />
                    <span className="text-xs text-gray-400 font-light mt-1 block">
                      {new Date(booking.check_in).toLocaleDateString()} to {new Date(booking.check_out).toLocaleDateString()} ({nights} Nights)
                    </span>
                  </td>
                  <td className="py-6 px-4 text-right border border-gray-300">
                    ₹{basePrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="py-6 px-4 text-right border border-gray-300">
                    ₹{gstAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="py-6 px-4 text-right font-medium text-[#0d2b4e] border border-gray-300">
                    ₹{totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
                {/* Subtotal row */}
                <tr className="font-semibold text-base text-[#0d2b4e]">
                  <td className="py-6 px-4 border border-gray-300 bg-gray-50/50" colSpan="2">Total Due</td>
                  <td className="py-6 px-4 text-right border border-gray-300 bg-gray-50/50" colSpan="2">
                    ₹{totalPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer details */}
          <div className="flex justify-between items-center pt-8 border-t border-gray-300 text-xs text-gray-500 font-medium">
            <span>www.sreeraagaresorts.com</span>
            <span>bookings@sreeraagaresorts.com</span>
            <span>+91 99000 11550</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
