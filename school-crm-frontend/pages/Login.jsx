import React, { useState } from "react";
import { Lock, School, LogIn, Mail } from "lucide-react";
import { login } from "../api/authApi";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);

      if (response.data.success) {
        // Save auth data to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user._id);
        localStorage.setItem("userName", response.data.user.name);
        localStorage.setItem("userEmail", response.data.user.email);
        localStorage.setItem("userRole", response.data.user.role);

        console.log("Login successful, token saved");

        // Call the onLogin callback to update app state
        onLogin(response.data.user.role);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setError(
        error.response?.data?.message ||
          "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <School size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 leading-none">
              Vidyanta
            </h1>
            <p className="text-indigo-600 font-medium text-sm">
              Smart School ERP
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
            <p className="text-slate-500">
              Log in to manage your school ecosystem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 transition-all"
                  placeholder="name@school.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Default Credentials:
            </p>
            <div className="mt-2 space-y-1 text-xs text-slate-600">
              <p className="text-center">
                <span className="font-semibold">Super Admin:</span>{" "}
                admin@gmail.com / password123
              </p>
              <p className="text-center">
                <span className="font-semibold">School Admin:</span>{" "}
                schooladmin@gmail.com / password123
              </p>
            </div>
          </div>
        </div>

        {/* Demo Footer */}
        <p className="text-center mt-8 text-slate-400 text-sm">
          &copy; 2025 Vidyanta. Secure School ERP.
        </p>
      </div>
    </div>
  );
};

export default Login;
