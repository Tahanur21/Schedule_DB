import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import Login        from "./pages/Login";
import Register     from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";

// Admin Pages
import AdminDashboard    from "./pages/admin/Dashboard";
import Users             from "./pages/admin/Users";
import Rooms             from "./pages/admin/Rooms";
import Courses           from "./pages/admin/Courses";
import GenerateSchedule  from "./pages/admin/GenerateSchedule";
import AdminSchedules    from "./pages/admin/Schedules";

// Teacher Pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import MyCourses        from "./pages/teacher/MyCourses";
import SubmitVacancy    from "./pages/teacher/SubmitVacancy";
import TeacherSchedule  from "./pages/teacher/MySchedule";

// Student Pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentSchedule  from "./pages/student/MySchedule";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"         element={<Navigate to="/login" replace />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users"     element={<ProtectedRoute allowedRole="admin"><Users /></ProtectedRoute>} />
          <Route path="/admin/rooms"     element={<ProtectedRoute allowedRole="admin"><Rooms /></ProtectedRoute>} />
          <Route path="/admin/courses"   element={<ProtectedRoute allowedRole="admin"><Courses /></ProtectedRoute>} />
          <Route path="/admin/generate"  element={<ProtectedRoute allowedRole="admin"><GenerateSchedule /></ProtectedRoute>} />
          <Route path="/admin/schedules" element={<ProtectedRoute allowedRole="admin"><AdminSchedules /></ProtectedRoute>} />

          {/* Teacher Routes */}
          <Route path="/teacher"          element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/courses"  element={<ProtectedRoute allowedRole="teacher"><MyCourses /></ProtectedRoute>} />
          <Route path="/teacher/vacancy"  element={<ProtectedRoute allowedRole="teacher"><SubmitVacancy /></ProtectedRoute>} />
          <Route path="/teacher/schedule" element={<ProtectedRoute allowedRole="teacher"><TeacherSchedule /></ProtectedRoute>} />

          {/* Student Routes */}
          <Route path="/student"          element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/schedule" element={<ProtectedRoute allowedRole="student"><StudentSchedule /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
