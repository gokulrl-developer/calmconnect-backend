import { Request } from "express";

export interface AuthenticatedAccount {
  id: string;
  role: "user" | "psychologist" | "admin";
  isVerified?: boolean;
}

export interface Pagination {
  skip: number;
  limit: number;
  page: number;
}

export type AuthenticatedRequest = Request & {
  account: AuthenticatedAccount;
};

export type PaginatedRequest = Request & {
  pagination: Pagination;
};

export type AuthenticatedPaginatedRequest = Request & {
  account: AuthenticatedAccount;
  pagination: Pagination;
};

