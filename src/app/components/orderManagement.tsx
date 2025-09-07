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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

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
      order.user?.name.toLowerCase().includes(q) ||
      order.user?.email.toLowerCase().includes(q) ||
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

  // Open delete confirmation modal
  const openDeleteModal = (orderId: string) => {
    setDeleteOrderId(orderId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteOrderId(null);
  };

  // Delete order
  const confirmDeleteOrder = async () => {
    if (!deleteOrderId || !token) return;

    setLoading(true);
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_HOST}/orders/${deleteOrderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Order deleted successfully!");

      // Refresh orders list
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/orders/?page=${currentPage}&limit=${rowsPerPage}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders(response.data.data.data || []);
      setTotalOrders(response.data.data.total || 0);
      setTotalPages(Math.ceil(response.data.data.total / rowsPerPage) || 0);
      
      // Reset to first page if current page is empty
      if (response.data.data.data.length === 0 && currentPage > 1) {
        setCurrentPage(1);
      }
    } catch (error: any) {
      console.error("Error deleting order:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete order");
      }
    } finally {
      setLoading(false);
      closeDeleteModal();
    }
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
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm"
                      onClick={() => openDeleteModal(order.id)}
                    >
                      Delete
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
              <p className="text-sm text-gray-600">Customer: {selectedOrder.user?.name}</p>
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
                <p><span className="font-medium">Name:</span> {orderDetails.user?.name}</p>
                <p><span className="font-medium">Email:</span> {orderDetails.user?.email}</p>
                <p><span className="font-medium">Phone:</span> {orderDetails.user?.phone}</p>
                <p><span className="font-medium">Address:</span> {orderDetails.user?.address}</p>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDeleteOrder}
        message="Are you sure you want to delete this order? This action cannot be undone."
      />
    </div>
  );
}

export default OrderManagement;