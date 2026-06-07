import { useMemo, useState, useEffect } from "react";
import api from "../lib/api"; // ✅ axios interceptor wala

const API = `about`; // ✅ baseURL interceptor mein already hai

const DEFAULT_ABOUT = "I am a full-stack web developer focused on building clean, reliable, and user-friendly applications.";

export default function Portfolio() {
  const canCrud = Boolean(localStorage.getItem("token"));
  const displayName = useMemo(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) return "Developer";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, []);

  const [aboutId, setAboutId]           = useState(null);
  const [about, setAbout]               = useState(DEFAULT_ABOUT);
  const [aboutDraft, setAboutDraft]     = useState("");
  const [editingAbout, setEditingAbout] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [skills, setSkills]             = useState([]);
  const [newSkill, setNewSkill]         = useState("");

  // ── GET ──
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res  = await api.get(`${API}`); // ✅ axios — double /api/about bug fix
        const data = res.data;                       // ✅ res.data
        if (data && data.intro) {
          setAbout(data.intro);
          setAboutDraft(data.intro);
          setAboutId(data._id);
        }
        if (data && data.skills && data.skills.length > 0) {
          setSkills(data.skills);
        }
      } catch (err) {
        console.error("About fetch error:", err);
      }
    };
    fetchAbout();
  }, []);

  // ── About Save: POST (create) ya PUT (edit) ──
  const saveAbout = async () => {
    const next = aboutDraft.trim();
    if (!next) return;
    setLoading(true);
    try {
      let res;

      if (!aboutId) {
        // ✅ Pehli baar — POST
        res = await api.post(`${API}/about`, { intro: next, skills });
      } else {
        // ✅ Already exist karta hai — PUT
        res = await api.put(`${API}/about/${aboutId}`, { intro: next, skills });
      }

      // ✅ res.data — r.json() nahi, token interceptor se automatic
      setAbout(res.data.data.intro);
      setAboutId(res.data.data._id);
      setEditingAbout(false);
    } catch (err) {
      console.error("About save error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Skills DB mein save karne ka helper ──
  const saveSkillsToDB = async (updatedSkills) => {
    if (!aboutId) return;
    try {
      await api.put(`${API}/about/${aboutId}`, { // ✅ axios
        intro: about,
        skills: updatedSkills,
      });
    } catch (err) {
      console.error("Skills save error:", err);
    }
  };

  const addSkill = async () => {
    const value = newSkill.trim();
    if (!value) return;
    const updatedSkills = [...skills, value];
    setSkills(updatedSkills);
    setNewSkill("");
    await saveSkillsToDB(updatedSkills);
  };

  const removeSkill = async (idx) => {
    const skillToDelete = skills[idx];
    try {
      await api.delete(`${API}/about/skill/${skillToDelete}`); // ✅ axios
      setSkills(skills.filter((_, i) => i !== idx));
    } catch (err) {
      console.error("Skill delete error:", err);
    }
  };

  return (
    <>
      <style>{`
        .portfolio-page { max-width: 950px; margin: 0 auto; color: #ececec; font-family: 'Poppins', sans-serif; }
        .portfolio-title { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
        .portfolio-sub { color: #a3a3a3; margin-bottom: 1.2rem; font-size: 0.9rem; }
        .portfolio-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1rem; }
        .portfolio-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1rem 1.1rem; }
        .portfolio-card h3 { margin: 0 0 0.7rem; font-family: 'Fraunces', serif; font-weight: 500; }
        .portfolio-card p { margin: 0; color: #cccccc; line-height: 1.8; font-size: 0.92rem; }
        .skills-wrap { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .skill-chip { padding: 0.35rem 0.7rem; border-radius: 999px; border: 1px solid #3a3a3a; background: #252525; color: #e6e6e6; font-size: 0.8rem; display:flex; align-items:center; gap:.4rem; }
        .btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 6px 10px; cursor: pointer; font-size: 12px; }
        .input { width: 100%; border: 1px solid #3a3a3a; border-radius: 8px; background:#1f1f1f; color:#eee; padding: 10px; box-sizing: border-box; }
        .inline { display:flex; gap:8px; margin-top:10px; flex-wrap: wrap; }
        @media (max-width: 900px) { .portfolio-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="portfolio-page">
        <h1 className="portfolio-title">Portfolio</h1>
        <p className="portfolio-sub">About me and my core skills</p>
        <div className="portfolio-grid">

          <article className="portfolio-card">
            <h3>About Me</h3>
            {canCrud && editingAbout ? (
              <>
                <textarea
                  className="input"
                  rows={6}
                  value={aboutDraft}
                  onChange={(e) => setAboutDraft(e.target.value)}
                />
                <div className="inline">
                  <button className="btn" onClick={saveAbout} disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button className="btn" onClick={() => { setEditingAbout(false); setAboutDraft(about); }}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>Hi, I am {displayName}. {about}</p>
                {canCrud && (
                  <div className="inline">
                    <button className="btn" onClick={() => { setEditingAbout(true); setAboutDraft(about); }}>
                      {!aboutId ? "Create Intro" : "Edit Intro"}
                    </button>
                  </div>
                )}
              </>
            )}
          </article>

          <article className="portfolio-card">
            <h3>My Skills</h3>
            <div className="skills-wrap">
              {skills.length > 0 ? skills.map((skill, idx) => (
                <span className="skill-chip" key={`${skill}-${idx}`}>
                  {skill}
                  {canCrud && (
                    <button className="btn" onClick={() => removeSkill(idx)}>x</button>
                  )}
                </span>
              )) : (
                <p style={{ color: "#666", fontSize: "0.85rem" }}>No skills added yet.</p>
              )}
            </div>
            {canCrud && (
              <div className="inline">
                <input
                  className="input"
                  placeholder="Add skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <button className="btn" onClick={addSkill}>Add Skill</button>
              </div>
            )}
          </article>

        </div>
      </section>
    </>
  );
}