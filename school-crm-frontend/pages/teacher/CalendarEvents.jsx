import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  MapPin,
  Bell,
} from "lucide-react";

const CalendarEvents = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = [
    {
      id: "1",
      title: "Staff Meeting",
      date: "2024-03-15",
      time: "3:00 PM",
      type: "meeting",
      participants: "All Staff",
      location: "Conference Hall",
    },
    {
      id: "2",
      title: "Mid-term Exams",
      date: "2024-03-20",
      time: "9:00 AM",
      type: "exam",
      participants: "All Classes",
      location: "School Campus",
    },
    {
      id: "3",
      title: "Annual Day Rehearsal",
      date: "2024-03-25",
      time: "2:00 PM",
      type: "event",
      participants: "All Classes",
      location: "Auditorium",
    },
    {
      id: "4",
      title: "Parent-Teacher Meeting",
      date: "2024-03-18",
      time: "10:00 AM",
      type: "meeting",
      participants: "Teachers & Parents",
      location: "Classrooms",
    },
  ];

  const teachingSchedule = [
    {
      day: "Monday",
      classes: ["10th A - 9:00 AM", "11th B - 11:00 AM", "10th A - 2:00 PM"],
    },
    {
      day: "Tuesday",
      classes: ["11th B - 9:00 AM", "12th A - 11:00 AM", "10th A - 2:00 PM"],
    },
    {
      day: "Wednesday",
      classes: ["10th A - 9:00 AM", "11th B - 11:00 AM", "12th A - 3:30 PM"],
    },
    {
      day: "Thursday",
      classes: ["11th B - 9:00 AM", "10th A - 2:00 PM", "12th A - 3:30 PM"],
    },
    {
      day: "Friday",
      classes: [
        "10th A - 9:00 AM",
        "11th B - 11:00 AM",
        "Staff Meeting - 3:00 PM",
      ],
    },
  ];

  const getEventTypeColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "exam":
        return "bg-red-100 text-red-700 border-red-200";
      case "event":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

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

  const days = getDaysInMonth(currentDate);

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar & Events</h2>
          <p className="text-slate-500">
            View your teaching schedule and upcoming events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={previousMonth}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-lg font-bold min-w-[200px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-semibold text-slate-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isToday =
                day === new Date().getDate() &&
                currentDate.getMonth() === new Date().getMonth();
              return (
                <div
                  key={index}
                  className={`min-h-[80px] p-2 rounded-lg border-2 ${
                    isToday
                      ? "bg-indigo-50 border-indigo-300"
                      : day
                      ? "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                      : "border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday ? "text-indigo-600" : "text-slate-900"
                        }`}
                      >
                        {day}
                      </div>
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs px-1 py-0.5 rounded mb-1 truncate ${getEventTypeColor(
                            event.type
                          )}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-slate-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Bell className="text-indigo-600" size={20} />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-xl border-2 ${getEventTypeColor(
                  event.type
                )}`}
              >
                <h4 className="font-bold mb-2">{event.title}</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>{event.participants}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teaching Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold mb-4">Weekly Teaching Schedule</h3>
        <div className="space-y-3">
          {teachingSchedule.map((schedule, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="min-w-[100px] font-semibold text-slate-900">
                {schedule.day}
              </div>
              <div className="flex-1 flex flex-wrap gap-2">
                {schedule.classes.map((cls, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarEvents;
