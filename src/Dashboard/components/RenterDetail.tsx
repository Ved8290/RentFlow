import { useEffect, useState } from "react";
import "./RenterDetail.css";
import { useParams } from "react-router-dom";
// @ts-ignore
import { searchRenters } from "../API/Renter.js";
// @ts-ignore
import { newRentData, updateRent as updateRentAPI, paymentList } from "../API/RentData.js";

// ─── Status config ────────────────────────────────────────────────────────────
type Status = 'paid' | 'due' | 'overdue' | 'upcoming';
const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: string }> = {
  paid:     { label: "Paid",     color: "green", icon: "✓"  },
  due:      { label: "Due",      color: "amber", icon: "!"  },
  overdue:  { label: "Overdue",  color: "red",   icon: "!!" },
  upcoming: { label: "Upcoming", color: "blue",  icon: "○"  },
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Payment = {
  id: string;
  month: string;
  dueDate: string;
  paidDate: string | null;
  amount: number;
  status: Status;
};

// ✅ Matches your actual API response shape
type RawPayment = {
  _id: string;
  Rid: string;
  rent: number;
  date: string;
  ownerID: string;
  createdAt: string;
  updatedAt: string;
};

type RenterDetailsType = {
  Rid: string;
  id: string;
  name: string;
  phone: string;
  email: string;
  rent: number;
  leaseStart: string | null;
  dueDay: number;
  avatar: string;
  status: Status;
  daysLate: number;
  ownerID: string;
};

// ─── Dummy renter data ────────────────────────────────────────────────────────
const DUMMY_RENTER: {
  id: string;
  name: string;
  phone: string;
  email: string;
  rent: number;
  leaseStart: string | null;
  dueDay: number;
  avatar: string;
  notes: string;
  payments: Payment[];
} = {
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
    { id: "",  month: "", dueDate: "", paidDate: null,         amount: 0, status: "due"      },
   
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
};

const fmtCurrency = (n: number): string =>
  "₹" + Number(n).toLocaleString("en-IN");

const getAvatar = (name = ""): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

const ordinal = (n: number): string =>
  `${n}${n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"}`;

// ✅ Maps raw API payment response → internal Payment type
const mapRawPayment = (raw: RawPayment): Payment => {
  const paidDate = raw.date ? raw.date.split("T")[0] : null;
  const d = new Date(raw.date || raw.createdAt);
  const month = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  return {
    id:      raw._id,
    month,
    dueDate: raw.date ? raw.date.split("T")[0] : raw.createdAt.split("T")[0],
    paidDate,
    amount:  raw.rent,
    status:  "paid", // all records from this API are confirmed paid transactions
  };
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: Status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`rd-badge rd-badge--${cfg.color}`}>
      <span className="rd-badge__dot" />
      {cfg.label}
    </span>
  );
};

const InfoRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) => (
  <div className="rd-info-row">
    <span className="rd-info-label">{label}</span>
    <span className={`rd-info-value ${highlight ? "rd-info-value--highlight" : ""}`}>
      {value}
    </span>
  </div>
);

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditModal = ({
  payment,
  onClose,
  onSave,
  defaultRent,
}: {
  payment: Payment;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Payment>) => void | Promise<void>;
  defaultRent: number;
}) => {
  const [status, setStatus]     = useState<Status>(payment.status);
  const [paidDate, setPaidDate] = useState<string>(payment.paidDate || "");
  const [saving, setSaving]     = useState(false);
  const [amount, setAmount]     = useState<number>(
    payment.status === "paid" ? payment.amount : defaultRent
  );

  const handleSave = async () => {
    setSaving(true);
    await onSave(payment.id, {
      status,
      paidDate: status === "paid"
        ? paidDate || new Date().toISOString().split("T")[0]
        : null,
      amount,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="rd-modal-backdrop" onClick={onClose}>
      <div className="rd-modal" onClick={e => e.stopPropagation()}>
        <div className="rd-modal__header">
          <div>
            <h3 className="rd-modal__title">Update Payment</h3>
            <p className="rd-modal__sub">{payment.month} · Paid {fmt(payment.paidDate)}</p>
          </div>
          <button className="rd-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="rd-modal__body">
          <div className="rd-field">
            <label className="rd-field__label">Payment Status</label>
            <div className="rd-status-grid">
              {(Object.entries(STATUS_CONFIG) as [Status, { label: string; color: string; icon: string }][]).map(([key, cfg]) => (
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
                onChange={e => setAmount(Number(e.target.value))}
                min="0"
              />
            </div>
          )}
        </div>

        <div className="rd-modal__footer">
          <button className="rd-btn rd-btn--ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="rd-btn rd-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RenterDetail({
  renter = DUMMY_RENTER,
  onBack,
}: {
  renter?: typeof DUMMY_RENTER;
  onBack?: () => void;
}) {
  const [payments, setPayments]               = useState<Payment[]>(renter.payments);
  const [apiPayments, setApiPayments]         = useState<Payment[]>([]); // ✅ real API payments
  const [editing, setEditing]                 = useState<Payment | null>(null);
  const [toast, setToast]                     = useState<{ msg: string; type: string } | null>(null);
  const [activeTab, setActiveTab]             = useState<"history" | "details">("history");
  const [renterDetails, setRenterDetails]     = useState<RenterDetailsType | null>(null);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const { id } = useParams<{ id: string }>();

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch renter ───────────────────────────────────────────────────────────
  const fetchRenterData = async () => {
    if (!id) return;
    try {
      const data1 = await searchRenters(id);
      const raw = data1?.data;
      if (!raw) throw new Error("No data returned");

      const mapped: RenterDetailsType = {
        Rid:        raw.Rid        || "",
        id:         raw._id        || "",
        name:       raw.name       || "—",
        phone:      raw.mobaile    || "—",
        email:      raw.email      || "—",
        rent:       Number(raw.rent)   || 0,
        leaseStart: raw.createdAt  || null,
        dueDay:     Number(raw.day)    || 1,
        avatar:     getAvatar(raw.name),
        status:     (raw.status as Status) || "upcoming",
        daysLate:   Number(raw.daysLate) || 0,
        ownerID:    raw.ownerID    || "",
      };

      setRenterDetails(mapped);
    } catch (err) {
      console.error("Error fetching renter:", err);
      showToast("Could not load renter data", "error");
    }
  };

  // ✅ Fetch real payment list — maps RawPayment[] → Payment[]
  const fetchPaymentList = async (renterId: string) => {
    setLoadingPayments(true);
    try {
      const data = await paymentList(renterId);
      const raw: RawPayment[] = data?.data;
      if (!raw || !Array.isArray(raw)) throw new Error("No data returned");
      setApiPayments(raw.map(mapRawPayment));
    } catch (err) {
      console.error("Error fetching payment list:", err);
      showToast("Could not load payment data", "error");
    } finally {
      setLoadingPayments(false);
    }
  };

  // ── Step 1: fetch renter on mount ──────────────────────────────────────────
  useEffect(() => {
    fetchRenterData();
  }, [id]);

  // ── Step 2: fetch payments after renterDetails.id is ready ────────────────
  useEffect(() => {
    if (renterDetails?.id) {
      fetchPaymentList(renterDetails.id);
    }
  }, [renterDetails?.id]);

  // ── Pay rent ───────────────────────────────────────────────────────────────
  const payRent = async (amount: number, date: string, month: string) => {
    if (!renterDetails) {
      showToast("Renter data not loaded yet", "error");
      return;
    }
    try {
      const encodedOwnerID = encodeURIComponent(renterDetails.ownerID);
      await newRentData({
        id:      renterDetails.id,
        ownerID: encodedOwnerID,
        data:    { rent: amount, date, month, status: "paid" },
      });
      showToast("Rent payment recorded ✅");
      fetchPaymentList(renterDetails.id); // ✅ refresh list after new payment
    } catch (err) {
      console.error("Error processing payment:", err);
      showToast("Payment failed ❌", "error");
    }
  };

  // ── Update rent status ─────────────────────────────────────────────────────
  const handleUpdateStatus = async (paymentId: string, status: Status) => {
    const rid = renterDetails?.id || renter.id;

    setPayments(prev =>
      prev.map(p => p.id === paymentId ? { ...p, status, paidDate: null } : p)
    );

    try {
      await updateRentAPI({ id: rid, status });
      showToast(`Rent marked as ${status} ✅`);
    } catch (err) {
      setPayments(prev =>
        prev.map(p =>
          p.id === paymentId ? { ...p, status: editing?.status ?? status } : p
        )
      );
      console.error("Error updating rent status:", err);
      showToast("Failed to update rent status ❌", "error");
    }
  };

  // ── Display object ─────────────────────────────────────────────────────────
  const display = renterDetails ?? {
    avatar:     renter.avatar,
    name:       renter.name,
    phone:      renter.phone,
    email:      renter.email,
    rent:       renter.rent,
    leaseStart: renter.leaseStart ?? null,
    dueDay:     renter.dueDay,
    status: renter.payments?.some(p => p.status === "due")
      ? "due"
      : renter.payments?.some(p => p.status === "overdue")
      ? "overdue"
      : "upcoming",
  };

  // ✅ Use real API payments when loaded, fallback to dummy otherwise
  const activePayments =  apiPayments ;

  const paidList    = activePayments.filter(p => p.status === "paid");
  const overdueList = activePayments.filter(p => p.status === "overdue");
  const dueList     = activePayments.filter(p => p.status === "due");
  const collected   = paidList.reduce((s, p) => s + p.amount, 0);
  const pending     = [...overdueList, ...dueList].reduce((s, p) => s + p.amount, 0);

  // ── Save payment edit ──────────────────────────────────────────────────────
  const handleSave = async (paymentId: string, updates: Partial<Payment>) => {
    if (
      updates.status === "overdue" ||
      updates.status === "due"     ||
      updates.status === "upcoming"
    ) {
      await handleUpdateStatus(paymentId, updates.status);
      return;
    }
    if (updates.status === "paid") {
      setPayments(prev =>
        prev.map(p => p.id === paymentId ? { ...p, ...updates } : p)
      );
      const payment = activePayments.find(p => p.id === paymentId);
      const amount  = updates.amount   ?? payment?.amount ?? display.rent;
      const date    = updates.paidDate ?? new Date().toISOString().split("T")[0];
      const month   = payment?.month   ?? "Unknown";
      await payRent(amount, date, month);
    }
  };

  // ── Sorted payments ────────────────────────────────────────────────────────
  const ORDER: Record<Status, number> = { overdue: 0, due: 1, upcoming: 2, paid: 3 };
  const sorted = [...activePayments].sort((a, b) => {
    if (ORDER[a.status] !== ORDER[b.status]) return ORDER[a.status] - ORDER[b.status];
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
  });

  // ── Current status badge ───────────────────────────────────────────────────
  const currentStatus: Status = renterDetails != null
    ? renterDetails.status
    : dueList.length     ? "due"
    : overdueList.length ? "overdue"
    : "paid";

  const handlePayRentClick = () => {
  const blankPayment: Payment = {
    id: "",
    month: new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
    dueDate: new Date().toISOString().split("T")[0],
    paidDate: null,
    amount: display.rent,
    status: "due",
  };
  setEditing(blankPayment);
};

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
          defaultRent={display.rent}
        />
      )}

      {/* Back button */}
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
            <StatusBadge status={currentStatus} />
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
        {/* <div className="rd-stat">
          <p className="rd-stat__label">Pending Amount</p>
          <p className="rd-stat__value rd-stat__value--red">{fmtCurrency(pending)}</p>
        </div> */}
        {renterDetails != null && renterDetails.daysLate > 0 && (
          <div className="rd-stat">
            <p className="rd-stat__label">Days Late</p>
            <p className="rd-stat__value rd-stat__value--red">{renterDetails.daysLate}</p>
          </div>
        )}
       
          <div className="rd-stat">
            <button className="rd-btn rd-btn--primary" onClick={handlePayRentClick}>
              💳 Update Rent Status
            </button>
          </div>
        
        <div className="rd-stat">
          <button className="rd-btn rd-btn--ghost" onClick={fetchRenterData}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="rd-tabs">
        <button
          className={`rd-tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          Payment History
        </button>
        <button
          className={`rd-tab ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Renter Details
        </button>
      </div>

      {/* ── Payment History Tab ── */}
      {activeTab === "history" && (
        <div className="rd-section">
          <div className="rd-filter-bar">
            <p className="rd-filter-bar__count">
              {loadingPayments
                ? "Loading..."
                : `${sorted.length} record${sorted.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="rd-payment-list">

            {loadingPayments && (
              <div className="rd-empty">Loading payment history...</div>
            )}

            {!loadingPayments && sorted.length === 0 && (
              <div className="rd-empty">No payment records found.</div>
            )}

            {!loadingPayments && sorted.map(p => (
              <div
                key={p.id}
                className={`rd-payment-row rd-payment-row--${p.status}`}
                onClick={() => setEditing(p)}
                style={{ cursor: "pointer" }}
                title="Click to edit"
              >
                <div className="rd-payment-row__left">
                  <div className={`rd-payment-icon rd-payment-icon--${STATUS_CONFIG[p.status].color}`}>
                    {STATUS_CONFIG[p.status].icon}
                  </div>
                  <div>
                    <p className="rd-payment-month">{p.month}</p>
                    <p className="rd-payment-meta">
                      Paid on {fmt(p.paidDate)}
                      {p.status === "overdue" && !p.paidDate && (
                        <span className="rd-overdue-tag"> · Not received</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="rd-payment-row__right">
                  <StatusBadge status={p.status} />
                  <p className="rd-payment-amount">{fmtCurrency(p.amount)}</p>
                  {/* <button
                    className="rd-edit-btn"
                    onClick={e => { e.stopPropagation(); setEditing(p); }}
                    title="Edit payment"
                  >
                    ✏
                  </button> */}
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
            <InfoRow
              label="Due Day"
              value={`${ordinal(display.dueDay)} of every month`}
            />
            {renterDetails != null && renterDetails.ownerID && renterDetails.ownerID !== "—" && (
              <InfoRow label="Owner" value={renterDetails.ownerID} />
            )}
          </div>
          <div className="rd-detail-card">
            <h4 className="rd-detail-card__title">Payment Summary</h4>
            <InfoRow label="Monthly Rent"    value={fmtCurrency(display.rent)} highlight />
            <InfoRow label="Total Collected" value={fmtCurrency(collected)}    highlight />
            <InfoRow label="Pending Amount"  value={fmtCurrency(pending)} />
            <InfoRow label="Total Payments"  value={`${paidList.length} payment${paidList.length !== 1 ? "s" : ""}`} />
            {renterDetails != null && renterDetails.daysLate > 0 && (
              <InfoRow label="Days Late" value={`${renterDetails.daysLate} days`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
