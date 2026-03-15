import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Calendar,
  BookOpen,
  MessageSquare,
  Building2,
  LogOut,
  Trophy,
  PieChart,
} from "lucide-react";

const StudentSidebar = ({
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
    { id: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/student/academics", label: "Academics", icon: BookOpen },
    { id: "/student/profile", label: "My Profile", icon: User },
    { id: "/student/communication", label: "Messages", icon: MessageSquare },
  ];

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div
      className={`bg-slate-900 h-screen flex flex-col transition-all duration-300 w-full`}
    >
      <div
        className="p-4 cursor-pointer transition-all duration-300"
        onClick={toggleSidebar}
      >
        <img
          src="/assets/vidyanta-removebg.png"
          alt="Vidyanta"
          className={`w-auto transition-all duration-300 ease-in-out
            ${isSidebarCollapsed ? "h-10 mx-auto" : "h-14 ml-2"}`}
        />
        {!isSidebarCollapsed && (
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-4">
            Student Portal
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
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
              title={isSidebarCollapsed ? item.label : ""}
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

      {!isSidebarCollapsed && (
        <div className="m-4 p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Trophy size={14} />
            <p className="text-[10px] font-bold uppercase tracking-wider">
              Achievements
            </p>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            You've completed 100% of this week's assignments!
          </p>
        </div>
      )}

      <div className="p-4 border-t border-slate-800/50">
        <div
          className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
            {userName ? userName[0] : "S"}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">
                {userName || "Student"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
