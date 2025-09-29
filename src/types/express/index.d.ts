import "express";

declare global {
  namespace Express {
    interface Request {
      account?: {
        id: string;
        role: "user" | "psychologist" | "admin";
        isVerified?: boolean;
        [key: string]: any;
      };
      pagination?: { 
        skip: number;
         limit: number;
          page: number 
        }
    }
  }
}
