import { Clock, Calendar, User } from "lucide-react";
import { StatusBadge } from "./StatusBadge.jsx";

export default function AppointmentCard({
  appointment,
  showFaculty = true,
  showStudent = false,
  onEdit,
  onCancel,
  onApprove,
  onReject,
  onReschedule,
}) {
  return (
    <div className="card p-4 hover:shadow-md transition-shadow animate-slide-up">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {showStudent && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <User size={14} />
              <span className="truncate">{appointment.student?.name}</span>
            </div>
          )}
          {showFaculty && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-1">
              <User size={14} />
              <span className="truncate">{appointment.faculty?.name}</span>
            </div>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {appointment.purpose}
          </p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {appointment.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {appointment.time}
        </span>
      </div>

      {appointment.rescheduleNote && (
        <p className="text-xs text-accent-600 dark:text-accent-400 mb-3 bg-accent-50 dark:bg-accent-500/10 rounded-lg p-2">
          Reschedule note: {appointment.rescheduleNote}
        </p>
      )}

      {(onEdit || onCancel || onApprove || onReject || onReschedule) && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          {onEdit && ["pending", "approved"].includes(appointment.status) && (
            <button onClick={() => onEdit(appointment)} className="btn-ghost text-xs">
              Edit
            </button>
          )}
          {onCancel && appointment.status !== "cancelled" && appointment.status !== "rejected" && (
            <button onClick={() => onCancel(appointment)} className="btn-ghost text-xs text-error-600 dark:text-error-400">
              Cancel
            </button>
          )}
          {onApprove && appointment.status === "pending" && (
            <button onClick={() => onApprove(appointment)} className="btn-success text-xs">
              Approve
            </button>
          )}
          {onReject && appointment.status === "pending" && (
            <button onClick={() => onReject(appointment)} className="btn-danger text-xs">
              Reject
            </button>
          )}
          {onReschedule && ["pending", "approved"].includes(appointment.status) && (
            <button onClick={() => onReschedule(appointment)} className="btn-secondary text-xs">
              Reschedule
            </button>
          )}
        </div>
      )}
    </div>
  );
}
