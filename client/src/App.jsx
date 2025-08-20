import { useService } from "./context/api/service";
import { Route, Routes, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/admin/Login";
import Register from "./pages/auth/admin/Register";
import ForgotPassword from "./pages/auth/admin/ForgotPassword";
import ResetPassword from "./pages/auth/admin/ResetPassword";
import DeptLogin from "./pages/auth/department/Login";

// Admin Panel
import Request from "./pages/admin/Request";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Dashboard from "./pages/admin/Dashboard";
import Inventory from "./pages/admin/Inventory";
import Department from "./pages/admin/Department";
import Categories from "./pages/admin/Categories";
import History from "./pages/admin/History";

// Department Panel
import DeptSetting from "./pages/department/Setting";
import DepatRequest from "./pages/department/Request";
import DeptInventory from "./pages/department/Inventory";
import DeptDashboard from "./pages/department/Dashboard";

// Miccllaneous
import NotFound from "./pages/error/NotFound";
import AdminLayout from "./pages/layouts/admin/Layout";
import DeptLayout from "./pages/layouts/department/Layout";
import DepartmentHistory from "./pages/admin/DepartmentHistory";
import DepartmentInventory from "./pages/department/Inventory";

function App() {
  const token = localStorage.getItem("token");
  const deptToken = localStorage.getItem("dept-token");

  const { loggedInUser, loggedInDepartment } = useService();

  return (
    <Routes>
      {/* Authenitcation Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route
        path="/"
        element={
          token && loggedInUser ? (
            <AdminLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="manage-inventory" element={<Inventory />} />
        <Route path="categories" element={<Categories />} />
        <Route path="reports" element={<Reports />} />
        <Route path="requests" element={<Request />} />
        <Route path="settings" element={<Settings />} />
        <Route path="departments" element={<Department />} />
        <Route
          path="/admin/department/:id/inventory"
          element={<DepartmentInventory />}
        />

        <Route path="history" element={<History />} />
        <Route path="/department-history" element={<DepartmentHistory />} />
        <Route path="*" element={<NotFound link="/dashboard" />} />
      </Route>

      {/* Department Routes */}
      <Route path="/department/login" element={<DeptLogin />} />
      <Route
        path="/department"
        element={
          deptToken && loggedInDepartment ? (
            <DeptLayout />
          ) : (
            <Navigate to="/department/login" replace />
          )
        }
      >
        <Route index element={<DeptDashboard />} />
        <Route path="request" element={<DepatRequest />} />
        <Route path="inventory" element={<DeptInventory />} />
        <Route path="settings" element={<DeptSetting />} />
        <Route path="*" element={<NotFound link="/department" />} />
      </Route>

      {/* Not Found */}
      <Route path="*" element={<NotFound link="/" />} />
    </Routes>
  );
}

export default App;
