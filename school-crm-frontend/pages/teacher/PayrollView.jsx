import React, { useState } from "react";
import {
  DollarSign,
  Download,
  Eye,
  EyeOff,
  FileText,
  Calendar,
  Building,
  CreditCard,
  Lock,
} from "lucide-react";

const PayrollView = () => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("2024-03");

  const payrollData = {
    basicSalary: 45000,
    hra: 13500,
    medicalAllowance: 5000,
    transportAllowance: 3000,
    pf: 5400,
    tax: 5000,
    netSalary: 56100,
    contractType: "Permanent",
    workShift: "Day Shift (9:00 AM - 4:00 PM)",
    epfNumber: "EPF/2024/001234",
    bankAccount: "****1234",
    bankName: "State Bank of India",
    ifscCode: "SBIN0001234",
  };

  const payslipHistory = [
    { month: "February 2024", amount: 56100, status: "Paid", date: "2024-02-28" },
    { month: "January 2024", amount: 56100, status: "Paid", date: "2024-01-28" },
    { month: "December 2023", amount: 56100, status: "Paid", date: "2023-12-28" },
    { month: "November 2023", amount: 56100, status: "Paid", date: "2023-11-28" },
  ];

  const handleDownloadPayslip = (month) => {
    console.log(`Downloading payslip for ${month}`);
  };

  const maskAccountNumber = (account) => {
    return account.replace(/\d(?=\d{4})/g, "*");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payroll Information</h2>
          <p className="text-slate-500">View your salary details and download payslips (Read-Only)</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Download size={18} />
            Download Payslip
          </button>
        </div>
      </div>

      {/* Salary Overview */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm mb-2">Net Salary (March 2024)</p>
            <h3 className="text-4xl font-bold">₹{payrollData.netSalary.toLocaleString()}</h3>
            <p className="text-indigo-100 text-sm mt-2">Contract Type: {payrollData.contractType}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <DollarSign size={48} className="opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-4">Salary Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-slate-700 font-medium">Basic Salary</span>
              <span className="font-bold text-green-600">₹{payrollData.basicSalary.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-slate-700 font-medium">HRA</span>
              <span className="font-bold text-blue-600">₹{payrollData.hra.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-slate-700 font-medium">Medical Allowance</span>
              <span className="font-bold text-purple-600">₹{payrollData.medicalAllowance.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="text-slate-700 font-medium">Transport Allowance</span>
              <span className="font-bold text-orange-600">₹{payrollData.transportAllowance.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg mb-2">
                <span className="text-slate-700 font-medium">Gross Salary</span>
                <span className="font-bold text-slate-900">
                  ₹{(payrollData.basicSalary + payrollData.hra + payrollData.medicalAllowance + payrollData.transportAllowance).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2">
                <span className="text-slate-700 font-medium">PF Deduction</span>
                <span className="font-bold text-red-600">-₹{payrollData.pf.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg mb-2">
                <span className="text-slate-700 font-medium">Tax Deduction</span>
                <span className="font-bold text-red-600">-₹{payrollData.tax.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg mt-4">
                <span className="text-slate-900 font-bold text-lg">Net Salary</span>
                <span className="font-bold text-indigo-600 text-lg">₹{payrollData.netSalary.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-4">Employment Details</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
              <Building className="text-indigo-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">Contract Type</p>
                <p className="font-medium">{payrollData.contractType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
              <Calendar className="text-indigo-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">Work Shift</p>
                <p className="font-medium">{payrollData.workShift}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg">
              <FileText className="text-indigo-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">EPF / PF Number</p>
                <p className="font-medium">{payrollData.epfNumber}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <CreditCard className="text-indigo-600" size={18} />
                  Bank Details
                </h4>
                <button
                  onClick={() => setShowBankDetails(!showBankDetails)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  {showBankDetails ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {showBankDetails ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Bank Name</span>
                    <span className="font-medium">{payrollData.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Account Number</span>
                    <span className="font-medium">{payrollData.bankAccount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">IFSC Code</span>
                    <span className="font-medium">{payrollData.ifscCode}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Bank Name</span>
                    <span className="font-medium">{payrollData.bankName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Account Number</span>
                    <span className="font-medium">{maskAccountNumber(payrollData.bankAccount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">IFSC Code</span>
                    <span className="font-medium">{payrollData.ifscCode}</span>
                  </div>
                </div>
              )}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <Lock size={12} />
                <span>Bank details are masked for security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payslip History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold mb-4">Payslip History</h3>
        <div className="space-y-3">
          {payslipHistory.map((payslip, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="font-semibold">{payslip.month}</p>
                  <p className="text-sm text-slate-500">Paid on {payslip.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-lg">₹{payslip.amount.toLocaleString()}</p>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {payslip.status}
                  </span>
                </div>
                <button
                  onClick={() => handleDownloadPayslip(payslip.month)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <Download size={16} />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayrollView;

