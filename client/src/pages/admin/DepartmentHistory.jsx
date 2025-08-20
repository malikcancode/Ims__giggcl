import React, { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/theme/theme";
import { useService } from "../../context/api/service";

function DepartmentHistory() {
  const { theme } = useContext(ThemeContext);
  const { department, getAllDepartments, loading } = useService();

  useEffect(() => {
    getAllDepartments();
  }, []);

  return (
    <div
      className={`p-6 max-w-7xl mx-auto h-[83.8vh] ${
        theme === "dark"
          ? "bg-[#1F2937] text-white"
          : "bg-[#F9FAFB] text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-semibold mb-6">Department History</h2>
      <div
        className={`rounded-xl border overflow-hidden shadow-sm ${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Name
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Email
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Created Date
                </th>
                <th
                  className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${
                    theme === "dark" ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Created Time
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                theme === "dark"
                  ? "divide-gray-700 bg-gray-800 text-white"
                  : "divide-gray-200 bg-white text-gray-800"
              }`}
            >
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : department.length > 0 ? (
                department.map((dept) => (
                  <tr
                    key={dept._id}
                    className={
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4">{dept.name}</td>
                    <td className="px-6 py-4">{dept.email}</td>
                    <td className="px-6 py-4">
                      {dept.createdAt
                        ? new Date(dept.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {dept.createdAt
                        ? new Date(dept.createdAt).toLocaleTimeString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className={`px-6 py-6 text-center ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No departments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DepartmentHistory;
