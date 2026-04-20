import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUsers, getRooms, getCourses, getAdminSchedules } from "../../services/api";
import Layout from "../../components/Layout";
import { mockUsers, mockRooms, mockCourses, mockSchedules, mockAdminStats, mockAdminCharts, mockAdminActivities, mockConflicts } from "../../services/mockData";

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutChart = ({ slices, size = 128, thickness = 22 }) => {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
      {slices.map((slice, i) => {
        const dash = (slice.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={slice.color} strokeWidth={thickness}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset} strokeLinecap="butt" />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
};

// ── Bar Chart ─────────────────────────────────────────────────────────────────
const BarChart = ({ data, height = 100 }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  const bw = 26, gap = 12;
  const tw = data.length * (bw + gap) - gap;
  return (
    <svg width="100%" viewBox={`0 0 ${tw + 4} ${height + 32}`} className="overflow-visible">
      {data.map((d, i) => {
        const bh = Math.max(4, (d.value / max) * height);
        const x = 2 + i * (bw + gap);
        const y = height - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={bh} rx={5} fill={d.color} opacity={0.9} />
            <text x={x + bw / 2} y={height + 14} textAnchor="middle" fontSize={8} fill="#94a3b8">{d.label}</text>
            {d.value > 0 && (
              <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#475569" fontWeight="600">{d.value}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── Line Chart ────────────────────────────────────────────────────────────────
const LineChart = ({ data, height = 100, color = "#6366f1" }) => {
  if (!data || data.length < 2) return <div className="text-gray-400 text-sm text-center py-8">No data available</div>;
  
  const max = Math.max(...data.map((d) => d.enrollments || d.value || d.utilization || d.attendance), 1);
  const min = 0;
  const w = 100 / (data.length - 1);
  const h = height / (max - min);
  
  const points = data.map((d, i) => {
    const val = d.enrollments || d.value || d.utilization || d.attendance || 0;
    return { x: i * w, y: height - (val - min) * h };
  }).map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 100 ${height + 16}`} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      {data.map((d, i) => {
        const val = d.enrollments || d.value || d.utilization || d.attendance || 0;
        const x = i * w;
        const y = height - (val - min) * h;
        return (
          <circle key={i} cx={x} cy={y} r="1.5" fill={color} vectorEffect="non-scaling-stroke" />
        );
      })}
    </svg>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 border border-primary-100 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">
        {value !== null && value !== undefined ? value : <span className="loading loading-dots loading-sm" />}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-indigo-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [users, setUsers] = useState(mockUsers);
  const [rooms, setRooms] = useState(mockRooms);
  const [courses, setCourses] = useState(mockCourses);
  const [schedules, setSchedules] = useState(mockSchedules);
  const semester = "Spring2025";

  useEffect(() => {
    // Fetch from API, fallback to mock data
    const fetchData = async () => {
      try {
        const fetchedUsers = await getUsers(token);
        if (fetchedUsers) setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : mockUsers);
      } catch (e) {
        console.log("Using mock users");
      }
      
      try {
        const fetchedRooms = await getRooms(token);
        if (fetchedRooms) setRooms(Array.isArray(fetchedRooms) ? fetchedRooms : mockRooms);
      } catch (e) {
        console.log("Using mock rooms");
      }
      
      try {
        const fetchedCourses = await getCourses(token);
        if (fetchedCourses) setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : mockCourses);
      } catch (e) {
        console.log("Using mock courses");
      }
      
      try {
        const fetchedSchedules = await getAdminSchedules(token, semester);
        if (fetchedSchedules) setSchedules(Array.isArray(fetchedSchedules) ? fetchedSchedules : mockSchedules);
      } catch (e) {
        console.log("Using mock schedules");
      }
    };
    
    fetchData();
  }, [token]);

  const teachers = users?.filter((u) => u.role === "teacher").length ?? 0;
  const students = users?.filter((u) => u.role === "student").length ?? 0;
  const admins   = users?.filter((u) => u.role === "admin").length ?? 0;

  const userSlices = [
    { label: "Students", value: students, color: "#6366f1" },
    { label: "Teachers", value: teachers, color: "#22d3ee" },
    { label: "Admins",   value: admins,   color: "#f59e0b" },
  ].filter((s) => s.value > 0);

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
  const dayColors = ["#6366f1","#22d3ee","#10b981","#f59e0b","#f43f5e"];
  const schedByDay = days.map((day, i) => ({
    label: day.slice(0, 3),
    value: schedules.filter((s) => s.day === day).length,
    color: dayColors[i],
  }));

  const activeRooms   = rooms?.filter((r) => r.is_active).length ?? 0;
  const inactiveRooms = rooms?.filter((r) => !r.is_active).length ?? 0;
  
  const unresolvedConflicts = mockConflicts.filter((c) => !c.resolved).length;
  const resolvedConflicts = mockConflicts.filter((c) => c.resolved).length;

  return (
    <Layout>
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">Welcome back, {user?.name || "Admin"} 👋</h2>
        <p className="text-gray-500 mt-1">System overview for <span className="font-medium text-indigo-500">{semester}</span></p>
      </div>

      {/* Stat Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label="Total Users"  value={users?.length}  color="bg-indigo-50"  sub={`${admins} admin${admins !== 1 ? "s" : ""}`} />
        <StatCard icon="🎓" label="Teachers"     value={teachers}       color="bg-cyan-50" sub={admins > 0 ? `${Math.round(teachers/admins)} per admin` : `${teachers} total`} />
        <StatCard icon="🧑‍🎓" label="Students"  value={students}       color="bg-yellow-50" sub={courses?.length > 0 ? `${Math.round(students/courses?.length)} avg per course` : `${students} total`} />
        <StatCard icon="📚" label="Courses"      value={courses?.length} color="bg-emerald-50" sub={`${schedules.length} sessions`} />
      </div>

      {/* Stat Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🏛️" label="Total Rooms"  value={rooms?.length}  color="bg-purple-50" sub={`${activeRooms} active`} />
        <StatCard icon="📅" label="Schedules"     value={schedules.length} color="bg-pink-50" sub="Spring 2025" />
        <StatCard icon="⚠️" label="Conflicts"     value={mockConflicts.length} color="bg-orange-50" sub={`${unresolvedConflicts} pending`} />
        <StatCard icon="✅" label="Room Usage"    value={`${mockAdminStats.room_utilization}%`} color="bg-green-50" sub="This week" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        {/* Donut – Users */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm flex flex-col items-center">
          <h3 className="font-semibold text-gray-700 text-sm mb-4 self-start">User Distribution</h3>
          {users ? (
            <>
              <div className="relative mb-3">
                <DonutChart slices={userSlices} size={130} thickness={24} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-gray-800">{users.length}</p>
                  <p className="text-xs text-gray-400">Users</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {userSlices.map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-xs text-gray-500">{s.label} ({s.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-10"><span className="loading loading-spinner text-primary" /></div>
          )}
        </div>

        {/* Bar – Schedules by Day */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 text-sm mb-4">Schedules by Day</h3>
          <BarChart data={schedByDay} height={100} />
        </div>

        {/* Line – Enrollment Trends */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 text-sm mb-4">Enrollment Trends</h3>
          <LineChart data={mockAdminCharts.enrollment_trends} height={100} color="#10b981" />
        </div>
      </div>

      {/* Activity & Conflicts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">📋 Recent Activities</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockAdminActivities.map((activity) => (
              <div key={activity.id} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                <span className="text-lg mt-0.5 shrink-0">
                  {activity.type === "user_created" && "👤"}
                  {activity.type === "course_created" && "📚"}
                  {activity.type === "schedule_generated" && "📅"}
                  {activity.type === "conflict_resolved" && "✅"}
                  {activity.type === "room_added" && "🏛️"}
                  {activity.type === "user_edited" && "✏️"}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-400">{activity.timestamp}</p>
                    <p className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{activity.actor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conflicts Overview */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">⚠️ Conflict Summary</h3>
          <div className="space-y-3">
            {mockConflicts.map((conflict) => (
              <div key={conflict.id} className={`p-3 rounded-xl border-l-4 ${
                conflict.resolved ? "bg-green-50 border-green-400" : 
                conflict.severity === "high" ? "bg-red-50 border-red-400" : "bg-yellow-50 border-yellow-400"
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {conflict.type === "room_overlap" && "🏛️"}
                      {conflict.type === "instructor_overlap" && "👨‍🏫"}
                      {conflict.type === "time_overlap" && "⏰"}
                      {conflict.type === "capacity_exceeded" && "👥"}
                      {" "}
                      {conflict.courses?.[0]?.code || conflict.room}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{conflict.description}</p>
                  </div>
                  <span className={`badge badge-sm ${conflict.resolved ? "badge-success" : "badge-warning"}`}>
                    {conflict.resolved ? "✓ Resolved" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
