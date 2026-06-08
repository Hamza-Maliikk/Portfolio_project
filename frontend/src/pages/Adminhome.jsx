import { useState, useEffect } from "react";
import api from "../lib/api";

const API = `home`;
const emptyForm = { role: "", headline: "", description: "" };

export default function Adminhome() {
  const [entries, setEntries]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]     = useState("");
  const [editId, setEditId]       = useState(null);
  const [status, setStatus]       = useState(null);
  const [saving, setSaving]       = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get(API);
      setEntries(r.data);
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
      flash("Please select an image.", "error"); return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("role",        form.role);
      fd.append("headline",    form.headline);
      fd.append("description", form.description);
      if (imageFile) fd.append("image", imageFile);

      const url    = editId ? `${API}/${editId}` : API;
      const method = editId ? "put" : "post";

      await api.request({ method, url, data: fd });

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
        .ah-page { max-width: 950px; margin: 0 auto; color: #ececec; font-family: 'Poppins', sans-serif; }
        .ah-title { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
        .ah-sub { color: #a3a3a3; margin-bottom: 1.2rem; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }
        .ah-status { font-size: 0.85rem; padding: 8px 12px; border-radius: 8px; margin-bottom: 1rem; }
        .ah-status.success { background: rgba(34,197,94,0.1); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
        .ah-status.error   { background: rgba(239,68,68,0.1);  color: #ef4444;  border: 1px solid rgba(239,68,68,0.2); }

        .ah-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1rem 1.1rem; margin-bottom: 0.75rem; display: grid; grid-template-columns: 64px 1fr; gap: 1rem; align-items: start; transition: border-color 0.2s; }
        .ah-card:hover { border-color: #3a3a3a; }
        .ah-thumb { width: 64px; height: 64px; border-radius: 10px; background: #252525; border: 1px solid #2f2f2f; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #555; flex-shrink: 0; }
        .ah-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .ah-role { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #a3a3a3; margin-bottom: 3px; }
        .ah-headline { font-size: 0.95rem; font-weight: 500; color: #ececec; margin-bottom: 4px; }
        .ah-desc { font-size: 0.82rem; color: #888; line-height: 1.6; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ah-actions { display: flex; gap: 6px; }

        .ah-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 8px 15px; cursor: pointer; font-size: 0.70rem; font-family: 'Poppins', sans-serif; transition: background 0.2s, border-color 0.2s; min-height: 40px; }
        .ah-btn:hover:not(:disabled) { background: #333; border-color: #555; }
        .ah-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ah-btn.primary { background: #e6e6e6; border-color: #e6e6e6; color: #111; font-weight: 500; }
        .ah-btn.primary:hover:not(:disabled) { background: #fff; border-color: #fff; }

        .ah-add-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 10px 18px; cursor: pointer; font-size: 0.70rem; font-family: 'Poppins', sans-serif; transition: background 0.2s; white-space: nowrap; min-height: 40px; }
        .ah-add-btn:hover { background: #333; }

        .ah-loading { color: #666; font-size: 0.85rem; padding: 2rem 0; }
        .ah-empty   { color: #666; font-size: 0.85rem; padding: 2rem 0; }

        .ah-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 1rem; }
        .ah-modal { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1.5rem; width: 100%; max-width: 440px; max-height: 90vh; overflow-y: auto; }
        .ah-modal-title { font-family: 'Fraunces', serif; font-size: 1.2rem; font-weight: 500; color: #ececec; margin: 0 0 1.2rem; }

        .ah-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .ah-label { font-size: 0.75rem; font-weight: 500; color: #a3a3a3; }
        .ah-input, .ah-textarea {
          background: #1f1f1f;
          border: 1px solid #3a3a3a;
          border-radius: 8px;
          padding: 9px 12px;
          color: #ececec;
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
          box-sizing: border-box;
        }
        .ah-input:focus, .ah-textarea:focus { border-color: #666; }
        .ah-textarea { resize: vertical; min-height: 85px; }

        .ah-upload-area { border: 2px dashed #3a3a3a; border-radius: 10px; padding: 1.25rem; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: #1f1f1f; }
        .ah-upload-area:hover { border-color: #666; background: #222; }
        .ah-upload-icon { font-size: 1.5rem; margin-bottom: 6px; display: block; }
        .ah-upload-text { font-size: 0.82rem; color: #888; }
        .ah-upload-name { font-size: 0.78rem; color: #ccc; margin-top: 4px; font-weight: 500; }
        .ah-preview { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-top: 10px; display: block; border: 1px solid #3a3a3a; }

        .ah-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1.2rem; }
        .ah-btn-cancel { border: 1px solid #3a3a3a; background: transparent; color: #888; border-radius: 8px; padding: 7px 14px; font-size: 0.82rem; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
        .ah-btn-cancel:hover { background: #222; }
      `}</style>

      <section className="ah-page">
        <h1 className="ah-title">Home Section</h1>
        <div className="ah-sub">
          <span>Manage your hero / home entries</span>
          <button className="ah-add-btn" onClick={openAdd}>+ Add Entry</button>
        </div>

        {status && <div className={`ah-status ${status.type}`}>{status.msg}</div>}

        {loading ? (
          <div className="ah-loading">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="ah-empty">No entries yet. Click + Add Entry to create one.</div>
        ) : (
          entries.map((e) => (
            <div key={e._id} className="ah-card">
              <div className="ah-thumb">
                {e.image
                  ? <img src={e.image} alt="" onError={ev => ev.target.style.display = "none"} />
                  : "No img"}
              </div>
              <div>
                <div className="ah-role">{e.role}</div>
                <div className="ah-headline">{e.headline}</div>
                <div className="ah-desc">{e.description}</div>
                <div className="ah-actions">
                  <button className="ah-btn" onClick={() => openEdit(e)}>Edit</button>
                  <button className="ah-btn del" onClick={() => handleDelete(e._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

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

              <div className="ah-field">
                <label className="ah-label">
                  Image {editId && <span style={{ opacity: 0.6 }}>(choose new or keep existing)</span>}
                </label>
                <div className="ah-upload-area" onClick={() => document.getElementById("ah-file").click()}>
                  <input
                    id="ah-file"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFile}
                  />
                  <span className="ah-upload-icon">🖼</span>
                  <div className="ah-upload-text">Click to choose an image</div>
                  {imageFile && <div className="ah-upload-name">{imageFile.name}</div>}
                  {preview && <img src={preview} alt="preview" className="ah-preview" />}
                </div>
              </div>

              <div className="ah-modal-actions">
                <button type="button" className="ah-btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="ah-btn primary" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}