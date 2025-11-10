export interface ISubscription {
  _id?: string; // MongoDB document ID
  title: string;
  tires: string[]; // Array of Tier IDs
  description: string;
  pricePerMonth: number;
  discountPricePerMonth?: number | null;
  currency: "USD" | "INR" | "EUR";
  features: string[];
  isAllTiers: boolean;
}
