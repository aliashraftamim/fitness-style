export interface ITier {
  _id: string;
  name: string;
  monthlyPrice: number;
  promotionalPrice: number;
  icon: string | any;
  discountLabel: string;
  features: string[];
  description: string;
  category: string[];
  isVisible?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}
