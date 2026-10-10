import { useEffect, useState } from "react";
import { Search, CalendarDays } from "lucide-react";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";

export default function AllAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", search: "", date: "" });

  function fetchAppointments() {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.date) params.date = filters.date;
    if (filters.search) params.search = filters.search;
    api
      .get("/appointments", { params })
      .then((res) => setAppointments(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchAppointments();
  }, [filters.status, filters.date, filters.search]);

  if (loading) return <Spinner size="lg" label="Loading appointments..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          All Appointments
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and filter every appointment in the system
        </p>
      </div>

      <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="input pl-9"
            placeholder="Search student, faculty, purpose..."
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="input"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="rescheduled">Rescheduled</option>
        </select>
        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="input"
        />
      </div>

      {appointments.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
          <p>No appointments found</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
                showStudent
                showFaculty
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
