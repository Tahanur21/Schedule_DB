import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTimeslots, submitVacancy, getMyVacancies } from "../../services/api";
import Layout from "../../components/Layout";

const SubmitVacancy = () => {
  const { token } = useAuth();
  const [timeslots, setTimeslots]   = useState([]);
  const [vacancies, setVacancies]   = useState([]);
  const [semester, setSemester]     = useState("Spring2025");
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [msg, setMsg]               = useState("");

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      getTimeslots(token),
      getMyVacancies(token, semester),
    ]).then(([slots, vacs]) => {
      setTimeslots(Array.isArray(slots) ? slots : []);
      setVacancies(Array.isArray(vacs) ? vacs : []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, [token, semester]);

  const isAvailable = (slotId) => {
    const found = vacancies.find((v) => v.time_slot_id === slotId);
    return found ? found.is_available : null;
  };

  const handleToggle = async (slotId, available) => {
    setSubmitting(slotId);
    setMsg("");
    const data = await submitVacancy(token, {
      time_slot_id: slotId,
      semester,
      is_available: available,
    });
    if (data.message) {
      setMsg("✅ Vacancy updated!");
      fetchData();
    } else {
      setMsg("❌ " + (data.error || "Failed"));
    }
    setSubmitting(null);
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">Set Vacancy</h2>
        <p className="text-gray-500 mt-1">Mark your available time slots for each semester</p>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Semester (e.g. Spring2025)"
          className="input input-bordered focus:input-primary rounded-xl"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <button className="btn btn-primary rounded-xl" onClick={fetchData}>
          Load
        </button>
      </div>

      {msg && (
        <div className={`alert text-sm py-2 mb-4 max-w-sm ${msg.startsWith("✅") ? "alert-success" : "alert-error"}`}>
          <span>{msg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : timeslots.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🕐</p>
          <p className="font-medium">No time slots found</p>
          <p className="text-sm mt-1">Admin needs to add time slots first</p>
        </div>
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const daySlots = timeslots.filter((s) => s.day_of_week === day);
            if (daySlots.length === 0) return null;
            return (
              <div key={day} className="bg-white rounded-2xl p-5 border border-primary-100 shadow-sm">
                <h3 className="font-heading text-lg text-gray-800 mb-4">{day}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {daySlots.map((slot) => {
                    const available = isAvailable(slot.id);
                    return (
                      <div
                        key={slot.id}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          available === true  ? "border-primary-400 bg-primary-50"  :
                          available === false ? "border-red-300 bg-red-50"          :
                          "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <p className="font-semibold text-gray-800 text-sm mb-1">
                          {slot.start_time} – {slot.end_time}
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          {available === true ? "✅ Available" : available === false ? "❌ Unavailable" : "⬜ Not set"}
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-xs btn-success rounded-lg flex-1"
                            disabled={submitting === slot.id}
                            onClick={() => handleToggle(slot.id, true)}
                          >
                            {submitting === slot.id ? <span className="loading loading-spinner loading-xs"></span> : "Available"}
                          </button>
                          <button
                            className="btn btn-xs btn-error rounded-lg flex-1"
                            disabled={submitting === slot.id}
                            onClick={() => handleToggle(slot.id, false)}
                          >
                            Busy
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
};

export default SubmitVacancy;
