import { Category } from './category.model';

export interface Food {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  // Populated when returned by the list/detail endpoints; a plain id string
  // is also accepted for forms/payloads.
  category: Category | string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodPayload {
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  available?: boolean;
}

export interface FoodQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  available?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
