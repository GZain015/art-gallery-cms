"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import { EyeIcon } from "@heroicons/react/24/outline";
import "react-phone-input-2/lib/style.css";

import AWS from 'aws-sdk'; 

interface FormErrors {
  email?: string;
  phone?: string;
  name?: string;
  profilePic?: string;
}

function Userprofile() {
  const {token} = useAuth();
  const [isModalImageOpen, setIsModalImageOpen] = useState(false);

  const [selectedFile, setSelectedFile] : any = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    profilePic: "",
  });

  const [modalData, setModalData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors]: any = useState({});
  const [modalErrors, setModalErrors]: any = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/admin/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFormData({
        email: response.data.data.email || "",
        phone: response.data.data.phone || "",
        name: response.data.data.name || "",
        profilePic: response.data.data.profilePic || "",
        createdAt: response.data.data.createdAt || "",
        updatedAt: response.data.data.updated || "",
        deletedAt: response.data.data.deleted || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data");
    }
  };

    useEffect(() => {
      if (token) {
        fetchUserData();
      }
    // }, []);
  }, [token]);
  

  const handleChange = (e: { target: any; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleModalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
    setModalErrors({ ...modalErrors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be at least 10 digits.";
    }
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_HOST}/admin/user`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // console.log("Form submitted successfully!", formData);
        // console.log(response.data);
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }
    }

    fetchUserData()
  };

  const validateModal = async () => {
    let newModalErrors : any = {};
    if (!modalData.currentPassword.trim()) {
      newModalErrors.currentPassword = "Current password is required.";
    } else {
      // Call validation API to verify the current password
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_HOST}/admin/user/validate-current-password`,
          { currentPassword: modalData.currentPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // if (!response.data.valid) {
        //   newModalErrors.currentPassword = "Current password is incorrect.";
        // }
        if (response.data.message === "Current password is valid") {
          // newModalErrors.currentPassword = "Current password is correct.";
          console.log("currentPassword is correct...");
        }
        else {
          newModalErrors.currentPassword = "Current password is incorrect.";
        }
      } catch (error) {
        console.error("Validation API error:", error);
        toast.error("Current password is incorrect. Please try again.");
        newModalErrors.currentPassword = "Error validating password.";
      }
    }

    if (!modalData.newPassword.trim()) {
      newModalErrors.newPassword = "New password is required.";
    } else if (modalData.newPassword.length < 8) {
      newModalErrors.newPassword = "Password must be at least 8 characters.";
    }
    if (modalData.confirmPassword !== modalData.newPassword) {
      newModalErrors.confirmPassword = "Passwords do not match.";
    }
    setModalErrors(newModalErrors);
    return Object.keys(newModalErrors).length === 0;
  };

  const handleModalSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (await validateModal()) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_HOST}/admin/user/profile-change-password/`,
          { oldPassword: modalData.currentPassword, newPassword: modalData.newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setModalData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsModalOpen(false);
        // console.log("Password updated successfully:", formData);
        // console.log(response.data);
        toast.success("Password updated successfully!");
      } catch (error) {
        setModalData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsModalOpen(false);
        console.error("Error updating Password:", error);
        toast.error("Failed to update password. Please try again.");
      }
    }
  };

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);

  // Conditional rendering if no token
  if (!token) return null;

  // const handleFileChange = (e: { target: { files: any[]; }; }) => {
  //   const file = e.target.files[0];
  //   setSelectedFile(file);

  //   if(file) {
  //     const url = URL.createObjectURL(file);
  //     setImageUrl(url);
  //     // console.log("imag Asset URL: ", url)
  //   }
  // };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };
  


  const uploadToS3 = async (file: never) => {
    const s3 = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
      Key: `upload/${Date.now()}-${file.name}`,
      Body: file,
    };
  
    try {
      const data = await s3.upload(params).promise();
      console.log("File uploaded to S3: ", data.Location);
      return data.Location;
    } catch (error) {
      console.error("Error uploading file to S3:", error);
      throw new Error("Error uploading file to S3");
    }
  };
  
  const handleImageSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    if (!selectedFile) {
      toast.error("Please select an image to upload.");
      return;
    }
  
    try {
      const imageUrl = await uploadToS3(selectedFile);
      setImageUrl(imageUrl);
      // console.log("Image uploaded successfully: ", imageUrl);
  
      // Update formData with the new profile image URL directly
      setFormData((prevFormData) => ({
        ...prevFormData,
        profilePic: imageUrl, // Use the image URL here
      }));
  
      // Log updated formData after the update is applied
      console.log("Updated FormData: ", { ...formData, profilePic: imageUrl });

      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_HOST}/admin/user/`,
          { ...formData, profilePic: imageUrl },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data.data);

        // console.log("Form submitted successfully!", formData);
        console.log("Res: ", response.data.data);
        toast.success("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
      }

      closeImageModal();
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };
  
  const closeImageModal = () => {
    setIsModalImageOpen(false);
    setSelectedFile(null);
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: value,
    }));
  };
  

  return (
    <div className="flex flex-col p-4 sm:p-10 bg-gray-100">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8">
        <div className="relative">
          <Image
            // src={`/${formData.profilePic}` || "/images/userimg.png"}  
            src={`${formData.profilePic}` || "/images/userimg.png"}    
            alt="Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-blue-500"
            width={96}
            height={96}
          />
          {/* Button to open the modal */}
          <button
            className="absolute bottom-1 right-1 bg-blue-500 p-1 rounded-full hover:bg-blue-600"
            onClick={() => setIsModalImageOpen(true)}
          >
            <img
              src="/images/CameraIcon.svg"
              alt="Camera Icon"
              className="w-4 h-4"
            />
          </button>

          {/* Modal Image Modal */}
          {isModalImageOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white rounded-lg p-6 shadow-md w-11/12 max-w-md">
                <h2 className="text-lg font-semibold text-black mb-4">
                  Upload Image
                </h2>
                <div className="flex flex-col gap-4">
                  <label
                    htmlFor="fileUpload"
                    className="border border-gray-300 rounded-md px-4 py-2 text-center text-white cursor-pointer bg-blue-500 hover:bg-blue-400"
                  >
                    Choose File
                    <input
                      id="fileUpload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg"
                      multiple={false}
                    />
                  </label>
                  <p className="text-sm text-gray-600">
                    {selectedFile
                      ? `Selected file: ${selectedFile.name} (${(
                          selectedFile.size / 1024
                        ).toFixed(2)} KB)`
                      : "No file chosen"}
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="flex justify-end space-x-4 mt-4">
                    <button 
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-400"
                      onClick={handleImageSubmit}
                    >
                      Submit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      onClick={closeImageModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {formData.name}
          </h2>
          <p className="text-gray-600">Your account is ready</p>
        </div>
      </div>

      {/* Edit Profile Form */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Personal Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Individual fields */}
            <div>
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded-lg text-black"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="w-full border border-gray-300 p-2 rounded-lg text-black"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700">Phone Number</label>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Save & Change Password */}
        <div className="flex flex-col sm:flex-row justify-end mt-8">
          <button
            type="button"
            className="bg-black text-white py-2 px-4 sm:px-6 rounded-lg mb-4 sm:mb-0 sm:mr-4 hover:bg-black/80"
            onClick={handleModalOpen}
          >
            Change Password
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 sm:px-6 rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 sm:p-8 relative">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-6">
              Password Manager
            </h2>
            <form onSubmit={handleModalSubmit}>
              
              <div className="mb-4">
                <label className="block text-gray-700">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={modalData.currentPassword}
                    placeholder="•••••••••••••"
                    onChange={(e) => {
                      handleModalChange(e);
                      setModalErrors({ ...modalErrors, currentPassword: "" });
                    }}
                    className={`w-full border p-2 rounded-lg text-black ${
                      modalErrors.currentPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-200"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>

                {modalErrors.currentPassword && (
                  <p className="text-red-500 text-sm">
                    {modalErrors.currentPassword}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={modalData.newPassword}
                    placeholder="•••••••••••••"
                    onChange={(e) => {
                      handleModalChange(e);
                      setModalErrors({ ...modalErrors, newPassword: "" });
                    }}
                    className={`w-full border p-2 rounded-lg text-black ${
                      modalErrors.newPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-200"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
                {modalErrors.newPassword && (
                  <p className="text-red-500 text-sm">
                    {modalErrors.newPassword}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={modalData.confirmPassword}
                    placeholder="•••••••••••••"
                    onChange={(e) => {
                      handleModalChange(e);
                      setModalErrors({ ...modalErrors, confirmPassword: "" });
                    }}
                    className={`w-full border p-2 rounded-lg text-black ${
                      modalErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600 hover:text-blue-500 transition duration-200"
                  >
                    <EyeIcon className="w-5 h-5" />
                  </button>
                </div>
                {modalErrors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {modalErrors.confirmPassword}
                  </p>
                )}
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

export default Userprofile;
