import React, { useContext, useEffect, useState } from "react";
import { FiBox } from "react-icons/fi";
import { useService } from "../../context/api/service";
import { ThemeContext } from "../../context/theme/theme";
import toast from "react-hot-toast";

const DepartmentRequest = () => {
  const { theme } = useContext(ThemeContext);

  const { loading, requestInventory, getMyDepartmentRequests } = useService();

  const [formData, setFormData] = useState({
    departmentId: JSON.parse(localStorage.getItem("department"))?._id || "",
    inventoryItem: "",
    quantity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.departmentId) {
      toast.error("Department not logged in. Please log in again.");
      return;
    }
    await requestInventory(formData);
    setFormData({
      departmentId: formData.departmentId,
      inventoryItem: "",
      quantity: "",
    });
  };

  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (!formData.departmentId) return;
      const requests = await getMyDepartmentRequests(formData.departmentId);
      setMyRequests(requests);
    };
    load();
  }, [formData.departmentId, loading]);

  return (
    <section className="h-[83.8vh] flex justify-center items-center">
      <div
        className={`rounded-2xl shadow-md w-full max-w-md transform transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div
          className={`flex justify-between items-center border-b px-6 py-5 ${
            theme === "dark" ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <h2
            className={`text-xl font-semibold ${
              theme === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Inventory Request
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Inventory Item Input */}
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Inventory Item <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="inventoryItem"
                placeholder="Enter inventory item"
                value={formData.inventoryItem}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all pr-10 ${
                  theme === "dark"
                    ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                    : "border-gray-200 text-gray-800 placeholder-gray-500"
                }`}
                required
              />
              <FiBox
                className={`absolute right-3 top-3.5 pointer-events-none ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "border-gray-200 text-gray-800 placeholder-gray-500"
              }`}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-lg disabled:opacity-70 transition-all shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center">
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
                  Processing...
                </span>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
      {/* My Requests */}
      <div className="mt-6 p-6 rounded-2xl border">
        <h3 className="text-lg font-semibold mb-4">My Requests</h3>
        {myRequests.length === 0 ? (
          <p className="text-sm opacity-70">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
                <tr>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">Qty</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Requested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {myRequests.map((r) => (
                  <tr key={r._id}>
                    <td className="px-4 py-2">{r.inventoryItem}</td>
                    <td className="px-4 py-2">{r.quantity}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        r.status === "Approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : r.status === "Rejected"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {new Date(r.requestedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default DepartmentRequest;
