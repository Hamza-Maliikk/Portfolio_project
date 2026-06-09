import { useEffect, useState } from "react";

export default function Projects() {
  const API = `${import.meta.env.VITE_URL_API}api/projects`;
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setTimeout(() => setLoaded(true), 100);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .pp-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg, #0a0a0f);
          min-height: 100vh;
          padding: 6rem 1.5rem 6rem;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Ambient Background ── */
        .pp-root::before {
          content: '';
          position: fixed;
          top: -30%;
          left: -20%;
          width: 70vw;
          height: 70vw;
          background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .pp-root::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -15%;
          width: 55vw;
          height: 55vw;
          background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .pp-inner {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 0 auto;
        }

        /* ── Hero ── */
        .pp-hero {
          margin-bottom: 5rem;
        }

        .pp-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'DM Sans', sans-serif;
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
        .pp-eyebrow::before {
          content: '';
          width: 28px;
          height: 1px;
          background: #7dd3fc;
          display: block;
        }

        .pp-h1 {
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

        .pp-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pp-sub {
          font-size: 1rem;
          color: var(--text, #9ca3af);
          line-height: 1.75;
          max-width: 480px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s;
        }

        /* ── Loaded state ── */
        .pp-root.is-loaded .pp-eyebrow,
        .pp-root.is-loaded .pp-h1,
        .pp-root.is-loaded .pp-sub {
          opacity: 1;
          transform: translateY(0);
        }

        .pp-root.is-loaded .pp-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Grid ── */
        .pp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 1.25rem;
        }

        /* ── Card ── */
        .pp-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 2rem 2rem 1.75rem;
          cursor: default;
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

        .pp-card:nth-child(1)  { transition-delay: 0.05s; }
        .pp-card:nth-child(2)  { transition-delay: 0.12s; }
        .pp-card:nth-child(3)  { transition-delay: 0.19s; }
        .pp-card:nth-child(4)  { transition-delay: 0.26s; }
        .pp-card:nth-child(5)  { transition-delay: 0.33s; }
        .pp-card:nth-child(6)  { transition-delay: 0.40s; }

        /* Glowing top accent bar */
        .pp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--c, #60a5fa);
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        /* Soft glow on hover */
        .pp-card::after {
          content: '';
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 200px; height: 120px;
          background: radial-gradient(ellipse, var(--c, rgba(59,130,246,0.28)) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .pp-card:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(96,165,250,0.25);
          box-shadow:
            0 0 0 1px rgba(96,165,250,0.12),
            0 24px 48px rgba(0,0,0,0.35);
          transform: translateY(-5px) !important;
        }

        .pp-card:hover::before { opacity: 1; }
        .pp-card:hover::after  { opacity: 1; }

        /* ── Card Number ── */
        .pp-num {
          font-family: 'Syne', sans-serif;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--c, #60a5fa);
          opacity: 0.6;
          margin-bottom: 1rem;
        }

        /* ── Card Title ── */
        .pp-ctitle {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-h, #f1f0ff);
          margin: 0 0 0.65rem;
        }

        /* ── Card Desc ── */
        .pp-cdesc {
          font-size: 0.875rem;
          color: var(--text, #9ca3af);
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        /* ── Link ── */
        .pp-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: #38bdf8;
          text-decoration: none;
          margin-bottom: 1.5rem;
          opacity: 0.75;
          transition: opacity 0.2s, gap 0.2s;
        }
        .pp-link:hover { opacity: 1; gap: 0.6rem; }
        .pp-link svg { width: 12px; height: 12px; }

        /* ── Tags ── */
        .pp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .pp-tag {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 0.28rem 0.75rem;
          border-radius: 100px;
          background: rgba(96,165,250,0.08);
          color: #bae6fd;
          border: 1px solid rgba(96,165,250,0.18);
          transition: background 0.2s, border-color 0.2s;
        }

        .pp-tag:hover {
          background: rgba(96,165,250,0.18);
          border-color: rgba(96,165,250,0.35);
        }

        /* ── Empty state ── */
        .pp-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text, #6b7280);
          font-size: 0.9rem;
        }

        /* ── Scrollbar ── */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb {
          background: rgba(59,130,246,0.25);
          border-radius: 3px;
        }
      `}</style>

      <div className={`pp-root${loaded ? " is-loaded" : ""}`}>
        <div className="pp-inner">

          {/* Hero */}
          <div className="pp-hero">
            <p className="pp-eyebrow">My Work</p>
            <h1 className="pp-h1">
              Featured<br /><em>Projects</em>
            </h1>
            <p className="pp-sub">
              A collection of things I've built — from APIs to full-stack web apps.
            </p>
          </div>

          {/* Grid */}
          <div className="pp-grid">
            {Array.isArray(projects) && projects.length === 0 && (
              <div className="pp-empty">Loading projects…</div>
            )}

            {Array.isArray(projects) && projects.map((p, i) => (
              <div
                key={p._id}
                className="pp-card"
                style={{ "--c": p.color || "#60a5fa" }}
              >
                <div className="pp-num">
                  {String(i + 1).padStart(2, "0")}
                </div>

                <h2 className="pp-ctitle">{p.title}</h2>
                <p className="pp-cdesc">{p.description}</p>

                {p.link && (
                  <a
                    className="pp-link"
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.link}
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}

                <div className="pp-tags">
                  {p.technologies?.map((t) => (
                    <span key={t} className="pp-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}