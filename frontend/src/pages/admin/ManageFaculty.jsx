import { useEffect, useState } from "react";
import { Search, Trash2, UserCog, Mail, Building } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";

export default function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [departments, setDepartments] = useState([]);

  function fetchFaculty(searchTerm = "", dept = "") {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (dept) params.department = dept;
    api
      .get("/users/faculty", { params })
      .then((res) => setFaculty(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    api.get("/users/departments").then((res) => setDepartments(res.data));
    fetchFaculty();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    fetchFaculty(search, deptFilter);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete faculty "${name}"? This also removes their appointments.`)) return;
    try {
      await api.delete(`/users/faculty/${id}`);
      toast.success("Faculty deleted");
      fetchFaculty(search, deptFilter);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Spinner size="lg" label="Loading faculty..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Faculty
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage all faculty accounts
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
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
          className="input sm:w-48"
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {faculty.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          <UserCog size={32} className="mx-auto mb-2 opacity-50" />
          <p>No faculty found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faculty.map((f) => (
            <div key={f._id} className="card p-5 animate-slide-up">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-500/20 text-accent-600 dark:text-accent-400">
                  <UserCog size={22} />
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
                onClick={() => handleDelete(f._id, f.name)}
                className="btn-danger w-full text-xs"
              >
                <Trash2 size={14} /> Delete Faculty
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
