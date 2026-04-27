import React, { useEffect, useRef, useState } from "react";
import "./LandingPage.css";

const NAV_LINKS = ["Home", "Features", "How It Works", "Benefits"];

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          <span className="logo-mark">R</span>
          <span className="logo-text">Rent<strong>Flow</strong></span>
        </a>

        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          {NAV_LINKS.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase().replace(/\s+/g, "-")}`} onClick={() => setMenuOpen(false)}>
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar__cta">
          <a href="#" className="btn btn--ghost">Sign In</a>
          <a href="#" className="btn btn--primary">Get Started</a>
        </div>

        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? "open" : ""}></span>
          <span className={menuOpen ? "open" : ""}></span>
          <span className={menuOpen ? "open" : ""}></span>
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__bg-grid" aria-hidden="true" />
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />

      <div className="hero__inner container">
        <div className="hero__content">
          <div className="hero__badge">
            <span className="badge-dot" />
            Trusted by 3,000+ landlords
          </div>
          <h1 className="hero__headline">
            Simplify Rent Collection with{" "}
            <span className="headline-gradient">Smart Email Reminders</span>
          </h1>
          <p className="hero__sub">
            Manage tenants, track payments, and automate rent reminders
            effortlessly — all from one powerful dashboard.
          </p>
          <div className="hero__actions">
            <a href="#" className="btn btn--primary btn--lg">
              Get Started Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#how-it-works" className="btn btn--outline btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              Learn More
            </a>
          </div>
          <div className="hero__social-proof">
            <div className="avatars">
              {["#4f8ef7","#2563eb","#1e3a8a","#60a5fa"].map((c, i) => (
                <span key={i} className="avatar" style={{ background: c }} />
              ))}
            </div>
            <span>Join <strong>3,000+</strong> property managers</span>
          </div>
        </div>

        <div className="hero__visual">
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <span className="dc-dot dc-dot--red" />
              <span className="dc-dot dc-dot--yellow" />
              <span className="dc-dot dc-dot--green" />
              <span className="dc-title">RentFlow Dashboard</span>
            </div>
            <div className="dashboard-card__body">
              <div className="dc-stat-row">
                <div className="dc-stat">
                  <span className="dc-stat__val">$24,800</span>
                  <span className="dc-stat__label">Monthly Revenue</span>
                  <span className="dc-stat__change up">↑ 12%</span>
                </div>
                <div className="dc-stat">
                  <span className="dc-stat__val">96%</span>
                  <span className="dc-stat__label">On-time Payments</span>
                  <span className="dc-stat__change up">↑ 4%</span>
                </div>
                <div className="dc-stat">
                  <span className="dc-stat__val">47</span>
                  <span className="dc-stat__label">Active Tenants</span>
                  <span className="dc-stat__change up">↑ 3</span>
                </div>
              </div>
              <div className="dc-bar-chart">
                {[65, 80, 55, 90, 72, 88, 95].map((h, i) => (
                  <div key={i} className="dc-bar-wrap">
                    <div className="dc-bar" style={{ "--h": `${h}%`, "--delay": `${i * 0.1}s` }} />
                  </div>
                ))}
              </div>
              <div className="dc-reminders">
                <span className="dc-reminders__label">📬 Reminders Sent Today</span>
                <div className="dc-reminder-items">
                  {["John Doe – Unit 4A", "Sara Lee – Unit 7B", "Mike Chen – Unit 2C"].map((t, i) => (
                    <div key={i} className="dc-reminder-item">
                      <span className="dc-reminder-dot" />
                      <span>{t}</span>
                      <span className="dc-reminder-badge">Sent</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="hero__float-card hero__float-card--1">
            <span>✅</span> Payment received
          </div>
          <div className="hero__float-card hero__float-card--2">
            <span>📧</span> Reminder scheduled
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: "✉️",
    title: "Email Automation",
    desc: "Send personalized rent reminders automatically before, on, and after due dates. Set it once and let RentFlow handle the rest.",
    accent: "#2563eb",
  },
  {
    icon: "👥",
    title: "Tenant Management",
    desc: "Store all tenant details, lease terms, and contact info in one place. Filter, search, and manage with ease.",
    accent: "#0ea5e9",
  },
  {
    icon: "💳",
    title: "Payment Tracking",
    desc: "Log and monitor every payment in real time. Identify overdue tenants and take action instantly.",
    accent: "#6366f1",
  },
  {
    icon: "📊",
    title: "Dashboard Insights",
    desc: "Visual analytics for collection rates, outstanding balances, and revenue trends — all at a glance.",
    accent: "#14b8a6",
  },
];

function Features() {
  return (
    <section className="features section" id="features">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">Features</span>
          <h2>Everything You Need to <span className="headline-gradient">Collect Rent Smarter</span></h2>
          <p>A complete toolkit designed for modern landlords and property managers.</p>
        </div>
        <div className="features__grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card reveal" key={i} style={{ "--accent": f.accent, "--delay": `${i * 0.1}s` }}>
              <div className="feature-card__icon" style={{ background: `${f.accent}18` }}>
                <span>{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="feature-card__hover-bar" style={{ background: f.accent }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    num: "01",
    icon: "👤",
    title: "Add Your Tenants",
    desc: "Import or manually add tenant profiles with lease start dates, rent amounts, and email addresses.",
  },
  {
    num: "02",
    icon: "📅",
    title: "Set Rent & Due Dates",
    desc: "Configure monthly rent amounts, grace periods, and preferred reminder schedules for each tenant.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Automatic Email Reminders",
    desc: "RentFlow sends beautifully designed, personalized reminders — so you never have to chase rent again.",
  },
];

function HowItWorks() {
  return (
    <section className="how-it-works section" id="how-it-works">
      <div className="hiw-bg-accent" aria-hidden="true" />
      <div className="container">
        <div className="section-header reveal">
          <span className="section-tag">How It Works</span>
          <h2>Up and Running in <span className="headline-gradient">3 Simple Steps</span></h2>
          <p>No complex setup. No technical knowledge required. Start collecting rent smarter in minutes.</p>
        </div>
        <div className="hiw__steps">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className="hiw-step reveal" style={{ "--delay": `${i * 0.15}s` }}>
                <div className="hiw-step__num">{s.num}</div>
                <div className="hiw-step__icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hiw-connector" aria-hidden="true">
                  <svg viewBox="0 0 80 24" fill="none">
                    <path d="M0 12 Q40 0 80 12" stroke="#2563eb" strokeWidth="2" strokeDasharray="6 4" />
                    <path d="M70 6 L80 12 L70 18" stroke="#2563eb" strokeWidth="2" fill="none" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

const BENEFITS = [
  { icon: "⏱️", title: "Saves Time", desc: "Automate repetitive reminders and spend time on what matters — growing your portfolio." },
  { icon: "🔧", title: "Reduces Manual Work", desc: "Eliminate spreadsheets, sticky notes, and manual follow-ups. Everything is automated." },
  { icon: "📈", title: "Improves Payment Tracking", desc: "Get a clear picture of who has paid, who's late, and what's outstanding — in real time." },
  { icon: "💡", title: "Easy to Use", desc: "An intuitive interface designed for non-technical landlords. No onboarding needed." },
];

function Benefits() {
  return (
    <section className="benefits section" id="benefits">
      <div className="container benefits__inner">
        <div className="benefits__left reveal">
          <span className="section-tag">Why RentFlow</span>
          <h2>Built for Landlords Who <span className="headline-gradient">Value Their Time</span></h2>
          <p>
            Whether you manage 2 units or 200, RentFlow adapts to your workflow and
            makes rent collection seamless, professional, and stress-free.
          </p>
          <a href="#" className="btn btn--primary btn--lg">Start Free Today</a>
          <div className="benefits__stats">
            <div className="benefit-stat">
              <span className="benefit-stat__val">87%</span>
              <span className="benefit-stat__label">Fewer late payments</span>
            </div>
            <div className="benefit-stat">
              <span className="benefit-stat__val">5 hrs</span>
              <span className="benefit-stat__label">Saved per week</span>
            </div>
          </div>
        </div>
        <div className="benefits__right">
          {BENEFITS.map((b, i) => (
            <div className="benefit-item reveal" key={i} style={{ "--delay": `${i * 0.1}s` }}>
              <div className="benefit-item__icon">{b.icon}</div>
              <div>
                <h4>{b.title}</h4>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="cta-section section">
      <div className="cta-bg" aria-hidden="true">
        <div className="cta-orb cta-orb--1" />
        <div className="cta-orb cta-orb--2" />
      </div>
      <div className="container cta-inner reveal">
        <span className="cta-tag">Ready to get started?</span>
        <h2>Start Managing Your Rent <br /><span>Smarter Today</span></h2>
        <p>Join thousands of landlords who've already simplified their rent collection workflow.</p>
        <div className="cta-actions">
          <a href="#" className="btn btn--white btn--lg">
            Get Started Now
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <span className="cta-note">Free plan available · No credit card required</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#" className="navbar__logo">
            <span className="logo-mark">R</span>
            <span className="logo-text">Rent<strong>Flow</strong></span>
          </a>
          <p>The smart way to manage rent reminders and tenant communications.</p>
          <div className="footer__socials">
            {["𝕏", "in", "▶"].map((s, i) => (
              <a key={i} href="#" className="social-icon">{s}</a>
            ))}
          </div>
        </div>
        <div className="footer__col">
          <h5>Product</h5>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Changelog</a>
          <a href="#">Roadmap</a>
        </div>
        <div className="footer__col">
          <h5>Company</h5>
          <a href="#">About Us</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Contact</a>
        </div>
        <div className="footer__col">
          <h5>Legal</h5>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
        <div className="footer__col footer__newsletter">
          <h5>Stay Updated</h5>
          <p>Get product updates and tips.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn btn--primary">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <span>© 2025 RentFlow Inc. All rights reserved.</span>
          <div className="footer__bottom-links">
            <a href="#">Home</a>
            <a href="#">Features</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  useScrollReveal();
  return (
    <div className="landing-root">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}