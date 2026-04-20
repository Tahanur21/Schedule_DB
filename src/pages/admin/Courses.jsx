import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCourses, getUsers, addCourse, updateCourse, deleteCourse } from "../../services/api";
import Layout from "../../components/Layout";

const COLORS = ["#6366f1","#22d3ee","#10b981","#f59e0b","#f43f5e","#a855f7"];

const isLab = (c) =>
  c.course_code?.toLowerCase().includes("l") || c.course_name?.toLowerCase().includes("lab");

// ── COURSE FORM MODAL ─────────────────────────────
const CourseFormModal = ({ isOpen, onClose, onSubmit, initialData = null, teachers = [], isLoading = false }) => {
  const [formData, setFormData] = useState(
    initialData || { 
      code: "", 
      name: "", 
      credits: 3, 
      level: 100, 
      department: "", 
      teacher_id: "",
      capacity: 30,
      prerequisites: ""
    }
  );

  useEffect(() => {
    setFormData(
      initialData || { 
        code: "", 
        name: "", 
        credits: 3, 
        level: 100, 
        department: "", 
        teacher_id: "",
        capacity: 30,
        prerequisites: ""
      }
    );
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100 max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {initialData ? "Edit Course" : "Add New Course"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Course Code *</span></label>
                <input type="text" name="code" value={formData.code} onChange={handleChange}
                  placeholder="e.g., CS101" className="input input-bordered focus:input-primary rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Course Name *</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="e.g., Introduction to Computer Science" className="input input-bordered focus:input-primary rounded-xl" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Credits</span></label>
                  <input type="number" name="credits" value={formData.credits} onChange={handleChange}
                    min="1" max="4" className="input input-bordered focus:input-primary rounded-xl" />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Level</span></label>
                  <select name="level" value={formData.level} onChange={handleChange} className="select select-bordered focus:select-primary rounded-xl">
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                  </select>
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Department</span></label>
                <input type="text" name="department" value={formData.department} onChange={handleChange}
                  placeholder="e.g., Computer Science" className="input input-bordered focus:input-primary rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Instructor</span></label>
                <select name="teacher_id" value={formData.teacher_id} onChange={handleChange} className="select select-bordered focus:select-primary rounded-xl">
                  <option value="">Select Instructor</option>
                  {teachers.filter(t => t.role === "teacher").map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Capacity</span></label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange}
                  min="1" max="500" className="input input-bordered focus:input-primary rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Prerequisites (comma-separated)</span></label>
                <input type="text" name="prerequisites" value={formData.prerequisites} onChange={handleChange}
                  placeholder="e.g., CS100, Math101" className="input input-bordered focus:input-primary rounded-xl" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
                <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 rounded-xl">
                  {isLoading ? "Saving..." : initialData ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// ── DELETE CONFIRMATION MODAL ──────────────────────────
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, courseCode = "", isLoading = false }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Course?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-semibold">{courseCode}</span>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
              <button onClick={onConfirm} disabled={isLoading} className="btn btn-error flex-1 rounded-xl">
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Courses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [view,    setView]    = useState("table");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getCourses(token),
      getUsers(token),
    ])
      .then(([c, u]) => {
        console.log("Fetched courses:", c, "Fetched users:", u);
        setCourses(Array.isArray(c) ? c : []);
        setUsers(Array.isArray(u) ? u : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setCourses([]);
        setUsers([]);
        setLoading(false);
      });
  };

  const handleAddCourse = async (formData) => {
    setIsSubmitting(true);
    const result = await addCourse(token, formData);
    if (result.id || result.course_id) {
      setMessage({ type: "success", text: "✅ Course added successfully!" });
      setShowAddModal(false);
      fetchData();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to add course") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleEditClick = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleUpdateCourse = async (formData) => {
    setIsSubmitting(true);
    const result = await updateCourse(token, selectedCourse.id, formData);
    if (result.id || result.course_id) {
      setMessage({ type: "success", text: "✅ Course updated successfully!" });
      setShowEditModal(false);
      fetchData();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to update course") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleDeleteClick = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    const result = await deleteCourse(token, selectedCourse.id);
    if (result.success || result.message) {
      setMessage({ type: "success", text: "✅ Course deleted successfully!" });
      setShowDeleteModal(false);
      fetchData();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to delete course") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const teacherName = (id) => users.find((u) => u.id === id)?.name || `#${id}`;

  const filtered = courses.filter(
    (c) =>
      (c.course_name || c.name).toLowerCase().includes(search.toLowerCase()) ||
      (c.course_code || c.code).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl text-gray-800">Courses</h2>
          <p className="text-gray-500 mt-1">Manage all registered courses in the system</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary rounded-xl gap-2">
          <span className="text-lg">➕</span> Add Course
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert mb-4 rounded-xl text-sm py-2 ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: "📚", label: "Total Courses",  value: courses.length, color: "bg-indigo-50 text-indigo-700" },
          { icon: "📖", label: "Theory",         value: courses.filter(c => !isLab(c)).length,    color: "bg-blue-50 text-blue-700" },
          { icon: "🔬", label: "Lab Courses",    value: courses.filter(isLab).length,       color: "bg-emerald-50 text-emerald-700" },
          { icon: "⭐", label: "Total Credits",  value: courses.reduce((s, c) => s + (c.credit_hours || c.credits || 0), 0),   color: "bg-amber-50 text-amber-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-primary-100 shadow-sm`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-75 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <input
          type="text" placeholder="Search by name or code…"
          className="input input-bordered focus:input-primary rounded-xl text-sm flex-1 min-w-[200px] max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="ml-auto flex gap-2">
          <button onClick={() => setView("table")}
            className={`btn btn-sm rounded-xl ${view === "table" ? "btn-primary" : "btn-outline"}`}>
            📋 Table
          </button>
          <button onClick={() => setView("cards")}
            className={`btn btn-sm rounded-xl ${view === "cards" ? "btn-primary" : "btn-outline"}`}>
            🃏 Cards
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-medium">No courses found</p>
        </div>
      ) : view === "table" ? (

        /* ── TABLE VIEW ── */
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-white/80 font-medium text-xs">#</th>
                <th className="text-white/80 font-medium text-xs">Course</th>
                <th className="text-white/80 font-medium text-xs">Code</th>
                <th className="text-white/80 font-medium text-xs">Type</th>
                <th className="text-white/80 font-medium text-xs">Department</th>
                <th className="text-white/80 font-medium text-xs">Credits</th>
                <th className="text-white/80 font-medium text-xs">Teacher</th>
                <th className="text-white/80 font-medium text-xs text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} className="hover">
                  <td className="text-gray-400 text-sm">{i + 1}</td>
                  <td>
                    <p className="font-semibold text-gray-800 text-sm">{c.course_name || c.name}</p>
                  </td>
                  <td>
                    <span className="badge badge-outline font-mono badge-sm">{c.course_code || c.code}</span>
                  </td>
                  <td>
                    <span className={`badge badge-sm border-0 ${isLab(c) ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                      {isLab(c) ? "🔬 Lab" : "📖 Theory"}
                    </span>
                  </td>
                  <td className="text-gray-500 text-sm">{c.department || "—"}</td>
                  <td>
                    <span className="badge badge-primary badge-sm">{c.credit_hours || c.credits} cr</span>
                  </td>
                  <td className="text-gray-500 text-sm">{users.find((u) => u.id === c.teacher_id)?.name || "—"}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEditClick(c)} className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-700" title="Edit">✏️</button>
                      <button onClick={() => handleDeleteClick(c)} className="btn btn-sm btn-ghost text-red-600 hover:text-red-700" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
          </div>
        </div>

      ) : (

        /* ── CARD VIEW ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <div key={c.id} className="bg-white rounded-2xl p-5 border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-1 rounded-t-2xl -mx-5 -mt-5 mb-4 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                     style={{ background: COLORS[i % COLORS.length] + "18" }}>
                  {isLab(c) ? "🔬" : "📖"}
                </div>
                <div className="flex gap-1">
                  <span className="badge badge-primary badge-sm">{c.credit_hours} cr</span>
                  <span className={`badge badge-sm border-0 ${isLab(c) ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                    {isLab(c) ? "Lab" : "Theory"}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-0.5">{c.course_name}</h3>
              <p className="font-mono text-xs mb-3" style={{ color: COLORS[i % COLORS.length] }}>{c.course_code}</p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                <span>{c.department || "CS Dept"}</span>
                <span>{teacherName(c.teacher_id)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CourseFormModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSubmit={handleAddCourse}
        teachers={users}
        isLoading={isSubmitting}
      />
      <CourseFormModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        onSubmit={handleUpdateCourse}
        initialData={selectedCourse}
        teachers={users}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleConfirmDelete}
        courseCode={selectedCourse?.course_code || selectedCourse?.code}
        isLoading={isSubmitting}
      />
    </Layout>
  );
};

export default Courses;
