import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  UserSquare2,
  Calendar,
  Wallet,
  MessageSquare,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";

const SchoolAdminSidebar = ({ activeTab, setActiveTab }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  const menuItems = [
    {
      id: "/school-admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { id: "/school-admin/admissions", label: "Admission CRM", icon: Target },
    { id: "/school-admin/students", label: "Students", icon: GraduationCap },
    { id: "/school-admin/staff", label: "Staff & Teachers", icon: UserSquare2 },
    { id: "/school-admin/academics", label: "Academics", icon: Calendar },
    { id: "/school-admin/finance", label: "Fees & Payroll", icon: Wallet },
    {
      id: "/school-admin/communication",
      label: "Communication",
      icon: MessageSquare,
    },
    { id: "/school-admin/settings", label: "School Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-2">
        <img
          src="/assets/vidyanta-removebg.png"
          alt="Vidyanta"
          className="h-42 w-auto"
        />
        <p className="text-slate-500 text-lg ml-6 font-bold uppercase tracking-widest">
          School Admin
        </p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
        {menuItems.map((item) => {
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

      <div className="p-4 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
          {userName || "School Admin"}
        </p>
      </div>
    </div>
  );
};

export default SchoolAdminSidebar;
