import { useState, useEffect } from "react";
import api from "../lib/api";

const BASE = `blogs`;

const Blog = () => {
  const canCrud = Boolean(localStorage.getItem("token"));
  const [blogs, setBlogs]               = useState([]);
  const [form, setForm]                 = useState({ title: "", content: "", tags: "", category: "" });
  const [editId, setEditId]             = useState(null);
  const [selected, setSelected]         = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm]         = useState(false);
  const [categories, setCategories]     = useState([]);
  const [file, setFile]                 = useState(null);
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
    if (!form.title || !form.content) return alert("Title and Content are required!");

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
            title: form.title, content: form.content,
            tags: form.tags,   category: form.category,
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
    if (!window.confirm("Are you sure you want to delete this?")) return;
    await api.delete(`${BASE}/${id}`);
    fetchData();
  };

  const filteredBlogs = activeCategory === "All"
    ? blogs
    : blogs.filter((b) => b.category === activeCategory);

  // ── Detail View ──
  if (selected) {
    return (
      <>
        <style>{styles}</style>
        <section className="bl-page">
          <button className="bl-back-btn" onClick={() => setSelected(null)}>← Back</button>
          {selected.category && (
            <span className="bl-cat-badge">{selected.category}</span>
          )}
          <h1 className="bl-detail-title">{selected.title}</h1>
          {selected.image && (
            <img src={selected.image} alt="blog" className="bl-detail-img" />
          )}
          <div className="bl-detail-meta">
            <span>📅 {new Date(selected.createdAt).toDateString()}</span>
            {selected.tags && <span>🏷️ {selected.tags}</span>}
          </div>
          <p className="bl-detail-content">{selected.content}</p>
          {canCrud && (
            <div className="bl-actions">
              <button className="bl-btn" onClick={() => handleEdit(selected)}>Edit</button>
              <button className="bl-btn del" onClick={() => { handleDelete(selected._id); setSelected(null); }}>Delete</button>
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <section className="bl-page">

        <h1 className="bl-title">Blog Posts</h1>
        <div className="bl-sub">
          <span>{blogs.length} posts total</span>
          {canCrud && (
            <button
              className="bl-add-btn"
              onClick={() => {
                setShowForm(!showForm);
                setEditId(null);
                setCurrentImage("");
                setFile(null);
                setForm({ title: "", content: "", tags: "", category: categories[0] || "" });
              }}
            >
              {showForm ? "✕ Cancel" : "+ New Post"}
            </button>
          )}
        </div>

        {/* Form */}
        {canCrud && showForm && (
          <div className="bl-form-card">
            <h2 className="bl-form-title">{editId ? "Edit Post" : "Write a New Post"}</h2>

            <div className="bl-field">
              <label className="bl-label">Title</label>
              <input className="bl-input" placeholder="Post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="bl-field">
              <label className="bl-label">Content</label>
              <textarea className="bl-textarea" placeholder="Write your content here..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} />
            </div>

            <div className="bl-field">
              <label className="bl-label">
                Image {editId && <span style={{ opacity: 0.6 }}>(choose new or keep existing)</span>}
              </label>
              <div className="bl-upload-area" onClick={() => document.getElementById("bl-file-input").click()}>
                <input id="bl-file-input" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />
                <span className="bl-upload-icon">🖼</span>
                <div className="bl-upload-text">Click to choose an image</div>
                {file && <div className="bl-upload-name">{file.name}</div>}
              </div>
              {editId && currentImage && !file && (
                <img src={currentImage} alt="current" className="bl-current-img" />
              )}
            </div>

            <div className="bl-field-row">
              <div className="bl-field" style={{ flex: 1 }}>
                <label className="bl-label">Tags</label>
                <input className="bl-input" placeholder="e.g. react, hooks" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="bl-field" style={{ width: "160px" }}>
                <label className="bl-label">Category</label>
                <select className="bl-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            <div className="bl-form-actions">
              <button className="bl-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="bl-btn primary" onClick={handleSubmit}>
                {editId ? "Update Post" : "Publish"}
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bl-filter-row">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              className={`bl-filter-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {cat !== "All" && (
                <span className="bl-filter-count">
                  {blogs.filter((b) => b.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty */}
        {filteredBlogs.length === 0 && (
          <div className="bl-empty">
            <p>No posts in this category yet — write the first one!</p>
          </div>
        )}

        {/* Cards */}
        <div className="bl-grid">
          {filteredBlogs.map((blog) => (
            <div key={blog._id} className="bl-card">
              {blog.image && (
                <img src={blog.image} alt="blog" className="bl-card-img" />
              )}
              <div onClick={() => setSelected(blog)} style={{ cursor: "pointer", flex: 1 }}>
                {blog.category && <span className="bl-cat-badge">{blog.category}</span>}
                <h3 className="bl-card-title">{blog.title}</h3>
                <p className="bl-card-excerpt">{blog.content.substring(0, 80)}...</p>
                <small className="bl-card-date">📅 {new Date(blog.createdAt).toDateString()}</small>
                {blog.tags && (
                  <div className="bl-tags">
                    {blog.tags.split(",").map((tag, i) => (
                      <span key={i} className="bl-tag">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
              {canCrud && (
                <div className="bl-card-footer">
                  <button className="bl-btn" onClick={() => handleEdit(blog)}>Edit</button>
                  <button className="bl-btn del" onClick={() => handleDelete(blog._id)}>Delete</button>
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
  .bl-page { max-width: 950px; margin: 0 auto; color: #ececec; font-family: 'Poppins', sans-serif; }
  .bl-title { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
  .bl-sub { color: #a3a3a3; margin-bottom: 1.2rem; font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; }

  .bl-add-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 6px 14px; cursor: pointer; font-size: 0.82rem; font-family: 'Poppins', sans-serif; transition: background 0.2s; white-space: nowrap; }
  .bl-add-btn:hover { background: #333; }

  .bl-form-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1.25rem 1.1rem; margin-bottom: 1.2rem; }
  .bl-form-title { font-family: 'Fraunces', serif; font-size: 1.1rem; font-weight: 500; color: #ececec; margin: 0 0 1rem; }
  .bl-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
  .bl-field-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .bl-label { font-size: 0.75rem; font-weight: 500; color: #a3a3a3; }
  .bl-input, .bl-textarea {
    background: #1f1f1f; border: 1px solid #3a3a3a; border-radius: 8px;
    padding: 9px 12px; color: #ececec; font-family: 'Poppins', sans-serif;
    font-size: 0.875rem; outline: none; transition: border-color 0.2s;
    width: 100%; box-sizing: border-box;
  }
  .bl-input:focus, .bl-textarea:focus { border-color: #666; }
  .bl-textarea { resize: vertical; min-height: 120px; }

  .bl-upload-area { border: 2px dashed #3a3a3a; border-radius: 10px; padding: 1.25rem; text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; background: #1f1f1f; }
  .bl-upload-area:hover { border-color: #666; background: #222; }
  .bl-upload-icon { font-size: 1.5rem; display: block; margin-bottom: 6px; }
  .bl-upload-text { font-size: 0.82rem; color: #888; }
  .bl-upload-name { font-size: 0.78rem; color: #ccc; margin-top: 4px; font-weight: 500; }
  .bl-current-img { width: 100%; max-height: 160px; object-fit: cover; border-radius: 8px; margin-top: 8px; border: 1px solid #3a3a3a; display: block; }

  .bl-form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 1rem; }
  .bl-btn-cancel { border: 1px solid #3a3a3a; background: transparent; color: #888; border-radius: 8px; padding: 7px 14px; font-size: 0.82rem; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
  .bl-btn-cancel:hover { background: #222; }

  .bl-btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 5px 10px; cursor: pointer; font-size: 12px; font-family: 'Poppins', sans-serif; transition: background 0.2s, border-color 0.2s; }
  .bl-btn:hover { background: #333; border-color: #555; }
  .bl-btn.primary { background: #e6e6e6; border-color: #e6e6e6; color: #111; font-weight: 500; padding: 7px 16px; font-size: 0.82rem; }
  .bl-btn.primary:hover { background: #fff; border-color: #fff; }
  .bl-btn.del:hover { background: rgba(239,68,68,0.1); border-color: #ef4444; color: #ef4444; }

  .bl-filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.2rem; }
  .bl-filter-btn { border: 1px solid #2f2f2f; background: #181818; color: #888; border-radius: 20px; padding: 5px 14px; cursor: pointer; font-size: 0.78rem; font-family: 'Poppins', sans-serif; transition: all 0.2s; }
  .bl-filter-btn:hover { border-color: #444; color: #ccc; }
  .bl-filter-btn.active { background: #ececec; border-color: #ececec; color: #111; font-weight: 500; }
  .bl-filter-count { margin-left: 5px; opacity: 0.6; font-size: 0.72rem; }

  .bl-empty { text-align: center; padding: 3rem 0; color: #555; font-size: 0.85rem; }

  .bl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .bl-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: 0.5rem; transition: border-color 0.2s; }
  .bl-card:hover { border-color: #3a3a3a; }
  .bl-card-img { width: 100%; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #2f2f2f; }
  .bl-cat-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 500; background: #252525; border: 1px solid #3a3a3a; color: #a3a3a3; margin-bottom: 4px; }
  .bl-card-title { font-family: 'Fraunces', serif; font-size: 1rem; font-weight: 500; color: #ececec; margin: 4px 0; }
  .bl-card-excerpt { font-size: 0.82rem; color: #888; line-height: 1.6; margin: 0; }
  .bl-card-date { font-size: 0.75rem; color: #555; display: block; margin-top: 4px; }
  .bl-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .bl-tag { font-size: 0.72rem; padding: 2px 8px; background: #252525; border: 1px solid #2f2f2f; border-radius: 4px; color: #666; }
  .bl-card-footer { display: flex; gap: 6px; padding-top: 10px; border-top: 1px solid #2f2f2f; margin-top: auto; }

  .bl-back-btn { border: 1px solid #3a3a3a; background: #262626; color: #aaa; border-radius: 8px; padding: 7px 14px; font-size: 0.82rem; font-family: 'Poppins', sans-serif; cursor: pointer; transition: background 0.2s; }
  .bl-back-btn:hover { background: #333; color: #eee; }
  .bl-detail-title { font-family: 'Fraunces', serif; font-size: 1.8rem; font-weight: 500; color: #ececec; margin: 12px 0 6px; letter-spacing: -0.02em; }
  .bl-detail-img { width: 100%; max-height: 300px; object-fit: cover; border-radius: 10px; margin: 10px 0 16px; border: 1px solid #2f2f2f; display: block; }
  .bl-detail-meta { display: flex; gap: 16px; color: #666; font-size: 0.8rem; margin-bottom: 20px; }
  .bl-detail-content { font-size: 0.92rem; color: #aaa; line-height: 1.9; white-space: pre-wrap; margin: 0 0 24px; }
  .bl-actions { display: flex; gap: 8px; }

  @media (max-width: 600px) { .bl-grid { grid-template-columns: 1fr; } .bl-field-row { flex-direction: column; } }
`;

export default Blog;