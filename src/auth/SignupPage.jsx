import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import { Signup } from "./Login";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const PROPERTY_TYPES = [
  "Apartment",
  "PG / Hostel",
  "Independent House",
  "Villa",
  "Commercial Space",
  "Co-living Space",
];

const STEPS = [
  { num: 1, label: "Account",  icon: "👤" },
  // { num: 2, label: "Property", icon: "🏠" },
  { num: 2, label: "Done",     icon: "🎉" },
];

// ─────────────────────────────────────────────────────────────────────────────
// ✅ EyeBtn — defined OUTSIDE SignupPage so its reference is stable
// ─────────────────────────────────────────────────────────────────────────────

const EyeBtn = ({ show, toggle }) => (
  <button type="button" className="sp-field__toggle" onClick={toggle} tabIndex={-1}>
    {show ? (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ) : (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    )}
  </button>
);

// ─────────────────────────────────────────────────────────────────────────────
// ✅ Field — defined OUTSIDE SignupPage so its reference is stable
// ─────────────────────────────────────────────────────────────────────────────

const Field = ({ id, label, type = "text", value, onChange, error, icon, rightSlot, ...rest }) => (
  <div className={`sp-field ${error ? "sp-field--error" : ""} ${value ? "sp-field--filled" : ""}`}>
    <label className="sp-field__label" htmlFor={id}>{label}</label>
    <div className="sp-field__wrap">
      {icon && <span className="sp-field__icon">{icon}</span>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        {...rest}
      />
      {rightSlot}
    </div>
    {error && <span className="sp-field__err">{error}</span>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PasswordStrength — also moved outside for consistency
// ─────────────────────────────────────────────────────────────────────────────

const PasswordStrength = ({ password }) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  if (!password) return null;
  return (
    <div className="sp-strength">
      <div className="sp-strength__bars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="sp-strength__bar"
            style={{ background: i <= score ? colors[score] : undefined }}
          />
        ))}
      </div>
      <span className="sp-strength__label" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// API helper
// ─────────────────────────────────────────────────────────────────────────────

const addPropertyAPI = async (city, numberOfRooms, name, ownerId) => {
  const ROOT = import.meta.env.VITE_API_URL;
  const res = await fetch(`${ROOT}/api/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ city, numberOfRooms, name, owner: ownerId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to add property");
  return data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Icon constants — defined outside so they don't recreate on every render
// ─────────────────────────────────────────────────────────────────────────────

const iconUser = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const iconEmail = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 7L2 7" />
  </svg>
);
const iconLock = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const iconBuilding = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const iconCity = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 21h18M5 21V7l8-4 8 4v14M9 21v-4h6v4" />
  </svg>
);
const iconGrid = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const navigate = useNavigate();

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [ownerId, setOwnerId] = useState(null);

  // Step 1 state
  const [acc, setAcc] = useState({
    name: "", email: "", password: "", confirmPassword: "", terms: false,
  });
  const [accErr, setAccErr]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  // Step 2 state
  const [prop, setProp]     = useState({
    propertyName: "", propertyType: "", city: "", rooms: "",
  });
  const [propErr, setPropErr] = useState({});

  // ── Validation ──────────────────────────────────────────────────────────────

  const validateAcc = () => {
    const e = {};
    if (!acc.name.trim())                       e.name = "Full name is required";
    if (!acc.email)                             e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(acc.email))  e.email = "Enter a valid email";
    if (!acc.password)                          e.password = "Password is required";
    else if (acc.password.length < 6)           e.password = "Minimum 6 characters";
    if (!acc.confirmPassword)                   e.confirmPassword = "Please confirm password";
    else if (acc.password !== acc.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!acc.terms)                             e.terms = "You must accept the terms";
    return e;
  };

  const validateProp = () => {
    const e = {};
    if (!prop.propertyName.trim()) e.propertyName = "Property name is required";
    if (!prop.propertyType)        e.propertyType  = "Select a property type";
    if (!prop.city.trim())         e.city          = "City is required";
    if (!prop.rooms || prop.rooms < 1) e.rooms     = "Enter at least 1 room";
    return e;
  };

  // ── Field change handlers ───────────────────────────────────────────────────

  const onAccChange = (field, val) => {
    setAcc(prev => ({ ...prev, [field]: val }));
    setAccErr(prev => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  const onPropChange = (field, val) => {
    setProp(prev => ({ ...prev, [field]: val }));
    setPropErr(prev => ({ ...prev, [field]: "" }));
    setApiError("");
  };

  // ── Step 1 submit ───────────────────────────────────────────────────────────

  const handleStep1 = async () => {
  const e = validateAcc();
  if (Object.keys(e).length) {
    setAccErr(e);
    return;
  }

  setLoading(true);
  setApiError("");

  try {
    const userId = Date.now().toString();

    const res = await Signup(
      acc.email,
      acc.name,
      acc.password,
      userId
    );

    if (res.message === "User already exists") {
      setApiError("User already exists. Please log in.");
      return;
    }

    if (res.message === "User created successfully") {

      // ✅ SAVE TOKEN
      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      // ✅ SAVE USER (IMPORTANT FIX)
      const userData = res.user || {
        email: acc.email,
        name: acc.name,
        uid: userId
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ SAVE OWNER ID (for your property flow)
      localStorage.setItem("ownerId", userId);

      console.log("Saved User:", userData);

      setOwnerId(userId);
      setStep(2);

    } else {
      setApiError(res.message || "Signup failed. Please try again.");
    }

  } catch (err) {
    console.error("Signup error:", err);
    setApiError("An error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // ── Step 2 submit ───────────────────────────────────────────────────────────

  const handleStep2 = async () => {
    const e = validateProp();
    if (Object.keys(e).length) { setPropErr(e); return; }

    setLoading(true);
    setApiError("");

    try {
      const response = await addPropertyAPI(
        prop.city,
        Number(prop.rooms),
        prop.propertyName,
        ownerId
      );
      console.log("Property added:", response);
      setStep(3);
    } catch (err) {
      console.error("AddProperty error:", err);
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="sp-root">
      <div className="sp-bg-grid" />
      <div className="sp-orb sp-orb--1" />
      <div className="sp-orb sp-orb--2" />

      <div className="sp-wrap">
        {/* Logo */}
        <a href="/" className="sp-logo">
          <span className="sp-logo__mark">R</span>
          <span className="sp-logo__text">Rent<strong>Flow</strong></span>
        </a>

        {/* Stepper */}
        <div className="sp-stepper">
          {STEPS.map((s, idx) => {
            const done   = step > s.num;
            const active = step === s.num;
            return (
              <div className="sp-stepper__item" key={s.num}>
                <div className={`sp-step-node ${active ? "sp-step-node--active" : ""} ${done ? "sp-step-node--done" : ""}`}>
                  {done ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : s.num}
                </div>
                <span className={`sp-step-label ${active ? "sp-step-label--active" : ""}`}>{s.label}</span>
                {idx < STEPS.length  && (
                  <div className={`sp-step-line ${step > s.num ? "sp-step-line--done" : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="sp-card" key={step}>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <div className="sp-card__header">
                <h2>Create your account</h2>
                <p>Start your free RentFlow account in seconds</p>
              </div>

              {apiError && (
                <div className="sp-alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {apiError}
                </div>
              )}

              <div className="sp-form">
                <Field
                  id="sp-name" label="Full Name" value={acc.name}
                  onChange={v => onAccChange("name", v)}
                  error={accErr.name} icon={iconUser} placeholder="John Doe"
                />
                <Field
                  id="sp-email" label="Email Address" type="email" value={acc.email}
                  onChange={v => onAccChange("email", v)}
                  error={accErr.email} icon={iconEmail} placeholder="you@example.com"
                />

                {/* Password with strength meter */}
                <div className={`sp-field ${accErr.password ? "sp-field--error" : ""}`}>
                  <label className="sp-field__label" htmlFor="sp-pass">Password</label>
                  <div className="sp-field__wrap">
                    <span className="sp-field__icon">{iconLock}</span>
                    <input
                      id="sp-pass"
                      type={showPass ? "text" : "password"}
                      value={acc.password}
                      onChange={e => onAccChange("password", e.target.value)}
                      placeholder="Minimum 6 characters"
                    />
                    <EyeBtn show={showPass} toggle={() => setShowPass(p => !p)} />
                  </div>
                  {accErr.password && <span className="sp-field__err">{accErr.password}</span>}
                  <PasswordStrength password={acc.password} />
                </div>

                {/* Confirm Password */}
                <div className={`sp-field ${accErr.confirmPassword ? "sp-field--error" : ""}`}>
                  <label className="sp-field__label" htmlFor="sp-conf">Confirm Password</label>
                  <div className="sp-field__wrap">
                    <span className="sp-field__icon">{iconLock}</span>
                    <input
                      id="sp-conf"
                      type={showConf ? "text" : "password"}
                      value={acc.confirmPassword}
                      onChange={e => onAccChange("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                    />
                    <EyeBtn show={showConf} toggle={() => setShowConf(p => !p)} />
                  </div>
                  {accErr.confirmPassword && <span className="sp-field__err">{accErr.confirmPassword}</span>}
                </div>

                {/* Terms */}
                <div className={`sp-terms-wrap ${accErr.terms ? "sp-terms-wrap--error" : ""}`}>
                  <label className="sp-checkbox">
                    <input
                      type="checkbox"
                      checked={acc.terms}
                      onChange={e => onAccChange("terms", e.target.checked)}
                    />
                    <span className="sp-checkbox__box" />
                    <span>
                      I agree to the{" "}
                      <a href="/terms" className="sp-link">Terms of Service</a> and{" "}
                      <a href="/privacy" className="sp-link">Privacy Policy</a>
                    </span>
                  </label>
                  {accErr.terms && <span className="sp-field__err">{accErr.terms}</span>}
                </div>
              </div>

              <button
                className={`sp-btn ${loading ? "sp-btn--loading" : ""}`}
                onClick={handleStep1}
                disabled={loading}
              >
                {loading ? (
                  <><span className="sp-btn__spinner" /> Creating account…</>
                ) : (
                  <>
                    Continue {" "}
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 0 && (
            <>
              <div className="sp-card__header">
                <h2>Set up your property</h2>
                <p>Tell us about the property you manage</p>
              </div>

              {apiError && (
                <div className="sp-alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {apiError}
                </div>
              )}

              <div className="sp-form">
                <Field
                  id="sp-pname" label="Property Name" value={prop.propertyName}
                  onChange={v => onPropChange("propertyName", v)}
                  error={propErr.propertyName} icon={iconBuilding}
                  placeholder="e.g. Sunrise Apartments"
                />

                {/* Property Type Select */}
                <div className={`sp-field ${propErr.propertyType ? "sp-field--error" : ""} ${prop.propertyType ? "sp-field--filled" : ""}`}>
                  <label className="sp-field__label" htmlFor="sp-type">Property Type</label>
                  <div className="sp-field__wrap sp-field__wrap--select">
                    <span className="sp-field__icon">{iconGrid}</span>
                    <select
                      id="sp-type"
                      value={prop.propertyType}
                      onChange={e => onPropChange("propertyType", e.target.value)}
                    >
                      <option value="" disabled>Select type…</option>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="sp-select-arrow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                  {propErr.propertyType && <span className="sp-field__err">{propErr.propertyType}</span>}
                </div>

                <div className="sp-two-col">
                  <Field
                    id="sp-city" label="City" value={prop.city}
                    onChange={v => onPropChange("city", v)}
                    error={propErr.city} icon={iconCity} placeholder="Mumbai"
                  />
                  <Field
                    id="sp-rooms" label="Number of Rooms" type="number" value={prop.rooms}
                    onChange={v => onPropChange("rooms", v)}
                    error={propErr.rooms} icon={iconGrid} placeholder="12" min="1"
                  />
                </div>
              </div>

              <div className="sp-btn-row">
                <button className="sp-btn-back" onClick={() => setStep(1)}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  Back
                </button>
                <button
                  className={`sp-btn sp-btn--flex ${loading ? "sp-btn--loading" : ""}`}
                  onClick={handleStep2}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="sp-btn__spinner" /> Setting up…</>
                  ) : (
                    <>
                      Complete Setup{" "}
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 2 && (
            <div className="sp-success">
              <div className="sp-success__confetti">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="confetti-dot" style={{ "--i": i }} />
                ))}
              </div>
              <div className="sp-success__icon">🎉</div>
              <h2>You're all set!</h2>
              <p>
                Your RentFlow account is ready. Start adding tenants and
                automate your rent collection in minutes.
              </p>
              <div className="sp-success__checklist">
                {["Account created",  "Email reminders ready"].map((item, i) => (
                  <div className="sp-success__check" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                    <span className="sp-success__tick">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
              <button className="sp-btn sp-btn--full" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <p className="sp-footer-note">
          Already have an account? <a href="/login" className="sp-link">Sign in →</a>
        </p>
      </div>
    </div>
  );
}