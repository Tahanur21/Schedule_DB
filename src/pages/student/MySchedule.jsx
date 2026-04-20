import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentSchedule } from "../../services/api";
import Layout from "../../components/Layout";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const StudentSchedule = () => {
  const { token } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [semester, setSemester] = useState("Spring2025");
  const [view, setView]         = useState("timetable");

  const fetchSchedule = () => {
    setLoading(true);
    getStudentSchedule(token, semester).then((data) => {
      setSchedule(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchSchedule(); }, [token]);

  const getClassAt = (day, time) => {
    return schedule.filter((s) => {
      const slotHour = s.start_time?.slice(0, 5);
      return s.day === day && slotHour === time;
    });
  };

  const isLab = (s) => s.course_code?.toLowerCase().includes("lab") ||
                        s.course_name?.toLowerCase().includes("lab");

  const totalTheoryCredits = schedule
    .filter((s) => !isLab(s))
    .reduce((sum, s) => sum + (s.credit_hours || 3), 0);

  const totalLabCredits = schedule
    .filter((s) => isLab(s))
    .reduce((sum, s) => sum + (s.credit_hours || 1.5), 0);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">My Schedule</h2>
        <p className="text-gray-500 mt-1">Your department's class timetable</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Semester (e.g. Spring2025)"
          className="input input-bordered focus:input-primary rounded-xl"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <button className="btn btn-primary rounded-xl" onClick={fetchSchedule}>
          🔍 Search
        </button>

        {/* View Toggle */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setView("timetable")}
            className={`btn btn-sm rounded-xl ${view === "timetable" ? "btn-primary" : "btn-outline"}`}
          >
            📅 Timetable
          </button>
          <button
            onClick={() => setView("list")}
            className={`btn btn-sm rounded-xl ${view === "list" ? "btn-primary" : "btn-outline"}`}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      {!loading && schedule.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-2xl border border-primary-100">
          <div className="text-sm text-gray-500">
            Total classes: <span className="font-semibold text-gray-800">{schedule.length}</span>
          </div>
          <div className="text-sm text-gray-500">
            Theory credits:{" "}
            <span className="font-semibold text-blue-700">{totalTheoryCredits}</span>
          </div>
          <div className="text-sm text-gray-500">
            Lab credits:{" "}
            <span className="font-semibold text-green-700">{totalLabCredits}</span>
          </div>
          <div className="text-sm text-gray-500">
            Total credits:{" "}
            <span className="font-semibold text-primary-700">
              {totalTheoryCredits + totalLabCredits}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : schedule.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium">No schedule found</p>
        </div>
      ) : view === "timetable" ? (

        /* ── TIMETABLE VIEW ── */
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-x-auto">
          {/* Legend */}
          <div className="flex gap-4 px-4 pt-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 rounded bg-blue-400"></div> Theory
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-3 h-3 rounded bg-green-400"></div> Lab
            </div>
          </div>

          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-primary-100">
                <th className="text-xs font-medium text-gray-400 py-3 px-3 text-right w-16">
                  Time
                </th>
                {DAYS.map((d) => (
                  <th key={d} className="text-xs font-medium text-gray-600 py-3 px-2 text-center">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map((time) => (
                <tr key={time} className="border-b border-gray-50">
                  <td className="text-xs text-gray-400 text-right px-3 py-2 bg-gray-50 whitespace-nowrap">
                    {time}
                  </td>
                  {DAYS.map((day) => {
                    const classes = getClassAt(day, time);
                    return (
                      <td
                        key={day}
                        className="px-1 py-1 border-l border-gray-50 align-top"
                        style={{ minHeight: "60px" }}
                      >
                        {classes.map((cls) => (
                          <div
                            key={cls.id}
                            className={`rounded-lg p-2 mb-1 border-l-4 ${
                              isLab(cls)
                                ? "bg-green-50 border-green-500"
                                : "bg-blue-50 border-blue-500"
                            }`}
                          >
                            <p className="text-xs font-semibold text-gray-800 leading-tight">
                              {cls.course_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{cls.room_number}</p>
                            <p
                              className={`text-xs mt-1 font-medium ${
                                isLab(cls) ? "text-green-700" : "text-blue-700"
                              }`}
                            >
                              {isLab(cls) ? "Lab · 1.5 cr" : "Theory · 3 cr"}
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
      ) : (

        /* ── LIST VIEW ── */
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          <table className="table table-zebra w-full">
            <thead className="bg-primary-600 text-white">
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Type</th>
                <th>Teacher</th>
                <th>Room</th>
                <th>Day</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((s, i) => (
                <tr key={s.id} className="hover">
                  <td className="text-gray-400">{i + 1}</td>
                  <td>
                    <p className="font-semibold text-gray-800">{s.course_name}</p>
                    <p className="text-xs font-mono text-primary-600">{s.course_code}</p>
                  </td>
                  <td>
                    <span
                      className={`badge badge-sm ${
                        isLab(s) ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                      } border-0`}
                    >
                      {isLab(s) ? "Lab" : "Theory"}
                    </span>
                  </td>
                  <td className="text-gray-600 text-sm">{s.teacher_name}</td>
                  <td>
                    <span className="badge badge-outline badge-sm">{s.room_number}</span>
                  </td>
                  <td className="text-gray-600">{s.day}</td>
                  <td className="text-gray-500 text-sm">
                    {s.start_time} – {s.end_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default StudentSchedule;