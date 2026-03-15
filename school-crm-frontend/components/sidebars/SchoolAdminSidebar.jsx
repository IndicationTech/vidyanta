// import React, { useState, useEffect } from "react";
// import {
//   LayoutDashboard,
//   Target,
//   GraduationCap,
//   UserSquare2,
//   Calendar,
//   Wallet,
//   MessageSquare,
//   Settings,
//   LogOut,
//   Building2,
//   BookOpen,
// } from "lucide-react";

// const SchoolAdminSidebar = ({ activeTab, setActiveTab }) => {
//   const [userName, setUserName] = useState("");

//   useEffect(() => {
//     const storedName = localStorage.getItem("userName");
//     if (storedName) {
//       setUserName(storedName);
//     }
//   }, []);

//   const menuItems = [
//     {
//       id: "/school-admin/dashboard",
//       label: "Dashboard",
//       icon: LayoutDashboard,
//     },
//     { id: "/school-admin/admissions", label: "Admission CRM", icon: Target },
//     { id: "/school-admin/students", label: "Students", icon: GraduationCap },
//     { id: "/school-admin/staff", label: "Staff & Teachers", icon: UserSquare2 },
//     { id: "/school-admin/syllabus", label: "Syllabus", icon: BookOpen },
//     { id: "/school-admin/academics", label: "Academics", icon: Calendar },
//     { id: "/school-admin/finance", label: "Fees & Payroll", icon: Wallet },
//     {
//       id: "/school-admin/communication",
//       label: "Communication",
//       icon: MessageSquare,
//     },
//     { id: "/school-admin/settings", label: "School Settings", icon: Settings },
//   ];

//   return (
//     <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col">
//       <div className="p-2">
//         <img
//           src="/assets/vidyanta-removebg.png"
//           alt="Vidyanta"
//           className="h-42 w-auto"
//         />
//         <p className="text-slate-500 text-lg ml-6 font-bold uppercase tracking-widest">
//           School Admin
//         </p>
//       </div>

//       <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
//         {menuItems.map((item) => {
//           const Icon = item.icon;
//           const isActive = activeTab === item.id;
//           return (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
//                 isActive
//                   ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
//                   : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
//               }`}
//             >
//               <Icon size={20} />
//               <span className="font-medium text-sm">{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-slate-800 text-center">
//         <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
//           {userName || "School Admin"}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SchoolAdminSidebar;

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
  BookOpen,
} from "lucide-react";

const SchoolAdminSidebar = ({
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
    {
      id: "/school-admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { id: "/school-admin/admissions", label: "Admission CRM", icon: Target },
    { id: "/school-admin/students", label: "Students", icon: GraduationCap },
    { id: "/school-admin/staff", label: "Staff & Teachers", icon: UserSquare2 },
    { id: "/school-admin/syllabus", label: "Syllabus", icon: BookOpen },
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
    <div
      className={`h-screen flex flex-col bg-slate-900 transition-all duration-300 w-full`}
    >
      {/* LOGO — SAME IMAGE, ANIMATED SIZE */}
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
            School Admin
          </p>
        )}
      </div>

      {/* MENU */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isSidebarCollapsed ? item.label : ""}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
            >
              <div className="shrink-0">
                <Icon size={22} />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-800/50">
        <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold text-xs shrink-0">
            {userName ? userName[0] : "A"}
          </div>
          {!isSidebarCollapsed && (
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">
                {userName || "School Admin"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchoolAdminSidebar;
