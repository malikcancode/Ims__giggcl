import { useState } from "react";
import { Link } from "react-router-dom";
import { useService } from "../../../context/api/service";
import { FiMail, FiArrowLeft } from "react-icons/fi";

function ForgotPassword() {
  const { forgotPassword, loading } = useService();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setEmail("");
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="College Logo"
              className="w-24 h-24 mx-auto mb-4 object-contain"
            />
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Forgot Password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your email to reset your password
            </p>
          </div>

          <form className="space-y-5 text-black" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                <span>Submit</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <Link
              to="/login"
              className="font-medium text-black hover:text-gray-700 flex items-center justify-center"
            >
              <FiArrowLeft className="mr-1" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
