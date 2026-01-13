import React, { useState } from "react";
import { MOCK_STUDENTS } from "../../constants";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MessageSquare,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentPerformance = () => {
  const [selectedClass, setSelectedClass] = useState("10th A");
  const [searchTerm, setSearchTerm] = useState("");

  const performanceData = MOCK_STUDENTS.map((student) => ({
    ...student,
    marks: Math.floor(Math.random() * 30) + 70,
    grade: "A",
    trend: Math.random() > 0.5 ? "up" : "down",
    improvement: (Math.random() * 10 - 5).toFixed(1),
  }));

  const chartData = performanceData.map((student) => ({
    name: student.name.split(" ")[0],
    marks: student.marks,
    attendance: student.attendance,
  }));

  const comparisonData = [
    { name: "Test 1", avg: 75, max: 95, min: 55 },
    { name: "Test 2", avg: 78, max: 97, min: 58 },
    { name: "Test 3", avg: 82, max: 98, min: 62 },
    { name: "Test 4", avg: 85, max: 99, min: 65 },
  ];

  const filteredStudents = performanceData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Performance & Progress</h2>
          <p className="text-slate-500">
            Monitor and track student academic performance
          </p>
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
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search students by name or roll number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Students</span>
            <Users className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold">{filteredStudents.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Average Marks</span>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(
              filteredStudents.reduce((sum, s) => sum + s.marks, 0) /
                filteredStudents.length || 0
            )}
            %
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Top Performer</span>
            <TrendingUp className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {filteredStudents.length > 0
              ? Math.max(...filteredStudents.map((s) => s.marks))
              : 0}
            %
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Needs Attention</span>
            <TrendingDown className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {filteredStudents.filter((s) => s.marks < 70).length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Performance Overview</h3>
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip />
                <Bar dataKey="marks" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-4">Test Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
            >
              <LineChart data={comparisonData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8" }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#6366f1"
                  strokeWidth={2}
                  name="Average"
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Maximum"
                />
                <Line
                  type="monotone"
                  dataKey="min"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Minimum"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student, index) => (
          <div
            key={student.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{student.name}</h3>
                  <p className="text-xs text-slate-500">
                    Roll No: {index + 1} | {student.grade} {student.section}
                  </p>
                </div>
              </div>
              {student.trend === "up" ? (
                <TrendingUp className="text-green-500" size={20} />
              ) : (
                <TrendingDown className="text-red-500" size={20} />
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">Marks</span>
                  <span className="text-sm font-bold">{student.marks}%</span>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      student.marks >= 80
                        ? "bg-green-500"
                        : student.marks >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${student.marks}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Attendance</span>
                <span className="font-medium">{student.attendance}%</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Grade</span>
                <span className="font-bold text-indigo-600">
                  {student.grade}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Trend</span>
                <span
                  className={`font-medium ${
                    student.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {student.trend === "up" ? "+" : ""}
                  {student.improvement}%
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 pt-4 border-t border-slate-100">
              <button className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Eye size={14} />
                View
              </button>
              <button className="flex-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Edit size={14} />
                Add Marks
              </button>
              <button className="px-3 py-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <MessageSquare size={14} />
                Remarks
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentPerformance;
