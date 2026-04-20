import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAvailableCourses, enrollCourse, withdrawCourse, getStudentEnrolledCourses } from "../../services/api";
import Layout from "../../components/Layout";

const LEVEL_CONFIG = {
  100: { badge: "badge-primary", bg: "bg-indigo-50" },
  200: { badge: "badge-info", bg: "bg-blue-50" },
  300: { badge: "badge-warning", bg: "bg-amber-50" },
  400: { badge: "badge-error", bg: "bg-red-50" },
};

const CourseCard = ({ course, isEnrolled, onAction, isLoading }) => {
  const levelConfig = LEVEL_CONFIG[Math.floor(course.level / 100) * 100] || LEVEL_CONFIG[100];
  const instructor = course.instructor || course.instructor_name || "TBD";
  
  return (
    <div className={`rounded-2xl border-2 p-5 transition-all ${
      isEnrolled 
        ? "bg-green-50 border-green-300 shadow-md" 
        : "bg-white border-primary-100 hover:border-primary-300 hover:shadow-md"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-800 text-lg">{course.code}</h3>
            <span className={`badge badge-sm ${levelConfig.badge}`}>Level {course.level}</span>
            {isEnrolled && <span className="badge badge-sm badge-success">✓ Enrolled</span>}
          </div>
          <p className="text-sm text-gray-600">{course.name}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-lg">👨‍🏫</span>
          <span>{instructor}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-lg">👥</span>
          <span>Capacity: {course.enrolled || 0}/{course.capacity || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="text-lg">📚</span>
          <span>Credits: {course.credits || 3}</span>
        </div>
        {course.prerequisites && course.prerequisites.length > 0 && (
          <div className="flex items-start gap-2 text-gray-600">
            <span className="text-lg">🔒</span>
            <span>Prerequisites: {course.prerequisites.join(", ")}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {isEnrolled ? (
          <button
            onClick={() => onAction("withdraw", course.id)}
            disabled={isLoading}
            className="btn btn-sm btn-outline btn-error flex-1 rounded-lg"
          >
            {isLoading ? "Processing..." : "Withdraw"}
          </button>
        ) : (
          <button
            onClick={() => onAction("enroll", course.id)}
            disabled={isLoading || (course.capacity && course.enrolled >= course.capacity)}
            className="btn btn-sm btn-primary flex-1 rounded-lg"
          >
            {isLoading ? "Processing..." : course.capacity && course.enrolled >= course.capacity ? "Full" : "Enroll"}
          </button>
        )}
      </div>
    </div>
  );
};

const CourseRegistration = () => {
  const { token } = useAuth();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [semester, setSemester] = useState("Spring2025");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCourses();
  }, [token, semester]);

  const fetchCourses = () => {
    setLoading(true);
    Promise.all([
      getAvailableCourses(token, semester),
      getStudentEnrolledCourses(token, semester),
    ]).then(([available, enrolled]) => {
      setAvailableCourses(Array.isArray(available) ? available : []);
      setEnrolledCourses(Array.isArray(enrolled) ? enrolled : []);
      setLoading(false);
    });
  };

  const handleAction = async (action, courseId) => {
    setIsSubmitting(true);
    let result;

    if (action === "enroll") {
      result = await enrollCourse(token, courseId);
    } else if (action === "withdraw") {
      result = await withdrawCourse(token, courseId);
    }

    if (result.id || result.message || result.success) {
      const actionText = action === "enroll" ? "enrolled in" : "withdrawn from";
      setMessage({ type: "success", text: `✅ Successfully ${actionText} course!` });
      fetchCourses();
    } else {
      setMessage({ type: "error", text: `❌ ${result.error || `Failed to ${action} course`}` });
    }

    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const filteredCourses = availableCourses.filter((course) => {
    const isEnrolled = enrolledCourses.some((ec) => ec.id === course.id);
    const matchSearch = 
      course.code.toLowerCase().includes(search.toLowerCase()) ||
      course.name.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "enrolled") return isEnrolled && matchSearch;
    if (filter === "available") return !isEnrolled && matchSearch;
    return matchSearch;
  });

  const totalCredits = enrolledCourses.reduce((sum, c) => sum + (c.credits || 3), 0);

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">Course Registration</h2>
        <p className="text-gray-500 mt-1">Browse and enroll in courses for {semester}</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert mb-4 rounded-xl text-sm py-2 ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
          <p className="text-gray-600 text-sm font-medium">Enrolled Courses</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{enrolledCourses.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border border-emerald-200">
          <p className="text-gray-600 text-sm font-medium">Total Credits</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{totalCredits}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
          <p className="text-gray-600 text-sm font-medium">Available Courses</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{availableCourses.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        {/* Semester Selector */}
        <select 
          value={semester} 
          onChange={(e) => setSemester(e.target.value)}
          className="select select-bordered focus:select-primary rounded-xl text-sm"
        >
          <option value="Spring2025">Spring 2025</option>
          <option value="Fall2025">Fall 2025</option>
          <option value="Spring2026">Spring 2026</option>
          <option value="Fall2026">Fall 2026</option>
        </select>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "All Courses", icon: "📚" },
            { key: "enrolled", label: "My Courses", icon: "✓" },
            { key: "available", label: "Available", icon: "➕" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search courses…"
          className="input input-bordered focus:input-primary rounded-xl flex-1 min-w-[200px] text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📭</p>
              <p className="font-medium">No courses found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={enrolledCourses.some((ec) => ec.id === course.id)}
                onAction={handleAction}
                isLoading={isSubmitting}
              />
            ))
          )}
        </div>
      )}

      {/* Enrolled Courses Summary */}
      {enrolledCourses.length > 0 && (
        <div className="mt-8 bg-green-50 rounded-2xl p-6 border-2 border-green-200">
          <h3 className="font-bold text-lg text-green-800 mb-4">📋 Your Enrolled Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl p-3 border border-green-100 flex items-between justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{course.code} - {course.name}</p>
                  <p className="text-xs text-gray-500 mt-1">👨‍🏫 {course.instructor || "TBD"}</p>
                </div>
                <span className="badge badge-sm badge-success">✓</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CourseRegistration;
