
const getEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const adminConfig = {
  adminEmail: getEnv("ADMIN_EMAIL"),
  adminHashedPassword: getEnv("ADMIN_HASHED_PASSWORD"), 
  adminId:getEnv("ADMIN_ID")
};
