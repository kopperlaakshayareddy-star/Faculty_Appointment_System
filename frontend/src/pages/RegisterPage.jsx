import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Mail, Lock, User as UserIcon, Phone } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
    department: "",
    rollNo: "",
    designation: "Professor",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome, ${user.name}!`);
      navigate(`/${user.role}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md card p-8 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-xl bg-primary-600 text-white mb-3">
            <BookOpen size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join the appointment system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">I am a</label>
            <div className="grid grid-cols-2 gap-2">
              {["student", "faculty"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => update("role", r)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    form.role === r
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input pl-9"
                placeholder="John Smith"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="input pl-9"
                placeholder="you@university.edu"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="input pl-9"
                placeholder="Min 6 characters"
                required
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="input pl-9"
                placeholder="555-0000"
              />
            </div>
          </div>

          {form.role === "student" ? (
            <>
              <div>
                <label className="label">Roll Number</label>
                <input
                  type="text"
                  value={form.rollNo}
                  onChange={(e) => update("rollNo", e.target.value)}
                  className="input"
                  placeholder="CS2021-001"
                />
              </div>
              <div>
                <label className="label">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                  className="input"
                  placeholder="Computer Science"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="label">Department</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                  className="input"
                  placeholder="Computer Science"
                  required
                />
              </div>
              <div>
                <label className="label">Designation</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => update("designation", e.target.value)}
                  className="input"
                  placeholder="Professor"
                />
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  className="input"
                  rows={2}
                  placeholder="Brief research interests..."
                />
              </div>
            </>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
