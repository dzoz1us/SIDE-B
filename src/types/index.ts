export type Role = "guest" | "user" | "manager" | "admin";

export interface Ensemble {
  id: number;
  name: string;
  type: string;
  country: string;
  founded: number;
  description: string;
  bio: string;
  photo: string;
  albumCount: number;
  memberCount: number;
}

export interface Musician {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  instruments: string[];
  bio: string;
  photo: string;
}

export interface EnsembleMember {
  id: number;
  ensembleId: number;
  musicianId: number;
  role: string;
  instrument: string;
  from: number;
  to?: number;
}

export interface Composition {
  id: number;
  title: string;
  compositorId: number;
  duration: string;
}

export interface Track {
  id: number;
  recordId: number;
  trackNumber: number;
  compositionId: number;
}

export interface Branch {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
}

export interface VinylRecord {
  id: number;
  title: string;
  ensembleId: number;
  year: number;
  label: string;
  catalogNumber: string;
  price: number;
  wholesalePrice: number;
  cover: string;
  soldCurrentYear: number;
  genre: string;
  supplier?: string;
}

export interface RecordBranch {
  id: number;
  recordId: number;
  branchId: number;
  quantity: number;
}

export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  status: "active" | "blocked";
  createdAt: string;
}

export interface Booking {
  id: number;
  userId: number;
  recordId: number;
  branchId: number;
  status: "active" | "completed" | "cancelled" | "expired";
  createdAt: string;
  deadline: string;
  completedAt?: string;
}

export interface ActionLog {
  id: number;
  userId: number;
  action: string;
  object: string;
  details: string;
  createdAt: string;
}

export type NavigateFn = (page: string, params?: Record<string, any>) => void;
