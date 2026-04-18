import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { generateSchedule } from "../../services/api";
import Layout from "../../components/Layout";

const GenerateSchedule = () => {
  const { token } = useAuth();
  const [semester, setSemester] = useState("Spring2025");
  const [loading, setLoading]   = useState(false);
  const [report, setReport]     = useState(null);
  const [error, setError]       = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setReport(null);
    try {
      const data = await generateSchedule(token, semester);
      if (data.semester) {
        setReport(data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">Generate Schedule</h2>
        <p className="text-gray-500 mt-1">Auto-assign courses to rooms and time slots</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm mb-6 max-w-lg">
        <h3 className="font-heading text-xl text-gray-800 mb-4">Scheduler Settings</h3>
        <div className="form-control mb-4">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Semester</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Spring2025"
            className="input input-bordered focus:input-primary rounded-xl w-full"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-full rounded-xl"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Generating...
            </>
          ) : (
            "⚡ Generate Schedule"
          )}
        </button>

        {error && (
          <div className="alert alert-error mt-4 text-sm py-2">
            <span>⚠️ {error}</span>
          </div>
        )}
      </div>

      {/* Report */}
      {report && (
        <div className="space-y-6 page-enter">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Semester",       value: report.semester,       color: "bg-primary-50 text-primary-700" },
              { label: "Total Courses",  value: report.total_courses,  color: "bg-blue-50 text-blue-700" },
              { label: "Scheduled",      value: report.scheduled,      color: "bg-green-50 text-green-700" },
              { label: "Conflicts",      value: report.conflicts,      color: "bg-red-50 text-red-700" },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-4 ${s.color} border border-opacity-20`}>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm mt-1 opacity-80">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Scheduled Details */}
          {report.schedule_details?.length > 0 && (
            <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-primary-50">
                <h3 className="font-heading text-xl text-gray-800">
                  ✅ Successfully Scheduled ({report.schedule_details.length})
                </h3>
              </div>
              <table className="table table-zebra w-full">
                <thead className="bg-primary-600 text-white">
                  <tr>
                    <th>Course</th>
                    <th>Room</th>
                    <th>Day</th>
                    <th>Time</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {report.schedule_details.map((s, i) => (
                    <tr key={i} className="hover">
                      <td>
                        <p className="font-semibold text-gray-800">{s.course_name}</p>
                        <p className="text-xs text-primary-600 font-mono">{s.course}</p>
                      </td>
                      <td>
                        <span className="badge badge-outline badge-sm">{s.room}</span>
                      </td>
                      <td className="text-gray-600">{s.day}</td>
                      <td className="text-gray-600 text-sm">
                        {s.start_time} – {s.end_time}
                      </td>
                      <td>
                        <span className="badge badge-success badge-sm">{s.score}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Conflict Details */}
          {report.conflict_details?.length > 0 && (
            <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-red-50">
                <h3 className="font-heading text-xl text-red-700">
                  ❌ Conflicts ({report.conflict_details.length})
                </h3>
              </div>
              <table className="table w-full">
                <thead className="bg-red-500 text-white">
                  <tr>
                    <th>Course</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {report.conflict_details.map((c, i) => (
                    <tr key={i} className="hover">
                      <td className="font-mono font-semibold text-gray-800">{c.course}</td>
                      <td className="text-gray-500 text-sm">{c.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default GenerateSchedule;
