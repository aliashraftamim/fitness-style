"use client";

import { useGetVideoContentQuery } from "@/redux/features/admin/video-content.api";
import Link from "next/link";
import { useState } from "react";
import Loading from "../MAIN/loading/Loading";
import AddPlanModal, { IWorkoutPlan } from "./AddWorkout";

export type TFormData = {
  _id?: string;
  image: string;
  videoUrl: string;
  workoutTitle: string;
  subtitle: string;
  description: string;
  tier: string;
  workoutType: string;
  workoutPlan: string[];
  isCompleted?: boolean;
};

const initialFormData: TFormData = {
  image: "",
  videoUrl: "",
  workoutTitle: "",
  subtitle: "",
  description: "",
  tier: "",
  workoutType: "Beginner",
  workoutPlan: [],
};

// Modal Component
const DynamicModal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Workout
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Workout Card Component
const WorkoutCard = ({ workout }: { workout: TFormData }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] border border-gray-100">
    <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      <img
        src={workout.image}
        alt={workout.workoutTitle}
        className="w-full h-full object-cover"
      />
      {workout.isCompleted && (
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
          ✓ Completed
        </div>
      )}
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
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {workout.workoutType}
        </span>
        <Link
          href={`/video-content/${workout._id}`}
          className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  </div>
);

const WorkoutPage = () => {
  // Replace this with your actual API hook: const { data: workoutsData, isLoading } = useGetVideoContentQuery(undefined);

  const { data: workoutsData, isLoading } = useGetVideoContentQuery(undefined);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TFormData>(initialFormData);
  const [tierFilter, setTierFilter] = useState("all");
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState("all");
  const [planInput, setPlanInput] = useState("");

  // Get workouts from API data
  const workouts = workoutsData?.data || [];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(initialFormData);
    setPlanInput("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        videoUrl: file.name,
      }));
    }
  };

  const handleAddPlanItem = () => {
    if (planInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        workoutPlan: [...prev.workoutPlan, planInput.trim()],
      }));
      setPlanInput("");
    }
  };

  const handleRemovePlanItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      workoutPlan: prev.workoutPlan.filter((_, i) => i !== index),
    }));
  };

  const handleAddWorkout = () => {
    console.log("New Workout:", formData);
    // Here you would call your API to create the workout
    setFormData(initialFormData);
    setPlanInput("");
    setIsModalOpen(false);
  };

  const handleResetFilter = () => {
    setTierFilter("all");
    setWorkoutTypeFilter("all");
  };

  const filteredWorkouts = workouts.filter((w: any) => {
    const matchesTier = tierFilter === "all" || w.tier === tierFilter;
    const matchesType =
      workoutTypeFilter === "all" || w.workoutType === workoutTypeFilter;
    return matchesTier && matchesType;
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workout Library
          </h1>
          <p className="text-gray-600">
            Manage and organize your workout programs
          </p>
        </div>

        {/* Filter and Action Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-3 flex-wrap">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">All Tiers</option>
                <option value="Awaken">Awaken</option>
                <option value="Ascend">Ascend</option>
                <option value="Actualize">Actualize</option>
                <option value="Balance">Balance</option>
              </select>

              <select
                value={workoutTypeFilter}
                onChange={(e) => setWorkoutTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">All Types</option>
                <option value="Beginner">Beginner</option>
                <option value="Skills">Skills</option>
                <option value="Strength">Strength</option>
                <option value="Plyometrics">Plyometrics</option>
              </select>

              <button
                type="button"
                onClick={handleResetFilter}
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all"
              >
                Reset Filters
              </button>
            </div>

            <button
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              onClick={handleOpenModal}
            >
              <span className="text-lg">+</span>
              Add New Workout
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {workouts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex gap-6">
              <div>
                <p className="text-sm text-gray-600">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workouts.length}
                </p>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredWorkouts.length}
                </p>
              </div>
              <div className="border-l border-gray-200 pl-6">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {workouts.filter((w: TFormData) => w.isCompleted).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Workout Cards Grid */}
        {filteredWorkouts.length > 0 ? (
          <div className="flex flex-wrap gap-6">
            {filteredWorkouts.map((workout: TFormData) => (
              <WorkoutCard key={workout._id} workout={workout} />
            ))}
          </div>
        ) : workouts.length > 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No workouts found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 text-5xl mb-4">🏀</div>
            <p className="text-gray-500 text-lg">No workouts available</p>
            <p className="text-gray-400 text-sm mt-2">
              Add your first workout to get started
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddPlanModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={function (plan: IWorkoutPlan): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default WorkoutPage;
