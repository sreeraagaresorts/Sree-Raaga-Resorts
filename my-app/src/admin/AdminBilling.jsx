import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import {
  Download,
  Search,
  IndianRupee,
  Wallet,
  Activity,
  Undo2,
  RefreshCw,
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
    let refundRequests = 0; // count cancelled bookings
    let todaysCollections = 0;

    const todayStr = new Date().toDateString();

    bookings.forEach((b) => {
      if (!filterByTime(b.created_at)) return;

      const price = parseFloat(b.total_price);
      if (b.status === "confirmed" || b.status === "checked_in") {
        totalRevenue += price;
      } else if (b.status === "pending") {
        pendingPayments += price;
      } else if (b.status === "cancelled") {
        refundRequests += 1;
      }

      // Today's collections: confirmed or checked-in bookings created today
      const bookingDate = new Date(b.created_at).toDateString();
      if (bookingDate === todayStr && (b.status === "confirmed" || b.status === "checked_in")) {
        todaysCollections += price;
      }
    });

    return {
      totalRevenue,
      pendingPayments,
      refundRequests,
      todaysCollections,
    };
  };

  const stats = getStats();

  // Map bookings to invoice format
  const invoices = bookings.map((b) => ({
    id: b.id.toString(),
    invoiceNumber: `INV-${b.id.toString().padStart(4, "0")}`,
    customerName: b.guest_name,
    customerEmail: b.guest_email,
    amount: parseFloat(b.total_price),
    status: b.status === "confirmed" || b.status === "checked_in" ? "Paid" : b.status === "cancelled" ? "Cancelled" : "Pending",
    createdAt: new Date(b.created_at)
  }));

  // Map bookings to payment records
  const payments = bookings.map((b) => ({
    id: b.id.toString(),
    paymentId: `PAY-${b.id.toString().padStart(4, "0")}`,
    bookingId: `BK-${b.id.toString().padStart(4, "0")}`,
    customerName: b.guest_name,
    amount: parseFloat(b.total_price),
    gateway: b.id % 2 === 0 ? "Razorpay" : "Stripe",
    paymentStatus: b.status === "confirmed" || b.status === "checked_in" ? "Paid" : b.status === "cancelled" ? "Refunded" : "Pending",
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

  // Export to Excel (CSV format)
  const exportToExcel = () => {
    // Add BOM for UTF-8 to correctly render special characters in Excel
    let csvContent = "\uFEFF";
    const dateStr = new Date().toISOString().split('T')[0];
    let filename = `Billing_${activeTab}_${dateStr}.csv`;

    if (activeTab === 'invoices') {
      csvContent += "Invoice No,Guest Name,Guest Email,Date Created,Billing Amount,Status\n";
      filteredInvoices.forEach(inv => {
        // Escape quotes
        const name = (inv.customerName || "").replace(/"/g, '""');
        const email = (inv.customerEmail || "").replace(/"/g, '""');
        csvContent += `"${inv.invoiceNumber}","${name}","${email}","${inv.createdAt.toLocaleDateString()}","${inv.amount}","${inv.status}"\n`;
      });
    } else {
      csvContent += "Payment ID,Booking Ref,Customer,Payment Gateway,Amount Transacted,Payment Status\n";
      filteredPayments.forEach(pay => {
        const name = (pay.customerName || "").replace(/"/g, '""');
        csvContent += `"${pay.paymentId}","${pay.bookingId}","${name}","${pay.gateway}","${pay.amount}","${pay.paymentStatus}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="text-3xl font-bold">Billing & Payments</h1>
          <p className="text-white/50 text-base">
            Manage invoices, payments, refunds and transactions dynamically.
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
              className="bg-[#071524] border border-white/10 text-white rounded text-sm px-4 py-2.5 focus:outline-none focus:border-[#C8A64D] cursor-pointer"
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
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-white/40 text-sm uppercase font-semibold">From:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-[#071524] border border-white/10 text-white rounded text-sm px-3 py-2 focus:outline-none focus:border-[#C8A64D] cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-white/40 text-sm uppercase font-semibold">To:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-[#071524] border border-white/10 text-white rounded text-sm px-3 py-2 focus:outline-none focus:border-[#C8A64D] cursor-pointer"
                />
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
            <h2 className="text-white text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="bg-[#081A2F] p-6 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-base mb-2">
              Pending Payments <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-white text-3xl font-bold">₹{stats.pendingPayments.toLocaleString()}</h2>
          </div>

          <div className="bg-[#081A2F] p-6 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-base mb-2">
              Refunds / Cancellations <Undo2 className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-white text-3xl font-bold">{stats.refundRequests} bookings</h2>
          </div>

          <div className="bg-[#081A2F] p-6 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-base mb-2">
              Today's Revenue <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-white text-3xl font-bold">₹{stats.todaysCollections.toLocaleString()}</h2>
          </div>
        </div>
      )}

      {/* TABS + SEARCH */}
      <div className="bg-[#081A2F] rounded-xl border border-white/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 gap-4 print:hidden">
          <div className="flex gap-6 text-base font-bold uppercase tracking-wider w-full sm:w-auto">
            {['invoices', 'payments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-1 cursor-pointer transition ${
                  activeTab === tab ? 'text-[#C8A64D] border-b-2 border-[#C8A64D]' : 'text-white/40'
                }`}
              >
                {tab}
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
                        <th className="p-3 text-left">Invoice No</th>
                        <th className="p-3 text-left">Guest Name</th>
                        <th className="p-3 text-left">Guest Email</th>
                        <th className="p-3 text-left">Date Created</th>
                        <th className="p-3 text-left">Billing Amount</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="border-t border-white/5 hover:bg-white/5 transition">
                          <td className="p-3 font-semibold text-white">{inv.invoiceNumber}</td>
                          <td className="p-3">{inv.customerName}</td>
                          <td className="p-3 text-xs text-white/50">{inv.customerEmail}</td>
                          <td className="p-3 text-xs">{inv.createdAt.toLocaleDateString()}</td>
                          <td className="p-3 font-bold text-[#C8A64D]">₹{inv.amount.toLocaleString()}</td>
                          <td className="p-3 text-center">
                            <span className={`text-sm px-3 py-1 rounded-full border font-semibold ${
                              inv.status === "Paid"
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
                        <th className="p-3 text-left">Payment ID</th>
                        <th className="p-3 text-left">Booking Ref</th>
                        <th className="p-3 text-left">Customer</th>
                        <th className="p-3 text-left">Payment Gateway</th>
                        <th className="p-3 text-left">Amount Transacted</th>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBilling;