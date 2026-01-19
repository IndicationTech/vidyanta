import React, { useState } from "react";
import { MOCK_STUDENTS } from "../../constants";
import {
  FileText,
  Download,
  Filter,
  Search,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";

const MarksManagement = () => {
  const [selectedClass, setSelectedClass] = useState("10th A");
  const [selectedExam, setSelectedExam] = useState("Mid-term");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = (useState < string) | (null > null);
  const [marks, setMarks] = useState < Record < string >> {};

  const examTypes = [
    "Mid-term",
    "Final",
    "Unit Test 1",
    "Unit Test 2",
    "Assignment",
  ];

  const students = MOCK_STUDENTS.map((student, index) => ({
    ...student,
    rollNo: index + 1,
    marks: Math.floor(Math.random() * 30) + 70,
    cgpa: ((Math.floor(Math.random() * 30) + 70) / 10).toFixed(2),
    status: Math.floor(Math.random() * 30) + 70 >= 40 ? "pass" : "fail",
  }));

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo.toString().includes(searchTerm)
  );

  const handleEditMarks = (studentId, currentMarks) => {
    setEditingId(studentId);
    setMarks({ ...marks, [studentId]: currentMarks });
  };

  const handleSaveMarks = (studentId) => {
    // Save marks logic
    setEditingId(null);
  };

  // const handleExport = (format) => {
  //   console.log(`Exporting to ${format}`);
  // };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Student Marks Management</h2>
          <p className="text-slate-500">Add, edit, and manage student marks</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport("pdf")}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export PDF
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Download size={18} />
            Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="10th A">10th A</option>
            <option value="11th B">11th B</option>
            <option value="12th A">12th A</option>
          </select>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Filter size={18} />
            More Filters
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Total Students</span>
            <FileText className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold">{filteredStudents.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Average Marks</span>
            <FileText className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {Math.round(
              filteredStudents.reduce((sum, s) => sum + s.marks, 0) /
                filteredStudents.length || 0
            )}
            %
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Passed</span>
            <CheckCircle className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {filteredStudents.filter((s) => s.status === "pass").length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-500">Failed</span>
            <XCircle className="text-red-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {filteredStudents.filter((s) => s.status === "fail").length}
          </p>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Roll No
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Student ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-slate-600">
                  Name
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-600">
                  Marks %
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-600">
                  CGPA
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-600">
                  Status
                </th>
                <th className="text-center py-4 px-6 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-4 px-6 text-sm font-medium">
                    {student.rollNo}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {student.id}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium">
                    {student.name}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {editingId === student.id ? (
                      <input
                        type="number"
                        value={marks[student.id] || student.marks}
                        onChange={(e) =>
                          setMarks({
                            ...marks,
                            [student.id]: parseInt(e.target.value),
                          })
                        }
                        className="w-20 px-2 py-1 border border-indigo-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        max={100}
                        min={0}
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {student.marks}%
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center text-sm font-medium">
                    {student.cgpa}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        student.status === "pass"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {student.status === "pass" ? (
                        <>
                          <CheckCircle size={12} className="mr-1" />
                          Pass
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="mr-1" />
                          Fail
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {editingId === student.id ? (
                      <button
                        onClick={() => handleSaveMarks(student.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleEditMarks(student.id, student.marks)
                        }
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-1 mx-auto"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {filteredStudents.length} of {students.length} students
          </p>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarksManagement;
