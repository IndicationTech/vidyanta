import React, { useState } from "react";
import {
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

const LeaveManagement = () => {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [leaveType, setLeaveType] = useState("medical");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const leaveTypes = [
    { value: "medical", label: "Medical Leave", icon: "🏥" },
    { value: "casual", label: "Casual Leave", icon: "📅" },
    { value: "emergency", label: "Emergency Leave", icon: "🚨" },
  ];

  const leaveHistory = [
    {
      id: "1",
      type: "Medical Leave",
      startDate: "2024-03-01",
      endDate: "2024-03-03",
      days: 3,
      reason: "Fever and cold",
      status: "approved",
      appliedDate: "2024-02-28",
    },
    {
      id: "2",
      type: "Casual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-15",
      days: 1,
      reason: "Personal work",
      status: "approved",
      appliedDate: "2024-02-14",
    },
    {
      id: "3",
      type: "Emergency Leave",
      startDate: "2024-02-10",
      endDate: "2024-02-10",
      days: 1,
      reason: "Family emergency",
      status: "approved",
      appliedDate: "2024-02-10",
    },
    {
      id: "4",
      type: "Medical Leave",
      startDate: "2024-03-20",
      endDate: "2024-03-22",
      days: 3,
      reason: "Dental appointment",
      status: "pending",
      appliedDate: "2024-03-15",
    },
  ];

  const leaveBalance = {
    medical: { total: 12, used: 3, remaining: 9 },
    casual: { total: 8, used: 1, remaining: 7 },
    emergency: { total: 5, used: 1, remaining: 4 },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleApplyLeave = () => {
    // Handle leave application

    setShowApplyForm(false);
    setReason("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-slate-500">
            Apply for leave and track your leave history
          </p>
        </div>
        <button
          onClick={() => setShowApplyForm(!showApplyForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Apply for Leave
        </button>
      </div>

      {/* Leave Balance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(leaveBalance).map(([type, balance]) => (
          <div
            key={type}
            className="bg-white p-5 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 capitalize">
                {type} Leave
              </h3>
              <FileText className="text-indigo-600" size={24} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total</span>
                <span className="font-medium">{balance.total} days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Used</span>
                <span className="font-medium text-orange-600">
                  {balance.used} days
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Remaining</span>
                <span className="font-bold text-green-600">
                  {balance.remaining} days
                </span>
              </div>
              <div className="mt-3 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${(balance.used / balance.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Apply Leave Form */}
      {showApplyForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-4">Apply for Leave</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Leave Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {leaveTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setLeaveType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      leaveType === type.value
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Please provide a reason for your leave..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleApplyLeave}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Application
              </button>
              <button
                onClick={() => setShowApplyForm(false)}
                className="px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold mb-4">Leave History</h3>
        <div className="space-y-3">
          {leaveHistory.map((leave) => (
            <div
              key={leave.id}
              className={`p-4 rounded-xl border-2 ${getStatusColor(
                leave.status
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-lg">{leave.type}</h4>
                  <p className="text-sm text-slate-600 mt-1">{leave.reason}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    leave.status
                  )}`}
                >
                  {leave.status === "approved" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} />
                      Approved
                    </span>
                  ) : leave.status === "rejected" ? (
                    <span className="flex items-center gap-1">
                      <XCircle size={12} />
                      Rejected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      Pending
                    </span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Start Date</span>
                  <p className="font-medium">{leave.startDate}</p>
                </div>
                <div>
                  <span className="text-slate-500">End Date</span>
                  <p className="font-medium">{leave.endDate}</p>
                </div>
                <div>
                  <span className="text-slate-500">Days</span>
                  <p className="font-medium">{leave.days} day(s)</p>
                </div>
                <div>
                  <span className="text-slate-500">Applied On</span>
                  <p className="font-medium">{leave.appliedDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaveManagement;
