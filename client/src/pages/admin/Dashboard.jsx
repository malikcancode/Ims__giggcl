import { useContext, useEffect, useRef, useState } from "react";
import { Bar, Pie, getElementAtEvent } from "react-chartjs-2";
import {
  FiBox,
  FiLayers,
  FiDollarSign,
  FiAlertTriangle,
  FiRefreshCw,
  FiTrendingUp,
  FiPieChart,
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
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const [timeRange, setTimeRange] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    getAllInsights,
    inventory,
    getAllInventory,
    insight,
    category,
    getAllCategory,
  } = useService();

  const refreshData = async () => {
    setIsLoading(true);
    await getAllInsights();
    setIsLoading(false);
  };

  const getRange = () => {
    const now = new Date();
    const start = new Date(now);
    if (timeRange === "daily") {
      start.setHours(0, 0, 0, 0);
    } else if (timeRange === "weekly") {
      const day = now.getDay();
      const diff = (day + 6) % 7; // days since Monday
      start.setDate(now.getDate() - diff);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    return {
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const range = getRange();
      await Promise.all([
        getAllInsights(range),
        getAllInventory(),
        getAllCategory(),
      ]);
      setIsLoading(false);
    };
    fetchData();
  }, [timeRange]);

  const totalCategories = insight?.totalCategories || 0;
  const totalPrice = insight?.totalPrice || 0;
  const totalInventories = insight?.totalInventories || 0;
  const lowStockItems =
    inventory?.filter((item) => item.quantity <= 5).length || 0;
  console.log("Low stock items:", lowStockItems, "Inventory:", inventory);

  const totalInventoryByCategory = insight?.totalInventoryByCategory || [];

  // Color palette
  const colors = {
    blue: theme === "dark" ? "#60d2ff" : "#3b82f6",
    purple: theme === "dark" ? "#a78bfa" : "#8b5cf6",
    orange: theme === "dark" ? "#fdba74" : "#f97316",
    green: theme === "dark" ? "#86efac" : "#10b981",
    red: theme === "dark" ? "#fca5a5" : "#ef4444",
  };

  // Inventory Levels Chart Data
  const inventoryChartData = {
    labels: totalInventoryByCategory.map((item) => item.categoryName),
    datasets: [
      {
        label: "Inventory Quantity",
        data: totalInventoryByCategory.map((item) => item.totalQuantity),
        backgroundColor: [
          colors.blue,
          colors.purple,
          colors.orange,
          colors.green,
          colors.red,
        ],
        borderColor: theme === "dark" ? "#1e293b" : "#ffffff",
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Category Distribution Data
  const categoryDistributionData = {
    labels: totalInventoryByCategory.map((item) => item.categoryName),
    datasets: [
      {
        data: totalInventoryByCategory.map((item) => item.totalQuantity),
        backgroundColor: [
          colors.blue,
          colors.purple,
          colors.orange,
          colors.green,
          colors.red,
        ],
        borderColor: theme === "dark" ? "#1e293b" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };
  const barRef = useRef(null);
  const pieRef = useRef(null);

  // Handle chart click → navigate to inventory filtered by category
  const handleBarClick = (event) => {
    const elements = getElementAtEvent(barRef.current, event);
    if (!elements?.length) return;
    const index = elements[0].index;
    const clickedLabel = barRef.current?.data?.labels?.[index];
    if (!clickedLabel) return;
    const match = category.find((c) => c.name === clickedLabel);
    if (!match?._id) return;
    navigate(
      `/manage-inventory?categoryId=${encodeURIComponent(
        match._id
      )}&categoryName=${encodeURIComponent(match.name)}`
    );
  };

  const handlePieClick = (event) => {
    const elements = getElementAtEvent(pieRef.current, event);
    if (!elements?.length) return;
    const index = elements[0].index;
    const clickedLabel = pieRef.current?.data?.labels?.[index];
    if (!clickedLabel) return;
    const match = category.find((c) => c.name === clickedLabel);
    if (!match?._id) return;
    navigate(
      `/manage-inventory?categoryId=${encodeURIComponent(
        match._id
      )}&categoryName=${encodeURIComponent(match.name)}`
    );
  };

  // Chart options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: theme === "dark" ? "#e2e8f0" : "#64748b",
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
        titleColor: theme === "dark" ? "#ffffff" : "#1e293b",
        bodyColor: theme === "dark" ? "#e2e8f0" : "#64748b",
        borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme === "dark" ? "#94a3b8" : "#64748b",
        },
      },
      y: {
        grid: {
          color: theme === "dark" ? "#334155" : "#e2e8f0",
          drawBorder: false,
        },
        ticks: {
          color: theme === "dark" ? "#94a3b8" : "#64748b",
          beginAtZero: true,
          padding: 10,
        },
      },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    animation: {
      duration: 1000,
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: theme === "dark" ? "#e2e8f0" : "#64748b",
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
        titleColor: theme === "dark" ? "#ffffff" : "#1e293b",
        bodyColor: theme === "dark" ? "#e2e8f0" : "#64748b",
        borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "65%",
    radius: "80%",
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

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
              Inventory Dashboard
            </h1>
            <p
              className={`mt-1 text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Comprehensive overview of your inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Categories */}
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
                  Total Categories
                </p>
                <h3
                  className={`text-2xl font-bold mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {totalCategories}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  <FiTrendingUp className="inline mr-1" /> 5% from last month
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
                } text-blue-500`}
              >
                <FiLayers className="text-xl" />
              </div>
            </div>
          </div>

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

          {/* Low Stock */}
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
                  Low Stock Items
                </p>
                <h3
                  className={`text-2xl font-bold mt-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {lowStockItems}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Needs attention
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  theme === "dark" ? "bg-amber-900/30" : "bg-amber-100"
                } text-amber-500`}
              >
                <FiAlertTriangle className="text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Levels by Category */}
          <div
            className={`p-6 rounded-xl shadow-sm ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Inventory Levels
                </h3>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Quantity by category
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {timeRange === "daily"
                  ? "Today"
                  : timeRange === "weekly"
                  ? "This Week"
                  : "This Month"}
              </div>
            </div>
            <div className="h-80">
              <Bar ref={barRef} data={inventoryChartData} options={barChartOptions} onClick={handleBarClick} />
            </div>
          </div>

          {/* Category Distribution */}
          <div
            className={`p-6 rounded-xl shadow-sm ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Category Distribution
                </h3>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Percentage of total inventory
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {timeRange === "daily"
                  ? "Today"
                  : timeRange === "weekly"
                  ? "This Week"
                  : "This Month"}
              </div>
            </div>
            <div className="h-80">
              <Pie ref={pieRef} data={categoryDistributionData} options={pieChartOptions} onClick={handlePieClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
