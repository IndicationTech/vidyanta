import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, Copy, AlertCircle } from "lucide-react";

// Class-wise subjects data
const classSubjects = {
  "1st": [
    "English",
    "Hindi ",
    "Marathi",
    "Mathematics",
    "EVS (Environmental Studies)",
    "General Knowledge (GK)",
    "Computer",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "2nd": [
    "English",
    "Hindi",
    "Marathi",
    "Mathematics",
    "EVS (Environmental Studies)",
    "General Knowledge (GK)",
    "Computer",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "3rd": [
    "English",
    "Hindi ",
    "Marathi",
    "Mathematics",
    "EVS (Environmental Studies)",
    "General Knowledge (GK)",
    "Computer",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "4th": [
    "English",
    "Hindi ",
    "Marathi",
    "Mathematics",
    "EVS (Environmental Studies)",
    "General Knowledge (GK)",
    "Computer",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "5th": [
    "English",
    "Hindi ",
    "Marathi",
    "Mathematics",
    "EVS (Environmental Studies)",
    "General Knowledge (GK)",
    "Computer",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "6th": [
    "English",
    "Hindi ",
    "Marathi",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "7th": [
    "English",
    "Hindi",
    "Marathi",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "8th": [
    "English",
    "Hindi",
    "Marathi",
    "Mathematics",
    "Science",
    "Social Science",
    "Computer / IT",
    "Art & Craft",
    "Physical Education (PT)",
    "Moral Science / Value Education",
  ],
  "9th": [
    "English",
    "Hindi ",
    "Marathi",
    "Mathematics",
    "Science",
    "Social Science",
    "Information Technology (IT)",
    "Physical Education (PT)",
    "Value Education",
  ],
  "10th": [
    "English",
    "Hindi ",
    "Marathi",
    "Mathematics",
    "Science",
    "Social Science",
    "Information Technology (IT)",
    "Physical Education (PT)",
    "Value Education",
  ],
};

const TimeTableModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  subjects,
  teachers,
}) => {
  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [activeDay, setActiveDay] = useState("Monday");
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const [formData, setFormData] = useState(
    initialData || {
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
        Saturday: [],
      },
    },
  );

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(initialData);
      setValidationError(null);
    }
  }, [initialData, isOpen]);

  // Reset active day when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveDay("Monday");
      setValidationError(null);
    }
  }, [isOpen]);

  const handleAddPeriod = (day) => {
    // Get the last period's end time to set as the new period's start time
    const dayPeriods = formData.days[day] || [];
    let defaultTimeFrom = formData.periodStartTime || "08:00";
    let defaultTimeTo = "08:45";

    if (dayPeriods.length > 0) {
      const lastPeriod = dayPeriods[dayPeriods.length - 1];
      defaultTimeFrom = lastPeriod.timeTo;
      // Calculate end time based on duration
      const duration = parseInt(formData.duration) || 45;
      const [hours, minutes] = defaultTimeFrom.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + duration;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      defaultTimeTo = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
    }

    // Get default subject based on class
    const classNumber = formData.class.split(" ")[0] || "10th";
    const availableSubjects = classSubjects[classNumber] || [
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

    const newPeriod = {
      id: `${day}-${Date.now()}`,
      subject: availableSubjects[0] || "Mathematics",
      teacher: teachers?.[0] || "",
      timeFrom: defaultTimeFrom,
      timeTo: defaultTimeTo,
    };

    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...(prev.days[day] || []), newPeriod],
      },
    }));
  };

  const handleDeletePeriod = (day, periodId) => {
    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].filter((p) => p.id !== periodId),
      },
    }));
  };

  const handleUpdatePeriod = (day, periodId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: prev.days[day].map((p) =>
          p.id === periodId ? { ...p, [field]: value } : p,
        ),
      },
    }));
  };

  const handleCopyToAllDays = (sourceDay) => {
    const sourcePeriods = formData.days[sourceDay] || [];
    if (sourcePeriods.length === 0) {
      setValidationError(`No periods to copy from ${sourceDay}`);
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    const updatedDays = { ...formData.days };
    weekDays.forEach((day) => {
      if (day !== sourceDay) {
        updatedDays[day] = sourcePeriods.map((period, index) => ({
          ...period,
          id: `${day}-${Date.now()}-${index}`,
        }));
      }
    });

    setFormData((prev) => ({
      ...prev,
      days: updatedDays,
    }));
  };

  const handleAddBreak = (day, type = "BREAK") => {
    const dayPeriods = formData.days[day] || [];
    let defaultTimeFrom = "10:15";
    let defaultTimeTo = "10:30";

    if (type === "LUNCH") {
      defaultTimeFrom = "12:45";
      defaultTimeTo = "13:30";
    }

    if (dayPeriods.length > 0) {
      const lastPeriod = dayPeriods[dayPeriods.length - 1];
      defaultTimeFrom = lastPeriod.timeTo;
      const breakDuration = type === "LUNCH" ? 45 : 15;
      const [hours, minutes] = defaultTimeFrom.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + breakDuration;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      defaultTimeTo = `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
    }

    const newBreak = {
      id: `${day}-${type}-${Date.now()}`,
      subject: type,
      teacher: "",
      timeFrom: defaultTimeFrom,
      timeTo: defaultTimeTo,
    };

    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...(prev.days[day] || []), newBreak],
      },
    }));
  };

  const validateForm = () => {
    if (!formData.class.trim()) {
      setValidationError("Please enter a class name");
      return false;
    }

    // Check if at least one day has periods
    const hasPeriods = weekDays.some(
      (day) => formData.days[day] && formData.days[day].length > 0,
    );

    if (!hasPeriods) {
      setValidationError("Please add at least one period to the timetable");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setValidationError(null);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      setValidationError(error.message || "Failed to save timetable");
    } finally {
      setIsSaving(false);
    }
  };

  // Generate time options
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 6; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push(timeStr);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  if (!isOpen) return null;

  // return (
  //   <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center overflow-y-auto p-4">
  //     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-4 transform transition-all scale-100 max-h-[90vh] flex flex-col">
  //       {/* Modal Header */}
  //       <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
  //         <div>
  //           <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
  //             <div className="w-3 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded"></div>
  //             {mode === "add" ? "Add Time Table" : "Edit Time Table"}
  //           </h3>
  //           <p className="text-sm text-slate-500 mt-2">
  //             {mode === "add"
  //               ? "Create a new timetable for a class"
  //               : `Editing timetable for ${formData.class}`}
  //           </p>
  //         </div>
  //         <button
  //           onClick={onClose}
  //           disabled={isSaving}
  //           className="p-2 hover:bg-slate-100 rounded-full transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //         >
  //           <X size={24} className="text-slate-500" />
  //         </button>
  //       </div>

  //       {/* Validation Error */}
  //       {validationError && (
  //         <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 shadow-sm animate-pulse">
  //           <AlertCircle size={20} />
  //           <span className="text-sm font-medium">{validationError}</span>
  //         </div>
  //       )}

  //       {/* Form Content */}
  //       <div className="p-6 flex-1 overflow-y-auto">
  //         {/* Top Grid - Form Fields */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  //           {/* Class */}
  //           <div>
  //             <label className="block text-sm font-medium text-slate-700 mb-2">
  //               Class <span className="text-red-500">*</span>
  //             </label>
  //             <input
  //               type="text"
  //               value={formData.class}
  //               onChange={(e) =>
  //                 setFormData({
  //                   ...formData,
  //                   class: e.target.value,
  //                 })
  //               }
  //               placeholder="e.g., 10th A"
  //               className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
  //               disabled={mode === "edit"}
  //             />
  //           </div>

  //           {/* Section */}
  //           <div>
  //             <label className="block text-sm font-medium text-slate-700 mb-2">
  //               Section
  //             </label>
  //             <select
  //               value={formData.section}
  //               onChange={(e) =>
  //                 setFormData({
  //                   ...formData,
  //                   section: e.target.value,
  //                 })
  //               }
  //               className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all shadow-sm"
  //               disabled={mode === "edit"}
  //             >
  //               <option value="A">A</option>
  //               <option value="B">B</option>
  //               <option value="C">C</option>
  //               <option value="D">D</option>
  //             </select>
  //           </div>

  //           {/* Period Start Time */}
  //           <div>
  //             <label className="block text-sm font-medium text-slate-700 mb-2">
  //               Period Start Time
  //             </label>
  //             <select
  //               value={formData.periodStartTime}
  //               onChange={(e) =>
  //                 setFormData({
  //                   ...formData,
  //                   periodStartTime: e.target.value,
  //                 })
  //               }
  //               className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all shadow-sm"
  //             >
  //               <option value="07:00">07:00 AM</option>
  //               <option value="07:30">07:30 AM</option>
  //               <option value="08:00">08:00 AM</option>
  //               <option value="08:30">08:30 AM</option>
  //               <option value="09:00">09:00 AM</option>
  //             </select>
  //           </div>

  //           {/* Duration */}
  //           <div>
  //             <label className="block text-sm font-medium text-slate-700 mb-2">
  //               Duration (minutes)
  //             </label>
  //             <select
  //               value={formData.duration}
  //               onChange={(e) =>
  //                 setFormData({
  //                   ...formData,
  //                   duration: e.target.value,
  //                 })
  //               }
  //               className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all shadow-sm"
  //             >
  //               <option value="30">30</option>
  //               <option value="40">40</option>
  //               <option value="45">45</option>
  //               <option value="50">50</option>
  //               <option value="60">60</option>
  //             </select>
  //           </div>
  //         </div>

  //         {/* Weekly Tabs */}
  //         <div className="border-b border-slate-100 mb-6">
  //           <div className="flex gap-2 overflow-x-auto">
  //             {weekDays.map((day) => (
  //               <button
  //                 key={day}
  //                 onClick={() => setActiveDay(day)}
  //                 className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-all relative ${
  //                   activeDay === day
  //                     ? "text-indigo-600 bg-indigo-50"
  //                     : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
  //                 }`}
  //               >
  //                 {day}
  //                 {formData.days[day]?.length > 0 && (
  //                   <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-full">
  //                     {formData.days[day].length}
  //                   </span>
  //                 )}
  //                 {activeDay === day && (
  //                   <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
  //                 )}
  //               </button>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Day-wise Schedule Entry */}
  //         <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl min-h-[250px] max-h-[450px] overflow-y-auto p-4">
  //           {/* Copy to all days button */}
  //           {formData.days[activeDay]?.length > 0 && (
  //             <div className="mb-4 flex justify-end">
  //               <button
  //                 onClick={() => handleCopyToAllDays(activeDay)}
  //                 className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all flex items-center gap-2 shadow-sm"
  //               >
  //                 <Copy size={16} />
  //                 Copy to all days
  //               </button>
  //             </div>
  //           )}

  //           <div className="space-y-3">
  //             {formData.days[activeDay]?.map((period) => (
  //               <div
  //                 key={period.id}
  //                 className={`bg-white rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all hover:shadow-lg transform hover:-translate-y-1 ${
  //                   period.subject === "BREAK" || period.subject === "LUNCH"
  //                     ? "border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 to-amber-100"
  //                     : "border border-slate-200"
  //                 }`}
  //               >
  //                 {period.subject === "BREAK" || period.subject === "LUNCH" ? (
  //                   <>
  //                     {/* Break/Lunch Display */}
  //                     <div className="flex-1 w-full">
  //                       <span className="text-lg font-bold text-amber-700">
  //                         {period.subject === "BREAK"
  //                           ? "☕ Short Break"
  //                           : "🍽️ Lunch Break"}
  //                       </span>
  //                     </div>

  //                     {/* Time From */}
  //                     <div className="w-full sm:w-32">
  //                       <label className="block text-xs font-medium text-slate-600 mb-1">
  //                         From
  //                       </label>
  //                       <select
  //                         value={period.timeFrom}
  //                         onChange={(e) =>
  //                           handleUpdatePeriod(
  //                             activeDay,
  //                             period.id,
  //                             "timeFrom",
  //                             e.target.value,
  //                           )
  //                         }
  //                         className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
  //                       >
  //                         {timeOptions.map((time) => (
  //                           <option key={time} value={time}>
  //                             {time}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     </div>

  //                     {/* Time To */}
  //                     <div className="w-full sm:w-32">
  //                       <label className="block text-xs font-medium text-slate-600 mb-1">
  //                         To
  //                       </label>
  //                       <select
  //                         value={period.timeTo}
  //                         onChange={(e) =>
  //                           handleUpdatePeriod(
  //                             activeDay,
  //                             period.id,
  //                             "timeTo",
  //                             e.target.value,
  //                           )
  //                         }
  //                         className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
  //                       >
  //                         {timeOptions.map((time) => (
  //                           <option key={time} value={time}>
  //                             {time}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     </div>

  //                     {/* Delete Button */}
  //                     <button
  //                       onClick={() => handleDeletePeriod(activeDay, period.id)}
  //                       className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
  //                       title="Delete break"
  //                     >
  //                       <Trash2 size={18} />
  //                     </button>
  //                   </>
  //                 ) : (
  //                   <>
  //                     {/* Subject */}
  //                     <div className="flex-1 w-full">
  //                       <label className="block text-xs font-medium text-slate-600 mb-1">
  //                         Subject
  //                       </label>
  //                       {/* Extract class number from formData.class (e.g., "10th" → "10th") */}
  //                       {(() => {
  //                         // Extract class number from format like "10th A" or "10th"
  //                         const classNumber =
  //                           formData.class.split(" ")[0] || "10th";
  //                         const availableSubjects = classSubjects[
  //                           classNumber
  //                         ] || [
  //                           "Mathematics",
  //                           "Physics",
  //                           "Chemistry",
  //                           "Biology",
  //                           "English",
  //                           "Computer",
  //                           "History",
  //                           "Geography",
  //                           "Physical Education",
  //                           "Hindi",
  //                           "Sanskrit",
  //                           "Economics",
  //                           "Political Science",
  //                           "Accountancy",
  //                           "Business Studies",
  //                         ];

  //                         return (
  //                           <div className="relative">
  //                             <select
  //                               value={period.subject}
  //                               onChange={(e) =>
  //                                 handleUpdatePeriod(
  //                                   activeDay,
  //                                   period.id,
  //                                   "subject",
  //                                   e.target.value,
  //                                 )
  //                               }
  //                               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
  //                             >
  //                               {availableSubjects.map((subject) => (
  //                                 <option key={subject} value={subject}>
  //                                   {subject}
  //                                 </option>
  //                               ))}
  //                               <option value="custom">
  //                                 Custom Subject...
  //                               </option>
  //                             </select>
  //                             {/* Custom subject input */}
  //                             {period.subject === "custom" && (
  //                               <div className="mt-2">
  //                                 <input
  //                                   type="text"
  //                                   placeholder="Enter custom subject name"
  //                                   onKeyDown={(e) => {
  //                                     if (e.key === "Enter") {
  //                                       // Handle Enter key if needed
  //                                     }
  //                                   }}
  //                                   onBlur={(e) => {
  //                                     if (e.target.value.trim() === "") {
  //                                       // If input is empty, reset to first subject
  //                                       const firstSubject =
  //                                         availableSubjects[0] || "Mathematics";
  //                                       handleUpdatePeriod(
  //                                         activeDay,
  //                                         period.id,
  //                                         "subject",
  //                                         firstSubject,
  //                                       );
  //                                     }
  //                                   }}
  //                                   onChange={(e) => {
  //                                     const newValue = e.target.value.trim();
  //                                     if (newValue) {
  //                                       handleUpdatePeriod(
  //                                         activeDay,
  //                                         period.id,
  //                                         "subject",
  //                                         newValue,
  //                                       );
  //                                     }
  //                                   }}
  //                                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
  //                                   autoFocus
  //                                 />
  //                               </div>
  //                             )}
  //                           </div>
  //                         );
  //                       })()}
  //                     </div>

  //                     {/* Teacher */}
  //                     <div className="flex-1 w-full">
  //                       <label className="block text-xs font-medium text-slate-600 mb-1">
  //                         Teacher
  //                       </label>
  //                       <input
  //                         type="text"
  //                         value={period.teacher}
  //                         onChange={(e) =>
  //                           handleUpdatePeriod(
  //                             activeDay,
  //                             period.id,
  //                             "teacher",
  //                             e.target.value,
  //                           )
  //                         }
  //                         placeholder="Enter teacher name"
  //                         className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
  //                       />
  //                     </div>

  //                     {/* Time From */}
  //                     <div className="w-full sm:w-32">
  //                       <label className="block text-xs font-medium text-slate-600 mb-1">
  //                         From
  //                       </label>
  //                       <select
  //                         value={period.timeFrom}
  //                         onChange={(e) =>
  //                           handleUpdatePeriod(
  //                             activeDay,
  //                             period.id,
  //                             "timeFrom",
  //                             e.target.value,
  //                           )
  //                         }
  //                         className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
  //                       >
  //                         {timeOptions.map((time) => (
  //                           <option key={time} value={time}>
  //                             {time}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     </div>

  //                     {/* Time To */}
  //                     <div className="w-full sm:w-32">
  //                       <label className="block text-xs font-medium text-slate-600 mb-1">
  //                         To
  //                       </label>
  //                       <select
  //                         value={period.timeTo}
  //                         onChange={(e) =>
  //                           handleUpdatePeriod(
  //                             activeDay,
  //                             period.id,
  //                             "timeTo",
  //                             e.target.value,
  //                           )
  //                         }
  //                         className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all"
  //                       >
  //                         {timeOptions.map((time) => (
  //                           <option key={time} value={time}>
  //                             {time}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     </div>

  //                     {/* Delete Button */}
  //                     <button
  //                       onClick={() => handleDeletePeriod(activeDay, period.id)}
  //                       className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
  //                       title="Delete period"
  //                     >
  //                       <Trash2 size={18} />
  //                     </button>
  //                   </>
  //                 )}
  //               </div>
  //             ))}
  //           </div>

  //           {/* Empty State */}
  //           {(!formData.days[activeDay] ||
  //             formData.days[activeDay].length === 0) && (
  //             <div className="text-center py-12 text-slate-500">
  //               <div className="text-4xl mb-4">📚</div>
  //               <p className="text-lg font-medium mb-2">No periods added yet</p>
  //               <p className="text-sm">
  //                 Start adding periods to create your timetable
  //               </p>
  //             </div>
  //           )}

  //           {/* Add Periods Section */}
  //           <div className="mt-6 flex flex-wrap gap-3">
  //             <button
  //               onClick={() => handleAddPeriod(activeDay)}
  //               className="flex-1 min-w-[150px] px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
  //             >
  //               <Plus size={18} />
  //               Add Period
  //             </button>
  //             <button
  //               onClick={() => handleAddBreak(activeDay, "BREAK")}
  //               className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
  //             >
  //               ☕ Break
  //             </button>
  //             <button
  //               onClick={() => handleAddBreak(activeDay, "LUNCH")}
  //               className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
  //             >
  //               🍽️ Lunch
  //             </button>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Modal Footer */}
  //       <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
  //         <div className="text-sm text-slate-500 text-center sm:text-left">
  //           {mode === "add"
  //             ? "Fill in all required fields to create the timetable"
  //             : "Make changes and save to update the timetable"}
  //         </div>
  //         <div className="flex gap-3">
  //           <button
  //             onClick={onClose}
  //             disabled={isSaving}
  //             className="px-3 sm:px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50"
  //           >
  //             Cancel
  //           </button>
  //           <button
  //             onClick={handleSubmit}
  //             disabled={isSaving}
  //             className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
  //           >
  //             {isSaving ? (
  //               <>
  //                 <Loader2 size={16} className="animate-spin" />
  //                 Saving...
  //               </>
  //             ) : (
  //               "Save Timetable"
  //             )}
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  //   return (
  //   <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
  //     {/* Backdrop */}
  //     <div
  //       className="absolute inset-0 bg-black/50"
  //       onClick={isSaving ? undefined : onClose}
  //     />

  //     {/* Modal */}
  //     <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">

  //       {/* Header */}
  //       <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
  //         <div>
  //           <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
  //             {mode === "add" ? "Add Time Table" : "Edit Time Table"}
  //           </h2>
  //           <p className="text-xs sm:text-sm text-slate-500 mt-1">
  //             {mode === "add"
  //               ? "Create a timetable for a class"
  //               : `Editing timetable for ${formData.class}`}
  //           </p>
  //         </div>

  //         <button
  //           onClick={onClose}
  //           disabled={isSaving}
  //           className="p-2 rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
  //         >
  //           <X size={18} className="text-slate-600" />
  //         </button>
  //       </div>

  //       {/* Error */}
  //       {validationError && (
  //         <div className="px-5 sm:px-6 pt-4">
  //           <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-2">
  //             <AlertCircle size={18} />
  //             <span className="text-sm font-medium">{validationError}</span>
  //           </div>
  //         </div>
  //       )}

  //       {/* Body (ONLY SCROLL HERE) */}
  //       <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">

  //         {/* Form Fields */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  //           <div>
  //             <label className="block text-xs font-medium text-slate-600 mb-1">
  //               Class <span className="text-red-500">*</span>
  //             </label>
  //             <input
  //               type="text"
  //               value={formData.class}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, class: e.target.value })
  //               }
  //               placeholder="e.g., 10th A"
  //               disabled={mode === "edit"}
  //               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50"
  //             />
  //           </div>

  //           <div>
  //             <label className="block text-xs font-medium text-slate-600 mb-1">
  //               Section
  //             </label>
  //             <select
  //               value={formData.section}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, section: e.target.value })
  //               }
  //               disabled={mode === "edit"}
  //               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-50"
  //             >
  //               <option value="A">A</option>
  //               <option value="B">B</option>
  //               <option value="C">C</option>
  //               <option value="D">D</option>
  //             </select>
  //           </div>

  //           <div>
  //             <label className="block text-xs font-medium text-slate-600 mb-1">
  //               Period Start
  //             </label>
  //             <select
  //               value={formData.periodStartTime}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, periodStartTime: e.target.value })
  //               }
  //               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
  //             >
  //               <option value="07:00">07:00 AM</option>
  //               <option value="07:30">07:30 AM</option>
  //               <option value="08:00">08:00 AM</option>
  //               <option value="08:30">08:30 AM</option>
  //               <option value="09:00">09:00 AM</option>
  //             </select>
  //           </div>

  //           <div>
  //             <label className="block text-xs font-medium text-slate-600 mb-1">
  //               Duration
  //             </label>
  //             <select
  //               value={formData.duration}
  //               onChange={(e) =>
  //                 setFormData({ ...formData, duration: e.target.value })
  //               }
  //               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
  //             >
  //               <option value="30">30 min</option>
  //               <option value="40">40 min</option>
  //               <option value="45">45 min</option>
  //               <option value="50">50 min</option>
  //               <option value="60">60 min</option>
  //             </select>
  //           </div>
  //         </div>

  //         {/* Sticky Tabs */}
  //         <div className="sticky top-0 bg-white z-10 pt-2 border-b border-slate-200">
  //           <div className="flex gap-2 overflow-x-auto pb-3">
  //             {weekDays.map((day) => (
  //               <button
  //                 key={day}
  //                 onClick={() => setActiveDay(day)}
  //                 className={`px-3 py-2 text-sm rounded-lg border transition whitespace-nowrap ${
  //                   activeDay === day
  //                     ? "bg-slate-900 text-white border-slate-900"
  //                     : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
  //                 }`}
  //               >
  //                 {day}
  //                 {formData.days[day]?.length > 0 && (
  //                   <span
  //                     className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
  //                       activeDay === day
  //                         ? "bg-white/20 text-white"
  //                         : "bg-slate-100 text-slate-700"
  //                     }`}
  //                   >
  //                     {formData.days[day].length}
  //                   </span>
  //                 )}
  //               </button>
  //             ))}
  //           </div>
  //         </div>

  //         {/* Schedule Section */}
  //         <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">

  //           {/* Toolbar */}
  //           <div className="px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50">
  //             <div>
  //               <p className="text-sm font-semibold text-slate-900">
  //                 {activeDay} Schedule
  //               </p>
  //               <p className="text-xs text-slate-500">
  //                 {formData.days[activeDay]?.length || 0} entries
  //               </p>
  //             </div>

  //             <div className="flex flex-wrap gap-2">
  //               <button
  //                 onClick={() => handleAddPeriod(activeDay)}
  //                 className="px-3 py-2 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition flex items-center gap-2"
  //               >
  //                 <Plus size={16} />
  //                 Period
  //               </button>

  //               <button
  //                 onClick={() => handleAddBreak(activeDay, "BREAK")}
  //                 className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition"
  //               >
  //                 Break
  //               </button>

  //               <button
  //                 onClick={() => handleAddBreak(activeDay, "LUNCH")}
  //                 className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition"
  //               >
  //                 Lunch
  //               </button>

  //               {formData.days[activeDay]?.length > 0 && (
  //                 <button
  //                   onClick={() => handleCopyToAllDays(activeDay)}
  //                   className="px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition flex items-center gap-2"
  //                 >
  //                   <Copy size={16} />
  //                   Copy All
  //                 </button>
  //               )}
  //             </div>
  //           </div>

  //           {/* Table Header */}
  //           <div className="hidden lg:grid grid-cols-[60px_1.2fr_1.2fr_130px_130px_50px] gap-3 px-5 py-3 text-xs font-semibold text-slate-500 bg-white border-b border-slate-200">
  //             <div>#</div>
  //             <div>Subject</div>
  //             <div>Teacher</div>
  //             <div>From</div>
  //             <div>To</div>
  //             <div className="text-center">Del</div>
  //           </div>

  //           {/* Rows */}
  //           <div className="divide-y divide-slate-200">
  //             {formData.days[activeDay]?.map((period, idx) => {
  //               const isBreak =
  //                 period.subject === "BREAK" || period.subject === "LUNCH";

  //               const classNumber = formData.class.split(" ")[0] || "10th";
  //               const availableSubjects = classSubjects[classNumber] || [
  //                 "Mathematics",
  //               ];

  //               return (
  //                 <div
  //                   key={period.id}
  //                   className={`grid grid-cols-1 lg:grid-cols-[60px_1.2fr_1.2fr_130px_130px_50px] gap-3 px-4 sm:px-5 py-4 lg:py-3 items-center ${
  //                     isBreak ? "bg-slate-50" : "bg-white"
  //                   }`}
  //                 >
  //                   {/* Index */}
  //                   <div className="flex items-center gap-2">
  //                     <span className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
  //                       {idx + 1}
  //                     </span>
  //                     {isBreak && (
  //                       <span className="text-xs px-2 py-1 rounded-full bg-slate-200 text-slate-700 font-medium">
  //                         {period.subject}
  //                       </span>
  //                     )}
  //                   </div>

  //                   {/* Subject */}
  //                   <div>
  //                     <label className="lg:hidden block text-xs text-slate-500 mb-1">
  //                       Subject
  //                     </label>

  //                     {isBreak ? (
  //                       <input
  //                         disabled
  //                         value={period.subject === "BREAK" ? "Break" : "Lunch"}
  //                         className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white cursor-not-allowed"
  //                       />
  //                     ) : (
  //                       <select
  //                         value={period.subject}
  //                         onChange={(e) =>
  //                           handleUpdatePeriod(
  //                             activeDay,
  //                             period.id,
  //                             "subject",
  //                             e.target.value
  //                           )
  //                         }
  //                         className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
  //                       >
  //                         {availableSubjects.map((s) => (
  //                           <option key={s} value={s}>
  //                             {s}
  //                           </option>
  //                         ))}
  //                       </select>
  //                     )}
  //                   </div>

  //                   {/* Teacher */}
  //                   <div>
  //                     <label className="lg:hidden block text-xs text-slate-500 mb-1">
  //                       Teacher
  //                     </label>

  //                     {isBreak ? (
  //                       <input
  //                         disabled
  //                         value="-"
  //                         className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white cursor-not-allowed"
  //                       />
  //                     ) : (
  //                       <input
  //                         type="text"
  //                         value={period.teacher}
  //                         onChange={(e) =>
  //                           handleUpdatePeriod(
  //                             activeDay,
  //                             period.id,
  //                             "teacher",
  //                             e.target.value
  //                           )
  //                         }
  //                         placeholder="Teacher name"
  //                         className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //                       />
  //                     )}
  //                   </div>

  //                   {/* From */}
  //                   <div>
  //                     <label className="lg:hidden block text-xs text-slate-500 mb-1">
  //                       From
  //                     </label>
  //                     <select
  //                       value={period.timeFrom}
  //                       onChange={(e) =>
  //                         handleUpdatePeriod(
  //                           activeDay,
  //                           period.id,
  //                           "timeFrom",
  //                           e.target.value
  //                         )
  //                       }
  //                       className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
  //                     >
  //                       {timeOptions.map((time) => (
  //                         <option key={time} value={time}>
  //                           {time}
  //                         </option>
  //                       ))}
  //                     </select>
  //                   </div>

  //                   {/* To */}
  //                   <div>
  //                     <label className="lg:hidden block text-xs text-slate-500 mb-1">
  //                       To
  //                     </label>
  //                     <select
  //                       value={period.timeTo}
  //                       onChange={(e) =>
  //                         handleUpdatePeriod(
  //                           activeDay,
  //                           period.id,
  //                           "timeTo",
  //                           e.target.value
  //                         )
  //                       }
  //                       className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
  //                     >
  //                       {timeOptions.map((time) => (
  //                         <option key={time} value={time}>
  //                           {time}
  //                         </option>
  //                       ))}
  //                     </select>
  //                   </div>

  //                   {/* Delete */}
  //                   <div className="flex justify-end lg:justify-center">
  //                     <button
  //                       onClick={() => handleDeletePeriod(activeDay, period.id)}
  //                       className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
  //                       title="Delete"
  //                     >
  //                       <Trash2 size={18} />
  //                     </button>
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </div>

  //           {/* Empty */}
  //           {(!formData.days[activeDay] ||
  //             formData.days[activeDay].length === 0) && (
  //             <div className="text-center py-12 text-slate-500">
  //               <p className="text-sm font-semibold text-slate-700">
  //                 No entries for {activeDay}
  //               </p>
  //               <p className="text-xs text-slate-500 mt-1">
  //                 Click <b>Period</b> to start.
  //               </p>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {/* Footer */}
  //       <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
  //         <p className="text-xs sm:text-sm text-slate-500">
  //           {mode === "add"
  //             ? "Fill required fields and save timetable"
  //             : "Update and save changes"}
  //         </p>

  //         <div className="flex gap-2">
  //           <button
  //             onClick={onClose}
  //             disabled={isSaving}
  //             className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 transition text-sm disabled:opacity-50"
  //           >
  //             Cancel
  //           </button>

  //           <button
  //             onClick={handleSubmit}
  //             disabled={isSaving}
  //             className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm flex items-center gap-2 disabled:opacity-50"
  //           >
  //             {isSaving ? (
  //               <>
  //                 <Loader2 size={16} className="animate-spin" />
  //                 Saving...
  //               </>
  //             ) : (
  //               "Save"
  //             )}
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={isSaving ? undefined : onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                TT
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  {mode === "add" ? "Add Time Table" : "Edit Time Table"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  {mode === "add"
                    ? "Build timetable quickly with smart layout"
                    : `Editing timetable for ${formData.class}`}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-2 rounded-xl hover:bg-white/60 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <X size={18} className="text-slate-700" />
            </button>
          </div>
        </div>

        {/* Error */}
        {validationError && (
          <div className="px-5 sm:px-6 pt-4">
            <div className="p-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 flex items-center gap-2">
              <AlertCircle size={18} />
              <span className="text-sm font-semibold">{validationError}</span>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) =>
                  setFormData({ ...formData, class: e.target.value })
                }
                placeholder="e.g., 10th A"
                disabled={mode === "edit"}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                disabled={mode === "edit"}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-slate-50 shadow-sm"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Period Start
              </label>
              <select
                value={formData.periodStartTime}
                onChange={(e) =>
                  setFormData({ ...formData, periodStartTime: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              >
                <option value="07:00">07:00 AM</option>
                <option value="07:30">07:30 AM</option>
                <option value="08:00">08:00 AM</option>
                <option value="08:30">08:30 AM</option>
                <option value="09:00">09:00 AM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              >
                <option value="30">30 min</option>
                <option value="40">40 min</option>
                <option value="45">45 min</option>
                <option value="50">50 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="sticky top-0 bg-white z-10 pt-2 pb-3 border-b border-slate-200">
            <div className="flex gap-2 overflow-x-auto">
              {weekDays.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full border transition whitespace-nowrap ${
                    activeDay === day
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {day}
                  {formData.days[day]?.length > 0 && (
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                        activeDay === day
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {formData.days[day].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Box */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="px-4 sm:px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-slate-900">
                  {activeDay} Schedule
                </p>
                <p className="text-xs text-slate-500">
                  {formData.days[activeDay]?.length || 0} entries
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleAddPeriod(activeDay)}
                  className="px-3 py-2 text-sm rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  Period
                </button>

                <button
                  onClick={() => handleAddBreak(activeDay, "BREAK")}
                  className="px-3 py-2 text-sm rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 transition shadow-sm"
                >
                  Break
                </button>

                <button
                  onClick={() => handleAddBreak(activeDay, "LUNCH")}
                  className="px-3 py-2 text-sm rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 transition shadow-sm"
                >
                  Lunch
                </button>

                {formData.days[activeDay]?.length > 0 && (
                  <button
                    onClick={() => handleCopyToAllDays(activeDay)}
                    className="px-3 py-2 text-sm rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 transition shadow-sm flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Copy
                  </button>
                )}
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-200">
              {formData.days[activeDay]?.map((period, idx) => {
                const isBreak =
                  period.subject === "BREAK" || period.subject === "LUNCH";

                const classNumber = formData.class.split(" ")[0] || "10th";
                const availableSubjects = classSubjects[classNumber] || [
                  "Mathematics",
                ];

                return (
                  <div
                    key={period.id}
                    className={`group px-4 sm:px-5 py-4 grid grid-cols-1 lg:grid-cols-[70px_1.2fr_1.2fr_140px_140px_50px] gap-3 items-center transition ${
                      isBreak ? "bg-amber-50/70" : "bg-white"
                    } hover:bg-indigo-50/50`}
                  >
                    {/* Index */}
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {idx + 1}
                      </span>

                      {isBreak && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${
                            period.subject === "BREAK"
                              ? "bg-amber-200 text-amber-900"
                              : "bg-green-200 text-green-900"
                          }`}
                        >
                          {period.subject}
                        </span>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="lg:hidden block text-xs text-slate-500 mb-1">
                        Subject
                      </label>

                      {isBreak ? (
                        <input
                          disabled
                          value={period.subject === "BREAK" ? "Break" : "Lunch"}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white cursor-not-allowed"
                        />
                      ) : (
                        <select
                          value={period.subject}
                          onChange={(e) =>
                            handleUpdatePeriod(
                              activeDay,
                              period.id,
                              "subject",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                        >
                          {availableSubjects.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Teacher */}
                    <div>
                      <label className="lg:hidden block text-xs text-slate-500 mb-1">
                        Teacher
                      </label>

                      {isBreak ? (
                        <input
                          disabled
                          value="-"
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-2xl text-sm bg-white cursor-not-allowed"
                        />
                      ) : (
                        <input
                          type="text"
                          value={period.teacher}
                          onChange={(e) =>
                            handleUpdatePeriod(
                              activeDay,
                              period.id,
                              "teacher",
                              e.target.value,
                            )
                          }
                          placeholder="Teacher name"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                        />
                      )}
                    </div>

                    {/* From */}
                    <div>
                      <label className="lg:hidden block text-xs text-slate-500 mb-1">
                        From
                      </label>
                      <select
                        value={period.timeFrom}
                        onChange={(e) =>
                          handleUpdatePeriod(
                            activeDay,
                            period.id,
                            "timeFrom",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* To */}
                    <div>
                      <label className="lg:hidden block text-xs text-slate-500 mb-1">
                        To
                      </label>
                      <select
                        value={period.timeTo}
                        onChange={(e) =>
                          handleUpdatePeriod(
                            activeDay,
                            period.id,
                            "timeTo",
                            e.target.value,
                          )
                        }
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Delete */}
                    <div className="flex justify-end lg:justify-center">
                      <button
                        onClick={() => handleDeletePeriod(activeDay, period.id)}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty */}
            {(!formData.days[activeDay] ||
              formData.days[activeDay].length === 0) && (
              <div className="text-center py-12 text-slate-500">
                <p className="text-sm font-semibold text-slate-800">
                  No entries for {activeDay}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Click <b>Period</b> to start.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-slate-500">
            {mode === "add"
              ? "Fill required fields and save timetable"
              : "Update and save changes"}
          </p>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 transition text-sm disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTableModal;
