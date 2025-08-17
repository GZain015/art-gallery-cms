"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Sidebar({ isOpen, onToggle }) {
  const { logout, token, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      console.log("No token found");
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No token found in localStorage.");
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/login/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Logout successful
      logout();
      toast.success("Logout successful!"); 
      router.push("/signIn");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to logout. Please try again."
      );
    }
  };

  return (
    <div
      style={{ backgroundColor: "#09243C" }}
      className={`fixed top-0 left-0 h-screen flex flex-col text-white z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 md:w-64`}
    >
      {/* Close button for small screens */}
      {isOpen && (
        <button
          className="absolute top-4 right-4 text-white text-2xl"
          onClick={() => onToggle(false)}
        >
          &times;
        </button>
      )}
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
      <Image
            src="/images/LogoSidebar1.png"
            alt="Dashboard Icon"
            width={150}
            height={150}
          />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col flex-grow p-4 space-y-4">
        <a
          href="/dashboard"
          className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
            pathname === "/dashboard" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <Image
            src="/images/Dashboard.svg"
            alt="Dashboard Icon"
            width={20}
            height={20}
          />
          <span className="text-base md:text-sm">Dashboard</span>
        </a>
        {/* <a
          href="/appointmentManagement"
          className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
            pathname === "/appointmentManagement"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          <Image
            src="/images/Appointment_Logo1.svg"
            alt="Appointment Management Icon"
            width={20}
            height={20}
          />
          <span className="text-base md:text-sm">Appointments</span>
        </a>
        <a
          href="/doctorManagement"
          className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
            pathname === "/doctorManagement"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          <Image
            src="/images/doctor_logo1.png"
            alt="Doctor Management Icon"
            width={20}
            height={20}
          />
          <span className="text-base md:text-sm">Doctor Management</span>
        </a> */}
        <a
          href="/productManagement"
          className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
            pathname === "/productManagement"
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          <Image
            src="/images/doctor_logo1.png"
            alt="Doctor Management Icon"
            width={20}
            height={20}
          />
          <span className="text-base md:text-sm">Product Management</span>
        </a>
       
        {/* {(role === "Admin" || role === "SuperAdmin") && ( */}
        <>
          <hr className="border-gray-700" />
          <a
            href="/userManagement"
            className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
              pathname === "/adminManager"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            <Image
              src="/images/Admin.svg"
              alt="Admin Manager Icon"
              width={20}
              height={20}
            />
            <span className="text-base md:text-sm">User Management</span>
          </a>
          <a
            href="/adminManagement"
            className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
              pathname === "/adminManager"
                ? "bg-blue-600"
                : "hover:bg-gray-700"
            }`}
          >
            <Image
              src="/images/Admin.svg"
              alt="Admin Manager Icon"
              width={20}
              height={20}
            />
            <span className="text-base md:text-sm">Admin Management</span>
          </a>
        </>
        {/* )} */}

        <hr className="border-gray-700" />
        <a
          href="/userProfile"
          className={`flex items-center space-x-2 py-2 px-4 rounded-md ${
            pathname === "/userProfile" ? "bg-blue-600" : "hover:bg-gray-700"
          }`}
        >
          <Image
            src="/images/User.svg"
            alt="User Profile Icon"
            width={20}
            height={20}
          />
          <span className="text-base md:text-sm">User Profile</span>
        </a>
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center bg-gray-700 text-gray-200 py-2 rounded-md hover:bg-gray-600"
        >
          <Image
            src="/images/Logout.svg"
            alt="Logout Icon"
            width={20}
            height={20}
          />
          <span className="ml-2 text-base md:text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
