export const ALLOWED_RESUME_FILE_TYPES:readonly string[] = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
] as const;

export const ALLOWED_LICENSE_FILE_TYPES:readonly string[] = [
  "application/pdf",
  "image/jpeg",
  "image/png"
] as const;