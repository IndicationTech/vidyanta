import React from "react";
import { UserRole } from "../types";
import SuperAdminSidebar from "./sidebars/SuperAdminSidebar";
import SchoolAdminSidebar from "./sidebars/SchoolAdminSidebar";
import TeacherSidebar from "./sidebars/TeacherSidebar";
import StudentSidebar from "./sidebars/StudentSidebar";
import ParentSidebar from "./sidebars/ParentSidebar";
import AccountsSidebar from "./sidebars/AccountsSidebar";
import HRSidebar from "./sidebars/HRSidebar";

const RoleSidebar = ({ role, activeTab, setActiveTab }) => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return (
        <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      );
    case UserRole.SCHOOL_ADMIN:
      return (
        <SchoolAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      );
    case UserRole.TEACHER:
      return (
        <TeacherSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      );
    case UserRole.STUDENT:
      return (
        <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      );
    case UserRole.PARENT:
      return (
        <ParentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      );
    case UserRole.ACCOUNTS_HR:
      if (activeTab.includes("/hr/")) {
        return <HRSidebar activeTab={activeTab} setActiveTab={setActiveTab} />;
      }
      return (
        <AccountsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      );
    default:
      return <div>Unknown role</div>;
  }
};

export default RoleSidebar;
