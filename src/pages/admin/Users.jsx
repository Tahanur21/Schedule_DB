import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUsers } from "../../services/api";
import Layout from "../../components/Layout";

const Users = () => {
  const { token } = useAuth();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    getUsers(token).then((data) => { setUsers(Array.isArray(data) ? data : []); setLoading(false); });
  }, [token]);

  const filtered = users.filter((u) => {
    const matchRole   = filter === "all" || u.role === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">Users</h2>
        <p className="text-gray-500 mt-1">Manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="input input-bordered focus:input-primary rounded-xl flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select select-bordered focus:select-primary rounded-xl" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
      ) : (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          <table className="table table-zebra w-full">
            <thead className="bg-primary-600 text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No users found</td></tr>
              ) : (
                filtered.map((u, i) => (
                  <tr key={u.id} className="hover">
                    <td className="text-gray-400">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-semibold">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{u.email}</td>
                    <td>
                      <span className={`badge badge-sm capitalize ${u.role === "admin" ? "badge-error" : u.role === "teacher" ? "badge-info" : "badge-success"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">{u.department || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Users;
