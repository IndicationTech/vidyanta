import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  getAllStudents,
  createStudent,
  createBulkStudents,
  updateStudent,
  deleteStudent,
} from "../api/studentApi";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  MapPin,
  Download,
  Upload,
  Trash2,
  Edit,
  CheckCircle2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

const Students = () => {
  const [showModal, setShowModal] = useState(false);
  const [entryMode, setEntryMode] = useState("manual"); // "manual" or "auto"
  const [uploadedFile, setUploadedFile] = useState(null);
  const [failedRows, setFailedRows] = useState([]);
  const [showUploadResult, setShowUploadResult] = useState(false);
  const [uploadStats, setUploadStats] = useState({ success: 0, failed: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    roll: "",
    parent: "",
    email: "",
    password: "",
  });

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      if (response.success) {
        setStudents(response.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Failed to fetch students. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await createStudent(formData);

      if (response.success) {
        alert("Student created successfully!");
        await fetchStudents(); // Refresh the list
        setShowModal(false);
        setEntryMode("manual");
        setUploadedFile(null);
        setFormData({
          name: "",
          class: "",
          section: "",
          roll: "",
          parent: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.error("Error creating student:", error);
      console.error("Full error object:", JSON.stringify(error, null, 2));
      alert(error.message || "Failed to create student. Please try again.");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        Name: "Aarav Sharma",
        Class: "10",
        Section: "A",
        Roll: "01",
        Parent: "Rajesh Sharma",
        Email: "aarav@school.com",
        Password: "password123",
      },
      {
        Name: "Ishita Patel",
        Class: "9",
        Section: "B",
        Roll: "15",
        Parent: "Sanjay Patel",
        Email: "ishita@school.com",
        Password: "password123",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Template");
    XLSX.writeFile(wb, "Student_Upload_Template.xlsx");
  };

  const downloadFailedRows = () => {
    if (failedRows.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(failedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failed Entries");
    XLSX.writeFile(wb, "Failed_Student_Entries.xlsx");
  };

  const handleAutoSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) {
      alert("Please upload a file");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (jsonData.length === 0) {
            alert(
              "The uploaded file is empty. Please add student data and try again."
            );
            return;
          }

          // Prepare students array for bulk upload
          const studentsToUpload = [];
          const invalidRows = [];

          for (const row of jsonData) {
            const name = row.Name || row.name || "";
            const studentClass = row.Class || row.class || "";

            if (!name || !studentClass) {
              invalidRows.push(row);
              continue;
            }

            studentsToUpload.push({
              name: name,
              class: studentClass.toString(),
              section: (row.Section || row.section || "A").toString(),
              roll: (row.Roll || row.roll || "").toString(),
              parent: row.Parent || row.parent || "",
              email: row.Email || row.email || "",
              password: row.Password || row.password || "password123",
            });
          }

          // Call bulk API
          const response = await createBulkStudents(studentsToUpload);

          if (response.success) {
            await fetchStudents(); // Refresh the list

            const failedData = [...invalidRows];
            if (
              response.data.failedEntries &&
              response.data.failedEntries.length > 0
            ) {
              response.data.failedEntries.forEach((entry) => {
                failedData.push(entry.data);
              });
            }

            setFailedRows(failedData);
            setUploadStats({
              success: response.data.successCount,
              failed: response.data.failedCount + invalidRows.length,
            });

            setShowModal(false);
            setEntryMode("manual");
            setUploadedFile(null);
            setShowUploadResult(true);

            if (failedData.length > 0) {
              setTimeout(() => {
                setShowUploadResult(false);
              }, 10000);
            } else {
              setFailedRows([]);
              setTimeout(() => {
                setShowUploadResult(false);
              }, 5000);
            }
          }
        } catch (parseError) {
          console.error("Parse error:", parseError);
          alert(
            "Failed to parse the file. Please ensure it's a valid Excel/CSV file."
          );
        }
      };

      reader.readAsArrayBuffer(uploadedFile);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.message || "Failed to process the file. Please try again.");
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      searchQuery === "" ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.parent &&
        student.parent.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (student._id &&
        student._id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass = filterClass === "" || student.class === filterClass;
    const matchesSection =
      filterSection === "" || student.section === filterSection;

    return matchesSearch && matchesClass && matchesSection;
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterClass, filterSection]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Student Management
          </h2>
          <p className="text-slate-500">
            View and manage all students in your institution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 cursor-pointer px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, ID or parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-2 py-2 pr-10 cursor-pointer rounded-xl border appearance-none border-slate-200 focus:outline-none bg-slate-50/50 text-slate-600 text-sm w-full"
            >
              <option value="">All Classes</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
              <option value="4">Class 4</option>
              <option value="5">Class 5</option>
              <option value="6">Class 6</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>

            {/* Custom Down Arrow */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <ChevronDown size={20} />
            </span>
          </div>

          <div className="relative">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="px-2 py-2 w-30 appearance-none rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50 text-slate-600 text-sm"
            >
              <option value="">All Sections</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
            <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-500">
              <ChevronDown size={20} />
            </span>
          </div>
          {(searchQuery || filterClass || filterSection) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterClass("");
                setFilterSection("");
              }}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="flex items-center justify-between text-sm text-slate-600 px-2">
          <p>
            Showing {currentStudents.length > 0 ? indexOfFirstStudent + 1 : 0}{" "}
            to {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
            {filteredStudents.length} students
            {(searchQuery || filterClass || filterSection) && (
              <span className="text-indigo-600 font-semibold ml-1">
                (filtered from {students.length} total)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Student
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Class/Sec
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Roll No
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Parent
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {searchQuery || filterClass || filterSection
                      ? "No students found matching your filters."
                      : "No students found. Add your first student!"}
                  </td>
                </tr>
              ) : (
                currentStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {student.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {student._id
                              ? student._id.substring(0, 8).toUpperCase()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        Class {student.class} - {student.section}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {student.roll}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {student.parent}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          student.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && filteredStudents.length > studentsPerPage && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => {
                // Show first page, last page, current page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-xl font-semibold transition-colors ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-2 text-slate-400">
                      ...
                    </span>
                  );
                }
                return null;
              }
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            Next
          </button>
        </div>
      )}

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Add New Student
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEntryMode("manual");
                    setUploadedFile(null);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
                >
                  <MoreVertical size={20} className="rotate-45" />
                </button>
              </div>

              {/* Toggle Buttons */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setEntryMode("manual")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    entryMode === "manual"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setEntryMode("auto")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    entryMode === "auto"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Auto Upload
                </button>
              </div>
            </div>

            {/* Manual Entry Form */}
            {entryMode === "manual" && (
              <form onSubmit={handleAddStudent} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter full name"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Parent/Guardian Name
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.parent}
                      onChange={(e) =>
                        setFormData({ ...formData, parent: e.target.value })
                      }
                      placeholder="Parent's name"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Class
                    </label>
                    <select
                      required
                      value={formData.class}
                      onChange={(e) =>
                        setFormData({ ...formData, class: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="">Select Class</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Section
                    </label>
                    <select
                      required
                      value={formData.section}
                      onChange={(e) =>
                        setFormData({ ...formData, section: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="">Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Roll Number
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.roll}
                      onChange={(e) =>
                        setFormData({ ...formData, roll: e.target.value })
                      }
                      placeholder="e.g. 01"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="student@school.com"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        required
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Enter password"
                        className="w-full px-4 py-2 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEntryMode("manual");
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    Save Student
                  </button>
                </div>
              </form>
            )}

            {/* Auto Upload Form */}
            {entryMode === "auto" && (
              <form onSubmit={handleAutoSubmit} className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      id="student-file-upload"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="student-file-upload"
                      className="cursor-pointer block"
                    >
                      <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <Download size={32} className="text-indigo-600" />
                      </div>
                      <p className="text-slate-900 font-semibold mb-2">
                        {uploadedFile
                          ? uploadedFile.name
                          : "Click to upload file"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Supports CSV, Excel files (.csv, .xlsx, .xls)
                      </p>
                    </label>
                  </div>

                  {uploadedFile && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-900">
                          File ready to upload
                        </p>
                        <p className="text-xs text-green-700">
                          {uploadedFile.name} (
                          {(uploadedFile.size / 1024).toFixed(2)} KB)
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-blue-900">
                        📋 File Format Guidelines:
                      </p>
                      <button
                        type="button"
                        onClick={downloadTemplate}
                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Download size={12} />
                        Download Template
                      </button>
                    </div>
                    <ul className="text-xs text-blue-700 space-y-1 ml-4">
                      <li>
                        • Include columns: Name, Class, Section, Roll, Parent,
                        Email, Password
                      </li>
                      <li>• First row should contain column headers</li>
                      <li>• Ensure Name and Class are filled</li>
                      <li>• Use CSV or Excel format</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEntryMode("manual");
                      setUploadedFile(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!uploadedFile}
                  >
                    Upload & Process
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Upload Result Notification */}
      {showUploadResult && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md">
          <div
            className={`rounded-2xl shadow-2xl border-2 p-6 ${
              uploadStats.failed > 0
                ? "bg-amber-50 border-amber-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {uploadStats.failed > 0 ? (
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-slate-900">Upload Complete</h4>
                  <p className="text-sm text-slate-600">
                    {uploadStats.failed > 0
                      ? "Some entries failed to upload"
                      : "All students uploaded successfully"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadResult(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-green-700 font-semibold">
                  <CheckCircle2 size={16} />
                  Successful:
                </span>
                <span className="font-bold text-green-900">
                  {uploadStats.success}
                </span>
              </div>
              {uploadStats.failed > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-red-700 font-semibold">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Failed:
                  </span>
                  <span className="font-bold text-red-900">
                    {uploadStats.failed}
                  </span>
                </div>
              )}
            </div>

            {uploadStats.failed > 0 && failedRows.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 bg-white/50 p-2 rounded-lg">
                  Failed entries have incomplete fields. Download to see which
                  fields are missing and fill them in.
                </p>
                <button
                  onClick={() => {
                    downloadFailedRows();
                    setShowUploadResult(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold shadow-lg"
                >
                  <Download size={18} />
                  Download Failed Entries
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
