import React, { useState, useEffect, useCallback } from "react";
import { generateTimetable } from "../services/geminiService";
import { MOCK_TEACHERS } from "../constants";
import TimeTableModal from "../components/TimeTableModal";
import {
  getTimetableByClass,
  createTimetable,
  updateTimetable,
  deleteTimetable,
} from "../api/timetableApi";
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
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const Academics = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [selectedClass, setSelectedClass] = useState("10th");
  const [selectedSection, setSelectedSection] = useState("A");
  const [userRole, setUserRole] = useState("");
  const [timetableDataState, setTimetableDataState] = useState(null);
  const [timetableId, setTimetableId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeDay, setActiveDay] = useState("Monday");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noTimetableFound, setNoTimetableFound] = useState(false);

  const [timetableForm, setTimetableForm] = useState({
    class: "10th",
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

  // Available classes for dropdown (1st to 10th)
  const availableClasses = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
  ];

  // Available sections for dropdown (A to D)
  const availableSections = ["A", "B", "C", "D"];

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "Student";
    setUserRole(role);
  }, []);

  // Fetch timetable when selected class or section changes
  const fetchTimetable = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setNoTimetableFound(false);

    try {
      // Combine class and section for API call
      const fullClassName = `${selectedClass} ${selectedSection}`;
      const response = await getTimetableByClass(
        fullClassName,
        selectedSection,
      );

      if (response.success && response.data) {
        // Convert backend format to frontend display format
        const backendData = response.data;
        const displayData = {};

        // Convert days data to display format
        const weekDays = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        weekDays.forEach((day) => {
          if (backendData.days && backendData.days[day]) {
            displayData[day] = backendData.days[day].map((period) => ({
              time: `${period.timeFrom} - ${period.timeTo}`,
              subject: period.subject,
              teacher: period.teacher,
            }));
          } else {
            displayData[day] = [];
          }
        });

        setTimetableDataState(displayData);
        setTimetableId(backendData._id);
        setNoTimetableFound(false);
      } else {
        // No timetable found for this class
        setTimetableDataState(null);
        setTimetableId(null);
        setNoTimetableFound(true);
      }
    } catch (err) {
      console.error("Error fetching timetable:", err);
      // Check if it's a 404 (no timetable found)
      if (err.message?.includes("No timetable found")) {
        setTimetableDataState(null);
        setTimetableId(null);
        setNoTimetableFound(true);
      } else {
        setError(err.message || "Failed to fetch timetable");
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

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
    userRole === "Super Admin" ||
    userRole === "SCHOOL_ADMIN" ||
    userRole === "SUPER_ADMIN";

  const handleEditClick = (day, index, period) => {
    if (!isAdmin) return;
    setEditingPeriod({ ...period, day, index });
    setShowEditModal(true);
  };

  const handleOpenEditTimetable = () => {
    if (!isAdmin) return;

    // Initialize form with current timetable data
    const formData = {
      class: `${selectedClass} ${selectedSection}`,
      section: selectedSection,
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
    };

    // Convert current timetable to form format
    if (timetableDataState) {
      weekDays.forEach((day) => {
        const dayData = timetableDataState[day] || [];
        formData.days[day] = dayData.map((slot, idx) => ({
          id: `${day}-${idx}`,
          subject: slot.subject,
          teacher: slot.teacher,
          timeFrom: slot.time.split(" - ")[0],
          timeTo: slot.time.split(" - ")[1],
        }));
      });
    }

    setTimetableForm(formData);
    setShowEditModal(true);
  };

  const handleOpenAddTimetable = () => {
    if (!isAdmin) return;

    // Initialize empty form for new timetable
    const formData = {
      class: `${selectedClass} ${selectedSection}`,
      section: selectedSection,
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
    };

    setTimetableForm(formData);
    setShowAddModal(true);
  };

  const handleSaveTimetable = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      if (timetableId) {
        // Update existing timetable
        const response = await updateTimetable(timetableId, data);

        if (response.success) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
          setShowEditModal(false);
          // Refresh timetable data
          await fetchTimetable();
        }
      } else {
        // Create new timetable
        const response = await createTimetable(data);

        if (response.success) {
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
          setShowEditModal(false);
          // Refresh timetable data
          await fetchTimetable();
        }
      }
    } catch (err) {
      console.error("Error saving timetable:", err);
      setError(err.message || "Failed to save timetable");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTimetable = async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Creating timetable with data:", data);
      const response = await createTimetable(data);
      console.log("Create timetable response:", response);

      if (response.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        setShowAddModal(false);
        // Refresh timetable data
        await fetchTimetable();
      } else {
        setError(response.message || "Failed to create timetable");
        setTimeout(() => setError(null), 5000);
      }
    } catch (err) {
      console.error("Error creating timetable:", err);
      const errorMessage = err.message || "Failed to create timetable";
      setError(errorMessage);
      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTimetable = async () => {
    if (!isAdmin || !timetableId) return;

    if (
      !confirm(
        `Are you sure you want to delete the timetable for Class ${selectedClass} Section ${selectedSection}?`,
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await deleteTimetable(timetableId);

      if (response.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        setTimetableDataState(null);
        setTimetableId(null);
        setNoTimetableFound(true);
      }
    } catch (err) {
      console.error("Error deleting timetable:", err);
      setError(err.message || "Failed to delete timetable");
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
    "Hindi",
    "Sanskrit",
    "Economics",
    "Political Science",
    "Accountancy",
    "Business Studies",
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
    "Mrs. Sunita Gupta",
    "Mr. Amit Joshi",
    "Dr. Neha Kapoor",
  ];

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

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
    Hindi: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
    },
    Sanskrit: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
    },
    Economics: {
      bg: "bg-lime-50",
      text: "text-lime-700",
      border: "border-lime-200",
    },
    "Political Science": {
      bg: "bg-fuchsia-50",
      text: "text-fuchsia-700",
      border: "border-fuchsia-200",
    },
    Accountancy: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
    },
    "Business Studies": {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
    },
    default: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
    },
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

  // Get current timetable data
  const currentTimetableData = timetableDataState;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Success Toast */}
        {saveSuccess && (
          <div className="fixed top-4 right-4 z-[9999] bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in">
            <Save size={18} />
            <span className="font-semibold">Changes saved successfully!</span>
          </div>
        )}

        {/* Error Toast */}
        {error && (
          <div className="fixed top-4 right-4 z-[9999] bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="font-semibold">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 hover:bg-red-600 rounded p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Add Time Table Modal */}
        <TimeTableModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddTimetable}
          initialData={timetableForm}
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
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Academic Management
            </h2>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" />
              Manage schedules, curriculum, and AI-powered planning
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {availableClasses.map((cls) => (
                <option key={cls} value={cls} className="text-gray-900">
                  {cls}
                </option>
              ))}
            </select>

            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {availableSections.map((section) => (
                <option key={section} value={section} className="text-gray-900">
                  Section {section}
                </option>
              ))}
            </select>

            <button
              onClick={fetchTimetable}
              disabled={isLoading}
              className="px-3 py-2 text-sm bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Printer size={16} />
              Print
            </button>

            {isAdmin && (
              <>
                {noTimetableFound ? (
                  <button
                    onClick={handleOpenAddTimetable}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    Add Timetable
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleOpenEditTimetable}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <Edit2 size={18} />
                      Edit Timetable
                    </button>
                    <button
                      onClick={handleDeleteTimetable}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Timetable Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden w-full max-w-full">
          {/* Card Header */}
          <div className="px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Weekly Schedule
                </h3>
                <p className="text-sm text-slate-600">
                  Class {selectedClass} Section {selectedSection} - Academic
                  Year 2025-26
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2
                size={48}
                className="text-indigo-600 animate-spin mb-4"
              />
              <p className="text-slate-600 font-medium">Loading timetable...</p>
            </div>
          )}

          {/* No Timetable Found State */}
          {!isLoading && noTimetableFound && (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Calendar size={40} className="text-slate-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-700 mb-2">
                No Timetable Found
              </h4>
              <p className="text-slate-500 text-center max-w-md mb-6">
                There is no timetable configured for Class {selectedClass}{" "}
                Section {selectedSection} yet.
                {isAdmin
                  ? " Click the button below to create one."
                  : " Please contact your administrator to set up the timetable."}
              </p>
              {isAdmin && (
                <button
                  onClick={handleOpenAddTimetable}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shadow-md"
                >
                  <Plus size={20} />
                  Create Timetable for {selectedClass} {selectedSection}
                </button>
              )}
            </div>
          )}

          {/* Timetable Grid */}
          {!isLoading && !noTimetableFound && currentTimetableData && (
            <>
              <div className="p-3 overflow-x-auto max-w-full">
                <div className="grid grid-cols-6 gap-2 min-w-max w-fit">
                  {days.map((day) => (
                    <div key={day} className="min-w-[140px]">
                      {/* Day Header */}
                      <div className="mb-3 pb-2 border-b border-slate-200">
                        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide text-center">
                          {day}
                        </h4>
                      </div>

                      {/* Schedule Cards */}
                      <div className="space-y-2">
                        {currentTimetableData[day]?.length > 0 ? (
                          currentTimetableData[day].map((slot, index) => {
                            if (slot.subject === "BREAK") {
                              return (
                                <div
                                  key={index}
                                  className="p-2 rounded border border-amber-200 text-center bg-amber-50"
                                >
                                  <p className="text-xs font-medium text-amber-700">
                                    ☕ Short Break
                                  </p>
                                  <p className="text-xs text-amber-600 mt-1">
                                    {slot.time}
                                  </p>
                                </div>
                              );
                            }

                            if (slot.subject === "LUNCH") {
                              return (
                                <div
                                  key={index}
                                  className="p-2 rounded border border-orange-200 text-center bg-orange-50"
                                >
                                  <p className="text-xs font-medium text-orange-700">
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
                                onClick={() =>
                                  isAdmin && handleOpenEditTimetable()
                                }
                                className={`p-2 rounded border ${
                                  style.border
                                } ${style.bg} hover:shadow-sm transition-all ${
                                  isAdmin ? "cursor-pointer" : "cursor-default"
                                }`}
                              >
                                {/* Time */}
                                <div className="flex items-center gap-1 mb-1">
                                  <Clock size={12} className={style.text} />
                                  <span className={`text-xs ${style.text}`}>
                                    {slot.time}
                                  </span>
                                </div>

                                {/* Subject */}
                                <h5
                                  className={`text-xs font-medium ${style.text} mb-1 leading-tight`}
                                >
                                  {slot.subject}
                                </h5>

                                {/* Teacher */}
                                <div className="flex items-center gap-1">
                                  {/* Avatar */}
                                  <div
                                    className={`w-5 h-5 rounded-full ${style.bg} border ${style.border} flex items-center justify-center shrink-0`}
                                  >
                                    <span
                                      className={`text-[9px] font-medium ${style.text}`}
                                    >
                                      {initials}
                                    </span>
                                  </div>
                                  <p
                                    className={`text-xs ${style.text} opacity-80 truncate`}
                                  >
                                    {slot.teacher}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-3 rounded border border-slate-200 text-center bg-slate-50">
                            <p className="text-xs text-slate-500">
                              No periods scheduled
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  💡{" "}
                  <span className="font-semibold">
                    {isAdmin
                      ? "Admin Mode: Click 'Edit Timetable' button to configure class schedules and manage periods."
                      : "View-Only Mode: Contact your administrator to request timetable changes."}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Academics;
