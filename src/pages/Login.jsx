import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      if (data.access_token) {
        login(data.user, data.access_token);
        const role = data.user.role;
        navigate(role === "admin" ? "/admin" : role === "teacher" ? "/teacher" : "/student");
      } else {
        setError(data.error || "Login failed");
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl text-primary-700 mb-2">
            Schedule<span className="text-primary-400">DB</span>
          </h1>
          <p className="text-gray-500 text-sm">Smart University Scheduling System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-primary-100">
          <h2 className="font-heading text-2xl text-gray-800 mb-6">Welcome back</h2>

          {error && (
            <div className="alert alert-error mb-4 text-sm py-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Email</span>
              </label>
              <input
                type="email"
                placeholder="you@university.edu"
                className="input input-bordered focus:input-primary w-full rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered focus:input-primary w-full rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-xl mt-2"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center text-xs text-gray-400">
          Backend: <span className="font-mono">http://127.0.0.1:5000</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
