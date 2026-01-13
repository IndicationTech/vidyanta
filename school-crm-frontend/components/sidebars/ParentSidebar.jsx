import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Wallet,
  MessageSquare,
  Building2,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";

const ParentSidebar = ({ activeTab, setActiveTab }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  const menuItems = [
    { id: "/parent/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "/parent/children", label: "My Children", icon: Users },
    { id: "/parent/academics", label: "Academics", icon: Calendar },
    { id: "/parent/fees", label: "Fee Payments", icon: Wallet },
    {
      id: "/parent/communication",
      label: "Communication",
      icon: MessageSquare,
    },
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
          Parent Portal
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

      <div className="m-4 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
        <div className="flex items-center gap-2 text-indigo-400 mb-2">
          <Sparkles size={14} />
          <p className="text-[10px] font-bold uppercase tracking-wider">
            AI Assistant
          </p>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Aarav's math score improved by 12% this week!
        </p>
      </div>

      <div className="p-4 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
          {userName || "Parent"}
        </p>
      </div>
    </div>
  );
};

export default ParentSidebar;
