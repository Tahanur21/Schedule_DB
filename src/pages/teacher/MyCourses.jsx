import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyCourses } from "../../services/api";
import Layout from "../../components/Layout";

const MyCourses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyCourses(token).then((data) => {
      setCourses(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [token]);

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">My Courses</h2>
        <p className="text-gray-500 mt-1">Courses assigned to you</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📚</p>
          <p className="font-medium">No courses assigned yet</p>
          <p className="text-sm mt-1">Contact admin to get courses assigned</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 text-lg mb-4">
                📖
              </div>
              <h3 className="font-semibold text-gray-800 text-lg leading-tight mb-1">{c.course_name}</h3>
              <p className="text-primary-600 font-mono text-sm mb-3">{c.course_code}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{c.department || "General"}</span>
                <span className="badge badge-primary badge-sm">{c.credit_hours} credit hrs</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyCourses;
