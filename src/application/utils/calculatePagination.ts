export default interface PaginationData{
 totalItems:number,
 totalPages:number,
 currentPage:number,
 pageSize:number
}

export function calculatePagination(totalItems: number, skip: number, limit: number) {
  const pageSize = limit;
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(totalItems / pageSize);

  return { totalItems, totalPages, currentPage, pageSize };
}