import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyCourses, getTeacherSchedule } from "../../services/api";
import Layout from "../../components/Layout";

// ── Mini Donut ────────────────────────────────────────────────────────────────
const MiniDonut = ({ slices, size = 100, thickness = 14 }) => {
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const total = slices.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={thickness} />
      {slices.map((s, i) => {
        const dash = (s.value / total) * circ;
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={s.color} strokeWidth={thickness}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset} strokeLinecap="butt" />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
};

const COLORS = ["#6366f1","#22d3ee","#10b981","#f59e0b","#f43f5e","#a855f7"];

// ─────────────────────────────────────────────────────────────────────────────
const MyCourses = () => {
  const { token } = useAuth();
  const [courses,  setCourses]  = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const semester = "Spring2025";

  useEffect(() => {
    Promise.all([
      getMyCourses(token),
      getTeacherSchedule(token, semester),
    ]).then(([c, s]) => {
      setCourses(Array.isArray(c) ? c : []);
      setSchedule(Array.isArray(s) ? s : []);
      setLoading(false);
    });
  }, [token]);

  const totalCredits  = courses.reduce((s, c) => s + (c.credit_hours || 0), 0);
  const theoryCount   = courses.filter((c) => !c.course_code?.toLowerCase().includes("l")).length;
  const labCount      = courses.length - theoryCount;

  const donutSlices = courses.map((c, i) => ({
    label: c.course_code,
    value: c.credit_hours,
    color: COLORS[i % COLORS.length],
  }));

  // Count scheduled sessions per course
  const sessionsFor = (courseCode) =>
    schedule.filter((s) => s.course_code === courseCode).length;

  return (
    <Layout>
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">My Courses</h2>
        <p className="text-gray-500 mt-1">Courses assigned to you for <span className="font-medium text-indigo-500">{semester}</span></p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium">No courses assigned yet</p>
          <p className="text-sm mt-1">Contact the admin to get courses assigned</p>
        </div>
      ) : (
        <>
          {/* Summary Panel */}
          <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative shrink-0">
              <MiniDonut slices={donutSlices} size={110} thickness={16} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-bold text-gray-800">{totalCredits}</p>
                <p className="text-xs text-gray-400">credits</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 flex-1 justify-center sm:justify-start">
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Total Courses</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-indigo-600">{theoryCount}</p>
                <p className="text-xs text-gray-500 mt-0.5">Theory</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-emerald-600">{labCount}</p>
                <p className="text-xs text-gray-500 mt-0.5">Lab</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-2xl font-bold text-cyan-600">{schedule.length}</p>
                <p className="text-xs text-gray-500 mt-0.5">Scheduled Slots</p>
              </div>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {donutSlices.map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-gray-500">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c, i) => {
              const sessions = sessionsFor(c.course_code);
              const isLab    = c.course_code?.toLowerCase().includes("l") || c.course_name?.toLowerCase().includes("lab");
              return (
                <div key={c.id} className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm hover:shadow-md transition-shadow group">
                  {/* Top accent bar */}
                  <div className="h-1 rounded-full mb-4 -mx-6 -mt-6 rounded-t-2xl" style={{ background: COLORS[i % COLORS.length] }} />

                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                         style={{ background: COLORS[i % COLORS.length] + "20" }}>
                      {isLab ? "🔬" : "📖"}
                    </div>
                    <span className={`badge badge-sm ${isLab ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"} border-0`}>
                      {isLab ? "Lab" : "Theory"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-800 leading-snug mb-1">{c.course_name}</h3>
                  <p className="font-mono text-sm mb-4" style={{ color: COLORS[i % COLORS.length] }}>{c.course_code}</p>

                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-50">
                    <span>{c.department || "Computer Science"}</span>
                    <div className="flex gap-2">
                      <span className="badge badge-outline badge-xs">{c.credit_hours} cr</span>
                      {sessions > 0 && (
                        <span className="badge badge-success badge-xs">{sessions} slots</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Layout>
  );
};

export default MyCourses;
