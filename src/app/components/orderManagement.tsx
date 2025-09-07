// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";
// import React, { ChangeEvent, useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import ConfirmModal from "./modaldeleteadmin";
// import { useDebounce } from "use-debounce";
// import Image from "next/image";
// import AWS from "aws-sdk";

// interface FormErrors {
//   title?: string;
//   createdById?: string;
//   category?: string;
//   medium?: string;
//   sizeInInches?: string;
//   price?: string;
//   stock?: string;
//   status?: string;
//   image?: string;
//   sku?: string;
//   description?: string;
// }

// export interface Product {
//   title: string;
//   description: string;
//   price: string;
//   medium: string;
//   category: string;
//   sku: string;
//   sizeInInches: string;
//   sizeInCMS: string;
//   stock: string;
//   status: "Available" | "Reserved" | "Sold";
//   image: string;
//   createdById: string;
//   createdBy?: {
//     id: string;
//     name: string;
//   };
//   [key: string]: any;
// }

// interface Artist {
//   id: string;
//   name: string;
// }

// function OrderManagement() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [artists, setArtists] = useState<Artist[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [id, setId] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalProducts, setTotalProducts] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
//   const [isModalImageOpen, setIsModalImageOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [imagePreviewUrl, setImagePreviewUrl] = useState("");
//   const [uploadingImage, setUploadingImage] = useState(false);

//   const [formData, setFormData] = useState<Product>({
//     title: "",
//     description: "",
//     price: "",
//     medium: "",
//     category: "",
//     sku: "",
//     sizeInInches: "",
//     sizeInCMS: "",
//     stock: "1",
//     status: "Available",
//     image: "",
//     createdById: "",
//   });

//   const { token } = useAuth();

//   // Fetch artists data
//   useEffect(() => {
//     const fetchArtists = async () => {
//       if (!token) return;

//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_HOST}/admin/user/all/arttist/list`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setArtists(response.data.data || []);
//       } catch (error) {
//         console.error("Error fetching artists:", error);
//         toast.error("Failed to load artists");
//       }
//     };

//     if (token) {
//       fetchArtists();
//     }
//   }, [token]);

//   // Fetch products data
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!token) return;
//       setLoading(true);

//       try {
//         const response = await axios.get(
//           `${process.env.NEXT_PUBLIC_HOST}/products/all?page=${currentPage}&limit=${rowsPerPage}&search=${debouncedSearchQuery}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setProducts(response.data.data || []);
//         setTotalProducts(response.data.total || 0);
//         setTotalPages(response.data.totalPages || 0);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         toast.error("Failed to load products");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchProducts();
//     }
//   }, [token, currentPage, rowsPerPage, debouncedSearchQuery]);

//   // Filter products based on search query
//   const filteredProducts = products.filter((p) => {
//     const q = searchQuery.toLowerCase();
//     return (
//       p.title.toLowerCase().includes(q) ||
//       (p.createdBy?.name || "").toLowerCase().includes(q) ||
//       p.category.toLowerCase().includes(q) ||
//       p.medium.toLowerCase().includes(q) ||
//       (p.sku || "").toLowerCase().includes(q)
//     );
//   });

//   // Open modal for adding/editing product
//   const openModal = (product?: Product) => {
//     setIsEditMode(!!product);
//     setId(product?.id || "");
//     setFormData(
//       product
//         ? {
//             ...product,
//             price: product.price || "",
//             stock: product.stock || "1",
//             status: (product.status as Product["status"]) || "Available",
//             createdById: product.createdBy?.id || product.createdById || "",
//           }
//         : {
//             title: "",
//             description: "",
//             price: "",
//             medium: "",
//             category: "",
//             sku: "",
//             sizeInInches: "",
//             sizeInCMS: "",
//             stock: "1",
//             status: "Available",
//             image: "",
//             createdById: "",
//           }
//     );
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setErrors({});
//   };

//   // Handle form field changes
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;

//     if (errors[name as keyof FormErrors]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }

//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle pagination changes
//   const handlePageChange = (page: number | string) => {
//     if (page === "next" && currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     } else if (page === "prev" && currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     } else if (typeof page === "number" && page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Validate form and submit
//   const handleValidation = () => {
//     const newErrors: FormErrors = {};
//     let isValid = true;

