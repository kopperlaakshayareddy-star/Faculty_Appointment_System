export default function StatCard({ icon: Icon, label, value, color = "primary" }) {
  const colorMap = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400",
    success: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400",
    error: "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400",
    accent: "bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-400",
  };
  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
