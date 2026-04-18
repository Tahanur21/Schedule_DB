import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goHome = () => {
    if (!user) return navigate("/login");
    navigate(user.role === "admin" ? "/admin" : user.role === "teacher" ? "/teacher" : "/student");
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl mb-6">🚫</p>
        <h1 className="font-heading text-4xl text-gray-800 mb-3">Access Denied</h1>
        <p className="text-gray-500 mb-8">You don't have permission to view this page.</p>
        <button className="btn btn-primary rounded-xl px-8" onClick={goHome}>
          Go to My Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
