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
    if (!window.confirm("Delete this resume?")) return;
    try {
      await api.delete(`${API}/${id}`);
      flash("Deleted.", "success");
      load();
    } catch {
      flash("Delete failed.", "error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=Poppins:wght@400;500;600&display=swap');
        .ar-page { max-width: 950px; margin: 0 auto; color: #ececec; font-family: 'Poppins', sans-serif; }
        .ar-title { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
        .ar-sub { color: #a3a3a3; margin-bottom: 1.2rem; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
        .ar-status { font-size: 0.85rem; padding: 8px 12px; border-radius: 8px; margin-bottom: 1rem; }
        .ar-status.success { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
        .ar-status.error   { background: rgba(239,68,68,0.1);  color: #ef4444;  border: 1px solid rgba(239,68,68,0.2); }
        .ar-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1rem 1.1rem; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .ar-card-left { display: flex; align-items: center; gap: 12px; }
        .ar-card-icon { font-size: 1.5rem; }
        .ar-card-name { font-weight: 500; font-size: 0.92rem; color: #ececec; margin: 0 0 2px; }
        .ar-card-date { font-size: 0.78rem; color: #666; margin: 0; }
        .ar-card-actions { display: flex; gap: 6px; }
        .ar-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 12px; font-family: 'Poppins', sans-serif; transition: background 0.2s, border-color 0.2s; text-decoration: none; display: inline-flex; align-items: center; }
        .ar-btn:hover { background: #333; border-color: #555; }
        .ar-btn.del:hover { background: rgba(239,68,68,0.1); border-color: #ef4444; color: #ef4444; }
        .ar-loading { color: #666; font-size: 0.85rem; padding: 2rem 0; }
        .ar-empty { color: #666; font-size: 0.85rem; padding: 2rem 0; }
        .ar-add-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-size: 0.82rem; font-family: 'Poppins', sans-serif; transition: background 0.2s; white-space: nowrap; }
        .ar-add-btn:hover { background: #333; }
        .ar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem; }
        .ar-modal { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 420px; }
        .ar-modal-title { font-family: 'Fraunces', serif; font-size: 1.2rem; font-weight: 500; color: #ececec; margin: 0 0 1.2rem; }
        .ar-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
        .ar-label { font-size: 0.75rem; font-weight: 500; color: #a3a3a3; }
        .ar-upload-area { border: 2px dashed #3a3a3a; border-radius: 10px; padding: 1.75rem; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: #1f1f1f; }
        .ar-upload-area:hover { border-color: #666; background: #222; }
        .ar-upload-icon { font-size: 1.8rem; display: block; margin-bottom: 8px; }
        .ar-upload-text { font-size: 0.82rem; color: #888; }
        .ar-upload-name { font-size: 0.78rem; color: #ccc; margin-top: 8px; background: #252525; border: 1px solid #3a3a3a; border-radius: 6px; padding: 4px 8px; display: inline-block; word-break: break-all; }
        .ar-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1.2rem; }
        .ar-modal-cancel { border: 1px solid #3a3a3a; background: transparent; color: #888; border-radius: 8px; padding: 7px 14px; font-size: 0.82rem; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
        .ar-modal-cancel:hover { background: #222; }
        .ar-modal-save { border: none; background: #e6e6e6; color: #111; border-radius: 8px; padding: 7px 16px; font-size: 0.82rem; font-weight: 500; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
        .ar-modal-save:hover:not(:disabled) { background: #fff; }
        .ar-modal-save:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <section className="ar-page">
        <h1 className="ar-title">Resume</h1>
        <div className="ar-sub">
          <span>Manage your resume document</span>
          <button className="ar-add-btn" onClick={openAdd}>+ Upload Resume</button>
        </div>

        {status && (
          <div className={`ar-status ${status.type}`}>{status.msg}</div>
        )}

        {loading ? (
          <div className="ar-loading">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="ar-empty">No resume uploaded yet. Click + Upload Resume to add one.</div>
        ) : (
          resumes.map((r) => (
            <div key={r._id} className="ar-card">
              <div className="ar-card-left">
                <span className="ar-card-icon">📄</span>
                <div>
                  <p className="ar-card-name">Active Resume Document</p>
                  <p className="ar-card-date">
                    Added: {new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="ar-card-actions">
                <a href={r.pdf} target="_blank" rel="noopener noreferrer" className="ar-btn">View</a>
                <button className="ar-btn" onClick={() => openEdit(r)}>Update</button>
                <button className="ar-btn del" onClick={() => handleDelete(r._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </section>

      {modal && (
        <div className="ar-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ar-modal">
            <h2 className="ar-modal-title">{editId ? "Update Resume" : "Upload Resume"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="ar-field">
                <label className="ar-label">
                  Document File{editId && <span style={{ opacity: 0.6, marginLeft: 6 }}>(choose new file to replace)</span>}
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
              <div className="ar-modal-actions">
                <button type="button" className="ar-modal-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="ar-modal-save" disabled={saving}>
                  {saving ? "Uploading..." : editId ? "Update" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}