import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const adminLinks = [
  { to: "/admin",           label: "Dashboard",        icon: "🏠" },
  { to: "/admin/users",     label: "Users",            icon: "👥" },
  { to: "/admin/rooms",     label: "Rooms",            icon: "🚪" },
  { to: "/admin/courses",   label: "Courses",          icon: "📚" },
  { to: "/admin/generate",  label: "Generate Schedule",icon: "⚡" },
  { to: "/admin/schedules", label: "View Schedules",   icon: "📅" },
];

const teacherLinks = [
  { to: "/teacher",           label: "Dashboard",     icon: "🏠" },
  { to: "/teacher/courses",   label: "My Courses",    icon: "📚" },
  { to: "/teacher/vacancy",   label: "Set Vacancy",   icon: "🕐" },
  { to: "/teacher/schedule",  label: "My Schedule",   icon: "📅" },
];

const studentLinks = [
  { to: "/student",           label: "Dashboard",     icon: "🏠" },
  { to: "/student/schedule",  label: "My Schedule",   icon: "📅" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links =
    user?.role === "admin"   ? adminLinks   :
    user?.role === "teacher" ? teacherLinks :
    studentLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-primary-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-primary-100">
        <h1 className="font-heading text-2xl text-primary-700 leading-tight">
          Schedule<span className="text-primary-400">DB</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1 font-body">Smart University Scheduler</p>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-primary-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-primary-600 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/admin" || link.to === "/teacher" || link.to === "/student"}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : "text-gray-600"}`
            }
          >
            <span className="text-base">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-primary-100">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
