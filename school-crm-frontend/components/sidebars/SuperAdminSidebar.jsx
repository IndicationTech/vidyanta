import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Target,
  GraduationCap,
  UserSquare2,
  Calendar,
  Wallet,
  MessageSquare,
  Settings,
  LogOut,
  BookOpen,
} from "lucide-react";

const SuperAdminSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  const menuItems = [
    { id: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/super-admin/schools", label: "Manage Schools", icon: Building2 },
    { id: "/super-admin/admissions", label: "Admission CRM", icon: Target },
    { id: "/super-admin/students", label: "All Students", icon: GraduationCap },
    { id: "/super-admin/staff", label: "All Staff", icon: UserSquare2 },
    { id: "/super-admin/syllabus", label: "Syllabus", icon: BookOpen },
    { id: "/super-admin/academics", label: "Academics", icon: Calendar },
    { id: "/super-admin/finance", label: "Finance Overview", icon: Wallet },
    {
      id: "/super-admin/communication",
      label: "Communication",
      icon: MessageSquare,
    },
    { id: "/super-admin/settings", label: "System Settings", icon: Settings },
  ];

  return (
    <div
      className={`h-screen flex flex-col bg-slate-900 transition-all duration-300 w-full`}
    >
      <div
        className="p-4 cursor-pointer transition-all duration-300"
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <img
          src="/assets/vidyanta-removebg.png"
          alt="Vidyanta"
          className={`w-auto transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? "h-10 mx-auto" : "h-14 ml-2"}`}
        />

        {!isSidebarCollapsed && (
          <p className="text-slate-500 text-xs ml-4 mt-2 font-bold uppercase tracking-[0.2em] transition-opacity duration-200">
            Super Admin
          </p>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isSidebarCollapsed ? item.label : ""}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <div className="shrink-0">
                <Icon size={22} />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-sm whitespace-nowrap overflow-hidden">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50">
        <div
          className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
            {userName ? userName[0] : "SA"}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">
                {userName || "Super Admin"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
