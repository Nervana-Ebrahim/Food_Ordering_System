export type UserRole = 'Admin' | 'Customer';

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  password?: string;
}
