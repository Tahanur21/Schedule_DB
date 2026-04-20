import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/admin",           label: "Dashboard",        icon: "🏠" },
  { to: "/admin/users",     label: "Users",            icon: "👥" },
  { to: "/admin/rooms",     label: "Rooms",            icon: "🚪" },
  { to: "/admin/courses",   label: "Courses",          icon: "📚" },
  { to: "/admin/generate",  label: "Generate Schedule", icon: "⚡" },
  { to: "/admin/schedules", label: "View Schedules",   icon: "📅" },
  { to: "/admin/conflicts", label: "Conflict Detection", icon: "⚠️" },
];

const teacherLinks = [
  { to: "/teacher",          label: "Dashboard",  icon: "🏠" },
  { to: "/teacher/courses",  label: "My Courses", icon: "📚" },
  { to: "/teacher/vacancy",  label: "Set Vacancy", icon: "🕐" },
  { to: "/teacher/schedule", label: "My Schedule", icon: "📅" },
];

const studentLinks = [
  { to: "/student",          label: "Dashboard",  icon: "🏠" },
  { to: "/student/schedule", label: "My Schedule", icon: "📅" },
  { to: "/student/courses",  label: "Register Courses", icon: "📖" },
];

const ROLE_STYLES = {
  admin:   { badge: "bg-red-100 text-red-600",     dot: "bg-red-400" },
  teacher: { badge: "bg-blue-100 text-blue-600",   dot: "bg-blue-400" },
  student: { badge: "bg-green-100 text-green-600", dot: "bg-green-400" },
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === "admin"   ? adminLinks   :
    user?.role === "teacher" ? teacherLinks :
    studentLinks;

  const roleStyle = ROLE_STYLES[user?.role] || ROLE_STYLES.student;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-primary-100 flex flex-col shadow-sm">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-primary-100">
        <h1 className="font-heading text-xl text-indigo-700 leading-tight tracking-tight">
          Schedule<span className="text-indigo-300">DB</span>
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Smart University Scheduler</p>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-50">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
          <div className="relative shrink-0">
            <div className={`w-9 h-9 rounded-full ${roleStyle.badge} flex items-center justify-center font-bold text-sm`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${roleStyle.dot}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>
        {user?.department && (
          <p className="text-xs text-gray-400 text-center mt-2">{user.department}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin" || link.to === "/teacher" || link.to === "/student"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`
            }
          >
            <span className="text-base w-5 text-center">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
        
        {/* Profile Link - Available to All Roles */}
        <div className="border-t border-gray-100 my-2 pt-2">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`
            }
          >
            <span className="text-base w-5 text-center">👤</span>
            <span>My Profile</span>
          </NavLink>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-primary-100 space-y-1">
        <div className="px-3 py-2 text-xs text-gray-400">
          Semester: <span className="font-medium text-gray-600">Spring 2025</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
        >
          <span className="text-base w-5 text-center">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
