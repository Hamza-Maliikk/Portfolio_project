import { useState, useEffect } from "react";
import api from "../lib/api"; // ✅ axios interceptor wala

const API = `home`;
const emptyForm = { role: "", headline: "", description: "" };

export default function Adminhome() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState("");
  const [editId, setEditId]   = useState(null);
  const [status, setStatus]   = useState(null);
  const [saving, setSaving]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(API); // ✅ axios
      setEntries(r.data);           // ✅ r.data — r.json() nahi
    } catch { 
      flash("Could not load data.", "error"); 
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
    setForm(emptyForm);
    setImageFile(null);
    setPreview("");
    setModal(true);
  };

  const openEdit = (e) => {
    setEditId(e._id);
    setForm({ role: e.role, headline: e.headline, description: e.description });
    setImageFile(null);
    setPreview(e.image || "");
    setModal(true);
  };

  const closeModal = () => setModal(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!form.role || !form.headline || !form.description) {
      flash("All fields are required.", "error"); return;
    }
    if (!editId && !imageFile) {
      flash("Image select karo.", "error"); return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("role",        form.role);
      fd.append("headline",    form.headline);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);

      const url    = editId ? `${API}/${editId}` : API;
      const method = editId ? "put" : "post"; // ✅ lowercase axios ke liye

      await api.request({         // ✅ axios — fetch nahi
        method,
        url,
        data: fd,
        // ✅ Content-Type mat likho — axios khud set karta hai FormData ke liye
      });

      closeModal();
      flash(editId ? "Updated successfully." : "Added successfully.", "success");
      load();
    } catch { 
      flash("Save failed. Check server.", "error"); 
    } finally { 
      setSaving(false); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await api.delete(`${API}/${id}`); // ✅ axios — r.ok check nahi chahiye
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
        .ah-wrap { font-family: 'Poppins', sans-serif; padding: 2rem 1.5rem; background: var(--bg); min-height: 100vh; }
        .ah-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
        .ah-title { font-size: 1.25rem; font-weight: 600; color: var(--text-h); }
        .ah-btn { padding: 7px 18px; font-size: 0.85rem; font-weight: 600; border-radius: 8px; border: none; cursor: pointer; transition: opacity 0.2s, transform 0.15s; }
        .ah-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .ah-btn-primary { background: linear-gradient(135deg, #8b5cf6, #6366f1); color: #fff; }
        .ah-btn-edit { background: rgba(139,92,246,0.1); color: #8b5cf6; }
        .ah-btn-del  { background: rgba(239,68,68,0.1);  color: #ef4444; }
        .ah-btn-sm   { padding: 4px 12px; font-size: 0.78rem; }
        .ah-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .ah-status { font-size: 0.85rem; padding: 10px 14px; border-radius: 8px; margin-bottom: 1rem; }
        .ah-status.success { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
        .ah-status.error   { background: rgba(239,68,68,0.1);  color: #ef4444;  border: 1px solid rgba(239,68,68,0.2); }
        .ah-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 14px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; display: grid; grid-template-columns: 64px 1fr; gap: 1rem; align-items: start; transition: box-shadow 0.2s; }
        .ah-card:hover { box-shadow: 0 4px 20px rgba(139,92,246,0.1); }
        .ah-thumb { width: 64px; height: 64px; border-radius: 10px; background: rgba(139,92,246,0.08); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #a78bfa; overflow: hidden; }
        .ah-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .ah-role { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #8b5cf6; margin-bottom: 3px; }
        .ah-headline { font-size: 1rem; font-weight: 600; color: var(--text-h); margin-bottom: 4px; }
        .ah-desc { font-size: 0.82rem; color: var(--text); line-height: 1.6; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ah-actions { display: flex; gap: 8px; }
        .ah-empty { text-align: center; padding: 3rem; color: var(--text); opacity: 0.5; font-size: 0.9rem; }
        .ah-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem; }
        .ah-modal { background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border); padding: 2rem; width: 100%; max-width: 460px; max-height: 90vh; overflow-y: auto; }
        .ah-modal-title { font-size: 1.1rem; font-weight: 600; color: var(--text-h); margin-bottom: 1.25rem; }
        .ah-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .ah-label { font-size: 0.75rem; font-weight: 500; color: var(--text); opacity: 0.8; }
        .ah-input, .ah-textarea { background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; color: var(--text-h); font-family: 'Poppins', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
        .ah-input:focus, .ah-textarea:focus { border-color: rgba(139,92,246,0.5); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
        .ah-textarea { resize: vertical; min-height: 85px; }
        .ah-upload-area { border: 2px dashed var(--border); border-radius: 10px; padding: 1.2rem; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; }
        .ah-upload-area:hover { border-color: #8b5cf6; background: rgba(139,92,246,0.04); }
        .ah-upload-icon { font-size: 1.5rem; margin-bottom: 6px; }
        .ah-upload-text { font-size: 0.82rem; color: var(--text); opacity: 0.65; }
        .ah-upload-name { font-size: 0.78rem; color: #8b5cf6; margin-top: 4px; font-weight: 500; }
        .ah-preview { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-top: 10px; display: block; border: 1px solid var(--border); }
        .ah-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1.25rem; }
        .ah-btn-cancel { background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 7px 18px; font-size: 0.85rem; font-weight: 500; border-radius: 8px; cursor: pointer; }
      `}</style>

      <div className="ah-wrap">
        {status && <div className={`ah-status ${status.type}`}>{status.msg}</div>}

        <div className="ah-topbar">
          <span className="ah-title">Home Section</span>
          <button className="ah-btn ah-btn-primary" onClick={openAdd}>+ Add Entry</button>
        </div>

        {loading ? (
          <div className="ah-empty">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="ah-empty">No entries yet. Click + Add Entry to create one.</div>
        ) : (
          entries.map((e) => (
            <div key={e._id} className="ah-card">
              <div className="ah-thumb">
                {e.image ? <img src={e.image} alt="" onError={ev => ev.target.style.display = "none"} /> : "No img"}
              </div>
              <div>
                <div className="ah-role">{e.role}</div>
                <div className="ah-headline">{e.headline}</div>
                <div className="ah-desc">{e.description}</div>
                <div className="ah-actions">
                  <button className="ah-btn ah-btn-edit ah-btn-sm" onClick={() => openEdit(e)}>Edit</button>
                  <button className="ah-btn ah-btn-del  ah-btn-sm" onClick={() => handleDelete(e._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}

        {modal && (
          <div className="ah-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
            <div className="ah-modal">
              <div className="ah-modal-title">{editId ? "Edit Entry" : "Add Entry"}</div>
              <form onSubmit={handleSubmit}>

                <div className="ah-field">
                  <label className="ah-label">Role</label>
                  <input className="ah-input" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Full Stack Developer" required />
                </div>

                <div className="ah-field">
                  <label className="ah-label">Headline</label>
                  <input className="ah-input" name="headline" value={form.headline} onChange={handleChange} placeholder="e.g. Building modern web apps" required />
                </div>

                <div className="ah-field">
                  <label className="ah-label">Description</label>
                  <textarea className="ah-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Short intro..." required />
                </div>

                {/* ── File Upload (Image URL input replace) ── */}
                <div className="ah-field">
                  <label className="ah-label">
                    Image {editId && <span style={{opacity:0.6}}>(nai select karo ya purani rahne do)</span>}
                  </label>
                  <div className="ah-upload-area" onClick={() => document.getElementById("ah-file").click()}>
                    <input
                      id="ah-file"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFile}
                    />
                    <div className="ah-upload-icon">🖼</div>
                    <div className="ah-upload-text">Click karke image choose karo</div>
                    {imageFile && <div className="ah-upload-name">{imageFile.name}</div>}
                    {preview && <img src={preview} alt="preview" className="ah-preview" />}
                  </div>
                </div>

                <div className="ah-modal-actions">
                  <button type="button" className="ah-btn-cancel" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="ah-btn ah-btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save"}
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