import { Eye, ArrowUpRight, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const API = `${import.meta.env.VITE_URL_API}api/homepage`;
console.log(API);

// ── Image with fallback ──────────────────────────────────────────────────────
function Avatar({ src, name, radius = 18 }) {
  const [err, setErr] = useState(false);
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "ME";

  if (err || !src) {
    return (
      <div style={{
        width: "100%", height: "100%",
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 14,
        borderRadius: radius,
        // Rich deep dark background — no more plain black
        background: "linear-gradient(145deg, #0d0d1f 0%, #12122a 30%, #0c1a2e 65%, #0a1520 100%)",
        overflow: "hidden",
      }}>
        {/* Mesh grid overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }} />

        {/* Centre radial glow blob */}
        <div style={{
          position: "absolute",
          width: 220, height: 220, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          zIndex: 0,
        }} />

        {/* Subtle cyan glow bottom-right */}
        <div style={{
          position: "absolute",
          width: 160, height: 160, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          bottom: 0, right: 0,
          zIndex: 0,
        }} />

        {/* Animated shimmer line */}
        <div style={{
          position: "absolute", zIndex: 1,
          width: "200%", height: "1px",
          background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.5) 30%, rgba(6,182,212,0.8) 50%, rgba(99,102,241,0.5) 70%, transparent 100%)",
          top: "43%",
          animation: "shimmerLine 3s linear infinite",
        }} />

        {/* Initials ring */}
        <div style={{
          position: "relative", zIndex: 1,
          width: 90, height: 90, borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 36, fontWeight: 800, color: "#fff",
          fontFamily: "'Syne', sans-serif",
          boxShadow: "0 0 30px rgba(99,102,241,0.45), 0 0 80px rgba(6,182,212,0.12)",
        }}>
          {initials}
        </div>

        <span style={{
          position: "relative", zIndex: 1,
          fontSize: 10, color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.13em", textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Profile Photo
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Profile"}
      onError={() => setErr(true)}
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: radius }}
    />
  );
}

// ── Project Card ─────────────────────────────────────────────────────────────
const PALETTES = [
  { bg: "#0b0b1a", border: "#6366f1", tag: "rgba(99,102,241,0.15)", tagText: "#818cf8" },
  { bg: "#0a1a0f", border: "#10b981", tag: "rgba(16,185,129,0.12)", tagText: "#34d399" },
  { bg: "#1a0b0b", border: "#f43f5e", tag: "rgba(244,63,94,0.12)", tagText: "#fb7185" },
  { bg: "#0b0f1a", border: "#f59e0b", tag: "rgba(245,158,11,0.12)", tagText: "#fbbf24" },
];

function ProjectCard({ project, index }) {
  const [hov, setHov] = useState(false);
  const p = PALETTES[index % PALETTES.length];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", background: p.bg, borderRadius: 14,
        border: `1px solid ${hov ? p.border : "rgba(255,255,255,0.07)"}`,
        overflow: "hidden", cursor: "pointer", height: "100%",
        transition: "all 0.35s cubic-bezier(.25,.46,.45,.94)",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: p.border, opacity: hov ? 1 : 0.3, transition: "opacity 0.3s",
      }} />
      <div style={{ padding: "28px 24px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: "100%", height: 80, border: `1px solid ${p.border}22`, borderRadius: 10,
          background: `${p.border}08`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          {[0.3, 0.6, 1].map((op, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: p.border, opacity: op }} />
          ))}
        </div>
      </div>
      <div style={{ padding: "0 20px 22px" }}>
        <span style={{
          display: "inline-block", padding: "3px 10px", borderRadius: 99,
          background: p.tag, color: p.tagText, fontSize: 10, fontWeight: 700,
          letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 8,
        }}>
          {project.category || "Project"}
        </span>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 5px", fontFamily: "'Syne', sans-serif" }}>
          {project.title || "Untitled"}
        </h3>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.32)", margin: 0, lineHeight: 1.6 }}>
          {(project.description || "No description").slice(0, 65)}
          {(project.description?.length || 0) > 65 ? "…" : ""}
        </p>
      </div>
      <div style={{
        position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: "50%",
        background: p.border, display: "flex", alignItems: "center", justifyContent: "center",
        opacity: hov ? 1 : 0, transform: hov ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-45deg)",
        transition: "all 0.3s",
      }}>
        <ArrowUpRight size={14} color="#fff" />
      </div>
    </div>
  );
}

