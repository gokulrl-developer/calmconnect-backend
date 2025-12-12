export const USER_ROUTES = {
  // -------- Auth --------
  SIGN_UP: "/user/sign-up",
  REGISTER: "/user/register",
  LOGIN: "/user/login",
  SOCIAL_LOGIN: "/user/social",
  FORGOT_PASSWORD: "/user/forgot-password",
  RESET_PASSWORD: "/user/reset-password",
  RESEND_OTP_SIGNUP: "/user/resend-otp-signup",
  RESEND_OTP_RESET: "/user/resend-otp-reset",

  // -------- Dashboard --------
  DASHBOARD: "/user/dashboard",

  // -------- Psychologists / Appointments --------
  LIST_PSYCHOLOGISTS: "/user/psychologists",
  PSYCHOLOGIST_DETAILS: "/user/psychologist-details",
  CHECKOUT_DATA: "/user/checkout",
  CREATE_ORDER: "/user/create-order",
  VERIFY_PAYMENT: "/user/verify-payment",

  // -------- Profile --------
  FETCH_PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",

  // -------- Sessions --------
  LIST_SESSIONS: "/user/sessions",
  CANCEL_SESSION: "/user/sessions/:sessionId",
  SESSION_ACCESS: "/user/sessions/:sessionId/access",

  // -------- Notifications --------
  LIST_NOTIFICATIONS: "/user/notifications",
  MARK_ALL_NOTIFICATIONS_READ: "/user/notifications",
  UNREAD_NOTIFICATIONS_COUNT: "/user/notifications/count",
  CLEAR_NOTIFICATIONS: "/user/notifications",

  // -------- Finance / Wallet --------
  LIST_TRANSACTIONS: "/user/transactions",
  FETCH_WALLET: "/user/wallet",
  TRANSACTION_RECEIPT: "/user/transactions/:transactionId/receipt",

  // -------- Complaints --------
  LIST_COMPLAINTS: "/user/complaints/",
  FETCH_COMPLAINT_DETAILS: "/user/complaints/:complaintId/",
  CREATE_COMPLAINT: "/user/complaints/",

  // -------- Reviews --------
  LIST_REVIEWS: "/user/reviews",
  CREATE_REVIEW: "/user/reviews",
};
