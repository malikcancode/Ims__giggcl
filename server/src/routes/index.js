import express from "express";
import {
  forgetPassword,
  login,
  logout,
  register,
  resetPassworrd,
  updateProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getInsights } from "../controllers/insights.controller.js";
import {
  getInventory,
  getInventoryById,
  getInventoryByCategory,
  updateInventory,
  deleteInventory,
  addInventory,
  checkInventoryStock,
} from "../controllers/inventory.controller.js";
import {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import {
  assignInventory,
  createDepartment,
  deleteDepartment,
  departmentlogin,
  getAllDepartments,
  requestInventory,
  updateDepartment,
  getDepartmentById,
  getAllInventoryRequests,
  departmentLogout,
  updateDepartmentProfile,
  getAllDepartmentInventory,
  getDepartmentRequests,
} from "../controllers/department.Controller.js";

const router = express.Router();

// _______________________Auth Routes______________________
router.post("/auth/login", login);
router.post("/auth/register", register);
router.get("/auth/logout", authMiddleware, logout);
router.patch("/profile", authMiddleware, updateProfile);
router.post("/auth/forget-password", forgetPassword);
router.post("/auth/reset-password", resetPassworrd);

// _______________________Insight Routes______________________
router.get("/insight", authMiddleware, getInsights);

// _______________________Deparmtnet Routes______________________
router.post("/auth/department/login", departmentlogin);
router.get("/auth/department/logout", departmentLogout);
router.get("/department", getAllDepartments);
router.get("/department/:id", authMiddleware, getDepartmentById);
router.post("/department", authMiddleware, createDepartment);
router.patch("/department/:id", authMiddleware, updateDepartment);
router.delete("/department/:id", authMiddleware, deleteDepartment);
router.post("/department/request", requestInventory);
router.post("/department/assign", authMiddleware, assignInventory);
router.get("/department/requests/all", getAllInventoryRequests);
router.patch("/department/profile/:id", updateDepartmentProfile);
router.get("/department/:id/inventory", getAllDepartmentInventory);
router.get("/department/:id/requests", getDepartmentRequests);

// _______________________Inventory Routes______________________

router.get("/inventory", getInventory);
router.get("/inventory/:id", authMiddleware, getInventoryById);
router.get("/inventory/:categoryId", authMiddleware, getInventoryByCategory);
router.get("/inventory/stock", authMiddleware, checkInventoryStock);
router.post("/inventory", authMiddleware, addInventory);
router.patch("/inventory/:id", authMiddleware, updateInventory);
router.delete("/inventory/:id", authMiddleware, deleteInventory);

// _______________________Category Routes______________________
router.get("/category", authMiddleware, getAllCategories);
router.get("/category/:id", authMiddleware, getCategoryById);
router.post("/category", authMiddleware, addCategory);
router.patch("/category/:id", authMiddleware, updateCategory);
router.delete("/category/:id", authMiddleware, deleteCategory);

export default router;
