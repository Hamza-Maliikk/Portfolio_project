import { useState, useEffect } from "react";
import api from "../lib/api";

const API = `resume`;

export default function AdminResume() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(API);
      setResumes(r.data);
    } catch {
      flash("Could not load resumes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const flash = (msg, type) => {
    setStatus({ msg, type });
    setTimeout(() => setStatus(null), 3000);
  };

  const openAdd = () => {
    setEditId(null);
    setFile(null);
    setModal(true);
  };

  const openEdit = (e) => {
    setEditId(e._id);
    setFile(null);
    setModal(true);
  };

  const closeModal = () => setModal(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!file && !editId) {
      flash("Please select a document file.", "error");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      if (file) fd.append("pdf", file);

      const url    = editId ? `${API}/${editId}` : API;
      const method = editId ? "put" : "post";

      await api.request({ method, url, data: fd });

      closeModal();
      flash(editId ? "Resume updated successfully." : "Resume added successfully.", "success");
      load();
    } catch {
      flash("Save failed. Check server.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`${API}/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      setDeleteConfirmId(null);
      flash("Deleted.", "success");
    } catch {
      flash("Delete failed.", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        .ar-page {
          font-family: 'DM Sans', sans-serif;
          background: #06060a;
          min-height: 100vh;
          padding: 5rem 1.5rem 6rem;
          position: relative;
          overflow: hidden;
        }
        .ar-page::before {
          content: '';
          position: fixed;
          top: -200px; right: -200px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(99,57,242,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .ar-page::after {
          content: '';
          position: fixed;
          bottom: -200px; left: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .ar-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }
        .ar-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 4rem; gap: 1rem; flex-wrap: wrap; }
        .ar-eyebrow { font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: #6339f2; margin-bottom: 0.6rem; display: flex; align-items: center; gap: 0.5rem; }
        .ar-eyebrow::before { content: ''; width: 24px; height: 1px; background: #6339f2; }
        .ar-title { font-family: 'Syne', sans-serif; font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 800; color: #f0f0f0; margin: 0; line-height: 1.05; letter-spacing: -0.03em; }
        .ar-title em { font-style: normal; color: transparent; -webkit-text-stroke: 1.5px rgba(99,57,242,0.6); }
        .ar-count { font-family: 'Syne', sans-serif; font-size: 0.8rem; color: #444; margin-top: 0.8rem; letter-spacing: 0.05em; }
        .ar-add-btn { display: flex; align-items: center; gap: 0.5rem; background: #6339f2; color: #fff; border: none; border-radius: 10px; padding: 0.7rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: background 0.2s, transform 0.2s; white-space: nowrap; position: relative; z-index: 2; }
        .ar-add-btn:hover { background: #7c56f5; transform: translateY(-2px); }

        .ar-status { font-size: 0.85rem; padding: 10px 16px; border-radius: 10px; margin-bottom: 1.5rem; font-family: 'DM Sans', sans-serif; }
        .ar-status.success { background: rgba(34,197,94,0.08); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
        .ar-status.error   { background: rgba(239,68,68,0.08);  color: #ef4444;  border: 1px solid rgba(239,68,68,0.2); }

        .ar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem; }

        .ar-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          position: relative;
        }
        .ar-card:hover { border-color: rgba(99,57,242,0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,57,242,0.1); }

        .ar-card-num { font-family: 'Syne', sans-serif; font-size: 0.65rem; font-weight: 700; color: rgba(99,57,242,0.4); letter-spacing: 0.15em; }
        .ar-card-title { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 700; color: #f0f0f0; margin: 0; line-height: 1.3; }
        .ar-card-date { font-size: 0.875rem; color: #888; line-height: 1.75; margin: 0; }

        .ar-card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid rgba(255,255,255,0.05); position: relative; z-index: 2; }
        .ar-view-link { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; font-weight: 500; color: #6339f2; text-decoration: none; transition: color 0.2s; }
        .ar-view-link:hover { color: #a78bfa; }
        .ar-actions { display: flex; gap: 0.4rem; position: relative; z-index: 5; }
        .ar-action-btn { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #aaa; border-radius: 7px; padding: 0.35rem 0.75rem; font-size: 0.78rem; cursor: pointer; transition: border-color 0.2s, color 0.2s, background 0.2s; font-family: 'DM Sans', sans-serif; }
        .ar-action-btn:hover { border-color: #6339f2; color: #a78bfa; background: rgba(99,57,242,0.08); }
        .ar-action-btn.del:hover { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.08); }

        .ar-delete-confirm { position: absolute; inset: 0; z-index: 20; background: rgba(8,5,18,0.95); border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 1.5rem; animation: dc-in 0.15s ease; }
        @keyframes dc-in { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .ar-delete-icon { width: 42px; height: 42px; border-radius: 50%; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0; }
        .ar-delete-confirm-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; color: #f0f0f0; margin: 0; text-align: center; }
        .ar-delete-confirm-sub { font-size: 0.75rem; color: #555; margin: 0; text-align: center; }
        .ar-delete-confirm-btns { display: flex; gap: 0.6rem; width: 100%; margin-top: 0.25rem; }
        .ar-del-cancel { flex: 1; border: 1px solid rgba(255,255,255,0.12); background: transparent; color: #999; border-radius: 8px; padding: 0.5rem 0; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .ar-del-cancel:hover:not(:disabled) { border-color: rgba(255,255,255,0.3); color: #ddd; }
        .ar-del-cancel:disabled { opacity: 0.4; cursor: not-allowed; }
        .ar-del-confirm { flex: 1; border: none; background: #ef4444; color: #fff; border-radius: 8px; padding: 0.5rem 0; font-family: 'DM Sans', sans-serif; font-size: 0.8rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .ar-del-confirm:hover:not(:disabled) { background: #dc2626; }
        .ar-del-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

        .ar-loading { text-align: center; padding: 6rem 0; color: #444; font-size: 0.875rem; letter-spacing: 0.1em; }
        .ar-empty { grid-column: 1/-1; text-align: center; padding: 5rem 0; color: #444; }
        .ar-empty p { margin: 0.5rem 0 0; font-size: 0.875rem; }

        .ar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .ar-modal { background: #0f0f16; border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; width: 100%; max-width: 480px; display: flex; flex-direction: column; overflow: hidden; }
        .ar-modal-header { padding: 1.5rem 2rem 1.2rem; border-bottom: 1px solid rgba(255,255,255,0.06); position: relative; }
        .ar-modal-header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #6339f2, #a78bfa); border-radius: 18px 18px 0 0; }
        .ar-modal-header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem; }
        .ar-modal-badge { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #6339f2; background: rgba(99,57,242,0.1); border: 1px solid rgba(99,57,242,0.2); border-radius: 100px; padding: 0.2rem 0.65rem; }
        .ar-modal-badge.edit { color: #f59e0b; background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.25); }
        .ar-modal-close { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #666; font-size: 0.9rem; cursor: pointer; padding: 0.25rem 0.5rem; border-radius: 6px; line-height: 1; transition: color 0.2s, background 0.2s; }
        .ar-modal-close:hover { color: #f0f0f0; background: rgba(255,255,255,0.1); }
        .ar-modal-title { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 700; color: #f0f0f0; margin: 0 0 0.2rem; }
        .ar-modal-sub { font-size: 0.78rem; color: #555; margin: 0; }
        .ar-modal-body { padding: 1.5rem 2rem; display: flex; flex-direction: column; gap: 1rem; }
        .ar-field { display: flex; flex-direction: column; gap: 0.35rem; }
        .ar-label { font-size: 0.72rem; font-weight: 500; color: #555; letter-spacing: 0.06em; text-transform: uppercase; }
        .ar-upload-area { border: 1px dashed rgba(255,255,255,0.12); border-radius: 12px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(255,255,255,0.02); }
        .ar-upload-area:hover { border-color: #6339f2; background: rgba(99,57,242,0.04); }
        .ar-upload-icon { font-size: 1.8rem; margin-bottom: 10px; display: block; }
        .ar-upload-text { font-size: 0.85rem; color: #666; font-weight: 500; }
        .ar-upload-name { font-size: 0.8rem; color: #a78bfa; margin-top: 10px; font-weight: 500; border-radius: 6px; background: rgba(99,57,242,0.1); border: 1px solid rgba(99,57,242,0.2); padding: 6px 10px; display: inline-block; word-break: break-all; }
        .ar-modal-footer { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 2rem 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .ar-cancel-btn { border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #888; border-radius: 10px; padding: 0.65rem 1.2rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .ar-cancel-btn:hover { border-color: rgba(255,255,255,0.22); color: #ccc; }
        .ar-save-btn { background: #6339f2; color: #fff; border: none; border-radius: 10px; padding: 0.65rem 1.4rem; font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: background 0.2s; }
        .ar-save-btn:hover:not(:disabled) { background: #7c56f5; }
        .ar-save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ar-save-btn.edit-mode { background: #d97706; }
        .ar-save-btn.edit-mode:hover:not(:disabled) { background: #f59e0b; }

        @media (max-width: 600px) {
          .ar-grid { grid-template-columns: 1fr; }
          .ar-header { flex-direction: column; align-items: flex-start; }
          .ar-modal-body, .ar-modal-footer, .ar-modal-header { padding-left: 1.25rem; padding-right: 1.25rem; }
        }
      `}</style>

      <div className="ar-page">
        <div className="ar-inner">

          {status && (
            <div className={`ar-status ${status.type}`}>{status.msg}</div>
          )}

          <div className="ar-header">
            <div>
              <div className="ar-eyebrow">Documents</div>
              <h1 className="ar-title">My <em>Resume</em></h1>
              {!loading && <p className="ar-count">{resumes.length} document{resumes.length !== 1 ? "s" : ""}</p>}
            </div>
            <button className="ar-add-btn" onClick={openAdd}>+ Upload Resume</button>
          </div>

          {loading ? (
            <div className="ar-loading">Loading resumes...</div>
          ) : (
            <div className="ar-grid">
              {resumes.length === 0 ? (
                <div className="ar-empty">
                  <p>No resume uploaded yet.</p>
                  <p>Click "+ Upload Resume" to add one.</p>
                </div>
              ) : (
                resumes.map((r, idx) => (
                  <div key={r._id} className="ar-card">
                    {deleteConfirmId === r._id && (
                      <div className="ar-delete-confirm">
                        <div className="ar-delete-icon">🗑</div>
                        <p className="ar-delete-confirm-title">Delete this resume?</p>
                        <p className="ar-delete-confirm-sub">This action cannot be undone.</p>
                        <div className="ar-delete-confirm-btns">
                          <button className="ar-del-cancel" type="button" onClick={() => setDeleteConfirmId(null)} disabled={deleting}>Cancel</button>
                          <button className="ar-del-confirm" type="button" onClick={() => handleDelete(r._id)} disabled={deleting}>
                            {deleting ? "Deleting..." : "Yes, Delete"}
                          </button>
                        </div>
                      </div>
                    )}
                    <span className="ar-card-num">{String(idx + 1).padStart(2, "0")}</span>
                    <h2 className="ar-card-title">Active Resume Document</h2>
                    <p className="ar-card-date">
                      Added: {new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    <div className="ar-card-footer">
                      <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="ar-view-link">
                        View PDF →
                      </a>
                      <div className="ar-actions">
                        <button type="button" className="ar-action-btn" onClick={() => openEdit(r)}>Update</button>
                        <button type="button" className="ar-action-btn del" onClick={() => setDeleteConfirmId(r._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <div className="ar-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ar-modal-header">
              <div className="ar-modal-header-top">
                <span className={`ar-modal-badge${editId ? " edit" : ""}`}>
                  {editId ? "Update Mode" : "New Upload"}
                </span>
                <button className="ar-modal-close" type="button" onClick={closeModal}>✕</button>
              </div>
              <h2 className="ar-modal-title">{editId ? "Update Resume" : "Upload Resume"}</h2>
              <p className="ar-modal-sub">{editId ? "Choose a new file to replace the current resume." : "Upload a PDF or Word document."}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="ar-modal-body">
                <div className="ar-field">
                  <label className="ar-label">
                    Document File{editId && <span style={{ opacity: 0.5, marginLeft: 6 }}>(optional to replace)</span>}
                  </label>
                  <div
                    className="ar-upload-area"
                    onClick={() => document.getElementById("ar-file-input").click()}
                  >
                    <input
                      id="ar-file-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={handleFile}
                    />
                    <span className="ar-upload-icon">📄</span>
                    <div className="ar-upload-text">Click to choose a PDF or Word document</div>
                    {file && <div className="ar-upload-name">{file.name}</div>}
                  </div>
                </div>
              </div>

              <div className="ar-modal-footer">
                <button type="button" className="ar-cancel-btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className={`ar-save-btn${editId ? " edit-mode" : ""}`} disabled={saving}>
                  {saving ? "Uploading..." : editId ? "Update Resume" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}