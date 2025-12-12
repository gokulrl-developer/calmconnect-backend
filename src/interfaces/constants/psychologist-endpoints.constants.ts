export const PSYCH_ROUTES = {
  // -------- Auth --------
  SIGN_UP: "/psychologist/sign-up",
  REGISTER: "/psychologist/register",
  LOGIN: "/psychologist/login",
  SOCIAL_LOGIN: "/psychologist/social",
  FORGOT_PASSWORD: "/psychologist/forgot-password",
  RESET_PASSWORD: "/psychologist/reset-password",
  RESEND_OTP_SIGNUP: "/psychologist/resend-otp-signup",
  RESEND_OTP_RESET: "/psychologist/resend-otp-reset",

  // -------- Dashboard --------
  DASHBOARD: "/psychologist/dashboard",

  // -------- Application --------
  GET_APPLICATION: "/psychologist/application",
  CREATE_APPLICATION: "/psychologist/apply",

  // -------- Profile --------
  FETCH_PROFILE: "/psychologist/profile",
  UPDATE_PROFILE: "/psychologist/profile",

  // -------- Sessions --------
  LIST_SESSIONS: "/psychologist/sessions",
  CANCEL_SESSION: "/psychologist/sessions/:sessionId",
  SESSION_ACCESS: "/psychologist/sessions/:sessionId/access",

  // -------- Availability Rules --------
  CREATE_AVAILABILITY_RULE: "/psychologist/availability-rule",
  EDIT_AVAILABILITY_RULE: "/psychologist/availability-rule/:availabilityRuleId",
  DELETE_AVAILABILITY_RULE:
    "/psychologist/availability-rule/:availabilityRuleId",
  FETCH_AVAILABILITY_RULE: "/psychologist/availability-rule",
  LIST_AVAILABILITY_RULES: "/psychologist/availability-rules",

  // -------- Special Day --------
  CREATE_SPECIAL_DAY: "/psychologist/special-day",
  EDIT_SPECIAL_DAY: "/psychologist/special-day/:specialDayId",
  DELETE_SPECIAL_DAY: "/psychologist/special-day/:specialDayId",

  // -------- Quick Slots --------
  CREATE_QUICK_SLOT: "/psychologist/quick-slot",
  EDIT_QUICK_SLOT: "/psychologist/quick-slot/:quickSlotId",
  DELETE_QUICK_SLOT: "/psychologist/quick-slot/:quickSlotId",

  // -------- Daily Availability --------
  FETCH_DAILY_AVAILABILITY: "/psychologist/daily-availability",

  // -------- Notifications --------
  FETCH_NOTIFICATIONS: "/psychologist/notifications",
  MARK_NOTIFICATIONS_READ: "/psychologist/notifications",
  CLEAR_NOTIFICATIONS: "/psychologist/notifications/clear",
  UNREAD_NOTIFICATIONS_COUNT: "/psychologist/notifications/count",

  // -------- Finance / Wallet / Transactions --------
  TRANSACTION_LIST: "/psychologist/transactions",
  TRANSACTION_RECEIPT: "/psychologist/transactions/:transactionId/receipt",
  WALLET: "/psychologist/wallet",
} as const;
