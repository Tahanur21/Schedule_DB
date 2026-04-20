import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getConflicts, resolveConflict } from "../../services/api";
import Layout from "../../components/Layout";

const CONFLICT_TYPES = {
  room_overlap: { icon: "🏛️", label: "Room Overlap", color: "badge-error" },
  instructor_overlap: { icon: "👨‍🏫", label: "Instructor Overlap", color: "badge-warning" },
  time_overlap: { icon: "⏰", label: "Time Overlap", color: "badge-info" },
  capacity_exceeded: { icon: "👥", label: "Capacity Exceeded", color: "badge-accent" },
};

const ConflictCard = ({ conflict, onResolve, isResolving }) => {
  const conflictType = CONFLICT_TYPES[conflict.type] || CONFLICT_TYPES.time_overlap;
  
  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-orange-300 shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{conflictType.icon}</span>
          <div>
            <h3 className="font-bold text-gray-800">{conflictType.label}</h3>
            <p className="text-xs text-gray-500">ID: {conflict.id}</p>
          </div>
        </div>
        <span className={`badge ${conflictType.color}`}>Conflict</span>
      </div>

      <div className="bg-orange-50 rounded-lg p-3 mb-3 space-y-2 text-sm">
        {conflict.courses && conflict.courses.length > 0 && (
          <div>
            <p className="font-medium text-gray-700">Conflicting Courses:</p>
            <ul className="list-disc list-inside text-gray-600 mt-1">
              {conflict.courses.map((course, i) => (
                <li key={i}>{course.code} - {course.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        {conflict.instructors && conflict.instructors.length > 0 && (
          <div>
            <p className="font-medium text-gray-700">Instructors:</p>
            <ul className="list-disc list-inside text-gray-600 mt-1">
              {conflict.instructors.map((instructor, i) => (
                <li key={i}>{instructor}</li>
              ))}
            </ul>
          </div>
        )}

        {conflict.room && (
          <div>
            <p className="font-medium text-gray-700">Room:</p>
            <p className="text-gray-600 mt-1">{conflict.room}</p>
          </div>
        )}

        {conflict.time && (
          <div>
            <p className="font-medium text-gray-700">Time:</p>
            <p className="text-gray-600 mt-1">{conflict.time}</p>
          </div>
        )}

        {conflict.description && (
          <div>
            <p className="font-medium text-gray-700">Details:</p>
            <p className="text-gray-600 mt-1">{conflict.description}</p>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <p className="text-sm font-medium text-blue-900">Suggested Resolution:</p>
        <p className="text-sm text-blue-700 mt-1">{conflict.suggestion || "Please review and resolve manually."}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onResolve(conflict)}
          disabled={isResolving}
          className="btn btn-sm btn-primary flex-1 rounded-lg"
        >
          {isResolving ? "Resolving..." : "🔧 Resolve"}
        </button>
        <button className="btn btn-sm btn-outline flex-1 rounded-lg">
          ℹ️ Details
        </button>
      </div>
    </div>
  );
};

// ── RESOLUTION MODAL ───────────────────────────────
const ResolutionModal = ({ isOpen, onClose, onSubmit, conflict, isLoading = false }) => {
  const [resolutionData, setResolutionData] = useState({
    action: "reschedule",
    newTime: "",
    newRoom: "",
    newInstructor: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResolutionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resolutionData.action) {
      alert("Please select a resolution action");
      return;
    }
    onSubmit({ conflictId: conflict.id, ...resolutionData });
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md max-h-screen overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Resolve Conflict</h3>
            
            <div className="bg-orange-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-orange-900">
                <span className="font-medium">Conflict Type:</span> {CONFLICT_TYPES[conflict?.type]?.label || "Unknown"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Resolution Action *</span></label>
                <select name="action" value={resolutionData.action} onChange={handleChange} className="select select-bordered focus:select-primary rounded-xl">
                  <option value="reschedule">Reschedule Course</option>
                  <option value="change_room">Change Room</option>
                  <option value="change_instructor">Assign Different Instructor</option>
                  <option value="split_section">Create Separate Section</option>
                  <option value="mark_resolved">Mark as Resolved</option>
                </select>
              </div>

              {resolutionData.action === "reschedule" && (
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">New Time</span></label>
                  <input type="text" name="newTime" value={resolutionData.newTime} onChange={handleChange}
                    placeholder="e.g., Monday 10:00 AM - 11:30 AM" className="input input-bordered focus:input-primary rounded-xl" />
                </div>
              )}

              {resolutionData.action === "change_room" && (
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">New Room</span></label>
                  <input type="text" name="newRoom" value={resolutionData.newRoom} onChange={handleChange}
                    placeholder="e.g., A-102" className="input input-bordered focus:input-primary rounded-xl" />
                </div>
              )}

              {resolutionData.action === "change_instructor" && (
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Assign Instructor</span></label>
                  <input type="text" name="newInstructor" value={resolutionData.newInstructor} onChange={handleChange}
                    placeholder="Instructor name" className="input input-bordered focus:input-primary rounded-xl" />
                </div>
              )}

              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Resolution Notes</span></label>
                <textarea name="notes" value={resolutionData.notes} onChange={handleChange}
                  placeholder="Add notes about this resolution..."
                  className="textarea textarea-bordered focus:textarea-primary rounded-xl" rows="3"></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
                <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 rounded-xl">
                  {isLoading ? "Submitting..." : "Submit Resolution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const ConflictDetection = () => {
  const { token } = useAuth();
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState("Spring2025");
  const [filter, setFilter] = useState("all");
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchConflicts();
  }, [token, semester]);

  const fetchConflicts = async () => {
    setLoading(true);
    const result = await getConflicts(token, semester);
    setConflicts(Array.isArray(result) ? result : []);
    setLoading(false);
  };

  const handleResolveClick = (conflict) => {
    setSelectedConflict(conflict);
    setShowResolutionModal(true);
  };

  const handleSubmitResolution = async (resolutionData) => {
    setIsResolving(true);
    const result = await resolveConflict(token, resolutionData);

    if (result.success || result.message) {
      setMessage({ type: "success", text: "✅ Conflict resolved successfully!" });
      setShowResolutionModal(false);
      fetchConflicts();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to resolve conflict") });
    }

    setIsResolving(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const filteredConflicts = conflicts.filter((conflict) => {
    if (filter === "unresolved") return !conflict.resolved;
    if (filter === "resolved") return conflict.resolved;
    return true;
  });

  const unresolvedCount = conflicts.filter((c) => !c.resolved).length;
  const resolvedCount = conflicts.filter((c) => c.resolved).length;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">Schedule Conflicts</h2>
        <p className="text-gray-500 mt-1">Detect and resolve scheduling conflicts</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert mb-4 rounded-xl text-sm py-2 ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-4 border border-red-200">
          <p className="text-gray-600 text-sm font-medium">Total Conflicts</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{conflicts.length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-200">
          <p className="text-gray-600 text-sm font-medium">Unresolved</p>
          <p className="text-3xl font-bold text-orange-600 mt-1">{unresolvedCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
          <p className="text-gray-600 text-sm font-medium">Resolved</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <select 
          value={semester} 
          onChange={(e) => setSemester(e.target.value)}
          className="select select-bordered focus:select-primary rounded-xl text-sm"
        >
          <option value="Spring2025">Spring 2025</option>
          <option value="Fall2025">Fall 2025</option>
          <option value="Spring2026">Spring 2026</option>
          <option value="Fall2026">Fall 2026</option>
        </select>

        <div className="flex gap-2 ml-auto">
          {[
            { key: "all", label: "All", icon: "📋" },
            { key: "unresolved", label: "Unresolved", icon: "⚠️" },
            { key: "resolved", label: "Resolved", icon: "✓" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-orange-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button onClick={() => fetchConflicts()} className="btn btn-sm btn-outline rounded-xl ml-auto">
          🔄 Refresh
        </button>
      </div>

      {/* Conflicts List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : filteredConflicts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-primary-100 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-medium text-gray-800 text-lg">No conflicts found!</p>
          <p className="text-gray-500 text-sm mt-1">
            {filter === "all" && "Your schedule is conflict-free."}
            {filter === "unresolved" && "All conflicts have been resolved."}
            {filter === "resolved" && "No resolved conflicts to display."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredConflicts.map((conflict) => (
            <ConflictCard
              key={conflict.id}
              conflict={conflict}
              onResolve={handleResolveClick}
              isResolving={false}
            />
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      <ResolutionModal 
        isOpen={showResolutionModal}
        onClose={() => setShowResolutionModal(false)}
        onSubmit={handleSubmitResolution}
        conflict={selectedConflict}
        isLoading={isResolving}
      />
    </Layout>
  );
};

export default ConflictDetection;
