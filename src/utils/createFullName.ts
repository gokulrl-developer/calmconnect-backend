export const createFullName = (firstName?: string | null, lastName?: string | null): string => {
  const parts = [firstName, lastName].filter(Boolean); 
  return parts.length > 0 ? parts.join(" ") : "N/A";
};
