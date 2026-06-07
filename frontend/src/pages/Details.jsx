import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import api from "../lib/api"; // ✅ axios interceptor wala

const API = `details`; // ✅ baseURL interceptor mein already hai
const emptyForm = { name: "", role: "", email: "", phone: "", location: "" };

const InfoRow = ({ icon: Icon, label, value, purple }) => (
  <div className="d-info-row">
    <div className="d-info-icon"><Icon size={14} color="#534AB7" /></div>
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
            placeholder={key === "name" ? "Hamza Malik" : "Developer"}
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
            placeholder={key === "phone" ? "+92 3xx" : "City, Country"}
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

  // ✅ fetch() → api.get(), r.json() → r.data
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

  // ✅ fetch() → api.post()
  const handleAdd = async () => {
    if (!form.name || !form.email) return showToast("Name and email required");
    try {
      const r = await api.post(API, form);
      setData(r.data);
      setMode("view");
      showToast("Record added successfully");
    } catch {
      setError("Failed to add record");
    }
  };

  // ✅ fetch() → api.put()
  const handleSave = async () => {
    if (!form.name) return;
    try {
      const r = await api.put(`${API}/${data._id}`, form);
      setData(r.data);
      setMode("view");
      showToast("Details updated");
    } catch {
      setError("Failed to update");
    }
  };

  // ✅ fetch() → api.delete()
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
          <span className="d-topbar-title">My details</span>
          {!data && (
            <button
              className="d-add-btn"
              onClick={() => { setForm(emptyForm); setMode("add"); }}
            >
              <Plus size={13} /> Add record
            </button>
          )}
        </div>

        {!data ? (
          <>
            <div className="d-empty-card">
              <div className="d-empty-icon">
                <MapPin size={20} color="#888" />
              </div>
              <p className="d-empty-title">No record found</p>
              <p className="d-empty-sub">Add your contact details to get started.</p>
              {mode !== "add" && (
                <button
                  className="d-btn-solid"
                  onClick={() => { setForm(emptyForm); setMode("add"); }}
                >
                  + Add record
                </button>
              )}
            </div>

            {mode === "add" && (
              <div className="d-card" style={{ marginTop: 0 }}>
                <div className="d-panel">
                  <p className="d-panel-title">Add your details</p>
                  <FormFields form={form} setForm={setForm} />
                  <div className="d-btn-row">
                    <button className="d-btn-ghost" onClick={() => setMode("view")}>Cancel</button>
                    <button className="d-btn-solid" onClick={handleAdd}>Add record</button>
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
                <p className="d-panel-title">Edit details</p>
                <FormFields form={form} setForm={setForm} />
                <div className="d-btn-row">
                  <button className="d-btn-ghost" onClick={() => setMode("view")}>Cancel</button>
                  <button className="d-btn-solid" onClick={handleSave}>Save changes</button>
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
                  <button className="d-btn-danger" onClick={handleDelete}>Yes, delete</button>
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
  .d-page {
    min-height: 100vh; background: var(--bg);
    display: flex; flex-direction: column;
    align-items: center; padding: 2rem 1rem; gap: 1rem;
    transition: background 0.3s ease;
  }
  .d-topbar {
    width: 100%; max-width: 440px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .d-topbar-title { font-size: 15px; font-weight: 600; color: var(--text-h); }
  .d-add-btn {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px; border: none;
    background: #534AB7; color: #fff; font-size: 12px; font-weight: 500; cursor: pointer;
    transition: background 0.2s;
  }
  .d-add-btn:hover { background: #3C3489; }
  .d-card {
    background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border);
    width: 100%; max-width: 440px; overflow: hidden;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }
  .d-cover { height: 72px; background: #EEEDFE; }
  html.dark-mode .d-cover { background: #1a1a2e; }
  .d-avatar-wrap { padding: 0 1.5rem; margin-top: -26px; }
  .d-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: #534AB7; color: #fff; font-size: 17px; font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    border: 3px solid var(--card-bg);
    transition: border-color 0.3s;
  }
  .d-body { padding: 0.75rem 1.5rem 1.25rem; }
  .d-name-row {
    display: flex; align-items: flex-start;
    justify-content: space-between; margin-bottom: 1rem;
  }
  .d-name { font-size: 17px; font-weight: 600; color: var(--text-h); margin: 0 0 5px; }
  .d-badge {
    display: inline-block; background: #EEEDFE; color: #3C3489;
    font-size: 11px; font-weight: 500; padding: 2px 9px; border-radius: 20px;
  }
  html.dark-mode .d-badge { background: #1a1a2e; color: #AFA9EC; }
  .d-icon-btns { display: flex; gap: 5px; margin-top: 3px; }
  .d-icon-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--card-bg);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #888; transition: all 0.15s;
  }
  .d-icon-edit:hover { background: #EEEDFE; border-color: #AFA9EC; color: #534AB7; }
  .d-icon-del:hover  { background: #FCEBEB; border-color: #F09595; color: #A32D2D; }
  .d-info-list { display: flex; flex-direction: column; }
  .d-info-row {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 0; border-bottom: 1px solid var(--border);
  }
  .d-info-row:last-child { border-bottom: none; }
  .d-info-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--bg); display: flex; align-items: center;
    justify-content: center; flex-shrink: 0;
    transition: background 0.3s;
  }
  .d-info-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1px; }
  .d-info-val { font-size: 13px; color: var(--text-h); font-weight: 500; margin: 0; transition: color 0.3s; }
  .d-purple { color: #534AB7; }
  html.dark-mode .d-purple { color: #AFA9EC; }
  .d-panel { padding: 1.1rem 1.5rem 1.25rem; border-top: 1px solid var(--border); }
  .d-del-panel { background: #FCEBEB; }
  html.dark-mode .d-del-panel { background: #2D1A1A; border-color: #4D2A2A; }
  .d-panel-title { font-size: 13px; font-weight: 600; color: var(--text-h); margin: 0 0 0.9rem; }
  .d-fields { display: flex; flex-direction: column; gap: 9px; }
  .d-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
  .d-field { display: flex; flex-direction: column; gap: 3px; }
  .d-field-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.05em; }
  .d-input {
    padding: 7px 10px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg);
    color: var(--text-h); font-size: 13px; outline: none; width: 100%;
    transition: all 0.15s;
  }
  .d-input:focus { border-color: #534AB7; box-shadow: 0 0 0 2px rgba(83,74,183,0.1); }
  .d-btn-row { display: flex; gap: 7px; justify-content: flex-end; margin-top: 1rem; }
  .d-btn-ghost {
    padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border);
    background: var(--card-bg); color: var(--text); font-size: 12px; cursor: pointer;
    transition: all 0.2s;
  }
  .d-btn-ghost:hover { background: var(--border); }
  .d-btn-solid {
    padding: 6px 16px; border-radius: 8px; border: none;
    background: #534AB7; color: #fff; font-size: 12px; font-weight: 500; cursor: pointer;
    transition: background 0.2s;
  }
  .d-btn-solid:hover { background: #3C3489; }
  .d-btn-danger {
    padding: 6px 16px; border-radius: 8px; border: none;
    background: #A32D2D; color: #fff; font-size: 12px; font-weight: 500; cursor: pointer;
    transition: background 0.2s;
  }
  .d-btn-danger:hover { background: #791F1F; }
  .d-del-msg { font-size: 13px; color: #A32D2D; line-height: 1.5; margin: 0; }
  html.dark-mode .d-del-msg { color: #EEAFAF; }
  .d-empty-card {
    background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border);
    width: 100%; max-width: 440px; padding: 2.5rem 2rem; text-align: center;
    box-shadow: var(--shadow); transition: all 0.3s ease;
  }
  .d-empty-icon {
    width: 44px; height: 44px; border-radius: 50%; background: var(--bg);
    display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem;
  }
  .d-empty-title { font-size: 15px; font-weight: 600; color: var(--text-h); margin: 0 0 4px; }
  .d-empty-sub { font-size: 12px; color: #999; margin: 0 0 1.25rem; }
  .d-status-card {
    background: var(--card-bg); border-radius: 16px; border: 1px solid var(--border);
    width: 100%; max-width: 440px; padding: 3rem 2rem; text-align: center;
  }
  .d-spinner {
    width: 26px; height: 26px; border-radius: 50%;
    border: 2px solid var(--border); border-top-color: #534AB7;
    animation: spin 0.7s linear infinite; margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .d-status-text { font-size: 13px; color: #999; }
  .d-toast {
    background: #2C2C2A; color: #F1EFE8;
    font-size: 12px; padding: 7px 16px; border-radius: 8px;
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
    box-shadow: 0 8px 24px rgba(0,0,0,0.25); z-index: 1000;
  }
  .d-toast-err { background: #A32D2D; color: #fff; }
`;