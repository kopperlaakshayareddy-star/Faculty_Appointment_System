import { useEffect, useState } from "react";
import { Search, Trash2, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  function fetchStudents(searchTerm = "") {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    api
      .get("/users/students", { params })
      .then((res) => setStudents(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    fetchStudents(search);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete student "${name}"? This also removes their appointments.`)) return;
    try {
      await api.delete(`/users/students/${id}`);
      toast.success("Student deleted");
      fetchStudents(search);
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <Spinner size="lg" label="Loading students..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Students
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage all student accounts
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Search by name, email, or roll number..."
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {students.length === 0 ? (
        <div className="card p-8 text-center text-gray-500 dark:text-gray-400">
          <GraduationCap size={32} className="mx-auto mb-2 opacity-50" />
          <p>No students found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 text-left text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Roll No</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {students.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {s.email}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {s.rollNo || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {s.department || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {s.phone || "-"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s._id, s.name)}
                        className="text-error-500 hover:text-error-600 inline-flex items-center gap-1 text-xs"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
