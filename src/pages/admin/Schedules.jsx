import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAdminSchedules } from "../../services/api";
import Layout from "../../components/Layout";

const DAYS  = ["Sunday","Monday","Tuesday","Wednesday","Thursday"];
const TIMES = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00"];

const isLab = (s) =>
  s.course_code?.toLowerCase().includes("l") || s.course_name?.toLowerCase().includes("lab");

const AdminSchedules = () => {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [semester,  setSemester]  = useState("Spring2025");
  const [view,      setView]      = useState("timetable");
  const [dayFilter, setDayFilter] = useState("all");
  const [search,    setSearch]    = useState("");

  const fetchSchedules = () => {
    setLoading(true);
    getAdminSchedules(token, semester).then((data) => {
      setSchedules(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchSchedules(); }, [token]);

  const getClassAt = (day, time) =>
    schedules.filter((s) => s.day === day && s.start_time?.slice(0,5) === time);

  const filtered = schedules.filter((s) => {
    const matchDay    = dayFilter === "all" || s.day === dayFilter;
    const matchSearch = !search ||
      s.course_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.teacher_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.room_number?.toLowerCase().includes(search.toLowerCase());
    return matchDay && matchSearch;
  });

  const byDay = DAYS.map((day) => schedules.filter((s) => s.day === day).length);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">All Schedules</h2>
        <p className="text-gray-500 mt-1">View and browse generated schedules by semester</p>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <input
          type="text" placeholder="Semester (e.g. Spring2025)"
          className="input input-bordered focus:input-primary rounded-xl text-sm w-48"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <button className="btn btn-primary rounded-xl btn-sm px-4" onClick={fetchSchedules}>
          🔍 Load
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

        {/* View Toggle */}
        <div className="flex gap-2">
          <button onClick={() => setView("timetable")}
            className={`btn btn-sm rounded-xl ${view === "timetable" ? "btn-primary" : "btn-outline"}`}>
            📅 Timetable
          </button>
          <button onClick={() => setView("list")}
            className={`btn btn-sm rounded-xl ${view === "list" ? "btn-primary" : "btn-outline"}`}>
            📋 List
          </button>
        </div>

        {/* List search */}
        {view === "list" && (
          <input
            type="text" placeholder="Search course, teacher, room…"
            className="input input-bordered focus:input-primary rounded-xl text-sm w-56 ml-auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </div>

      {/* Summary Strip */}
      {!loading && schedules.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-5">
          {[
            { label: "Total Slots",  value: schedules.length,                          color: "bg-indigo-50 text-indigo-700" },
            { label: "Theory",       value: schedules.filter((s) => !isLab(s)).length, color: "bg-blue-50 text-blue-700" },
            { label: "Lab",          value: schedules.filter(isLab).length,            color: "bg-emerald-50 text-emerald-700" },
            { label: "Active Days",  value: byDay.filter((n) => n > 0).length,         color: "bg-amber-50 text-amber-700" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl px-4 py-2 border border-primary-100 shadow-sm flex items-center gap-2`}>
              <span className="text-xl font-bold">{s.value}</span>
              <span className="text-xs opacity-75">{s.label}</span>
            </div>
          ))}

          {/* Day quick filter for list view */}
          {view === "list" && (
            <div className="flex gap-1.5 ml-auto flex-wrap">
              {["all", ...DAYS].map((d) => (
                <button key={d} onClick={() => setDayFilter(d)}
                  className={`btn btn-xs rounded-lg ${dayFilter === d ? "btn-primary" : "btn-outline"}`}>
                  {d === "all" ? "All" : d.slice(0,3)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium">No schedules found for {semester}</p>
          <p className="text-sm mt-1">Generate a schedule first from the Generate Schedule page</p>
        </div>

      ) : view === "timetable" ? (

        /* ── TIMETABLE VIEW ── */
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          <div className="flex gap-4 px-5 py-3 border-b border-gray-50 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-300 inline-block"/>Theory</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-300 inline-block"/>Lab</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-xs text-gray-400 font-normal py-3 px-3 text-right w-16 bg-gray-50">Time</th>
                  {DAYS.map((d) => (
                    <th key={d} className="text-xs font-semibold text-gray-600 py-3 px-2 text-center">
                      <div>{d}</div>
                      <div className="text-gray-400 font-normal">{schedules.filter((s)=>s.day===d).length} class{schedules.filter((s)=>s.day===d).length!==1?"es":""}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIMES.map((time) => (
                  <tr key={time} className="border-b border-gray-50">
                    <td className="text-xs text-gray-400 text-right px-3 py-1.5 bg-gray-50 whitespace-nowrap">{time}</td>
                    {DAYS.map((day) => {
                      const classes = getClassAt(day, time);
                      return (
                        <td key={day} className="px-1 py-1.5 border-l border-gray-50 align-top min-h-[48px]">
                          {classes.map((cls) => (
                            <div key={cls.id}
                              className={`rounded-lg p-2 mb-1 border-l-4 text-left ${isLab(cls) ? "bg-emerald-50 border-emerald-400" : "bg-blue-50 border-blue-400"}`}>
                              <p className="text-xs font-semibold text-gray-800 leading-tight truncate" title={cls.course_name}>
                                {cls.course_name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{cls.room_number}</p>
                              <p className={`text-xs mt-0.5 font-medium ${isLab(cls) ? "text-emerald-600" : "text-blue-600"}`}>
                                {cls.teacher_name}
                              </p>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ) : (

        /* ── LIST VIEW ── */
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No results match your filter</p>
            </div>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-white/80 font-medium text-xs">#</th>
                  <th className="text-white/80 font-medium text-xs">Course</th>
                  <th className="text-white/80 font-medium text-xs">Type</th>
                  <th className="text-white/80 font-medium text-xs">Teacher</th>
                  <th className="text-white/80 font-medium text-xs">Room</th>
                  <th className="text-white/80 font-medium text-xs">Day</th>
                  <th className="text-white/80 font-medium text-xs">Time</th>
                  <th className="text-white/80 font-medium text-xs">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id} className="hover">
                    <td className="text-gray-400 text-sm">{i + 1}</td>
                    <td>
                      <p className="font-semibold text-gray-800 text-sm">{s.course_name}</p>
                      <p className="text-xs text-indigo-500 font-mono">{s.course_code}</p>
                    </td>
                    <td>
                      <span className={`badge badge-sm border-0 ${isLab(s) ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                        {isLab(s) ? "Lab" : "Theory"}
                      </span>
                    </td>
                    <td className="text-gray-600 text-sm">{s.teacher_name || "—"}</td>
                    <td><span className="badge badge-outline badge-sm">{s.room_number}</span></td>
                    <td className="text-gray-600 text-sm">{s.day}</td>
                    <td className="text-gray-500 text-sm whitespace-nowrap">{s.start_time} – {s.end_time}</td>
                    <td>
                      <span className={`badge badge-sm ${s.status === "active" ? "badge-success" : s.status === "conflict" ? "badge-error" : "badge-warning"}`}>
                        {s.status || "active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {schedules.length} slots
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminSchedules;
