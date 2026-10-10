import { useEffect, useState } from "react";
import { CalendarDays, Filter } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";
import Modal from "../../components/Modal.jsx";

export default function FacultyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [rescheduleAppt, setRescheduleAppt] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    newDate: "",
    newTime: "",
    note: "",
  });

  function fetchAppointments(statusFilter = "") {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    api
      .get("/appointments/faculty", { params })
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAppointments(filter);
  }, [filter]);

  async function handleApprove(appt) {
    try {
      await api.patch(`/appointments/${appt._id}/status`, { status: "approved" });
      toast.success("Appointment approved");
      fetchAppointments(filter);
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleReject(appt) {
    if (!confirm("Reject this appointment?")) return;
    try {
      await api.patch(`/appointments/${appt._id}/status`, { status: "rejected" });
      toast.success("Appointment rejected");
      fetchAppointments(filter);
    } catch (err) {
      toast.error(err.message);
    }
  }

  function openReschedule(appt) {
    setRescheduleAppt(appt);
    setRescheduleForm({
      newDate: appt.date,
      newTime: appt.time,
      note: "",
    });
  }

  async function handleRescheduleSubmit(e) {
    e.preventDefault();
    try {
      await api.patch(`/appointments/${rescheduleAppt._id}/status`, {
        status: "rescheduled",
        ...rescheduleForm,
      });
      toast.success("Appointment rescheduled");
      setRescheduleAppt(null);
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
          Appointment Requests
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review and manage student appointment requests
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
              showStudent
              onApprove={handleApprove}
              onReject={handleReject}
              onReschedule={openReschedule}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!rescheduleAppt}
        onClose={() => setRescheduleAppt(null)}
        title="Reschedule Appointment"
      >
        <form onSubmit={handleRescheduleSubmit} className="space-y-4">
          <div>
            <label className="label">New Date</label>
            <input
              type="date"
              value={rescheduleForm.newDate}
              onChange={(e) =>
                setRescheduleForm({ ...rescheduleForm, newDate: e.target.value })
              }
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">New Time</label>
            <input
              type="time"
              value={rescheduleForm.newTime}
              onChange={(e) =>
                setRescheduleForm({ ...rescheduleForm, newTime: e.target.value })
              }
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Note to Student</label>
            <textarea
              value={rescheduleForm.note}
              onChange={(e) =>
                setRescheduleForm({ ...rescheduleForm, note: e.target.value })
              }
              className="input"
              rows={2}
              placeholder="Reason for rescheduling..."
            />
          </div>
          <button type="submit" className="btn-primary w-full">
            Reschedule
          </button>
        </form>
      </Modal>
    </div>
  );
}
