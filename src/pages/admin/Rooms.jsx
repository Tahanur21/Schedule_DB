import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getRooms, addRoom } from "../../services/api";
import Layout from "../../components/Layout";

const Rooms = () => {
  const { token } = useAuth();
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ room_number: "", capacity: 40, building: "" });
  const [msg, setMsg]         = useState("");
  const [adding, setAdding]   = useState(false);

  const fetchRooms = () => {
    getRooms(token).then((data) => { setRooms(Array.isArray(data) ? data : []); setLoading(false); });
  };

  useEffect(() => { fetchRooms(); }, [token]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true); setMsg("");
    const data = await addRoom(token, form);
    if (data.room) {
      setMsg("✅ Room added successfully!");
      setForm({ room_number: "", capacity: 40, building: "" });
      fetchRooms();
    } else {
      setMsg("❌ " + (data.error || "Failed to add room"));
    }
    setAdding(false);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">Rooms</h2>
        <p className="text-gray-500 mt-1">Manage classroom inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Room Form */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm h-fit">
          <h3 className="font-heading text-xl text-gray-800 mb-4">Add New Room</h3>
          {msg && <div className={`alert text-sm py-2 mb-4 ${msg.startsWith("✅") ? "alert-success" : "alert-error"}`}><span>{msg}</span></div>}
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Room Number</span></label>
              <input type="text" placeholder="e.g. A-101" className="input input-bordered focus:input-primary rounded-xl w-full" value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Capacity</span></label>
              <input type="number" placeholder="40" className="input input-bordered focus:input-primary rounded-xl w-full" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Building</span></label>
              <input type="text" placeholder="e.g. Main Block" className="input input-bordered focus:input-primary rounded-xl w-full" value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary w-full rounded-xl" disabled={adding}>
              {adding ? <span className="loading loading-spinner loading-sm"></span> : "Add Room"}
            </button>
          </form>
        </div>

        {/* Rooms List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>
          ) : (
            <table className="table table-zebra w-full">
              <thead className="bg-primary-600 text-white">
                <tr><th>#</th><th>Room</th><th>Building</th><th>Capacity</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400">No rooms added yet</td></tr>
                ) : rooms.map((r, i) => (
                  <tr key={r.id} className="hover">
                    <td className="text-gray-400">{i + 1}</td>
                    <td className="font-semibold text-gray-800">{r.room_number}</td>
                    <td className="text-gray-500">{r.building || "—"}</td>
                    <td><span className="badge badge-outline badge-sm">{r.capacity} seats</span></td>
                    <td><span className={`badge badge-sm ${r.is_active ? "badge-success" : "badge-ghost"}`}>{r.is_active ? "Active" : "Inactive"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Rooms;
