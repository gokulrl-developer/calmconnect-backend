export const ADMIN_ROUTES = {
  // -------- Auth --------
  LOGIN: "/admin/login",

  // -------- Applications --------
  FETCH_APPLICATIONS: "/admin/applications",
  APPLICATION_DETAILS: "/admin/application/:id",
  UPDATE_APPLICATION: "/admin/application/:id",

  // -------- Users --------
  FETCH_USERS: "/admin/users",
  USER_DETAILS: "/admin/user-details/:userId",
  UPDATE_USER_STATUS: "/admin/user/:id",

  // -------- Psychologists --------
  FETCH_PSYCHOLOGISTS: "/admin/psychologists",
  PSYCH_DETAILS: "/admin/psychologist-details/:psychId",
  UPDATE_PSYCH_STATUS: "/admin/psychologist/:id",

  // -------- Sessions --------
  SESSION_LISTING: "/admin/sessions",

  // -------- Notifications --------
  FETCH_NOTIFICATIONS: "/admin/notifications",
  MARK_NOTIFICATIONS_READ: "/admin/notifications",
  CLEAR_NOTIFICATIONS: "/admin/notifications",
  UNREAD_NOTIFICATIONS_COUNT: "/admin/notifications/count",

  // -------- Transactions / Wallet --------
  TRANSACTIONS: "/admin/transactions",
  TRANSACTION_RECEIPT: "/admin/transactions/:transactionId/receipt",
  WALLET: "/admin/wallet",

  // -------- Complaints --------
  LIST_COMPLAINTS: "/admin/complaints",
  COMPLAINT_DETAILS: "/admin/complaints/:complaintId",
  COMPLAINT_HISTORY: "/admin/complaints",
  RESOLVE_COMPLAINT: "/admin/complaints/:complaintId",

  // -------- Dashboard --------
  DASHBOARD_REVENUE: "/admin/dashboard/revenue",
  DASHBOARD_CLIENTS: "/admin/dashboard/clients",
  DASHBOARD_SESSIONS: "/admin/dashboard/sessions",
  DASHBOARD_TOP_PSYCHOLOGISTS: "/admin/dashboard/top-psychologists",
  DASHBOARD_SUMMARY_CARDS: "/admin/dashboard/summary-cards",
} as const;
