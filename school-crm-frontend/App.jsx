import React, { useState, useEffect } from "react";
// import { UserRole } from "./types";
import RoleSidebar from "./components/RoleSidebar";
import RoleRouter from "./components/RoleRouter";
import { getDefaultRouteForRole } from "./config/routes";
import { User, Bell, Search, Sparkles, LogOut } from "lucide-react";
import EduNexusAI from "./components/EduNexusAI";
import Login from "./pages/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [activeRole, setActiveRole] = useState(
    localStorage.getItem("userRole") || UserRole.SUPER_ADMIN
  );
  const [currentPath, setCurrentPath] = useState(
    getDefaultRouteForRole(
      localStorage.getItem("userRole") || UserRole.SUPER_ADMIN
    )
  );
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  // Update path when role changes
  useEffect(() => {
    const defaultRoute = getDefaultRouteForRole(activeRole);
    setCurrentPath(defaultRoute);
  }, [activeRole]);

  const handleLogin = (role) => {
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const handleRoleChange = (newRole) => {
    setActiveRole(newRole);
    setIsRoleSwitcherOpen(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <RoleSidebar
        role={activeRole}
        activeTab={currentPath}
        setActiveTab={setCurrentPath}
      />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md py-4">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search students, staff, or records..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-4">
            {/* Demo Role Switcher */}
            {/* <div className="relative">
              <button
                onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  <User size={18} />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    {activeRole.replace("_", " ")}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Switch View
                  </p>
                </div>
              </button>

              {isRoleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                  {Object.values(UserRole).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        activeRole === role
                          ? "bg-indigo-50 text-indigo-600"
                          : "hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      {role.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            <button
              onClick={handleLogout}
              className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>

            <button className="relative w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="max-w-7xl mx-auto">
          <RoleRouter
            role={activeRole}
            currentPath={currentPath}
            onNavigate={setCurrentPath}
          />
        </div>
      </main>

      {/* Floating AI Helper */}
      <div className="fixed bottom-8 right-8">
        <EduNexusAI role={activeRole} />
      </div>
    </div>
  );
};

export default App;
