const ScheduleTable = ({ schedules }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium">No schedules found</p>
      </div>
    );
  }

  const statusBadge = (status) => {
    const map = {
      active:   "badge badge-success badge-sm",
      conflict: "badge badge-error badge-sm",
      pending:  "badge badge-warning badge-sm",
    };
    return map[status] || "badge badge-ghost badge-sm";
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-primary-100">
      <table className="table table-zebra w-full">
        <thead className="bg-primary-600 text-white">
          <tr>
            <th>#</th>
            <th>Course</th>
            <th>Teacher</th>
            <th>Room</th>
            <th>Day</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s, i) => (
            <tr key={s.id} className="hover">
              <td className="text-gray-400 text-sm">{i + 1}</td>
              <td>
                <div>
                  <p className="font-semibold text-gray-800">{s.course_name}</p>
                  <p className="text-xs text-primary-600">{s.course_code}</p>
                </div>
              </td>
              <td className="text-gray-600">{s.teacher_name || "—"}</td>
              <td>
                <span className="badge badge-outline badge-sm">{s.room_number}</span>
              </td>
              <td className="text-gray-600">{s.day}</td>
              <td className="text-gray-600 text-sm">
                {s.start_time} – {s.end_time}
              </td>
              <td>
                <span className={statusBadge(s.status)}>{s.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleTable;
