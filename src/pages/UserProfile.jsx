import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile, changePassword } from "../services/api";
import Layout from "../components/Layout";
import { validateEmail, validateName, validatePassword, validatePasswordMatch, validateField, cleanFormData, formatErrorMessage, formatSuccessMessage } from "../utils/validation";

const UserProfile = () => {
  const { user, token, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [passwordFormData, setPasswordFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    setLoading(true);
    const result = await getUserProfile(token);
    if (result.id || result.user_id) {
      setProfileData(result);
      setEditFormData({
        name: result.name || "",
        email: result.email || "",
        phone: result.phone || "",
        department: result.department || "",
        bio: result.bio || "",
      });
    }
    setLoading(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!editFormData.name) {
      newErrors.name = "Name is required";
    } else if (editFormData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!editFormData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(editFormData.email) === null) {
      const emailError = validateEmail(editFormData.email);
      if (emailError) newErrors.email = emailError;
    }

    if (editFormData.phone && !/^[\d\-\+\(\)\s]{10,}$/.test(editFormData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordFormData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    const newPasswordError = validatePassword(passwordFormData.newPassword, true);
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }

    const matchError = validatePasswordMatch(passwordFormData.newPassword, passwordFormData.confirmPassword);
    if (matchError) {
      newErrors.confirmPassword = matchError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!validateProfileForm()) return;

    setIsSubmitting(true);
    const cleanData = cleanFormData(editFormData);
    const result = await updateUserProfile(token, cleanData);

    if (result.id || result.user_id || result.success) {
      setMessage({ type: "success", text: formatSuccessMessage("update", "Profile") });
      setIsEditing(false);
      fetchProfile();
      // Update user context
      login({ ...user, ...cleanData }, token);
    } else {
      setMessage({ type: "error", text: formatErrorMessage(result) });
    }

    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setIsSubmitting(true);
    const result = await changePassword(token, {
      current_password: passwordFormData.currentPassword,
      new_password: passwordFormData.newPassword,
    });

    if (result.success || result.message) {
      setMessage({ type: "success", text: "✅ Password changed successfully!" });
      setShowPasswordModal(false);
      setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setErrors({});
    } else {
      setMessage({ type: "error", text: formatErrorMessage(result) });
    }

    setIsSubmitting(false);
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-7">
        <h2 className="font-heading text-3xl text-gray-800">My Profile</h2>
        <p className="text-gray-500 mt-1">Manage your account information and settings</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert mb-4 rounded-xl text-sm py-2 ${message.type === "success" ? "alert-success" : "alert-error"}`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-primary-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto mb-4">
              {profileData?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-bold text-lg text-gray-800">{profileData?.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{profileData?.email}</p>
            <div className="mt-3">
              <span className={`badge badge-lg capitalize ${
                profileData?.role === "admin" ? "badge-error" : 
                profileData?.role === "teacher" ? "badge-info" : 
                "badge-success"
              }`}>
                {profileData?.role}
              </span>
            </div>
          </div>

          <div className="divider"></div>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">User ID</p>
              <p className="font-mono text-gray-700">#{profileData?.id}</p>
            </div>
            <div>
              <p className="text-gray-500">Department</p>
              <p className="text-gray-700">{profileData?.department || "Not set"}</p>
            </div>
            <div>
              <p className="text-gray-500">Joined</p>
              <p className="text-gray-700">{profileData?.created_at ? new Date(profileData.created_at).toLocaleDateString() : "Unknown"}</p>
            </div>
          </div>

          <div className="divider"></div>

          <div className="flex flex-col gap-2">
            {!isEditing && (
              <>
                <button onClick={() => setIsEditing(true)} className="btn btn-primary w-full rounded-xl">
                  ✏️ Edit Profile
                </button>
                <button onClick={() => setShowPasswordModal(true)} className="btn btn-outline w-full rounded-xl">
                  🔐 Change Password
                </button>
              </>
            )}
          </div>
        </div>

        {/* Edit Form / Display */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-primary-100 shadow-sm">
          {isEditing ? (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Full Name *</span></label>
                  <input type="text" name="name" value={editFormData.name} onChange={handleEditChange}
                    className={`input input-bordered focus:input-primary rounded-xl ${errors.name ? "input-error" : ""}`} />
                  {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Email *</span></label>
                  <input type="email" name="email" value={editFormData.email} onChange={handleEditChange}
                    className={`input input-bordered focus:input-primary rounded-xl ${errors.email ? "input-error" : ""}`} />
                  {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Phone Number</span></label>
                  <input type="tel" name="phone" value={editFormData.phone} onChange={handleEditChange}
                    placeholder="+1 (555) 000-0000"
                    className={`input input-bordered focus:input-primary rounded-xl ${errors.phone ? "input-error" : ""}`} />
                  {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Department</span></label>
                  <input type="text" name="department" value={editFormData.department} onChange={handleEditChange}
                    placeholder="e.g., Computer Science"
                    className="input input-bordered focus:input-primary rounded-xl" />
                </div>

                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Bio</span></label>
                  <textarea name="bio" value={editFormData.bio} onChange={handleEditChange}
                    placeholder="Tell us about yourself..."
                    className="textarea textarea-bordered focus:textarea-primary rounded-xl" rows="4"></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                  }} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1 rounded-xl">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Full Name</p>
                  <p className="text-gray-800 mt-1">{profileData?.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Email Address</p>
                  <p className="text-gray-800 mt-1">{profileData?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Phone Number</p>
                  <p className="text-gray-800 mt-1">{profileData?.phone || "Not set"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Department</p>
                  <p className="text-gray-800 mt-1">{profileData?.department || "Not set"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Bio</p>
                  <p className="text-gray-800 mt-1">{profileData?.bio || "Not set"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-medium">Role</p>
                  <p className="text-gray-800 mt-1 capitalize">{profileData?.role}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      <>
        {showPasswordModal && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowPasswordModal(false)} />}
        {showPasswordModal && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-primary-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Current Password *</span></label>
                  <input type="password" name="currentPassword" value={passwordFormData.currentPassword} onChange={handlePasswordChange}
                    className={`input input-bordered focus:input-primary rounded-xl ${errors.currentPassword ? "input-error" : ""}`} />
                  {errors.currentPassword && <p className="text-error text-sm mt-1">{errors.currentPassword}</p>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">New Password *</span></label>
                  <input type="password" name="newPassword" value={passwordFormData.newPassword} onChange={handlePasswordChange}
                    className={`input input-bordered focus:input-primary rounded-xl ${errors.newPassword ? "input-error" : ""}`} />
                  {errors.newPassword && <p className="text-error text-sm mt-1">{errors.newPassword}</p>}
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text font-medium">Confirm New Password *</span></label>
                  <input type="password" name="confirmPassword" value={passwordFormData.confirmPassword} onChange={handlePasswordChange}
                    className={`input input-bordered focus:input-primary rounded-xl ${errors.confirmPassword ? "input-error" : ""}`} />
                  {errors.confirmPassword && <p className="text-error text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setErrors({});
                  }} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary flex-1 rounded-xl">
                    {isSubmitting ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    </Layout>
  );
};

export default UserProfile;
