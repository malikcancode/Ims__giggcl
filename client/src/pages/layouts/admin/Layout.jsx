import { useContext, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ThemeContext } from "../../../context/theme/theme";
import { useService } from "../../../context/api/service";
import {
  FiHome,
  FiBox,
  FiList,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiInbox,
  FiMenu,
  FiX,
  FiLayers,
  FiClock,
} from "react-icons/fi";

const Layout = () => {
  const { logout, loggedInUser } = useService();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { pathname } = useLocation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [];
  const links = [
    {
      path: "/dashboard",
      label: "Dashboard Overview",
      icon: <FiHome size={18} />,
    },
    {
      path: "/manage-inventory",
      label: "Manage Inventory",
      icon: <FiBox size={18} />,
    },
    {
      path: "/departments",
      label: "Department Directory",
      icon: <FiLayers size={18} />,
    },

    { path: "/requests", label: "Request Center", icon: <FiInbox size={18} /> },
    {
      path: "/categories",
      label: "Category Manager",
      icon: <FiList size={18} />,
    },
    {
      path: "/reports",
      label: "Analytics & Reports",
      icon: <FiBarChart2 size={18} />,
    },
    // {
    //   path: "/history",
    //   label: "Issuance ",
    //   icon: <FiClock size={18} />,
    // },
    {
      path: "/department-history",
      label: "Department History",
      icon: <FiClock size={18} />,
    },
    {
      path: "/settings",
      label: "System Settings",
      icon: <FiSettings size={18} />,
    },
  ];

  const categoriesLinks = categories.map((category) => ({
    path: `/categories/${category.name.toLowerCase()}`,
    label: category.name,
  }));

  const getLinkStyles = (path) =>
    pathname === path
      ? theme === "dark"
        ? "bg-blue-600 text-white shadow-md"
        : "bg-blue-100 text-blue-700 border-l-4 border-blue-500"
      : theme === "dark"
      ? "hover:bg-gray-700 text-gray-300 hover:text-white"
      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900";

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
  };

  return (
    <div
      className={`flex min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed z-30 left-4 top-4 p-2 rounded-lg md:hidden ${
          theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-700"
        } shadow-md`}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 w-64 flex flex-col border-r transform transition-transform duration-300 ease-in-out h-[screen] ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Logo */}
        <div className="p-5 mb-2 flex items-center justify-center">
          <img src="/logo.png" alt="App Logo" className="h-24" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map(({ path, label, icon, hasDropdown }) => (
            <div key={path} className="relative">
              {!hasDropdown ? (
                <Link
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${getLinkStyles(
                    path
                  )}`}
                >
                  <span className="flex-shrink-0">{icon}</span>
                  <span>{label}</span>
                </Link>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => setOpenDropdown(!openDropdown)}
                    className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${getLinkStyles(
                      path
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex-shrink-0">{icon}</span>
                      <span>{label}</span>
                    </div>
                    {openDropdown ? (
                      <FiChevronDown size={16} />
                    ) : (
                      <FiChevronRight size={16} />
                    )}
                  </button>

                  {openDropdown && (
                    <div
                      className={`ml-8 mt-1 space-y-1 pl-2 border-l ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      {categoriesLinks.length > 0 ? (
                        categoriesLinks.map(({ path, label }) => (
                          <Link
                            key={path}
                            to={path}
                            onClick={() => setSidebarOpen(false)}
                            className={`block px-3 py-2 text-xs rounded-md transition-all ${
                              pathname === path
                                ? theme === "dark"
                                  ? "bg-blue-900/30 text-blue-400"
                                  : "bg-blue-50 text-blue-600"
                                : theme === "dark"
                                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                            }`}
                          >
                            {label}
                          </Link>
                        ))
                      ) : (
                        <div
                          className={`px-3 py-2 text-xs italic ${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          No categories
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              }`}
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
          {/* User Profile */}
          <div
            className={`flex items-center p-2 mb-4 rounded-lg transition-all pt-7 ${
              theme === "dark" ? "" : ""
            }`}
          >
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={loggedInUser?.picture || "https://via.placeholder.com/150"}
                alt={loggedInUser?.name || "Department"}
              />
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                  theme === "dark"
                    ? "border-gray-800 bg-green-500"
                    : "border-white bg-green-400"
                }`}
              ></div>
            </div>
            <div className="ml-3 overflow-hidden">
              <h2
                className={`text-sm font-medium truncate ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                {loggedInUser?.name}
              </h2>
              <p
                className={`text-xs truncate ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {loggedInUser?.email}
              </p>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-100">
        <header
          className={`sticky top-0 z-10 flex justify-between items-center p-4 ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h1 className="text-lg font-semibold">
            {/* {links.find((link) => pathname === link.path)?.label || "Dashboard"} */}
          </h1>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              onChange={toggleTheme}
              checked={theme === "dark"}
            />
            <div
              className={`w-11 h-6 rounded-full peer ${
                theme === "dark"
                  ? "bg-gray-600 peer-focus:ring-blue-500"
                  : "bg-gray-200 peer-focus:ring-blue-300"
              } peer-focus:ring-2`}
            >
              <div
                className={`absolute top-0.5 left-[2px] bg-white rounded-full h-5 w-5 transition-all ${
                  theme === "dark" ? "translate-x-5" : ""
                }`}
              ></div>
            </div>
            <span className="ml-2 text-sm font-medium">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </label>
        </header>

        <div className={`p-6 ${theme === "dark" ? "bg-gray-900" : ""}`}>
          <Outlet />
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-6 text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                <FiLogOut
                  size={24}
                  className={theme === "dark" ? "text-white" : "text-gray-700"}
                />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                Confirm Logout
              </h3>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Are you sure you want to logout?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className={`px-6 py-2.5 rounded-lg border ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className={`px-6 py-2.5 rounded-lg text-white ${
                    theme === "dark"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-500 hover:bg-red-600"
                  } transition-colors`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
