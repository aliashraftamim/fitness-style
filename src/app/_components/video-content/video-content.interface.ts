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
