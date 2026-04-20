import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getTimeslots, submitVacancy, getMyVacancies } from "../../services/api";
import Layout from "../../components/Layout";

const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const SubmitVacancy = () => {
  const { token } = useAuth();
  const [timeslots,  setTimeslots]  = useState([]);
  const [vacancies,  setVacancies]  = useState([]);
  const [semester,   setSemester]   = useState("Spring2025");
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(null);
  const [msg,        setMsg]        = useState({ type: "", text: "" });

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

  useEffect(() => { fetchData(); }, [token]);

  const getStatus = (slotId) => {
    const v = vacancies.find((v) => v.time_slot_id === slotId);
    return v ? (v.is_available ? "available" : "busy") : "unset";
  };

  const handleToggle = async (slotId, available) => {
    setSubmitting(slotId);
    setMsg({ type: "", text: "" });
    const data = await submitVacancy(token, { time_slot_id: slotId, semester, is_available: available });
    if (data.message || data.id) {
      setMsg({ type: "success", text: "✅ Vacancy updated!" });
      fetchData();
    } else {
      setMsg({ type: "error", text: "❌ " + (data.error || "Failed to update") });
    }
    setSubmitting(null);
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  const handleMarkAll = async (day, available) => {
    const daySlots = timeslots.filter((s) => s.day_of_week === day);
    for (const slot of daySlots) {
      await submitVacancy(token, { time_slot_id: slot.id, semester, is_available: available });
    }
    setMsg({ type: "success", text: `✅ All ${day} slots marked as ${available ? "available" : "busy"}` });
    fetchData();
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  const availableCount = vacancies.filter((v) => v.is_available).length;
  const busyCount      = vacancies.filter((v) => !v.is_available).length;
  const unsetCount     = timeslots.length - vacancies.length;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">Set Vacancy</h2>
        <p className="text-gray-500 mt-1">Mark your available time slots for the scheduler to use</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text" placeholder="Semester (e.g. Spring2025)"
          className="input input-bordered focus:input-primary rounded-xl text-sm w-48"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
        />
        <button className="btn btn-primary btn-sm rounded-xl px-4" onClick={fetchData}>
          🔄 Load
        </button>
      </div>

      {/* Status Summary */}
      {!loading && timeslots.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Available", value: availableCount, color: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: "✅" },
            { label: "Busy",      value: busyCount,      color: "bg-rose-50 text-rose-700 border-rose-100",         icon: "❌" },
            { label: "Not Set",   value: unsetCount,     color: "bg-gray-50 text-gray-500 border-gray-100",         icon: "⬜" },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-2xl p-4 border shadow-sm text-center`}>
              <div className="text-xl mb-1">{s.icon}</div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-75 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Alert */}
      {msg.text && (
        <div className={`alert text-sm py-2 mb-4 rounded-xl max-w-sm ${msg.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : timeslots.length === 0 ? (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🕐</p>
          <p className="font-medium">No time slots configured</p>
          <p className="text-sm mt-1">Ask the admin to add time slots first</p>
        </div>
      ) : (
        <div className="space-y-5">
          {DAYS.map((day) => {
            const daySlots = timeslots.filter((s) => s.day_of_week === day);
            if (daySlots.length === 0) return null;

            const dayAvail = daySlots.filter((s) => getStatus(s.id) === "available").length;
            const allSet   = daySlots.every((s) => getStatus(s.id) !== "unset");

            return (
              <div key={day} className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
                {/* Day Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-800">{day}</h3>
                    <span className="text-xs text-gray-400">{daySlots.length} slot{daySlots.length !== 1 ? "s" : ""}</span>
                    {dayAvail > 0 && (
                      <span className="badge badge-success badge-xs">{dayAvail} available</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-xs btn-success rounded-lg"
                      onClick={() => handleMarkAll(day, true)}>
                      Mark All Available
                    </button>
                    <button className="btn btn-xs btn-error btn-outline rounded-lg"
                      onClick={() => handleMarkAll(day, false)}>
                      Mark All Busy
                    </button>
                  </div>
                </div>

                {/* Slot Cards */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {daySlots.map((slot) => {
                    const status = getStatus(slot.id);
                    const isSubmitting = submitting === slot.id;

                    return (
                      <div key={slot.id}
                        className={`rounded-xl border-2 p-4 transition-all ${
                          status === "available" ? "border-emerald-300 bg-emerald-50" :
                          status === "busy"      ? "border-rose-300 bg-rose-50" :
                          "border-gray-200 bg-gray-50"
                        }`}>
                        {/* Time */}
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-semibold text-gray-800 text-sm">
                            {slot.start_time?.slice(0,5)} – {slot.end_time?.slice(0,5)}
                          </p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            status === "available" ? "bg-emerald-100 text-emerald-700" :
                            status === "busy"      ? "bg-rose-100 text-rose-700" :
                            "bg-gray-100 text-gray-500"
                          }`}>
                            {status === "available" ? "✅ Available" : status === "busy" ? "❌ Busy" : "⬜ Not set"}
                          </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2">
                          <button
                            className={`btn btn-xs rounded-lg flex-1 ${status === "available" ? "btn-success" : "btn-outline btn-success"}`}
                            disabled={isSubmitting || status === "available"}
                            onClick={() => handleToggle(slot.id, true)}
                          >
                            {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : "Available"}
                          </button>
                          <button
                            className={`btn btn-xs rounded-lg flex-1 ${status === "busy" ? "btn-error" : "btn-outline btn-error"}`}
                            disabled={isSubmitting || status === "busy"}
                            onClick={() => handleToggle(slot.id, false)}
                          >
                            {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : "Busy"}
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
