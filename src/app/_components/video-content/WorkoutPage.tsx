"use client";

import { useGetAllTiersQuery } from "@/redux/features/admin/tiers.api";
import { useGetVideoContentQuery } from "@/redux/features/admin/video-content.api";
import { useMemo, useState } from "react";
import Loading from "../MAIN/loading/Loading";
import AddPlanModal, { IWorkoutPlan } from "./AddWorkout";
import WorkoutCard from "./WorkoutCard";
import { TFormData } from "./video-content.interface";

const WorkoutPage = () => {
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tierFilter, setTierFilter] = useState("all");
  const [workoutTypeFilter, setWorkoutTypeFilter] = useState("all");

  const { data: workoutsData, isLoading } = useGetVideoContentQuery({});
  const { data: allTiers, isLoading: isLoadingTiers } = useGetAllTiersQuery({});

  const workouts = workoutsData?.data || [];
  const tiers = allTiers?.data || [];

  // Memoized filtered workouts
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((workout: any) => {
      const matchesTier =
        tierFilter === "all" || workout.tier.name === tierFilter;
      const matchesType =
        workoutTypeFilter === "all" ||
        workout.workoutType === workoutTypeFilter;
      return matchesTier && matchesType;
    });
  }, [workouts, tierFilter, workoutTypeFilter]);

  // Memoized stats
  const stats = useMemo(
    () => ({
      total: workouts.length,
      filtered: filteredWorkouts.length,
      completed: workouts.filter((w: TFormData) => w.isCompleted).length,
    }),
    [workouts, filteredWorkouts]
  );

  const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tierName = e.target.value;
    console.log("🚀 ~ handleTierChange ~ tierName:", tierName);
    setTierFilter(tierName);

    if (tierName === "all") {
      setSelectedTier(null);
      setWorkoutTypeFilter("all");
    } else {
      const tier = tiers.find((t: any) => {
        console.log("🚀 ~ handleTierChange ~ t:", t.name);
        return t.name === tierName;
      });
      setSelectedTier(tier);
    }
  };

  const handleResetFilters = () => {
    setTierFilter("all");
    setWorkoutTypeFilter("all");
    setSelectedTier(null);
  };

  const handleAddWorkout = (plan: IWorkoutPlan) => {
    console.log("New Workout:", plan);
    // API call would go here
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workout Library
          </h1>
          <p className="text-gray-600">
            Manage and organize your workout programs
          </p>
        </header>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex gap-3 flex-wrap">
              {/* Tier Filter */}
              <select
                value={tierFilter}
                onChange={handleTierChange}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="all">All Tiers</option>
                {isLoadingTiers ? (
                  <option disabled>Loading...</option>
                ) : (
                  tiers.map((tier: any) => (
                    <option key={tier?._id} value={tier?.name}>
                      {tier?.name}
                    </option>
                  ))
                )}
              </select>

              {/* Workout Type Filter */}
              <select
                value={workoutTypeFilter}
                onChange={(e) => setWorkoutTypeFilter(e.target.value)}
                disabled={!selectedTier}
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="all">All Types</option>
                {selectedTier?.category?.map((cat: string, i: number) => (
                  <option key={cat + i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleResetFilters}
                className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-sm transition-all"
              >
                Reset Filters
              </button>
            </div>

            {/* Add Workout Button */}
            <button
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <span className="text-lg">+</span>
              Add New Workout
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        {stats.total > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center justify-between">
            <div className="flex gap-6">
              <StatCard
                label="Total Workouts"
                value={stats.total}
                color="gray"
              />
              <StatCard
                label="Filtered Results"
                value={stats.filtered}
                color="green"
                divider
              />
              <StatCard
                label="Completed"
                value={stats.completed}
                color="blue"
                divider
              />
            </div>
          </div>
        )}

        {/* Workout Cards Grid */}
        <WorkoutGrid workouts={filteredWorkouts} totalWorkouts={stats.total} />
      </div>

      {/* Modal */}
      <AddPlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddWorkout}
      />
    </div>
  );
};

// Separate Components for better organization
const StatCard = ({
  label,
  value,
  color,
  divider = false,
}: {
  label: string;
  value: number;
  color: "gray" | "green" | "blue";
  divider?: boolean;
}) => {
  const colorClasses = {
    gray: "text-gray-900",
    green: "text-green-600",
    blue: "text-blue-600",
  };

  return (
    <div className={divider ? "border-l border-gray-200 pl-6" : ""}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
    </div>
  );
};

const WorkoutGrid = ({
  workouts,
  totalWorkouts,
}: {
  workouts: TFormData[];
  totalWorkouts: number;
}) => {
  if (workouts.length > 0) {
    return (
      <div className="flex flex-wrap gap-6">
        {workouts.map((workout) => (
          <WorkoutCard key={workout._id} workout={workout} />
        ))}
      </div>
    );
  }

  return (
    <EmptyState
      icon={totalWorkouts > 0 ? "🔍" : "🏀"}
      title={totalWorkouts > 0 ? "No workouts found" : "No workouts available"}
      subtitle={
        totalWorkouts > 0
          ? "Try adjusting your filters"
          : "Add your first workout to get started"
      }
    />
  );
};

const EmptyState = ({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) => (
  <div className="text-center py-16 bg-white rounded-xl shadow-sm">
    <div className="text-gray-400 text-5xl mb-4">{icon}</div>
    <p className="text-gray-500 text-lg">{title}</p>
    <p className="text-gray-400 text-sm mt-2">{subtitle}</p>
  </div>
);

export default WorkoutPage;
