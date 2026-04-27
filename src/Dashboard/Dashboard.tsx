import React, { useState, useMemo, useEffect, useRef } from 'react';
import './Dashboard.css';
import { getRenters  , deleteRenters , markAPaid } from './API/Renter';
import { Route } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


// ─── TYPES ───────────────────────────────────
type Status = 'paid' | 'due' | 'overdue' | 'upcoming';

interface Renter {
  id: number | string;
  name: string;
  flat: string;
  phone: string;
  amount: number;
  dueDay: number;
  status: Status;
  daysLate?: number;
  daysUntilDue?: number; // NEW: for upcoming label
  init: string;
  bg: string;
  fg: string;
}

// ─── SEED DATA (fallback if API fails) ───────
const SEED: Renter[] = [
  { id:1, name:'Rahul Kumar',   flat:'Flat 2B',   phone:'98765 43210', amount:12000, dueDay:1,  status:'paid',     init:'RK', bg:'#d1fae5', fg:'#065f46' },
  { id:2, name:'Sneha Agarwal', flat:'Room 4',     phone:'91234 56789', amount:8500,  dueDay:1,  status:'due',      init:'SA', bg:'#fef3c7', fg:'#92400e' },
  { id:3, name:'Manoj Patil',   flat:'PG Room 3',  phone:'99887 76655', amount:6000,  dueDay:28, status:'overdue',  daysLate:3,  init:'MP', bg:'#fee2e2', fg:'#991b1b' },
  { id:4, name:'Priya Singh',   flat:'Room 6',     phone:'90123 45678', amount:7500,  dueDay:5,  status:'upcoming', daysUntilDue:4, init:'PS', bg:'#dbeafe', fg:'#1d4ed8' },
  { id:5, name:'Amit Desai',    flat:'Flat 1A',    phone:'97654 32100', amount:11000, dueDay:1,  status:'paid',     init:'AD', bg:'#d1fae5', fg:'#065f46' },
  { id:6, name:'Kavita Sharma', flat:'Room 9',     phone:'96543 21098', amount:5500,  dueDay:10, status:'upcoming', daysUntilDue:9, init:'KS', bg:'#dbeafe', fg:'#1d4ed8' },
  { id:7, name:'Rohan Mehta',   flat:'PG Room 7',  phone:'95432 10987', amount:6500,  dueDay:1,  status:'overdue',  daysLate:5,  init:'RM', bg:'#fee2e2', fg:'#991b1b' },
  { id:8, name:'Nisha Tiwari',  flat:'Flat 3C',    phone:'94321 09876', amount:9000,  dueDay:1,  status:'paid',     init:'NT', bg:'#d1fae5', fg:'#065f46' },
];

// ─── STATUS LABEL HELPER ─────────────────────
// Returns a rich label string based on status, daysLate, and daysUntilDue
const getStatusLabel = (r: Renter): string => {
  switch (r.status) {
    case 'paid':
      return ' Paid';
    case 'due':
      return '⚡ Due Today';
    case 'overdue':
      return r.daysLate
        ? `⚠ Overdue · ${r.daysLate}d late`
        : '⚠ Overdue';
    case 'upcoming':
      if (r.daysUntilDue === 1) return '🔔 Due Tomorrow';
      if (r.daysUntilDue && r.daysUntilDue <= 3) return `🔔 Due in ${r.daysUntilDue}d`;
      return r.daysUntilDue ? `📅 Due in ${r.daysUntilDue}d` : '📅 Upcoming';
    default:
      return 'Unknown';
  }
};

// ─── Chart data ───────────────────────────────
const MONTHS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const COLL   = [68, 74, 80, 71, 88, 92];

// ─── Crash-proof INR formatter ────────────────
const inr = (n: number) => {
  if (n === undefined || n === null || isNaN(n)) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
};

const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

// ─── ICONS ───────────────────────────────────
const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="10" y1="4" x2="10" y2="16"/><line x1="4" y1="10" x2="16" y2="10"/>
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="9" r="6"/><line x1="15" y1="15" x2="19" y2="19"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="3 8 6.5 12 13 4"/>
  </svg>
);

