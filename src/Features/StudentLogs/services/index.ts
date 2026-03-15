export {
  approveStudentLog,
  createStudentLog,
  getStudentLogByStudentAndActivity,
  getStudentLogsByActivityId,
  getStudentLogsByStudentId,
  getStudentLogsWithActivities,
  getStudentLogsWithHierarchy,
  submitStudentLog,
  updateStudentLog,
} from "./student-log.service";
export type {
  StudentLogWithActivity,
  StudentLogWithHierarchy,
} from "./student-log.service";
