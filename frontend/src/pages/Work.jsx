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
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=Poppins:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .work-page {
          max-width: 950px;
          margin: 0 auto;
          padding: 3rem 1.5rem 4rem;
          min-height: 100vh;
          color: #ececec;
          font-family: 'Poppins', sans-serif;
        }
        .work-inner {
          width: 100%;
        }
        .work-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .work-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #a3a3a3;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .work-eyebrow::before {
          content: '';
          width: 24px;
          height: 1px;
          background: #444;
        }
        .work-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 500;
          margin: 0;
          color: #ececec;
          line-height: 1.05;
        }
        .work-count {
          margin-top: 0.65rem;
          color: #8b8b8b;
          font-size: 0.9rem;
        }
        .work-add-btn {
          border: 1px solid #444;
          background: #262626;
          color: #eee;
          border-radius: 10px;
          padding: 0.75rem 1.3rem;
          font-size: 0.80rem;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          white-space: nowrap;
        }
        .work-add-btn:hover {
          background: #333;
          border-color: #5f5f5f;
        }
        .work-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.9rem;
        }
        .work-card {
          background: #181818;
          border: 1px solid #2f2f2f;
          border-radius: 14px;
          padding: 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: border-color 0.2s, transform 0.2s;
        }
        .work-card:hover {
          border-color: #3a3a3a;
          transform: translateY(-1px);
        }
        .work-card-num {
          font-size: 0.75rem;
          color: #7a7a7a;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin: 0;
        }
        .work-card-title {
          font-family: 'Fraunces', serif;
          font-size: 1.1rem;
          margin: 0;
          color: #ececec;
          line-height: 1.3;
        }
        .work-card-desc {
          margin: 0;
          color: #aaa;
          line-height: 1.75;
          font-size: 0.92rem;
          flex: 1;
        }
        .work-techs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.45rem;
        }
        .work-tech {
          background: #1f1f1f;
          border: 1px solid #343434;
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          color: #d1d5db;
        }
        .work-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding-top: 0.85rem;
          border-top: 1px solid #222;
        }
        .work-link {
          color: #eee;
          text-decoration: none;
          font-size: 0.9rem;
        }
        .work-link:hover {
          color: #fff;
        }
        .work-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .work-action-btn {
          border: 1px solid #444;
          background: #262626;
          color: #eee;
          border-radius: 8px;
          padding: 0.55rem 0.85rem;
          font-size: 0.82rem;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .work-action-btn:hover {
          background: #333;
          border-color: #555;
        }
        .work-action-btn.del {
          border-color: rgba(255,255,255,0.12);
          color: #eee;
        }
        .work-action-btn.del:hover {
          background: rgba(255,255,255,0.08);
        }
        .work-delete-confirm {
          position: absolute;
          inset: 0;
          z-index: 20;
          background: rgba(15,15,22,0.95);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.5rem;
          animation: dc-in 0.15s ease;
        }
        @keyframes dc-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .work-delete-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .work-delete-confirm-title {
          font-family: 'Fraunces', serif;
          font-size: 1rem;
          color: #ececec;
          margin: 0;
          text-align: center;
        }
        .work-delete-confirm-sub {
          margin: 0;
          color: #888;
          font-size: 0.85rem;
          text-align: center;
        }
        .work-delete-confirm-btns {
          display: flex;
          gap: 0.6rem;
          width: 100%;
          margin-top: 0.25rem;
        }
        .work-del-cancel {
          flex: 1;
          border: 1px solid #444;
          background: transparent;
          color: #ccc;
          border-radius: 8px;
          padding: 0.55rem 0;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .work-del-cancel:hover:not(:disabled) {
          border-color: #5f5f5f;
          color: #eee;
        }
        .work-del-confirm {
          flex: 1;
          border: none;
          background: #444;
          color: #eee;
          border-radius: 8px;
          padding: 0.55rem 0;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .work-del-confirm:hover:not(:disabled) {
          background: #555;
        }
        .work-loading,
        .work-empty {
          text-align: center;
          color: #8b8b8b;
          padding: 3rem 0;
          font-size: 0.95rem;
        }
        .work-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.68);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .work-modal {
          width: 100%;
          max-width: 520px;
          background: #0f0f16;
          border: 1px solid #202024;
          border-radius: 18px;
          overflow: hidden;
        }
        .work-modal-header {
          padding: 1.4rem 1.6rem 1.2rem;
          border-bottom: 1px solid #202024;
        }
        .work-modal-header-top {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .work-modal-mode-badge {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ececec;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 0.28rem 0.85rem;
        }
        .work-modal-mode-badge.edit {
          color: #ececec;
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.12);
        }
        .work-modal-close {
          background: #17171b;
          border: 1px solid #27272a;
          color: #888;
          border-radius: 8px;
          padding: 0.35rem 0.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .work-modal-close:hover {
          background: #222;
          color: #eee;
        }
        .work-modal-title {
          font-family: 'Fraunces', serif;
          font-size: 1.3rem;
          margin: 0 0 0.25rem;
          color: #ececec;
        }
        .work-modal-sub {
          margin: 0;
          color: #8b8b8b;
          font-size: 0.95rem;
        }
        .work-modal-body {
          padding: 1.5rem 1.6rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .work-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .work-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #a3a3a3;
        }
        .work-input,
        .work-textarea {
          width: 100%;
          background: #121217;
          border: 1px solid #2d2d33;
          border-radius: 12px;
          padding: 0.9rem 1rem;
          color: #ececec;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .work-input:focus,
        .work-textarea:focus {
          border-color: #8b8b8b;
        }
        .work-textarea {
          min-height: 100px;
          resize: vertical;
        }
        .work-hint {
          font-size: 0.78rem;
          color: #777;
        }
        .work-error {
          color: #ddd;
          font-size: 0.88rem;
          margin: 0;
        }
        .work-modal-footer {
          padding: 1.1rem 1.6rem 1.4rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          border-top: 1px solid #202024;
        }
        .work-cancel-btn {
          border: 1px solid #444;
          background: transparent;
          color: #ccc;
          border-radius: 10px;
          padding: 0.75rem 1.2rem;
          font-size: 0.88rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .work-cancel-btn:hover {
          background: #18181b;
        }
        .work-save-btn {
          border: none;
          background: #ececec;
          color: #111;
          border-radius: 10px;
          padding: 0.75rem 1.3rem;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .work-save-btn:hover:not(:disabled) {
          background: #ffffff;
        }
        .work-save-btn.edit-mode {
          background: #444;
          color: #eee;
        }
        .work-save-btn.edit-mode:hover:not(:disabled) {
          background: #555;
        }
        .work-save-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        @media (max-width: 720px) {
          .work-grid { grid-template-columns: 1fr; }
          .work-header { flex-direction: column; align-items: flex-start; }
          .work-modal-header,
          .work-modal-body,
          .work-modal-footer { padding-left: 1rem; padding-right: 1rem; }
        }
      `}</style>

      <div className="work-page">
        <div className="work-inner">
          <div className="work-header">
            <div>
              <div className="work-eyebrow">Selected Work</div>
              <h1 className="work-title">My Projects</h1>
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