import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyCourses, getMyVacancies, getTeacherSchedule } from "../../services/api";
import Layout from "../../components/Layout";

const TeacherDashboard = () => {
  const { token, user } = useAuth();
  const [courses, setCourses]     = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [schedule, setSchedule]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const semester = "Spring2025";

  useEffect(() => {
    Promise.all([
      getMyCourses(token),
      getMyVacancies(token, semester),
      getTeacherSchedule(token, semester),
    ]).then(([c, v, s]) => {
      setCourses(Array.isArray(c) ? c : []);
      setVacancies(Array.isArray(v) ? v : []);
      setSchedule(Array.isArray(s) ? s : []);
      setLoading(false);
    });
  }, [token]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="font-heading text-3xl text-gray-800">Welcome, {user?.name} 👋</h2>
        <p className="text-gray-500 mt-1">Your teaching overview for {semester}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { icon: "📚", label: "My Courses",       value: courses.length,   bg: "bg-primary-50" },
          { icon: "🕐", label: "Vacancies Set",     value: vacancies.length, bg: "bg-blue-50" },
          { icon: "📅", label: "Scheduled Classes", value: schedule.length,  bg: "bg-yellow-50" },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.bg} rounded-2xl p-6 border border-primary-100`}>
            <div className="text-3xl mb-3">{s.icon}</div>
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-heading text-xl text-gray-800 mb-4">My Courses</h3>
          {courses.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No courses assigned yet</p>
          ) : (
            <div className="space-y-3">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-primary-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.course_name}</p>
                    <p className="text-xs text-primary-600 font-mono">{c.course_code}</p>
                  </div>
                  <span className="badge badge-primary badge-sm">{c.credit_hours} cr</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-heading text-xl text-gray-800 mb-4">Upcoming Classes</h3>
          {schedule.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No schedule generated yet</p>
          ) : (
            <div className="space-y-3">
              {schedule.slice(0, 4).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 border border-primary-100 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{s.course_name}</p>
                    <p className="text-xs text-gray-500">{s.day} · {s.start_time} – {s.end_time}</p>
                  </div>
                  <span className="badge badge-outline badge-sm">{s.room_number}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
