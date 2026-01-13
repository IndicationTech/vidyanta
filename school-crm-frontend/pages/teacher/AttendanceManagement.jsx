import React, { useState } from "react";
import { MOCK_STUDENTS } from "../../constants";
import {
  Users,
  Calendar,
  TrendingUp,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AttendanceManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedClass, setSelectedClass] = useState("10th A");
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "monthly">("daily");

  const attendanceData = [
    { name: "Present", value: 28, color: "#10b981" },
    { name: "Absent", value: 4, color: "#ef4444" },
    { name: "Late", value: 2, color: "#f59e0b" },
    { name: "Half Day", value: 1, color: "#6366f1" },
  ];

  const weeklyData = [
    { day: "Mon", present: 30, absent: 2, late: 1 },
    { day: "Tue", present: 29, absent: 3, late: 2 },
    { day: "Wed", present: 31, absent: 1, late: 0 },
    { day: "Thu", present: 28, absent: 4, late: 2 },
    { day: "Fri", present: 30, absent: 2, late: 1 },
  ];

  const students = MOCK_STUDENTS.map((student) => ({
    ...student,
    attendanceStatus: Math.random() > 0.7 ? "absent" : Math.random() > 0.9 ? "late" : "present",
  }));

  const handleMarkAttendance = (studentId, status) => {
    // Handle attendance marking
    console.log(`Marking ${studentId} as ${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Attendance Management</h2>
          <p className="text-slate-500">Mark and track student attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="10th A">10th A</option>
            <option value="11th B">11th B</option>
            <option value="12th A">12th A</option>
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setViewMode("daily")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "daily" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
          }`}
        >
          Daily
        </button>
        <button
          onClick={() => setViewMode("weekly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "weekly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Students</span>
            <Users className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold">35</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Present</span>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">28</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Absent</span>
            <XCircle className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-red-600">4</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Attendance %</span>
            <TrendingUp className="text-indigo-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-indigo-600">80%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Today's Attendance Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Weekly Attendance Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
                <Tooltip />
                <Bar dataKey="present" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" radius={[8, 8, 0, 0]} />
                <Bar dataKey="late" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold mb-4">Mark Attendance - {selectedClass}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Roll No</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Name</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium">{index + 1}</td>
                  <td className="py-3 px-4 text-sm">{student.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        student.attendanceStatus === "present"
                          ? "bg-green-100 text-green-700"
                          : student.attendanceStatus === "late"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.attendanceStatus === "present" ? (
                        <CheckCircle size={12} />
                      ) : student.attendanceStatus === "late" ? (
                        <Clock size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}
                      {student.attendanceStatus.charAt(0).toUpperCase() + student.attendanceStatus.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleMarkAttendance(student.id, "present")}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(student.id, "absent")}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        Absent
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(student.id, "late")}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-200 transition-colors"
                      >
                        Late
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Total: {students.length} students | Present: {students.filter((s) => s.attendanceStatus === "present").length} | Absent: {students.filter((s) => s.attendanceStatus === "absent").length}
          </p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceManagement;

