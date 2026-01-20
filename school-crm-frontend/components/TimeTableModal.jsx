import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2, Copy, AlertCircle } from "lucide-react";

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

    const newPeriod = {
      id: `${day}-${Date.now()}`,
      subject: subjects?.[0] || "Mathematics",
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

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full my-4">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {mode === "add" ? "Add Time Table" : "Edit Time Table"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {mode === "add"
                ? "Create a new timetable for a class"
                : `Editing timetable for ${formData.class}`}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* Validation Error */}
        {validationError && (
          <div className="mx-4 mt-3 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <span className="text-sm font-medium">{validationError}</span>
          </div>
        )}

        {/* Form Content */}
        <div className="p-4">
          {/* Top Grid - Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            {/* Class */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.class}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    class: e.target.value,
                  })
                }
                placeholder="e.g., 10th A"
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={mode === "edit"}
              />
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Section
              </label>
              <select
                value={formData.section}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    section: e.target.value,
                  })
                }
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                disabled={mode === "edit"}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* Period Start Time */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Period Start Time
              </label>
              <select
                value={formData.periodStartTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    periodStartTime: e.target.value,
                  })
                }
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="07:00">07:00 AM</option>
                <option value="07:30">07:30 AM</option>
                <option value="08:00">08:00 AM</option>
                <option value="08:30">08:30 AM</option>
                <option value="09:00">09:00 AM</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Duration (minutes)
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: e.target.value,
                  })
                }
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="60">60</option>
              </select>
            </div>
          </div>

          {/* Weekly Tabs */}
          <div className="border-b border-slate-200 mb-4">
            <div className="flex gap-1 overflow-x-auto">
              {weekDays.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    activeDay === day
                      ? "text-indigo-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {day}
                  {formData.days[day]?.length > 0 && (
                    <span className="ml-1 px-1 py-0.5 text-xs bg-indigo-100 text-indigo-600 rounded-full">
                      {formData.days[day].length}
                    </span>
                  )}
                  {activeDay === day && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Day-wise Schedule Entry */}
          <div className="bg-slate-50 rounded min-h-[250px] max-h-[350px] overflow-y-auto">
            {/* Copy to all days button */}
            {formData.days[activeDay]?.length > 0 && (
              <div className="mb-3 flex justify-end">
                <button
                  onClick={() => handleCopyToAllDays(activeDay)}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Copy size={14} />
                  Copy to all days
                </button>
              </div>
            )}

            <div className="space-y-2">
              {formData.days[activeDay]?.map((period) => (
                <div
                  key={period.id}
                  className={`bg-white rounded p-2 flex items-center gap-2 ${
                    period.subject === "BREAK" || period.subject === "LUNCH"
                      ? "border border-dashed border-amber-300 bg-amber-50"
                      : "border border-slate-200"
                  }`}
                >
                  {period.subject === "BREAK" || period.subject === "LUNCH" ? (
                    <>
                      {/* Break/Lunch Display */}
                      <div className="flex-1">
                        <span className="text-sm font-bold text-amber-700">
                          {period.subject === "BREAK"
                            ? "☕ Short Break"
                            : "🍽️ Lunch Break"}
                        </span>
                      </div>

                      {/* Time From */}
                      <div className="w-24">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
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
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time To */}
                      <div className="w-24">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
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
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Subject */}
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={period.subject}
                          onChange={(e) =>
                            handleUpdatePeriod(
                              activeDay,
                              period.id,
                              "subject",
                              e.target.value,
                            )
                          }
                          placeholder="Enter subject name"
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      {/* Teacher */}
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Teacher
                        </label>
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
                          placeholder="Enter teacher name"
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      {/* Time From */}
                      <div className="w-24">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
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
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Time To */}
                      <div className="w-24">
                        <label className="block text-xs font-medium text-slate-600 mb-1">
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
                          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        >
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeletePeriod(activeDay, period.id)}
                    className="p-1 hover:bg-red-50 rounded transition-colors mt-5"
                    title="Delete period"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              ))}

              {/* Add New Button */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleAddPeriod(activeDay)}
                  className="flex-1 py-2 px-3 border border-dashed border-slate-300 rounded text-xs font-medium text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1"
                >
                  <Plus size={16} />
                  Add Period
                </button>
                <button
                  onClick={() => handleAddBreak(activeDay, "BREAK")}
                  className="py-2 px-3 border border-dashed border-amber-300 rounded text-xs font-medium text-amber-600 hover:border-amber-400 hover:text-amber-700 hover:bg-amber-50 transition-all flex items-center justify-center gap-1"
                >
                  ☕ Break
                </button>
                <button
                  onClick={() => handleAddBreak(activeDay, "LUNCH")}
                  className="py-2 px-3 border border-dashed border-orange-300 rounded text-xs font-medium text-orange-600 hover:border-orange-400 hover:text-orange-700 hover:bg-orange-50 transition-all flex items-center justify-center gap-1"
                >
                  🍽️ Lunch
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-3 py-2 text-xs border border-slate-300 rounded text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-3 py-2 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : mode === "add" ? (
              "Add Time Table"
            ) : (
              "Save Time Table"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTableModal;
