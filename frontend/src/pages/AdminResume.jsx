import { useState, useEffect } from "react";
import api from "../lib/api"; // ✅ axios interceptor wala

const API = `resume`; // ✅ baseURL interceptor mein already hai

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
      const r = await api.get(API); // ✅ axios
      setResumes(r.data);           // ✅ r.data — r.json() nahi
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
      const method = editId ? "put" : "post"; // ✅ lowercase

      await api.request({  // ✅ fetch() ki jagah axios
        method,
        url,
        data: fd,
        // ✅ Content-Type mat likho — axios khud set karta hai
      });

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
      await api.delete(`${API}/${id}`); // ✅ axios — r.ok nahi chahiye
      flash("Deleted.", "success");
      load();
    } catch {
      flash("Delete failed.", "error");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .ar-wrap { font-family: 'Poppins', sans-serif; padding: 2rem 1.5rem; background: var(--bg); min-height: 100vh; }
        .ar-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .ar-title { font-size: 1.25rem; font-weight: 600; color: var(--text-h); }
        .ar-btn { padding: 7px 18px; font-size: 0.85rem; font-weight: 600; border-radius: 8px; border: none; cursor: pointer; transition: opacity 0.2s, transform 0.15s; }
        .ar-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .ar-btn-primary { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; }
        .ar-btn-edit { background: rgba(139,92,246,0.1); color: #8b5cf6; }
        .ar-btn-del  { background: rgba(239,68,68,0.1);  color: #ef4444; }
        .ar-btn-sm   { padding: 4px 12px; font-size: 0.78rem; text-decoration: none; display: inline-block; }
        .ar-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .ar-status { font-size: 0.85rem; padding: 10px 14px; border-radius: 8px; margin-bottom: 1rem; }
        .ar-status.success { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
        .ar-status.error   { background: rgba(239,68,68,0.1);  color: #ef4444;  border: 1px solid rgba(239,68,68,0.2); }
        .ar-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center; transition: box-shadow 0.2s; flex-wrap: wrap; gap: 12px; }
        .ar-card:hover { box-shadow: 0 4px 20px rgba(139,92,246,0.1); }
        .ar-icon { width: 48px; height: 48px; border-radius: 10px; background: rgba(239,68,68,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #ef4444; overflow: hidden; margin-right: 15px; flex-shrink: 0;}
        .ar-info { flex: 1; min-width: 0; }
        .ar-name { font-size: 1rem; font-weight: 600; color: var(--text-h); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;}
        .ar-date { font-size: 0.82rem; color: var(--text); }
        .ar-actions { display: flex; gap: 8px; }
        .ar-empty { text-align: center; padding: 3rem; color: var(--text); opacity: 0.5; font-size: 0.9rem; }
        .ar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem; backdrop-filter: blur(4px); }
        .ar-modal { background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border); padding: 2rem; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .ar-modal-title { font-size: 1.2rem; font-weight: 600; color: var(--text-h); margin-bottom: 1.5rem; }
        .ar-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .ar-label { font-size: 0.8rem; font-weight: 500; color: var(--text); opacity: 0.8; }
        .ar-upload-area { border: 2px dashed var(--border); border-radius: 12px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.2s; background: var(--bg); }
        .ar-upload-area:hover { border-color: #8b5cf6; background: rgba(139,92,246,0.04); }
        .ar-upload-icon { font-size: 2rem; margin-bottom: 10px; display: inline-block; }
        .ar-upload-text { font-size: 0.85rem; color: var(--text); font-weight: 500; }
        .ar-upload-name { font-size: 0.8rem; color: #8b5cf6; margin-top: 8px; font-weight: 500; border-radius: 6px; background: rgba(139,92,246,0.1); padding: 6px 10px; display: inline-block; word-break: break-all;}
        .ar-modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.5rem; }
        .ar-btn-cancel { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 8px 18px; font-size: 0.85rem; font-weight: 500; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
        .ar-btn-cancel:hover { background: rgba(0,0,0,0.05); }
        html.dark-mode .ar-btn-cancel:hover { background: rgba(255,255,255,0.05); }
      `}</style>

      <div className="ar-wrap">
        {status && (
          <div className={`ar-status ${status.type}`}>{status.msg}</div>
        )}

        <div className="ar-topbar">
          <span className="ar-title">Resume Management</span>
          <button className="ar-btn ar-btn-primary" onClick={openAdd}>
            + Upload Resume
          </button>
        </div>

        {loading ? (
          <div className="ar-empty">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="ar-empty">
            No resume uploaded yet. Click + Upload Resume to add one.
          </div>
        ) : (
          resumes.map((r) => (
            <div key={r._id} className="ar-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div className="ar-icon">📄</div>
                <div className="ar-info">
                  <div className="ar-name">Active Resume Document</div>
                  <div className="ar-date">
                    Added:{" "}
                    {new Date(r.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="ar-actions">
                <a
                  href={r.pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ar-btn ar-btn-edit ar-btn-sm"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  View
                </a>
                <button
                  className="ar-btn ar-btn-edit ar-btn-sm"
                  onClick={() => openEdit(r)}
                >
                  Update
                </button>
                <button
                  className="ar-btn ar-btn-del  ar-btn-sm"
                  onClick={() => handleDelete(r._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {modal && (
          <div
            className="ar-overlay"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="ar-modal">
              <div className="ar-modal-title">
                {editId ? "Update Resume" : "Upload Resume"}
              </div>
              <form onSubmit={handleSubmit}>
                <div className="ar-field">
                  <label className="ar-label">
                    Document File{" "}
                    {editId && (
                      <span style={{ opacity: 0.6 }}>
                        (Choose new file to replace)
                      </span>
                    )}
                  </label>
                  <div
                    className="ar-upload-area"
                    onClick={() => document.getElementById("ar-file").click()}
                  >
                    <input
                      id="ar-file"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={handleFile}
                    />
                    <div className="ar-upload-icon">📄</div>
                    <div className="ar-upload-text">
                      Click to choose a PDF or Word document
                    </div>
                    {file && <div className="ar-upload-name">{file.name}</div>}
                  </div>
                </div>

                <div className="ar-modal-actions">
                  <button
                    type="button"
                    className="ar-btn-cancel"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ar-btn ar-btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
