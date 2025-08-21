import { useContext, useEffect, useState } from "react";
import { useService } from "../../context/api/service";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiLayers,
  FiTag,
  FiImage,
  FiBox,
} from "react-icons/fi";
import { ThemeContext } from "../../context/theme/theme";

function Categories() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  const {
    loading,
    category,
    getAllCategory,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getItemsByCategory,
  } = useService();
  const { theme } = useContext(ThemeContext);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIsEditable(false);
    setCategoryId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditable) {
      await updateCategory({
        id: categoryId,
        updatedCategory: { name, description },
      });
    } else {
      await createCategory({ name, description });
    }
    resetForm();
  };

  const handleUpdateCategory = async (id) => {
    const category = await getCategoryById(id);
    if (category) {
      setName(category.name);
      setDescription(category.description);
      setCategoryId(id);
      setIsEditable(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCategoryClick = async (item) => {
    setSelectedCategoryName(item.name);
    const items = await getItemsByCategory(item._id);
    setCategoryItems(items);
    setIsItemsModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div
          className={`
            ${theme === "dark" ? "text-gray-200" : "text-gray-800"}
          
          `}
        >
          <h1 className="text-2xl font-semibold ">Categories Management</h1>
          <p className=" mt-1">Organize your products with categories</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-5 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          <FiPlus className="text-lg" /> New Category
        </button>
      </div>

      {/* Category List */}
      {category.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm">
          <div className="mx-auto w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <FiLayers className="text-indigo-500 text-2xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Create categories to better organize and manage your products
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white px-6 py-2.5 rounded-lg shadow-md transition-all"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.map((item) => (
            <div
              onClick={() => handleCategoryClick(item)}
              key={item._id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-sm transition-all duration-300 group hover:-translate-y-1"
            >
              {/* Image Section - Replace with your actual image URL */}
              <div className="h-40 bg-gradient-to-br from-indigo-50 to-blue-100 relative overflow-hidden">
                {/* {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiImage className="text-gray-300 text-4xl opacity-70" />
                  </div>
                )} */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-xs">
                  <span className="text-xs font-medium text-gray-700">
                    Category
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-white border border-gray-100 p-2 rounded-lg shadow-xs flex-shrink-0 mt-[-28px] relative z-10">
                    <FiTag className="text-indigo-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description || "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Stats/Metadata */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-50 rounded-full text-gray-600">
                    12 Items
                  </span>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-50 rounded-full text-gray-600">
                    Updated 2d ago
                  </span>
                </div>
              </div>

              {/* Actions - Appear on hover */}
              <div className="px-5 pb-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleUpdateCategory(item._id)}
                  className="p-2  text-white bg-indigo-600 rounded-full transition-all duration-200 hover:shadow-md"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteClick(item._id)}
                  className="p-2  text-white bg-red-500 rounded-full transition-all duration-200 hover:shadow-md"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isItemsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                Items in "{selectedCategoryName}"
              </h2>
              <button
                onClick={() => setIsItemsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {categoryItems.length === 0 ? (
                <div className="text-center text-gray-500">
                  No items found for this category.
                </div>
              ) : (
                <ul className="space-y-4">
                  {categoryItems.map((item) => (
                    <li
                      key={item._id}
                      className="border rounded-lg p-4 flex flex-col"
                    >
                      <span className="font-semibold text-gray-800 flex items-center gap-2">
                        <FiBox /> {item.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.description}
                      </span>
                      <span className="text-xs text-gray-400">
                        Quantity: {item.quantity} | Price: {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300">
            <div className="flex justify-between items-center border-b border-gray-100 px-6 py-5">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditable ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 text-black">
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Electronics, Furniture"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description about this category"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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
                    "Update Category"
                  ) : (
                    "Create Category"
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-5">
                <FiTrash2 className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Delete Category
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to permanently delete this category? This
                action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
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

export default Categories;
