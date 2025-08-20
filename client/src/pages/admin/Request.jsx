import React, { useContext, useEffect, useState } from "react";
import { useService } from "../../context/api/service";
import {
  FiCheck,
  FiX,
  FiClock,
  FiPackage,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { ThemeContext } from "../../context/theme/theme";

const Request = () => {
  const { departmentInventoryRequest, assignInventory, requests } =
    useService();
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  const { theme } = useContext(ThemeContext);

  const handleAction = async (requestId, departmentId, status) => {
    setActionLoading(requestId);
    try {
      await assignInventory({
        departmentId,
        requestId,
        status,
      });
      await departmentInventoryRequest();
    } finally {
      setActionLoading(null);
    }
  };

  const allRequests = requests.flatMap((dept) =>
    dept.inventoryRequests.map((req) => ({
      ...req,
      department: {
        _id: dept._id,
        name: dept.name,
        email: dept.email,
        phone: dept.phone,
      },
    }))
  );

  const filteredRequests = allRequests.filter(
    (req) => req.status === activeTab
  );

  useEffect(() => {
    departmentInventoryRequest();
  }, []);

  const tabs = ["Pending", "Approved", "Rejected"];

  return (
    <div
      className={`p-6 max-w-7xl mx-auto min-h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-200"
          : "bg-white text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Inventory Requests</h1>
          <p className="mt-1">Manage inventory requests from departments</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div>
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? theme === "dark"
                      ? "border-indigo-500 text-indigo-400"
                      : "border-indigo-500 text-indigo-600"
                    : theme === "dark"
                    ? "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <div
          className={`text-center py-16 rounded-2xl ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-100"
          } border shadow-sm`}
        >
          <div
            className={`mx-auto w-20 h-20 ${
              theme === "dark" ? "bg-gray-700" : "bg-indigo-50"
            } rounded-full flex items-center justify-center mb-4`}
          >
            <FiPackage
              className={`${
                theme === "dark" ? "text-indigo-400" : "text-indigo-500"
              } text-2xl`}
            />
          </div>
          <h3
            className={`text-xl font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            } mb-2`}
          >
            No {activeTab.toLowerCase()} requests
          </h3>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } mb-6 max-w-md mx-auto`}
          >
            {activeTab === "Pending"
              ? "All requests have been processed"
              : `No requests have been ${activeTab.toLowerCase()}`}
          </p>
        </div>
      ) : (
        <div
          className={`rounded-xl border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          } overflow-hidden`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead
                className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
              >
                <tr>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Item
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Department
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Quantity
                  </th>
                  <th
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {activeTab === "Pending" ? "Requested At" : "Processed At"}
                  </th>
                  {activeTab === "Pending" && (
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                        theme === "dark" ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  theme === "dark" ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className={
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 ${
                            theme === "dark" ? "bg-gray-600" : "bg-indigo-100"
                          } rounded-full flex items-center justify-center`}
                        >
                          <FiPackage
                            className={
                              theme === "dark"
                                ? "text-indigo-400"
                                : "text-indigo-600"
                            }
                          />
                        </div>
                        <div className="ml-4">
                          <div
                            className={`text-sm font-medium ${
                              theme === "dark"
                                ? "text-gray-100"
                                : "text-gray-900"
                            }`}
                          >
                            {request.inventoryItem || "Unknown Item"}
                          </div>
                          <div
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {request.inventoryItem?.description ||
                              "No description"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {request.department.name}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } flex items-center gap-1`}
                      >
                        <FiMail
                          className={`${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          } text-xs`}
                        />
                        {request.department.email}
                      </div>
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } flex items-center gap-1`}
                      >
                        <FiPhone
                          className={`${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          } text-xs`}
                        />
                        {request.department.phone}
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        theme === "dark" ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {request.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-100" : "text-gray-900"
                        } flex items-center gap-1`}
                      >
                        <FiClock
                          className={`${
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          } text-xs`}
                        />
                        {new Date(
                          activeTab === "Pending"
                            ? request.requestedAt
                            : request.processedAt || request.requestedAt
                        ).toLocaleDateString()}
                        <span className="ml-1">
                          {new Date(
                            activeTab === "Pending"
                              ? request.requestedAt
                              : request.processedAt || request.requestedAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    {activeTab === "Pending" && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleAction(
                                request._id,
                                request.department._id,
                                "Approved"
                              )
                            }
                            disabled={actionLoading === request._id}
                            className={`p-2 text-white bg-green-500 rounded-full transition-all duration-200 hover:shadow-md disabled:opacity-70 ${
                              theme === "dark" ? "hover:bg-green-600" : ""
                            }`}
                            title="Approve"
                          >
                            {actionLoading === request._id ? (
                              <svg
                                className="animate-spin h-4 w-4 text-white"
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
                            ) : (
                              <FiCheck size={16} />
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleAction(
                                request._id,
                                request.department._id,
                                "Rejected"
                              )
                            }
                            disabled={actionLoading === request._id}
                            className={`p-2 text-white bg-red-500 rounded-full transition-all duration-200 hover:shadow-md disabled:opacity-70 ${
                              theme === "dark" ? "hover:bg-red-600" : ""
                            }`}
                            title="Reject"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Request;
