import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getRooms, addRoom, updateRoom, deleteRoom } from "../../services/api";
import Layout from "../../components/Layout";

const CapacityBar = ({ capacity, max = 60 }) => {
  const pct = Math.min((capacity / max) * 100, 100);
  const color = pct > 70 ? "bg-emerald-400" : pct > 40 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-14 text-right">{capacity} seats</span>
    </div>
  );
};

// ── ROOM FORM MODAL ───────────────────────────────
const RoomFormModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [formData, setFormData] = useState(
    initialData || { room_number: "", capacity: 40, building: "", features: "" }
  );

  useEffect(() => {
    setFormData(
      initialData || { room_number: "", capacity: 40, building: "", features: "" }
    );
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.room_number || !formData.capacity) {
      alert("Please fill in all required fields");
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {initialData ? "Edit Room" : "Add New Room"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Room Number *</span></label>
                <input type="text" name="room_number" value={formData.room_number} onChange={handleChange}
                  placeholder="e.g., A-101" className="input input-bordered focus:input-primary rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Capacity *</span></label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange}
                  min="1" className="input input-bordered focus:input-primary rounded-xl" required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Building</span></label>
                <input type="text" name="building" value={formData.building} onChange={handleChange}
                  placeholder="e.g., Main Block" className="input input-bordered focus:input-primary rounded-xl" />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text font-medium">Features (comma-separated)</span></label>
                <input type="text" name="features" value={formData.features} onChange={handleChange}
                  placeholder="e.g., Projector, WiFi, AC" className="input input-bordered focus:input-primary rounded-xl" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
                <button type="submit" disabled={isLoading} className="btn btn-primary flex-1 rounded-xl">
                  {isLoading ? "Saving..." : initialData ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

// ── DELETE CONFIRMATION MODAL ──────────────────────────
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, roomNumber = "", isLoading = false }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Room?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete <span className="font-semibold">{roomNumber}</span>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
              <button onClick={onConfirm} disabled={isLoading} className="btn btn-error flex-1 rounded-xl">
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Rooms = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchRooms = () => {
    setLoading(true);
    getRooms(token)
      .then((data) => {
        console.log("Fetched rooms:", data);
        setRooms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setRooms([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRooms();
  }, [token]);

  const handleAddRoom = async (formData) => {
    setIsSubmitting(true);
    const result = await addRoom(token, formData);
    if (result.id || result.room_id) {
      setMessage({ type: "success", text: "✅ Room added successfully!" });
      setShowAddModal(false);
      fetchRooms();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to add room") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setShowEditModal(true);
  };

  const handleUpdateRoom = async (formData) => {
    setIsSubmitting(true);
    const result = await updateRoom(token, selectedRoom.id, formData);
    if (result.id || result.room_id) {
      setMessage({ type: "success", text: "✅ Room updated successfully!" });
      setShowEditModal(false);
      fetchRooms();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to update room") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleDeleteClick = (room) => {
    setSelectedRoom(room);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    const result = await deleteRoom(token, selectedRoom.id);
    if (result.success || result.message) {
      setMessage({ type: "success", text: "✅ Room deleted successfully!" });
      setShowDeleteModal(false);
      fetchRooms();
    } else {
      setMessage({ type: "error", text: "❌ " + (result.error || "Failed to delete room") });
    }
    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const filtered = rooms.filter(
    (r) =>
      r.room_number?.toLowerCase().includes(search.toLowerCase()) ||
      r.building?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="font-heading text-3xl text-gray-800">Rooms</h2>
          <p className="text-gray-500 mt-1">Manage classroom inventory and capacity</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary rounded-xl gap-2">
          <span className="text-lg">🚪</span> Add Room
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert mb-4 rounded-xl text-sm py-2 ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: "🏛️", label: "Total Rooms",     value: rooms.length, color: "bg-indigo-50 text-indigo-700" },
          { icon: "✅", label: "Active",           value: rooms.filter((r) => r.is_active !== false).length,     color: "bg-emerald-50 text-emerald-700" },
          { icon: "🪑", label: "Total Seats",      value: rooms.reduce((s, r) => s + (r.capacity || 0), 0),   color: "bg-cyan-50 text-cyan-700" },
        ].map((s) => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 border border-primary-100 shadow-sm`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs opacity-75 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rooms List */}
      <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <input
            type="text" placeholder="Search by room number or building…"
            className="input input-bordered focus:input-primary rounded-xl w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><span className="loading loading-spinner loading-lg text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="font-medium">{rooms.length === 0 ? "No rooms yet" : "No rooms match your search"}</p>
            {rooms.length === 0 && <p className="text-sm mt-1">Add your first room using the button above</p>}
          </div>
        ) : (
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="text-white/80 font-medium text-xs">#</th>
                <th className="text-white/80 font-medium text-xs">Room</th>
                <th className="text-white/80 font-medium text-xs">Building</th>
                <th className="text-white/80 font-medium text-xs">Capacity</th>
                <th className="text-white/80 font-medium text-xs">Features</th>
                <th className="text-white/80 font-medium text-xs text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className="hover">
                  <td className="text-gray-400 text-sm">{i + 1}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-sm">🚪</div>
                      <span className="font-semibold text-gray-800">{r.room_number}</span>
                    </div>
                  </td>
                  <td className="text-gray-500 text-sm">{r.building || "—"}</td>
                  <td className="min-w-[140px]">
                    <CapacityBar capacity={r.capacity} />
                  </td>
                  <td className="text-gray-500 text-sm text-xs">{r.features || "—"}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => handleEditClick(r)} className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-700" title="Edit">✏️</button>
                      <button onClick={() => handleDeleteClick(r)} className="btn btn-sm btn-ghost text-red-600 hover:text-red-700" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} room{filtered.length !== 1 ? "s" : ""} · {rooms.filter((r) => r.is_active !== false).length} active
          </div>
        )}
      </div>

      {/* Modals */}
      <RoomFormModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSubmit={handleAddRoom}
        isLoading={isSubmitting}
      />
      <RoomFormModal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        onSubmit={handleUpdateRoom}
        initialData={selectedRoom}
        isLoading={isSubmitting}
      />
      <DeleteConfirmModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
        onConfirm={handleConfirmDelete}
        roomNumber={selectedRoom?.room_number}
        isLoading={isSubmitting}
      />
    </Layout>
  );
};

export default Rooms;
