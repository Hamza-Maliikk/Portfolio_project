import React, { useState, useEffect } from 'react';
import api  from '../lib/api';

const API = `testimonials`;

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: '' });
  const [form, setForm] = useState({ name: '', username: '', description: '' });
  const [imageFile, setImageFile] = useState(null);        // ← new
  const [imagePreview, setImagePreview] = useState(null);  // ← new

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const r = await api.get(API);
      const data = await r.data;
      setTestimonials(data);
    } catch (e) {
      showToast('Could not connect to server', 'error', e);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 2500);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', username: '', description: '' });
    setImageFile(null);      // ← reset
    setImagePreview(null);   // ← reset
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setEditingId(t._id);
    setForm({ name: t.name, username: t.username, description: t.description });
    setImageFile(null);
    setImagePreview(t.image || null);  // ← existing image show karo
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // ← Image change handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

const handleSave = async () => {
  if (!form.name || !form.username || !form.description) {
    showToast('Please fill all fields', 'error');
    return;
  }
  try {
    const url = editingId ? `${API}/${editingId}` : API;
    const method = editingId ? 'put' : 'post'; // ✅ lowercase

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('username', form.username);
    formData.append('description', form.description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    await api.request({
      method,
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data', // ✅ image ke liye zaroori
      },
    });

    // ✅ r.ok hata diya — axios khud error throw karta hai
    showToast(editingId ? 'Updated successfully!' : 'Added successfully!', 'success');
    closeModal();
    fetchAll();
  } catch (e) {
    showToast('Something went wrong', 'error');
  }
};

const handleDelete = async (id) => {
  if (!window.confirm('Delete this testimonial?')) return;
  try {
    await api.delete(`${API}/${id}`);
    showToast('Deleted!', 'success');
    fetchAll();
  } catch (e) {
    showToast('Could not delete', 'error');
  }
};
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Testimonials</h1>
          <p style={styles.subtitle}>Manage all testimonials from here</p>
        </div>
        <button style={styles.btnAdd} onClick={openAdd}>+ Add Testimonial</button>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Person</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={styles.center}>Loading...</td></tr>
            ) : testimonials.length === 0 ? (
              <tr><td colSpan="4" style={styles.center}>No testimonials yet</td></tr>
            ) : (
              testimonials.map(t => (
                <tr key={t._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.nameCell}>
                      {/* ← Agar image hai toh show karo, warna initial */}
                      {t.image ? (
                        <img
                          src={t.image}
                          alt={t.name}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={styles.avatar}>{t.name?.[0]?.toUpperCase()}</div>
                      )}
                      <div>
                        <div style={styles.name}>{t.name}</div>
                        <div style={styles.username}>{t.username}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...styles.td, ...styles.descCell }}>{t.description}</td>
                  <td style={{ ...styles.td, color: '#6b6b80', fontSize: '.8rem' }}>
                    {new Date(t.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={styles.td}>
                    <button style={styles.btnEdit} onClick={() => openEdit(t)}>Edit</button>
                    <button style={styles.btnDel} onClick={() => handleDelete(t._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>

            {['name', 'username'].map(field => (
              <div key={field} style={styles.field}>
                <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  style={styles.input}
                  value={form[field]}
                  onChange={e => setForm({ ...form, [field]: e.target.value })}
                  placeholder={field === 'name' ? 'John Doe' : '@johndoe'}
                />
              </div>
            ))}

            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, minHeight: '90px', resize: 'vertical' }}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Write testimonial here..."
              />
            </div>

            {/* ── IMAGE UPLOAD ── */}
            <div style={styles.field}>
              <label style={styles.label}>Profile Image</label>

              {/* Preview */}
              {imagePreview && (
                <div style={{ marginBottom: 12 }}>
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #2a2a35' }}
                  />
                </div>
              )}

              {/* Upload box */}
              <label style={styles.uploadBox}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <span style={{ fontSize: '1.5rem' }}>📷</span>
                <span style={{ fontSize: '.85rem', color: '#6b6b80', marginTop: 6 }}>
                  {imageFile ? imageFile.name : 'Click to upload image'}
                </span>
              </label>
            </div>

            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={closeModal}>Cancel</button>
              <button style={styles.btnSave} onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.msg && (
        <div style={{ ...styles.toast, borderColor: toast.type === 'success' ? '#ececec' : '#e05c3a', color: toast.type === 'success' ? '#ececec' : '#e05c3a' }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { padding: '32px 24px', background: '#0d0d0f', minHeight: '100vh', color: '#f0ede8', fontFamily: 'DM Sans, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' },
  title: { fontSize: '2rem', fontWeight: 800, marginBottom: '4px', color: '#ffff'},
  subtitle: { color: '#6b6b80', fontSize: '.9rem' },
  btnAdd: {
    border: '1px solid #444',
    background: '#262626',
    color: '#eee',
    borderRadius: '8px',
    padding: '10px 18px',
    cursor: 'pointer',
    fontSize: '.95rem',
    fontWeight: 600,
    minHeight: '40px',
    whiteSpace: 'nowrap',
    transition: 'background .15s ease, transform .15s ease',
  },
  tableWrap: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '12px', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1e1e24' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '.75rem', color: '#6b6b80', fontWeight: 600, letterSpacing: '.8px', textTransform: 'uppercase' },
  tr: { borderTop: '1px solid #2a2a35' },
  td: { padding: '14px 16px', fontSize: '.88rem', verticalAlign: 'middle' },
  center: { textAlign: 'center', padding: '32px', color: '#6b6b80' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#ececec', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.9rem', color: '#111' },
  name: { fontWeight: 500 },
  username: { fontSize: '.78rem', color: '#6b6b80' },
  descCell: { maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#6b6b80' },
  btnEdit: {
    background: '#1e1e24',
    color: '#f0ede8',
    padding: '10px 18px',
    borderRadius: '8px',
    marginRight: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '.95rem',
    minHeight: '40px',
  },
  btnDel: {
    background: 'rgba(255,255,255,0.08)',
    color: '#eee',
    padding: '10px 18px',
    borderRadius: '8px',
    border: '1px solid #2a2a35',
    cursor: 'pointer',
    fontSize: '.95rem',
    minHeight: '40px',
  },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: '#16161a', border: '1px solid #2a2a35', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px' },
  modalTitle: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '.8rem', color: '#6b6b80', marginBottom: '6px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px' },
  input: { width: '100%', background: '#1e1e24', border: '1px solid #2a2a35', borderRadius: '8px', padding: '10px 14px', color: '#f0ede8', fontFamily: 'DM Sans, sans-serif', fontSize: '.9rem', outline: 'none', boxSizing: 'border-box' },
  // ← New upload box style
  uploadBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, width: '100%', padding: '20px', background: '#1e1e24', border: '1.5px dashed #2a2a35', borderRadius: '10px', cursor: 'pointer', transition: 'border-color .2s' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' },
  btnCancel: {
    background: '#1e1e24',
    color: '#6b6b80',
    padding: '10px 18px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '.95rem',
    minHeight: '40px',
  },
  btnSave: {
    background: '#ececec',
    color: '#111',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    fontSize: '.95rem',
    minHeight: '40px',
  },
  toast: { position: 'fixed', bottom: '24px', right: '24px', background: '#16161a', border: '1px solid', borderRadius: '10px', padding: '12px 20px', fontSize: '.85rem', zIndex: 999 },
};

export default AdminTestimonials;