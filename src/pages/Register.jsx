import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerApi } from "../services/api";

const Register = () => {
  const [form, setForm]     = useState({ name: "", email: "", password: "", role: "student", department: "" });
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const data = await registerApi(form);
      if (data.message) {
        setSuccess("Account created! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl text-primary-700 mb-2">
            Schedule<span className="text-primary-400">DB</span>
          </h1>
          <p className="text-gray-500 text-sm">Create your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-primary-100">
          <h2 className="font-heading text-2xl text-gray-800 mb-6">Register</h2>

          {error   && <div className="alert alert-error mb-4 text-sm py-2"><span>⚠️ {error}</span></div>}
          {success && <div className="alert alert-success mb-4 text-sm py-2"><span>✅ {success}</span></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium text-gray-700">Full Name</span></label>
              <input name="name" type="text" placeholder="John Doe" className="input input-bordered focus:input-primary w-full rounded-xl" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium text-gray-700">Email</span></label>
              <input name="email" type="email" placeholder="you@university.edu" className="input input-bordered focus:input-primary w-full rounded-xl" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium text-gray-700">Password</span></label>
              <input name="password" type="password" placeholder="••••••••" className="input input-bordered focus:input-primary w-full rounded-xl" value={form.password} onChange={handleChange} required />
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium text-gray-700">Role</span></label>
              <select name="role" className="select select-bordered focus:select-primary w-full rounded-xl" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium text-gray-700">Department</span></label>
              <input name="department" type="text" placeholder="e.g. Computer Science" className="input input-bordered focus:input-primary w-full rounded-xl" value={form.department} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary w-full rounded-xl mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
