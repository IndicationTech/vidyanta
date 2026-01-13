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

const TeacherSidebar = ({ activeTab, setActiveTab }) => {
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
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-2">
        <img
          src="/assets/vidyanta-removebg.png"
          alt="Vidyanta"
          className="h-42 w-auto"
        />
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
          Teacher Portal
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
          {userName || "Teacher"}
        </p>
      </div>
    </div>
  );
};

export default TeacherSidebar;
