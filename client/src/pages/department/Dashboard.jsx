import { useContext, useEffect, useState } from "react";
import {
  FiDollarSign,
  FiRefreshCw,
  FiTrendingUp,
  FiHome,
  FiBox,
  FiSettings,
  FiInbox,
} from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { ThemeContext } from "../../context/theme/theme";
import { useService } from "../../context/api/service";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function DeparmtentDashboard() {
  const { theme } = useContext(ThemeContext);
  const [timeRange, setTimeRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const { departmentInventory, getDepartmentInventory } = useService();

  const refreshData = async () => {
    setIsLoading(true);
    await getDepartmentInventory();
    setIsLoading(false);
  };

  useEffect(() => {
    getDepartmentInventory();
  }, []);

  const totalPrice = departmentInventory.reduce((total, item) => {
    return total + item.inventoryItem.price * item.quantity;
  }, 0);

  const totalInventories = departmentInventory.length;

  // Recent assigned items (latest first)
  const recentAssigned = [...departmentInventory]
    .sort(
      (a, b) =>
        new Date(b.processedAt || b.requestedAt) -
        new Date(a.processedAt || a.requestedAt)
    )
    .slice(0, 6);

  const links = [
    {
      path: "/department",
      label: "Dashboard Overview",
      icon: <FiHome size={35} />,
    },
    {
      path: "/department/inventory",
      label: "View Inventory",
      icon: <FiBox size={35} />,
    },

    {
      path: "/department/request",
      label: "Request Inventory",
      icon: <FiInbox size={35} />,
    },
    {
      path: "/department/settings",
      label: "System Settings",
      icon: <FiSettings size={35} />,
    },
  ];

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        theme === "dark" ? "bg-gray-900" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1
              className={`text-2xl font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Deparmtent Dashboard
            </h1>
            <p
              className={`mt-1 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Overview of your department inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              } border ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-100"
              } border ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              } transition-colors`}
              title="Refresh data"
            >
              <FiRefreshCw
                className={`${isLoading ? "animate-spin" : ""} ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Total Inventories */}
          <div
            className={`p-6 rounded-xl shadow-sm ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Items
                </p>
                <h3
                  className={`text-2xl font-bold mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {totalInventories}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <FiTrendingUp className="inline mr-1" /> 12% from last month
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-purple-900/30" : "bg-purple-100"
                } text-purple-500`}
              >
                <FiBox className="text-xl" />
              </div>
            </div>
          </div>

          {/* Inventory Value */}
          <div
            className={`p-6 rounded-xl shadow-sm ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Value
                </p>
                <h3
                  className={`text-2xl font-bold mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Rs {totalPrice}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <FiTrendingUp className="inline mr-1" /> 8% from last month
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-green-900/30" : "bg-green-100"
                } text-green-500`}
              >
                <FiDollarSign className="text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h1
          className={`text-2xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Quick Links Deparmtnet
        </h1>
        <p
          className={`mt-1 text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Quick link of your department dashboard
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mt-10">
        {links.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex-grow w-[97%] sm:w-[400px] h-[180px] rounded-2xl border flex flex-col items-center justify-center text-center ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 border-gray-600"
                : "bg-white hover:bg-gray-100 border-gray-200"
            } hover:border-blue-500 hover:ring-2 hover:ring-blue-500 transition duration-300 ease-in-out`}
          >
            <p className="text-blue-500">{item.icon}</p>
            <h3 className="mt-2 text-lg font-semibold text-blue-500">
              {item.label}
            </h3>
          </Link>
        ))}
      </div>

      {/* Recent Assigned Items */}
      <div className="mt-10">
        <h2
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Recent Assigned Items
        </h2>
        <div
          className={`mt-4 rounded-xl shadow-sm overflow-hidden border ${
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          {recentAssigned.length === 0 ? (
            <div className="p-6 text-sm opacity-70">No items assigned yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentAssigned.map((item, idx) => (
                    <tr key={item._id} className={theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50"}>
                      <td className="px-6 py-3 text-sm">{idx + 1}</td>
                      <td className="px-6 py-3 text-sm">{item.inventoryItem?.name || item.inventoryItem || "Unknown"}</td>
                      <td className="px-6 py-3 text-sm">{item.quantity}</td>
                      <td className="px-6 py-3 text-sm">
                        {new Date(item.processedAt || item.requestedAt).toLocaleDateString()} {" "}
                        {new Date(item.processedAt || item.requestedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeparmtentDashboard;
