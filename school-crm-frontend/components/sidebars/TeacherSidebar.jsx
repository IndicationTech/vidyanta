import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  BookOpen,
  TrendingUp,
  FileText,
  Clock,
  MessageSquare,
  Building2,
  Settings,
  LogOut,
  UserCheck,
  User,
} from "lucide-react";

const TeacherSidebar = ({
  activeTab,
  setActiveTab,
  isSidebarCollapsed,
  setIsSidebarCollapsed,
}) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get the logged-in user's name from localStorage
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const menuItems = [
    { id: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/teacher/attendance", label: "Attendance", icon: UserCheck },
    { id: "/teacher/syllabus", label: "Syllabus", icon: BookOpen },
    { id: "/teacher/performance", label: "Performance", icon: TrendingUp },
    { id: "/teacher/marks", label: "Marks Entry", icon: FileText },
    { id: "/teacher/calendar", label: "Calendar", icon: Calendar },
    { id: "/teacher/communication", label: "Messages", icon: MessageSquare },
    { id: "/teacher/leave", label: "My Leave", icon: Clock },
    { id: "/teacher/profile", label: "My Profile", icon: User },
  ];

  return (
    <div
      className={`h-screen flex flex-col bg-slate-900 transition-all duration-300 w-full`}
    >
      {/* LOGO */}
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
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-4">
            Teacher Portal
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
            {userName ? userName[0] : "T"}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">
                {userName || "Teacher"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSidebar;
