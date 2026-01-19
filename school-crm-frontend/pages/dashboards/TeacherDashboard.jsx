import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Users,
  BookOpen,
  TrendingUp,
  Clock,
  Bell,
  Edit,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
  JoystickIcon,
} from "lucide-react";
import { getProfile } from "../../api/profileApi";
const TeacherDashboard = () => {
  // Get current greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Teacher data from database
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Daily notice
  const [dailyNotice, setDailyNotice] = useState(
    "Parent-Teacher Meeting scheduled for this Friday at 3:00 PM"
  );

  // Syllabus Progress
  const [syllabusProgress, setSyllabusProgress] = useState({
    completed: 65,
    pending: 35,
  });

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState([
    {
      date: new Date(2026, 0, 5),
      class: "10A",
      subject: "Math",
      time: "9:00 AM",
    },
    {
      date: new Date(2026, 0, 10),
      class: "10B",
      subject: "Physics",
      time: "11:00 AM",
    },
    {
      date: new Date(2026, 0, 15),
      class: "9C",
      subject: "Math",
      time: "2:00 PM",
    },
  ]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);

  // Today's classes
  const [todaysClasses, setTodaysClasses] = useState([
    {
      id: 1,
      class: "10A",
      subject: "Mathematics",
      time: "9:00 AM",
      status: "completed",
    },
    {
      id: 2,
      class: "10B",
      subject: "Physics",
      time: "11:00 AM",
      status: "ongoing",
    },
    {
      id: 3,
      class: "9C",
      subject: "Mathematics",
      time: "2:00 PM",
      status: "upcoming",
    },
    {
      id: 4,
      class: "10A",
      subject: "Physics",
      time: "3:30 PM",
      status: "upcoming",
    },
  ]);

  // Attendance overview
  const [attendanceData, setAttendanceData] = useState({
    present: 450,
    absent: 30,
    late: 15,
    halfDay: 5,
  });
  const [attendanceRange, setAttendanceRange] = useState("weekly");

  // Best performing classes
  const [performingClasses, setPerformingClasses] = useState([
    { class: "10A Mathematics", percentage: 92 },
    { class: "10B Physics", percentage: 88 },
    { class: "9C Mathematics", percentage: 85 },
    { class: "10A Physics", percentage: 78 },
  ]);

  // Teacher Announcements
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Assignment Deadline",
      description: "Chapter 5 assignment due by Friday",
      priority: "Important",
      date: new Date(2026, 0, 3),
    },
    {
      id: 2,
      title: "Lab Session",
      description: "Physics lab will be conducted in Room 204",
      priority: "Normal",
      date: new Date(2026, 0, 2),
    },
  ]);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);

  // Student marks
  const [studentMarks, setStudentMarks] = useState([
    {
      id: "STU001",
      name: "Rahul Kumar",
      class: "10A",
      section: "A",
      marks: 85,
      cgpa: 8.5,
      status: "Pass",
    },
    {
      id: "STU002",
      name: "Priya Singh",
      class: "10A",
      section: "A",
      marks: 92,
      cgpa: 9.2,
      status: "Pass",
    },
    {
      id: "STU003",
      name: "Amit Patel",
      class: "10B",
      section: "B",
      marks: 78,
      cgpa: 7.8,
      status: "Pass",
    },
    {
      id: "STU004",
      name: "Sneha Reddy",
      class: "10B",
      section: "B",
      marks: 88,
      cgpa: 8.8,
      status: "Pass",
    },
    {
      id: "STU005",
      name: "Vikram Shah",
      class: "9C",
      section: "C",
      marks: 45,
      cgpa: 4.5,
      status: "Fail",
    },
    {
      id: "STU006",
      name: "Ananya Verma",
      class: "9C",
      section: "C",
      marks: 91,
      cgpa: 9.1,
      status: "Pass",
    },
  ]);
  const [marksFilter, setMarksFilter] = useState({
    class: "All",
    section: "All",
  });
  const [marksPage, setMarksPage] = useState(1);

  // Leave status
  const [leaveStatus, setLeaveStatus] = useState([
    { id: 1, type: "Sick Leave", date: "Dec 20, 2025", status: "Approved" },
    { id: 2, type: "Casual Leave", date: "Jan 5, 2026", status: "Pending" },
    { id: 3, type: "Personal Leave", date: "Jan 15, 2026", status: "Declined" },
  ]);

  // Upcoming events
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "Annual Sports Day",
      date: "Jan 20, 2026",
      time: "10:00 AM",
      participants: "All Classes",
    },
    {
      id: 2,
      title: "Science Exhibition",
      date: "Jan 25, 2026",
      time: "2:00 PM",
      participants: "Classes 9-10",
    },
    {
      id: 3,
      title: "Parent Meeting",
      date: "Jan 30, 2026",
      time: "4:00 PM",
      participants: "Class 10A",
    },
  ]);

  // Profile edit modal
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

  // Fetch teacher profile data from database
  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        // Get userId from localStorage
        const userId = localStorage.getItem("userId");

        if (!userId) {
          console.warn("No userId found in localStorage");
          // Use mock data for development/testing
          setTeacherData({
            id: "TCH001",
            name: "Bhumika Sutar",
            photo: "",
            phone: "+91 98765 43210",
            email: "bhumika.sutar@school.com",
            address: "123 Park Street, Delhi",
            subjects: ["Mathematics", "Physics"],
            classes: ["Class 10A", "Class 10B", "Class 9C"],
          });
          setLoading(false);
          return;
        }

        const response = await getProfile(userId);

        setTeacherData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
        console.error("Error details:", error.response?.data);

        // Use mock data on error so UI is still visible
        setTeacherData({
          id: "TCH001",
          name: "Bhumika Sutar",
          photo: "",
          phone: "+91 98765 43210",
          email: "bhumika.sutar@school.com",
          address: "123 Park Street, Delhi",
          subjects: ["Mathematics", "Physics"],
          classes: ["Class 10A", "Class 10B", "Class 9C"],
        });
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, []);

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty slots for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const hasSchedule = (date) => {
    if (!date) return false;
    return schedules.some(
      (s) =>
        s.date.getDate() === date.getDate() &&
        s.date.getMonth() === date.getMonth() &&
        s.date.getFullYear() === date.getFullYear()
    );
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    setTeacherData(editedProfile);
    setShowProfileEdit(false);
  };

  // Handle announcement submission
  const handleAnnouncementSubmit = (announcement) => {
    if (currentAnnouncement) {
      // Edit existing
      setAnnouncements(
        announcements.map((a) =>
          a.id === currentAnnouncement.id ? { ...announcement, id: a.id } : a
        )
      );
    } else {
      // Add new
      setAnnouncements([...announcements, { ...announcement, id: Date.now() }]);
    }
    setShowAnnouncementModal(false);
    setCurrentAnnouncement(null);
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
  };

  // Filter student marks
  const filteredMarks = studentMarks.filter((student) => {
    if (marksFilter.class !== "All" && student.class !== marksFilter.class)
      return false;
    if (
      marksFilter.section !== "All" &&
      student.section !== marksFilter.section
    )
      return false;
    return true;
  });

  const marksPerPage = 5;
  const totalPages = Math.ceil(filteredMarks.length / marksPerPage);
  const paginatedMarks = filteredMarks.slice(
    (marksPage - 1) * marksPerPage,
    marksPage * marksPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            No Teacher Profile Found
          </h2>
          <p className="text-slate-600 mb-4">
            Unable to load teacher profile from the database.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-700">
            <p className="font-semibold mb-2">Troubleshooting steps:</p>
            <ol className="list-decimal ml-4 space-y-1">
              <li>Make sure your backend server is running</li>
              <li>Check the browser console for error details</li>
              <li>Verify the userId in localStorage</li>
              <li>Ensure the profile exists in the database</li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      {/* Header / Greeting Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 mb-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {teacherData.name?.split(" ")[1] || teacherData.name}
          !
        </h1>
        <p className="text-blue-100 flex items-center gap-2">
          <Bell size={18} />
          {dailyNotice}
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Teacher Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start gap-4">
              <img
                src={
                  teacherData.photo ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    teacherData.name || "Teacher"
                  )}&background=4f46e5&color=fff&size=128`
                }
                alt={teacherData.name}
                className="w-24 h-24 rounded-full border-4 border-indigo-100"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {teacherData.name}
                    </h2>
                    <p className="text-slate-600">
                      ID: {teacherData.teacherId || teacherData.id || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditedProfile({ ...teacherData });
                      setShowProfileEdit(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Subject:</span>{" "}
                    {teacherData.subject || "Not assigned"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Phone:</span>{" "}
                    {teacherData.phone || "Not provided"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {teacherData.email || "Not provided"}
                  </p>
                </div>
              </div>
              {/* Syllabus Progress */}
              <div className="text-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#4f46e5"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${
                        2 *
                        Math.PI *
                        56 *
                        (1 - syllabusProgress.completed / 100)
                      }`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {syllabusProgress.completed}%
                    </span>
                    <span className="text-xs text-slate-600">Syllabus</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-2">Completed</p>
              </div>
            </div>
          </div>

          {/* Calendar & Schedule */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon size={24} className="text-indigo-600" />
                Schedule Calendar
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeMonth(-1)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="font-semibold text-slate-700 min-w-30 text-center">
                  {currentDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() => changeMonth(1)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => setShowAddSchedule(true)}
                  className="ml-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1 text-sm"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-slate-600 py-2"
                >
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((date, index) => (
                <div
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  className={`h-10 flex items-center justify-center rounded-lg text-sm cursor-pointer transition ${
                    !date
                      ? "bg-transparent"
                      : isToday(date)
                      ? "bg-indigo-600 text-white font-bold"
                      : hasSchedule(date)
                      ? "bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200"
                      : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  {date ? date.getDate() : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Classes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock size={24} className="text-indigo-600" />
              Today's Classes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {todaysClasses.map((cls) => (
                <div
                  key={cls.id}
                  className={`p-4 rounded-lg border-2 transition ${
                    cls.status === "completed"
                      ? "border-green-200 bg-green-50 opacity-60"
                      : cls.status === "ongoing"
                      ? "border-indigo-500 bg-indigo-50 shadow-lg"
                      : "border-slate-200 bg-white hover:border-indigo-300"
                  }`}
                >
                  <h4 className="font-bold text-slate-800">{cls.class}</h4>
                  <p className="text-sm text-slate-600">{cls.subject}</p>
                  <p className="text-xs text-slate-500 mt-2">{cls.time}</p>
                  <span
                    className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                      cls.status === "completed"
                        ? "bg-green-200 text-green-800"
                        : cls.status === "ongoing"
                        ? "bg-indigo-200 text-indigo-800"
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Announcements */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Bell size={24} className="text-indigo-600" />
                My Announcements
              </h3>
              <button
                onClick={() => {
                  setCurrentAnnouncement(null);
                  setShowAnnouncementModal(true);
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-1"
              >
                <Plus size={16} />
                New
              </button>
            </div>
            <div className="space-y-3">
              {announcements
                .sort((a, b) => {
                  const priority = { Urgent: 3, Important: 2, Normal: 1 };
                  return (
                    priority[b.priority] - priority[a.priority] ||
                    b.date - a.date
                  );
                })
                .map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      announcement.priority === "Urgent"
                        ? "border-red-500 bg-red-50"
                        : announcement.priority === "Important"
                        ? "border-orange-500 bg-orange-50"
                        : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-800">
                            {announcement.title}
                          </h4>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              announcement.priority === "Urgent"
                                ? "bg-red-200 text-red-800"
                                : announcement.priority === "Important"
                                ? "bg-orange-200 text-orange-800"
                                : "bg-blue-200 text-blue-800"
                            }`}
                          >
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {announcement.description}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {announcement.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentAnnouncement(announcement);
                            setShowAnnouncementModal(true);
                          }}
                          className="p-1 hover:bg-white rounded transition"
                        >
                          <Edit size={16} className="text-indigo-600" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteAnnouncement(announcement.id)
                          }
                          className="p-1 hover:bg-white rounded transition"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Student Marks Table */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BookOpen size={24} className="text-indigo-600" />
              Student Marks
            </h3>
            <div className="flex gap-4 mb-4">
              <select
                value={marksFilter.class}
                onChange={(e) => {
                  setMarksFilter({ ...marksFilter, class: e.target.value });
                  setMarksPage(1);
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Classes</option>
                <option>10A</option>
                <option>10B</option>
                <option>9C</option>
              </select>
              <select
                value={marksFilter.section}
                onChange={(e) => {
                  setMarksFilter({ ...marksFilter, section: e.target.value });
                  setMarksPage(1);
                }}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>All</option>
                <option>A</option>
                <option>B</option>
                <option>C</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Student ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Class
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Section
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Marks %
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      CGPA
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMarks.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {student.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {student.name}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {student.class}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {student.section}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {student.marks}%
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">
                        {student.cgpa}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            student.status === "Pass"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setMarksPage(page)}
                      className={`px-3 py-1 rounded-lg ${
                        marksPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Attendance Overview */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users size={24} className="text-indigo-600" />
                Attendance
              </h3>
              <select
                value={attendanceRange}
                onChange={(e) => setAttendanceRange(e.target.value)}
                className="px-3 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="flex justify-center mb-4">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90 w-40 h-40">
                  {/* Present */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#10b981"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset="0"
                  />
                  {/* Absent */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#ef4444"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    strokeDashoffset={`${
                      2 *
                      Math.PI *
                      70 *
                      (attendanceData.present /
                        (attendanceData.present +
                          attendanceData.absent +
                          attendanceData.late +
                          attendanceData.halfDay))
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {Math.round(
                      (attendanceData.present /
                        (attendanceData.present +
                          attendanceData.absent +
                          attendanceData.late +
                          attendanceData.halfDay)) *
                        100
                    )}
                    %
                  </span>
                  <span className="text-xs text-slate-600">Present</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Present</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {attendanceData.present}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Absent</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {attendanceData.absent}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Late</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {attendanceData.late}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Half-day</span>
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {attendanceData.halfDay}
                </span>
              </div>
            </div>
          </div>

          {/* Best Performing Classes */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-indigo-600" />
              Best Performing Classes
            </h3>
            <div className="space-y-4">
              {performingClasses.map((cls, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {cls.class}
                    </span>
                    <span className="text-sm font-bold text-indigo-600">
                      {cls.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${cls.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leave Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Leave Status
            </h3>
            <div className="space-y-3">
              {leaveStatus.map((leave) => (
                <div key={leave.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {leave.type}
                      </p>
                      <p className="text-sm text-slate-600">{leave.date}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        leave.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : leave.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Upcoming Events
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto sidebar-scrollbar">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <h4 className="font-semibold text-slate-800">
                    {event.title}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {event.participants}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showProfileEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-800">Edit Profile</h3>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="text"
                  value={editedProfile?.photo || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      photo: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editedProfile?.phone || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <textarea
                  value={editedProfile?.address || ""}
                  onChange={(e) =>
                    setEditedProfile({
                      ...editedProfile,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleProfileUpdate}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowProfileEdit(false)}
                  className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnouncementModal && (
        <AnnouncementModal
          announcement={currentAnnouncement}
          onClose={() => {
            setShowAnnouncementModal(false);
            setCurrentAnnouncement(null);
          }}
          onSubmit={handleAnnouncementSubmit}
        />
      )}

      {/* Add Schedule Modal */}
      {showAddSchedule && (
        <AddScheduleModal
          onClose={() => setShowAddSchedule(false)}
          onSubmit={(schedule) => {
            setSchedules([...schedules, schedule]);
            setShowAddSchedule(false);
          }}
        />
      )}
    </div>
  );
};

// Announcement Modal Component
const AnnouncementModal = ({ announcement, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(
    announcement || {
      title: "",
      description: "",
      priority: "Normal",
      date: new Date(),
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">
            {announcement ? "Edit Announcement" : "New Announcement"}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Normal</option>
              <option>Important</option>
              <option>Urgent</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {announcement ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Schedule Modal Component
const AddScheduleModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date(),
    class: "",
    subject: "",
    time: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800">Add Schedule</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date
            </label>
            <input
              type="date"
              onChange={(e) =>
                setFormData({ ...formData, date: new Date(e.target.value) })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Class
            </label>
            <input
              type="text"
              value={formData.class}
              onChange={(e) =>
                setFormData({ ...formData, class: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 10A"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Mathematics"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Time
            </label>
            <input
              type="time"
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Add Schedule
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherDashboard;
