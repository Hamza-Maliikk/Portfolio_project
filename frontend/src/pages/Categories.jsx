import { useState, useEffect } from "react";
import api from "../lib/api";

const BASE = `categories`;

const Categories = () => {
  const canCrud = Boolean(localStorage.getItem("token"));
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get(BASE);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.category) return alert("Category name is required!");
    try {
      if (editId) {
        await api.put(`${BASE}/${editId}`, form);
        setEditId(null);
      } else {
        await api.post(BASE, form);
      }
      setForm({ category: "", description: "" });
      setShowForm(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Please fill all fields!");
    }
  };

  const handleEdit = (cat) => {
    setForm({ category: cat.category, description: cat.description });
    setEditId(cat._id);
    setSelected(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    try {
      await api.delete(`${BASE}/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Failed to delete!");
    }
  };

  // ── Single Category View ──
  if (selected) {
    return (
      <>
        <style>{styles}</style>
        <section className="cat-page">
          <button className="cat-back-btn" onClick={() => setSelected(null)}>← Back</button>
          <h1 className="cat-detail-title">{selected.category}</h1>
          <p className="cat-detail-date">📅 {new Date(selected.createdAt).toDateString()}</p>
          <p className="cat-detail-desc">{selected.description || "No description available."}</p>
          {canCrud && (
            <div className="cat-actions">
              <button className="cat-btn" onClick={() => handleEdit(selected)}>Edit</button>
              <button className="cat-btn del" onClick={() => { handleDelete(selected._id); setSelected(null); }}>Delete</button>
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <section className="cat-page">

        <h1 className="cat-title">Categories</h1>
        <div className="cat-sub">
          <span>{categories.length} categories total</span>
          {canCrud && (
            <button
              className="cat-add-btn"
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setForm({ category: "", description: "" });
              }}
            >
              {showForm ? "✕ Cancel" : "+ New Category"}
            </button>
          )}
        </div>

        {canCrud && showForm && (
          <div className="cat-form-card">
            <h2 className="cat-form-title">{editId ? "Edit Category" : "Create New Category"}</h2>
            <div className="cat-field">
              <label className="cat-label">Category Name</label>
              <input
                className="cat-input"
                placeholder="e.g. Technology"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="cat-field">
              <label className="cat-label">Description</label>
              <textarea
                className="cat-textarea"
                placeholder="Write a description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="cat-form-actions">
              <button className="cat-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="cat-btn primary" onClick={handleSubmit}>
                {editId ? "Update Category" : "Save"}
              </button>
            </div>
          </div>
        )}

        {loading && <div className="cat-loading">Loading...</div>}

        {!loading && categories.length === 0 && (
          <div className="cat-empty">No categories yet — create your first one!</div>
        )}

        <div className="cat-grid">
          {categories.map((cat) => (
            <div key={cat._id} className="cat-card">
              <div onClick={() => setSelected(cat)} style={{ cursor: "pointer", flex: 1 }}>
                <h3 className="cat-card-title">{cat.category}</h3>
                <p className="cat-card-count">{cat.blogCount || 0} {(cat.blogCount || 0) === 1 ? "blog" : "blogs"}</p>
                <p className="cat-card-desc">
                  {cat.description
                    ? cat.description.substring(0, 80) + (cat.description.length > 80 ? "..." : "")
                    : "No description available."}
                </p>
                <small className="cat-card-date">📅 {new Date(cat.createdAt).toDateString()}</small>
              </div>
              {canCrud && (
                <div className="cat-card-footer">
                  <button className="cat-btn" onClick={() => handleEdit(cat)}>Edit</button>
                  <button className="cat-btn del" onClick={() => handleDelete(cat._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>

      </section>
    </>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&family=Poppins:wght@400;500;600&display=swap');
  .cat-page { max-width: 950px; margin: 0 auto; color: #ececec; font-family: 'Poppins', sans-serif; }
  .cat-title { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
  .cat-sub { color: #a3a3a3; margin-bottom: 1.2rem; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }

  .cat-add-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-size: 0.82rem; font-family: 'Poppins', sans-serif; transition: background 0.2s; white-space: nowrap; }
  .cat-add-btn:hover { background: #333; }

  .cat-form-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1.25rem 1.1rem; margin-bottom: 1.2rem; }
  .cat-form-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 500; color: #ececec; margin: 0 0 1rem; }
  .cat-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .cat-label { font-size: 0.75rem; font-weight: 500; color: #a3a3a3; }
  .cat-input, .cat-textarea { background: #1f1f1f; border: 1px solid #3a3a3a; border-radius: 8px; padding: 9px 12px; color: #ececec; font-family: 'Poppins', sans-serif; font-size: 0.875rem; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
  .cat-input:focus, .cat-textarea:focus { border-color: #666; }
  .cat-textarea { resize: vertical; min-height: 90px; }
  .cat-form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1rem; }
  .cat-btn-cancel { border: 1px solid #3a3a3a; background: transparent; color: #888; border-radius: 8px; padding: 7px 14px; font-size: 0.82rem; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
  .cat-btn-cancel:hover { background: #222; }

  .cat-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 12px; font-family: 'Poppins', sans-serif; transition: background 0.2s, border-color 0.2s; }
  .cat-btn:hover { background: #333; border-color: #555; }
  .cat-btn.primary { background: #e6e6e6; border-color: #e6e6e6; color: #111; font-weight: 500; padding: 7px 16px; font-size: 0.82rem; }
  .cat-btn.primary:hover { background: #fff; border-color: #fff; }
  .cat-btn.del:hover { background: rgba(239,68,68,0.1); border-color: #ef4444; color: #ef4444; }

  .cat-loading { color: #666; font-size: 0.85rem; padding: 2rem 0; text-align: center; }
  .cat-empty   { color: #666; font-size: 0.85rem; padding: 3rem 0; text-align: center; }

  .cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .cat-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1rem 1.1rem; display: flex; flex-direction: column; justify-content: space-between; transition: border-color 0.2s; }
  .cat-card:hover { border-color: #3a3a3a; }
  .cat-card-title { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 500; color: #ececec; margin: 0 0 4px; }
  .cat-card-count { font-size: 0.75rem; color: #666; margin: 0 0 6px; }
  .cat-card-desc  { font-size: 0.82rem; color: #888; line-height: 1.6; margin: 0 0 8px; }
  .cat-card-date  { font-size: 0.75rem; color: #555; }
  .cat-card-footer { display: flex; gap: 6px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #2f2f2f; }

  .cat-detail-title { font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 500; color: #ececec; margin: 16px 0 6px; letter-spacing: -0.02em; }
  .cat-detail-date  { font-size: 0.8rem; color: #666; margin: 0 0 20px; }
  .cat-detail-desc  { font-size: 0.92rem; color: #aaa; line-height: 1.9; margin: 0 0 24px; }
  .cat-actions { display: flex; gap: 8px; }
  .cat-back-btn { border: 1px solid #3a3a3a; background: #262626; color: #aaa; border-radius: 8px; padding: 7px 14px; font-size: 0.82rem; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
  .cat-back-btn:hover { background: #333; color: #eee; }

  @media (max-width: 600px) { .cat-grid { grid-template-columns: 1fr; } }
`;

export default Categories;