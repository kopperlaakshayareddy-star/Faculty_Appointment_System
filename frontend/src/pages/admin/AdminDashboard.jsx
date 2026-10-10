import { useEffect, useState } from "react";
import { Users, GraduationCap, CalendarDays, TrendingUp } from "lucide-react";
import api from "../../services/api.js";
import StatCard from "../../components/StatCard.jsx";
import Spinner from "../../components/Spinner.jsx";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/appointments/stats/admin")
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" label="Loading dashboard..." />;

  const barColors = {
    pending: "bg-warning-500",
    approved: "bg-success-500",
    rejected: "bg-error-500",
    cancelled: "bg-gray-500",
    rescheduled: "bg-accent-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          System overview and appointment statistics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label="Students" value={stats.totalStudents} color="primary" />
        <StatCard icon={Users} label="Faculty" value={stats.totalFaculty} color="accent" />
        <StatCard icon={CalendarDays} label="Total Appointments" value={stats.totalAppointments} color="warning" />
        <StatCard icon={TrendingUp} label="Today's Active" value={stats.todayAppointments} color="success" />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Appointment Status Breakdown
        </h2>
        <div className="card p-6">
          {stats.totalAppointments === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No appointment data yet
            </p>
          ) : (
            <div className="space-y-4">
              {Object.entries(stats.statusStats).map(([status, count]) => {
                const pct = Math.round((count / stats.totalAppointments) * 100);
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {status}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${barColors[status] || "bg-gray-500"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
