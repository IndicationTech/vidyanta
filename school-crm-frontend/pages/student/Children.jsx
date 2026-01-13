import React from "react";
import {
  User,
  BookOpen,
  Clock,
  Calendar,
  ChevronRight,
  Award,
  TrendingUp,
  FileText,
  Activity,
} from "lucide-react";

const Children = () => {
  const children = [
    {
      id: "C001",
      name: "Aarav Sharma",
      class: "10-A",
      attendance: "95%",
      grade: "A+",
      subjects: ["Math", "Science", "English"],
      nextExam: "Mathematics - June 24",
    },
    {
      id: "C002",
      name: "Ishita Sharma",
      class: "8-B",
      attendance: "92%",
      grade: "A",
      subjects: ["SST", "Arts", "Hindi"],
      nextExam: "History - June 26",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Children</h2>
          <p className="text-slate-500">
            Monitor academic progress and daily activities of your children.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children.map((child) => (
          <div
            key={child.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden border-t-4 border-t-indigo-500"
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <User size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {child.name}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Student ID: {child.id} • Class {child.class}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Attendance
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {child.attendance}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Avg Grade
                  </p>
                  <p className="text-lg font-bold text-indigo-600">
                    {child.grade}
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                    Rank
                  </p>
                  <p className="text-lg font-bold text-slate-700">#4</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Upcoming Exams
                      </p>
                      <p className="text-xs text-slate-500">{child.nextExam}</p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Performance Tracking
                      </p>
                      <p className="text-xs text-slate-500">
                        View detailed analytics
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Report Cards
                      </p>
                      <p className="text-xs text-slate-500">
                        Download Term 1 results
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-300 group-hover:text-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600"
                    >
                      {child.subjects[i][0]}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    +2
                  </div>
                </div>
                <button className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  View Full Profile
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add another child notice */}
        <div className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-indigo-300 transition-colors">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:text-indigo-500 transition-colors shadow-sm">
            <Plus size={24} />
          </div>
          <p className="font-bold text-slate-600">Link Another Student</p>
          <p className="text-sm text-slate-400 max-w-[200px] mt-1">
            If you have another child in the school, link their ID here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Children;
