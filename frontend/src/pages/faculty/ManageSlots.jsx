import { useEffect, useState } from "react";
import { Clock, Trash2, Plus, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";
import Modal from "../../components/Modal.jsx";

export default function ManageSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: "", startTime: "", endTime: "" });
  const [submitting, setSubmitting] = useState(false);

  function fetchSlots() {
    api
      .get("/slots/my")
      .then((res) => setSlots(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchSlots();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/slots", form);
      toast.success("Slot created");
      setShowModal(false);
      setForm({ date: "", startTime: "", endTime: "" });
      fetchSlots();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this slot?")) return;
    try {
      await api.delete(`/slots/${id}`);
      toast.success("Slot deleted");
      fetchSlots();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  if (loading) return <Spinner size="lg" label="Loading slots..." />;

  const grouped = slots.reduce((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Manage Slots
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create and manage your available time slots
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} /> Add Slot
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p>No slots created yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, daySlots]) => (
              <div key={date} className="card p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Calendar size={16} /> {date}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {daySlots.map((slot) => (
                    <div
                      key={slot._id}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        slot.isBooked
                          ? "border-success-300 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          slot.isBooked
                            ? "text-success-600 dark:text-success-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {slot.isBooked ? "Booked" : "Available"}
                      </p>
                      {!slot.isBooked && (
                        <button
                          onClick={() => handleDelete(slot._id)}
                          className="text-error-500 hover:text-error-600 mt-2 inline-flex items-center gap-1 text-xs"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Slot"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Start Time</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">End Time</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating..." : "Create Slot"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
