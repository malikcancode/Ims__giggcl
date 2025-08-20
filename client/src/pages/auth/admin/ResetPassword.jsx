import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useService } from "../../../context/api/service";
import { FiLock, FiArrowLeft } from "react-icons/fi";

function ResetPassword() {
  const { resetPassword, loading } = useService();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token") || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (password !== confirm) return;
    await resetPassword({ token, password });
    setPassword("");
    setConfirm("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-8 sm:p-10 text-black">
          <h1 className="text-2xl font-medium text-gray-900 mb-1">Reset Password</h1>
          <p className="text-gray-500 text-sm mb-6">Enter a new password for your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !token || password !== confirm}
              className="w-full flex items-center justify-center py-3 px-4 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link to="/login" className="font-medium text-black hover:text-gray-700 inline-flex items-center">
              <FiArrowLeft className="mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;


