import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import {Login} from "./Login"


const ACTIVITY = [
  { icon: "💸", text: "₹18,500 collected from Flat 4B", time: "2m ago", type: "success" },
  { icon: "📧", text: "Reminder sent to 3 tenants", time: "15m ago", type: "info" },
  { icon: "✅", text: "Ravi Kumar marked as paid", time: "1h ago", type: "success" },
  { icon: "🔔", text: "Due date alert: Unit 2A tomorrow", time: "3h ago", type: "warning" },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Minimum 6 characters";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

 
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.email || !form.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await Login(form.email, form.password);
    console.log(form.email, form.password);
    if (response.success) {
      alert("Login successful!");

      // ✅ Store token (if exists)
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // ✅ Store user data
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
        console.log("Logged in user:", response.user);
      }

      navigate("/dashboard");

    } else {
      alert("Login failed: " + response.message);
      console.warn("Login failed:", response.message);
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong!");
  }
};


  return (
    <div className="lp-root">
      {/* ── LEFT PANEL ── */}
      <div className="lp-left">
        <div className="lp-left__noise" />
        <div className="lp-left__shapes">
          <div className="shape shape--1" />
          <div className="shape shape--2" />
          <div className="shape shape--3" />
          <div className="shape shape--4" />
        </div>

        <div className="lp-left__content">
          <a href="/" className="lp-logo">
            <span className="lp-logo__mark">R</span>
            <span className="lp-logo__text">Rent<strong>Flow</strong></span>
          </a>

          <div className="lp-hero">
            <div className="lp-hero__eyebrow">Trusted by 3,000+ landlords</div>
            <h1 className="lp-hero__h1">
              Automate Your<br />
              <span className="lp-hero__accent">Rent Collection</span>
            </h1>
            <p className="lp-hero__sub">
              Track payments, manage tenants, and send automated reminders via email — all in one place.
            </p>
          </div>

          <div className="lp-stats">
            <div className="lp-stat">
              <span className="lp-stat__val">₹4.2Cr</span>
              <span className="lp-stat__label">Rent Collected</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat__val">98K+</span>
              <span className="lp-stat__label">Reminders Sent</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat__val">99%</span>
              <span className="lp-stat__label">Uptime</span>
            </div>
          </div>

          <div className="lp-feed">
            <div className="lp-feed__header">
              <span className="lp-feed__dot" />
              Live Activity
            </div>
            {ACTIVITY.map((a, i) => (
              <div className="lp-feed__item" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                <span className="lp-feed__icon">{a.icon}</span>
                <div className="lp-feed__body">
                  <span className="lp-feed__text">{a.text}</span>
                  <span className="lp-feed__time">{a.time}</span>
                </div>
                <span className={`lp-feed__badge lp-feed__badge--${a.type}`}>{a.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="lp-right">
        <div className="lp-card">
          <div className="lp-card__header">
            <h2>Welcome back</h2>
            <p>Sign in to your RentFlow dashboard</p>
          </div>

          {apiError && (
            <div className="lp-alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {apiError}
            </div>
          )}

          <form className="lp-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className={`lp-field ${errors.email ? "lp-field--error" : ""} ${form.email ? "lp-field--filled" : ""}`}>
              <label className="lp-field__label" htmlFor="lp-email">Email address</label>
              <div className="lp-field__wrap">
                <span className="lp-field__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 7L2 7"/></svg>
                </span>
                <input
                  id="lp-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="lp-field__err">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className={`lp-field ${errors.password ? "lp-field--error" : ""} ${form.password ? "lp-field--filled" : ""}`}>
              <label className="lp-field__label" htmlFor="lp-pass">Password</label>
              <div className="lp-field__wrap">
                <span className="lp-field__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  id="lp-pass"
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" className="lp-field__toggle" onClick={() => setShowPass(!showPass)} tabIndex={-1}>
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="lp-field__err">{errors.password}</span>}
            </div>

            {/* Remember + Forgot */}
            <div className="lp-form__meta">
              <label className="lp-checkbox">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                <span className="lp-checkbox__box" />
                Remember me
              </label>
              <a href="/forgot-password" className="lp-link">Forgot password?</a>
            </div>

            <button type="submit" className={`lp-btn ${loading ? "lp-btn--loading" : ""}`} disabled={loading}>
              {loading ? (
                <>
                  <span className="lp-btn__spinner" />
                  Signing in…
                </>
              ) : (
                <>
                  Login to Dashboard
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </form>

          <div className="lp-card__footer">
            Don't have an account?{" "}
            <a href="/signup" className="lp-link lp-link--bold">Create one free →</a>
          </div>
        </div>
      </div>
    </div>
  );
}