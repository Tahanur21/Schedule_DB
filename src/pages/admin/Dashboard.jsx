import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUsers, getRooms, getCourses } from "../../services/api";
import Layout from "../../components/Layout";

const StatCard = ({ icon, label, value, color }) => (
  <div className={`stat-card bg-white rounded-2xl p-6 border border-primary-100 shadow-sm`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${color}`}>
      {icon}
    </div>
    <p className="text-3xl font-bold text-gray-800">{value ?? <span className="loading loading-dots loading-sm"></span>}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [users, setUsers]     = useState(null);
  const [rooms, setRooms]     = useState(null);
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    getUsers(token).then(setUsers);
    getRooms(token).then(setRooms);
    getCourses(token).then(setCourses);
  }, [token]);

  const teachers  = users?.filter((u) => u.role === "teacher").length ?? "—";
  const students  = users?.filter((u) => u.role === "student").length ?? "—";

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="font-heading text-3xl text-gray-800">Welcome, {user?.name} 👋</h2>
        <p className="text-gray-500 mt-1">Here's a quick overview of your system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon="👥" label="Total Users"    value={users?.length}   color="bg-primary-50" />
        <StatCard icon="🎓" label="Teachers"       value={teachers}        color="bg-blue-50" />
        <StatCard icon="🧑‍🎓" label="Students"     value={students}        color="bg-yellow-50" />
        <StatCard icon="🚪" label="Rooms"          value={rooms?.length}   color="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-heading text-xl text-gray-800 mb-4">Recent Users</h3>
          {!users ? (
            <div className="flex justify-center py-8"><span className="loading loading-spinner text-primary"></span></div>
          ) : (
            <div className="space-y-3">
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-semibold">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                  <span className={`badge badge-sm capitalize ${u.role === "admin" ? "badge-error" : u.role === "teacher" ? "badge-info" : "badge-success"}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Courses */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-heading text-xl text-gray-800 mb-4">Courses ({courses?.length ?? 0})</h3>
          {!courses ? (
            <div className="flex justify-center py-8"><span className="loading loading-spinner text-primary"></span></div>
          ) : (
            <div className="space-y-3">
              {courses.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.course_name}</p>
                    <p className="text-xs text-primary-600 font-mono">{c.course_code}</p>
                  </div>
                  <span className="badge badge-outline badge-sm">{c.credit_hours} cr</span>
                </div>
              ))}
              {courses.length === 0 && <p className="text-gray-400 text-sm text-center py-4">No courses yet</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
