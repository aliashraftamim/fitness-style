//* ----------------------------------------- User Verification -----------------------------------------
// src/core/constants/global.constants.ts

export enum USER_ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  PENDING: "PENDING",
} as const;

export interface IUserVerification {
  verified: boolean;
  otp: string;
}

//* ----------------------------------------- Stripe Connect -----------------------------------------
export interface IStripeConnect {
  isActiveId: boolean;
  stripeAccountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
}

//* ----------------------------------------- Payment -----------------------------------------
export interface IPayment {
  sessionId: string;
  paymentId: string;
  subscriptionId: string | null;
  tiersId?: string | any;
  tiersName: string;
  isAllTiers: boolean;
  currency: string;
  issuedAt: Date | string;
  expiredAt: Date | string;
  amount: number;
  paymentMethod: string;
  makeByAdmin: boolean;
  adminId: string | null;
  status: "paid" | "free" | "expired" | "pending" | "failed";
}

//* ----------------------------------------- User -----------------------------------------
export interface IUser {
  _id?: string | any;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contactNumber: string;
  dob: string;
  age?: number | null;
  gender: string;
  location: {
    type: string;
    coordinates: number[];
  };
  locationName: string;
  profileImage: string;
  bio: string;
  role: keyof typeof USER_ROLE;
  fcmToken: string;
  verification: IUserVerification;
  payment: IPayment;
  stripeConnect: IStripeConnect;
  priority: number;
  status: (typeof USER_STATUS)[keyof typeof USER_STATUS];
  passwordChangedAt?: Date | null;
  isOnline: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