// ── Testimonial Card ──────────────────────────────────────────────────────────
function TestimonialCard({ t }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div style={{
      background: "#0d0d14", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 16, padding: "24px",
    }}>
      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
        {[...Array(5)].map((_, i) => <span key={i} style={{ color: "#f59e0b", fontSize: 13 }}>★</span>)}
      </div>
      <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 20, fontStyle: "italic" }}>
        "{t.description}"
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
        {t.image && !imgErr ? (
          <img src={t.image} alt={t.name} onError={() => setImgErr(true)}
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(99,102,241,0.4)" }} />
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif",
          }}>
            {t.name?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", fontFamily: "'Syne', sans-serif" }}>{t.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{t.username}</div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [homeData, setHomeData] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [resume, setResume] = useState([]);
  const [work, setWork] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        setHomeData(data.home || []);
        setTestimonials(data.testimonials || []);
        setResume(data.resume || []);
        setWork(data.work || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setApiError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#050508",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
    }}>
      <div style={{
        width: 36, height: 36, border: "3px solid rgba(99,102,241,0.2)",
        borderTop: "3px solid #6366f1", borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }} />
      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, letterSpacing: "0.1em" }}>LOADING</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const hero = homeData?.[0] || (apiError ? {
    role: "Full Stack Developer",
    headline: "Building digital experiences",
    description: "I craft clean, performant web applications with a focus on user experience and modern design.",
    image: null,
  } : null);

  const lastResume = resume?.[resume.length - 1];
  const last4Work = work?.slice(-4) || (apiError ? [
    { title: "Project Alpha", category: "Web App", description: "A full-stack web application with real-time features." },
    { title: "Project Beta", category: "UI/UX", description: "Complete redesign of a SaaS dashboard." },
    { title: "Project Gamma", category: "Mobile", description: "Cross-platform mobile app built with React Native." },
    { title: "Project Delta", category: "Backend", description: "REST API with authentication and data visualization." },
  ] : []);

  const allTestimonials = testimonials.length > 0 ? testimonials : (apiError ? [
    { _id: "1", description: "Exceptional work and attention to detail. Delivered on time.", name: "Sarah K.", username: "@sarahk" },
    { _id: "2", description: "Best developer I've worked with. Clean code, great communication.", name: "Ahmed R.", username: "@ahmed_r" },
  ] : []);

  return (
    <div style={{
      background: "#050508", color: "#e2e8f0",
      overflowX: "hidden", fontFamily: "'DM Sans', sans-serif", minHeight: "100vh",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Shimmer animation for avatar fallback */
        @keyframes shimmerLine {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        /* Slow rotating conic gradient for photo outer glow */
        @keyframes rotateConic {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .fu { animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.28s; }
        .d4 { animation-delay: 0.42s; }
        .d5 { animation-delay: 0.56s; }

        .cursor::after { content:'|'; animation: blink 1.1s step-end infinite; color:#6366f1; margin-left:3px; }
        .photo-float { animation: floatY 6s ease-in-out infinite; }

        .gradient-text {
          background: linear-gradient(90deg, #fff 0%, #a5b4fc 50%, #06b6d4 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .section-tag {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 14px; border-radius: 99px;
          border: 1px solid rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.07); color: #a5b4fc;
          font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; margin-bottom: 18px;
        }
        .section-tag::before {
          content:''; width:5px; height:5px; border-radius:50%;
          background:#6366f1; box-shadow:0 0 6px #6366f1;
        }

        .stat-box {
          background: #0d0d18; border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 22px 16px; text-align: center;
          transition: all 0.3s; cursor: default;
        }
        .stat-box:hover { border-color: rgba(99,102,241,0.35); transform: translateY(-4px); background: #10101e; }

        .works-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .error-banner {
          background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2);
          border-radius: 10px; padding: 10px 18px; color: #fb7185;
          font-size: 12px; text-align: center; margin-bottom: 24px;
        }

        /* ── HERO RESPONSIVE ── */
        .hero-flex {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
        }
        .hero-left { flex: 1; min-width: 0; }
        .hero-right {
          flex-shrink: 0;
          width: 300px;
        }

        /* ── Photo frame glow ring ── */
        .photo-glow-ring {
          position: absolute;
          inset: -10px;
          border-radius: 28px;
          background: conic-gradient(
            from 0deg at 50% 50%,
            #6366f1 0deg,
            #06b6d4 120deg,
            #8b5cf6 240deg,
            #6366f1 360deg
          );
          opacity: 0.22;
          filter: blur(18px);
          z-index: 0;
          animation: rotateConic 8s linear infinite;
        }

        @media (max-width: 860px) {
          .hero-flex { flex-direction: column-reverse; align-items: center; gap: 32px; }
          .hero-right { width: 240px; }
          .hero-h1 { font-size: 36px !important; }
          .works-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
          .section-pad { padding: 56px 20px !important; }
        }

        @media (min-width: 861px) and (max-width: 1060px) {
          .hero-right { width: 260px; }
          .hero-h1 { font-size: 44px !important; }
          .section-pad { padding-left: 32px !important; padding-right: 32px !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────── */}
      {hero && (
        <section className="section-pad" style={{
          position: "relative", width: "100%",
          padding: "90px 48px 72px", overflow: "hidden",
        }}>
          {/* Background glows */}
          <div style={{
            position: "absolute", width: 500, height: 500,
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            top: -80, left: -120, pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", width: 400, height: 400,
            background: "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)",
            bottom: 0, right: -80, pointerEvents: "none",
          }} />

          {apiError && <div className="error-banner">⚠ API not reachable — showing demo data.</div>}

          {/* ── FLEX ROW: Left text | Right image ── */}
          <div className="hero-flex" style={{ position: "relative", zIndex: 1 }}>

            {/* LEFT — text content */}
            <div className="hero-left">
              <div className="section-tag fu d1">{hero.role || "Developer"}</div>

              <h1 className="hero-h1 fu d2 cursor" style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                marginBottom: 20,
              }}>
                <span className="gradient-text">{hero.headline || "Building great things"}</span>
              </h1>

              <p className="fu d3" style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.42)",
                lineHeight: 1.85,
                maxWidth: 430,
                marginBottom: 36,
              }}>
                {hero.description || "Crafting digital experiences with clean code and thoughtful design."}
              </p>

              <div className="fu d4" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {lastResume?.pdf && (
                  <a href={lastResume.pdf} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      padding: "11px 22px", borderRadius: 8,
                      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                      color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none",
                      fontFamily: "'Syne', sans-serif",
                      boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(99,102,241,0.45)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(99,102,241,0.3)"; }}
                  >
                    <Eye size={15} /> View Resume
                  </a>
                )}
                <a href="#contact" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "11px 22px", borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "transparent", color: "rgba(255,255,255,0.65)",
                  fontSize: 13, fontWeight: 500, textDecoration: "none",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(99,102,241,0.5)"; e.currentTarget.style.color="#fff"; e.currentTarget.style.background="rgba(99,102,241,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(255,255,255,0.65)"; e.currentTarget.style.background="transparent"; }}
                >
                  <Mail size={15} /> Let's Talk
                </a>
              </div>
            </div>

            {/* RIGHT — photo */}
            <div className="hero-right fu d3">
              <div className="photo-float" style={{ position: "relative" }}>

                <div style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "120%", /* aspect ratio 5:6 */
                }}>
                  {/* Rotating ambient glow ring behind frame */}
                  <div className="photo-glow-ring" />

                  {/* Gradient border frame */}
                  <div style={{
                    position: "absolute", inset: 0,
                    borderRadius: 20,
                    background: "linear-gradient(135deg, #6366f1, #06b6d4, #8b5cf6)",
                    padding: 2,
                    zIndex: 1,
                  }}>
                    <div style={{
                      width: "100%", height: "100%",
                      borderRadius: 18, overflow: "hidden",
                    }}>
                      <Avatar src={hero.image} name={hero.headline} />
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div style={{
                  position: "absolute", bottom: -14, left: -14,
                  background: "#0d0d18",
                  border: "1px solid rgba(99,102,241,0.3)",
                  borderRadius: 12, padding: "9px 14px", zIndex: 2,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#10b981", boxShadow: "0 0 7px #10b981",
                  }} />
                  <span style={{ fontSize: 11, color: "#e2e8f0", fontFamily: "'Syne', sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>
                    Available for work
                  </span>
                </div>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)", margin: "0" }} />

      {/* ── SELECTED WORKS ─────────────────────────── */}
      {last4Work.length > 0 && (
        <section className="section-pad" style={{ width: "100%", padding: "80px 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 44 }}>
            <div>
              <div className="section-tag">Selected Works</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, color: "#f1f5f9", lineHeight: 1.1 }}>
                Things I've built
              </h2>
            </div>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              View all →
            </span>
          </div>
          <div className="works-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {last4Work[0] && <div style={{ height: 250 }}><ProjectCard project={last4Work[0]} index={0} /></div>}
              {last4Work[2] && <div style={{ height: 290 }}><ProjectCard project={last4Work[2]} index={2} /></div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 32 }}>
              {last4Work[1] && <div style={{ height: 290 }}><ProjectCard project={last4Work[1]} index={1} /></div>}
              {last4Work[3] && <div style={{ height: 250 }}><ProjectCard project={last4Work[3]} index={3} /></div>}
            </div>
          </div>
        </section>
      )}

      {/* ── DIVIDER ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)", margin: "0" }} />

      {/* ── TESTIMONIALS ───────────────────────────── */}
      {allTestimonials.length > 0 && (
        <section className="section-pad" style={{ width: "100%", padding: "80px 48px" }}>
          <div className="section-tag">Testimonials</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, fontWeight: 800, color: "#f1f5f9", marginBottom: 44, lineHeight: 1.1 }}>
            What clients say
          </h2>
          <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
            {allTestimonials.map((t) => <TestimonialCard key={t._id} t={t} />)}
          </div>
        </section>
      )}

      {/* ── QUOTE BANNER ───────────────────────────── */}
      <section style={{
        borderTop: "1px solid rgba(255,255,255,0.04)", background: "#08080f",
        padding: "88px 48px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 72, lineHeight: 0.75, fontFamily: "'Syne', serif", color: "#6366f1", marginBottom: 28, opacity: 0.5 }}>
            "
          </div>
          <blockquote style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontStyle: "italic", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 28 }}>
            Great design is not just what it looks like. It's how it works — and how it makes people feel.
          </blockquote>
          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            — Design Philosophy
          </p>
        </div>
      </section>
    </div>
  );
}