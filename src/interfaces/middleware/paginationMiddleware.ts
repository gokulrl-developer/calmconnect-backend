import { Request, Response, NextFunction } from "express";

export interface PaginationRequest extends Request {
  pagination?: {
    page: number;
    limit: number;
    skip: number;
  };
}

export function paginationMiddleware(
  req: PaginationRequest,
  res: Response,
  next: NextFunction
) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10)); 

  const skip = (page - 1) * limit;

  req.pagination = { page, limit, skip };

  next();
}
