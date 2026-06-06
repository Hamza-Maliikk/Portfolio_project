import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_URL_API}`;

const COLORS = [
  { accent: "#8b5cf6", glow: "rgba(139,92,246,0.3)" },
  { accent: "#3b82f6", glow: "rgba(59,130,246,0.3)"  },
  { accent: "#ec4899", glow: "rgba(236,72,153,0.3)"  },
  { accent: "#10b981", glow: "rgba(16,185,129,0.3)"  },
  { accent: "#f59e0b", glow: "rgba(245,158,11,0.3)"  },
];

export default function Skills() {
  const [skills,  setSkills]  = useState([]);
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res  = await fetch(`${API}api/about`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data?.skills?.length > 0) {
          setSkills([{ category: "Skills", items: data.skills }]);
        }
      } catch (err) {
        console.error("Skills fetch error:", err);
      } finally {
        setTimeout(() => setLoaded(true), 100);
      }
    };
    fetchSkills();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .sp-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg, #0a0a0f);
          min-height: 100vh;
          padding: 6rem 1.5rem 6rem;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient glows */
        .sp-root::before {
          content: '';
          position: fixed;
          top: -30%; left: -20%;
          width: 70vw; height: 70vw;
          background: radial-gradient(circle, rgba(109,40,217,0.08) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .sp-root::after {
          content: '';
          position: fixed;
          bottom: -20%; right: -15%;
          width: 55vw; height: 55vw;
          background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .sp-inner {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 0 auto;
        }

        /* ── Hero ── */
        .sp-hero { margin-bottom: 5rem; }

        .sp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .sp-eyebrow::before {
          content: '';
          width: 28px; height: 1px;
          background: #a78bfa;
          display: block;
        }

        .sp-h1 {
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

        .sp-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #8b5cf6 0%, #c4b5fd 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sp-sub {
          font-size: 1rem;
          color: var(--text, #9ca3af);
          line-height: 1.75;
          max-width: 480px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s;
        }

        /* loaded animations */
        .sp-root.is-loaded .sp-eyebrow,
        .sp-root.is-loaded .sp-h1,
        .sp-root.is-loaded .sp-sub {
          opacity: 1;
          transform: translateY(0);
        }
        .sp-root.is-loaded .sp-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Grid ── */
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        /* ── Card ── */
        .sp-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 1.75rem 1.75rem 1.5rem;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.55s ease,
            transform 0.55s ease,
            border-color 0.3s ease,
            background 0.3s ease,
            box-shadow 0.3s ease;
        }

        .sp-card:nth-child(1)  { transition-delay: 0.05s; }
        .sp-card:nth-child(2)  { transition-delay: 0.10s; }
        .sp-card:nth-child(3)  { transition-delay: 0.15s; }
        .sp-card:nth-child(4)  { transition-delay: 0.20s; }
        .sp-card:nth-child(5)  { transition-delay: 0.25s; }
        .sp-card:nth-child(6)  { transition-delay: 0.30s; }
        .sp-card:nth-child(7)  { transition-delay: 0.35s; }
        .sp-card:nth-child(8)  { transition-delay: 0.40s; }

        /* top accent bar */
        .sp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--c, #8b5cf6);
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        /* top glow */
        .sp-card::after {
          content: '';
          position: absolute;
          top: -50px; left: 50%;
          transform: translateX(-50%);
          width: 160px; height: 100px;
          background: radial-gradient(ellipse, var(--g, rgba(139,92,246,0.3)) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .sp-card:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(139,92,246,0.25);
          box-shadow: 0 0 0 1px rgba(139,92,246,0.1), 0 24px 48px rgba(0,0,0,0.35);
          transform: translateY(-5px) !important;
        }
        .sp-card:hover::before { opacity: 1; }
        .sp-card:hover::after  { opacity: 1; }

        /* ── Card label ── */
        .sp-clabel {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--c, #8b5cf6);
          opacity: 0.7;
          margin-bottom: 1.25rem;
        }

        /* ── Items ── */
        .sp-items {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .sp-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.875rem;
          color: var(--text, #9ca3af);
          transition: color 0.2s;
        }

        .sp-card:hover .sp-item {
          color: var(--text-h, #e5e7eb);
        }

        .sp-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--c, #8b5cf6);
          flex-shrink: 0;
          opacity: 0.7;
          transition: opacity 0.2s, transform 0.2s;
        }

        .sp-card:hover .sp-dot {
          opacity: 1;
          transform: scale(1.3);
        }

        /* Empty */
        .sp-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text, #6b7280);
          font-size: 0.9rem;
        }
      `}</style>

      <div className={`sp-root${loaded ? " is-loaded" : ""}`}>
        <div className="sp-inner">

          {/* Hero */}
          <div className="sp-hero">
            <p className="sp-eyebrow">Tech Stack</p>
            <h1 className="sp-h1">
              My<br /><em>Skills</em>
            </h1>
            <p className="sp-sub">
              Technologies and tools I work with to build modern web applications.
            </p>
          </div>

          {/* Grid */}
          <div className="sp-grid">
            {skills.length === 0 && (
              <div className="sp-empty">Loading skills…</div>
            )}

            {skills.map((s, si) => {
              const col = COLORS[si % COLORS.length];
              return (
                <div
                  key={s.category}
                  className="sp-card"
                  style={{ "--c": col.accent, "--g": col.glow }}
                >
                  <p className="sp-clabel">{s.category}</p>
                  <div className="sp-items">
                    {s.items.map((item) => (
                      <div key={item} className="sp-item">
                        <span className="sp-dot" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}