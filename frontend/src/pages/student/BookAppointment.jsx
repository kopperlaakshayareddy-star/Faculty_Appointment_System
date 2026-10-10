import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MessageSquare, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api.js";
import Spinner from "../../components/Spinner.jsx";

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preselectedFaculty = searchParams.get("facultyId");

  const [faculty, setFaculty] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(preselectedFaculty || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get("/users/faculty")
      .then((res) => setFaculty(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedFaculty && date) {
      api
        .get(`/slots/faculty/${selectedFaculty}`, { params: { date } })
        .then((res) => setSlots(res.data));
    } else {
      setSlots([]);
    }
    setTime("");
  }, [selectedFaculty, date]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedFaculty || !date || !time || !purpose) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/appointments", {
        facultyId: selectedFaculty,
        date,
        time,
        purpose,
      });
      toast.success("Appointment booked successfully!");
      navigate("/student/appointments");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Spinner size="lg" label="Loading..." />;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <button
          onClick={() => navigate("/student/faculty")}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-2"
        >
          <ChevronLeft size={16} /> Back to faculty list
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Book Appointment
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">Faculty Member</label>
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="input"
            required
          >
            <option value="">Select faculty...</option>
            {faculty.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name} - {f.department}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <Calendar size={14} className="inline mr-1" /> Date
          </label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
            required
          />
        </div>

        {selectedFaculty && date && (
          <div>
            <label className="label">
              <Clock size={14} className="inline mr-1" /> Available Time Slots
            </label>
            {slots.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                No available slots for this date. Choose another date or book without a slot below.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot._id}
                    type="button"
                    onClick={() => setTime(slot.startTime)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      time === slot.startTime
                        ? "bg-primary-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="label">Time (or enter custom)</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label">
            <MessageSquare size={14} className="inline mr-1" /> Purpose
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="input"
            rows={3}
            placeholder="Briefly describe the purpose of your appointment..."
            required
            minLength={5}
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
}
