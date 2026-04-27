import { useEffect, useState } from "react";
import "./RenterDetail.css";
import { useParams } from "react-router-dom";
import {searchRenters} from "../API/Renter.js";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  paid:     { label: "Paid",     color: "green",  icon: "✓" },
  due:      { label: "Due",      color: "amber",  icon: "!" },
  overdue:  { label: "Overdue",  color: "red",    icon: "!!" },
  upcoming: { label: "Upcoming", color: "blue",   icon: "○" },
};

// ─── Dummy renter data ────────────────────────────────────────────────────────
const DUMMY_RENTER = {
  id: "t1",
  name: "Rahul Verma",
  phone: "9876543210",
  email: "rahul.verma@gmail.com",
  rent: 12000,
  leaseStart: "2024-01-01",
  dueDay: 1,
  avatar: "RV",
  notes: "Prefers UPI payments. Contact before 9 PM.",
  payments: [
    { id: "pay1",  month: "May 2025",   dueDate: "2025-05-01", paidDate: null,         amount: 12000, status: "due"      },
    { id: "pay2",  month: "Apr 2025",   dueDate: "2025-04-01", paidDate: "2025-04-03", amount: 12000, status: "paid"     },
    { id: "pay3",  month: "Mar 2025",   dueDate: "2025-03-01", paidDate: "2025-03-01", amount: 12000, status: "paid"     },
    { id: "pay4",  month: "Feb 2025",   dueDate: "2025-02-01", paidDate: "2025-02-05", amount: 12000, status: "paid"     },
    { id: "pay5",  month: "Jan 2025",   dueDate: "2025-01-01", paidDate: null,         amount: 12000, status: "overdue"  },
    { id: "pay6",  month: "Dec 2024",   dueDate: "2024-12-01", paidDate: "2024-12-01", amount: 12000, status: "paid"     },
    { id: "pay7",  month: "Nov 2024",   dueDate: "2024-11-01", paidDate: "2024-11-02", amount: 12000, status: "paid"     },
    { id: "pay8",  month: "Oct 2024",   dueDate: "2024-10-01", paidDate: "2024-10-04", amount: 12000, status: "paid"     },
    { id: "pay9",  month: "Jun 2025",   dueDate: "2025-06-01", paidDate: null,         amount: 12000, status: "upcoming" },
    { id: "pay10", month: "Jul 2025",   dueDate: "2025-07-01", paidDate: null,         amount: 12000, status: "upcoming" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const fmtCurrency = (n) =>
  "₹" + Number(n).toLocaleString("en-IN");

// ─── Helper: build avatar initials from name ──────────────────────────────────
const getAvatar = (name = "") => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;
  return (
    <span className={`rd-badge rd-badge--${cfg.color}`}>
      <span className="rd-badge__dot" />
      {cfg.label}
    </span>
  );
};

const InfoRow = ({ label, value, highlight }) => (
  <div className="rd-info-row">
    <span className="rd-info-label">{label}</span>
    <span className={`rd-info-value ${highlight ? "rd-info-value--highlight" : ""}`}>{value}</span>
  </div>
);

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({ payment, onClose, onSave }) => {
  const [status, setStatus]   = useState(payment.status);
  const [paidDate, setPaidDate] = useState(payment.paidDate || "");
  const [amount, setAmount]   = useState(payment.amount);

  const handleSave = () => {
    onSave(payment.id, {
      status,
      paidDate: status === "paid" ? paidDate || new Date().toISOString().split("T")[0] : null,
      amount: Number(amount),
    });
    onClose();
  };

  return (
    <div className="rd-modal-backdrop" onClick={onClose}>
      <div className="rd-modal" onClick={e => e.stopPropagation()}>
        <div className="rd-modal__header">
          <div>
            <h3 className="rd-modal__title">Update Payment</h3>
            <p className="rd-modal__sub">{payment.month} · Due {fmt(payment.dueDate)}</p>
          </div>
          <button className="rd-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="rd-modal__body">
          <div className="rd-field">
            <label className="rd-field__label">Payment Status</label>
            <div className="rd-status-grid">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`rd-status-btn rd-status-btn--${cfg.color} ${status === key ? "active" : ""}`}
                  onClick={() => setStatus(key)}
                >
                  <span className="rd-status-btn__icon">{cfg.icon}</span>
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {status === "paid" && (
            <div className="rd-field">
              <label className="rd-field__label">Date Received</label>
              <input
                className="rd-input"
                type="date"
                value={paidDate}
                onChange={e => setPaidDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          )}

           {status === "paid" && (
          <div className="rd-field">
            <label className="rd-field__label">Amount (₹)</label>
            <input
              className="rd-input"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="0"
            />
          </div>
          )}
        </div>
        

        <div className="rd-modal__footer">
          <button className="rd-btn rd-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="rd-btn rd-btn--primary" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RenterDetail({ renter = DUMMY_RENTER, onBack }) {
  const [payments, setPayments]   = useState(renter.payments);
  const [editing, setEditing]     = useState(null);
  const [toast, setToast]         = useState(null);
  const [filterStatus, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("history");

  // ── NEW: renterDetails now stores the mapped display object ──
  const [renterDetails, setRenterDetails] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("ID:", id);
        const data1 = await searchRenters(id);
        const raw = data1.data;
        console.log("API Data:", raw);

        // ── Map API fields → display shape ──────────────────────────────────
        // API fields:  name, email, mobaile (sic), rent, day, status,
        //              createdAt, ownerID, daysLate, Rid, _id
        const mapped = {
          id:         raw.Rid || raw._id,
          name:       raw.name       || "—",
          phone:      raw.mobaile    || "—",          // API typo: "mobaile"
          email:      raw.email      || "—",
          rent:       raw.rent       || 0,
          leaseStart: raw.createdAt  || null,          // closest field available
          dueDay:     raw.day        || 1,
          avatar:     getAvatar(raw.name),
          status:     raw.status     || "upcoming",
          daysLate:   raw.daysLate   || 0,
          ownerID:    raw.ownerID    || "—",
        };

        setRenterDetails(mapped);
        console.log("Renter Details mapped:", mapped);
      } catch (err) {
        console.error("Error fetching renter:", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Use live data when available, fall back to prop
  const display = renterDetails || {
    ...renter,
    status: renter.payments?.some(p => p.status === "due")
      ? "due"
      : renter.payments?.some(p => p.status === "overdue")
      ? "overdue"
      : "upcoming",
  };

  // Stats
  const paid      = payments.filter(p => p.status === "paid");
  const overdue   = payments.filter(p => p.status === "overdue");
  const due       = payments.filter(p => p.status === "due");
  const collected = paid.reduce((s, p) => s + p.amount, 0);
  const pending   = [...overdue, ...due].reduce((s, p) => s + p.amount, 0);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = (id, updates) => {
    setPayments(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
    showToast("Payment updated successfully");
  };

  const filtered = filterStatus === "all"
    ? payments
    : payments.filter(p => p.status === filterStatus);

  const ORDER = { overdue: 0, due: 1, upcoming: 2, paid: 3 };
  const sorted = [...filtered].sort((a, b) => {
    if (ORDER[a.status] !== ORDER[b.status]) return ORDER[a.status] - ORDER[b.status];
    return new Date(b.dueDate) - new Date(a.dueDate);
  });

  return (
    <div className="rd-root">

      {/* Toast */}
      {toast && (
        <div className={`rd-toast rd-toast--${toast.type}`}>
          <span>{toast.type === "success" ? "✓" : "!"}</span>
          {toast.msg}
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <EditModal
          payment={editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {/* Back */}
      {onBack && (
        <button className="rd-back" onClick={onBack}>
          ← Back to Tenants
        </button>
      )}

      {/* ── Profile Header ── */}
      <div className="rd-header">
        <div className="rd-avatar">{display.avatar}</div>
        <div className="rd-header__info">
          <h2 className="rd-header__name">{display.name}</h2>
          <div className="rd-header__tags">
            {/* Use live status from API if available */}
            <StatusBadge status={renterDetails ? renterDetails.status : (due.length ? "due" : overdue.length ? "overdue" : "paid")} />
            <span className="rd-tag">📞 {display.phone}</span>
            {display.email && <span className="rd-tag">✉ {display.email}</span>}
          </div>
        </div>
        <div className="rd-header__rent">
          <p className="rd-rent-label">Monthly Rent</p>
          <p className="rd-rent-value">{fmtCurrency(display.rent)}</p>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="rd-stats">
        <div className="rd-stat">
          <p className="rd-stat__label">Total Collected</p>
          <p className="rd-stat__value rd-stat__value--green">{fmtCurrency(collected)}</p>
        </div>
        <div className="rd-stat">
          <p className="rd-stat__label">Pending Amount</p>
          <p className="rd-stat__value rd-stat__value--red">{fmtCurrency(pending)}</p>
        </div>

         <div className="rd-stat" onClick={() => setEditing("p")}>
          <p className="rd-stat__label">Update Payment Status</p>
         <button
                    className="rd-stat"
                    onClick={() => setEditing("p")}
                    title="Edit payment"
                  >
                    ✏
                  </button>
          </div>
        {/* Show days late only when API data is loaded and daysLate > 0 */}
        {renterDetails && renterDetails.daysLate > 0 && (
          <div className="rd-stat">
            <p className="rd-stat__label">Days Late</p>
            <p className="rd-stat__value rd-stat__value--red">{renterDetails.daysLate}</p>
          </div>
        )}
      </div>

      {/* ── Tabs ── */}
      <div className="rd-tabs">
        <button className={`rd-tab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>
          Payment History
        </button>
        <button className={`rd-tab ${activeTab === "details" ? "active" : ""}`} onClick={() => setActiveTab("details")}>
          Renter Details
        </button>
      </div>

      {/* ── Payment History Tab ── */}
      {activeTab === "history" && (
        <div className="rd-section">
          <div className="rd-filter-bar">
            <p className="rd-filter-bar__count">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="rd-payment-list">
            {sorted.length === 0 && (
              <div className="rd-empty">No records for this filter.</div>
            )}
            {sorted.map(p => (
              <div key={p.id} className={`rd-payment-row rd-payment-row--${p.status}`}>
                <div className="rd-payment-row__left">
                  <div className={`rd-payment-icon rd-payment-icon--${STATUS_CONFIG[p.status]?.color}`}>
                    {STATUS_CONFIG[p.status]?.icon}
                  </div>
                  <div>
                    <p className="rd-payment-month">{p.month}</p>
                    <p className="rd-payment-meta">
                      Due {fmt(p.dueDate)}
                      {p.paidDate && <> · Paid {fmt(p.paidDate)}</>}
                      {p.status === "overdue" && !p.paidDate && (
                        <span className="rd-overdue-tag"> · Not received</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="rd-payment-row__right">
                  <StatusBadge status={p.status} />
                  <p className="rd-payment-amount">{fmtCurrency(p.amount)}</p>
                 
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Renter Details Tab ── */}
      {activeTab === "details" && (
        <div className="rd-section rd-details-grid">
          <div className="rd-detail-card">
            <h4 className="rd-detail-card__title">Lease Information</h4>
            <InfoRow label="Lease Start" value={fmt(display.leaseStart)} />
            <InfoRow label="Due Day"     value={`${display.dueDay}${display.dueDay === 1 ? "st" : display.dueDay === 2 ? "nd" : display.dueDay === 3 ? "rd" : "th"} of every month`} />
            {/* Show owner info from API */}
            {renterDetails?.ownerID && (
              <InfoRow label="Owner" value={renterDetails.ownerID} />
            )}
          </div>
          <div className="rd-detail-card">
            <h4 className="rd-detail-card__title">Payment Summary</h4>
            <InfoRow label="Monthly Rent"    value={fmtCurrency(display.rent)}  highlight />
            <InfoRow label="Total Collected"  value={fmtCurrency(collected)}    highlight />
            {renterDetails?.daysLate > 0 && (
              <InfoRow label="Days Late" value={renterDetails.daysLate} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}