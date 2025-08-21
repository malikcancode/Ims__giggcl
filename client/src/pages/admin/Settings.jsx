import { useContext, useState } from "react";
import { ThemeContext } from "../../context/theme/theme";
import { useService } from "../../context/api/service";
import {
  FiEdit2,
  FiUser,
  FiMail,
  FiLock,
  FiMoon,
  FiSun,
  FiUpload,
} from "react-icons/fi";

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { loggedInUser, updateProfile, loading } = useService();

  const [formData, setFormData] = useState({
    password: "",
    name: loggedInUser.name,
    email: loggedInUser.email,
    profilePicture: loggedInUser.picture,
  });

  const [preview, setPreview] = useState(loggedInUser.picture);
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <div className="p-6 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                This information will be displayed publicly
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-start gap-6">
                <div
                  className="relative group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-600 relative">
                    <img
                      src={preview || "https://avatar.vercel.sh/placeholder"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    {isHovering && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity">
                        <FiUpload className="text-white text-xl" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="file-input"
                    className={`absolute -bottom-2 -right-2 rounded-full p-2 cursor-pointer transition-all ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-white hover:bg-gray-100"
                    } shadow-md`}
                  >
                    <FiEdit2 className="text-blue-500" size={16} />
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {loggedInUser.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {loggedInUser.email}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    JPG, GIF or PNG. Max size of 2MB
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Username
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-md border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } placeholder-gray-400 sm:text-sm`}
                    placeholder="Your username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-md border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } placeholder-gray-400 sm:text-sm`}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
          </>
        );
      case "security":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
              Manage your account security settings
            </p>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Change Password
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-md border ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    } placeholder-gray-400 sm:text-sm`}
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Leave blank to keep your current password
                </p>
              </div>
            </div>
          </div>
        );
      case "appearance":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-6">
              Customize how the app looks on your device
            </p>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {theme === "dark" ? (
                    <FiMoon className="h-5 w-5 text-gray-400 mr-3" />
                  ) : (
                    <FiSun className="h-5 w-5 text-gray-400 mr-3" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Dark Mode
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={toggleTheme}
                    checked={theme === "dark"}
                  />
                  <div
                    className={`w-11 h-6 rounded-full peer ${
                      theme === "dark" ? "bg-blue-600" : "bg-gray-300"
                    } peer-focus:ring-2 peer-focus:ring-blue-500 dark:peer-focus:ring-blue-500`}
                  >
                    <div
                      className={`absolute top-0.5 left-[2px] bg-white rounded-full h-5 w-5 transition-transform ${
                        theme === "dark" ? "translate-x-5" : ""
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : ""
      }`}
    >
      <div className="max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Admin Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account preferences and profile information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div
              className={`rounded-xl p-1 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-sm`}
            >
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center transition-colors ${
                    activeTab === "profile"
                      ? theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <FiUser className="mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center transition-colors ${
                    activeTab === "security"
                      ? theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <FiLock className="mr-3" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab("appearance")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center transition-colors ${
                    activeTab === "appearance"
                      ? theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-blue-50 text-blue-600"
                      : theme === "dark"
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <FiMoon className="mr-3" />
                  Appearance
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div
                className={`rounded-xl shadow-sm overflow-hidden ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
              >
                {renderTabContent()}

                {/* Actions - Only show when not in appearance tab */}
                {activeTab !== "appearance" && (
                  <div
                    className={`px-6 py-4 border-t dark:border-gray-700 ${
                      theme === "dark" ? "bg-gray-800" : "bg-gray-50"
                    } flex justify-end`}
                  >
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <>
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
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
