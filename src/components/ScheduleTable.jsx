const isLab = (s) =>
  s.course_code?.toLowerCase().includes("l") || s.course_name?.toLowerCase().includes("lab");

const statusBadge = (status) => {
  const map = {
    active:   "badge-success",
    conflict: "badge-error",
    pending:  "badge-warning",
  };
  return `badge badge-sm ${map[status] || "badge-ghost"}`;
};

const ScheduleTable = ({ schedules }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-primary-100 shadow-sm text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium">No schedules found</p>
        <p className="text-sm mt-1">Try a different semester or generate a schedule first</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
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
          {schedules.map((s, i) => (
            <tr key={s.id} className="hover">
              <td className="text-gray-400 text-sm">{i + 1}</td>
              <td>
                <p className="font-semibold text-gray-800 text-sm">{s.course_name}</p>
                <p className="text-xs text-indigo-500 font-mono">{s.course_code}</p>
              </td>
              <td>
                <span className={`badge badge-sm border-0 ${isLab(s) ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                  {isLab(s) ? "🔬 Lab" : "📖 Theory"}
                </span>
              </td>
              <td className="text-gray-600 text-sm">{s.teacher_name || "—"}</td>
              <td><span className="badge badge-outline badge-sm">{s.room_number}</span></td>
              <td className="text-gray-600 text-sm">{s.day}</td>
              <td className="text-gray-500 text-sm whitespace-nowrap">{s.start_time} – {s.end_time}</td>
              <td><span className={statusBadge(s.status)}>{s.status || "active"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
        {schedules.length} schedule slot{schedules.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default ScheduleTable;
