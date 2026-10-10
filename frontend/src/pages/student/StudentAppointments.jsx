import { useEffect, useState } from "react";
import { CalendarDays, Filter } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";
import Modal from "../../components/Modal.jsx";

export default function StudentAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editAppt, setEditAppt] = useState(null);
  const [editForm, setEditForm] = useState({ date: "", time: "", purpose: "" });

  function fetchAppointments(statusFilter = "") {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    api
      .get("/appointments/my", { params })
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAppointments(filter);
  }, [filter]);

  async function handleCancel(appt) {
    if (!confirm("Cancel this appointment?")) return;
    try {
      await api.patch(`/appointments/my/${appt._id}/cancel`);
      toast.success("Appointment cancelled");
      fetchAppointments(filter);
    } catch (err) {
      toast.error(err.message);
    }
  }

  function openEdit(appt) {
    setEditAppt(appt);
    setEditForm({ date: appt.date, time: appt.time, purpose: appt.purpose });
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      await api.put(`/appointments/my/${editAppt._id}`, editForm);
      toast.success("Appointment updated");
      setEditAppt(null);
      fetchAppointments(filter);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Spinner size="lg" label="Loading appointments..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          My Appointments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View, edit, or cancel your appointments
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Filter size={16} className="text-gray-400" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input max-w-48">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
      </div>

      {appointments.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
          <p>No appointments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              showFaculty
              onEdit={openEdit}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!editAppt}
        onClose={() => setEditAppt(null)}
        title="Edit Appointment"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Time</label>
            <input
              type="time"
              value={editForm.time}
              onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Purpose</label>
            <textarea
              value={editForm.purpose}
              onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
              className="input"
              rows={3}
              required
              minLength={5}
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Save Changes
          </button>
        </form>
      </Modal>
    </div>
  );
}
