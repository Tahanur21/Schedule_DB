import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getStudentSchedule } from "../../services/api";
import Layout from "../../components/Layout";
import ScheduleTable from "../../components/ScheduleTable";

const StudentSchedule = () => {
  const { token } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [semester, setSemester] = useState("Spring2025");

  const fetchSchedule = () => {
    setLoading(true);
    getStudentSchedule(token, semester).then((data) => {
      setSchedule(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchSchedule(); }, [token]);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">My Schedule</h2>
        <p className="text-gray-500 mt-1">Your department's class schedule</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
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
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <ScheduleTable schedules={schedule} />
      )}
    </Layout>
  );
};

export default StudentSchedule;
