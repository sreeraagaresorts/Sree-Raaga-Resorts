import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import { formatPhoneNumber } from '../utils/phoneFormatter';
import {
  Download,
  Search,
  IndianRupee,
  Wallet,
  Activity,
  Undo2,
  RefreshCw,
  Calendar,
} from 'lucide-react';

const AdminBilling = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        throw new Error(data.message || "Failed to load bookings for billing.");
      }
    } catch (err) {
      if (!silent) setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    // Auto-refresh billing silently every 10 seconds
    const interval = setInterval(() => {
      fetchBookings(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Time range helper
  const filterByTime = (date) => {
    if (timeFilter === 'all') return true;
    
    const itemDate = new Date(date);
    
    // Check specifically for today
    if (timeFilter === 'today') {
      return itemDate.toDateString() === new Date().toDateString();
    }
    
    if (timeFilter === 'custom') {
      if (!startDate && !endDate) return true;
      const itemTime = itemDate.getTime();
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (itemTime < start.getTime()) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (itemTime > end.getTime()) return false;
      }
      return true;
    }

    const now = new Date();
    const diffTime = Math.abs(now - itemDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (timeFilter === 'weekly') {
      return diffDays <= 7;
    }
    if (timeFilter === 'monthly') {
      return diffDays <= 30;
    }
    if (timeFilter === 'yearly') {
      return diffDays <= 365;
    }
    return true;
  };

  // Calculate dynamic stats
  const getStats = () => {
    let totalRevenue = 0;
    let pendingPayments = 0;
    let refundRequests = 0; // count cancelled bookings (respecting time filter)
    let todaysCollections = 0;
    let todaysCancellations = 0;

    const todayStr = new Date().toDateString();

    bookings.forEach((b) => {
      const price = parseFloat(b.total_price);
      const bookingDate = new Date(b.created_at).toDateString();

      // Today-specific stats (independent of timeFilter)
      if (bookingDate === todayStr) {
        if (b.status === "confirmed" || b.status === "checked_in") {
          todaysCollections += price;
        } else if (b.status === "cancelled") {
          todaysCancellations += 1;
        }
      }

      // Filtered stats (respect timeFilter)
      if (filterByTime(b.created_at)) {
        if (b.status === "confirmed" || b.status === "checked_in") {
          totalRevenue += price;
        } else if (b.status === "pending") {
          pendingPayments += price;
        } else if (b.status === "cancelled") {
          refundRequests += 1;
        }
      }
    });

    return {
      totalRevenue,
      pendingPayments,
      refundRequests,
      todaysCollections,
      todaysCancellations,
    };
  };

  const stats = getStats();

  // Map bookings to invoice format
  const invoices = bookings.map((b) => ({
    id: b.id.toString(),
    invoiceNumber: `INV-${b.id.toString().padStart(4, "0")}`,
    customerName: b.guest_name,
    customerEmail: b.guest_email,
    customerPhone: b.guest_phone,
    amount: parseFloat(b.total_price),
    status: b.status === "confirmed" || b.status === "checked_in" ? "Paid Invoice" : b.status === "cancelled" ? "Cancelled" : "Pending",
    createdAt: new Date(b.created_at)
  }));

  // Map bookings to payment records
  const payments = bookings.map((b) => ({
    id: b.id.toString(),
    paymentId: b.razorpay_payment_id || `PAY-${b.id.toString().padStart(4, "0")}`,
    bookingId: `BK-${b.id.toString().padStart(4, "0")}`,
    customerName: b.guest_name,
    amount: parseFloat(b.total_price),
    gateway: b.payment_method === "online" ? "Razorpay" : "Offline (Cash)",
    paymentStatus: b.status === "confirmed" || b.status === "checked_in" ? "Paid" : b.status === "cancelled" ? "Refunded" : "Pending",
    createdAt: new Date(b.created_at)
  }));

  // Map bookings to cancellation records
  const cancellations = bookings
    .filter((b) => b.status === "cancelled")
    .map((b) => ({
      id: b.id.toString(),
      bookingId: `BK-${b.id.toString().padStart(4, "0")}`,
      customerName: b.guest_name,
      customerEmail: b.guest_email,
      customerPhone: b.guest_phone,
      amount: parseFloat(b.total_price),
      createdAt: new Date(b.created_at)
    }));

  // Filtering
  const filteredInvoices = invoices.filter(
    (inv) =>
      filterByTime(inv.createdAt) &&
      (inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPayments = payments.filter(
    (pay) =>
      filterByTime(pay.createdAt) &&
      (pay.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCancellations = cancellations.filter(
    (cancel) =>
      filterByTime(cancel.createdAt) &&
      (cancel.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cancel.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cancel.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Export to Excel (XLSX Workbook containing Invoices, Payments, and Cancellations)
  const exportToExcel = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Billing_Report_${dateStr}.xlsx`;

    // 1. Map to Excel-friendly structures
    const invoicesData = filteredInvoices.map(inv => ({
      "Invoice No": inv.invoiceNumber,
      "Guest Name": inv.customerName,
      "Guest Email": inv.customerEmail,
      "Guest Phone": inv.customerPhone ? formatPhoneNumber(inv.customerPhone) : "N/A",
      "Date Created": inv.createdAt.toLocaleDateString(),
      "Billing Amount (INR)": inv.amount,
      "Status": inv.status
    }));

    const paymentsData = filteredPayments.map(pay => ({
      "Payment ID": pay.paymentId,
      "Booking Ref": pay.bookingId,
      "Customer": pay.customerName,
      "Payment Gateway": pay.gateway,
      "Amount Transacted (INR)": pay.amount,
      "Payment Status": pay.paymentStatus
    }));

    const cancellationsData = filteredCancellations.map(cancel => ({
      "Booking Ref": cancel.bookingId,
      "Guest Name": cancel.customerName,
      "Guest Email": cancel.customerEmail,
      "Guest Phone": cancel.customerPhone ? formatPhoneNumber(cancel.customerPhone) : "N/A",
      "Date Created": cancel.createdAt.toLocaleDateString(),
      "Amount (INR)": cancel.amount,
      "Status": "Cancelled"
    }));

    // 2. Create worksheets
    const wsInvoices = XLSX.utils.json_to_sheet(invoicesData);
    const wsPayments = XLSX.utils.json_to_sheet(paymentsData);
    const wsCancellations = XLSX.utils.json_to_sheet(cancellationsData);

    // 3. Create workbook and append sheets
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsInvoices, "Invoices");
    XLSX.utils.book_append_sheet(wb, wsPayments, "Payments");
    XLSX.utils.book_append_sheet(wb, wsCancellations, "Cancellations");

    // 4. Trigger download
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full text-white">
      {/* CSS print override styles */}
      <style>{`
        @media print {
          /* Global layouts, sidebar and headers to hide */
          aside, header, nav, .print\\:hidden, button, input, select, .relative {
            display: none !important;
          }
          /* Reset root background, margins, padding, and height */
          body, html, #root, .h-screen, .min-h-screen, main, div {
            background: white !important;
            color: black !important;
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Ensure container wrapper occupies full width and doesn't scroll */
          .max-w-7xl {
            max-width: 100% !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /* Style table specifically for printing */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            color: black !important;
            background: white !important;
            margin-top: 10px !important;
          }
          tr {
            page-break-inside: avoid !important;
          }
          th {
            background-color: #f3f4f6 !important;
            color: black !important;
            font-weight: bold !important;
            border-bottom: 2px solid #d1d5db !important;
            padding: 10px 8px !important;
            text-transform: uppercase !important;
            font-size: 11px !important;
            text-align: left !important;
          }
          td {
            border-bottom: 1px solid #e5e7eb !important;
            color: #1f2937 !important;
            padding: 10px 8px !important;
            font-size: 12px !important;
            text-align: left !important;
          }
          /* Style active status badges for black/white print */
          td span {
            background: transparent !important;
            border: none !important;
            color: black !important;
            font-weight: bold !important;
            padding: 0 !important;
          }
          /* Show print title only */
          .print-title {
            display: block !important;
            font-size: 22px !important;
            font-weight: bold !important;
            margin-bottom: 15px !important;
            text-align: center !important;
            color: black !important;
            border-bottom: 2px solid black !important;
            padding-bottom: 8px !important;
          }
        }
        @media screen {
          .print-title {
            display: none !important;
          }
          .react-datepicker-wrapper {
            width: auto !important;
          }
          .billing-datepicker {
            margin-top: 0px !important;
          }
        }
      `}</style>

      {/* PRINT TITLE (Hidden on screen) */}
      <div className="print-title">
        SREE RAAGA RESORTS - SALES REPORT ({
          timeFilter === 'today' ? "TODAY'S VIEW" : 
          timeFilter === 'all' ? 'ALL TIME' : 
          timeFilter === 'weekly' ? 'WEEKLY VIEW' : 
          timeFilter === 'monthly' ? 'MONTHLY VIEW' : 
          timeFilter === 'yearly' ? 'YEARLY VIEW' : 
          `CUSTOM RANGE: ${startDate || 'Beginning'} to ${endDate || 'Present'}`
        })
      </div>

      {/* HEADER WITH FILTERS */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 border-b border-white/5 pb-6 print:hidden items-start lg:items-end">
        <div>
          <h1 className="text-2xl font-bold">Billing & Payments</h1>
          <p className="text-white/50 text-base">
            Manage invoices, payments and cancellations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Range filter selector */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm font-semibold uppercase tracking-wider whitespace-nowrap">Range:</span>
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                // Reset custom date values when switching away
                if (e.target.value !== 'custom') {
                  setStartDate('');
                  setEndDate('');
                }
              }}
              className="bg-[#071524] border border-white/10 mr-8  text-white rounded text-sm px-6 py-2.5 focus:outline-none focus:border-[#C8A64D] cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="yearly">This Year</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Custom dates input fields */}
          {timeFilter === 'custom' && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-white/40 text-sm uppercase font-semibold">From:</span>
                <div className="relative flex items-center">
                  <DatePicker
                    selected={startDate ? new Date(startDate) : null}
                    onChange={(date) => {
                      if (date) {
                        const tzOffset = date.getTimezoneOffset() * 60000;
                        setStartDate(new Date(date.getTime() - tzOffset).toISOString().split("T")[0]);
                      } else {
                        setStartDate('');
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="bg-[#071524] border border-white/10 text-white rounded text-sm pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#C8A64D] cursor-pointer w-36"
                    placeholderText="DD/MM/YYYY"
                    calendarClassName="billing-datepicker"
                  />
                  <Calendar className="w-4 h-4 text-white absolute left-3 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/40 text-sm uppercase font-semibold">To:</span>
                <div className="relative flex items-center">
                  <DatePicker
                    selected={endDate ? new Date(endDate) : null}
                    onChange={(date) => {
                      if (date) {
                        const tzOffset = date.getTimezoneOffset() * 60000;
                        setEndDate(new Date(date.getTime() - tzOffset).toISOString().split("T")[0]);
                      } else {
                        setEndDate('');
                      }
                    }}
                    dateFormat="dd/MM/yyyy"
                    className="bg-[#071524] border border-white/10 text-white rounded text-sm pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#C8A64D] cursor-pointer w-36"
                    placeholderText="DD/MM/YYYY"
                    calendarClassName="billing-datepicker"
                  />
                  <Calendar className="w-4 h-4 text-white absolute left-3 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
          
          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2.5 px-6 py-3 bg-[#C8A64D] text-[#071524] rounded-lg hover:bg-[#C8A64D]/90 font-bold transition cursor-pointer text-base"
          >
            <Download className="w-5 h-5" /> Export
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* STATS */}
      {loading ? (
        <div className="flex items-center gap-2 text-white/60 justify-center py-6 print:hidden">
          <RefreshCw className="animate-spin w-5 h-5 text-[#C8A64D]" />
          <span>Calculating billing stats...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
          <div className="bg-[#081A2F] p-6 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-base mb-2">
              Total Revenue <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
          </div>
             <div className="bg-[#081A2F] p-6 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-base mb-2">
              Today's Revenue <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">₹{stats.todaysCollections.toLocaleString()}</h2>
          </div>

          <div className="bg-[#081A2F] p-6 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-base mb-2">
              Pending Payments <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">₹{stats.pendingPayments.toLocaleString()}</h2>
          </div>

          <div className="bg-[#081A2F] p-6 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-base mb-2">
               Today's Cancellations <Undo2 className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">{stats.todaysCancellations} Bookings</h2>
          </div>

       
        </div>
      )}

      {/* TABS + SEARCH */}
      <div className="bg-[#081A2F] rounded-xl border border-white/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 gap-4 print:hidden">
          <div className="flex flex-wrap gap-3 text-base font-bold uppercase tracking-wider w-full sm:w-auto">
            {['invoices', 'payments', 'cancellations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg cursor-pointer transition text-sm font-semibold border ${
                  activeTab === tab
                    ? 'bg-[#C8A64D] text-[#071524] border-[#C8A64D] hover:bg-[#C8A64D]/90'
                    : 'bg-[#071524] text-white/50 border-white/10 hover:bg-white/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
            <input
              className="w-full bg-[#071524] border border-white/10 pl-9 pr-3 py-2.5 rounded text-base text-white focus:outline-none focus:border-[#C8A64D]"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-x-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-white/60 justify-center py-12">
              <RefreshCw className="animate-spin w-5 h-5 text-[#C8A64D]" />
              <span>Loading ledger...</span>
            </div>
          ) : (
            <>
              {/* INVOICES */}
              {activeTab === 'invoices' && (
                filteredInvoices.length === 0 ? (
                  <div className="p-10 text-center text-white/40">No invoice records found.</div>
                ) : (
                  <table className="w-full text-base text-white/70">
                    <thead className="text-white/40 text-sm uppercase tracking-wider bg-[#071524]">
                      <tr>
                        <th className="p-3 text-center">Invoice No</th>
                        <th className="p-3 text-center">Guest Name</th>
                        <th className="p-3 text-center">Guest Contact</th>
                        <th className="p-3 text-center">Date Created</th>
                        <th className="p-3 text-center">Billing Amount</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="border-t border-white/5 hover:bg-white/5 transition text-center">
                          <td className="p-3 font-semibold text-[16px] text-white">{inv.invoiceNumber}</td>
                          <td className="p-3 text-white">{inv.customerName}</td>
                          <td className="p-3 text-[16px]">
                            <div className="text-white">{inv.customerEmail}</div>
                            {inv.customerPhone && (
                              <div className="text-white mt-1">{formatPhoneNumber(inv.customerPhone)}</div>
                            )}
                          </td>
                          <td className="p-3 text-xs text-white">{inv.createdAt.toLocaleDateString()}</td>
                          <td className="p-3 font-bold text-[#C8A64D]">₹{inv.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${
                              inv.status === "Paid Invoice"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : inv.status === "Cancelled"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}

              {/* PAYMENTS */}
              {activeTab === 'payments' && (
                filteredPayments.length === 0 ? (
                  <div className="p-10 text-center text-white/40">No payment transaction records found.</div>
                ) : (
                  <table className="w-full text-base text-white/70">
                    <thead className="text-white/40 text-sm uppercase tracking-wider bg-[#071524]">
                      <tr>
                        <th className="p-3 text-center">Payment ID</th>
                        <th className="p-3 text-center">Booking Ref</th>
                        <th className="p-3 text-center">Customer</th>
                        <th className="p-3 text-center">Payment Gateway</th>
                        <th className="p-3 text-center">Amount Transacted</th>
                        <th className="p-3 text-center">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.map((pay) => (
                        <tr key={pay.id} className="border-t border-white/5 hover:bg-white/5 transition">
                          <td className="p-3 font-semibold text-white">{pay.paymentId}</td>
                          <td className="p-3 font-semibold text-white/50">{pay.bookingId}</td>
                          <td className="p-3">{pay.customerName}</td>
                          <td className="p-3 text-xs text-white/50">{pay.gateway}</td>
                          <td className="p-3 font-bold text-emerald-400">₹{pay.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${
                              pay.paymentStatus === "Paid"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : pay.paymentStatus === "Refunded"
                                ? "bg-red-500/10 text-red-400 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }`}>
                              {pay.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}

              {/* CANCELLATIONS */}
              {activeTab === 'cancellations' && (
                filteredCancellations.length === 0 ? (
                  <div className="p-10 text-center text-white/40">No cancellation records found.</div>
                ) : (
                  <table className="w-full text-base text-white/70">
                    <thead className="text-white/40 text-sm uppercase tracking-wider bg-[#071524]">
                      <tr>
                        <th className="p-3 text-left">Booking Ref</th>
                        <th className="p-3 text-left">Guest Name</th>
                        <th className="p-3 text-left">Guest Contact</th>
                        <th className="p-3 text-left">Date Created</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCancellations.map((cancel) => (
                        <tr key={cancel.id} className="border-t border-white/5 hover:bg-white/5 transition">
                          <td className="p-3 font-semibold text-white">{cancel.bookingId}</td>
                          <td className="p-3">{cancel.customerName}</td>
                          <td className="p-3 text-[16px]">
                            <div className="text-white/70">{cancel.customerEmail}</div>
                            {cancel.customerPhone && (
                              <div className="text-white/40 mt-1">{formatPhoneNumber(cancel.customerPhone)}</div>
                            )}
                          </td>
                          <td className="p-3 text-xs">{cancel.createdAt.toLocaleDateString()}</td>
                          <td className="p-3 font-bold text-red-400">₹{cancel.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className="text-sm px-3 py-1 rounded-full border font-semibold bg-red-500/10 text-red-400 border-red-500/20">
                              Cancelled
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBilling;