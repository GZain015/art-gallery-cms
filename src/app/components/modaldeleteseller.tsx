import React from "react";

interface ConfirmModalSellerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string; 
}

const ConfirmModalSeller: React.FC<ConfirmModalSellerProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop"></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg p-6 shadow-lg max-w-sm w-full z-50">
        <div className="flex items-center gap-3">
          <div className="text-red-500 text-2xl">⚠️</div>
          <h2 className="text-lg font-semibold">Delete Seller</h2>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          {
            message ? ( 
            message 
          ) : ( 
          `Are you sure you want to delete this Seller? All data associated with
          this Seller will be permanently removed. This action cannot be undone.
          `)
          }
        </p>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModalSeller;
