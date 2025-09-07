/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "./modaldeleteadmin";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useDebounce } from "use-debounce";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

type FieldName = "email" | "phone" | "name";

function AdminManagement() {
  const [users, setUsers] = useState([]);
  // const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPagess, setTotalPages] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false); 
  const [showCPassword, setShowCPassword] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 100);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const toggleCPasswordVisibility = () => {
    setShowCPassword((prevState) => !prevState);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "admin",
  });

  const { token } = useAuth();
  // console.log("token in admin:", token)
  const router = useRouter();


  useEffect(() => {
    const fetchUsers = async () => {
      // console.log("token here:", token);
      if (!token) return;

      setLoading(true);

      try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_HOST}/admin/user/all?page=${currentPage}&limit=${rowsPerPage}&search=${debouncedSearchQuery}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("users: ", response.data.data)
          setUsers(response.data.data);
          setTotalUsers(response.data.total);
          setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if(token){
      fetchUsers();
    }

  }, [token, currentPage, rowsPerPage, debouncedSearchQuery]);

  let filteredUsers = users.filter((user: any) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    );
  });
  
  const openModal = (user?: any) => {
    setIsEditMode(!!user);
    setId(user?.id || "");
    setFormData(
      user
        ? {
            ...user,
            password: "",
            confirmPassword: "",
            role: user.role || "admin",
          }
        : {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            role: "admin",
          }
    );
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setErrors({});
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;

    // Reset the error for the specific field
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "", 
      }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const totalPages = Math.ceil(totalUsers / rowsPerPage);

  const handlePageChange = (page: string | number) => {
    if (page === "next" && currentPage < totalPagess) {
      setCurrentPage((prev) => prev + 1);
    } else if (page === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (typeof page === "number" && page >= 1 && page <= totalPagess) {
      setCurrentPage(page);
    }
  };

  const handleSubmit = async () => {
    // console.log("handle Submit");

    if (!token) {
      console.error("No token available while submitting");
      return;
    }

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password || undefined,
      phone: formData.phone,
      role: formData.role,
    };

    setLoading(true);

    console.log(payload);
    try {
      if (isEditMode) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_HOST}/admin/user/${id}`,
          // `${process.env.NEXT_PUBLIC_HOST}/admin/user/`,
          // formData,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("User updated successfully!");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}/admin/user/create`,
          // formData,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("User added successfully!");
      }

      // Refetch users
      const updatedUsers = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/admin/user/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(updatedUsers.data.data);
      setCurrentPage(1)

      // Close modal and reset form
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        role: "",
      });
    } catch (error: any) {
      console.error("Error adding/editing user:", error);

      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred.";

    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteUserId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteUserId(null);
  };

  const confirmDeleteUser = async () => {
    if (!deleteUserId || !token) {
      console.error("No user ID or token available");
      return;
    }

    let delResp: any;

    try {
      setLoading(true);
      delResp = await axios.delete(
        `${process.env.NEXT_PUBLIC_HOST}/admin/user/delete/${deleteUserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Delete user: ", delResp);

      if(delResp?.data?.message === "User deleted successfully"){
        toast.success("User successfully deleted!");
      }
      else if(delResp?.data?.message === "Admins cannot be deleted"){
        toast.error("Admins cannot be deleted!");
      }

      const updatedUsers = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/admin/user/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(updatedUsers.data.data);
      // setFilteredUsers(updatedUsers.data.data);
      filteredUsers = updatedUsers.data.data
      // setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting user:", error);
      if(delResp?.message)
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
  };

  const handleValidation = () => {
    const newErrors: FormErrors = {};

    // Validate required fields
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Valid email is required.";

    if (!isEditMode) {
      if (!formData.password.trim())
        newErrors.password = "Password is required.";
      if (formData.password.trim() !== formData.confirmPassword.trim())
        newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{6,}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }
    setErrors(newErrors);

    // Check if there are no errors
    if (Object.keys(newErrors).length === 0) {
      handleSubmit();
    }
  };

  return (
    <div className="p-8 w-full bg-gray-100 text-gray-800">
      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Admin Management</h1>
        <button
          className="bg-[#09243C] text-white px-6 py-3 rounded-lg mt-4 sm:mt-0"
          onClick={() => openModal()}
        >
          Add New Admin
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-8 border">
        <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1);
            }}
            placeholder="Search by Name, Email or Phone"
            className="border border-gray-300 p-3 rounded-lg w-full"
          />
          <button
            onClick={() => {
              setSearchQuery("");
              setCurrentPage(1);
            }}
            className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Users Listings Table */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border relative overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">Admins</h2>
          <div className="flex items-center gap-4">
            <select
              className="border border-gray-300 p-2 rounded-lg text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={1}>Rows Per Page: 1</option>
              <option value={5}>Rows Per Page: 5</option>
              <option value={10}>Rows Per Page: 10</option>
              <option value={25}>Rows Per Page: 25</option>
              <option value={50}>Rows Per Page: 50</option>
              <option value={100}>Rows Per Page: 100</option>
            </select>
          </div>
        </div>

        <table className="min-w-full table-auto mt-4">
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              <th className="p-4">No.</th>
              <th className="p-4">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any, idx: number) => (
              <tr key={user.id} className="border-t text-sm">
                {/* <td className="p-4">{String(idx + 1).padStart(2, "0")}</td> */}
                <td className="p-4">
                  {String((currentPage - 1) * rowsPerPage + idx + 1).padStart(
                    2,
                    "0"
                  )}
                </td>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.phone}</td>
                <td className="p-4">
                  <span className="inline-block px-3 py-1 bg-gray-200 text-sm rounded-lg">
                    {user.role === "artist" ? "Artist" : "Admin"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                      onClick={() => openModal(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg"
                      onClick={() => openDeleteModal(user.id)}
                    >
                      Delete
                    </button>
                    <ConfirmModal
                      isOpen={isDeleteModalOpen}
                      onClose={closeDeleteModal}
                      onConfirm={confirmDeleteUser}
                      message="Are you sure you want to delete this user?"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        <div className="flex justify-center items-center mt-4">
          {/* Previous Button */}
          <button
            className="rounded-md rounded-r-none border border-r-0 border-slate-300 py-2 px-4 text-center text-sm text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            &larr;
          </button>

          {/* Page Numbers */}
          <div className="flex border border-slate-300">
            {/* First Page */}
            {currentPage > 3 ? (
              <button
                className={`px-4 py-2 text-sm ${
                  1 === currentPage
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
            ) : (
              <button
                className={`px-4 py-2 text-sm ${
                  1 === currentPage
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
            )}

            {/* Dots */}
            {currentPage > 4 && (
              <span className="px-4 py-2 text-sm text-slate-600">...</span>
            )}

            {/* Page Numbers */}
            {totalPagess > 1 &&
              [...Array(totalPagess)].map((_, index) => {
                const pageNumber = index + 1;
                if (pageNumber !== 1 && pageNumber !== totalPagess) {
                  return (
                    <button
                      key={pageNumber}
                      className={`px-4 py-2 text-sm ${
                        pageNumber === currentPage
                          ? "bg-slate-800 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}

            {/* Dots */}
            {currentPage < totalPagess - 3 && (
              <span className="px-4 py-2 text-sm text-slate-600">...</span>
            )}

            {/* Last Page */}
            {currentPage < totalPagess - 1 && (
              <button
                className={`px-4 py-2 text-sm ${
                  totalPagess === currentPage
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => handlePageChange(totalPagess)}
              >
                {totalPagess}
              </button>
            )}
          </div>

          {/* Next Button */}
          <button
            className="rounded-md rounded-l-none border border-l-0 border-slate-300 py-2 px-4 text-center text-sm text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPagess}
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md sm:max-w-lg mx-4"
            style={{ maxHeight: "90vh", overflowY: "auto" }}
          >
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode ? "Edit User" : "Add New User"}
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleValidation();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className={`w-full border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } p-2 rounded-lg`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-black font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } p-2 rounded-lg`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                  )}
                </div>
              </div>

              {!isEditMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black font-medium mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="•••••••••••••"
                        className={`w-full border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } p-2 rounded-lg`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-200"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-black font-medium mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="•••••••••••••"
                        className={`w-full border ${
                          errors.confirmPassword
                            ? "border-red-500"
                            : "border-gray-300"
                        } p-2 rounded-lg`}
                      />
                      <button
                        type="button"
                        onClick={toggleCPasswordVisibility}
                        className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-200"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-black font-medium mb-1">
                    Phone
                  </label>
                  <PhoneInput
                    country={"pk"}
                    value={formData.phone} 
                    onChange={(phone) =>
                      handleChange({
                        target: { name: "phone", value: phone },
                      })
                    } 
                    inputStyle={{
                      width: "100%",
                      height: "40px", 
                      padding: "8px 8px 8px 48px", 
                      border: `1px solid ${
                        errors.phone ? "red" : "#ccc" 
                      }`,
                      borderRadius: "8px", 
                      color: "#000", 
                      fontSize: "14px", 
                      backgroundColor: "#fff", 
                    }}
                    containerStyle={{
                      width: "100%", 
                    }}
                    dropdownStyle={{
                      color: "#000", 
                    }}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black font-medium mb-1">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-2 rounded-lg mb-2"
                    >
                      <option value="admin" className="border-gray-300 p-2 rounded-lg">Admin</option>
                      <option value="artist" className="border-gray-300 p-2 rounded-lg">Artist</option>
                    </select>
                  </div>
                </div>

              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManagement;
