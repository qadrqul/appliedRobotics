export type Role = 'admin' | 'operator';
export type Status = 'active' | 'inactive';

export interface User {
  id: string;
  username: string;
  role: Role;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  owner: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  id: string;
  plateNumber: string;
  status: 'entered' | 'exited';
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface CreateUserData {
  username: string;
  password: string;
  role: Role;
}

export interface UpdateUserData {
  username?: string;
  role?: Role;
  status?: Status;
}

export interface UpdatePasswordData {
  oldPassword: string;
  newPassword: string;
}