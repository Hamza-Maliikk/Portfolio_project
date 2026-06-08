import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import api from "../lib/api";

const API = `details`;
const emptyForm = { name: "", role: "", email: "", phone: "", location: "" };

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="d-info-row">
    <div className="d-info-icon"><Icon size={14} color="#e5e5e5" /></div>
    <div>
      <p className="d-info-label">{label}</p>
      <p className="d-info-val">{value}</p>
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
                <MapPin size={20} color="#e5e5e5" />
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
                <InfoRow icon={Mail}   label="Email"    value={data?.email} />
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
    background: #09090c;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.5rem 1rem 3rem;
    gap: 1rem;
    font-family: 'Poppins', sans-serif;
    color: #ececec;
  }
  .d-topbar {
    width: 100%;
    max-width: 950px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .d-topbar-title {
    font-family: 'Fraunces', serif;
    font-size: clamp(1.7rem, 2vw, 2.2rem);
    margin: 0;
    color: #ececec;
  }
  .d-add-btn {
    border: 1px solid #444;
    background: #262626;
    color: #eee;
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .d-add-btn:hover {
    background: #333;
    border-color: #555;
  }

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
    background: #ececec; color: #111;
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
    background: rgba(255,255,255,0.08);
    color: #ececec;
    font-size: 11px; font-weight: 500;
    padding: 4px 12px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12);
  }
  .d-icon-btns { display: flex; gap: 8px; margin-top: 4px; }
  .d-icon-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1px solid #2f2f2f; background: #1f1f23;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #a3a3a3; transition: background 0.2s, border-color 0.2s, color 0.2s;
  }
  .d-icon-edit:hover { background: rgba(255,255,255,0.08); border-color: #ececec; color: #ececec; }
  .d-icon-del:hover { background: rgba(239,68,68,0.12); border-color: #ef4444; color: #ef4444; }

  /* ── Info rows ── */
  .d-info-list { display: flex; flex-direction: column; gap: 0.8rem; }
  .d-info-row {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 0; border-bottom: 1px solid #2f2f2f;
  }
  .d-info-row:last-child { border-bottom: none; }
  .d-info-icon {
    width: 38px; height: 38px; border-radius: 12px;
    background: #1f1f23; border: 1px solid #2f2f2f;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .d-info-label {
    font-size: 0.72rem; color: #8b8b8b;
    text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 2px;
  }
  .d-info-val { font-size: 0.95rem; color: #ececec; font-weight: 500; margin: 0; }
  .d-purple { color: #ececec; }

  /* ── Panel (form / delete) ── */
  .d-panel { padding: 1.35rem 1.5rem; border-top: 1px solid #2f2f2f; }
  .d-del-panel { background: rgba(239,68,68,0.06); border-color: rgba(239,68,68,0.18); }
  .d-panel-title { font-size: 0.95rem; font-weight: 600; color: #ececec; margin: 0 0 1rem; }

  /* ── Form fields ── */
  .d-fields { display: flex; flex-direction: column; gap: 1rem; }
  .d-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .d-field { display: flex; flex-direction: column; gap: 0.4rem; }
  .d-field-label {
    font-size: 0.75rem; color: #8b8b8b;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .d-input {
    padding: 0.95rem 1rem; border-radius: 10px;
    border: 1px solid #333; background: #1f1f23;
    color: #ececec; font-size: 0.95rem; outline: none;
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .d-input:focus {
    border-color: #bdbdbd;
    box-shadow: 0 0 0 2px rgba(255,255,255,0.12);
  }

  /* ── Buttons ── */
  .d-btn-row { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.25rem; flex-wrap: wrap; }
  .d-btn-ghost,
  .d-add-btn {
    border: 1px solid #444;
    background: #262626;
    color: #eee;
    border-radius: 10px;
    padding: 10px 16px;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .d-btn-ghost:hover,
  .d-add-btn:hover {
    background: #333;
    border-color: #555;
  }
  .d-btn-solid {
    padding: 10px 18px; border-radius: 10px; border: none;
    background: #ececec; color: #111;
    font-size: 0.88rem; font-weight: 600; cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
  }
  .d-btn-solid:hover { background: #ffffff; }
  .d-btn-danger {
    padding: 10px 18px; border-radius: 10px; border: none;
    background: #ef4444; color: #fff;
    font-size: 0.88rem; font-weight: 600; cursor: pointer;
    transition: opacity 0.2s;
  }
  .d-btn-danger:hover { opacity: 0.9; }
  .d-del-msg { font-size: 0.95rem; color: #fbcaca; line-height: 1.6; margin: 0; }

  /* ── Empty state ── */
  .d-empty-card {
    padding: 2.5rem 2rem;
    text-align: center;
  }
  .d-empty-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: #1f1f23; border: 1px solid #2f2f2f;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;
  }
  .d-empty-title { font-size: 1rem; font-weight: 600; color: #ececec; margin: 0 0 8px; }
  .d-empty-sub { font-size: 0.95rem; color: #8b8b8b; margin: 0 0 1.5rem; }

  /* ── Loading ── */
  .d-status-card { padding: 3rem 2rem; text-align: center; }
  .d-spinner {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #2f2f2f; border-top-color: #ececec;
    animation: spin 0.7s linear infinite; margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .d-status-text { font-size: 0.92rem; color: #8b8b8b; }

  /* ── Toast ── */
  .d-toast {
    background: #181818; color: #ececec;
    border: 1px solid #ececec;
    font-size: 0.88rem; padding: 10px 18px; border-radius: 10px;
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    box-shadow: 0 16px 40px rgba(0,0,0,0.35); z-index: 1000;
  }
  .d-toast-err { border-color: #ef4444; color: #ef4444; }
`;