//     const requiredFields: (keyof Product)[] = [
//       "title",
//       "createdById",
//       "category",
//       "medium",
//       "price",
//       "stock",
//       "status",
//       "sizeInInches",
//     ];

//     requiredFields.forEach((field) => {
//       const val = formData[field];
//       if (typeof val === "string" ? !val.trim() : !val) {
//         newErrors[field] = `${String(field).replace("_", " ")} is required`;
//         isValid = false;
//       }
//     });

//     // Basic numeric checks
//     if (formData.price && Number(formData.price) < 0) {
//       newErrors.price = "Price cannot be negative";
//       isValid = false;
//     }
//     if (formData.stock && Number.isNaN(Number(formData.stock))) {
//       newErrors.stock = "Stock must be a number";
//       isValid = false;
//     } else if (Number(formData.stock) < 0) {
//       newErrors.stock = "Stock cannot be negative";
//       isValid = false;
//     }

//     setErrors(newErrors);

//     if (isValid) {
//       handleSubmit();
//     } else {
//       toast.error("Please fill all required fields correctly");
//     }
//   };

//   // Submit form data
//   const handleSubmit = async () => {
//     if (!token) {
//       toast.error("Authentication required");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Convert inches to cms for size
//       const convertInchesToCMS = (inches: string): string => {
//         const parts = inches.split("x").map(part => part.trim().replace(" in", ""));
//         if (parts.length !== 2) return "";
        
//         const widthIn = parseFloat(parts[0]);
//         const heightIn = parseFloat(parts[1]);
        
//         if (isNaN(widthIn) || isNaN(heightIn)) return "";
        
//         const widthCm = (widthIn * 2.54).toFixed(2);
//         const heightCm = (heightIn * 2.54).toFixed(2);
        
//         return `${widthCm} x ${heightCm} cm`;
//       };

//       const payload = {
//         ...formData,
//         price: parseFloat(formData.price),
//         stock: parseInt(formData.stock),
//         sizeInCMS: convertInchesToCMS(formData.sizeInInches) || formData.sizeInCMS,
//       };

//       if (isEditMode) {
//         await axios.put(`${process.env.NEXT_PUBLIC_HOST}/products/update/${id}`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Product updated successfully!");
//       } else {
//         await axios.post(`${process.env.NEXT_PUBLIC_HOST}/products/create`, payload, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });
//         toast.success("Product added successfully!");
//       }

//       // Refresh list
//       const updatedResponse = await axios.get(
//         `${process.env.NEXT_PUBLIC_HOST}/products/all?page=${currentPage}&limit=${rowsPerPage}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setProducts(updatedResponse.data.data || []);
//       setTotalProducts(updatedResponse.data.total || 0);
//       setTotalPages(updatedResponse.data.totalPages || 0);
//       setIsModalOpen(false);
//     } catch (error: any) {
//       console.error("Error saving product:", error);
//       if (axios.isAxiosError(error)) {
//         const errorMessage = error.response?.data?.message || "An error occurred";
//         toast.error(errorMessage);
//       } else {
//         toast.error("Failed to save product");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete product
//   const openDeleteModal = (id: string) => {
//     setDeleteProductId(id);
//     setIsDeleteModalOpen(true);
//   };

//   const closeDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setDeleteProductId(null);
//   };

//   const confirmDeleteProduct = async () => {
//     if (!deleteProductId || !token) return;

//     try {
//       setLoading(true);
//       await axios.delete(`${process.env.NEXT_PUBLIC_HOST}/products/${deleteProductId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       toast.success("Product deleted successfully");

//       // Refresh list
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_HOST}/products/all?page=${currentPage}&limit=${rowsPerPage}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setProducts(response.data.data || []);
//       setTotalProducts(response.data.total || 0);
//       setTotalPages(response.data.totalPages || 0);
//       setCurrentPage(1);
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       toast.error("Failed to delete product");
//     } finally {
//       setLoading(false);
//       closeDeleteModal();
//     }
//   };

//   // S3 Upload
//   const uploadToS3 = async (file: File) => {
//     const s3 = new AWS.S3({
//       accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
//       secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
//       region: process.env.NEXT_PUBLIC_AWS_REGION,
//     });

//     const params = {
//       Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET as string,
//       Key: `upload/products/${Date.now()}-${file.name}`,
//       Body: file,
//     };

//     try {
//       const data = await s3.upload(params).promise();
//       return data.Location as string;
//     } catch (error) {
//       console.error("Error uploading file to S3:", error);
//       throw new Error("Error uploading file to S3");
//     }
//   };

//   // Image upload handling
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       const url = URL.createObjectURL(file);
//       setImagePreviewUrl(url);
//     }
//   };

//   const handleImageSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       toast.error("Please select an image");
//       return;
//     }

//     try {
//       setUploadingImage(true);
//       const uploadedUrl = await uploadToS3(selectedFile);
//       setImagePreviewUrl(uploadedUrl);
//       setFormData((prev) => ({
//         ...prev,
//         image: uploadedUrl,
//       }));
//       toast.success("Image uploaded successfully");
//       setIsModalImageOpen(false);
//     } catch (error) {
//       console.error("Image upload failed:", error);
//       toast.error("Failed to upload image");
//       setFormData((prev) => ({
//         ...prev,
//         image: "",
//       }));
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const closeImageModal = () => {
//     setIsModalImageOpen(false);
//     setSelectedFile(null);
//   };

//   return (
//     <div className="p-8 w-full bg-gray-100 text-gray-800">
//       {/* Loader */}
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"></div>
//         </div>
//       )}

//       {uploadingImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"></div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl font-semibold">Order Management</h1>
//         {/* <button
//           className="bg-[#09243C] text-white px-6 py-3 rounded-lg mt-4 sm:mt-0"
//           onClick={() => openModal()}
//         >
//           Add Order
//         </button> */}
//       </div>

//       {/* Search Filters */}
//       <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-8 border">
//         <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
//         <div className="flex flex-col md:flex-row gap-4">
//           <input
//             type="text"
//             placeholder="Search by title, artist, category, medium, SKU..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="border border-gray-300 p-3 rounded-lg w-full"
//           />
//           <button
//             onClick={() => {
//               setSearchQuery("");
//               setCurrentPage(1);
//             }}
//             className="bg-blue-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border relative overflow-x-auto">
//         <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
//           <h2 className="text-lg font-semibold">Products</h2>
//           <div className="flex items-center gap-4">
//             <select
//               className="border border-gray-300 p-2 rounded-lg text-sm"
//               value={rowsPerPage}
//               onChange={(e) => {
//                 setRowsPerPage(Number(e.target.value));
//                 setCurrentPage(1);
//               }}
//             >
//               <option value={5}>Rows Per Page: 5</option>
//               <option value={10}>Rows Per Page: 10</option>
//               <option value={25}>Rows Per Page: 25</option>
//               <option value={50}>Rows Per Page: 50</option>
//               <option value={100}>Rows Per Page: 100</option>
//             </select>
//           </div>
//         </div>

//         <table className="min-w-full table-auto mt-4">
//           <thead>
//             <tr className="text-left text-gray-500 text-sm">
//               <th className="p-4">No.</th>
//               <th className="p-4">Thumbnail</th>
//               <th className="p-4">Name</th>
//               <th className="p-4">Artist</th>
//               <th className="p-4">Category</th>
//               <th className="p-4">Medium</th>
//               <th className="p-4">Price</th>
//               <th className="p-4">Stock</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map((product: Product, idx) => (
//               <tr key={product.id} className="border-t text-sm">
//                 <td className="p-4">
//                   {String((currentPage - 1) * rowsPerPage + idx + 1).padStart(2, "0")}
//                 </td>
//                 <td className="p-4">
//                   {product.image ? (
//                     <div className="w-12 h-12 relative">
//                       <Image
//                         src={product.image}
//                         alt={product.title}
//                         fill
//                         className="rounded-md object-cover"
//                       />
//                     </div>
//                   ) : (
//                     <div className="w-12 h-12 bg-gray-200 rounded-md" />
//                   )}
//                 </td>
//                 <td className="p-4">{product.title}</td>
//                 <td className="p-4">{product.createdBy?.name || "Unknown Artist"}</td>
//                 <td className="p-4">{product.category}</td>
//                 <td className="p-4">{product.medium}</td>
//                 <td className="p-4">PKR {Number(product.price || 0).toLocaleString()}</td>
//                 <td className="p-4">{product.stock}</td>
//                 <td className="p-4">
//                   <span className="inline-block px-3 py-1 bg-gray-200 text-sm rounded-lg">
//                     {product.status}
//                   </span>
//                 </td>
//                 <td className="p-4">
//                   <div className="flex flex-wrap gap-2">
//                     <button
//                       className="bg-blue-500 text-white px-6 py-2 rounded-lg"
//                       onClick={() => openModal(product)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="bg-red-500 text-white px-4 py-2 rounded-lg"
//                       onClick={() => openDeleteModal(product.id)}
//                     >
//                       Delete
//                     </button>
//                     <ConfirmModal
//                       isOpen={isDeleteModalOpen}
//                       onClose={closeDeleteModal}
//                       onConfirm={confirmDeleteProduct}
//                       message="Are you sure you want to delete this product?"
//                     />
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {filteredProducts.length === 0 && (
//               <tr>
//                 <td colSpan={10} className="p-6 text-center text-gray-500">
//                   No products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         <div className="flex justify-center items-center mt-4">
//           <button
//             className="rounded-md rounded-r-none border border-r-0 border-slate-300 py-2 px-4 text-center text-sm text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
//             onClick={() => handlePageChange("prev")}
//             disabled={currentPage === 1}
//           >
//             &larr;
//           </button>

//           <div className="flex border border-slate-300">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 className={`px-4 py-2 text-sm ${
//                   page === currentPage
//                     ? "bg-slate-800 text-white"
//                     : "text-slate-600 hover:bg-slate-100"
//                 }`}
//                 onClick={() => handlePageChange(page)}
//               >
//                 {page}
//               </button>
//             ))}
//           </div>

//           <button
//             className="rounded-md rounded-l-none border border-l-0 border-slate-300 py-2 px-4 text-center text-sm text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
//             onClick={() => handlePageChange("next")}
//             disabled={currentPage === totalPages}
//           >
//             &rarr;
//           </button>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <ConfirmModal
//         isOpen={isDeleteModalOpen}
//         onClose={closeDeleteModal}
//         onConfirm={confirmDeleteProduct}
//         message="Are you sure you want to delete this product?"
//       />

//       {/* Add/Edit Product Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div
//             className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md sm:max-w-lg mx-4"
//             style={{ maxHeight: "90vh", overflowY: "auto" }}
//           >
//             <h2 className="text-xl font-semibold mb-4">
//               {isEditMode ? "Edit Product" : "Add New Product"}
//             </h2>

//             <form
//               className="space-y-4"
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleValidation();
//               }}
//             >
//               {/* Artwork Image */}
//               <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
//                 <div className="relative">
//                   <Image
//                     src={formData.image || "/images/placeholder.png"}
//                     alt="Artwork"
//                     className="w-24 h-24 rounded-md border-4 border-blue-500 object-cover"
//                     width={96}
//                     height={96}
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.onerror = null;
//                       target.src = "/images/placeholder.png";
//                     }}
//                   />
//                   <button
//                     type="button"
//                     className="absolute -bottom-2 -right-2 bg-blue-500 p-2 rounded-full hover:bg-blue-600"
//                     onClick={() => setIsModalImageOpen(true)}
//                     aria-label="Upload Image"
//                     title="Upload Image"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h4l1-2h8l1 2h4v12H3V7z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11a3 3 0 100 6 3 3 0 000-6z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Basic Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-black font-medium mb-1">Artwork Name*</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={formData.title}
//                     onChange={handleChange}
//                     placeholder="e.g., Starry Night"
//                     className={`w-full border ${errors.title ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   />
//                   {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-black font-medium mb-1">Artist*</label>
//                   <select
//                     name="createdById"
//                     value={formData.createdById}
//                     onChange={handleChange}
//                     className={`w-full border ${errors.createdById ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   >
//                     <option value="">Select artist</option>
//                     {artists.map((artist) => (
//                       <option key={artist.id} value={artist.id}>
//                         {artist.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.createdById && <p className="text-red-500 text-sm">{errors.createdById}</p>}
//                 </div>
//               </div>

//               {/* Classification */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-black font-medium mb-1">Category*</label>
//                   <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     className={`w-full border ${errors.category ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   >
//                     <option value="">Select category</option>
//                     <option value="Painting">Painting</option>
//                     <option value="Sculpture">Sculpture</option>
//                     <option value="Photography">Photography</option>
//                     <option value="Digital">Digital</option>
//                     <option value="Mixed Media">Mixed Media</option>
//                     <option value="Print">Print</option>
//                   </select>
//                   {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-black font-medium mb-1">Medium*</label>
//                   <select
//                     name="medium"
//                     value={formData.medium}
//                     onChange={handleChange}
//                     className={`w-full border ${errors.medium ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   >
//                     <option value="">Select medium</option>
//                     <option value="Oil">Oil</option>
//                     <option value="Acrylic">Acrylic</option>
//                     <option value="Watercolor">Watercolor</option>
//                     <option value="Ink">Ink</option>
//                     <option value="Bronze">Bronze</option>
//                     <option value="Digital">Digital</option>
//                     <option value="Mixed Media">Mixed Media</option>
//                   </select>
//                   {errors.medium && <p className="text-red-500 text-sm">{errors.medium}</p>}
//                 </div>
//               </div>

//               {/* Details */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-black font-medium mb-1">Size (Inches)*</label>
//                   <input
//                     type="text"
//                     name="sizeInInches"
//                     value={formData.sizeInInches}
//                     onChange={handleChange}
//                     placeholder='e.g., "14 x 20 in"'
//                     className={`w-full border ${errors.sizeInInches ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   />
//                   {errors.sizeInInches && <p className="text-red-500 text-sm">{errors.sizeInInches}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-black font-medium mb-1">SKU / Inventory Code</label>
//                   <input
//                     type="text"
//                     name="sku"
//                     value={formData.sku}
//                     onChange={handleChange}
//                     placeholder="Optional"
//                     className="w-full border border-gray-300 p-2 rounded-lg"
//                   />
//                 </div>
//               </div>

//               {/* Pricing & Inventory */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="md:col-span-1">
//                   <label className="block text-black font-medium mb-1">Price (PKR)*</label>
//                   <input
//                     type="number"
//                     name="price"
//                     value={formData.price}
//                     onChange={handleChange}
//                     placeholder="e.g., 500000"
//                     className={`w-full border ${errors.price ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   />
//                   {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
//                 </div>
//                 <div className="md:col-span-1">
//                   <label className="block text-black font-medium mb-1">Stock*</label>
//                   <input
//                     type="number"
//                     name="stock"
//                     value={formData.stock}
//                     onChange={handleChange}
//                     placeholder="e.g., 1"
//                     className={`w-full border ${errors.stock ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   />
//                   {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
//                 </div>
//                 <div className="md:col-span-1">
//                   <label className="block text-black font-medium mb-1">Status*</label>
//                   <select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     className={`w-full border ${errors.status ? "border-red-500" : "border-gray-300"} p-2 rounded-lg`}
//                   >
//                     <option value="Available">Available</option>
//                     <option value="Reserved">Reserved</option>
//                     <option value="Sold">Sold</option>
//                   </select>
//                   {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-black font-medium mb-1">Description</label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleChange}
//                   placeholder="Description of the artwork..."
//                   className="w-full border border-gray-300 p-2 rounded-lg min-h-[100px]"
//                 />
//               </div>

//               {/* Form Actions */}
//               <div className="flex justify-end space-x-4 mt-6">
//                 <button
//                   type="button"
//                   className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
//                   onClick={handleModalClose}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
//                   disabled={loading}
//                 >
//                   {loading ? "Processing..." : isEditMode ? "Update" : "Save"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Image Upload Modal */}
//       {isModalImageOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
//           <div className="bg-white rounded-lg p-6 shadow-md w-11/12 max-w-md">
//             <h2 className="text-lg font-semibold text-black mb-4">Upload Image</h2>
//             <div className="flex flex-col gap-4">
//               <label
//                 htmlFor="fileUpload"
//                 className="border border-gray-300 rounded-md px-4 py-2 text-center text-white cursor-pointer bg-blue-500 hover:bg-blue-400"
//               >
//                 Choose File
//                 <input
//                   id="fileUpload"
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileChange}
//                   accept="image/png, image/jpeg, image/jpg, image/webp"
//                 />
//               </label>
//               {selectedFile && (
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-600">
//                     Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
//                   </p>
//                   <div className="mt-2 w-32 h-32 relative">
//                     <Image
//                       src={imagePreviewUrl || "/images/placeholder.png"}
//                       alt="Preview"
//                       fill
//                       className="rounded-md object-cover"
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="flex justify-end space-x-4 mt-4">
//               <button
//                 className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
//                 onClick={closeImageModal}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//                 onClick={handleImageSubmit}
//                 disabled={!selectedFile}
//               >
//                 Upload
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OrderManagement;

























// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useAuth } from "@/context/AuthContext";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useDebounce } from "use-debounce";

// interface Order {
//   id: string;
//   userId: string;
//   status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
//   totalAmount: string;
//   createdAt: string;
//   updatedAt: string;
//   items: any[];
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
//   };
// }

// function OrderManagement() {
//   const { token } = useAuth();

//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalOrders, setTotalOrders] = useState(0);

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editOrder, setEditOrder] = useState<Order | null>(null);

//   // Fetch Orders
//   const fetchOrders = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_HOST}/orders?page=${currentPage}&limit=${rowsPerPage}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setOrders(response.data.data.data || []);
//       setTotalOrders(response.data.data.total || 0);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       toast.error("Failed to load orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [token, currentPage, rowsPerPage, debouncedSearchQuery]);

//   // Search filter (by status, user, email, etc.)
//   const filteredOrders = orders.filter((o) => {
//     const q = searchQuery.toLowerCase();
//     return (
//       o.id.toLowerCase().includes(q) ||
//       o.status.toLowerCase().includes(q) ||
//       o.user?.name.toLowerCase().includes(q) ||
//       o.user?.email.toLowerCase().includes(q)
//     );
//   });

//   // Open Edit Modal
//   const openEditModal = (order: Order) => {
//     setEditOrder(order);
//     setIsEditModalOpen(true);
//   };

//   const closeEditModal = () => {
//     setIsEditModalOpen(false);
//     setEditOrder(null);
//   };

//   // Update Order (status + amount)
//   const handleUpdateOrder = async () => {
//     if (!editOrder || !token) return;

//     try {
//       setLoading(true);
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_HOST}/orders/update/${editOrder.id}`,
//         {
//           status: editOrder.status,
//           totalAmount: parseFloat(editOrder.totalAmount),
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Order updated successfully");
//       closeEditModal();
//       fetchOrders();
//     } catch (error) {
//       console.error("Error updating order:", error);
//       toast.error("Failed to update order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update Status Only
//   const handleUpdateStatus = async (id: string, status: Order["status"]) => {
//     if (!token) return;

//     try {
//       setLoading(true);
//       await axios.put(
//         `${process.env.NEXT_PUBLIC_HOST}/orders/status/${id}`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       toast.success("Order status updated");
//       fetchOrders();
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       toast.error("Failed to update status");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pagination handler
//   const handlePageChange = (page: number | string) => {
//     if (page === "next" && currentPage * rowsPerPage < totalOrders) {
//       setCurrentPage((prev) => prev + 1);
//     } else if (page === "prev" && currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     } else if (typeof page === "number") {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="p-8 w-full bg-gray-100 text-gray-800">
//       {loading && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"></div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <h1 className="text-2xl font-semibold">Order Management</h1>
//       </div>

//       {/* Search */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <h2 className="text-lg font-semibold mb-4">Search Orders</h2>
//         <div className="flex gap-4">
//           <input
//             type="text"
//             placeholder="Search by ID, status, user..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="border border-gray-300 p-3 rounded-lg w-full"
//           />
//           <button
//             onClick={() => {
//               setSearchQuery("");
//               setCurrentPage(1);
//             }}
//             className="bg-blue-600 text-white px-6 py-3 rounded-lg"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
//         <table className="min-w-full table-auto">
//           <thead>
//             <tr className="text-left text-gray-500 text-sm">
//               <th className="p-4">#</th>
//               <th className="p-4">Order ID</th>
//               <th className="p-4">User</th>
//               <th className="p-4">Email</th>
//               <th className="p-4">Status</th>
//               <th className="p-4">Total</th>
//               <th className="p-4">Created At</th>
//               <th className="p-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order, idx) => (
//               <tr key={order.id} className="border-t text-sm">
//                 <td className="p-4">
//                   {String((currentPage - 1) * rowsPerPage + idx + 1).padStart(2, "0")}
//                 </td>
//                 <td className="p-4">{order.id}</td>
//                 <td className="p-4">{order.user?.name}</td>
//                 <td className="p-4">{order.user?.email}</td>
//                 <td className="p-4">
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order["status"])}
//                     className="border p-2 rounded"
//                   >
//                     <option value="pending">Pending</option>
//                     <option value="paid">Paid</option>
//                     <option value="shipped">Shipped</option>
//                     <option value="delivered">Delivered</option>
//                     <option value="cancelled">Cancelled</option>
//                   </select>
//                 </td>
//                 <td className="p-4">${order.totalAmount}</td>
//                 <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
//                 <td className="p-4">
//                   <button
//                     onClick={() => openEditModal(order)}
//                     className="text-blue-600 underline"
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           className="px-4 py-2 border rounded disabled:opacity-50"
//           onClick={() => handlePageChange("prev")}
//           disabled={currentPage === 1}
//         >
//           Prev
//         </button>
//         <span>
//           Page {currentPage} of {Math.ceil(totalOrders / rowsPerPage)}
//         </span>
//         <button
//           className="px-4 py-2 border rounded disabled:opacity-50"
//           onClick={() => handlePageChange("next")}
//           disabled={currentPage * rowsPerPage >= totalOrders}
//         >
//           Next
//         </button>
//       </div>

//       {/* Edit Modal */}
//       {isEditModalOpen && editOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-md w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Order</h2>
//             <label className="block mb-2">Status</label>
//             <select
//               value={editOrder.status}
//               onChange={(e) =>
//                 setEditOrder({ ...editOrder, status: e.target.value as Order["status"] })
//               }
//               className="border p-2 w-full mb-4 rounded"
//             >
//               <option value="pending">Pending</option>
//               <option value="paid">Paid</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//               <option value="cancelled">Cancelled</option>
//             </select>

//             <label className="block mb-2">Total Amount</label>
//             <input
//               type="number"
//               value={editOrder.totalAmount}
//               onChange={(e) =>
//                 setEditOrder({ ...editOrder, totalAmount: e.target.value })
//               }
//               className="border p-2 w-full mb-4 rounded"
//             />

//             <div className="flex justify-end gap-4">
//               <button onClick={closeEditModal} className="px-4 py-2 border rounded">
//                 Cancel
//               </button>
//               <button
//                 onClick={handleUpdateOrder}
//                 className="px-4 py-2 bg-blue-600 text-white rounded"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default OrderManagement;




















/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "./modaldeleteadmin";
import { useDebounce } from "use-debounce";
import Image from "next/image";

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    title: string;
    description: string;
    price: string;
    image: string;
    createdBy: {
      name: string;
    };
  };
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);

  const { token } = useAuth();

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HOST}/orders/?page=${currentPage}&limit=${rowsPerPage}&search=${debouncedSearchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(response.data.data.data || []);
        setTotalOrders(response.data.data.total || 0);
        setTotalPages(Math.ceil(response.data.data.total / rowsPerPage) || 0);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, currentPage, rowsPerPage, debouncedSearchQuery]);

  // Filter orders based on search query
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.user.name.toLowerCase().includes(q) ||
      order.user.email.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q) ||
      order.totalAmount.toLowerCase().includes(q)
    );
  });

  // Handle pagination changes
  const handlePageChange = (page: number | string) => {
    if (page === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (page === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (typeof page === "number" && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open status update modal
  const openStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
    setSelectedStatus("");
  };

  // Update order status
  const updateOrderStatus = async () => {
    if (!selectedOrder || !token) return;

    setLoading(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_HOST}/orders/status/${selectedOrder.id}`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Order status updated successfully!");

      // Refresh orders list
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/orders/?page=${currentPage}&limit=${rowsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(response.data.data.data || []);
      closeStatusModal();
    } catch (error: any) {
      console.error("Error updating order status:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to update order status");
      }
    } finally {
      setLoading(false);
    }
  };

  // Open order details modal
  const openOrderDetails = (order: Order) => {
    setOrderDetails(order);
    setIsDetailModalOpen(true);
  };

  const closeOrderDetails = () => {
    setIsDetailModalOpen(false);
    setOrderDetails(null);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <h1 className="text-2xl font-semibold">Order Management</h1>
      </div>

      {/* Search Filters */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-8 border">
        <h2 className="text-lg font-semibold mb-4">Search Filters</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by order ID, customer name, email, status, or amount..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
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

      {/* Orders Table */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border relative overflow-x-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <h2 className="text-lg font-semibold">Orders</h2>
          <div className="flex items-center gap-4">
            <select
              className="border border-gray-300 p-2 rounded-lg text-sm"
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
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
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Email</th>
              <th className="p-4">Date</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: Order, idx) => (
              <tr key={order.id} className="border-t text-sm">
                <td className="p-4 font-mono text-xs">{order.id}</td>
                <td className="p-4">{order.user?.name}</td>
                <td className="p-4">{order.user?.email}</td>
                <td className="p-4">{formatDate(order.createdAt)}</td>
                <td className="p-4">{order.items.length}</td>
                <td className="p-4">PKR {Number(order.totalAmount || 0).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`inline-block px-3 py-1 text-sm rounded-lg ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() => openOrderDetails(order)}
                    >
                      View
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() => openStatusModal(order)}
                    >
                      Update Status
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-4">
          <button
            className="rounded-md rounded-r-none border border-r-0 border-slate-300 py-2 px-4 text-center text-sm text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handlePageChange("prev")}
            disabled={currentPage === 1}
          >
            &larr;
          </button>

          <div className="flex border border-slate-300">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`px-4 py-2 text-sm ${
                  page === currentPage
                    ? "bg-slate-800 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            className="rounded-md rounded-l-none border border-l-0 border-slate-300 py-2 px-4 text-center text-sm text-slate-600 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handlePageChange("next")}
            disabled={currentPage === totalPages}
          >
            &rarr;
          </button>
        </div>
      </div>

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Order ID: {selectedOrder.id}</p>
              <p className="text-sm text-gray-600">Customer: {selectedOrder.user.name}</p>
            </div>
            <div className="mb-4">
              <label className="block text-black font-medium mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-lg"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={closeStatusModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
                onClick={updateOrderStatus}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {isDetailModalOpen && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            {/* Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p><span className="font-medium">Order ID:</span> {orderDetails.id}</p>
                <p><span className="font-medium">Date:</span> {formatDate(orderDetails.createdAt)}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${getStatusColor(orderDetails.status)}`}>
                    {orderDetails.status}
                  </span>
                </p>
                <p><span className="font-medium">Total Amount:</span> PKR {Number(orderDetails.totalAmount).toLocaleString()}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p><span className="font-medium">Name:</span> {orderDetails.user.name}</p>
                <p><span className="font-medium">Email:</span> {orderDetails.user.email}</p>
                <p><span className="font-medium">Phone:</span> {orderDetails.user.phone}</p>
                <p><span className="font-medium">Address:</span> {orderDetails.user.address}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Order Items ({orderDetails.items.length})</h3>
              {orderDetails.items.length > 0 ? (
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div key={item.id} className="flex items-center border-b pb-4">
                      <div className="w-16 h-16 relative mr-4">
                        <Image
                          src={item.product.image || "/images/placeholder.png"}
                          alt={item.product.title}
                          fill
                          className="rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "/images/placeholder.png";
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.title}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: PKR {Number(item.price).toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Subtotal: PKR {(Number(item.price) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No items in this order.</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={closeOrderDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;