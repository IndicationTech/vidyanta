// import React, { useState } from "react";
// import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
// import { login } from "../api/authApi";

// const Login = ({ onLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await login(email, password);

//       if (response.data.success) {
//         // Save auth data to localStorage
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("userId", response.data.user._id);
//         localStorage.setItem("userName", response.data.user.name);
//         localStorage.setItem("userEmail", response.data.user.email);
//         localStorage.setItem("userRole", response.data.user.role);

//         // Call the onLogin callback to update app state
//         onLogin(response.data.user.role);
//       }
//     } catch (error) {
//       console.error("Auth error:", error);
//       setError(
//         error.response?.data?.message ||
//           "Authentication failed. Please check your credentials.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {/* Logo */}
//         <div className="flex items-center justify-center gap-3 mb-8">
//           <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="28"
//               height="28"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="lucide lucide-school"
//             >
//               <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
//               <path d="M6 12v5c3 3 9 3 12 0v-5" />
//             </svg>
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 leading-none">
//               Vidyanta
//             </h1>
//             <p className="text-indigo-600 font-medium text-sm">
//               Smart School ERP
//             </p>
//           </div>
//         </div>

//         {/* Auth Card */}
//         <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-8">
//           <div className="mb-8">
//             <h2 className="text-2xl font-bold text-slate-900">Welcome back!</h2>
//             <p className="text-slate-500">
//               Log in to manage your school ecosystem.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {error && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                   size={18}
//                 />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 transition-all"
//                   placeholder="name@school.com"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
//                   size={18}
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50 transition-all"
//                   placeholder="••••••••"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>

//           <div className="mt-6 pt-6 border-t border-slate-200">
//             <p className="text-xs text-slate-500 text-center">
//               Default Credentials:
//             </p>
//             <div className="mt-2 space-y-1 text-xs text-slate-600">
//               <p className="text-center">
//                 <span className="font-semibold">Super Admin:</span>{" "}
//                 admin@gmail.com / password123
//               </p>
//               <p className="text-center">
//                 <span className="font-semibold">School Admin:</span>{" "}
//                 schooladmin@gmail.com / password123
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Demo Footer */}
//         <p className="text-center mt-8 text-slate-400 text-sm">
//           &copy; 2026 Vidyanta. Secure School ERP.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

// "use client";

// import React, { useState } from "react";
// import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
// import { login } from "../api/authApi";

// const Login = ({ onLogin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await login(email, password);

//       if (res.data.success) {
//         localStorage.setItem("token", res.data.token);
//         localStorage.setItem("userId", res.data.user._id);
//         localStorage.setItem("userName", res.data.user.name);
//         localStorage.setItem("userEmail", res.data.user.email);
//         localStorage.setItem("userRole", res.data.user.role);

//         onLogin(res.data.user.role);
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Authentication failed. Please check credentials.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
//       {/* LEFT SIDE — IMAGE BACKGROUND */}
//       <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
//         {/* Background Image */}
//         <div
//           className="absolute inset-0 bg-cover bg-center scale-105"
//           style={{
//             backgroundImage: "url('/assets/SchoolCRMlogin.png')",
//           }}
//         />

//         {/* Brand-matched overlay (INDIGO, not purple) */}
//         <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/60 via-indigo-600/50 to-indigo-800/60"></div>

//         {/* Soft light overlay to keep faces natural */}
//         <div className="absolute inset-0 bg-white/5"></div>

//         {/* Subtle glow accents */}
//         <div className="absolute top-32 left-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-32 right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

//         {/* Content */}
//         <div className="relative z-10 max-w-xl px-16 text-white">
//           <h1 className="text-8xl font-extrabold leading-tight tracking-tight">
//             Vidyanta
//           </h1>
//         </div>
//       </div>

//       {/* RIGHT LOGIN SECTION */}
//       <div className="flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-slate-50">
//         <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
//           {/* Mobile Logo */}
//           <div className="lg:hidden text-center mb-8">
//             <h1 className="text-2xl font-bold text-indigo-600">Vidyanta</h1>
//             <p className="text-sm text-slate-500">Smart School ERP</p>
//           </div>

//           <h2 className="text-2xl font-bold text-slate-900 mb-1">
//             Welcome back 👋
//           </h2>
//           <p className="text-slate-500 mb-6">
//             Login to continue to your dashboard
//           </p>

//           {error && (
//             <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
//               <AlertCircle size={16} />
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                   size={18}
//                 />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                   placeholder="admin@school.com"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//                   size={18}
//                 />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
//             >
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>

//           {/* Demo */}
//           <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-center text-slate-600">
//             <p className="font-semibold mb-1">Demo Credentials</p>
//             <p>Super Admin: admin@gmail.com / password123</p>
//             <p>School Admin: schooladmin@gmail.com / password123</p>
//           </div>

//           <p className="mt-6 text-center text-xs text-slate-400">
//             © 2026 Vidyanta. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

"use client";

import React, { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { login } from "../api/authApi";
import { motion } from "framer-motion";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ THIS IS THE KEY FIX
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(email, password);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("userEmail", res.data.user.email);
        localStorage.setItem("userRole", res.data.user.role);

        onLogin(res.data.user.role);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Authentication failed. Please check credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const letterVariants = {
    hidden: { y: -120, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex relative items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('/assets/SchoolCRMlogin.png')" }}
        />

        {/* Indigo overlay (brand matched) */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/60 via-indigo-600/50 to-indigo-800/60" />
        <div className="absolute inset-0 bg-white/5" />

        {/* Glow */}
        <div className="absolute top-32 left-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />

        {/* CONTENT */}
        <div className="relative z-10 max-w-xl px-16 text-white">
          {mounted && (
            <motion.h1
              className="text-8xl font-extrabold tracking-tight flex drop-shadow-2xl"
              initial="hidden"
              animate="visible"
            >
              {"Vidyanta".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  transition={{ delay: index * 0.15 }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
          )}
        </div>
      </div>

      {/* RIGHT LOGIN */}
      <div className="flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-indigo-600">Vidyanta</h1>
            <p className="text-sm text-slate-500">Smart School ERP</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Welcome back 👋
          </h2>
          <p className="text-slate-500 mb-6">
            Login to continue to your dashboard
          </p>

          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="admin@school.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg text-xs text-center text-slate-600">
            <p className="font-semibold mb-1">Demo Credentials</p>
            <p>Super Admin: admin@gmail.com / password123</p>
            <p>School Admin: schooladmin@gmail.com / password123</p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            © 2026 Vidyanta. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
