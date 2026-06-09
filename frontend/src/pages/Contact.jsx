import { useState, useEffect } from "react";
import { Send, Mail, MapPin, Phone } from "lucide-react";

const CONTACT_API = `${import.meta.env.VITE_URL_API}api/contact`;
const DETAILS_API = `${import.meta.env.VITE_URL_API}api/details`;

export default function Contact() {
  const [form,    setForm]    = useState({ name: "", email: "", message: "" });
  const [sent,    setSent]    = useState(false);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState(null);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    fetch(DETAILS_API)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((data) => {
        const item = Array.isArray(data) ? data[0] : data;
        setDetails([
          { label: "Email",    value: item.email,        icon: Mail,   href: `mailto:${item.email}` },
          { label: "Phone",    value: String(item.phone),icon: Phone,  href: `tel:${item.phone}`    },
          { label: "Location", value: item.location,     icon: MapPin, href: null                   },
        ].filter((d) => d.value));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load contact details:", err);
        setError("Could not load contact info.");
        setDetails([
          { label: "Email",    value: "hello@example.com", icon: Mail,  href: "mailto:hello@example.com" },
          { label: "Phone",    value: "+92 300 0000000",   icon: Phone, href: "tel:+923000000000"        },
          { label: "Location", value: "Karachi, PK",       icon: MapPin,href: null                       },
        ]);
        setLoading(false);
      })
      .finally(() => setTimeout(() => setLoaded(true), 100));
  }, []);

  const handleChange  = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error("Error sending:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .cp-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg, #0a0a0f);
          min-height: 100vh;
          padding: 6rem 1.5rem 6rem;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient glows */
        .cp-root::before {
          content: '';
          position: fixed;
          top: -30%; left: -20%;
          width: 70vw; height: 70vw;
          background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .cp-root::after {
          content: '';
          position: fixed;
          bottom: -20%; right: -15%;
          width: 55vw; height: 55vw;
          background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .cp-inner {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
        }

        /* ── Hero ── */
        .cp-hero { margin-bottom: 4.5rem; }

        .cp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #7dd3fc;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .cp-eyebrow::before {
          content: '';
          width: 28px; height: 1px;
          background: #7dd3fc;
        }

        .cp-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--text-h, #f1f0ff);
          margin: 0 0 1.25rem;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s;
        }

        .cp-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cp-sub {
          font-size: 1rem;
          color: var(--text, #9ca3af);
          line-height: 1.75;
          max-width: 460px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s;
        }

        /* loaded */
        .cp-root.is-loaded .cp-eyebrow,
        .cp-root.is-loaded .cp-h1,
        .cp-root.is-loaded .cp-sub { opacity: 1; transform: translateY(0); }

        .cp-root.is-loaded .cp-info-card { opacity: 1; transform: translateY(0); }
        .cp-root.is-loaded .cp-form-wrap { opacity: 1; transform: translateY(0); }

        /* ── Layout ── */
        .cp-layout {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 1.5rem;
          align-items: start;
        }

        /* ── Info Cards ── */
        .cp-info-col {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cp-info-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 1.4rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.1rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 0.55s ease,
            transform 0.55s ease,
            border-color 0.3s,
            background 0.3s,
            box-shadow 0.3s;
        }

        .cp-info-card:nth-child(1) { transition-delay: 0.05s; }
        .cp-info-card:nth-child(2) { transition-delay: 0.12s; }
        .cp-info-card:nth-child(3) { transition-delay: 0.19s; }

        .cp-info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: #60a5fa;
          opacity: 0.4;
          transition: opacity 0.3s;
        }

        .cp-info-card:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(96,165,250,0.25);
          box-shadow: 0 0 0 1px rgba(96,165,250,0.1), 0 16px 36px rgba(0,0,0,0.3);
          transform: translateY(-4px) !important;
        }
        .cp-info-card:hover::before { opacity: 1; }

        .cp-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #38bdf8;
          transition: background 0.3s, border-color 0.3s;
        }
        .cp-info-card:hover .cp-icon-wrap {
          background: rgba(59,130,246,0.18);
          border-color: rgba(59,130,246,0.4);
        }

        .cp-info-label {
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 0.25rem;
        }

        .cp-info-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: #bfdbfe;
          text-decoration: none;
          transition: color 0.2s;
        }
        .cp-info-value:hover { color: #fff; }

        /* ── Form wrap ── */
        .cp-form-wrap {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2.25rem 2.25rem 2rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease 0.15s, transform 0.65s ease 0.15s;
        }

        .cp-form-wrap::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, #6366f1, #06b6d4);
          opacity: 0.5;
        }

        /* ── Form ── */
        .cp-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .cp-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .cp-field {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .cp-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .cp-input, .cp-textarea {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 0.8rem 1rem;
          color: var(--text-h, #f1f0ff);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }

        .cp-input::placeholder, .cp-textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .cp-input:focus, .cp-textarea:focus {
          border-color: rgba(96,165,250,0.5);
          background: rgba(96,165,250,0.05);
          box-shadow: 0 0 0 3px rgba(96,165,250,0.1);
        }

        .cp-textarea {
          resize: vertical;
          min-height: 140px;
        }

        /* ── Submit ── */
        .cp-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #6366f1, #06b6d4);
          color: #fff;
          border: none;
          border-radius: 12px;
          padding: 0.9rem 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(59,130,246,0.35);
          letter-spacing: 0.02em;
          margin-top: 0.25rem;
        }
        .cp-submit:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(59,130,246,0.45);
        }
        .cp-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Success ── */
        .cp-success {
          text-align: center;
          padding: 2rem 1.5rem;
          color: #86efac;
          font-size: 0.9rem;
          background: rgba(34,197,94,0.06);
          border: 1px solid rgba(34,197,94,0.18);
          border-radius: 14px;
          animation: cp-fade 0.4s ease;
          line-height: 1.7;
        }
        .cp-success strong {
          display: block;
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        @keyframes cp-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* error note */
        .cp-error-note {
          font-size: 0.72rem;
          color: #f87171;
          margin-top: 0.5rem;
          opacity: 0.8;
        }

        @media (max-width: 700px) {
          .cp-layout { grid-template-columns: 1fr; }
          .cp-row    { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className={`cp-root${loaded ? " is-loaded" : ""}`}>
        <div className="cp-inner">

          {/* Hero */}
          <div className="cp-hero">
            <p className="cp-eyebrow">Get In Touch</p>
            <h1 className="cp-h1">
              Contact<br /><em>Me</em>
            </h1>
            <p className="cp-sub">
              Have a project in mind or just want to say hi? I'd love to hear from you.
            </p>
          </div>

          {/* Layout */}
          <div className="cp-layout">

            {/* Info Cards */}
            <div className="cp-info-col">
              {details.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="cp-info-card">
                  <div className="cp-icon-wrap"><Icon size={17} /></div>
                  <div>
                    <div className="cp-info-label">{label}</div>
                    {href
                      ? <a href={href} className="cp-info-value">{loading ? "Loading…" : value}</a>
                      : <span className="cp-info-value">{loading ? "Loading…" : value}</span>
                    }
                  </div>
                </div>
              ))}
              {error && <p className="cp-error-note">⚠ {error}</p>}
            </div>

            {/* Form */}
            <div className="cp-form-wrap">
              {sent ? (
                <div className="cp-success">
                  <strong>Message sent! ✓</strong>
                  I'll get back to you soon.
                </div>
              ) : (
                <form className="cp-form" onSubmit={handleSubmit}>
                  <div className="cp-row">
                    <div className="cp-field">
                      <label className="cp-label">Name</label>
                      <input
                        className="cp-input"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="cp-field">
                      <label className="cp-label">Email</label>
                      <input
                        className="cp-input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="cp-field">
                    <label className="cp-label">Message</label>
                    <textarea
                      className="cp-textarea"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      required
                    />
                  </div>
                  <button type="submit" className="cp-submit" disabled={sending}>
                    <Send size={15} />
                    {sending ? "Sending…" : "Send Message"}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}