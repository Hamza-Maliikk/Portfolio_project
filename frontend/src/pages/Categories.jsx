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

  useEffect(() => {
    fetchCategories();
  }, []);

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

  // Single Category View
  if (selected) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap');
          .cat-shell { font-family: 'DM Mono', monospace; color: #1a1a1a; }
          .cat-shell h1, .cat-shell h2 { font-family: 'Fraunces', serif; letter-spacing: -0.02em; }
        `}</style>
        <div className="cat-shell" style={{ padding: "0", maxWidth: "800px", margin: "0 auto" }}>
          <button onClick={() => setSelected(null)} style={backBtn}>← Back</button>
          <div style={{ marginTop: "20px" }}>
            <h1 style={{ marginTop: "12px", fontSize: "28px" }}>{selected.category}</h1>
            <div style={{ color: "#888", fontSize: "13px", marginBottom: "24px" }}>
              <span>📅 {new Date(selected.createdAt).toDateString()}</span>
            </div>
            <div style={{ lineHeight: "1.9", color: "#333", fontSize: "16px" }}>
              {selected.description || "No description available."}
            </div>
            {canCrud && (
              <div style={{ display: "flex", gap: "8px", marginTop: "30px" }}>
                <button onClick={() => handleEdit(selected)} style={editBtn}>✏️ Edit</button>
                <button onClick={() => { handleDelete(selected._id); setSelected(null); }} style={deleteBtn}>
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap');
        .cat-shell { font-family: 'DM Mono', monospace; color: #1a1a1a; }
        .cat-shell h2 { font-family: 'Fraunces', serif; letter-spacing: -0.02em; }
        .cat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important; transform: translateY(-1px); transition: all 0.2s; }
      `}</style>
      <div className="cat-shell" style={{ padding: "0", maxWidth: "900px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "24px" }}>🗂️ Categories</h2>
            <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>
              {categories.length} categories total
            </p>
          </div>
          {canCrud && (
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setForm({ category: "", description: "" });
              }}
              style={btnStyle}
            >
              {showForm ? "✕ Cancel" : "+ New Category"}
            </button>
          )}
        </div>

        {/* Form */}
        {canCrud && showForm && (
          <div style={formCard}>
            <h3 style={{ margin: "0 0 16px", fontFamily: "'Fraunces', serif" }}>
              {editId ? "✏️ Edit Category" : "🚀 Create New Category"}
            </h3>
            <input
              placeholder="Category Name"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ ...inputStyle, marginBottom: "10px" }}
            />
            <textarea
              placeholder="Write a description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              style={{ ...inputStyle, resize: "vertical", marginBottom: "10px" }}
            />
            <button onClick={handleSubmit} style={publishBtn}>
              {editId ? "✏️ Update Category" : "🚀 Save"}
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
            <p>Loading...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
            <p>No categories yet — create your first one!</p>
          </div>
        )}

        {/* Category Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {categories.map((cat) => (
            <div key={cat._id} className="cat-card" style={cardStyle}>
              <div onClick={() => setSelected(cat)} style={{ cursor: "pointer" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontFamily: "'Fraunces', serif" }}>
                  {cat.category}
                </h3>
                <p style={{ margin: "0 0 8px", color: "#888", fontSize: "12px" }}>
                  {cat.blogCount || 0} {(cat.blogCount || 0) === 1 ? "blog" : "blogs"}
                </p>
                <p style={{ color: "#666", fontSize: "13px", margin: "0 0 12px", lineHeight: "1.5" }}>
                  {cat.description
                    ? cat.description.substring(0, 80) + (cat.description.length > 80 ? "..." : "")
                    : "No description available."}
                </p>
                <small style={{ color: "#aaa", fontSize: "12px" }}>
                  📅 {new Date(cat.createdAt).toDateString()}
                </small>
              </div>
              {canCrud && (
                <div style={{ display: "flex", gap: "6px", marginTop: "12px", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
                  <button onClick={() => handleEdit(cat)} style={editBtn}>✏️ Edit</button>
                  <button onClick={() => handleDelete(cat._id)} style={deleteBtn}>🗑️ Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", width: "100%", boxSizing: "border-box", fontFamily: "'DM Mono', monospace" };
const btnStyle = { padding: "10px 20px", backgroundColor: "#1a1a1a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontFamily: "'DM Mono', monospace" };
const publishBtn = { padding: "10px 24px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", width: "100%", fontFamily: "'DM Mono', monospace" };
const editBtn = { padding: "5px 12px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Mono', monospace" };
const deleteBtn = { padding: "5px 12px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontFamily: "'DM Mono', monospace" };
const backBtn = { padding: "8px 16px", backgroundColor: "#555", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontFamily: "'DM Mono', monospace" };
const formCard = { backgroundColor: "white", padding: "24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" };
const cardStyle = { backgroundColor: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", justifyContent: "space-between" };

export default Categories;