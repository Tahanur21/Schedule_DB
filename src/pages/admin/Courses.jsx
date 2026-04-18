import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getCourses } from "../../services/api";
import Layout from "../../components/Layout";

const Courses = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");

  useEffect(() => {
    getCourses(token).then((data) => {
      setCourses(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [token]);

  const filtered = courses.filter((c) =>
    c.course_name.toLowerCase().includes(search.toLowerCase()) ||
    c.course_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-6">
        <h2 className="font-heading text-3xl text-gray-800">Courses</h2>
        <p className="text-gray-500 mt-1">All registered courses in the system</p>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by course name or code..."
          className="input input-bordered focus:input-primary rounded-xl w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
          <table className="table table-zebra w-full">
            <thead className="bg-primary-600 text-white">
              <tr>
                <th>#</th>
                <th>Course Name</th>
                <th>Code</th>
                <th>Department</th>
                <th>Credit Hours</th>
                <th>Teacher ID</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={c.id} className="hover">
                    <td className="text-gray-400">{i + 1}</td>
                    <td className="font-semibold text-gray-800">{c.course_name}</td>
                    <td>
                      <span className="badge badge-outline font-mono badge-sm">
                        {c.course_code}
                      </span>
                    </td>
                    <td className="text-gray-500">{c.department || "—"}</td>
                    <td>
                      <span className="badge badge-primary badge-sm">
                        {c.credit_hours} cr
                      </span>
                    </td>
                    <td className="text-gray-400 text-sm">#{c.teacher_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default Courses;
