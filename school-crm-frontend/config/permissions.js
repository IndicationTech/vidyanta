// import { UserRole } from "../types";

// JS replacement for enum
export const ApiPermission = {
  // School Management
  CREATE_SCHOOL: "CREATE_SCHOOL",
  UPDATE_SCHOOL: "UPDATE_SCHOOL",
  DELETE_SCHOOL: "DELETE_SCHOOL",
  VIEW_ALL_SCHOOLS: "VIEW_ALL_SCHOOLS",

  // Student Management
  CREATE_STUDENT: "CREATE_STUDENT",
  UPDATE_STUDENT: "UPDATE_STUDENT",
  DELETE_STUDENT: "DELETE_STUDENT",
  VIEW_ALL_STUDENTS: "VIEW_ALL_STUDENTS",
  VIEW_MY_STUDENTS: "VIEW_MY_STUDENTS",
  VIEW_OWN_PROFILE: "VIEW_OWN_PROFILE",

  // Staff Management
  CREATE_STAFF: "CREATE_STAFF",
  UPDATE_STAFF: "UPDATE_STAFF",
  DELETE_STAFF: "DELETE_STAFF",
  VIEW_ALL_STAFF: "VIEW_ALL_STAFF",

  // Admissions
  CREATE_LEAD: "CREATE_LEAD",
  UPDATE_LEAD: "UPDATE_LEAD",
  DELETE_LEAD: "DELETE_LEAD",
  VIEW_LEADS: "VIEW_LEADS",

  // Academics
  CREATE_COURSE: "CREATE_COURSE",
  UPDATE_COURSE: "UPDATE_COURSE",
  DELETE_COURSE: "DELETE_COURSE",
  VIEW_COURSES: "VIEW_COURSES",
  CREATE_ASSIGNMENT: "CREATE_ASSIGNMENT",
  UPDATE_ASSIGNMENT: "UPDATE_ASSIGNMENT",
  GRADE_ASSIGNMENT: "GRADE_ASSIGNMENT",
  VIEW_ASSIGNMENTS: "VIEW_ASSIGNMENTS",
  VIEW_GRADES: "VIEW_GRADES",

  // Finance
  CREATE_FEE: "CREATE_FEE",
  UPDATE_FEE: "UPDATE_FEE",
  DELETE_FEE: "DELETE_FEE",
  VIEW_FEES: "VIEW_FEES",
  PROCESS_PAYMENT: "PROCESS_PAYMENT",
  VIEW_PAYMENTS: "VIEW_PAYMENTS",
  CREATE_PAYROLL: "CREATE_PAYROLL",
  UPDATE_PAYROLL: "UPDATE_PAYROLL",
  VIEW_PAYROLL: "VIEW_PAYROLL",
  VIEW_FINANCIAL_REPORTS: "VIEW_FINANCIAL_REPORTS",

  // Communication
  SEND_ANNOUNCEMENT: "SEND_ANNOUNCEMENT",
  VIEW_ANNOUNCEMENTS: "VIEW_ANNOUNCEMENTS",
  SEND_MESSAGE: "SEND_MESSAGE",
  VIEW_MESSAGES: "VIEW_MESSAGES",

  // Settings
  UPDATE_SYSTEM_SETTINGS: "UPDATE_SYSTEM_SETTINGS",
  UPDATE_SCHOOL_SETTINGS: "UPDATE_SCHOOL_SETTINGS",
  VIEW_SETTINGS: "VIEW_SETTINGS",
};

