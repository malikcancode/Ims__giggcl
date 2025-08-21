import Category from "../schemas/category.model.js";
import Inventory from "../schemas/inventory.model.js";
import { catchErrors } from "../utils/index.js";

const getAllCategories = catchErrors(async (req, res) => {
  const categories = await Category.find();

  return res.status(200).json({
    success: true,
    categories,
  });
});

const addCategory = catchErrors(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new Error("Category name is required");
  }

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const newCategory = await Category.create({
    name,
    description,
  });

  return res.status(201).json({
    success: true,
    message: "Category added successfully",
    category: newCategory,
  });
});

const getCategoryById = catchErrors(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return res.status(200).json({
    success: true,
    category,
  });
});

const updateCategory = catchErrors(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

const deleteCategory = catchErrors(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    category,
  });
});

const getCategoryItems = catchErrors(async (req, res) => {
  const { id } = req.params;
  const items = await Inventory.find({ category: id });
  return res.status(200).json({
    success: true,
    items,
  });
});
export {
  addCategory,
  getCategoryById,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryItems,
};