// ─── NAV CONFIG ──────────────────────────────
const NAV = [
  { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { id: 'renters',   icon: '👥', label: 'Renters' },
  { id: 'payments',  icon: '💳', label: 'Payments' },
  { id: 'reminders', icon: '🔔', label: 'Reminders', badge: '3' },
  { id: 'reports',   icon: '📊', label: 'Reports' },
];

interface Form {
  name: string;
  flat: string;
  phone: string;
  amount: string;
  dueDay: string;
  email: string;
}
const EMPTY: Form = { name: '', flat: '', phone: '', amount: '', dueDay: '1', email: '' };

type FilterTab = 'all' | 'paid' | 'pending' | 'upcoming';

// ═══════════════════════════════════════════════
// DASHBOARD COMPONENT
// ═══════════════════════════════════════════════
const Dashboard: React.FC = () => {
  const [page, setPage]       = useState('dashboard');
  const [renters, setRenters] = useState<Renter[]>(SEED);
  const [filter, setFilter]   = useState<FilterTab>('all');
  const [search, setSearch]   = useState('');
  const [curPage, setCurPage] = useState(1);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState<Form>(EMPTY);
  const [toast, setToast]     = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [time, setTime]         = useState('');
  const [greetingText, setGreetingText] = useState('');
  const [activeTab,setActiveTab]=useState(1);
  const navigate = useNavigate();

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const PER  = 6;
  const ROOT = import.meta.env.VITE_API_URL;

  // ─── TEMPORARY cron POST endpoint (replace later) ─
  // This matches the cron job server — swap this URL when you deploy
  const CRON_UPDATE_URL = `${ROOT}/api/cron/update-statuses`;

  // ── Derived stats ─────────────────────────
  const paid      = renters.filter(r => r.status === 'paid');
  const pending   = renters.filter(r => r.status === 'overdue' || r.status === 'due');
  const collected = paid.reduce((s, r) => s + r.amount, 0);
  const outstanding = pending.reduce((s, r) => s + r.amount, 0);
  const rate = renters.length > 0 ? Math.round((paid.length / renters.length) * 100) : 0;

  // ── Filtered list ─────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return renters.filter(r => {
      const matchesSearch = !q
        || r.name.toLowerCase().includes(q)
        || r.flat.toLowerCase().includes(q);
      const matchesFilter =
        filter === 'all'      ? true :
        filter === 'pending'  ? (r.status === 'due' || r.status === 'overdue') :
        filter === 'paid'     ? r.status === 'paid' :
        filter === 'upcoming' ? r.status === 'upcoming' :
        true;
      return matchesSearch && matchesFilter;
    });
  }, [renters, search, filter]);

  const pages   = Math.max(1, Math.ceil(filtered.length / PER));
  const visible = filtered.slice((curPage - 1) * PER, curPage * PER);

  // ── Load user from localStorage ───────────
  const getUserData = () => {
    const stored = localStorage.getItem('user');
    setUserData(stored ? JSON.parse(stored) : null);
  };

  // ── Greeting + clock ──────────────────────
  const updateGreeting = () => {
    const now   = new Date();
    const hours = now.getHours();
    const greeting =
      hours < 12 ? 'Good Morning' :
      hours < 17 ? 'Good Afternoon' :
      hours < 21 ? 'Good Evening' : 'Good Night';
    setGreetingText(greeting);
    setTime(`, ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
  };

  useEffect(() => {
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { getUserData(); }, []);

  // ── Fetch renters from API ─────────────────
  const fetchRenters = async () => {
    if (!userData?.email) return;
    try {
      const data = await getRenters(userData.email);
      if (data?.data) {
        const normalized: Renter[] = data.data.map((r: any) => ({
          ...r,
          id:           r._id || r.id,
          amount:       r.amount ?? r.rent ?? 0,
          dueDay:       r.dueDay ?? r.day ?? 1,
          status:       r.status || 'upcoming',
          daysLate:     r.daysLate,
          daysUntilDue: r.daysUntilDue,
          init:         r.init || getInitials(r.name),
          bg:           r.bg   || '#dbeafe',
          fg:           r.fg   || '#1d4ed8',
        }));
        setRenters(normalized);
      }
    } catch (err) {
      console.error('Failed to fetch renters:', err);
      pop('Error loading renter data', 'err');
    }
  };

  useEffect(() => { fetchRenters(); }, [userData]);

  // ── Toast helper ──────────────────────────
  const pop = (msg: string, type: 'ok' | 'err' = 'ok') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  // ── Mark renter as paid ───────────────────
  const markPaid = async (id: number | string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenters(rs => rs.map(r =>
      r.id === id ? { ...r, status: 'paid', daysLate: undefined, daysUntilDue: undefined } : r
    ));
   await markAPaid(id);
    pop(`${name} marked as paid ✓`);
  };

  // ── Delete renter ─────────────────────────
  const deleteRenter = async(id: number | string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenters(rs => rs.filter(r => r.id !== id));
    const d=await deleteRenters(id);
    console.log(d);
    
    pop(`${name} removed`, 'err');
  };

  // ── Generate initials ─────────────────────
  const getInitials = (name?: string) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // ── Add renter API call ───────────────────
  const saveNewRenter = async () => {
    const payload = {
      name:       form.name,
      email:      form.email,
      mobaile:    form.phone,
      rent:       Number(form.amount),
      day:        Number(form.dueDay),
      ownerID:    userData?.email,
    };
    const res = await fetch(`${ROOT}/api/add/newrenter`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to add renter');
    return await res.json();
  };

 const addRenter = async () => {

  if (!form.name || !form.phone || !form.amount) {
    pop('Please fill all required fields', 'err');
    return;
  }

  if (form.phone.length !== 10) {
    pop('Invalid Mobile Number', 'err');
    return;
  }

  const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (!isValidEmail(form.email)) {
  pop('Invalid email format', 'err');
  return;
}   


  try {
    await saveNewRenter();

    pop('Renter added successfully', 'ok');
    setModal(false);
    setForm(EMPTY);
    fetchRenters();

  } catch (err) {
    console.error(err);
    pop('Error adding renter. Please try again.', 'err');
  }
};

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurPage(1);
  };

  const handleFilter = (f: FilterTab) => {
    setFilter(f);
    setCurPage(1);
  };

  return (
    <div className="shell">

      {/* ═══ SIDEBAR ═══ */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="brand-name">Rent<span>Flow</span></span>
        </div>

        <div className="nav-group">
          <div className="nav-group-label">Menu</div>
          {NAV.map(n => (
            <button key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
              <span className="nav-item-icon">{n.icon}</span>
              <span className="nav-item-label">{n.label}</span>
              {n.badge && <span className="nav-badge amber">{n.badge}</span>}
            </button>
          ))}
        </div>

        <div className="nav-group">
          <div className="nav-group-label">Account</div>
          <button className="nav-item" onClick={() => setActiveTab(6)}>
            <span className="nav-item-icon">⚙️</span>
            <span className="nav-item-label">Settings</span>
          </button>
          <button className="nav-item" onClick={() => { localStorage.removeItem("user"); localStorage.removeItem("token"); window.location.href = '/login' } }>
            <span className="nav-item-icon">🚪</span>
            <span className="nav-item-label">Log out</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-av">{getInitials(userData?.name)}</div>
            <div>
              <div className="user-name">{userData?.name || 'Guest'}</div>
              <div className="user-email">{userData?.email || 'Not signed in'}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <div>
            <div className="page-title">{greetingText}, {userData?.name || 'User'} 👋</div>
            <div className="page-sub">{today}{time} · {renters.length} renters total</div>
          </div>
          <div className="topbar-actions">
            <button className="icon-btn" title="Notifications">
              🔔<span className="red-dot"/>
            </button>
            <button className="btn-primary" onClick={() => setModal(true)}>
              <PlusIcon/> Add renter
            </button>
          </div>
        </div>

        <div className="scroll">

          {/* ── STATS ROW ── */}
          <div className="stat-row">
            <div className="stat">
              <div className="stat-top">
                <span className="stat-emoji">💰</span>
                <span className="stat-pill g">↑ 12%</span>
              </div>
              <div className="stat-val">{inr(collected)}</div>
              <div className="stat-label">Collected this month</div>
              <div className="stat-hint">{paid.length} of {renters.length} renters paid</div>
            </div>

            <div className="stat">
              <div className="stat-top">
                <span className="stat-emoji">⏳</span>
                <span className="stat-pill r">{pending.length} renters</span>
              </div>
              <div className="stat-val">{inr(outstanding)}</div>
              <div className="stat-label">Pending collection</div>
              <div className="stat-hint">Reminders being sent automatically</div>
            </div>

            <div className="stat">
              <div className="stat-top">
                <span className="stat-emoji">👥</span>
                <span className="stat-pill b">Active</span>
              </div>
              <div className="stat-val">{renters.length}</div>
              <div className="stat-label">Total renters</div>
              <div className="stat-hint">{inr(renters.reduce((s, r) => s + (r.amount || 0), 0))} / month capacity</div>
            </div>

            <div className="stat">
              <div className="stat-top">
                <span className="stat-emoji">📈</span>
                <span className="stat-pill g">↑ 4%</span>
              </div>
              <div className="stat-val">{rate}%</div>
              <div className="stat-label">Collection rate</div>
              <div className="stat-hint">Up from last month</div>
            </div>
          </div>

          {/* ── RENTER LIST CARD ── */}
          <div className="twoo-col">
            <div className="card">
              <div className="card-head">
                <div>
                  <div className="card-title">Renters</div>
                  <div className="card-hint">{filtered.length} renters · hover for actions</div>
                </div>
              </div>

              <div className="list-search">
                <div className="search-box">
                  <SearchIcon/>
                  <input
                    placeholder="Search by name or flat…"
                    value={search}
                    onChange={handleSearch}
                  />
                </div>
                <div className="chips">
                  {([
                    { key: 'all',      label: 'All' },
                    { key: 'paid',     label: 'Paid' },
                    { key: 'pending',  label: 'Pending' },
                    { key: 'upcoming', label: 'Upcoming' },
                  ] as { key: FilterTab; label: string }[]).map(f => (
                    <button
                      key={f.key}
                      className={`chip ${filter === f.key ? 'on' : ''}`}
                      onClick={() => handleFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Renter rows */}
              {visible.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">🏠</div>
                  <div className="empty-title">No renters found</div>
                  <p className="empty-sub">Adjust your search or add a new renter.</p>
                  <button className="btn-primary" onClick={() => setModal(true)}>
                    <PlusIcon/> Add renter
                  </button>
                </div>
              ) : visible.map(r => (
                <div className="renter-row" key={r.id}>
                  <div className="av" style={{ background: r.bg || '#dbeafe', color: r.fg || '#1d4ed8' }}>
                    {r.init || getInitials(r.name)}
                  </div>
                  <div className="renter-info" onClick={()=>{
                    navigate(`/Dashboard/renter/${r.id}`);
                  }}>
                    <div className="renter-name">{r.name}</div>
                    <div className="renter-meta">{r.flat} · {r.phone}</div>
                  </div>
                  <div>
                    <div className="renter-amt">{inr(r.amount)}</div>
                    <div className="renter-due">
                      Due {r.dueDay}{r.dueDay === 1 ? 'st' : r.dueDay === 2 ? 'nd' : r.dueDay === 3 ? 'rd' : 'th'}
                    </div>
                  </div>

                  {/* ── RICH STATUS BADGE ── */}
                  <span className={`badge ${r.status}`}>
                    {r.status === 'paid'     && <CheckIcon />}
                    {r.status === 'overdue'  && <span className="badge-dot pulse" />}
                    {r.status === 'due'      && <span className="badge-dot blink" />}
                    {getStatusLabel(r)}
                  </span>

                  {/* <div className="row-actions">
                    {r.status !== 'paid' && (
                      <button className="act-btn" title="Mark as paid" onClick={e => markPaid(r.id, r.name, e)}>✓</button>
                    )}
                    <button className="act-btn" title="WhatsApp" onClick={e => { e.stopPropagation(); pop(`Reminder sent to ${r.name} via WhatsApp 💬`); }}>💬</button>
                    <button className="act-btn del" title="Remove" onClick={e => deleteRenter(r.id, r.name, e)}>🗑</button>
                  </div> */}
                </div>
              ))}

              {pages > 1 && (
                <div className="list-footer">
                  <span className="list-count">
                    {(curPage - 1) * PER + 1}–{Math.min(curPage * PER, filtered.length)} of {filtered.length}
                  </span>
                  <div className="pages">
                    <button className="page-btn" disabled={curPage === 1} onClick={() => setCurPage(p => p - 1)}>‹</button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`page-btn ${curPage === p ? 'on' : ''}`} onClick={() => setCurPage(p)}>{p}</button>
                    ))}
                    <button className="page-btn" disabled={curPage === pages} onClick={() => setCurPage(p => p + 1)}>›</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="bottom-row">
            <div className="card">
              <div className="card-head">
                <div className="card-title">Quick actions</div>
              </div>
              <div className="qa-grid">
                {[
                  { icon: '👤', label: 'Add renter',    sub: 'Register a new renter',        action: () => setModal(true) },
                  { icon: '💬', label: 'Send reminders', sub: 'WhatsApp all pending renters', action: () => pop('Reminders sent to all pending renters 💬') },
                  { icon: '📊', label: 'Export report',  sub: 'Download monthly PDF',         action: () => pop('Report downloading… 📊') },
                  { icon: '⚙️', label: 'Settings',       sub: 'Update property details',      action: () => setPage('settings') },
                ].map(qa => (
                  <button key={qa.label} className="qa" onClick={qa.action}>
                    <span className="qa-ic">{qa.icon}</span>
                    <span className="qa-lbl">{qa.label}</span>
                    <span className="qa-sub">{qa.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <div className="card-title">Collection rate</div>
                <span className="card-hint">Last 6 months</span>
              </div>
              <div className="chart-wrap">
                <div className="bars">
                  {MONTHS.map((m, i) => (
                    <div className="bar-col" key={m}>
                      <div className="bar-track">
                        <div
                          className="bar"
                          style={{
                            height: `${COLL[i]}%`,
                            background: i === MONTHS.length - 1 ? 'var(--teal)' : 'var(--line)',
                            border: i === MONTHS.length - 1 ? '1.5px solid var(--teal-d)' : '1.5px solid var(--line)',
                          }}
                          title={`${m}: ${COLL[i]}%`}
                        />
                      </div>
                      <span className="bar-lbl">{m}</span>
                    </div>
                  ))}
                </div>
                <div className="chart-foot">
                  <span style={{ color: 'var(--ink-4)' }}>Avg 79%</span>
                  <span>This month: 92% ↑</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ADD RENTER MODAL ═══ */}
      <div
        className={`overlay ${modal ? 'open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) { setModal(false); setForm(EMPTY); } }}
      >
        <div className="modal">
          <div className="modal-head">
            <div>
              <div className="modal-title">Add new renter</div>
              <div className="modal-sub">Reminders will start automatically on the due date.</div>
            </div>
            <button className="modal-x" onClick={() => { setModal(false); setForm(EMPTY); }}>✕</button>
          </div>

          <div className="modal-body">
            
              <div className="field">
                <label className="lbl">Full name *</label>
                <div className="inp-wrap">
                  <span className="inp-ico">👤</span>
                  <input placeholder="e.g. Rahul Kumar" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
             
             
            </div>

            <div className="field">
              <label className="lbl">Email address</label>
              <div className="inp-wrap">
                <span className="inp-ico">📧</span>
                <input type="email" placeholder="e.g. user@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label className="lbl">WhatsApp number *</label>
                <div className="inp-wrap">
                  <span className="inp-ico">📱</span>
                  <input placeholder="10-digit number" value={form.phone} maxLength={10}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))} />
                </div>
              </div>
              <div className="field">
                <label className="lbl">Monthly rent (₹) *</label>
                <div className="inp-wrap">
                  <span className="inp-ico">₹</span>
                  <input type="number" placeholder="e.g. 8500" value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="field">
              <label className="lbl">Rent due on which day of the month?</label>
              <div className="inp-wrap">
                <span className="inp-ico">📅</span>
                <select value={form.dueDay} onChange={e => setForm(f => ({ ...f, dueDay: e.target.value }))}>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(d => (
                    <option key={d} value={d}>
                      {d}{d === 1 ? 'st' : d === 2 ? 'nd' : d === 3 ? 'rd' : 'th'} of every month
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-foot">
            <button className="btn-ghost-sm" onClick={() => { setModal(false); setForm(EMPTY); }}>Cancel</button>
            <button className="btn-confirm" onClick={addRenter}>
              <PlusIcon/> Add renter &amp; start reminders
            </button>
          </div>
        </div>
      </div>

      {/* ═══ TOAST NOTIFICATION ═══ */}
      {toast && (
        <div className={`toast show ${toast.type}`}>
          {toast.type === 'ok' ? '✓' : '⚠'} {toast.msg}
        </div>
      )}

    </div>
  );
};

export default Dashboard;