export const ROLE_PERMISSIONS = {
  [UserRole.SUPER_ADMIN]: [
    ApiPermission.CREATE_SCHOOL,
    ApiPermission.UPDATE_SCHOOL,
    ApiPermission.DELETE_SCHOOL,
    ApiPermission.VIEW_ALL_SCHOOLS,

    ApiPermission.CREATE_STUDENT,
    ApiPermission.UPDATE_STUDENT,
    ApiPermission.DELETE_STUDENT,
    ApiPermission.VIEW_ALL_STUDENTS,

    ApiPermission.CREATE_STAFF,
    ApiPermission.UPDATE_STAFF,
    ApiPermission.DELETE_STAFF,
    ApiPermission.VIEW_ALL_STAFF,

    ApiPermission.CREATE_LEAD,
    ApiPermission.UPDATE_LEAD,
    ApiPermission.DELETE_LEAD,
    ApiPermission.VIEW_LEADS,

    ApiPermission.CREATE_COURSE,
    ApiPermission.UPDATE_COURSE,
    ApiPermission.DELETE_COURSE,
    ApiPermission.VIEW_COURSES,

    ApiPermission.CREATE_ASSIGNMENT,
    ApiPermission.UPDATE_ASSIGNMENT,
    ApiPermission.GRADE_ASSIGNMENT,
    ApiPermission.VIEW_ASSIGNMENTS,
    ApiPermission.VIEW_GRADES,

    ApiPermission.CREATE_FEE,
    ApiPermission.UPDATE_FEE,
    ApiPermission.DELETE_FEE,
    ApiPermission.VIEW_FEES,
    ApiPermission.PROCESS_PAYMENT,
    ApiPermission.VIEW_PAYMENTS,

    ApiPermission.CREATE_PAYROLL,
    ApiPermission.UPDATE_PAYROLL,
    ApiPermission.VIEW_PAYROLL,
    ApiPermission.VIEW_FINANCIAL_REPORTS,

    ApiPermission.SEND_ANNOUNCEMENT,
    ApiPermission.VIEW_ANNOUNCEMENTS,
    ApiPermission.SEND_MESSAGE,
    ApiPermission.VIEW_MESSAGES,

    ApiPermission.UPDATE_SYSTEM_SETTINGS,
    ApiPermission.UPDATE_SCHOOL_SETTINGS,
    ApiPermission.VIEW_SETTINGS,
  ],

  [UserRole.SCHOOL_ADMIN]: [
    ApiPermission.VIEW_OWN_PROFILE,

    ApiPermission.CREATE_STUDENT,
    ApiPermission.UPDATE_STUDENT,
    ApiPermission.DELETE_STUDENT,
    ApiPermission.VIEW_ALL_STUDENTS,

    ApiPermission.CREATE_STAFF,
    ApiPermission.UPDATE_STAFF,
    ApiPermission.DELETE_STAFF,
    ApiPermission.VIEW_ALL_STAFF,

    ApiPermission.CREATE_LEAD,
    ApiPermission.UPDATE_LEAD,
    ApiPermission.DELETE_LEAD,
    ApiPermission.VIEW_LEADS,

    ApiPermission.CREATE_COURSE,
    ApiPermission.UPDATE_COURSE,
    ApiPermission.DELETE_COURSE,
    ApiPermission.VIEW_COURSES,

    ApiPermission.CREATE_ASSIGNMENT,
    ApiPermission.UPDATE_ASSIGNMENT,
    ApiPermission.GRADE_ASSIGNMENT,
    ApiPermission.VIEW_ASSIGNMENTS,
    ApiPermission.VIEW_GRADES,

    ApiPermission.CREATE_FEE,
    ApiPermission.UPDATE_FEE,
    ApiPermission.DELETE_FEE,
    ApiPermission.VIEW_FEES,
    ApiPermission.PROCESS_PAYMENT,
    ApiPermission.VIEW_PAYMENTS,

    ApiPermission.CREATE_PAYROLL,
    ApiPermission.UPDATE_PAYROLL,
    ApiPermission.VIEW_PAYROLL,
    ApiPermission.VIEW_FINANCIAL_REPORTS,

    ApiPermission.SEND_ANNOUNCEMENT,
    ApiPermission.VIEW_ANNOUNCEMENTS,
    ApiPermission.SEND_MESSAGE,
    ApiPermission.VIEW_MESSAGES,

    ApiPermission.UPDATE_SCHOOL_SETTINGS,
    ApiPermission.VIEW_SETTINGS,
  ],

  [UserRole.TEACHER]: [
    ApiPermission.VIEW_OWN_PROFILE,
    ApiPermission.VIEW_MY_STUDENTS,
    ApiPermission.VIEW_COURSES,

    ApiPermission.CREATE_ASSIGNMENT,
    ApiPermission.UPDATE_ASSIGNMENT,
    ApiPermission.GRADE_ASSIGNMENT,
    ApiPermission.VIEW_ASSIGNMENTS,
    ApiPermission.VIEW_GRADES,

    ApiPermission.VIEW_ANNOUNCEMENTS,
    ApiPermission.SEND_MESSAGE,
    ApiPermission.VIEW_MESSAGES,
  ],

  [UserRole.STUDENT]: [
    ApiPermission.VIEW_OWN_PROFILE,
    ApiPermission.VIEW_COURSES,
    ApiPermission.VIEW_ASSIGNMENTS,
    ApiPermission.VIEW_GRADES,

    ApiPermission.VIEW_FEES,
    ApiPermission.VIEW_PAYMENTS,

    ApiPermission.VIEW_ANNOUNCEMENTS,
    ApiPermission.SEND_MESSAGE,
    ApiPermission.VIEW_MESSAGES,
  ],

  [UserRole.PARENT]: [
    ApiPermission.VIEW_OWN_PROFILE,
    ApiPermission.VIEW_COURSES,
    ApiPermission.VIEW_ASSIGNMENTS,
    ApiPermission.VIEW_GRADES,

    ApiPermission.VIEW_FEES,
    ApiPermission.PROCESS_PAYMENT,
    ApiPermission.VIEW_PAYMENTS,

    ApiPermission.VIEW_ANNOUNCEMENTS,
    ApiPermission.SEND_MESSAGE,
    ApiPermission.VIEW_MESSAGES,
  ],

  [UserRole.ACCOUNTS_HR]: [
    ApiPermission.VIEW_OWN_PROFILE,
    ApiPermission.VIEW_ALL_STUDENTS,
    ApiPermission.VIEW_ALL_STAFF,

    ApiPermission.CREATE_FEE,
    ApiPermission.UPDATE_FEE,
    ApiPermission.VIEW_FEES,
    ApiPermission.PROCESS_PAYMENT,
    ApiPermission.VIEW_PAYMENTS,

    ApiPermission.CREATE_PAYROLL,
    ApiPermission.UPDATE_PAYROLL,
    ApiPermission.VIEW_PAYROLL,
    ApiPermission.VIEW_FINANCIAL_REPORTS,

    ApiPermission.VIEW_ANNOUNCEMENTS,
    ApiPermission.SEND_MESSAGE,
    ApiPermission.VIEW_MESSAGES,
  ],
};

export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

export const checkPermission = (role, permission) => {
  if (!hasPermission(role, permission)) {
    throw new Error(
      `Access denied: ${role} does not have permission ${permission}`
    );
  }
};
