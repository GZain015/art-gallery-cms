"use client";

import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

// const Forgotpassword = () => {
function Forgotpassword() {
  const [email, setEmail] = useState(""); // State to hold the email input
  const [loading, setLoading] = useState(false); // State for the loading indicator
  const [message, setMessage] = useState(""); // State for success/error messages
  const [fieldError, setFieldError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (!email) {
      setFieldError(true); // Set field error if email is empty
      toast.error("Email address is required."); // Toast error message
      return;
    }

    setLoading(true); // Start loading state
    setFieldError(false); // Clear field error

    try {
      // Construct API endpoint with email in the path
      // const response = await axios.post(
      //   `${process.env.NEXT_PUBLIC_HOST}/users/password/${encodeURIComponent(email)}`
      // );

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/users/password/email`,
        { email: email }
      );

      if (response.status === 200) {
        toast.success("A reset link has been sent to your email address."); // Toast success message
      }
    } catch (error) {
      // Handle errors (e.g., user not found or server issues)
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again."
      ); // Toast error message
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-black text-center mb-4">
          Forgot Your Password?
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we`ll send you a reset link.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border rounded-md p-2 shadow-sm text-black ${
                fieldError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          {/* Display Message */}
          {message && (
            <p
              className={`text-center text-sm mb-4 ${
                message.includes("Failed") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Request Reset Link Button */}
          <button
            type="submit"
            className="bg-black text-white w-full py-2 rounded-md text-sm transition-all duration-300 hover:bg-gray-700 mb-4 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Sending..." : "Request Reset Link"}
          </button>

          {/* Back to Login Button */}
          <p className="text-center text-sm">
            <a href="/signIn" className="text-blue-500 hover:underline">
              Back to Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Forgotpassword;
