import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyCourses, getMyVacancies, getTeacherSchedule } from "../../services/api";
import { mockTeacherCharts, mockTeacherStats } from "../../services/mockData";
import Layout from "../../components/Layout";

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutChart = ({ value, max, color, size = 90, thickness = 14, label }) => {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (value / (max || 1)) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={thickness}
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-gray-800">{value}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center">{label}</p>
    </div>
  );
};

// ── Line Chart Component ───────────────────────────────────────────────────────
const LineChart = ({ data, height = 80, color = "#6366f1" }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * 100;
    const y = ((d.value - minValue) / range) * height;
    return { x, y: height - y, label: d.label };
  });
  
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

// ── Availability Grid ─────────────────────────────────────────────────────────
const AvailabilityGrid = ({ vacancies }) => {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
  const slots = ["08:00","09:00","10:00","11:00","14:00"];

  const isAvailable = (day, time) =>
    vacancies.some((v) => v.day === day && v.start_time?.startsWith(time) && v.is_available);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="text-gray-400 font-normal pb-2 pr-2 text-left w-10">Time</th>
            {days.map((d) => (
              <th key={d} className="text-gray-500 font-medium pb-2 text-center">{d.slice(0,3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((time) => (
            <tr key={time}>
              <td className="text-gray-400 pr-2 py-1">{time}</td>
              {days.map((day) => {
                const avail = isAvailable(day, time);
                return (
                  <td key={day} className="py-1 text-center">
                    <div className={`mx-auto w-7 h-5 rounded ${avail ? "bg-emerald-400" : "bg-gray-100"}`} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-4 mt-3 justify-end">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-400" /><span className="text-xs text-gray-400">Available</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-100 border border-gray-200" /><span className="text-xs text-gray-400">Unavailable</span></div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const TeacherDashboard = () => {
  const { token, user } = useAuth();
  const [courses,   setCourses]   = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [schedule,  setSchedule]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const semester = "Spring2025";
  const teacherId = user?.id || "TCH001";
  const rawStats = mockTeacherStats(teacherId);
  const stats = {
    assignedCourses: rawStats?.total_courses ?? 0,
    totalCredits: rawStats?.scheduled_classes ?? 0,
    totalEnrollment: rawStats?.students_taught ?? 0,
    avgRating: 4.5,
    avgAttendance: rawStats?.avg_class_attendance ?? 0,
  };

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
    }).catch(() => {
      setLoading(false);
    });
  }, [token]);

  const totalCredits = courses.reduce((s, c) => s + (c.credit_hours || 0), 0);
  const availCount   = vacancies.filter((v) => v.is_available).length;
  const days = [...new Set(schedule.map((s) => s.day))];

  // Enrich vacancies with day/time info for the grid (vacancies may not carry day/time — we approximate from schedule)
  const enrichedVacancies = vacancies.map((v) => {
    const matched = schedule.find((s) => s.time_slot_id === v.time_slot_id);
    return { ...v, day: matched?.day, start_time: matched?.start_time };
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">Welcome, {user?.name} 👋</h2>
        <p className="text-gray-500 mt-1">Your teaching overview — <span className="font-medium text-indigo-500">{semester}</span></p>
      </div>

      {/* Donut KPI Row */}
      <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-700 text-sm mb-5">Workload at a Glance</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <DonutChart value={stats.assignedCourses}   max={8}  color="#6366f1" label="Courses Assigned" />
          <DonutChart value={stats.totalCredits}     max={20} color="#22d3ee" label="Total Credit Hours" />
          <DonutChart value={stats.totalEnrollment}  max={300} color="#10b981" label="Total Enrollment" />
          <DonutChart value={stats.avgRating}        max={5}  color="#f59e0b" label={`Rating (${stats.avgRating.toFixed(1)})`} />
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Enrollment Trend */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 text-sm mb-4">Enrollment Trend</h3>
          <div className="h-24">
            <LineChart data={mockTeacherCharts.enrollment_by_course.map(d => ({ value: d.students, label: d.course }))} height={80} color="#22d3ee" />
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">Total: {stats.totalEnrollment} students</p>
        </div>

        {/* Attendance Trend */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 text-sm mb-4">Class Attendance Trend</h3>
          <div className="h-24">
            <LineChart data={mockTeacherCharts.attendance_trend.map(d => ({ value: d.attendance, label: d.week }))} height={80} color="#10b981" />
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">Avg Attendance: {stats.avgAttendance.toFixed(1)}%</p>
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

        {/* My Courses */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">My Courses</h3>
            <span className="badge badge-primary badge-sm">{courses.length} courses</span>
          </div>
          {courses.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
              <span className="text-4xl">📭</span>
              <p className="text-sm">No courses assigned yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{c.course_name}</p>
                    <p className="text-xs text-indigo-500 font-mono">{c.course_code}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="badge badge-primary badge-sm">{c.credit_hours} cr</span>
                    <span className="text-xs text-gray-400">{c.department}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Classes */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 text-sm">Upcoming Classes</h3>
            <span className="badge badge-success badge-sm">{days.length} days/week</span>
          </div>
          {schedule.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
              <span className="text-4xl">📅</span>
              <p className="text-sm">No schedule generated yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {schedule.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 border border-primary-100 rounded-xl hover:bg-indigo-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold leading-tight text-center">
                      {s.day?.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{s.course_name}</p>
                      <p className="text-xs text-gray-500">{s.start_time} – {s.end_time}</p>
                    </div>
                  </div>
                  <span className="badge badge-outline badge-sm">{s.room_number}</span>
                </div>
              ))}
              {schedule.length > 5 && (
                <p className="text-xs text-center text-gray-400 pt-1">+{schedule.length - 5} more in My Schedule</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Availability Heatmap */}
      <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 text-sm">Availability Overview</h3>
          <span className="badge badge-outline badge-sm">{availCount} available slots</span>
        </div>
        {vacancies.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-gray-400 gap-2">
            <span className="text-4xl">🗓️</span>
            <p className="text-sm">No vacancies submitted yet — go to Submit Vacancy</p>
          </div>
        ) : (
          <AvailabilityGrid vacancies={enrichedVacancies} />
        )}
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
