import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, GraduationCap, Mail, Building } from "lucide-react";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";
import toast from "react-hot-toast";

export default function FacultyList() {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api.get("/users/departments").then((res) => setDepartments(res.data));
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (deptFilter) params.department = deptFilter;
    api
      .get("/users/faculty", { params })
      .then((res) => setFaculty(res.data))
      .finally(() => setLoading(false));
  }, [search, deptFilter]);

  if (loading) return <Spinner size="lg" label="Loading faculty..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Browse Faculty
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Find and book appointments with faculty members
        </p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search by name, email, or department..."
          />
        </div>
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="input sm:w-56"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {faculty.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          <GraduationCap size={32} className="mx-auto mb-2 opacity-50" />
          <p>No faculty found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((f) => (
            <div
              key={f._id}
              className="card p-5 hover:shadow-md transition-shadow animate-slide-up"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">
                  <GraduationCap size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {f.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {f.designation}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p className="flex items-center gap-2">
                  <Building size={14} /> {f.department}
                </p>
                <p className="flex items-center gap-2 truncate">
                  <Mail size={14} /> {f.email}
                </p>
              </div>

              {f.bio && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {f.bio}
                </p>
              )}

              <button
                onClick={() => navigate(`/student/book?facultyId=${f._id}`)}
                className="btn-primary w-full"
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
