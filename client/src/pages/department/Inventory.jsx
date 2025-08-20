import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../context/theme/theme";
import { FiSearch, FiBox } from "react-icons/fi";
import { useService } from "../../context/api/service";
import { useParams } from "react-router-dom";

function DepartmentInventory() {
  const { loading, getDepartmentInventoryById } = useService();
  const { theme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentInventory, setDepartmentInventory] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchInventory() {
      const inventory = await getDepartmentInventoryById(id);
      console.log(inventory);
      setDepartmentInventory(inventory);
    }
    fetchInventory();
  }, [id]);
  // Filter inventory based on search term
  const filteredInventory =
    departmentInventory?.filter((item) => {
      const name =
        typeof item.inventoryItem === "string"
          ? item.inventoryItem
          : item.inventoryItem?.name;
      const description =
        typeof item.inventoryItem === "object"
          ? item.inventoryItem?.description
          : "";
      return (
        name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  console.log(filteredInventory);
  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-white text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Department Inventory</h1>
            <p className="mt-1">
              {filteredInventory.length} items in department inventory
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div
          className={`rounded-xl shadow-sm overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border`}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading inventory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead
                  className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
                >
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Request Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredInventory.length > 0 ? (
                    filteredInventory.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <FiBox className="text-blue-600 dark:text-blue-300" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">
                                {item.inventoryItem?.name || "Unknown Item"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm line-clamp-2">
                            {item.inventoryItem?.description ||
                              "No description"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm line-clamp-2">
                            {item.inventoryItem?.supplier || "No supplier"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm line-clamp-2">
                            Rs {item.inventoryItem?.price || "No price"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.quantity > 5
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {item.quantity} {item.inventoryItem?.unit || "pcs"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.status === "Approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : item.status === "Rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(item.requestedAt).toLocaleDateString()} at{" "}
                          {new Date(item.requestedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                          <FiBox className="text-gray-400 text-4xl mb-4" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No inventory items found
                          </p>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm("")}
                              className="mt-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DepartmentInventory;
