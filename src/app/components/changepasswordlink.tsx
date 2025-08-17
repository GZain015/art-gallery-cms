"use client";

import { EyeIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

function ChangepasswordlinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordLinkId = searchParams.get("id"); 
  const [formData, setFormData] = useState({
    newPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
  });
  const [isIdValid, setIsIdValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Validate the passwordLinkId
  useEffect(() => {
    const validateId = async () => {
      try {
        if (!passwordLinkId) {
          throw new Error("Invalid password reset link.");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/users/password/${passwordLinkId}`
        );
        if (response.status === 404) {
          throw new Error("Password reset link not found.");
        }
        if (response.status === 200) {
          setIsIdValid(true);
        }
      } catch (err) {
        console.error("Error validating passwordLinkId:", err);
        //toast.error("Invalid or expired password reset link.");
        //router.push("/signIn");
      } finally {
        setIsLoading(false);
      }
    };

    validateId();
  }, [passwordLinkId, router]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required.";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const payload = {
        passwordLinkId,
        password: formData.newPassword,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_HOST}/users/password-reset`, payload,
      );

      if (response.status === 200) {
        toast.success("Password reset successful!");
        router.push("/signIn");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("Failed to reset password. Please try again.");
      setErrors({ general: "Failed to reset password. Please try again." });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword({
      ...showPassword,
      newPassword: !showPassword.newPassword,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Validating reset link...</p>
      </div>
    );
  }



  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md">
        {/* Heading */}
        <h1 className="text-2xl font-bold text-black text-center mb-10">
          Reset Password
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div className="mb-4 relative">
            <label htmlFor="newPassword" className="block text-gray-700">
              Enter New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.newPassword ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full border p-2 rounded-lg text-black pr-10 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">{errors.newPassword}</p>
              )}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-200"
              >
                <EyeIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <p className="text-red-500 text-center text-sm mb-4">
              {errors.general}
            </p>
          )}

          {/* Save Button */}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600"

            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


export default function Changepasswordlink() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangepasswordlinkContent />
    </Suspense>
  );
}
