import React, { useState, useEffect, useCallback } from "react";
import { getProfile } from "../api/profileApi";
import { generateTimetable } from "../services/geminiService";
import { MOCK_TEACHERS } from "../constants";
import TimeTableModal from "../components/TimeTableModal";
import {
  getTimetableByClass,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getTimetableByTeacher,
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
  const [teacherData, setTeacherData] = useState(null);
  const [teacherTimetableLoading, setTeacherTimetableLoading] = useState(false);
  const [teacherPeriods, setTeacherPeriods] = useState([]);

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

  // Fetch teacher data if user is a teacher
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (userRole === "Teacher") {
        try {
          const userId = localStorage.getItem("userId");
          if (!userId) return;

          const response = await getProfile(userId);
          setTeacherData(response.data);
        } catch (error) {
          console.error("Error fetching teacher profile:", error);
          // Fallback to mock data
          setTeacherData({
            name: "Bhumika Sutar",
            subjects: ["Mathematics", "Physics"],
            classes: ["Class 10A", "Class 10B", "Class 9C"],
          });
        }
      }
    };

    if (userRole === "Teacher") {
      fetchTeacherData();
    }
  }, [userRole]);

  // Fetch teacher's timetable periods when teacher data is loaded
  useEffect(() => {
    const fetchTeacherTimetable = async () => {
      if (!teacherData?.name) return;

      try {
        setTeacherTimetableLoading(true);
        const response = await getTimetableByTeacher(teacherData.name);

        if (response.success) {
          setTeacherPeriods(response.data);
        }
      } catch (error) {
        console.error("Error fetching teacher timetable:", error);
        // Fallback to mock data
        setTeacherPeriods([
          {
            class: "10A",
            section: "A",
            day: "Monday",
            subject: "Mathematics",
            teacher: teacherData.name,
            timeFrom: "09:00",
            timeTo: "09:45",
          },
          {
            class: "10B",
            section: "B",
            day: "Monday",
            subject: "Physics",
            teacher: teacherData.name,
            timeFrom: "11:00",
            timeTo: "11:45",
          },
          {
            class: "9C",
            section: "C",
            day: "Tuesday",
            subject: "Mathematics",
            teacher: teacherData.name,
            timeFrom: "14:00",
            timeTo: "14:45",
          },
          {
            class: "10A",
            section: "A",
            day: "Wednesday",
            subject: "Physics",
            teacher: teacherData.name,
            timeFrom: "15:30",
            timeTo: "16:15",
          },
        ]);
      } finally {
        setTeacherTimetableLoading(false);
      }
    };

    if (teacherData) {
      fetchTeacherTimetable();
    }
  }, [teacherData]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* FULL WIDTH FIXED WRAPPER */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
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
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Academic Management
            </h2>
            <p className="text-sm text-slate-600 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-600" />
              Manage schedules, curriculum, and AI-powered planning
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap justify-start xl:justify-end w-full xl:w-auto">
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
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden w-full">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar size={24} className="text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    Weekly Schedule
                  </h3>
                  <p className="text-sm text-slate-600">
                    Class <span className="font-semibold">{selectedClass}</span>{" "}
                    • Section{" "}
                    <span className="font-semibold">{selectedSection}</span> •{" "}
                    <span className="text-slate-500">2025-26</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm">
                  {isAdmin ? "Admin Mode" : "View Only"}
                </span>
              </div>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2
                size={48}
                className="text-indigo-600 animate-spin mb-4"
              />
              <p className="text-slate-700 font-semibold">
                Loading timetable...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Fetching schedule for Class {selectedClass} - {selectedSection}
              </p>
            </div>
          )}

          {/* No timetable */}
          {!isLoading && noTimetableFound && (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Calendar size={48} className="text-slate-400" />
              </div>

              <h4 className="text-2xl font-bold text-slate-800 mb-2">
                No Timetable Found
              </h4>

              <p className="text-slate-500 text-center max-w-md mb-8">
                Timetable is not configured for{" "}
                <span className="font-semibold text-slate-700">
                  Class {selectedClass} • Section {selectedSection}
                </span>
                .
                {isAdmin
                  ? " Create one now to start scheduling periods."
                  : " Please contact your administrator."}
              </p>

              {isAdmin && (
                <button
                  onClick={handleOpenAddTimetable}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-[1.03] transition-all flex items-center gap-2 shadow-md"
                >
                  <Plus size={20} />
                  Create Timetable
                </button>
              )}
            </div>
          )}

          {/* Timetable Grid */}
          {!isLoading && !noTimetableFound && currentTimetableData && (
            <>
              <div className="p-4 sm:p-6">
                {/* Horizontal Scroll Wrapper */}
                <div className="w-full overflow-x-auto pb-3 -mx-2 px-2">
                  <div
                    className="
            grid grid-flow-col gap-4 w-max
            auto-cols-[85%]
            sm:auto-cols-[calc((100%-16px)/2)]
            md:auto-cols-[calc((100%-32px)/3)]
            xl:auto-cols-[calc((100%-48px)/4)]
          "
                  >
                    {days.map((day) => (
                      <div
                        key={day}
                        className="
                rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white
                shadow-sm overflow-hidden flex flex-col
                h-[420px] sm:h-[460px] lg:h-[500px]
              "
                      >
                        {/* Day Header */}
                        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
                          <h4 className="text-sm font-bold text-slate-800">
                            {day}
                          </h4>

                          <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-500">
                            {currentTimetableData[day]?.length || 0} slots
                          </span>
                        </div>

                        {/* Slots */}
                        <div className="p-3 sm:p-4 space-y-2 overflow-y-auto flex-1 pr-2 thin-scrollbar">
                          {currentTimetableData[day]?.length > 0 ? (
                            currentTimetableData[day].map((slot, index) => {
                              if (slot.subject === "BREAK") {
                                return (
                                  <div
                                    key={index}
                                    className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 flex items-center justify-between"
                                  >
                                    <div>
                                      <p className="text-xs font-bold text-amber-800">
                                        ☕ Break
                                      </p>
                                      <p className="text-[11px] text-amber-700">
                                        {slot.time}
                                      </p>
                                    </div>
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-amber-200 text-amber-700">
                                      Rest
                                    </span>
                                  </div>
                                );
                              }

                              if (slot.subject === "LUNCH") {
                                return (
                                  <div
                                    key={index}
                                    className="p-2.5 rounded-xl border border-orange-200 bg-orange-50 flex items-center justify-between"
                                  >
                                    <div>
                                      <p className="text-xs font-bold text-orange-800">
                                        🍽️ Lunch
                                      </p>
                                      <p className="text-[11px] text-orange-700">
                                        {slot.time}
                                      </p>
                                    </div>
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-white border border-orange-200 text-orange-700">
                                      Break
                                    </span>
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
                                  className={`group p-2.5 rounded-2xl border ${style.border} ${style.bg}
                        hover:shadow-md hover:-translate-y-[1px] transition-all duration-200
                        ${isAdmin ? "cursor-pointer" : "cursor-default"}`}
                                >
                                  {/* Time */}
                                  <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                      <Clock size={12} className={style.text} />
                                      <span
                                        className={`text-[11px] font-semibold ${style.text}`}
                                      >
                                        {slot.time}
                                      </span>
                                    </div>

                                    <span
                                      className={`text-[10px] px-2 py-0.5 rounded-full bg-white/70 border ${style.border} ${style.text}`}
                                    >
                                      Period
                                    </span>
                                  </div>

                                  {/* Subject */}
                                  <h5
                                    className={`text-sm font-bold ${style.text} leading-tight`}
                                  >
                                    {slot.subject}
                                  </h5>

                                  {/* Teacher */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <div
                                      className={`w-7 h-7 rounded-full bg-white border ${style.border} flex items-center justify-center shrink-0 shadow-sm`}
                                    >
                                      <span
                                        className={`text-[10px] font-bold ${style.text}`}
                                      >
                                        {initials}
                                      </span>
                                    </div>

                                    <div className="min-w-0">
                                      <p
                                        className={`text-[11px] ${style.text} opacity-90 truncate`}
                                      >
                                        {slot.teacher}
                                      </p>
                                      <p className="text-[10px] text-slate-500 truncate">
                                        Assigned Teacher
                                      </p>
                                    </div>
                                  </div>

                                  {isAdmin && (
                                    <p className="text-[10px] text-slate-500 mt-2 opacity-0 group-hover:opacity-100 transition">
                                      Click to edit timetable
                                    </p>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center bg-white">
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

                <p className="text-xs text-slate-500 mt-3 text-center">
                  👉 Scroll horizontally to view more days
                </p>
              </div>

              {/* Footer Note */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center">
                  💡{" "}
                  <span className="font-semibold">
                    {isAdmin
                      ? "Admin Mode: Use Edit Timetable to configure subjects and teachers."
                      : "View-Only Mode: Contact administrator for changes."}
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
