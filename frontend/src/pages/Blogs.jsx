import { useState, useEffect } from "react";
import api from "../lib/api";

const BASE = `blogs`;

const Blog = () => {
  const canCrud = Boolean(localStorage.getItem("token"));
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", tags: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res     = await api.get(BASE);
      const payload = res.data;

      const blogsList = Array.isArray(payload) ? payload : payload?.blogs || [];
      const categoryList = Array.isArray(payload?.categories)
        ? payload.categories
        : [...new Set(blogsList.map((b) => b.category).filter(Boolean))];

      const dedupedCategories = [
        ...new Map(
          categoryList
            .map((cat) => String(cat || "").trim())
            .filter(Boolean)
            .map((cat) => [cat.toLowerCase(), cat]),
        ).values(),
      ];

      setBlogs(blogsList);
      setCategories(dedupedCategories);
      setForm((prev) => {
        if (!prev.category && dedupedCategories.length) {
          return { ...prev, category: dedupedCategories[0] };
        }
        return prev;
      });
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
      setCategories([]);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.content) return alert("Title and Content are required!"); // ✅

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("tags", form.tags || "");
    formData.append("category", form.category || "");
    if (file) formData.append("image", file);

    try {
      if (editId) {
        if (file) {
          await api.put(`${BASE}/${editId}`, formData);
        } else {
          await api.put(`${BASE}/${editId}`, {
            title: form.title,
            content: form.content,
            tags: form.tags,
            category: form.category,
          });
        }
        setEditId(null);
      } else {
        await api.post(BASE, formData);
      }

      setForm({ title: "", content: "", tags: "", category: "" });
      setFile(null);
      setCurrentImage("");
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, content: blog.content, tags: blog.tags, category: blog.category });
    setEditId(blog._id);
    setCurrentImage(blog.image || "");
    setFile(null);
    setSelected(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return; // ✅
    await api.delete(`${BASE}/${id}`);
    fetchData();
  };

  const filteredBlogs = activeCategory === "All"
    ? blogs
    : blogs.filter((b) => b.category === activeCategory);

  if (selected) {
    return (
      <div className="blog-shell" style={{ padding: "0", maxWidth: "800px", margin: "0 auto" }}>
        <button onClick={() => setSelected(null)} style={backBtn}>← Back</button>
        <div style={{ marginTop: "20px" }}>
          <span style={{ ...categoryBadge, backgroundColor: getCategoryColor(selected.category) }}>
            {selected.category}
          </span>
          <h1 style={{ marginTop: "12px", fontSize: "28px" }}>{selected.title}</h1>
          {selected.image && (
            <img
              src={selected.image}
              alt="blog"
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "10px", marginTop: "10px", marginBottom: "20px" }}
            />
          )}
          <div style={{ display: "flex", gap: "16px", color: "#888", fontSize: "13px", marginBottom: "24px" }}>
            <span>📅 {new Date(selected.createdAt).toDateString()}</span>
            <span>🏷️ {selected.tags}</span>
          </div>
          <div style={{ lineHeight: "1.9", color: "#333", fontSize: "16px", whiteSpace: "pre-wrap" }}>
            {selected.content}
          </div>
          {canCrud && (
            <div style={{ display: "flex", gap: "8px", marginTop: "30px" }}>
              <button onClick={() => handleEdit(selected)} style={editBtn}>✏️ Edit</button>
              <button onClick={() => { handleDelete(selected._id); setSelected(null); }} style={deleteBtn}>🗑️ Delete</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="blog-shell" style={{ padding: "0", maxWidth: "900px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ fontFamily: "'Poppins', sans-serif", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px" }}>📝 Blog Posts</h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>{blogs.length} posts total</p>
        </div>
        {canCrud && (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditId(null);
              setCurrentImage("");
              setFile(null);
              setForm({ title: "", content: "", tags: "", category: categories[0] || "" });
            }}
            style={btnStyle}
          >
            {showForm ? "✕ Cancel" : "+ New Post"}
          </button>
        )}
      </div>

      {/* Form */}
      {canCrud && showForm && (
        <div className="text-black" style={formCard}>
          <h3 style={{ margin: "0 0 16px" }}>
            {editId ? " Edit Post" : "Write a New Post"} 
          </h3>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ ...inputStyle, marginBottom: "10px" }}
          />
          <textarea
            placeholder="Write your content here..." 
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={6}
            style={{ ...inputStyle, resize: "vertical", marginBottom: "10px" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ marginBottom: "10px" }}
          />
          {editId && currentImage && !file && (
            <div style={{ marginBottom: "10px" }}>
              <small style={{ color: "#777", display: "block", marginBottom: "6px" }}>Current image</small>
              <img src={currentImage} alt="current blog" style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "10px", border: "1px solid #eee" }} />
            </div>
          )}
          {file && <small style={{ color: "#555", display: "block", marginBottom: "10px" }}>New image selected: {file.name}</small>}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <input
              placeholder="Tags (e.g. react, hooks)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ ...inputStyle, width: "160px" }}
            >
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button onClick={handleSubmit} style={publishBtn}>
            {editId ? "Update Post" : "Publish"}
          </button>
        </div>
      )}

      {/* Category Filter */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "6px 16px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "13px",
              backgroundColor: activeCategory === cat ? "#1a1a1a" : "#f0f0f0",
              color: activeCategory === cat ? "white" : "#555",
              fontWeight: activeCategory === cat ? "bold" : "normal",
            }}
          >
            {cat}
            {cat !== "All" && (
              <span style={{ marginLeft: "6px", opacity: 0.7 }}>
                ({blogs.filter((b) => b.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredBlogs.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>
          <p style={{ fontSize: "40px" }}>✍️</p>
          <p>No posts in this category yet — write the first one!</p> 
        </div>
      )}

      {/* Blog Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {filteredBlogs.map((blog) => (
          <div key={blog._id} style={cardStyle}>
            {blog.image && (
              <img src={blog.image} alt="blog" style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "10px", marginBottom: "10px" }} />
            )}
            <div onClick={() => setSelected(blog)} style={{ cursor: "pointer" }}>
              <span style={{ ...categoryBadge, backgroundColor: getCategoryColor(blog.category) }}>{blog.category}</span>
              <h3 style={{ margin: "10px 0 6px", fontSize: "16px" }}>{blog.title}</h3>
              <p style={{ color: "#666", fontSize: "13px", margin: "0 0 12px", lineHeight: "1.5" }}>
                {blog.content.substring(0, 80)}...
              </p>
              <small style={{ color: "#aaa", fontSize: "12px" }}>📅 {new Date(blog.createdAt).toDateString()}</small>
              {blog.tags && (
                <div style={{ marginTop: "8px" }}>
                  {blog.tags.split(",").map((tag, i) => (
                    <span key={i} style={tagBadge}>#{tag.trim()}</span>
                  ))}
                </div>
              )}
            </div>
            {canCrud && (
              <div style={{ display: "flex", gap: "6px", marginTop: "12px", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
                <button onClick={() => handleEdit(blog)} style={editBtn}>✏️ Edit</button>
                <button onClick={() => handleDelete(blog._id)} style={deleteBtn}>🗑️ Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const getCategoryColor = (cat) => {
  const colors = { React: "#61dafb33", "Node.js": "#68a06333", MongoDB: "#4db33d33", JavaScript: "#f7df1e33", CSS: "#264de433", Other: "#88888833" };
  return colors[cat] || "#88888833";
};

const inputStyle = { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", width: "100%", boxSizing: "border-box" };
const btnStyle = { padding: "10px 20px", backgroundColor: "#1a1a1a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px" };
const publishBtn = { padding: "10px 24px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", width: "100%" };
const editBtn = { padding: "5px 12px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" };
const deleteBtn = { padding: "5px 12px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" };
const backBtn = { padding: "8px 16px", backgroundColor: "#555", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" };
const formCard = { backgroundColor: "white", padding: "24px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" };
const cardStyle = { backgroundColor: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", flexDirection: "column", justifyContent: "space-between" };
const categoryBadge = { display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" };
const tagBadge = { display: "inline-block", padding: "2px 8px", backgroundColor: "#f0f0f0", borderRadius: "4px", fontSize: "11px", marginRight: "4px", color: "#555" };

export default Blog;