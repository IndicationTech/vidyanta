import { UserRole } from "../types";

export const ROUTES = [
  // Super Admin Routes
  {
    path: "/super-admin/dashboard",
    label: "Dashboard",
    component: "SuperAdminDashboard",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/schools",
    label: "Manage Schools",
    component: "ManageSchools",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/admissions",
    label: "Admission CRM",
    component: "Admissions",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/students",
    label: "All Students",
    component: "Students",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/staff",
    label: "All Staff",
    component: "Staff",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/syllabus",
    label: "Syllabus",
    component: "SchoolAdminSyllabus",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/academics",
    label: "Academics",
    component: "Academics",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/finance",
    label: "Finance Overview",
    component: "Finance",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/communication",
    label: "Communication",
    component: "Communication",
    roles: [UserRole.SUPER_ADMIN],
  },
  {
    path: "/super-admin/settings",
    label: "System Settings",
    component: "Settings",
    roles: [UserRole.SUPER_ADMIN],
  },

  // School Admin Routes
  {
    path: "/school-admin/dashboard",
    label: "Dashboard",
    component: "SchoolAdminDashboard",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/admissions",
    label: "Admission CRM",
    component: "Admissions",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/students",
    label: "Students",
    component: "Students",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/staff",
    label: "Staff & Teachers",
    component: "Staff",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/syllabus",
    label: "Syllabus",
    component: "SchoolAdminSyllabus",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/academics",
    label: "Academics",
    component: "Academics",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/finance",
    label: "Fees & Payroll",
    component: "Finance",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/communication",
    label: "Communication",
    component: "Communication",
    roles: [UserRole.SCHOOL_ADMIN],
  },
  {
    path: "/school-admin/settings",
    label: "School Settings",
    component: "Settings",
    roles: [UserRole.SCHOOL_ADMIN],
  },

  // Teacher Routes
  {
    path: "/teacher/dashboard",
    label: "Dashboard",
    component: "TeacherDashboard",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/attendance",
    label: "Attendance Management",
    component: "AttendanceManagement",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/syllabus",
    label: "Syllabus & Lesson Plan",
    component: "SyllabusManagement",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/performance",
    label: "Student Performance",
    component: "StudentPerformance",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/marks",
    label: "Marks Management",
    component: "MarksManagement",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/calendar",
    label: "Calendar & Events",
    component: "CalendarEvents",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/leave",
    label: "Leave Management",
    component: "LeaveManagement",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/profile",
    label: "Profile Management",
    component: "ProfileManagement",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/payroll",
    label: "Payroll (Read-Only)",
    component: "PayrollView",
    roles: [UserRole.TEACHER],
  },
  {
    path: "/teacher/communication",
    label: "Communication",
    component: "Communication",
    roles: [UserRole.TEACHER],
  },

  // Student Routes
  {
    path: "/student/dashboard",
    label: "Dashboard",
    component: "StudentDashboard",
    roles: [UserRole.STUDENT],
  },
  {
    path: "/student/profile",
    label: "Edit Profile",
    component: "EditProfile",
    roles: [UserRole.STUDENT],
  },
  {
    path: "/student/academics",
    label: "My Academics",
    component: "Academics",
    roles: [UserRole.STUDENT],
  },
  {
    path: "/student/communication",
    label: "Communication",
    component: "Communication",
    roles: [UserRole.STUDENT],
  },

  // Parent Routes
  {
    path: "/parent/dashboard",
    label: "Dashboard",
    component: "ParentDashboard",
    roles: [UserRole.PARENT],
  },
  {
    path: "/parent/children",
    label: "My Children",
    component: "Children",
    roles: [UserRole.PARENT],
  },
  {
    path: "/parent/academics",
    label: "Academics",
    component: "Academics",
    roles: [UserRole.PARENT],
  },
  {
    path: "/parent/fees",
    label: "Fee Payments",
    component: "Fees",
    roles: [UserRole.PARENT],
  },
  {
    path: "/parent/communication",
    label: "Communication",
    component: "Communication",
    roles: [UserRole.PARENT],
  },

  // Accounts Routes
  {
    path: "/accounts/dashboard",
    label: "Dashboard",
    component: "AccountsDashboard",
    roles: [UserRole.ACCOUNTS_HR],
  },
  {
    path: "/accounts/students",
    label: "Students",
    component: "Students",
    roles: [UserRole.ACCOUNTS_HR],
  },
  {
    path: "/accounts/staff",
    label: "Staff & Teachers",
    component: "Staff",
    roles: [UserRole.ACCOUNTS_HR],
  },
  {
    path: "/accounts/finance",
    label: "Fees & Payroll",
    component: "Finance",
    roles: [UserRole.ACCOUNTS_HR],
  },
  {
    path: "/accounts/communication",
    label: "Communication",
    component: "Communication",
    roles: [UserRole.ACCOUNTS_HR],
  },

  // HR Routes (if separate from Accounts)
  {
    path: "/hr/dashboard",
    label: "Dashboard",
    component: "HRDashboard",
    roles: [UserRole.ACCOUNTS_HR],
  },
  {
    path: "/hr/staff",
    label: "Staff Management",
    component: "Staff",
    roles: [UserRole.ACCOUNTS_HR],
  },
  {
    path: "/hr/payroll",
    label: "Payroll",
    component: "Payroll",
    roles: [UserRole.ACCOUNTS_HR],
  },
  {
    path: "/hr/communication",
    label: "Communication",
    component: "Communication",
    roles: [UserRole.ACCOUNTS_HR],
  },
];

export const getRoutesForRole = (role) => {
  return ROUTES.filter((route) => route.roles.includes(role));
};

export const getDefaultRouteForRole = (role) => {
  const routes = getRoutesForRole(role);
  const dashboardRoute = routes.find((r) => r.path.includes("/dashboard"));
  return dashboardRoute?.path || routes[0]?.path || "/";
};

export const isRouteAllowed = (path, role) => {
  const route = ROUTES.find((r) => r.path === path);
  return route ? route.roles.includes(role) : false;
};
