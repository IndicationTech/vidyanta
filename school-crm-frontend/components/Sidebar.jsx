import React from "react";
// import { UserRole } from "../types";
import {
  LayoutDashboard,
  GraduationCap,
  UserSquare2,
  Calendar,
  Wallet,
  MessageSquare,
  Settings,
  LogOut,
  Target,
} from "lucide-react";

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: Object.values(UserRole),
    },
    {
      id: "admissions",
      label: "Admission CRM",
      icon: Target,
      roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN],
    },
    {
      id: "students",
      label: "Students",
      icon: GraduationCap,
      roles: [
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.TEACHER,
        UserRole.ACCOUNTS_HR,
      ],
    },
    {
      id: "staff",
      label: "Staff & Teachers",
      icon: UserSquare2,
      roles: [
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.ACCOUNTS_HR,
      ],
    },
    {
      id: "academics",
      label: "Academics",
      icon: Calendar,
      roles: [
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.TEACHER,
        UserRole.STUDENT,
      ],
    },
    {
      id: "finance",
      label: "Fees & Payroll",
      icon: Wallet,
      roles: [
        UserRole.SUPER_ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.ACCOUNTS_HR,
      ],
    },
    {
      id: "communication",
      label: "Communication",
      icon: MessageSquare,
      roles: Object.values(UserRole),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      roles: [UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN],
    },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(role));

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col">
      <div>
        <img src="/assets/vidyanta-removebg.png" alt="logo" className="w-26" />
        <p className="text-slate-400 text-xs mx-5">AI-Powered School ERP</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
