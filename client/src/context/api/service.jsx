import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useState } from "react";

const ServiceContext = createContext(null);

const ServiceProvider = ({ children }) => {
  // Configurations
  const token = localStorage.getItem("token") || null;
  /// deployed url
  // const BASEURL = "https://ims-giggcl.vercel.app/api";
  const BASEURL = "http://localhost:3000/api";

  const resolver = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const mutation = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  // IMS States
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [department, setDepartment] = useState([]);
  const [requests, setRequests] = useState([]);
  const [insight, setInsight] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loggedInDepartment, setLoggedInDepartment] = useState(
    JSON.parse(localStorage.getItem("department")) || null
  );
  const [departmentInventory, setDepartmentInventory] = useState([]);

  // Authentication Services

  const register = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/register`,
        credentials,
        mutation
      );
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/forget-password`,
        {email},
        resolver
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/reset-password`,
        credentials,
        resolver
      );
      toast.success(data.message || "Password reset successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/login`,
        credentials,
        mutation
      );
      setLoggedInUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/verify-email`,
        { token },
        mutation
      );
      toast.success(data.message || "Email verified");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/resend-verification`,
        { email },
        mutation
      );
      toast.success(data.message || "Verification email sent");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const departmentSignIn = async (credentials) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/auth/department/login`,
        credentials,
        mutation
      );
      setLoggedInDepartment(data.department);
      localStorage.setItem("dept-token", data.token);
      localStorage.setItem("department", JSON.stringify(data.department));
      toast.success(data.message);
      navigate("/department");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/auth/logout`, resolver);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const departmentLogout = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASEURL}/auth/department/logout`,
        resolver
      );
      localStorage.removeItem("dept-token");
      localStorage.removeItem("department");
      toast.success(data.message);
      navigate("/department/login");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllInsights = async (opts = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (opts.startDate) params.set("startDate", opts.startDate);
      if (opts.endDate) params.set("endDate", opts.endDate);
      const url = params.toString()
        ? `${BASEURL}/insight?${params.toString()}`
        : `${BASEURL}/insight`;
      const { data } = await axios.get(url, resolver);
      setInsight(data.insights);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Inventory Services
  const createInventory = async (newInventory) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/inventory`,
        newInventory,
        mutation
      );
      setInventory((prev) => {
        const exists = prev.some((item) => item._id === data.inventory._id);
        return exists
          ? prev.map((item) =>
              item._id === data.inventory._id ? data.inventory : item
            )
          : [...prev, data.inventory];
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentInventoryById = async (departmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASEURL}/department/${departmentId}/inventory`,
        resolver
      );
      return data.departmentInventory;
    } catch (error) {
      console.log(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAllInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/inventory`, resolver);
      setInventory(data.inventories);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getInventoryById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/inventory/${id}`, resolver);
      return data.inventory;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async ({ id, updatedInventory }) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${BASEURL}/inventory/${id}`,
        updatedInventory,
        mutation
      );
      setInventory((prev) =>
        prev.map((item) => (item._id === id ? data.inventory : item))
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteInventory = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${BASEURL}/inventory/${id}`,
        mutation
      );
      setInventory((prev) => prev.filter((item) => item._id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Department Services
  const createDepartment = async (newDepartment) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/department`,
        newDepartment,
        mutation
      );
      setDepartment((prev) => [...prev, data.department]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllDepartments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/department`, resolver);
      setDepartment(data.departments);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/department/${id}`, resolver);
      return data.department;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async ({ id, updatedDepartment }) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${BASEURL}/department/${id}`,
        updatedDepartment,
        mutation
      );
      setDepartment((prev) =>
        prev.map((item) => (item._id === id ? data.department : item))
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${BASEURL}/department/${id}`,
        mutation
      );
      setDepartment((prev) => prev.filter((item) => item._id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const departmentInventoryRequest = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASEURL}/department/requests/all`,
        resolver
      );
      setRequests(data.pendingRequests);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMyDepartmentRequests = async (departmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASEURL}/department/${departmentId}/requests`,
        resolver
      );
      return data.requests || [];
    } catch (error) {
      console.log(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASEURL}/department/${
          JSON.parse(localStorage.getItem("department"))._id || null
        }/inventory`,
        resolver
      );
      setDepartmentInventory(data.departmentInventory);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const assignInventory = async ({ departmentId, requestId, status }) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/department/assign`,
        { departmentId, requestId, status },
        mutation
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const requestInventory = async (reuestedInventory) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/department/request`,
        reuestedInventory,
        mutation
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Category Services
  const createCategory = async (newCategory) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BASEURL}/category`,
        newCategory,
        mutation
      );
      setCategory((prev) => [...prev, data.category]);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getAllCategory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/category`, resolver);
      setCategory(data.categories);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BASEURL}/category/${id}`, resolver);
      return data.category;
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async ({ id, updatedCategory }) => {
    try {
      setLoading(true);
      const { data } = await axios.patch(
        `${BASEURL}/category/${id}`,
        updatedCategory,
        mutation
      );
      setCategory((prev) =>
        prev.map((item) => (item._id === id ? data.category : item))
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${BASEURL}/category/${id}`,
        mutation
      );
      setCategory((prev) => prev.filter((item) => item._id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profile) => {
    try {
      setLoading(true);

      const { data } = await axios.patch(
        `${BASEURL}/profile/`,
        profile,
        mutation
      );
      console.log(data);
      setLoggedInUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartmentProfile = async (profile) => {
    try {
      setLoading(true);

      const { data } = await axios.patch(
        `${BASEURL}/department/profile/${
          JSON.parse(localStorage.getItem("department"))._id || ""
        }`,
        profile,
        mutation
      );
      setLoggedInDepartment(data.department);
      localStorage.setItem("department", JSON.stringify(data.department));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        loading,
        category,
        inventory,
        loggedInUser,
        loggedInDepartment,
        requests,
        signIn,
        departmentSignIn,
        logout,
        departmentLogout,
        register,
        forgotPassword,
        resetPassword,
        verifyEmail,
        resendVerification,
        insight,
        department,
        updateProfile,
        getAllInsights,
        getAllInventory,
        getInventoryById,
        createInventory,
        updateInventory,
        deleteInventory,
        getAllDepartments,
        getDepartmentById,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        departmentInventoryRequest,
        requestInventory,
        getAllCategory,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
        assignInventory,
        updateDepartmentProfile,
        departmentInventory,
        getDepartmentInventory,
        getDepartmentInventoryById,
        getMyDepartmentRequests,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

const useService = () => {
  const service = useContext(ServiceContext);
  if (!service)
    throw new Error("useService must be used within a ServiceProvider");
  return service;
};

export { ServiceProvider, useService };
