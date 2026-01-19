import React, { useState } from "react";
import {
  User,
  Edit,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Mail,
  MessageSquare,
  TrendingUp,
  Award,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// interface StudentDashboardProps {
//   onNavigate?: (path: string) => void;
// }

const StudentDashboard = ({ onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Student Profile Data
  const studentData = {
    id: "S001",
    name: "Aarav Sharma",
    class: "10th A",
    rollNumber: "15",
    academicStatus: "Pass",
    photo: null,
    attendance: 95,
    overallGrade: "A",
  };

  // Attendance Data
  const attendanceData = [
    { name: "Present", value: 142, color: "#10b981" },
    { name: "Absent", value: 8, color: "#ef4444" },
    { name: "Late", value: 5, color: "#f59e0b" },
    { name: "Half Day", value: 2, color: "#6366f1" },
  ];

  const last7DaysAttendance = [
    { day: "Mon", status: "present", date: "11" },
    { day: "Tue", status: "present", date: "12" },
    { day: "Wed", status: "late", date: "13" },
    { day: "Thu", status: "present", date: "14" },
    { day: "Fri", status: "present", date: "15" },
    { day: "Sat", status: "absent", date: "16" },
    { day: "Sun", status: "present", date: "17" },
  ];

  const attendanceSummary = {
    totalDays: 157,
    present: 142,
    absent: 8,
    halfDay: 2,
    late: 5,
    percentage: 90.4,
  };

  // Today's Classes
  const todaysClasses = [
    {
      id: "1",
      subject: "Mathematics",
      teacher: "Dr. Meera Kulkarni",
      time: "9:00 AM - 10:00 AM",
      status: "completed",
      avatar: "M",
    },
    {
      id: "2",
      subject: "Physics",
      teacher: "Rajesh Kumar",
      time: "11:00 AM - 12:00 PM",
      status: "in-progress",
      avatar: "R",
    },
    {
      id: "3",
      subject: "English",
      teacher: "Sunita Banerjee",
      time: "2:00 PM - 3:00 PM",
      status: "upcoming",
      avatar: "S",
    },
    {
      id: "4",
      subject: "Chemistry",
      teacher: "Dr. Anil Patel",
      time: "3:30 PM - 4:30 PM",
      status: "upcoming",
      avatar: "A",
    },
  ];

  // Exams
  const upcomingExams = [
    {
      id: "1",
      subject: "Mathematics",
      date: "2024-04-05",
      time: "9:00 AM",
      room: "Room 101",
      daysLeft: 19,
    },
    {
      id: "2",
      subject: "Physics",
      date: "2024-04-08",
      time: "9:00 AM",
      room: "Room 205",
      daysLeft: 22,
    },
    {
      id: "3",
      subject: "Chemistry",
      date: "2024-04-10",
      time: "9:00 AM",
      room: "Room 301",
      daysLeft: 24,
    },
  ];

  // Performance Analytics
  const performanceData = [
    { term: "Quarterly", examScore: 85, attendance: 92 },
    { term: "Half-Yearly", examScore: 88, attendance: 94 },
    { term: "Model", examScore: 90, attendance: 95 },
    { term: "Final", examScore: 92, attendance: 96 },
  ];

  // Homework
  const homeworkList = [
    {
      id: "1",
      subject: "Mathematics",
      title: "Algebra Assignment - Chapter 5",
      teacher: "Dr. Meera Kulkarni",
      dueDate: "2024-03-20",
      progress: 75,
      status: "in-progress",
    },
    {
      id: "2",
      subject: "Physics",
      title: "Lab Report - Optics",
      teacher: "Rajesh Kumar",
      dueDate: "2024-03-22",
      progress: 45,
      status: "in-progress",
    },
    {
      id: "3",
      subject: "English",
      title: "Essay Writing - Climate Change",
      teacher: "Sunita Banerjee",
      dueDate: "2024-03-25",
      progress: 100,
      status: "completed",
    },
  ];

  // Faculties
  const faculties = [
    {
      id: "1",
      name: "Dr. Meera Kulkarni",
      subject: "Mathematics",
      avatar: "M",
      email: "meera@school.com",
    },
    {
      id: "2",
      name: "Rajesh Kumar",
      subject: "Physics",
      avatar: "R",
      email: "rajesh@school.com",
    },
    {
      id: "3",
      name: "Sunita Banerjee",
      subject: "English",
      avatar: "S",
      email: "sunita@school.com",
    },
    {
      id: "4",
      name: "Dr. Anil Patel",
      subject: "Chemistry",
      avatar: "A",
      email: "anil@school.com",
    },
  ];

  // Leave Requests
  const leaveRequests = [
    {
      id: "1",
      type: "Emergency",
      date: "2024-03-18",
      reason: "Family emergency",
      status: "approved",
    },
    {
      id: "2",
      type: "Medical",
      date: "2024-03-25",
      reason: "Doctor appointment",
      status: "pending",
    },
  ];

  // Fees Summary
  const feesSummary = [
    { type: "Transport", amount: 2000, due: false },
    { type: "Book", amount: 1500, due: true },
    { type: "Exam", amount: 500, due: false },
    { type: "Mess", amount: 3000, due: false },
    { type: "Hostel", amount: 5000, due: true },
  ];

  // Notices
  const notices = [
    {
      id: "1",
      title: "Annual Sports Day",
      content:
        "All students are invited to participate in the Annual Sports Day on March 25th.",
      date: "2024-03-10",
    },
    {
      id: "2",
      title: "Parent-Teacher Meeting",
      content: "The Parent-Teacher Meeting is scheduled for this Saturday.",
      date: "2024-03-12",
    },
  ];

  // Syllabus Progress
  const syllabusProgress = [
    { subject: "Mathematics", progress: 75 },
    { subject: "Physics", progress: 68 },
    { subject: "Chemistry", progress: 82 },
    { subject: "English", progress: 90 },
  ];

  // To-Do List
  const todoList = [
    {
      id: "1",
      task: "Complete Math assignment",
      time: "9:00 AM",
      completed: false,
      priority: "high",
    },
    {
      id: "2",
      task: "Prepare for Physics test",
      time: "2:00 PM",
      completed: false,
      priority: "medium",
    },
    {
      id: "3",
      task: "Submit English essay",
      time: "5:00 PM",
      completed: true,
      priority: "high",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "upcoming":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getAttendanceColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "absent":
        return "bg-red-500";
      case "late":
        return "bg-yellow-500";
      default:
        return "bg-slate-400";
    }
  };

  // Calendar Functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const days = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header / Student Profile Section */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{studentData.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-indigo-100">
                <span>ID: {studentData.id}</span>
                <span>•</span>
                <span>{studentData.class}</span>
                <span>•</span>
                <span>Roll No: {studentData.rollNumber}</span>
              </div>
              <div className="mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    studentData.academicStatus === "Pass"
                      ? "bg-green-500/20 text-white border border-green-300/30"
                      : "bg-red-500/20 text-white border border-red-300/30"
                  }`}
                >
                  {studentData.academicStatus}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              if (onNavigate) {
                onNavigate("/student/profile");
              }
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
          >
            <Edit size={18} />
            <span className="text-sm font-medium">Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Attendance</span>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold">{studentData.attendance}%</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Overall Grade</span>
            <Award className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {studentData.overallGrade}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Assignments Due</span>
            <Clock className="text-orange-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-orange-600">3</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Upcoming Exams</span>
            <Calendar className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {upcomingExams.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Attendance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold">
                  {attendanceSummary.totalDays}
                </p>
                <p className="text-xs text-slate-500">Total Days</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {attendanceSummary.present}
                </p>
                <p className="text-xs text-slate-500">Present</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {attendanceSummary.absent}
                </p>
                <p className="text-xs text-slate-500">Absent</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">
                  {attendanceSummary.halfDay}
                </p>
                <p className="text-xs text-slate-500">Half Day</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">
                  Attendance Distribution
                </h4>
                <div className="h-50">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                    minWidth={0}
                    minHeight={0}
                  >
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
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
              <div>
                <h4 className="text-sm font-semibold mb-3">Last 7 Days</h4>
                <div className="flex items-center justify-between gap-2">
                  {last7DaysAttendance.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium ${getAttendanceColor(
                          day.status
                        )}`}
                      >
                        {day.date}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{day.day}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Today's Classes</h3>
            <div className="space-y-3">
              {todaysClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className={`p-4 rounded-xl border-2 ${getStatusColor(
                    classItem.status
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                        {classItem.avatar}
                      </div>
                      <div>
                        <p className="font-bold">{classItem.subject}</p>
                        <p className="text-sm text-slate-600">
                          {classItem.teacher}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {classItem.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        classItem.status
                      )}`}
                    >
                      {classItem.status === "completed"
                        ? "Completed"
                        : classItem.status === "in-progress"
                        ? "In Progress"
                        : "Upcoming"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Performance Analytics</h3>
            <div className="h-75">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorExam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorAttendance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="term"
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
                  <Area
                    type="monotone"
                    dataKey="examScore"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExam)"
                    name="Average Exam Score"
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAttendance)"
                    name="Average Attendance"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Homework Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Homework</h3>
            <div className="space-y-4">
              {homeworkList.map((homework) => (
                <div
                  key={homework.id}
                  className="p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                          {homework.subject}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            homework.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {homework.status === "completed"
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </div>
                      <h4 className="font-bold mb-1">{homework.title}</h4>
                      <p className="text-sm text-slate-500">
                        {homework.teacher} • Due: {homework.dueDate}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="relative w-16 h-16">
                        <svg className="transform -rotate-90 w-16 h-16">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="#e2e8f0"
                            strokeWidth="6"
                            fill="none"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke={
                              homework.progress === 100 ? "#10b981" : "#6366f1"
                            }
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${
                              (homework.progress / 100) * 175.9
                            } 175.9`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold">
                            {homework.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Schedule & Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Calendar</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={previousMonth}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-medium min-w-30 text-center">
                  {monthNames[currentMonth.getMonth()]}{" "}
                  {currentMonth.getFullYear()}
                </span>
                <button
                  onClick={nextMonth}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-slate-600 py-1"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isToday =
                  day === new Date().getDate() &&
                  currentMonth.getMonth() === new Date().getMonth();
                const hasExam = upcomingExams.some(
                  (exam) =>
                    new Date(exam.date).getDate() === day &&
                    new Date(exam.date).getMonth() === currentMonth.getMonth()
                );
                return (
                  <div
                    key={index}
                    className={`aspect-square p-1 ${
                      isToday
                        ? "bg-indigo-100 border-2 border-indigo-500 rounded"
                        : day
                        ? "hover:bg-slate-50 rounded"
                        : ""
                    }`}
                  >
                    {day && (
                      <>
                        <div
                          className={`text-xs font-medium ${
                            isToday ? "text-indigo-600" : "text-slate-900"
                          }`}
                        >
                          {day}
                        </div>
                        {hasExam && (
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Exams */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Upcoming Exams</h3>
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold">{exam.subject}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {exam.date} • {exam.time}
                      </p>
                      <p className="text-xs text-slate-500">
                        Room: {exam.room}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                      {exam.daysLeft} Days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculties Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Faculties</h3>
            <div className="space-y-3">
              {faculties.map((faculty) => (
                <div
                  key={faculty.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {faculty.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{faculty.name}</p>
                      <p className="text-xs text-slate-500">
                        {faculty.subject}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors">
                      <Mail size={16} />
                    </button>
                    <button className="p-2 hover:bg-green-50 rounded-lg text-green-600 transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Leave Requests</h3>
            <div className="space-y-3">
              {leaveRequests.map((leave) => (
                <div
                  key={leave.id}
                  className="p-3 rounded-xl border border-slate-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                      {leave.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{leave.reason}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Date: {leave.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fees Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Fees Summary</h3>
            <div className="space-y-2">
              {feesSummary.map((fee, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                >
                  <div>
                    <p className="font-medium text-sm">{fee.type}</p>
                    <p className="text-xs text-slate-500">₹{fee.amount}</p>
                  </div>
                  {fee.due && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                      Due
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notice Board */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bell className="text-indigo-600" size={20} />
              Notice Board
            </h3>
            <div className="space-y-3">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-3 rounded-xl border border-slate-200 bg-blue-50"
                >
                  <h4 className="font-bold text-sm mb-1">{notice.title}</h4>
                  <p className="text-xs text-slate-600">{notice.content}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    Date: {notice.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">Syllabus Progress</h3>
            <div className="space-y-4">
              {syllabusProgress.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.subject}</span>
                    <span className="text-sm font-bold text-indigo-600">
                      {item.progress}%
                    </span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* To-Do List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4">To-Do List</h3>
            <div className="space-y-3">
              {todoList.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        todo.completed
                          ? "line-through text-slate-400"
                          : "font-medium"
                      }`}
                    >
                      {todo.task}
                    </p>
                    <p className="text-xs text-slate-500">{todo.time}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      todo.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {todo.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
