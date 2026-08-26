export interface Category {
  _id: string;
  name: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  image?: string;
}
