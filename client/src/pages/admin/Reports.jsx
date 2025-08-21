import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/theme/theme";
import * as XLSX from "xlsx";
import {
  FiDownload,
  FiFilter,
  FiFileText,
  FiAlertCircle,
  FiCalendar,
} from "react-icons/fi";
import { useService } from "../../context/api/service";

const Reports = () => {
  const { theme } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { category, getAllCategory, inventory, getAllInventory } = useService();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredInventory, setFilteredInventory] = useState([]); // 🔹 hold filtered data

  // 🔹 Filter inventory whenever date changes
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredInventory(inventory);
      return;
    }

    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    const filtered = inventory.filter((item) => {
      const purchaseDate = new Date(item.purchaseDate);
      if (isNaN(purchaseDate)) return false;
      if (start && purchaseDate < start) return false;
      if (end && purchaseDate > end) return false;
      return true;
    });

    setFilteredInventory(filtered);
  }, [startDate, endDate, inventory]);

  const handleExportExcel = async () => {
    if (!selectedCategory) return;

    setIsLoading(true);
    setError(null);

    try {
      let filteredData = filteredInventory.filter((item) => {
        const idMatch = item?.category?._id === selectedCategory;
        const strMatch =
          typeof item?.category === "string" &&
          item.category === selectedCategory;
        return idMatch || strMatch;
      });

      if (filteredData.length === 0) {
        throw new Error("No items found for the selected criteria");
      }

      const exportData = filteredData.map((item) => ({
        Name: item.name || "N/A",
        Description: item.description || "N/A",
        Category: item?.category?.name || "Uncategorized",
        Price: item.price || 0,
        Unit: item.unit || "N/A",
        Supplier: item.supplier || "N/A",
        PurchaseDate: item.purchaseDate
          ? new Date(item.purchaseDate).toLocaleDateString()
          : "N/A",
        Quantity: item.quantity || 0,
        Status: (item.quantity || 0) > 0 ? "In Stock" : "Out of Stock",
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      const categoryName =
        category.find((c) => c._id === selectedCategory)?.name || "Inventory";
      const dateRangeStr =
        startDate && endDate
          ? `_${startDate.split("-").join("")}_${endDate.split("-").join("")}`
          : "";

      XLSX.utils.book_append_sheet(wb, ws, `${categoryName} Report`);
      XLSX.writeFile(
        wb,
        `inventory_report${dateRangeStr}_${
          new Date().toISOString().split("T")[0]
        }.xlsx`
      );
    } catch (err) {
      setError(err.message);
      console.error("Export failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllCategory();
        await getAllInventory();
      } catch (err) {
        setError("Failed to load inventory data");
        console.error("Data loading error:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div
          className={`p-6 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Inventory Reports</h1>
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Generate and download detailed inventory reports
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Date Filter Section */}
              <div className="flex items-center gap-2">
                <FiCalendar
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`rounded px-2 py-1 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    } border`}
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`rounded px-2 py-1 text-sm ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-200 border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    } border`}
                  />
                  {(startDate || endDate) && (
                    <button
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      className={`px-2 py-1 text-sm rounded ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiFilter
                  className={`${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
                <span className="text-sm font-medium">
                  {category.length} Categories Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                theme === "dark"
                  ? "bg-red-900/30 text-red-300"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <FiAlertCircle className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {category.length === 0 ? (
            <div
              className={`p-8 text-center rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <FiFileText className="mx-auto text-4xl mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No Categories Found</h3>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Inventory categories will appear here once created
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.map((cat) => {
                // 🔹 Use filteredInventory instead of raw inventory
                const itemCount = filteredInventory.filter(
                  (item) => item?.category?._id === cat._id
                ).length;

                if (itemCount === 0) return null; // hide empty categories when filtering

                return (
                  <div
                    key={cat._id}
                    className={`p-5 rounded-lg border transition-all hover:shadow-md ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 hover:border-gray-500"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg font-medium">{cat.name}</h2>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          theme === "dark"
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <p
                      className={`text-sm mb-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {cat.description || "No description available"}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        handleExportExcel();
                      }}
                      disabled={isLoading || itemCount === 0}
                      className={`w-full flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        isLoading && selectedCategory === cat._id
                          ? "bg-blue-500 text-white"
                          : itemCount > 0
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : theme === "dark"
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isLoading && selectedCategory === cat._id ? (
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
                          Generating...
                        </>
                      ) : (
                        <>
                          <FiDownload className="mr-2" />
                          {itemCount > 0 ? "Download Report" : "No Items"}
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
