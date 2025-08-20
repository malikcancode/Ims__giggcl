import { useContext, useEffect, useState } from "react";
import { useService } from "../../context/api/service";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiUsers,
  FiMail,
  FiPhone,
  FiKey,
} from "react-icons/fi";
import { ThemeContext } from "../../context/theme/theme";
import { useNavigate } from "react-router-dom";

function Department() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);

  const navigate = useNavigate();

  const {
    loading,
    department,
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useService();
  const { theme } = useContext(ThemeContext);

  const resetForm = () => {
    setName("");
    setPassword("");
    setEmail("");
    setPhone("");
    setIsEditable(false);
    setDepartmentId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const departmentData = {
      name,
      password,
      email,
      phone: phone || undefined,
    };

    if (isEditable) {
      await updateDepartment({
        id: departmentId,
        updatedDepartment: departmentData,
      });
    } else {
      await createDepartment(departmentData);
    }
    resetForm();
  };

  const handleUpdateDepartment = async (id) => {
    const department = await getDepartmentById(id);
    if (department) {
      setName(department.name);
      setPassword("");
      setEmail(department.email);
      setPhone(department.phone || "");
      setDepartmentId(id);
      setIsEditable(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setDepartmentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (departmentToDelete) {
      await deleteDepartment(departmentToDelete);
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  };

  useEffect(() => {
    getAllDepartments();
  }, []);

  return (
    <div
      className={`p-6 max-w-7xl mx-auto h-[83.8vh] ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className={theme === "dark" ? "text-gray-200" : "text-gray-800"}>
          <h1 className="text-2xl font-semibold">Departments Management</h1>
          <p className="mt-1">Manage your organization's departments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <FiPlus className="text-lg" /> New Department
        </button>
      </div>

      {/* Department List */}
      {department.length === 0 ? (
        <div
          className={`text-center py-16 rounded-2xl border shadow-sm ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-gradient-to-br from-gray-50 to-white border-gray-100"
          }`}
        >
          <div
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              theme === "dark" ? "bg-gray-700" : "bg-indigo-50"
            }`}
          >
            <FiUsers
              className={
                theme === "dark" ? "text-indigo-400" : "text-indigo-500"
              }
              size="2xl"
            />
          </div>
          <h3
            className={`text-xl font-medium mb-2 ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            No departments yet
          </h3>
          <p
            className={`mb-6 max-w-md mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Create departments to organize and manage your inventory system
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md transition-all"
          >
            Create First Department
          </button>
        </div>
      ) : (
        <div
          className={`rounded-xl border overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <div id="overflow" className="overflow-x-auto">
            <table className="min-w-full">
              <thead
                className={theme === "dark" ? "bg-gray-700" : "bg-gray-50"}
              >
                <tr>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                id="overflow"
                className={`divide-y ${
                  theme === "dark"
                    ? "divide-gray-700 bg-gray-800"
                    : "divide-gray-200 bg-white"
                }`}
              >
                {department.map((item) => (
                  <tr
                    key={item._id}
                    className={
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                            theme === "dark" ? "bg-gray-600" : "bg-indigo-100"
                          }`}
                        >
                          <FiUsers
                            className={
                              theme === "dark"
                                ? "text-indigo-400"
                                : "text-indigo-600"
                            }
                          />
                        </div>
                        <div className="ml-4">
                          <div
                            title="View Department Inventory"
                            onClick={() =>
                              navigate(
                                `/admin/department/${item._id}/inventory`
                              )
                            }
                            className={`text-sm cursor-pointer font-medium ${
                              theme === "dark"
                                ? "text-gray-100"
                                : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm flex items-center gap-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        <FiMail
                          className={
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }
                        />
                        {item.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm flex items-center gap-2 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-900"
                        }`}
                      >
                        <FiPhone
                          className={
                            theme === "dark" ? "text-gray-500" : "text-gray-400"
                          }
                        />{" "}
                        {item.phone || "Not provided"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleUpdateDepartment(item._id)}
                          className="p-2 text-white bg-indigo-600 rounded-full transition-all duration-200 hover:shadow-md hover:bg-indigo-700"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item._id)}
                          className="p-2 text-white bg-red-500 rounded-full transition-all duration-200 hover:shadow-md hover:bg-red-600"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div
            className={`rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`flex justify-between items-center border-b px-6 py-5 ${
                theme === "dark" ? "border-gray-700" : "border-gray-100"
              }`}
            >
              <h2
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {isEditable ? "Edit Department" : "Create New Department"}
              </h2>
              <button
                onClick={resetForm}
                className={`transition-colors p-1 rounded-full ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. IT, Finance, Warehouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "border-gray-200 text-gray-800 placeholder-gray-500"
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="department@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "border-gray-200 text-gray-800 placeholder-gray-500"
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all pr-10 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "border-gray-200 text-gray-800 placeholder-gray-500"
                    }`}
                    required={!isEditable}
                  />
                  <FiKey
                    className={`absolute right-3 top-3.5 ${
                      theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+92-xxx-xxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "border-gray-200 text-gray-800 placeholder-gray-500"
                  }`}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`px-5 py-2.5 border rounded-lg transition-colors ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
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
                  ) : isEditable ? (
                    "Update Department"
                  ) : (
                    "Create Department"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div
            className={`rounded-2xl shadow-xl w-full max-w-md ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-8 text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
                  theme === "dark" ? "bg-gray-700" : "bg-red-100"
                }`}
              >
                <FiTrash2
                  className={theme === "dark" ? "text-red-400" : "text-red-600"}
                  size="2xl"
                />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 ${
                  theme === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Delete Department
              </h3>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Are you sure you want to permanently delete this department?
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className={`px-6 py-2.5 border rounded-lg transition-colors ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg shadow-md transition-all"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Department;
