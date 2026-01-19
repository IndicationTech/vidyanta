import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Users,
  School,
  Plus,
  Search,
  MoreVertical,
  ShieldCheck,
  ArrowUpRight,
  Globe,
  Settings,
} from "lucide-react";

const ManageSchools = () => {
  const [schools, setSchools] = useState([
    {
      id: "SCH001",
      name: "St. Xavier High School",
      location: "Mumbai, MH",
      principal: "Dr. Robert Dsouza",
      students: 1250,
      staff: 85,
      status: "Active",
    },
    {
      id: "SCH002",
      name: "Global International School",
      location: "Bangalore, KA",
      principal: "Mrs. Anita Rao",
      students: 980,
      staff: 72,
      status: "Active",
    },
    {
      id: "SCH003",
      name: "Delhi Public Academy",
      location: "Delhi, NCR",
      principal: "Mr. Vivek Khanna",
      students: 2100,
      staff: 140,
      status: "Active",
    },
    {
      id: "SCH004",
      name: "Oakridge International",
      location: "Hyderabad, TS",
      principal: "Ms. Priya Reddy",
      students: 1500,
      staff: 110,
      status: "Maintenance",
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Manage Institutions
          </h2>
          <p className="text-slate-500">
            Global control panel for all registered schools under the network.
          </p>
        </div>
        <button className="flex items-center cursor-pointer gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
          <Plus size={18} />
          <span>Onboard New School</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schools.map((school) => (
          <div
            key={school.id}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <School size={24} />
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    school.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {school.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {school.name}
              </h3>
              <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
                <MapPin size={14} />
                {school.location}
              </p>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Students
                  </p>
                  <p className="text-lg font-bold text-slate-700">
                    {school.students.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Staff
                  </p>
                  <p className="text-lg font-bold text-slate-700">
                    {school.staff}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <ShieldCheck size={16} className="text-indigo-500" />
                  {school.principal}
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>

            <div className="bg-slate-50/50 px-6 py-3 flex items-center gap-4 border-t border-slate-50">
              <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline cursor-pointer">
                <Settings size={12} />
                Settings
              </button>
              <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:underline cursor-pointer">
                <Globe size={12} />
                Website
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Network Overview */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">Network Health Overview</h3>
          <p className="text-slate-400 max-w-xl mb-8">
            All institutions are currently performing within expected
            operational parameters. No critical system alerts found.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Total Institutions
              </p>
              <p className="text-4xl font-bold">12</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Total Users
              </p>
              <p className="text-4xl font-bold">24.5k</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Avg. Attendance
              </p>
              <p className="text-4xl font-bold text-emerald-400">94%</p>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">
                Total Revenue
              </p>
              <p className="text-4xl font-bold text-indigo-400">$2.4M</p>
            </div>
          </div>
        </div>

        {/* Abstract background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>
    </div>
  );
};

export default ManageSchools;
