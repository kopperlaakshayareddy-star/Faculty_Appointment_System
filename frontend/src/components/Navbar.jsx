import { useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon, Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const roleLabels = {
  student: "Student",
  faculty: "Faculty",
  admin: "Admin",
};

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 hidden sm:block">
            Faculty Appointment System
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <UserIcon size={16} className="text-gray-500" />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                {roleLabels[user?.role]}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
