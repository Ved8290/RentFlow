import React from 'react';
import './LegalPage.css';

const dataTable = [
  { category: 'Account info', examples: 'Name, email, password hash', source: 'You, on sign-up' },
  { category: 'Renter data', examples: 'Renter name, mobile, rent amount, due day', source: 'You, via dashboard' },
  { category: 'Usage data', examples: 'Pages visited, actions taken, timestamps', source: 'Automatically' },
  { category: 'Device info', examples: 'Browser type, OS, IP address', source: 'Automatically' },
  { category: 'Payment info', examples: 'Billing address, last 4 digits of card', source: 'Payment processor' },
];

const rights = [
  { name: 'Access', desc: 'Request a copy of all data we hold about you' },
  { name: 'Correction', desc: 'Ask us to fix inaccurate or incomplete data' },
  { name: 'Deletion', desc: 'Request erasure of your personal data' },
  { name: 'Portability', desc: 'Receive your data in a machine-readable format' },
  { name: 'Objection', desc: 'Object to certain processing of your data' },
];

const toc = [
  { id: 'p1', label: '1. What we collect' },
  { id: 'p2', label: '2. How we use your data' },
  { id: 'p3', label: '3. Data sharing' },
  { id: 'p4', label: '4. Data storage and security' },
  { id: 'p5', label: '5. Cookies' },
  { id: 'p6', label: '6. Your rights' },
  { id: 'p7', label: '7. Data retention' },
  { id: 'p8', label: "8. Children's privacy" },
  { id: 'p9', label: '9. Changes to this policy' },
  { id: 'p10', label: '10. Contact us' },
];

const PrivacyPolicy = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <div className="legal-eyebrow">Legal</div>
        <h1 className="legal-title">Privacy policy</h1>
        <p className="legal-meta">Effective date: May 2, 2026 · Last updated: May 2, 2026</p>

        <div className="legal-toc">
          <div className="legal-toc-title">On this page</div>
          {toc.map((item) => (
            <button key={item.id} className="legal-toc-link" onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Section 1 */}
        <div id="p1" className="legal-section">
          <div className="legal-section-num">01</div>
          <div className="legal-section-title">What we collect</div>
          <div className="legal-body">
            <p>We collect only the information needed to provide the Service.</p>
          </div>
          <table className="legal-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Examples</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {dataTable.map((row) => (
                <tr key={row.category}>
                  <td>{row.category}</td>
                  <td>{row.examples}</td>
                  <td>{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="legal-highlight legal-highlight--info">
            We never store full card numbers. Payment processing is handled by Razorpay under their own privacy policy.
          </div>
        </div>

        {/* Section 2 */}
        <div id="p2" className="legal-section">
          <div className="legal-section-num">02</div>
          <div className="legal-section-title">How we use your data</div>
          <div className="legal-body">
            <p>We use the information we collect to:</p>
            <p>
              — Provide, maintain, and improve the Service<br />
              — Send automated rent reminder and overdue emails to renters<br />
              — Process your subscription payments<br />
              — Respond to support requests<br />
              — Detect and prevent fraud or abuse<br />
              — Comply with legal obligations
            </p>
            <p>We do not use your data for advertising and we do not build advertising profiles on you or your renters.</p>
          </div>
        </div>

        {/* Section 3 */}
        <div id="p3" className="legal-section">
          <div className="legal-section-num">03</div>
          <div className="legal-section-title">Data sharing</div>
          <div className="legal-body">
            <p>We do not sell your personal data. We share data only with:</p>
            <p>
              — Service providers who help us operate the platform (e.g. MongoDB Atlas, Gmail/Nodemailer, Razorpay)<br />
              — Law enforcement or regulators when required by applicable Indian law<br />
              — A successor entity in the event of a merger or acquisition, with notice to you
            </p>
            <p>All third-party providers are bound by data processing agreements and may not use your data for their own purposes.</p>
          </div>
        </div>

        {/* Section 4 */}
        <div id="p4" className="legal-section">
          <div className="legal-section-num">04</div>
          <div className="legal-section-title">Data storage and security</div>
          <div className="legal-body">
            <p>Your data is stored on servers located in India (Mumbai region). We use industry-standard measures including encrypted connections (TLS), hashed passwords (bcrypt), and role-based access controls.</p>
            <p>No method of transmission over the internet is 100% secure. If we become aware of a data breach that affects you, we will notify you within 72 hours.</p>
          </div>
        </div>

        {/* Section 5 */}
        <div id="p5" className="legal-section">
          <div className="legal-section-num">05</div>
          <div className="legal-section-title">Cookies</div>
          <div className="legal-body">
            <p>We use two categories of cookies:</p>
            <p>
              — Essential cookies: required for login sessions and security. These cannot be disabled.<br />
              — Analytics cookies: help us understand how the Service is used. You can opt out from your account settings at any time.
            </p>
            <p>We do not use third-party advertising cookies.</p>
          </div>
        </div>

        {/* Section 6 */}
        <div id="p6" className="legal-section">
          <div className="legal-section-num">06</div>
          <div className="legal-section-title">Your rights</div>
          <div className="legal-body">
            <p>Under applicable law, you have the following rights regarding your personal data:</p>
          </div>
          <div className="legal-rights-grid">
            {rights.map((r) => (
              <div key={r.name} className="legal-right-item">
                <div className="legal-right-name">{r.name}</div>
                <div className="legal-right-desc">{r.desc}</div>
              </div>
            ))}
          </div>
          <div className="legal-body" style={{ marginTop: '0.75rem' }}>
            <p>To exercise any of these rights, email us at privacy@acme.com. We will respond within 30 days.</p>
          </div>
        </div>

        {/* Section 7 */}
        <div id="p7" className="legal-section">
          <div className="legal-section-num">07</div>
          <div className="legal-section-title">Data retention</div>
          <div className="legal-body">
            <p>We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where required by law (e.g. billing records for 7 years under Indian tax law).</p>
          </div>
        </div>

        {/* Section 8 */}
        <div id="p8" className="legal-section">
          <div className="legal-section-num">08</div>
          <div className="legal-section-title">Children's privacy</div>
          <div className="legal-body">
            <p>The Service is not directed at individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has provided us with their data, contact us and we will delete it promptly.</p>
          </div>
        </div>

        {/* Section 9 */}
        <div id="p9" className="legal-section">
          <div className="legal-section-num">09</div>
          <div className="legal-section-title">Changes to this policy</div>
          <div className="legal-body">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice in your dashboard at least 14 days before the change takes effect.</p>
            <p>Continued use of the Service after changes take effect constitutes your acceptance of the updated policy.</p>
          </div>
        </div>

        {/* Section 10 */}
        <div id="p10" className="legal-section">
          <div className="legal-section-num">10</div>
          <div className="legal-section-title">Contact us</div>
          <div className="legal-body">
            <p>For privacy-related questions or to exercise your rights:</p>
          </div>
          <div className="legal-contact-card">
            <div className="legal-contact-icon">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="12" height="9" rx="1" />
                <path d="M2 5l6 5 6-5" />
              </svg>
            </div>
            <div>
              <div className="legal-contact-email">privacy@rentflow.com</div>
              <div className="legal-contact-meta">Data Protection Officer · RentFlow, Pune, Maharashtra, India</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;