export const ROUTE_BASE = {
  ROOT: "/",
  ACCOUNT: "account",
  LOGIN: "login",
  HOME: "home",
  STUDENT_DASHBOARD: "student-dashboard",
  EDUCATOR_DASHBOARD: "educator-dashboard",
  LEARNING_MODULES: "learning-modules",
  LEARNING_MODULE_EDITOR: "learning-module-editor",
  USERS: "users",
  STUDENT_SUBMISSIONS: "student-submissions",
  NOT_FOUND: "*",
} as const;

export const ROUTES = {
  LOGIN: `/${ROUTE_BASE.ACCOUNT}/${ROUTE_BASE.LOGIN}`,
  HOME: `/${ROUTE_BASE.STUDENT_DASHBOARD}`,
  STUDENT_DASHBOARD: `/${ROUTE_BASE.STUDENT_DASHBOARD}`,
  EDUCATOR_DASHBOARD: `/${ROUTE_BASE.EDUCATOR_DASHBOARD}`,
  LEARNING_MODULES: `/${ROUTE_BASE.LEARNING_MODULES}`,
  LEARNING_MODULE_EDITOR: `/${ROUTE_BASE.LEARNING_MODULE_EDITOR}`,
  USERS: `/${ROUTE_BASE.USERS}`,
  STUDENT_SUBMISSIONS: `/${ROUTE_BASE.STUDENT_SUBMISSIONS}`,
} as const;

export function studentSubmissionsPath(studentId: string): string {
  return `/${ROUTE_BASE.STUDENT_SUBMISSIONS}/${studentId}`;
}
