export default interface PaginationData{
 totalItemCount:number,
 totalPages:number,
 currentPage:number,
 pageSize:number
}

export function calculatePagination(totalItemCount: number, skip: number, limit: number):PaginationData {
  const pageSize = limit;
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(totalItemCount / pageSize);

  return { totalItemCount, totalPages, currentPage, pageSize };
}

export function calculateSkip(page: number, limit: number): number {
  const safePage = Math.max(page, 1); 
  return (safePage - 1) * limit;
}