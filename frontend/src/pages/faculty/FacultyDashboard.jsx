import { useEffect, useState } from "react";
import { CalendarDays, Hourglass, CheckCircle, Users } from "lucide-react";
import api from "../../services/api.js";
import StatCard from "../../components/StatCard.jsx";
import AppointmentCard from "../../components/AppointmentCard.jsx";
import Spinner from "../../components/Spinner.jsx";

export default function FacultyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/appointments/stats/faculty")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Faculty Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Today's schedule and appointment overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Total" value={stats.total} color="primary" />
        <StatCard icon={Users} label="Today" value={stats.todayCount} color="accent" />
        <StatCard icon={Hourglass} label="Pending" value={stats.pending} color="warning" />
        <StatCard icon={CheckCircle} label="Approved" value={stats.approved} color="success" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Today's Appointments
        </h2>
        {stats.todayAppointments.length === 0 ? (
          <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
            <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.todayAppointments.map((appt) => (
              <AppointmentCard key={appt._id} appointment={appt} showStudent />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
