import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import api from "../lib/api";

const Education = () => {
  const canCrud = Boolean(localStorage.getItem("token"));
  const [educations, setEducations] = useState([]);
  const emptyRow = { degree: "", institute: "", year: "", grade: "" };
  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();``
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
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@400;500&display=swap');
        .edu-page { max-width: 800px; font-family: 'DM Mono', monospace; color: #1a1a1a; }
        .edu-page h2 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 1.5rem;
          margin: 0 0 1.25rem;
          letter-spacing: -0.02em;
        }
      `}</style>
      <div className="edu-page">
      <h2>Education</h2>

      {/* Form */}
      {canCrud && (
        <div style={formWrapStyle}>
          {rows.map((row, idx) => (
            <div key={idx} style={rowStyle}>
              <input
                placeholder="e.g. BS Computer Science"
                value={row.degree}
                onChange={(e) => updateRow(idx, "degree", e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="e.g. COMSATS University"
                value={row.institute}
                onChange={(e) => updateRow(idx, "institute", e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Year (2021-2025)"
                value={row.year}
                onChange={(e) => updateRow(idx, "year", e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="Grade / CGPA"
                value={row.grade}
                onChange={(e) => updateRow(idx, "grade", e.target.value)}
                style={inputStyle}
              />
              {!editId && rows.length > 1 && (
                <button onClick={() => removeRow(idx)} style={deleteBtn}>
                  Remove
                </button>
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {!editId && (
              <button onClick={addRow} style={editBtn}>
                + Add More
              </button>
            )}
            <button onClick={handleSubmit} style={btnStyle}>
              {editId ? "Update" : "Save All"}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {educations.map((edu) => (
        <div key={edu._id} style={cardStyle}>
          <div>
            <h3 style={{ margin: 0 }}>{edu.degree}</h3>
            <p style={{ margin: "4px 0", color: "#666" }}>{edu.institute}</p>
            <small>{edu.year} • {edu.grade}</small>
          </div>
          {canCrud && (
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleEdit(edu)} style={editBtn}>Edit</button>
              <button onClick={() => handleDelete(edu._id)} style={deleteBtn}>Delete</button>
            </div>
          )}
        </div>
      ))}
      </div>
    </>
  );
};

// Styles
const inputStyle = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #d4d4d4",
  fontSize: "14px",
  minWidth: "180px",
  flex: "1 1 180px",
  backgroundColor: "#fafafa",
  color: "#1f2937",
  outline: "none",
};

const formWrapStyle = {
  marginBottom: "20px",
  backgroundColor: "#ffffff",
  border: "1px solid #ececec",
  borderRadius: "12px",
  padding: "12px",
};

const rowStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "10px",
  flexWrap: "wrap",
};

const btnStyle = {
  padding: "8px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  padding: "6px 14px",
  backgroundColor: "#2196F3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "6px 14px",
  backgroundColor: "#f44336",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #eee",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

export default Education;