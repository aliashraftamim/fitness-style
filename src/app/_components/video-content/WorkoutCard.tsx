"use client";

import { useDeleteVideoContentMutation } from "@/redux/features/admin/video-content.api";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import DeleteConfirmationModal from "../MAIN/delete-confirmation-modal/DeleteConfirmModal";
import EditWorkoutModal from "./EditWorkout";
import { TFormData } from "./video-content.interface";

interface WorkoutCardProps {
  workout: TFormData;
}

// Workout Card Component
const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [deleteWorkout, { isLoading: isDeleting }] =
    useDeleteVideoContentMutation();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    setShowMenu(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setShowMenu(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!workout._id) return;

    try {
      await deleteWorkout(workout._id).unwrap();
      toast.success("Workout deleted successfully!");
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete workout");
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleUpdateSuccess = (result: any) => {
    console.log("Update successful:", result);
    // Data automatically refresh হবে RTK Query এর cache invalidation দিয়ে
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] border border-gray-100">
        <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
          {workout?.image && (
            <img
              src={workout?.image}
              alt={workout?.workoutTitle}
              className="w-full h-full object-cover"
            />
          )}
          {workout.isCompleted && (
            <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              ✓ Completed
            </div>
          )}

          {/* Three Dot Menu Button */}
          <div className="absolute top-3 right-3" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-2 rounded-lg shadow-lg transition-all hover:scale-105"
              title="More options"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 animate-fadeIn">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Workout
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleDeleteClick}
                  disabled={!workout._id}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Workout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {workout.workoutTitle}
          </h3>
          <p className="text-sm text-green-600 font-medium mb-3">
            {workout.subtitle}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {workout.description}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            Position: {workout.sortingPosition}
          </p>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                {(workout as any)?.tier?.name}
              </span>
              <span className="text-xs text-gray-500 bg-yellow-50 px-3 py-1 rounded-full">
                {workout.workoutType}
              </span>
            </div>
            <Link
              href={`/video-content/${workout._id}`}
              className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditWorkoutModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onAdd={handleUpdateSuccess}
        editData={workout}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        workoutTitle={workout.workoutTitle}
      />
    </>
  );
};

export default WorkoutCard;
