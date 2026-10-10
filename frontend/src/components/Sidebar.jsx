import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  GraduationCap,
  UserCog,
  Clock,
  CalendarPlus,
  BookOpen,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const studentLinks = [
  { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/student/faculty", label: "Browse Faculty", icon: GraduationCap },
  { to: "/student/book", label: "Book Appointment", icon: CalendarPlus },
  { to: "/student/appointments", label: "My Appointments", icon: CalendarDays },
];

const facultyLinks = [
  { to: "/faculty", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/faculty/slots", label: "Manage Slots", icon: Clock },
  { to: "/faculty/appointments", label: "Appointments", icon: CalendarDays },
];

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/students", label: "Students", icon: GraduationCap },
  { to: "/admin/faculty", label: "Faculty", icon: UserCog },
  { to: "/admin/appointments", label: "All Appointments", icon: CalendarDays },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const links =
    user?.role === "student"
      ? studentLinks
      : user?.role === "faculty"
      ? facultyLinks
      : adminLinks;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary-600 text-white">
              <BookOpen size={20} />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              FAS
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 4rem)" }}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
