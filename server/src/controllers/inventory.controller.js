import Inventory from "../schemas/inventory.model.js";
import { catchErrors } from "../utils/index.js";

const getInventory = catchErrors(async (req, res) => {
  const inventories = await Inventory.find().populate("category");

  return res.status(200).json({
    success: true,
    inventories,
  });
});

const getInventoryById = catchErrors(async (req, res) => {
  const { id } = req.params;

  const inventory = await Inventory.findById(id);

  if (!inventory) {
    throw new Error("Inventory item not found");
  }

  return res.status(200).json({
    success: true,
    inventory,
  });
});

const addInventory = catchErrors(async (req, res) => {
  const {
    name,
    description,
    category,
    quantity,
    // unit,
    price,
    purchaseDate,
    supplier,
  } = req.body;

  if (!name || !category || !quantity || !price || !purchaseDate) {
    throw new Error("All fields are required");
  }

  const existingItem = await Inventory.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
    category,
    price,
  });

  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.purchaseDate = purchaseDate;
    existingItem.status = existingItem.quantity > 0 ? "In Stock" : "Out of Stock";
    await existingItem.save();

    const updatedItem = await Inventory.findById(existingItem._id).populate("category");

    return res.status(200).json({
      success: true,
      message: "Inventory quantity updated successfully",
      inventory: updatedItem,
    });
  }

  const inventory = await Inventory.create({
    name,
    category,
    description,
    quantity,
    price,
    purchaseDate,
    supplier,
    status: quantity > 0 ? "In Stock" : "Out of Stock",
  });

  const populated = await Inventory.findById(inventory._id).populate("category");

  return res.status(201).json({
    success: true,
    message: "Inventory added successfully",
    inventory: populated,
  });
});

const getInventoryByCategory = catchErrors(async (req, res) => {
  const { categoryId } = req.params;

  const inventories = await Inventory.find({ category: categoryId }).populate(
    "category"
  );

  return res.status(200).json({
    success: true,
    inventories,
  });
});

const deleteInventory = catchErrors(async (req, res) => {
  const { id } = req.params;

  const inventory = await Inventory.findByIdAndDelete(id);

  if (!inventory) {
    throw new Error("Inventory item not found");
  }

  return res.status(200).json({
    success: true,
    message: "Inventory deleted successfully",
    inventory,
  });
});

const updateInventory = catchErrors(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    quantity,
    // unit,
    price,
    purchaseDate,
    supplier,
    description,
  } = req.body;

  const updatedInventory = await Inventory.findByIdAndUpdate(
    id,
    {
      name,
      category,
      quantity,
      // unit,
      price,
      purchaseDate,
      supplier,
      description,
      status: quantity > 0 ? "In Stock" : "Out of Stock",
    },
    { new: true }
  ).populate("category");

  if (!updatedInventory) {
    throw new Error("Inventory item not found");
  }

  return res.status(200).json({
    success: true,
    message: "Inventory updated successfully",
    inventory: updatedInventory,
  });
});

const checkInventoryStock = catchErrors(async (req, res) => {
  const { id } = req.params;

  const inventory = await Inventory.findById(id);

  if (!inventory) {
    throw new Error("Inventory item not found");
  }

  return res.status(200).json({
    success: true,
    stockStatus: inventory.status,
    quantity: inventory.quantity,
  });
});

export {
  getInventory,
  getInventoryById,
  getInventoryByCategory,
  updateInventory,
  deleteInventory,
  addInventory,
  checkInventoryStock,
};
