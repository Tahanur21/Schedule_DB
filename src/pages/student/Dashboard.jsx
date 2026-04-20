import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentSchedule } from "../../services/api";
import { mockStudentCharts, mockStudentStats } from "../../services/mockData";
import Layout from "../../components/Layout";

// ── Circular Attendance Chart ─────────────────────────────────────────────────
const AttendanceCircle = ({ attended, total, courseName, courseCode, color = "#6366f1" }) => {
  const size = 80;
  const thickness = 10;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? attended / total : 0;
  const filled = pct * circ;
  const status = pct >= 0.75 ? "text-emerald-500" : pct >= 0.5 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={thickness}
            strokeDasharray={`${filled} ${circ - filled}`}
            strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-sm font-bold ${status}`}>{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-700 leading-tight">{courseName}</p>
        <p className="text-xs text-indigo-400 font-mono mt-0.5">{courseCode}</p>
        <p className="text-xs text-gray-400 mt-1">{attended}/{total} classes</p>
      </div>
    </div>
  );
};

// ── Week Heatmap ──────────────────────────────────────────────────────────────
const WeekHeatmap = ({ schedule }) => {
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
  const byDay = days.map((day) => ({
    day,
    classes: schedule.filter((s) => s.day === day),
  }));

  return (
    <div className="flex gap-2 flex-wrap">
      {byDay.map(({ day, classes }) => (
        <div key={day} className="flex-1 min-w-[56px]">
          <p className="text-xs text-center text-gray-400 mb-1">{day.slice(0,3)}</p>
          <div
            className="rounded-xl border text-center py-3 text-xs font-semibold transition-all"
            style={{
              background: classes.length > 0 ? `rgba(99,102,241,${0.15 + classes.length * 0.15})` : "#f8fafc",
              borderColor: classes.length > 0 ? "#c7d2fe" : "#e2e8f0",
              color: classes.length > 0 ? "#4338ca" : "#cbd5e1",
            }}
          >
            {classes.length > 0 ? `${classes.length} class${classes.length > 1 ? "es" : ""}` : "–"}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Mock attendance data (replace with real API when available) ───────────────
const buildAttendanceMock = (schedule) => {
  const byCode = {};
  schedule.forEach((s) => {
    if (!byCode[s.course_code]) {
      byCode[s.course_code] = {
        courseName: s.course_name,
        courseCode: s.course_code,
        total: 0,
        attended: 0,
      };
    }
    byCode[s.course_code].total += 10; // 10 weeks per slot
    byCode[s.course_code].attended += Math.floor(7 + Math.random() * 3); // 7–10 attended
  });
  return Object.values(byCode);
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
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <polyline points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const COLORS = ["#6366f1","#22d3ee","#10b981","#f59e0b","#f43f5e","#a855f7"];

// ─────────────────────────────────────────────────────────────────────────────
const StudentDashboard = () => {
  const { token, user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const semester = "Spring2025";
  const studentId = user?.id || "STU001";
  const rawStats = mockStudentStats(studentId);
  const stats = {
    gpa: rawStats?.current_gpa ?? rawStats?.cumulative_gpa ?? 0,
    enrolledCourses: rawStats?.total_courses ?? 0,
    completedCredits: rawStats?.completed_courses ?? 0,
    currentCredits: rawStats?.total_credits ?? 0,
  };

  useEffect(() => {
    getStudentSchedule(token, semester).then((data) => {
      setSchedule(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [token]);

  const days = [...new Set(schedule.map((s) => s.day))];
  const attendanceData = buildAttendanceMock(schedule);
  const overallPct = attendanceData.length
    ? Math.round(attendanceData.reduce((s, a) => s + a.attended / a.total, 0) / attendanceData.length * 100)
    : 0;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">Welcome, {user?.name} 👋</h2>
        <p className="text-gray-500 mt-1">
          <span className="font-medium text-indigo-500">{semester}</span> · {user?.department || "Computer Science"}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: "📅", label: "Total Slots",     value: schedule.length, bg: "bg-indigo-50",  text: "text-indigo-600" },
          { icon: "📚", label: "Courses",         value: stats.enrolledCourses, bg: "bg-emerald-50", text: "text-emerald-600" },
          { icon: "⭐", label: "Current GPA",     value: (stats?.gpa ?? 0).toFixed(2),
 bg: "bg-cyan-50", text: "text-cyan-600" },
          { icon: "✅", label: "Avg Attendance",  value: loading ? "—" : `${overallPct}%`, bg: overallPct >= 75 ? "bg-emerald-50" : "bg-amber-50", text: overallPct >= 75 ? "text-emerald-600" : "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-primary-100 shadow-sm`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* GPA & Credits Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* GPA Trend */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 text-sm mb-4">GPA Trend</h3>
          <div className="h-24">
            <LineChart data={mockStudentCharts.gpa_trend.map(d => ({ value: d.gpa, label: d.semester }))} height={80} color="#10b981" />
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">Cumulative GPA: {(stats?.gpa ?? 0).toFixed(2)}</p>        </div>

        {/* Credits Progress */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 text-sm mb-4">Credits Progress</h3>
          <div className="space-y-3">
            {[
              { label: "Completed", value: stats.completedCredits, max: 120, color: "bg-emerald-400" },
              { label: "In Progress", value: stats.currentCredits, max: 120, color: "bg-indigo-400" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.value}/{item.max}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full transition-all`} style={{ width: `${(item.value / item.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Circles */}
      <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-700 text-sm">Attendance by Course</h3>
          <div className="flex gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />≥75% OK</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />50–75%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />&lt;50% Low</span>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><span className="loading loading-spinner text-primary" /></div>
        ) : attendanceData.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">No schedule found for your department</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {attendanceData.map((a, i) => (
              <AttendanceCircle
                key={a.courseCode}
                courseName={a.courseName}
                courseCode={a.courseCode}
                attended={a.attended}
                total={a.total}
                color={COLORS[i % COLORS.length]}
              />
            ))}
          </div>
        )}
      </div>

      {/* Weekly Heatmap */}
      <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-700 text-sm mb-4">Weekly Class Distribution</h3>
        {loading ? (
          <div className="flex justify-center py-4"><span className="loading loading-spinner text-primary" /></div>
        ) : (
          <WeekHeatmap schedule={schedule} />
        )}
      </div>

      {/* Full Schedule List */}
      <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-700 text-sm">All Classes This Semester</h3>
          <span className="badge badge-primary badge-sm">{schedule.length} total</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><span className="loading loading-spinner text-primary" /></div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p>No schedule found for your department</p>
          </div>
        ) : (
          <div className="space-y-2">
            {schedule.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold text-center leading-tight">
                    {s.day?.slice(0, 3)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{s.course_name}</p>
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
