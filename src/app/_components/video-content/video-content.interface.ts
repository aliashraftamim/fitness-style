import { ITier } from "../Tiers/tiers.interface";

export interface IVideoContent {
  _id: string;
  image: string;
  videoUrl: string;
  tier: string | ITier;
  workoutTitle: string;
  subtitle: string;
  description: string;
  workoutType: string;
  workoutPlan: string[];
  createdAt: string;
  updatedAt: string;
}

// workout.types.ts

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
  sortingPosition: number;
  isCompleted?: boolean;
};

export interface IWorkoutPlan {
  // Add your workout plan interface properties here
  id?: string;
  name: string;
  exercises: string[];
}

export const initialFormData: TFormData = {
  image: "",
  videoUrl: "",
  workoutTitle: "",
  subtitle: "",
  description: "",
  tier: "",
  workoutType: "Beginner",
  workoutPlan: [],
  sortingPosition: 0,
};
