export function StatusBadge({ status }) {
  const map = {
    pending: "badge-pending",
    approved: "badge-approved",
    rejected: "badge-rejected",
    cancelled: "badge-cancelled",
    rescheduled: "badge-rescheduled",
  };
  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    cancelled: "Cancelled",
    rescheduled: "Rescheduled",
  };
  return <span className={map[status] || "badge-cancelled"}>{labels[status]}</span>;
}
