import { useEffect, useState } from "react";

const API = `${import.meta.env.VITE_URL_API}api/blogs`;

const COLORS = [
  { accent: "#6366f1", glow: "rgba(99,102,241,0.28)" },
  { accent: "#38bdf8", glow: "rgba(56,189,248,0.25)" },
  { accent: "#06b6d4", glow: "rgba(6,182,212,0.22)" },
  { accent: "#0ea5e9", glow: "rgba(14,165,233,0.22)" },
  { accent: "#60a5fa", glow: "rgba(96,165,250,0.2)" },
];

const colorCache = {};
let colorIdx = 0;
function getColor(cat) {
  if (!colorCache[cat]) {
    colorCache[cat] = COLORS[colorIdx % COLORS.length];
    colorIdx++;
  }
  return colorCache[cat];
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function calcReadTime(content = "") {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function mapBlog(raw) {
  return {
    id:       raw._id || raw.id,
    title:    raw.title || "Untitled",
    excerpt:  raw.content
      ? raw.content.slice(0, 160) + (raw.content.length > 160 ? "..." : "")
      : "",
    category: raw.category || "General",
    tag:      Array.isArray(raw.tags) ? raw.tags[0] : raw.tags || raw.category || "Post",
    date:     formatDate(raw.createdAt),
    readTime: calcReadTime(raw.content),
    image:    raw.image || null,
  };
}

export default function Blogs() {
  const [blogs,   setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState("All");
  const [loaded,  setLoaded]  = useState(false);

  useEffect(() => {
    fetch(API)
      .then((res) => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.blogs ?? [];
        setBlogs(list.map(mapBlog));
      })
      .catch((err) => console.error("Blogs fetch error:", err))
      .finally(() => {
        setLoading(false);
        setTimeout(() => setLoaded(true), 100);
      });
  }, []);

  const categories = ["All", ...new Set(blogs.map((b) => b.category))];
  const filtered   = active === "All" ? blogs : blogs.filter((b) => b.category === active);
  const featured   = filtered[0];
  const rest       = filtered.slice(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .bp-root {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg, #0a0a0f);
          min-height: 100vh;
          padding: 6rem 1.5rem 6rem;
          position: relative;
          overflow-x: hidden;
        }

        /* Ambient glows */
        .bp-root::before {
          content: '';
          position: fixed;
          top: -30%; left: -20%;
          width: 70vw; height: 70vw;
          background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }
        .bp-root::after {
          content: '';
          position: fixed;
          bottom: -20%; right: -15%;
          width: 55vw; height: 55vw;
          background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .bp-inner {
          position: relative;
          z-index: 1;
          max-width: 1120px;
          margin: 0 auto;
        }

        /* ── Hero ── */
        .bp-hero { margin-bottom: 4rem; }

        .bp-eyebrow {
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
        .bp-eyebrow::before {
          content: '';
          width: 28px; height: 1px;
          background: #7dd3fc;
        }

        .bp-h1 {
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

        .bp-h1 em {
          font-style: normal;
          background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .bp-sub {
          font-size: 1rem;
          color: var(--text, #9ca3af);
          line-height: 1.75;
          max-width: 480px;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.65s ease 0.2s, transform 0.65s ease 0.2s;
        }

        /* loaded */
        .bp-root.is-loaded .bp-eyebrow,
        .bp-root.is-loaded .bp-h1,
        .bp-root.is-loaded .bp-sub,
        .bp-root.is-loaded .bp-filters {
          opacity: 1;
          transform: translateY(0);
        }
        .bp-root.is-loaded .bp-featured,
        .bp-root.is-loaded .bp-card {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Filters ── */
        .bp-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.6s ease 0.25s, transform 0.6s ease 0.25s;
        }

        .bp-filter {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.4rem 1rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: var(--text, #9ca3af);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .bp-filter:hover {
          border-color: rgba(96,165,250,0.4);
          color: #bfdbfe;
        }
        .bp-filter.active {
          background: rgba(96,165,250,0.15);
          border-color: rgba(96,165,250,0.4);
          color: #bfdbfe;
        }

        /* ── Featured Card ── */
        .bp-featured {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 1.25rem;
          cursor: pointer;
          display: flex;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.6s ease 0.1s,
            transform 0.6s ease 0.1s,
            border-color 0.3s,
            background 0.3s,
            box-shadow 0.3s;
        }

        .bp-featured::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--c, #60a5fa);
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        .bp-featured:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(96,165,250,0.25);
          box-shadow: 0 0 0 1px rgba(96,165,250,0.1), 0 24px 48px rgba(0,0,0,0.35);
          transform: translateY(-4px) !important;
        }
        .bp-featured:hover::before { opacity: 1; }

        .bp-featured-img {
          flex-shrink: 0;
          width: 260px;
          min-height: 200px;
          overflow: hidden;
        }
        .bp-featured-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .bp-featured:hover .bp-featured-img img {
          transform: scale(1.04);
        }

        .bp-featured-placeholder {
          flex-shrink: 0;
          width: 260px;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59,130,246,0.06);
          font-size: 2rem;
          opacity: 0.4;
        }

        .bp-featured-body {
          flex: 1;
          padding: 2.25rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bp-featured-arrow {
          flex-shrink: 0;
          display: flex;
          align-items: flex-start;
          padding: 2.25rem 1.75rem 0 0;
          color: rgba(255,255,255,0.2);
          transition: color 0.2s;
        }
        .bp-featured:hover .bp-featured-arrow { color: #38bdf8; }

        /* ── Tag Pill ── */
        .bp-tag {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.28rem 0.8rem;
          border-radius: 100px;
          background: rgba(59,130,246,0.1);
          color: #bfdbfe;
          border: 1px solid rgba(59,130,246,0.2);
          margin-bottom: 1rem;
        }

        .bp-ftitle {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--text-h, #f1f0ff);
          margin: 0 0 0.75rem;
          line-height: 1.25;
        }

        .bp-fexcerpt {
          font-size: 0.875rem;
          color: var(--text, #9ca3af);
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .bp-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          font-family: 'DM Sans', monospace;
        }
        .bp-meta span { color: rgba(255,255,255,0.15); }

        /* ── Grid ── */
        .bp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
          margin-bottom: 4rem;
        }

        /* ── Card ── */
        .bp-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.55s ease,
            transform 0.55s ease,
            border-color 0.3s,
            background 0.3s,
            box-shadow 0.3s;
        }

        .bp-card:nth-child(1) { transition-delay: 0.05s; }
        .bp-card:nth-child(2) { transition-delay: 0.12s; }
        .bp-card:nth-child(3) { transition-delay: 0.19s; }
        .bp-card:nth-child(4) { transition-delay: 0.26s; }
        .bp-card:nth-child(5) { transition-delay: 0.33s; }
        .bp-card:nth-child(6) { transition-delay: 0.40s; }

        .bp-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: var(--c, #60a5fa);
          opacity: 0.45;
          transition: opacity 0.3s;
          z-index: 1;
        }

        .bp-card:hover {
          background: rgba(255,255,255,0.055);
          border-color: rgba(96,165,250,0.25);
          box-shadow: 0 0 0 1px rgba(96,165,250,0.1), 0 24px 48px rgba(0,0,0,0.35);
          transform: translateY(-5px) !important;
        }
        .bp-card:hover::before { opacity: 1; }

        .bp-card-img {
          width: 100%; height: 180px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .bp-card-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }
        .bp-card:hover .bp-card-img img { transform: scale(1.05); }

        .bp-card-placeholder {
          width: 100%; height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59,130,246,0.05);
          font-size: 1.75rem;
          opacity: 0.35;
          flex-shrink: 0;
        }

        .bp-card-body {
          padding: 1.5rem 1.75rem 1.5rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .bp-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--text-h, #f1f0ff);
          margin: 0 0 0.6rem;
          line-height: 1.3;
        }

        .bp-card-excerpt {
          font-size: 0.83rem;
          color: var(--text, #9ca3af);
          line-height: 1.75;
          flex: 1;
          margin-bottom: 1.25rem;
        }

        .bp-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .bp-read {
          font-size: 0.72rem;
          font-weight: 600;
          color: #38bdf8;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          transition: gap 0.2s;
        }
        .bp-card:hover .bp-read { gap: 0.5rem; }

        /* ── CTA ── */
        .bp-cta {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .bp-cta-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }
        .bp-cta-btn {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.65rem 1.75rem;
          border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.15);
          background: transparent;
          color: var(--text-h, #e5e7eb);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.25s ease;
        }
        .bp-cta-btn:hover {
          background: rgba(59,130,246,0.15);
          border-color: rgba(59,130,246,0.4);
          color: #7dd3fc;
        }

        /* Empty / Loading */
        .bp-empty {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text, #6b7280);
          font-size: 0.875rem;
          margin-bottom: 3rem;
        }

        .bp-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .bp-skel-item {
          height: 280px;
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          animation: bp-pulse 1.6s ease-in-out infinite;
        }
        @keyframes bp-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }

        @media (max-width: 640px) {
          .bp-featured { flex-direction: column; }
          .bp-featured-img,
          .bp-featured-placeholder { width: 100%; min-height: 180px; }
          .bp-featured-arrow { display: none; }
          .bp-featured-body { padding: 1.5rem; }
        }
      `}</style>

      <div className={`bp-root${loaded ? " is-loaded" : ""}`}>
        <div className="bp-inner">

          {/* Hero */}
          <div className="bp-hero">
            <p className="bp-eyebrow">Writing &amp; Thoughts</p>
            <h1 className="bp-h1">
              From the<br /><em>Notebook</em>
            </h1>
            <p className="bp-sub">
              Essays on engineering, design, and the craft of building software that people love.
            </p>
          </div>

          {/* Filters */}
          {!loading && blogs.length > 0 && (
            <div className="bp-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`bp-filter${active === cat ? " active" : ""}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bp-skeleton">
              {[1, 2, 3].map((n) => <div key={n} className="bp-skel-item" />)}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="bp-empty">
              {blogs.length === 0 ? "No blog posts found." : "No posts in this category yet."}
            </div>
          )}

          {/* Featured */}
          {!loading && featured && (() => {
            const col = getColor(featured.category);
            return (
              <div className="bp-featured" style={{ "--c": col.accent }}>
                {featured.image
                  ? <div className="bp-featured-img"><img src={featured.image} alt={featured.title} loading="lazy" /></div>
                  : <div className="bp-featured-placeholder">✍</div>
                }
                <div className="bp-featured-body">
                  <span className="bp-tag">{featured.tag}</span>
                  <h3 className="bp-ftitle">{featured.title}</h3>
                  <p className="bp-fexcerpt">{featured.excerpt}</p>
                  <div className="bp-meta">
                    {featured.date}
                    <span>·</span>
                    {featured.readTime}
                  </div>
                </div>
                <div className="bp-featured-arrow">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            );
          })()}

          {/* Grid */}
          {!loading && rest.length > 0 && (
            <div className="bp-grid">
              {rest.map((blog) => {
                const col = getColor(blog.category);
                return (
                  <div key={blog.id} className="bp-card" style={{ "--c": col.accent }}>
                    {blog.image
                      ? <div className="bp-card-img"><img src={blog.image} alt={blog.title} loading="lazy" /></div>
                      : <div className="bp-card-placeholder">✍</div>
                    }
                    <div className="bp-card-body">
                      <span className="bp-tag">{blog.tag}</span>
                      <h4 className="bp-card-title">{blog.title}</h4>
                      <p className="bp-card-excerpt">{blog.excerpt}</p>
                      <div className="bp-card-footer">
                        <div className="bp-meta">
                          {blog.date}
                          <span>·</span>
                          {blog.readTime}
                        </div>
                        <span className="bp-read">Read →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CTA */}
          {!loading && filtered.length > 0 && (
            <div className="bp-cta">
              <div className="bp-cta-line" />
              <button className="bp-cta-btn">View all posts</button>
              <div className="bp-cta-line" />
            </div>
          )}

        </div>
      </div>
    </>
  );
}