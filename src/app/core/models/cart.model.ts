import { Food } from './food.model';

export interface CartItem {
  // Populated with { _id, name, image, available } by the backend
  food: Pick<Food, '_id' | 'name' | 'image' | 'available'> | string;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  user?: string;
  items: CartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCartItemPayload {
  food: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}
