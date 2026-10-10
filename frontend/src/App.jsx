import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotFound from "./pages/NotFound.jsx";

import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import FacultyList from "./pages/student/FacultyList.jsx";
import BookAppointment from "./pages/student/BookAppointment.jsx";
import StudentAppointments from "./pages/student/StudentAppointments.jsx";

import FacultyDashboard from "./pages/faculty/FacultyDashboard.jsx";
import ManageSlots from "./pages/faculty/ManageSlots.jsx";
import FacultyAppointments from "./pages/faculty/FacultyAppointments.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageStudents from "./pages/admin/ManageStudents.jsx";
import ManageFaculty from "./pages/admin/ManageFaculty.jsx";
import AllAppointments from "./pages/admin/AllAppointments.jsx";

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute roles={["student"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="faculty" element={<FacultyList />} />
        <Route path="book" element={<BookAppointment />} />
        <Route path="appointments" element={<StudentAppointments />} />
      </Route>

      {/* Faculty routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute roles={["faculty"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FacultyDashboard />} />
        <Route path="slots" element={<ManageSlots />} />
        <Route path="appointments" element={<FacultyAppointments />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="faculty" element={<ManageFaculty />} />
        <Route path="appointments" element={<AllAppointments />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
