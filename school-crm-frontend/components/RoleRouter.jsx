import React from "react";
import { UserRole } from "../types";
import {
  getRoutesForRole,
  isRouteAllowed,
  getDefaultRouteForRole,
} from "../config/routes";

// Import all dashboards
import SuperAdminDashboard from "../pages/dashboards/SuperAdminDashboard";
import SchoolAdminDashboard from "../pages/dashboards/SchoolAdminDashboard";
import TeacherDashboard from "../pages/dashboards/TeacherDashboard";
import StudentDashboard from "../pages/dashboards/StudentDashboard";
import ParentDashboard from "../pages/dashboards/ParentDashboard";
import AccountsDashboard from "../pages/dashboards/AccountsDashboard";
import HRDashboard from "../pages/dashboards/HRDashboard";

// Import other pages
import Admissions from "../pages/Admissions";
import Academics from "../pages/Academics";
import Communication from "../pages/Communication";
import Students from "../pages/Students";
import Staff from "../pages/Staff";
import Finance from "../pages/Finance";
import ManageSchools from "../pages/ManageSchools";
import SchoolAdminSyllabus from "../pages/SchoolAdminSyllabus";
import Children from "../pages/student/Children";
import Fees from "../pages/student/Fees";

// Import Teacher pages
import AttendanceManagement from "../pages/teacher/AttendanceManagement";
import SyllabusManagement from "../pages/teacher/SyllabusManagement";
import StudentPerformance from "../pages/teacher/StudentPerformance";
import MarksManagement from "../pages/teacher/MarksManagement";
import CalendarEvents from "../pages/teacher/CalendarEvents";
import LeaveManagement from "../pages/teacher/LeaveManagement";
import ProfileManagement from "../pages/teacher/ProfileManagement";
import PayrollView from "../pages/teacher/PayrollView";

// Import Student pages
import EditProfile from "../pages/student/EditProfile";

import { Settings } from "lucide-react";

const RoleRouter = ({ role, currentPath, onNavigate }) => {
  // Check if route is allowed for this role
  if (!isRouteAllowed(currentPath, role)) {
    const defaultRoute = getDefaultRouteForRole(role);
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
        <Settings size={64} className="mb-4 opacity-20" />
        <h3 className="text-xl font-bold">Access Denied</h3>
        <p>You don't have permission to access this page.</p>
        <p className="text-sm mt-2">Redirecting to your dashboard...</p>
      </div>
    );
  }

  // Route to appropriate component based on path
  if (currentPath.includes("/dashboard")) {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <SuperAdminDashboard />;
      case UserRole.SCHOOL_ADMIN:
        return <SchoolAdminDashboard />;
      case UserRole.TEACHER:
        return <TeacherDashboard />;
      case UserRole.STUDENT:
        return <StudentDashboard onNavigate={onNavigate} />;
      case UserRole.PARENT:
        return <ParentDashboard />;
      case UserRole.ACCOUNTS_HR:
        if (currentPath.includes("/hr/")) {
          return <HRDashboard />;
        }
        return <AccountsDashboard />;
      default:
        return <div>Unknown role</div>;
    }
  }

  // Common pages based on path
  if (currentPath.includes("/students")) {
    return <Students />;
  }
  if (currentPath.includes("/staff")) {
    return <Staff />;
  }
  if (currentPath.includes("/syllabus")) {
    if (role === UserRole.SCHOOL_ADMIN || role === UserRole.SUPER_ADMIN) {
      return <SchoolAdminSyllabus />;
    }
    if (role === UserRole.TEACHER) {
      return <SyllabusManagement />;
    }
  }
  if (currentPath.includes("/finance") || currentPath.includes("/fees")) {
    if (role === UserRole.PARENT || role === UserRole.STUDENT) {
      return <Fees />;
    }
    return <Finance />;
  }
  if (currentPath.includes("/admissions")) {
    return <Admissions />;
  }
  if (currentPath.includes("/academics")) {
    return <Academics />;
  }
  if (currentPath.includes("/communication")) {
    return <Communication />;
  }
  if (currentPath.includes("/schools") && role === UserRole.SUPER_ADMIN) {
    return <ManageSchools />;
  }
  if (currentPath.includes("/children") && role === UserRole.PARENT) {
    return <Children />;
  }

  // Route Teacher-specific pages
  if (role === UserRole.TEACHER) {
    if (currentPath.includes("/attendance")) return <AttendanceManagement />;
    if (currentPath.includes("/syllabus")) return <SyllabusManagement />;
    if (currentPath.includes("/performance")) return <StudentPerformance />;
    if (currentPath.includes("/marks")) return <MarksManagement />;
    if (currentPath.includes("/calendar")) return <CalendarEvents />;
    if (currentPath.includes("/leave")) return <LeaveManagement />;
    if (currentPath.includes("/profile")) return <ProfileManagement />;
    if (currentPath.includes("/payroll")) return <PayrollView />;
  }

  // Route Student-specific pages
  if (role === UserRole.STUDENT) {
    if (currentPath.includes("/profile")) return <EditProfile />;
  }

  // Default fallback
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-slate-400">
      <Settings size={64} className="mb-4 opacity-20" />
      <h3 className="text-xl font-bold">Page Under Construction</h3>
      <p>We are building this module for you.</p>
    </div>
  );
};

export default RoleRouter;
