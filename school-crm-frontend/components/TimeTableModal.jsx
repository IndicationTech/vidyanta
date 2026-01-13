import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const TimeTableModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
  subjects,
  teachers,
}) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [activeDay, setActiveDay] = useState("Monday");

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
      },
    }
  );

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData(initialData);
    }
  }, [initialData, isOpen]);

  const handleAddPeriod = (day) => {
    const newPeriod = {
      id: `${day}-${Date.now()}`,
      subject: subjects?.[0] || "",
      teacher: teachers?.[0] || "",
      timeFrom: "08:00",
      timeTo: "08:45",
    };

    setFormData((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: [...prev.days[day], newPeriod],
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
          p.id === periodId ? { ...p, [field]: value } : p
        ),
      },
    }));
  };

  const handleSubmit = () => {
    if (!formData.class.trim()) {
      alert("Please enter a class name");
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full my-8 animate-scale-in">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Add Time Table" : "Edit Time Table"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Top Grid - Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {/* Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Class
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            {/* Subject Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Subject Group
              </label>
              <select
                value={formData.subjectGroup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    subjectGroup: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
              </select>
            </div>

            {/* Period Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
          <div className="border-b border-gray-200 mb-4">
            <div className="flex gap-1 overflow-x-auto">
              {weekDays.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    activeDay === day
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {day}
                  {activeDay === day && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Day-wise Schedule Entry */}
          <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
            <div className="space-y-3">
              {formData.days[activeDay]?.map((period) => (
                <div
                  key={period.id}
                  className="bg-white rounded-lg p-3 flex items-center gap-3"
                >
                  {/* Subject */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Subject
                    </label>
                    <select
                      value={period.subject}
                      onChange={(e) =>
                        handleUpdatePeriod(
                          activeDay,
                          period.id,
                          "subject",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {subjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Teacher */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Teacher
                    </label>
                    <select
                      value={period.teacher}
                      onChange={(e) =>
                        handleUpdatePeriod(
                          activeDay,
                          period.id,
                          "teacher",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {teachers.map((teacher) => (
                        <option key={teacher} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time From */}
                  <div className="w-32">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Time From
                    </label>
                    <select
                      value={period.timeFrom}
                      onChange={(e) =>
                        handleUpdatePeriod(
                          activeDay,
                          period.id,
                          "timeFrom",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return [
                          <option key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </option>,
                          <option key={`${hour}:30`} value={`${hour}:30`}>
                            {hour}:30
                          </option>,
                        ];
                      })}
                    </select>
                  </div>

                  {/* Time To */}
                  <div className="w-32">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Time To
                    </label>
                    <select
                      value={period.timeTo}
                      onChange={(e) =>
                        handleUpdatePeriod(
                          activeDay,
                          period.id,
                          "timeTo",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, "0");
                        return [
                          <option key={`${hour}:00`} value={`${hour}:00`}>
                            {hour}:00
                          </option>,
                          <option key={`${hour}:30`} value={`${hour}:30`}>
                            {hour}:30
                          </option>,
                        ];
                      })}
                    </select>
                  </div>

                  {/* Delete Icon */}
                  <button
                    onClick={() => handleDeletePeriod(activeDay, period.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors mt-5"
                    title="Delete period"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              ))}

              {/* Add New Button */}
              <button
                onClick={() => handleAddPeriod(activeDay)}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {mode === "add" ? "Add Time Table" : "Save Time Table"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTableModal;
