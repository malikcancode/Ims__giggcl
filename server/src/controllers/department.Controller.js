import bcrypt from "bcryptjs";
import Department from "../schemas/department.model.js";
import Inventory from "../schemas/inventory.model.js";
import { catchErrors } from "../utils/index.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const getAllDepartments = catchErrors(async (req, res) => {
  const departments = await Department.find();

  return res.status(200).json({
    success: true,
    departments,
  });
});

const getDepartmentById = catchErrors(async (req, res) => {
  const { id } = req.params;
  const department = await Department.findById(id);

  return res.status(200).json({
    success: true,
    department,
  });
});

const createDepartment = catchErrors(async (req, res) => {
  const { name, password, email, phone } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const department = await Department.create({
    name,
    password: hashedPassword,
    email,
    phone,
  });

  return res.status(200).json({
    success: true,
    message: "Registration successfull",
    department,
  });
});

const departmentlogin = catchErrors(async (req, res) => {
  const { email, password } = req.body;

  const department = await Department.findOne({ email });

  if (!department) throw new Error("Department not found");

  const comparePassword = await bcrypt.compare(password, department.password);

  if (!comparePassword) throw new Error("Invalid credentials");

  const token = jwt.sign({ _id: department._id }, process.env.JWT_SECRET);

  return res.status(200).json({
    success: true,
    message: "Login successfull",
    department: {
      _id: department._id,
      name: department.name,
      email: department.email,
    },
    token,
  });
});

const departmentLogout = catchErrors(async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const updateDepartment = catchErrors(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (updatedData.password) {
    updatedData.password = await bcrypt.hash(updatedData.password, 10);
  }

  const department = await Department.findByIdAndUpdate(id, updatedData, {
    new: true,
  });

  if (!department) throw new Error("Department not found");

  res.status(200).json({
    success: true,
    message: "Department updated successfully",
    department,
  });
});

const deleteDepartment = catchErrors(async (req, res) => {
  const { id } = req.params;
  const department = await Department.findByIdAndDelete(id);

  if (!department) throw new Error("Department not found");

  res.status(200).json({
    success: true,
    message: "Department deleted successfully",
  });
});

const getAllInventoryRequests = catchErrors(async (req, res) => {
  const inventoryRequests = await Department.find();

  const pendingRequests = inventoryRequests.map((dept) => ({
    _id: dept._id,
    name: dept.name,
    email: dept.email,
    phone: dept.phone,
    inventoryRequests: dept.inventoryRequests,
  }));

  return res.status(200).json({
    success: true,
    pendingRequests,
  });
});

const requestInventory = catchErrors(async (req, res) => {
  const { departmentId, inventoryItem, quantity } = req.body;

  if (!departmentId || !mongoose.Types.ObjectId.isValid(departmentId)) {
    throw new Error("Invalid or missing departmentId");
  }

  const department = await Department.findById(departmentId);

  if (!department) {
    throw new Error("Department not found");
  }

  department.inventoryRequests.push({
    inventoryItem,
    quantity,
    status: "Pending",
    requestedAt: new Date(),
  });

  await department.save();

  res.status(200).json({
    success: true,
    message: "Inventory request submitted successfully",
    department,
  });
});

const assignInventory = catchErrors(async (req, res) => {
  const { departmentId, requestId, status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    throw new Error("Status must be either 'Approved' or 'Rejected'");
  }

  const department = await Department.findById(departmentId);
  if (!department) throw new Error("Department not found");

  const requestIndex = department.inventoryRequests.findIndex(
    (req) => req._id.toString() === requestId
  );

  if (requestIndex === -1) throw new Error("Inventory request not found");

  const request = department.inventoryRequests[requestIndex];

  if (request.status !== "Pending") {
    throw new Error(`Request is already ${request.status}`);
  }

  // Try to find inventory by name (since inventoryItem is a string)
  const inventory = await Inventory.findOne({ name: request.inventoryItem });

  if (status === "Approved") {
    if (!inventory) {
      throw new Error("Requested item is not available in stock");
    }
    if (inventory.quantity < request.quantity) {
      throw new Error("Not enough stock available");
    }
    inventory.quantity -= request.quantity;
    await inventory.save();
  }

  department.inventoryRequests[requestIndex].status = status;
  department.inventoryRequests[requestIndex].processedAt = new Date();

  await department.save();

  res.status(200).json({
    success: true,
    message: `Inventory request ${status.toLowerCase()} successfully`,
    department,
    inventory: status === "Approved" && inventory ? inventory : undefined,
  });
});

// Get all requests (any status) for a specific department
const getDepartmentRequests = catchErrors(async (req, res) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid or missing department id");
  }
  const department = await Department.findById(id);
  if (!department) throw new Error("Department not found");

  // Sort by requestedAt desc
  const requests = [...(department.inventoryRequests || [])].sort(
    (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
  );

  return res.status(200).json({
    success: true,
    requests,
  });
});

const updateDepartmentProfile = catchErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Department id not provided");

  const department = await Department.findById(id);

  department.name = req.body.name;
  department.email = req.body.email;
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    department.password = hashedPassword;
  }

  await department.save();

  return res.status(200).json({
    success: true,
    message: "Department updated successfully",
    department: {
      _id: department._id,
      name: department.name,
      email: department.email,
    },
  });
});

const getAllDepartmentInventory = catchErrors(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Department id not provided");

  const department = await Department.findById(id);
  if (!department) throw new Error("Department not found");

  // Only approved requests are considered as inventory assigned to department
  const approvedRequests = department.inventoryRequests.filter(
    (req) => req.status === "Approved"
  );

  // Try to enrich with inventory details if the item exists in inventory DB
  const enrichedInventory = await Promise.all(
    approvedRequests.map(async (req) => {
      const inventoryItem = await Inventory.findOne({
        name: req.inventoryItem,
      });
      return {
        ...req.toObject(),
        inventoryItem: inventoryItem
          ? {
              name: inventoryItem.name,
              description: inventoryItem.description,
              supplier: inventoryItem.supplier,
              price: inventoryItem.price,
              unit: inventoryItem.unit || "pcs",
            }
          : { name: req.inventoryItem }, // fallback to just the name
      };
    })
  );

  return res.status(200).json({
    success: true,
    departmentInventory: enrichedInventory,
  });
});

export {
  getAllDepartments,
  createDepartment,
  departmentlogin,
  assignInventory,
  updateDepartment,
  deleteDepartment,
  requestInventory,
  getDepartmentById,
  getAllInventoryRequests,
  departmentLogout,
  updateDepartmentProfile,
  getAllDepartmentInventory,
  getDepartmentRequests,
};
