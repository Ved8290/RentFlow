import React from 'react';
import './LegalPage.css';

const sections = [
  {
    num: '01',
    id: 's1',
    title: 'Acceptance of terms',
    content: (
      <>
        <p>By accessing or using Acme ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not use the Service.</p>
        <p>These terms apply to all users, including property owners, landlords, and tenants who access the platform in any capacity.</p>
      </>
    ),
  },
  {
    num: '02',
    id: 's2',
    title: 'Description of service',
    content: (
      <>
        <p>Acme is a property and rent management platform that allows landlords to manage renters, track rent payments, send automated notifications, and monitor payment status.</p>
        <p>We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.</p>
      </>
    ),
  },
  {
    num: '03',
    id: 's3',
    title: 'Account registration',
    content: (
      <>
        <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account.</p>
        <p>You must notify us immediately at support@acme.com if you suspect any unauthorized use of your account.</p>
      </>
    ),
  },
  {
    num: '04',
    id: 's4',
    title: 'Acceptable use',
    content: (
      <>
        <p>You agree not to use the Service to:</p>
        <p>
          — Upload false or misleading renter information<br />
          — Harass, threaten, or discriminate against tenants<br />
          — Attempt to gain unauthorized access to other accounts<br />
          — Use automated scripts to scrape or overload our systems<br />
          — Violate any applicable local, state, or national law
        </p>
        <div className="legal-highlight legal-highlight--warning">
          Violations of this section may result in immediate account suspension without refund.
        </div>
      </>
    ),
  },
  {
    num: '05',
    id: 's5',
    title: 'Payment and billing',
    content: (
      <>
        <p>Paid plans are billed monthly or annually in advance. All fees are in Indian Rupees (INR) and are non-refundable except where required by law.</p>
        <p>If your payment fails, access to paid features will be suspended after a 7-day grace period. You can update your payment method at any time from your account settings.</p>
      </>
    ),
  },
  {
    num: '06',
    id: 's6',
    title: 'Data and privacy',
    content: (
      <>
        <p>Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection and use of your data as described therein.</p>
        <p>You retain ownership of all data you upload to the platform. We do not sell your data to third parties.</p>
      </>
    ),
  },
  {
    num: '07',
    id: 's7',
    title: 'Intellectual property',
    content: (
      <>
        <p>The Service, including its design, code, and content, is owned by Acme and protected by applicable intellectual property laws. You may not copy, modify, or distribute any part of it without our written consent.</p>
        <p>You grant us a limited, non-exclusive license to use your data solely to provide and improve the Service.</p>
      </>
    ),
  },
  {
    num: '08',
    id: 's8',
    title: 'Limitation of liability',
    content: (
      <>
        <p>To the maximum extent permitted by law, Acme shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
        <div className="legal-highlight legal-highlight--warning">
          Our total liability to you for any claim shall not exceed the amount you paid us in the three months preceding the claim.
        </div>
      </>
    ),
  },
  {
    num: '09',
    id: 's9',
    title: 'Termination',
    content: (
      <>
        <p>You may cancel your account at any time from your account settings. We may terminate or suspend access immediately, without prior notice, for conduct that violates these Terms or is harmful to other users.</p>
        <p>Upon termination, your right to use the Service will cease. You may export your data before cancellation.</p>
      </>
    ),
  },
  {
    num: '10',
    id: 's10',
    title: 'Governing law',
    content: (
      <p>These Terms shall be governed by the laws of India, without regard to conflict of law principles. Any disputes shall be subject to the exclusive jurisdiction of courts located in Pune, Maharashtra.</p>
    ),
  },
  {
    num: '11',
    id: 's11',
    title: 'Contact us',
    content: (
      <>
        <p>If you have questions about these Terms, reach out to us:</p>
        <div className="legal-contact-card">
          <div className="legal-contact-icon">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="12" height="9" rx="1" />
              <path d="M2 5l6 5 6-5" />
            </svg>
          </div>
          <div>
            <div className="legal-contact-email">legal@rentflow.com</div>
            <div className="legal-contact-meta">We respond within 2 business days</div>
          </div>
        </div>
      </>
    ),
  },
];

const toc = [
  { id: 's1', label: '1. Acceptance of terms' },
  { id: 's2', label: '2. Description of service' },
  { id: 's3', label: '3. Account registration' },
  { id: 's4', label: '4. Acceptable use' },
  { id: 's5', label: '5. Payment and billing' },
  { id: 's6', label: '6. Data and privacy' },
  { id: 's7', label: '7. Intellectual property' },
  { id: 's8', label: '8. Limitation of liability' },
  { id: 's9', label: '9. Termination' },
  { id: 's10', label: '10. Governing law' },
  { id: 's11', label: '11. Contact us' },
];

const TermsOfService = () => {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="legal-page">
      <div className="legal-wrap">
        <div className="legal-eyebrow">Legal</div>
        <h1 className="legal-title">Terms of service</h1>
        <p className="legal-meta">Effective date: May 2, 2026 · Last updated: May 2, 2026</p>

        <div className="legal-toc">
          <div className="legal-toc-title">On this page</div>
          {toc.map((item) => (
            <button key={item.id} className="legal-toc-link" onClick={() => scrollTo(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        {sections.map((section) => (
          <div key={section.id} id={section.id} className="legal-section">
            <div className="legal-section-num">{section.num}</div>
            <div className="legal-section-title">{section.title}</div>
            <div className="legal-body">{section.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfService;