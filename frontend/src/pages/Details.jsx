import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import api from "../lib/api";

const API = `details`;
const emptyForm = { name: "", role: "", email: "", phone: "", location: "" };

const InfoRow = ({ icon: Icon, label, value, purple }) => (
  <div className="d-info-row">
    <div className="d-info-icon"><Icon size={14} color="#a78bfa" /></div>
    <div>
      <p className="d-info-label">{label}</p>
      <p className={`d-info-val ${purple ? "d-purple" : ""}`}>{value}</p>
    </div>
  </div>
);

const FormFields = ({ form, setForm }) => (
  <div className="d-fields">
    <div className="d-row-2">
      {["name", "role"].map((key) => (
        <div key={key} className="d-field">
          <label className="d-field-label">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            className="d-input"
            type="text"
            placeholder={key === "name" ? "John Doe" : "Developer"}
            value={form[key] || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
    </div>
    <div className="d-field">
      <label className="d-field-label">Email</label>
      <input
        className="d-input"
        type="email"
        placeholder="you@email.com"
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
    </div>
    <div className="d-row-2">
      {["phone", "location"].map((key) => (
        <div key={key} className="d-field">
          <label className="d-field-label">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
          <input
            className="d-input"
            type="text"
            placeholder={key === "phone" ? "+1 234 567 8900" : "City, Country"}
            value={form[key] || ""}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  </div>
);

export default function Details() {
  const [data,    setData]    = useState(null);
  const [form,    setForm]    = useState(emptyForm);
  const [mode,    setMode]    = useState("view");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [toast,   setToast]   = useState("");

  const ini = (n) =>
    (n || "?").trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const r = await api.get(API);
        const d = r.data;
        const actualData = Array.isArray(d) ? d[0] : d;
        setData(actualData || null);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email) return showToast("Name and email are required");
    try {
      const r = await api.post(API, form);
      setData(r.data);
      setMode("view");
      showToast("Record added successfully");
    } catch {
      setError("Failed to add record");
    }
  };

  const handleSave = async () => {
    if (!form.name) return;
    try {
      const r = await api.put(`${API}/${data._id}`, form);
      setData(r.data);
      setMode("view");
      showToast("Details updated successfully");
    } catch {
      setError("Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`${API}/${data._id}`);
      setData(null);
      setMode("view");
      showToast("Record deleted");
    } catch {
      setError("Failed to delete");
    }
  };

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="d-page">
        <div className="d-status-card">
          <div className="d-spinner" />
          <p className="d-status-text">Loading...</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="d-page">

        <div className="d-topbar">
          <span className="d-topbar-title">My Details</span>
          {!data && (
            <button
              className="d-add-btn"
              onClick={() => { setForm(emptyForm); setMode("add"); }}
            >
              <Plus size={13} /> Add Record
            </button>
          )}
        </div>

        {!data ? (
          <>
            <div className="d-empty-card">
              <div className="d-empty-icon">
                <MapPin size={20} color="#a78bfa" />
              </div>
              <p className="d-empty-title">No record found</p>
              <p className="d-empty-sub">Add your contact details to get started.</p>
              {mode !== "add" && (
                <button
                  className="d-btn-solid"
                  onClick={() => { setForm(emptyForm); setMode("add"); }}
                >
                  + Add Record
                </button>
              )}
            </div>

            {mode === "add" && (
              <div className="d-card" style={{ marginTop: 0 }}>
                <div className="d-panel">
                  <p className="d-panel-title">Add Your Details</p>
                  <FormFields form={form} setForm={setForm} />
                  <div className="d-btn-row">
                    <button className="d-btn-ghost" onClick={() => setMode("view")}>Cancel</button>
                    <button className="d-btn-solid" onClick={handleAdd}>Add Record</button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="d-card">
            <div className="d-cover" />
            <div className="d-avatar-wrap">
              <div className="d-avatar">{ini(data?.name)}</div>
            </div>

            <div className="d-body">
              <div className="d-name-row">
                <div>
                  <p className="d-name">{data?.name}</p>
                  <span className="d-badge">{data?.role}</span>
                </div>
                <div className="d-icon-btns">
                  <button
                    className="d-icon-btn d-icon-edit"
                    onClick={() => { setForm(data); setMode("edit"); }}
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="d-icon-btn d-icon-del"
                    onClick={() => setMode("delete")}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <div className="d-info-list">
                <InfoRow icon={Mail}   label="Email"    value={data?.email}    purple />
                <InfoRow icon={Phone}  label="Phone"    value={data?.phone} />
                <InfoRow icon={MapPin} label="Location" value={data?.location} />
              </div>
            </div>

            {mode === "edit" && (
              <div className="d-panel">
                <p className="d-panel-title">Edit Details</p>
                <FormFields form={form} setForm={setForm} />
                <div className="d-btn-row">
                  <button className="d-btn-ghost" onClick={() => setMode("view")}>Cancel</button>
                  <button className="d-btn-solid" onClick={handleSave}>Save Changes</button>
                </div>
              </div>
            )}

            {mode === "delete" && (
              <div className="d-panel d-del-panel">
                <p className="d-del-msg">
                  <strong>Delete this record?</strong><br />
                  This will permanently remove your contact details.
                </p>
                <div className="d-btn-row">
                  <button className="d-btn-ghost" onClick={() => setMode("view")}>Cancel</button>
                  <button className="d-btn-danger" onClick={handleDelete}>Yes, Delete</button>
                </div>
              </div>
            )}
          </div>
        )}

        {toast && <div className="d-toast">{toast}</div>}
        {error && <div className="d-toast d-toast-err">{error}</div>}
      </div>
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=Poppins:wght@400;500;600&display=swap');

  .d-page {
    min-height: 100vh;
    background: #0d0d0f;
    display: flex; flex-direction: column;
    align-items: center; padding: 2rem 1rem; gap: 1rem;
    font-family: 'Poppins', sans-serif;
  }
  .d-topbar {
    width: 100%; max-width: 480px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .d-topbar-title {
    font-family: 'Fraunces', serif;
    font-size: 1.4rem; font-weight: 500;
    color: #f0ede8; letter-spacing: -0.02em;
  }
  .d-add-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 8px; border: none;
    background: #f0c040; color: #000;
    font-size: 12px; font-weight: 600; cursor: pointer;
    transition: opacity 0.2s;
  }
  .d-add-btn:hover { opacity: 0.85; }

  /* ── Card ── */
  .d-card {
    background: #16161a;
    border: 1px solid #2a2a35;
    border-radius: 16px;
    width: 100%; max-width: 480px;
    overflow: hidden;
  }
  .d-cover {
    height: 80px;
    background: linear-gradient(135deg, #1a1a2e 0%, #2a2a35 100%);
  }
  .d-avatar-wrap { padding: 0 1.5rem; margin-top: -28px; }
  .d-avatar {
    width: 56px; height: 56px; border-radius: 50%;
    background: #f0c040; color: #000;
    font-size: 18px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border: 3px solid #16161a;
  }
  .d-body { padding: 0.75rem 1.5rem 1.25rem; }
  .d-name-row {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 1rem;
  }
  .d-name { font-size: 18px; font-weight: 600; color: #f0ede8; margin: 0 0 5px; }
  .d-badge {
    display: inline-block;
    background: rgba(240,192,64,0.12);
    color: #f0c040;
    font-size: 11px; font-weight: 500;
    padding: 2px 10px; border-radius: 20px;
    border: 1px solid rgba(240,192,64,0.25);
  }
  .d-icon-btns { display: flex; gap: 6px; margin-top: 3px; }
  .d-icon-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid #2a2a35; background: #1e1e24;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #6b6b80; transition: all 0.15s;
  }
  .d-icon-edit:hover { background: rgba(240,192,64,0.1); border-color: #f0c040; color: #f0c040; }
  .d-icon-del:hover  { background: rgba(224,92,58,0.1);  border-color: #e05c3a; color: #e05c3a; }

  /* ── Info rows ── */
  .d-info-list { display: flex; flex-direction: column; }
  .d-info-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #2a2a35;
  }
  .d-info-row:last-child { border-bottom: none; }
  .d-info-icon {
    width: 34px; height: 34px; border-radius: 8px;
    background: #1e1e24; border: 1px solid #2a2a35;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .d-info-label {
    font-size: 10px; color: #6b6b80;
    text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 2px;
  }
  .d-info-val { font-size: 13px; color: #f0ede8; font-weight: 500; margin: 0; }
  .d-purple { color: #a78bfa; }

  /* ── Panel (form / delete) ── */
  .d-panel { padding: 1.25rem 1.5rem; border-top: 1px solid #2a2a35; }
  .d-del-panel { background: rgba(224,92,58,0.05); border-color: rgba(224,92,58,0.2); }
  .d-panel-title { font-size: 13px; font-weight: 600; color: #f0ede8; margin: 0 0 1rem; }

  /* ── Form fields ── */
  .d-fields { display: flex; flex-direction: column; gap: 10px; }
  .d-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .d-field { display: flex; flex-direction: column; gap: 4px; }
  .d-field-label {
    font-size: 10px; color: #6b6b80;
    text-transform: uppercase; letter-spacing: 0.06em;
  }
  .d-input {
    padding: 8px 12px; border-radius: 8px;
    border: 1px solid #2a2a35; background: #1e1e24;
    color: #f0ede8; font-size: 13px; outline: none;
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .d-input:focus { border-color: #f0c040; box-shadow: 0 0 0 2px rgba(240,192,64,0.1); }

  /* ── Buttons ── */
  .d-btn-row { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1rem; }
  .d-btn-ghost {
    padding: 7px 16px; border-radius: 8px;
    border: 1px solid #2a2a35; background: transparent;
    color: #6b6b80; font-size: 12px; cursor: pointer;
    font-family: 'Poppins', sans-serif; transition: all 0.2s;
  }
  .d-btn-ghost:hover { border-color: #f0ede8; color: #f0ede8; }
  .d-btn-solid {
    padding: 7px 18px; border-radius: 8px; border: none;
    background: #f0c040; color: #000;
    font-size: 12px; font-weight: 600; cursor: pointer;
    font-family: 'Poppins', sans-serif; transition: opacity 0.2s;
  }
  .d-btn-solid:hover { opacity: 0.85; }
  .d-btn-danger {
    padding: 7px 18px; border-radius: 8px; border: none;
    background: #e05c3a; color: #fff;
    font-size: 12px; font-weight: 600; cursor: pointer;
    font-family: 'Poppins', sans-serif; transition: opacity 0.2s;
  }
  .d-btn-danger:hover { opacity: 0.85; }
  .d-del-msg { font-size: 13px; color: #e05c3a; line-height: 1.6; margin: 0; }

  /* ── Empty state ── */
  .d-empty-card {
    background: #16161a; border: 1px solid #2a2a35;
    border-radius: 16px; width: 100%; max-width: 480px;
    padding: 2.5rem 2rem; text-align: center;
  }
  .d-empty-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: #1e1e24; border: 1px solid #2a2a35;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;
  }
  .d-empty-title { font-size: 15px; font-weight: 600; color: #f0ede8; margin: 0 0 6px; }
  .d-empty-sub { font-size: 12px; color: #6b6b80; margin: 0 0 1.5rem; }

  /* ── Loading ── */
  .d-status-card {
    background: #16161a; border: 1px solid #2a2a35;
    border-radius: 16px; width: 100%; max-width: 480px;
    padding: 3rem 2rem; text-align: center;
  }
  .d-spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #2a2a35; border-top-color: #f0c040;
    animation: spin 0.7s linear infinite; margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .d-status-text { font-size: 13px; color: #6b6b80; }

  /* ── Toast ── */
  .d-toast {
    background: #16161a; color: #f0ede8;
    border: 1px solid #f0c040;
    font-size: 12px; padding: 8px 18px; border-radius: 8px;
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4); z-index: 1000;
  }
  .d-toast-err { border-color: #e05c3a; color: #e05c3a; }
`;