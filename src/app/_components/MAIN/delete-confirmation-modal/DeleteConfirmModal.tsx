import { Button } from "antd";
import React from "react";
import DynamicModal from "../../shared/DynamicModal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  workoutTitle?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  workoutTitle,
}) => {
  return (
    <DynamicModal isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-6 px-4">
        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">
          Delete Workout?
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-2">
          Are you sure you want to delete this workout?
        </p>

        {workoutTitle && (
          <p className="text-sm font-semibold text-gray-800 bg-gray-50 px-4 py-2 rounded-lg mb-6 inline-block">
            "{workoutTitle}"
          </p>
        )}

        <p className="text-sm text-gray-500 mb-8">
          This action cannot be undone. All associated data will be permanently
          removed.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={isDeleting}
            className="px-6 py-2 !bg-red-600 !text-white rounded-lg hover:!bg-red-700 font-medium transition-all shadow-sm hover:shadow-md"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </DynamicModal>
  );
};

export default DeleteConfirmationModal;
