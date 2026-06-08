import { useState, useEffect } from "react";
import api from "../lib/api";

const Education = () => {
  const canCrud = Boolean(localStorage.getItem("token"));
  const [educations, setEducations] = useState([]);
  const emptyRow = { degree: "", institute: "", year: "", grade: "" };
  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [editId, setEditId] = useState(null);
  // Fetch all


  const fetchEducation = async () => {
    const res = await api.get(`${import.meta.env.VITE_URL_API}api/education`);
    setEducations(res.data);
  };
  useEffect(() => {
    fetchEducation();
  }, []);

  const updateRow = (idx, key, value) => {
    setRows((prev) => prev.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };

  const removeRow = (idx) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  // Add or Update
  const handleSubmit = async () => {
    const cleanedRows = rows
      .map((row) => ({
        degree: row.degree.trim(),
        institute: row.institute.trim(),
        year: row.year.trim(),
        grade: row.grade.trim(),
      }))
      .filter((row) => row.degree || row.institute || row.year || row.grade);

    if (!cleanedRows.length) {
      alert("At least one education entry add karo.");
      return;
    }

    if (editId) {

      await api.put(`education/${editId}`, cleanedRows[0]); 
      setEditId(null);
    } else {
      await Promise.all(
        cleanedRows.map((row) => api.post("education", row))
      );
    }
    setRows([{ ...emptyRow }]);
    fetchEducation();
  };

  // Edit
  const handleEdit = (edu) => {
    setRows([
      {
        degree: edu.degree || "",
        institute: edu.institute || "",
        year: edu.year || "",
        grade: edu.grade || "",
      },
    ]);
    setEditId(edu._id);
  };

  // Delete
  const handleDelete = async (id) => {
    await api.delete(`education/${id}`);
    fetchEducation();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=Poppins:wght@400;500;600&display=swap');
        .edu-page { max-width: 950px; margin: 0 auto; color: #ececec; font-family: 'Poppins', sans-serif; }
        .edu-title { font-family: 'Fraunces', serif; font-size: 2rem; font-weight: 500; margin: 0 0 0.4rem; letter-spacing: -0.02em; }
        .edu-sub { color: #a3a3a3; margin-bottom: 1.2rem; font-size: 0.9rem; }
        .edu-form-card,
        .edu-card { background: #181818; border: 1px solid #2f2f2f; border-radius: 12px; padding: 1rem 1.1rem; margin-bottom: 1rem; }
        .edu-row { display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
        .edu-card { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        .edu-card h3 { margin: 0 0 0.5rem; font-family: 'Fraunces', serif; font-weight: 500; font-size: 1.1rem; }
        .edu-card p { margin: 4px 0 0; color: #cccccc; line-height: 1.7; font-size: 0.92rem; }
        .edu-card small { color: #8b8b8b; }
        .edu-card-actions,
        .edu-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 0.5rem; }
        .btn { border: 1px solid #444; background: #262626; color: #eee; border-radius: 8px; padding: 8px 14px; cursor: pointer; font-size: 0.88rem; transition: background 0.2s, border-color 0.2s; }
        .btn:hover { background: #333; }
        .btn.danger { border-color: rgba(239,68,68,0.35); color: #f87171; }
        .btn.danger:hover { background: rgba(239,68,68,0.12); }
        .input { width: 100%; border: 1px solid #3a3a3a; border-radius: 8px; background: #1f1f1f; color: #eee; padding: 10px 12px; box-sizing: border-box; font-size: 0.95rem; }
        .input:focus { outline: none; border-color: #5f5f7f; }
        .edu-form-card .input { min-width: 180px; flex: 1 1 180px; }
        @media (max-width: 900px) { .edu-card { flex-direction: column; align-items: flex-start; } }
      `}</style>
      <div className="edu-page">
        <h1 className="edu-title">Education</h1>
        <p className="edu-sub">Manage your education entries with the same portfolio style.</p>

        {/* Form */}
        {canCrud && (
          <div className="edu-form-card">
            {rows.map((row, idx) => (
              <div key={idx} className="edu-row">
                <input
                  className="input"
                  placeholder="e.g. BS Computer Science"
                  value={row.degree}
                  onChange={(e) => updateRow(idx, "degree", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="e.g. COMSATS University"
                  value={row.institute}
                  onChange={(e) => updateRow(idx, "institute", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Year (2021-2025)"
                  value={row.year}
                  onChange={(e) => updateRow(idx, "year", e.target.value)}
                />
                <input
                  className="input"
                  placeholder="Grade / CGPA"
                  value={row.grade}
                  onChange={(e) => updateRow(idx, "grade", e.target.value)}
                />
                {!editId && rows.length > 1 && (
                  <button onClick={() => removeRow(idx)} className="btn danger">
                    Remove
                  </button>
                )}
              </div>
            ))}

            <div className="edu-actions">
              {!editId && (
                <button onClick={addRow} className="btn">
                  + Add More
                </button>
              )}
              <button onClick={handleSubmit} className="btn">
                {editId ? "Update" : "Save All"}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {educations.map((edu) => (
          <div key={edu._id} className="edu-card">
            <div>
              <h3>{edu.degree}</h3>
              <p>{edu.institute}</p>
              <small>{edu.year} • {edu.grade}</small>
            </div>
            {canCrud && (
              <div className="edu-card-actions">
                <button onClick={() => handleEdit(edu)} className="btn">
                  Edit
                </button>
                <button onClick={() => handleDelete(edu._id)} className="btn danger">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

// Styles

export default Education;