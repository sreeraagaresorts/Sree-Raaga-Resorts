import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import {
  Download,
  FileText,
  Search,
  IndianRupee,
  Wallet,
  Activity,
  Undo2,
  RefreshCw,
} from 'lucide-react';

const AdminBilling = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Calculate dynamic stats
  const getStats = () => {
    let totalRevenue = 0;
    let pendingPayments = 0;
    let refundRequests = 0; // count cancelled bookings
    let todaysCollections = 0;

    const todayStr = new Date().toDateString();

    bookings.forEach((b) => {
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
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayments = payments.filter(
    (pay) =>
      pay.paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 w-full text-white">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold">Billing & Payments</h1>
          <p className="text-white/50 text-sm">
            Manage invoices, payments, refunds and transactions dynamically.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Print Reports
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
        <div className="flex items-center gap-2 text-white/60 justify-center py-6">
          <RefreshCw className="animate-spin w-5 h-5 text-[#C8A64D]" />
          <span>Calculating billing stats...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-sm mb-2">
              Total Revenue <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h2>
          </div>

          <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-sm mb-2">
              Pending Payments <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">₹{stats.pendingPayments.toLocaleString()}</h2>
          </div>

          <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-sm mb-2">
              Refunds / Cancellations <Undo2 className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">{stats.refundRequests} bookings</h2>
          </div>

          <div className="bg-[#081A2F] p-5 rounded-xl border border-white/5 shadow-md">
            <div className="flex justify-between text-white/50 text-sm mb-2">
              Today's Revenue <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-white text-2xl font-bold">₹{stats.todaysCollections.toLocaleString()}</h2>
          </div>
        </div>
      )}

      {/* TABS + SEARCH */}
      <div className="bg-[#081A2F] rounded-xl border border-white/5 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-white/5 gap-4">
          <div className="flex gap-6 text-sm font-bold uppercase tracking-wider">
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

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
            <input
              className="w-full bg-[#071524] border border-white/10 pl-9 pr-3 py-2 rounded text-sm text-white focus:outline-none focus:border-[#C8A64D]"
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
                  <table className="w-full text-sm text-white/70">
                    <thead className="text-white/40 text-xs uppercase tracking-wider bg-[#071524]">
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
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
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
                  <table className="w-full text-sm text-white/70">
                    <thead className="text-white/40 text-xs uppercase tracking-wider bg-[#071524]">
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
                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
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