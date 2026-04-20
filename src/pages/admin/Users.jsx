import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUsers, addUser, updateUser, deleteUser } from "../../services/api";
import Layout from "../../components/Layout";

const ROLE_CONFIG = {
  admin:   { badge: "badge-error",   bg: "bg-red-50",    text: "text-red-700",    icon: "🛡️" },
  teacher: { badge: "badge-info",    bg: "bg-blue-50",   text: "text-blue-700",   icon: "🎓" },
  student: { badge: "badge-success", bg: "bg-green-50",  text: "text-green-700",  icon: "🧑‍🎓" },
};

const Avatar = ({ name, role }) => {
  const cfg = ROLE_CONFIG[role] || {};
  return (
    <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center ${cfg.text} text-sm font-bold shrink-0`}>
      {name?.charAt(0).toUpperCase()}
    </div>
  );
};

// ── USER FORM MODAL ───────────────────────────────────
const UserFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState(initialData || { name: "", email: "", password: "", role: "student", department: "" });

  useEffect(() => {
    setFormData(initialData || { name: "", email: "", password: "", role: "student", department: "" });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!initialData && !formData.password)) {
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
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {initialData ? "Edit User" : "Add New User"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Name *</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} 
                  placeholder="Full name" className="input input-bordered focus:input-primary rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Email *</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="user@university.edu" className="input input-bordered focus:input-primary rounded-xl" required />
              </div>
              {!initialData && (
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Password *</span></label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="••••••••" className="input input-bordered focus:input-primary rounded-xl" required />
                </div>
              )}
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Role</span></label>
                <select name="role" value={formData.role} onChange={handleChange} className="select select-bordered focus:select-primary rounded-xl">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Department</span></label>
                <input type="text" name="department" value={formData.department} onChange={handleChange}
                  placeholder="e.g., Computer Science" className="input input-bordered focus:input-primary rounded-xl" />
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
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, userName = "", isLoading = false }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete User?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-semibold">{userName}</span>? This action cannot be undone.</p>
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

const Users = () => {
  const { token } = useAuth();
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = () => {
    setLoading(true);
    getUsers(token)
      .then((data) => {
        console.log("Fetched users:", data);
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setUsers([]);
        setLoading(false);
      });
  };

  const handleAddUser = async (formData) => {
    setIsSubmitting(true);
    const result = await addUser(token, formData);
    if (result.id || result.user_id) {
      setMessage({ type: "success", text: "✅ User added successfully!" });
      setShowAddModal(false);
      fetchUsers();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to add user") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleEditClick = (user) => {
    setSelectedUser({ ...user, password: "" });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (formData) => {
    setIsSubmitting(true);
    const result = await updateUser(token, selectedUser.id, formData);
    if (result.id || result.user_id) {
      setMessage({ type: "success", text: "✅ User updated successfully!" });
      setShowEditModal(false);
      fetchUsers();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to update user") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    const result = await deleteUser(token, selectedUser.id);
    if (result.success || result.message) {
      setMessage({ type: "success", text: "✅ User deleted successfully!" });
      setShowDeleteModal(false);
      fetchUsers();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to delete user") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const filtered = users.filter((u) => {
    const matchRole   = filter === "all" || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl text-gray-800">Users</h2>
          <p className="text-gray-500 mt-1">Manage all registered users in the system</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary rounded-xl gap-2">
          <span className="text-lg">➕</span> Add User
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert mb-4 rounded-xl text-sm py-2 ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Stat Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { key: "all",     label: "All Users", icon: "👥" },
          { key: "admin",   label: "Admins",    icon: "🛡️" },
          { key: "teacher", label: "Teachers",  icon: "🎓" },
          { key: "student", label: "Students",  icon: "🧑‍🎓" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
              filter === tab.key
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              filter === tab.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {users.filter((u) => tab.key === "all" || u.role === tab.key).length}
            </span>
          </button>
        ))}

        {/* Search */}
        <div className="ml-auto flex-1 min-w-[200px] max-w-xs">
          <input
            type="text"
            placeholder="Search name or email…"
            className="input input-bordered focus:input-primary rounded-xl w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">No users found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-white/80 font-medium text-xs">#</th>
                  <th className="text-white/80 font-medium text-xs">Name</th>
                  <th className="text-white/80 font-medium text-xs">Email</th>
                  <th className="text-white/80 font-medium text-xs">Role</th>
                  <th className="text-white/80 font-medium text-xs">Department</th>
                  <th className="text-white/80 font-medium text-xs text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => {
                  const cfg = ROLE_CONFIG[u.role] || {};
                  return (
                    <tr key={u.id} className="hover">
                      <td className="text-gray-400 text-sm">{i + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} role={u.role} />
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                            <p className="text-xs text-gray-400 sm:hidden">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-500 text-sm hidden sm:table-cell">{u.email}</td>
                      <td>
                        <span className={`badge badge-sm capitalize ${cfg.badge}`}>
                          {cfg.icon} {u.role}
                        </span>
                      </td>
                      <td className="text-gray-500 text-sm">{u.department || "—"}</td>
                      <td>
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleEditClick(u)} className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-700" title="Edit">✏️</button>
                          <button onClick={() => handleDeleteClick(u)} className="btn btn-sm btn-ghost text-red-600 hover:text-red-700" title="Delete">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
              Showing {filtered.length} of {users.length} users
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <UserFormModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSubmit={handleAddUser}
        isLoading={isSubmitting}
      />
      <UserFormModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        onSubmit={handleUpdateUser}
        initialData={selectedUser}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleConfirmDelete}
        userName={selectedUser?.name}
        isLoading={isSubmitting}
      />
    </Layout>
  );
};

export default Users;
