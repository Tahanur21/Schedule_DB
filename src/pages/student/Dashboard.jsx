import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentSchedule } from "../../services/api";
import Layout from "../../components/Layout";

const StudentDashboard = () => {
  const { token, user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading]   = useState(true);
  const semester = "Spring2025";

  useEffect(() => {
    getStudentSchedule(token, semester).then((data) => {
      setSchedule(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [token]);

  const days = [...new Set(schedule.map((s) => s.day))];

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="font-heading text-3xl text-gray-800">Welcome, {user?.name} 👋</h2>
        <p className="text-gray-500 mt-1">Your class schedule for {semester}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { icon: "📅", label: "Total Classes",  value: schedule.length, bg: "bg-primary-50" },
          { icon: "📆", label: "Days in Week",   value: days.length,     bg: "bg-blue-50"    },
          { icon: "🏛️", label: "Department",     value: user?.department || "N/A", bg: "bg-yellow-50", small: true },
        ].map((s) => (
          <div key={s.label} className={`stat-card ${s.bg} rounded-2xl p-6 border border-primary-100`}>
            <div className="text-3xl mb-3">{s.icon}</div>
            <p className={`font-bold text-gray-800 ${s.small ? "text-xl" : "text-3xl"}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Today's Classes */}
      <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
        <h3 className="font-heading text-xl text-gray-800 mb-4">All Classes This Semester</h3>
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>No schedule found for your department</p>
          </div>
        ) : (
          <div className="space-y-3">
            {schedule.slice(0, 6).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold text-center leading-tight px-1">
                    {s.day?.slice(0, 3)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{s.course_name}</p>
                    <p className="text-xs text-gray-500">{s.teacher_name} · {s.start_time} – {s.end_time}</p>
                  </div>
                </div>
                <span className="badge badge-outline badge-sm">{s.room_number}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentDashboard;
