import { Request, Response, NextFunction } from "express";


export function paginationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10)); 

  const skip = (page - 1) * limit;
  
    req.pagination={page,limit,skip};
  

  next();
}
