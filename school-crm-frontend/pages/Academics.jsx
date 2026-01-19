import React, { useState, useEffect } from "react";
import { generateTimetable } from "../services/geminiService";
import { MOCK_TEACHERS } from "../constants";
import TimeTableModal from "../components/TimeTableModal";
import {
  Calendar,
  Wand2,
  Clock,
  Loader2,
  Save,
  Printer,
  BookOpen,
  User,
  Edit2,
  X,
  Trash2,
  Plus,
} from "lucide-react";

const Academics = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState("10th A");
  const [userRole, setUserRole] = useState("");
  const [timetableDataState, setTimetableDataState] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeDay, setActiveDay] = useState("Monday");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTimetableForm, setAddTimetableForm] = useState({
    class: "",
    section: "A",
    subjectGroup: "Science",
    periodStartTime: "08:00",
    duration: "45",
    days: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
    },
  });

  const [timetableForm, setTimetableForm] = useState({
    class: "10th A",
    section: "A",
    subjectGroup: "Science",
    periodStartTime: "08:00",
    duration: "45",
    days: {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    },
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "Student";
    setUserRole(role);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateTimetable(MOCK_TEACHERS, [
      "10th A",
      "10th B",
      "11th A",
    ]);
    setTimetable(result);
    setIsGenerating(false);
  };

  const isAdmin =
    userRole === "Admin" ||
    userRole === "School Admin" ||
    userRole === "Super Admin";

  const handleEditClick = (day, index, period) => {
    if (!isAdmin) return;
    setEditingPeriod({ ...period, day, index });
    setShowEditModal(true);
  };

  const handleOpenEditTimetable = () => {
    if (!isAdmin) return;
    // Initialize form with current timetable data
    const formData = {
      class: selectedClass,
      section: "A",
      subjectGroup: "Science",
      periodStartTime: "08:00",
      duration: "45",
      days: {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
      },
    };

    // Convert current timetable to form format for weekdays only
    weekDays.forEach((day) => {
      const dayData = currentTimetableData[day] || [];
      formData.days[day] = dayData
        .filter((slot) => slot.subject !== "BREAK" && slot.subject !== "LUNCH")
        .map((slot, idx) => ({
          id: `${day}-${idx}`,
          subject: slot.subject,
          teacher: slot.teacher,
          timeFrom: slot.time.split(" - ")[0],
          timeTo: slot.time.split(" - ")[1],
        }));
    });

    setTimetableForm(formData);
    setShowEditModal(true);
  };

  const handleAddPeriod = (day) => {
    const newPeriod = {
      id: `${day}-${Date.now()}`,
      subject: subjects[0],
      teacher: teachers[0],
      timeFrom: "08:00",
      timeTo: "08:45",
    };

    setTimetableForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...prev.days[day], newPeriod],
      },
    }));
  };

  const handleDeletePeriodRow = (day, periodId) => {
    setTimetableForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].filter((p) => p.id !== periodId),
      },
    }));
  };

  const handleUpdatePeriod = (day, periodId, field, value) => {
    setTimetableForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].map((p) =>
          p.id === periodId ? { ...p, [field]: value } : p
        ),
      },
    }));
  };

  const handleSaveTimetable = (data) => {
    // Convert form data to timetable format
    const updatedTimetableData = {};

    // Create timetable structure for each day
    Object.keys(data.days).forEach((day) => {
      updatedTimetableData[day] = data.days[day].map((period) => ({
        time: `${period.timeFrom} - ${period.timeTo}`,
        subject: period.subject,
        teacher: period.teacher,
      }));
    });

    // Update the timetable data for the selected class
    setTimetableDataState(updatedTimetableData);
    setShowEditModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddTimetable = (data) => {
    // Convert form data to timetable format
    const newTimetableData = {};

    // Create timetable structure for each day
    Object.keys(data.days).forEach((day) => {
      newTimetableData[day] = data.days[day].map((period) => ({
        time: `${period.timeFrom}- ${period.timeTo}`,
        subject: period.subject,
        teacher: period.teacher,
      }));
    });

    // Store the timetable data for the selected class
    setTimetableDataState(newTimetableData);

    setShowAddModal(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddPeriodToNew = (day) => {
    const newPeriod = {
      id: `${day}-${Date.now()}`,
      subject: subjects[0],
      teacher: teachers[0],
      timeFrom: "08:00",
      timeTo: "08:45",
    };

    setAddTimetableForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...prev.days[day], newPeriod],
      },
    }));
  };

  const handleDeletePeriodFromNew = (day, periodId) => {
    setAddTimetableForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].filter((p) => p.id !== periodId),
      },
    }));
  };

  const handleUpdatePeriodInNew = (day, periodId, field, value) => {
    setAddTimetableForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].map((p) =>
          p.id === periodId ? { ...p, [field]: value } : p
        ),
      },
    }));
  };

  const handleDeletePeriod = (day, index) => {
    if (!isAdmin || !confirm("Are you sure you want to delete this period?"))
      return;

    // Delete logic here (in real app, API call)
    const updatedTimetable = { ...timetableData };
    updatedTimetable[day].splice(index, 1);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    const draftData = {
      class: selectedClass,
      timetable: currentTimetableData,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      `timetable-draft-${selectedClass}`,
      JSON.stringify(draftData)
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer",
    "History",
    "Geography",
    "Physical Education",
  ];

  const teachers = [
    "Dr. Meera Kulkarni",
    "Mr. Rajesh Patel",
    "Dr. Priya Sharma",
    "Ms. Anjali Verma",
    "Mr. Vikram Singh",
    "Dr. Suresh Kumar",
    "Prof. Anil Deshmukh",
    "Ms. Kavita Reddy",
    "Coach Ramesh",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Define subject colors with pastel palette
  const subjectColors = {
    Mathematics: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    Physics: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
    },
    Chemistry: {
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200",
    },
    Biology: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200",
    },
    English: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    },
    Computer: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
    History: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
    },
    Geography: {
      bg: "bg-teal-50",
      text: "text-teal-700",
      border: "border-teal-200",
    },
    "Physical Education": {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    },
    default: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
    },
  };

  // Sample timetable data structure
  const timetableData = {
    Monday: [
      {
        time: "08:00 - 08:45",
        subject: "Mathematics",
        teacher: "Dr. Meera Kulkarni",
      },
      {
        time: "08:45 - 09:30",
        subject: "Physics",
        teacher: "Mr. Rajesh Patel",
      },
      {
        time: "09:30 - 10:15",
        subject: "Chemistry",
        teacher: "Dr. Priya Sharma",
      },
      { time: "10:15 - 10:30", subject: "BREAK", teacher: "" },
      {
        time: "10:30 - 11:15",
        subject: "English",
        teacher: "Ms. Anjali Verma",
      },
      {
        time: "11:15 - 12:00",
        subject: "Computer",
        teacher: "Mr. Vikram Singh",
      },
      {
        time: "12:00 - 12:45",
        subject: "Biology",
        teacher: "Dr. Suresh Kumar",
      },
      { time: "12:45 - 01:30", subject: "LUNCH", teacher: "" },
      {
        time: "01:30 - 02:15",
        subject: "History",
        teacher: "Prof. Anil Deshmukh",
      },
      {
        time: "02:15 - 03:00",
        subject: "Geography",
        teacher: "Ms. Kavita Reddy",
      },
    ],
    Tuesday: [
      {
        time: "08:00 - 08:45",
        subject: "Physics",
        teacher: "Mr. Rajesh Patel",
      },
      {
        time: "08:45 - 09:30",
        subject: "Mathematics",
        teacher: "Dr. Meera Kulkarni",
      },
      {
        time: "09:30 - 10:15",
        subject: "Biology",
        teacher: "Dr. Suresh Kumar",
      },
      { time: "10:15 - 10:30", subject: "BREAK", teacher: "" },
      {
        time: "10:30 - 11:15",
        subject: "Computer",
        teacher: "Mr. Vikram Singh",
      },
      {
        time: "11:15 - 12:00",
        subject: "English",
        teacher: "Ms. Anjali Verma",
      },
      {
        time: "12:00 - 12:45",
        subject: "Chemistry",
        teacher: "Dr. Priya Sharma",
      },
      { time: "12:45 - 01:30", subject: "LUNCH", teacher: "" },
      {
        time: "01:30 - 02:15",
        subject: "Geography",
        teacher: "Ms. Kavita Reddy",
      },
      {
        time: "02:15 - 03:00",
        subject: "Physical Education",
        teacher: "Coach Ramesh",
      },
    ],
    Wednesday: [
      {
        time: "08:00 - 08:45",
        subject: "Chemistry",
        teacher: "Dr. Priya Sharma",
      },
      {
        time: "08:45 - 09:30",
        subject: "Biology",
        teacher: "Dr. Suresh Kumar",
      },
      {
        time: "09:30 - 10:15",
        subject: "Mathematics",
        teacher: "Dr. Meera Kulkarni",
      },
      { time: "10:15 - 10:30", subject: "BREAK", teacher: "" },
      {
        time: "10:30 - 11:15",
        subject: "History",
        teacher: "Prof. Anil Deshmukh",
      },
      {
        time: "11:15 - 12:00",
        subject: "Physics",
        teacher: "Mr. Rajesh Patel",
      },
      {
        time: "12:00 - 12:45",
        subject: "English",
        teacher: "Ms. Anjali Verma",
      },
      { time: "12:45 - 01:30", subject: "LUNCH", teacher: "" },
      {
        time: "01:30 - 02:15",
        subject: "Computer",
        teacher: "Mr. Vikram Singh",
      },
      {
        time: "02:15 - 03:00",
        subject: "Geography",
        teacher: "Ms. Kavita Reddy",
      },
    ],
    Thursday: [
      {
        time: "08:00 - 08:45",
        subject: "English",
        teacher: "Ms. Anjali Verma",
      },
      {
        time: "08:45 - 09:30",
        subject: "Mathematics",
        teacher: "Dr. Meera Kulkarni",
      },
      {
        time: "09:30 - 10:15",
        subject: "Physics",
        teacher: "Mr. Rajesh Patel",
      },
      { time: "10:15 - 10:30", subject: "BREAK", teacher: "" },
      {
        time: "10:30 - 11:15",
        subject: "Biology",
        teacher: "Dr. Suresh Kumar",
      },
      {
        time: "11:15 - 12:00",
        subject: "Chemistry",
        teacher: "Dr. Priya Sharma",
      },
      {
        time: "12:00 - 12:45",
        subject: "Computer",
        teacher: "Mr. Vikram Singh",
      },
      { time: "12:45 - 01:30", subject: "LUNCH", teacher: "" },
      {
        time: "01:30 - 02:15",
        subject: "Physical Education",
        teacher: "Coach Ramesh",
      },
      {
        time: "02:15 - 03:00",
        subject: "History",
        teacher: "Prof. Anil Deshmukh",
      },
    ],
    Friday: [
      {
        time: "08:00 - 08:45",
        subject: "Computer",
        teacher: "Mr. Vikram Singh",
      },
      {
        time: "08:45 - 09:30",
        subject: "Chemistry",
        teacher: "Dr. Priya Sharma",
      },
      {
        time: "09:30 - 10:15",
        subject: "English",
        teacher: "Ms. Anjali Verma",
      },
      { time: "10:15 - 10:30", subject: "BREAK", teacher: "" },
      {
        time: "10:30 - 11:15",
        subject: "Mathematics",
        teacher: "Dr. Meera Kulkarni",
      },
      {
        time: "11:15 - 12:00",
        subject: "Physics",
        teacher: "Mr. Rajesh Patel",
      },
      {
        time: "12:00 - 12:45",
        subject: "Biology",
        teacher: "Dr. Suresh Kumar",
      },
      { time: "12:45 - 01:30", subject: "LUNCH", teacher: "" },
      {
        time: "01:30 - 02:15",
        subject: "Geography",
        teacher: "Ms. Kavita Reddy",
      },
      {
        time: "02:15 - 03:00",
        subject: "History",
        teacher: "Prof. Anil Deshmukh",
      },
    ],
    Saturday: [
      {
        time: "08:00 - 08:45",
        subject: "Biology",
        teacher: "Dr. Suresh Kumar",
      },
      {
        time: "08:45 - 09:30",
        subject: "Physics",
        teacher: "Mr. Rajesh Patel",
      },
      {
        time: "09:30 - 10:15",
        subject: "Mathematics",
        teacher: "Dr. Meera Kulkarni",
      },
      { time: "10:15 - 10:30", subject: "BREAK", teacher: "" },
      {
        time: "10:30 - 11:15",
        subject: "Geography",
        teacher: "Ms. Kavita Reddy",
      },
      {
        time: "11:15 - 12:00",
        subject: "History",
        teacher: "Prof. Anil Deshmukh",
      },
      {
        time: "12:00 - 12:45",
        subject: "Physical Education",
        teacher: "Coach Ramesh",
      },
    ],
  };

  const getSubjectStyle = (subject) => {
    return subjectColors[subject] || subjectColors.default;
  };

  const getTeacherInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get current timetable data (use state if available, otherwise use default)
  const currentTimetableData = timetableDataState || timetableData;

  return (
    <div className="space-y-6 pb-8 px-6 pt-6 max-w-full">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 z-9999 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
          <Save size={18} />
          <span className="font-semibold">Changes saved successfully!</span>
        </div>
      )}

      {/* Add Time Table Modal */}
      <TimeTableModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddTimetable}
        mode="add"
        subjects={subjects}
        teachers={teachers}
      />

      {/* Edit Time Table Modal */}
      <TimeTableModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveTimetable}
        initialData={timetableForm}
        mode="edit"
        subjects={subjects}
        teachers={teachers}
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Academic Management
          </h2>
          <p className="text-slate-600 flex items-center gap-2">
            <BookOpen size={16} className="text-indigo-600" />
            Manage schedules, curriculum, and AI-powered planning
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-md"
          >
            <option value="10th A">Class 10th A</option>
            <option value="10th B">Class 10th B</option>
            <option value="11th A">Class 11th A</option>
          </select>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-md"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-md"
          >
            <Plus size={18} />
            Add Timetable
          </button>

          {isAdmin && (
            <button
              onClick={handleOpenEditTimetable}
              className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-md"
            >
              <Edit2 size={18} />
              Edit Timetable
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-md"
          >
            <Save size={16} />
            Save Draft
          </button>
        </div>
      </div>

      {/* Timetable Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden w-full max-w-full">
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-linear-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Weekly Schedule
              </h3>
              <p className="text-sm text-slate-600">
                {selectedClass} - Academic Year 2025-26
              </p>
            </div>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="p-6 bg-slate-50/50 overflow-x-auto max-w-full">
          <div className="grid grid-cols-6 gap-4 min-w-max w-fit">
            {days.map((day) => (
              <div key={day} className="min-w-50">
                {/* Day Header */}
                <div className="sticky top-0 z-10 mb-4 pb-3 bg-slate-50/80 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide text-center">
                    {day}
                  </h4>
                  <div className="mt-1 h-1 w-12 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full mx-auto"></div>
                </div>

                {/* Schedule Cards */}
                <div className="space-y-3">
                  {currentTimetableData[day]?.map((slot, index) => {
                    if (slot.subject === "BREAK") {
                      return (
                        <div
                          key={index}
                          className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center"
                        >
                          <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                            ☕ Short Break
                          </p>
                          <p className="text-[10px] text-amber-600 mt-0.5">
                            {slot.time}
                          </p>
                        </div>
                      );
                    }

                    if (slot.subject === "LUNCH") {
                      return (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-linear-to-br from-orange-50 to-amber-50 border border-orange-200 text-center"
                        >
                          <p className="text-sm font-bold text-orange-700 uppercase tracking-wide">
                            🍽️ Lunch Break
                          </p>
                          <p className="text-xs text-orange-600 mt-1">
                            {slot.time}
                          </p>
                        </div>
                      );
                    }

                    const style = getSubjectStyle(slot.subject);
                    const initials = getTeacherInitials(slot.teacher);

                    return (
                      <div
                        key={index}
                        onClick={() => isAdmin && handleOpenEditTimetable()}
                        className={`group relative p-4 rounded-xl border ${
                          style.border
                        } ${
                          style.bg
                        } hover:shadow-md hover:scale-105 transition-all duration-200 ${
                          isAdmin ? "cursor-pointer" : "cursor-default"
                        }`}
                      >
                        {/* Time */}
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={14} className={style.text} />
                          <span className={`text-xs font-bold ${style.text}`}>
                            {slot.time}
                          </span>
                        </div>

                        {/* Subject */}
                        <h5
                          className={`text-sm font-bold ${style.text} mb-2 leading-tight`}
                        >
                          {slot.subject}
                        </h5>

                        {/* Teacher */}
                        <div className="flex items-center gap-2">
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 rounded-full ${style.bg} border-2 ${style.border} flex items-center justify-center shrink-0`}
                          >
                            <span
                              className={`text-[10px] font-bold ${style.text}`}
                            >
                              {initials}
                            </span>
                          </div>
                          <p
                            className={`text-xs font-medium ${style.text} opacity-80 truncate`}
                          >
                            {slot.teacher}
                          </p>
                        </div>

                        {/* Hover Effect Indicator */}
                        <div
                          className={`mt-2 pt-2 border-t ${style.border} opacity-0 group-hover:opacity-100 transition-opacity`}
                        >
                          <p
                            className={`text-[10px] ${style.text} text-center font-semibold`}
                          >
                            {isAdmin
                              ? "✏️ Click to Edit Schedule"
                              : "📖 View Details"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            💡{" "}
            <span className="font-semibold">
              {isAdmin
                ? "Admin Mode: Click 'Edit Timetable' button to configure class schedules and manage periods."
                : "View-Only Mode: Contact your administrator to request timetable changes."}
            </span>
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 w-full max-w-full">
        <h4 className="text-sm font-bold text-slate-700 mb-4">
          Subject Color Legend
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(subjectColors)
            .filter(([key]) => key !== "default")
            .map(([subject, style]) => (
              <div key={subject} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded ${style.bg} border ${style.border}`}
                ></div>
                <span className="text-xs font-medium text-slate-600">
                  {subject}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Academics;
