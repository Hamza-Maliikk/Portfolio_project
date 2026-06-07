import { useEffect, useState } from "react";
import api from "../lib/api";

const API = `projects`; 

export default function Work() {
  const [projects, setProjects]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [showForm, setShowForm]               = useState(false);
  const [editProject, setEditProject]         = useState(null);
  const [form, setForm]                       = useState({ title: "", description: "", technologies: "", link: "" });
  const [saving, setSaving]                   = useState(false);
  const [error, setError]                     = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting]               = useState(false);

  // ── GET ──
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(API); // ✅ axios — double /api/projects bug bhi fix
        setProjects(Array.isArray(res.data) ? res.data : []); // ✅ res.data
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── OPEN ADD ──
  const openAdd = () => {
    setEditProject(null);
    setForm({ title: "", description: "", technologies: "", link: "" });
    setError("");
    setShowForm(true);
  };

  // ── OPEN EDIT ──
  const openEdit = (e, p) => {
    e.stopPropagation();
    setEditProject(p);
    setForm({
      title:        p.title,
      description:  p.description,
      technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : "",
      link:         p.link || "",
    });
    setError("");
    setShowForm(true);
  };

  // ── OPEN DELETE CONFIRM ──
  const openDeleteConfirm = (e, id) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  // ── POST / PUT ──
  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title aur Description zaroori hain.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      title:        form.title.trim(),
      description:  form.description.trim(),
      technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      link:         form.link.trim(),
    };

    try {
      let res;
      if (editProject) {
        res = await api.put(`${API}/${editProject._id}`, payload); // ✅ axios
      } else {
        res = await api.post(API, payload); // ✅ axios
      }

      // ✅ res.data — r.json() nahi
      const saved = res.data?.data ?? res.data;

      if (editProject) {
        setProjects((prev) => prev.map((p) => (p._id === editProject._id ? saved : p)));
      } else {
        setProjects((prev) => [...prev, saved]);
      }
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Kuch galat hua, dobara try karo.");
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE ──
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`${API}/${id}`); // ✅ axios
      setProjects((prev) => prev.filter((p) => p._id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Delete mein error aya");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .work-page {
          font-family: 'DM Sans', sans-serif;
          background: #06060a;
          min-height: 100vh;
          padding: 5rem 1.5rem 6rem;
          position: relative;
          overflow: hidden;
        }
        .work-page::before {
          content: '';
          position: fixed;
          top: -200px; right: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,57,242,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .work-page::after {
          content: '';
          position: fixed;
          bottom: -200px; left: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .work-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .work-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 4rem; gap: 1rem; flex-wrap: wrap; }
        .work-eyebrow { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #6339f2; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; }
        .work-eyebrow::before { content: ''; width: 24px; height: 1px; background: #6339f2; }
        .work-title { font-family: 'Syne', sans-serif; font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; color: #f0f0f0; margin: 0; line-height: 1.05; letter-spacing: -0.03em; }
        .work-title em { font-style: normal; color: transparent; -webkit-text-stroke: 1.5px rgba(99,57,242,0.6); }
        .work-count { font-family: 'Syne', sans-serif; font-size: 0.8rem; color: #444; margin-top: 0.8rem; letter-spacing: 0.05em; }
        .work-add-btn { display: flex; align-items: center; gap: 0.5rem; background: #6339f2; color: #fff; border: none; border-radius: 10px; padding: 0.7rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.2s; white-space: nowrap; position: relative; z-index: 2; }
        .work-add-btn:hover { background: #7c56f5; transform: translateY(-2px); }
        .work-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }
        .work-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 1.75rem; display: flex; flex-direction: column; gap: 1rem; transition: border-color 0.3s, box-shadow 0.3s; position: relative; }
        .work-card:hover { border-color: rgba(99,57,242,0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,57,242,0.1); }
        .work-card-num { font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700; color: rgba(99,57,242,0.4); letter-spacing: 0.15em; }
        .work-card-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; color: #f0f0f0; margin: 0; line-height: 1.3; }
        .work-card-desc { font-size: 0.875rem; color: #888; line-height: 1.75; margin: 0; flex: 1; }
        .work-techs { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .work-tech { font-size: 0.72rem; font-weight: 500; padding: 0.25rem 0.65rem; border-radius: 100px; background: rgba(99,57,242,0.1); border: 1px solid rgba(99,57,242,0.2); color: #a78bfa; letter-spacing: 0.03em; }
        .work-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); position: relative; z-index: 2; }
        .work-link { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 500; color: #6339f2; text-decoration: none; transition: color 0.2s; }
        .work-link:hover { color: #a78bfa; }
        .work-actions { display: flex; gap: 0.4rem; position: relative; z-index: 5; }
        .work-action-btn { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #aaa; border-radius: 7px; padding: 0.35rem 0.75rem; font-size: 0.78rem; cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s; font-family: 'DM Sans', sans-serif; pointer-events: all; user-select: none; -webkit-user-select: none; }
        .work-action-btn:hover { border-color: #6339f2; color: #a78bfa; background: rgba(99,57,242,0.08); }
        .work-action-btn.del:hover { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.08); }
        .work-delete-confirm { position: absolute; inset: 0; z-index: 20; background: rgba(8,5,18,0.95); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 1.5rem; animation: dc-in 0.15s ease; }
        @keyframes dc-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .work-delete-icon { width: 42px; height: 42px; border-radius: 50%; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .work-delete-confirm-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #f0f0f0; margin: 0; text-align: center; }
        .work-delete-confirm-sub { font-size: 0.75rem; color: #555; margin: 0; text-align: center; }
        .work-delete-confirm-btns { display: flex; gap: 0.6rem; width: 100%; margin-top: 0.25rem; }
        .work-del-cancel { flex: 1; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: #999; border-radius: 8px; padding: 0.5rem 0; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .work-del-cancel:hover:not(:disabled) { border-color: rgba(255,255,255,0.3); color: #ddd; }
        .work-del-cancel:disabled { opacity: 0.4; cursor: not-allowed; }
        .work-del-confirm { flex: 1; border: none; background: #ef4444; color: #fff; border-radius: 8px; padding: 0.5rem 0; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .work-del-confirm:hover:not(:disabled) { background: #dc2626; }
        .work-del-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
        .work-loading { text-align: center; padding: 6rem 0; color: #444; font-size: 0.875rem; letter-spacing: 0.1em; }
        .work-empty { grid-column: 1/-1; text-align: center; padding: 5rem 0; color: #444; }
        .work-empty p { margin: 0.5rem 0 0; font-size: 0.875rem; }
        .work-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .work-modal { background: #0f0f16; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; width: 100%; max-width: 480px; display: flex; flex-direction: column; overflow: hidden; }
        .work-modal-header { padding: 1.5rem 2rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; }
        .work-modal-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #6339f2, #a78bfa); border-radius: 18px 18px 0 0; }
        .work-modal-header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; }
        .work-modal-mode-badge { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #6339f2; background: rgba(99,57,242,0.1); border: 1px solid rgba(99,57,242,0.2); border-radius: 100px; padding: 0.2rem 0.65rem; }
        .work-modal-mode-badge.edit { color: #f59e0b; background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.25); }
        .work-modal-close { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #666; font-size: 0.9rem; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 6px; line-height: 1; transition: color 0.2s, background 0.2s; }
        .work-modal-close:hover { color: #f0f0f0; background: rgba(255,255,255,0.1); }
        .work-modal-title { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 700; color: #f0f0f0; margin: 0 0 0.2rem; }
        .work-modal-sub { font-size: 0.78rem; color: #555; margin: 0; }
        .work-modal-body { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
        .work-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .work-label { font-size: 0.72rem; font-weight: 500; color: #555; letter-spacing: 0.06em; text-transform: uppercase; }
        .work-input, .work-textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; padding: 0.7rem 1rem; color: #f0f0f0; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s; width: 100%; }
        .work-input:focus, .work-textarea:focus { border-color: rgba(99,57,242,0.55); }
        .work-textarea { resize: vertical; min-height: 88px; }
        .work-hint { font-size: 0.68rem; color: #444; }
        .work-error { color: #ef4444; font-size: 0.8rem; margin: 0; }
        .work-modal-footer { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 2rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .work-cancel-btn { border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #888; border-radius: 10px; padding: 0.65rem 1.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .work-cancel-btn:hover { border-color: rgba(255,255,255,0.22); color: #ccc; }
        .work-save-btn { background: #6339f2; color: #fff; border: none; border-radius: 10px; padding: 0.65rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .work-save-btn:hover:not(:disabled) { background: #7c56f5; }
        .work-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .work-save-btn.edit-mode { background: #d97706; }
        .work-save-btn.edit-mode:hover:not(:disabled) { background: #f59e0b; }
        @media (max-width: 600px) {
          .work-grid { grid-template-columns: 1fr; }
          .work-header { flex-direction: column; align-items: flex-start; }
          .work-modal-body, .work-modal-footer, .work-modal-header { padding-left: 1.25rem; padding-right: 1.25rem; }
        }
      `}</style>

      <div className="work-page">
        <div className="work-inner">
          <div className="work-header">
            <div>
              <div className="work-eyebrow">Selected Work</div>
              <h1 className="work-title">My <em>Projects</em></h1>
              {!loading && <p className="work-count">{projects.length} projects</p>}
            </div>
            <button className="work-add-btn" onClick={openAdd}>+ Add Project</button>
          </div>

          {loading ? (
            <div className="work-loading">Loading projects...</div>
          ) : (
            <div className="work-grid">
              {projects.length === 0 ? (
                <div className="work-empty">
                  <p>No projects yet.</p>
                  <p>Click "Add Project" to get started.</p>
                </div>
              ) : (
                projects.map((p, idx) => (
                  <div key={p._id} className="work-card">
                    {deleteConfirmId === p._id && (
                      <div className="work-delete-confirm">
                        <div className="work-delete-icon">🗑</div>
                        <p className="work-delete-confirm-title">Delete this project?</p>
                        <p className="work-delete-confirm-sub">Yeh action undo nahi ho sakta.</p>
                        <div className="work-delete-confirm-btns">
                          <button className="work-del-cancel" type="button" onClick={() => setDeleteConfirmId(null)} disabled={deleting}>Cancel</button>
                          <button className="work-del-confirm" type="button" onClick={() => handleDelete(p._id)} disabled={deleting}>
                            {deleting ? "Deleting..." : "Yes, Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                    <span className="work-card-num">{String(idx + 1).padStart(2, "0")}</span>
                    <h2 className="work-card-title">{p.title}</h2>
                    <p className="work-card-desc">{p.description}</p>
                    {p.technologies?.length > 0 && (
                      <div className="work-techs">
                        {p.technologies.map((t) => (
                          <span key={t} className="work-tech">{t}</span>
                        ))}
                      </div>
                    )}
                    <div className="work-card-footer">
                      {p.link
                        ? <a href={p.link} target="_blank" rel="noopener noreferrer" className="work-link">View Project →</a>
                        : <span />
                      }
                      <div className="work-actions">
                        <button type="button" className="work-action-btn" onClick={(e) => openEdit(e, p)}>Edit</button>
                        <button type="button" className="work-action-btn del" onClick={(e) => openDeleteConfirm(e, p._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="work-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="work-modal" onClick={(e) => e.stopPropagation()}>
            <div className="work-modal-header">
              <div className="work-modal-header-top">
                <span className={`work-modal-mode-badge${editProject ? " edit" : ""}`}>
                  {editProject ? "Edit Mode" : "New Project"}
                </span>
                <button className="work-modal-close" type="button" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <h2 className="work-modal-title">{editProject ? `Editing: ${editProject.title}` : "Add a New Project"}</h2>
              <p className="work-modal-sub">{editProject ? "Make changes below and hit Update." : "Fill in the details to add to your portfolio."}</p>
            </div>
            <div className="work-modal-body">
              <div className="work-field">
                <label className="work-label">Title</label>
                <input className="work-input" placeholder="Project name" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="work-field">
                <label className="work-label">Description</label>
                <textarea className="work-textarea" placeholder="What did you build?" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="work-field">
                <label className="work-label">Technologies</label>
                <input className="work-input" placeholder="React, Node.js, MongoDB" value={form.technologies} onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))} />
                <span className="work-hint">Comma se alag karo</span>
              </div>
              <div className="work-field">
                <label className="work-label">Link</label>
                <input className="work-input" placeholder="https://github.com/..." value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} />
              </div>
              {error && <p className="work-error">⚠ {error}</p>}
            </div>
            <div className="work-modal-footer">
              <button className="work-cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="button" className={`work-save-btn${editProject ? " edit-mode" : ""}`} onClick={handleSave} disabled={saving}>
                {saving ? (editProject ? "Updating..." : "Adding...") : (editProject ? "Update Project" : "Add Project")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}