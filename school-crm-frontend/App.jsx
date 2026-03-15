import React, { useState, useEffect } from "react";
import { UserRole } from "./types";
import RoleSidebar from "./components/RoleSidebar";
import RoleRouter from "./components/RoleRouter";
import { getDefaultRouteForRole } from "./config/routes";
import { User, Bell, LogOut, Menu, X } from "lucide-react";
import EduNexusAI from "./components/EduNexusAI";
import Login from "./pages/Login";

const App = () => {
  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });
  const [activeRole, setActiveRole] = useState(() => {
    return localStorage.getItem("userRole") || UserRole.STUDENT;
  });
  const [currentPath, setCurrentPath] = useState("/student/dashboard");

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // NEW: sidebar toggle for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Sidebar collapse state for desktop
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR (Desktop fixed + Mobile drawer) */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50
          bg-white border-r border-slate-200
          transform transition-transform duration-300
          translate-x-0
          ${isSidebarCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <p className="font-bold text-slate-800">Menu</p>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <RoleSidebar
          role={activeRole}
          activeTab={currentPath}
          setActiveTab={(path) => {
            setCurrentPath(path);
            setIsSidebarOpen(false); // close drawer after click on mobile
          }}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`lg:pl-${isSidebarCollapsed ? "20" : "64"} transition-all duration-300`}
      >
        <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-6 sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md py-4">
            {/* Left Side: Mobile Menu Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100"
              >
                <Menu size={20} />
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 relative">
              {/* Notification */}
              <button className="relative w-10 h-10 sm:w-11 sm:h-11 bg-white border cursor-pointer border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                >
                  <User size={20} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg shadow-slate-200 border border-slate-100 py-2 z-50">
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <User size={16} className="text-indigo-600" />
                      My Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <LogOut size={16} className="text-red-600" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="w-full max-w-7xl mx-auto">
            <RoleRouter
              role={activeRole}
              currentPath={currentPath}
              onNavigate={setCurrentPath}
            />
          </div>
        </main>
      </div>

      {/* Floating AI Helper */}
      <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40">
        <EduNexusAI role={activeRole} />
      </div>
    </div>
  );
};

export default App;
