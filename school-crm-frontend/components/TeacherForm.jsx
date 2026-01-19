import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  X,
  User,
  CreditCard,
  Calendar,
  Briefcase,
  FileText,
  Lock,
  Upload,
  Phone,
  Mail,
  MapPin,
  Building2,
  Heart,
  Globe,
  Download,
  CheckCircle2,
  CircleX 
} from "lucide-react";

const TeacherForm = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [entryMode, setEntryMode] = useState("manual"); // "manual" or "auto"
  const [uploadedFile, setUploadedFile] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(
    initialData || {
      // Personal Information
      profilePhoto: null,
      teacherId: "TCH" + Math.floor(1000 + Math.random() * 9000),
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      bloodGroup: "",
      maritalStatus: "",
      languages: [],
      classAssigned: "",
      subject: "",
      qualification: "",
      experience: "",
      dateOfJoining: "",
      status: "Active",
      phone: "",
      email: "",
      address: "",
      permanentAddress: "",
      fatherName: "",
      motherName: "",
      panNumber: "",
      previousSchool: "",
      // Payroll
      epfNumber: "",
      basicSalary: "",
      contractType: "Permanent",
      workShift: "Day",
      workLocation: "",
      dateOfLeaving: "",
      // Leaves
      medicalLeaves: 0,
      casualLeaves: 0,
      sickLeaves: 0,
      maternityLeaves: 0,
      // Bank Account
      accountName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      branchName: "",
      // Documents
      joiningLetter: null,
      // Password
      password: "",
      confirmPassword: "",
    }
  );

  const sections = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "payroll", label: "Payroll", icon: CreditCard },
    { id: "leaves", label: "Leaves", icon: Calendar },
    { id: "bank", label: "Bank Account", icon: Building2 },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "password", label: "Password", icon: Lock },
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        FirstName: "John",
        LastName: "Doe",
        Email: "teacher1@example.com",
        Password: "password123",
        Phone: "+91 9876543210",
        Subject: "Mathematics",
        Qualification: "M.Sc Mathematics",
        DateOfBirth: "1990-01-15",
        Gender: "Male",
        Address: "123 Main Street",
        City: "Mumbai",
        State: "Maharashtra",
        Country: "India",
        PostalCode: "400001",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teacher Template");
    XLSX.writeFile(wb, "Teacher_Upload_Template.xlsx");
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
            alert("The uploaded file is empty.");
            return;
          }

          let successCount = 0;
          let failedCount = 0;

          for (const row of jsonData) {
            try {
              const firstName = row.FirstName || row.firstName || "";
              const lastName = row.LastName || row.lastName || "";
              const email = row.Email || row.email || "";

              if (!firstName || !email) {
                throw new Error("FirstName and Email are required");
              }

              const teacherData = {
                firstName,
                lastName,
                email,
                password: row.Password || row.password || "password123",
                phone: row.Phone || row.phone || "",
                subject: row.Subject || row.subject || "",
                qualification: row.Qualification || row.qualification || "",
                dob: row.DateOfBirth || row.dateOfBirth || "",
                gender: row.Gender || row.gender || "",
                address: row.Address || row.address || "",
                confirmPassword: row.Password || row.password || "password123",
              };

              await onSave(teacherData);
              successCount++;
            } catch (err) {
              failedCount++;
              console.error(`Failed to create teacher:`, err);
            }
          }

          onClose();
          alert(
            `Upload complete!\n✓ Success: ${successCount}\n✗ Failed: ${failedCount}`
          );
        } catch (parseError) {
          alert(
            "Failed to parse the file. Please ensure it's a valid Excel file."
          );
        }
      };

      reader.readAsArrayBuffer(uploadedFile);
    } catch (error) {
      alert("Failed to process the file.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("First name, last name, and email are required");
      return;
    }

    if (!formData.password) {
      alert("Password is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Password and Confirm Password must match");
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error("Teacher save failed", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save teacher";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {initialData ? "Edit Teacher" : "Add New Teacher"}
              </h3>
              <p className="text-sm text-slate-500">
                Teacher ID: {formData.teacherId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <CircleX size={24} className="text-slate-500 cursor-pointer" />
            </button>
          </div>

          {/* Toggle Buttons */}
          {!initialData && (
            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setEntryMode("manual")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                  entryMode === "manual"
                    ? "bg-white text-emerald-600 shadow-sm"
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
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Auto Upload
              </button>
            </div>
          )}
        </div>

        {entryMode === "auto" ? (
          /* Auto Upload Mode */
          <form
            onSubmit={handleAutoSubmit}
            className="flex-1 overflow-y-auto p-8"
          >
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                <input
                  type="file"
                  id="teacher-bulk-upload"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="teacher-bulk-upload"
                  className="cursor-pointer block"
                >
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <Download size={32} className="text-emerald-600" />
                  </div>
                  <p className="text-slate-900 font-semibold mb-2">
                    {uploadedFile ? uploadedFile.name : "Click to upload file"}
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
                    • Include columns: FirstName, LastName, Email, Password,
                    Phone, Subject, Qualification
                  </li>
                  <li>• First row should contain column headers</li>
                  <li>• Ensure FirstName and Email are filled</li>
                  <li>• Use CSV or Excel format</li>
                </ul>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-10 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!uploadedFile}
                >
                  Upload & Process
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Manual Entry Mode */
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-64 bg-slate-50 border-r border-slate-100 p-4 space-y-2 overflow-y-auto">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-semibold text-sm">
                      {section.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-8"
            >
              {activeSection === "personal" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                        {formData.profilePhoto ? (
                          <img
                            src={URL.createObjectURL(formData.profilePhoto)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload size={24} className="text-slate-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        name="profilePhoto"
                        onChange={handleFileChange}
                        accept=".jpg,.png,.svg"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="mt-2 text-[10px] text-center text-slate-400 uppercase font-bold">
                        Profile Photo
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Personal Information
                      </h4>
                      <p className="text-sm text-slate-500">
                        Manage basic teacher details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        label: "First Name",
                        name: "firstName",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Last Name",
                        name: "lastName",
                        type: "text",
                        required: true,
                      },
                      {
                        label: "Gender",
                        name: "gender",
                        type: "select",
                        options: ["Male", "Female", "Other"],
                      },
                      { label: "Date of Birth", name: "dob", type: "date" },
                      {
                        label: "Blood Group",
                        name: "bloodGroup",
                        type: "select",
                        options: [
                          "A+",
                          "A-",
                          "B+",
                          "B-",
                          "AB+",
                          "AB-",
                          "O+",
                          "O-",
                        ],
                      },
                      {
                        label: "Marital Status",
                        name: "maritalStatus",
                        type: "select",
                        options: ["Single", "Married", "Divorced", "Widowed"],
                      },
                      {
                        label: "Class Assigned",
                        name: "classAssigned",
                        type: "text",
                      },
                      { label: "Subject", name: "subject", type: "text" },
                      {
                        label: "Qualification",
                        name: "qualification",
                        type: "text",
                      },
                      {
                        label: "Experience (Years)",
                        name: "experience",
                        type: "number",
                      },
                      {
                        label: "Date of Joining",
                        name: "dateOfJoining",
                        type: "date",
                      },
                      {
                        label: "Status",
                        name: "status",
                        type: "select",
                        options: ["Active", "Inactive"],
                      },
                      {
                        label: "Phone Number",
                        name: "phone",
                        type: "tel",
                        required: true,
                      },
                      {
                        label: "Email Address",
                        name: "email",
                        type: "email",
                        required: true,
                      },
                      {
                        label: "Father's Name",
                        name: "fatherName",
                        type: "text",
                      },
                      {
                        label: "Mother's Name",
                        name: "motherName",
                        type: "text",
                      },
                      {
                        label: "PAN / ID Number",
                        name: "panNumber",
                        type: "text",
                      },
                      {
                        label: "Previous School Details",
                        name: "previousSchool",
                        type: "text",
                      },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </label>
                        {field.type === "select" ? (
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            required={field.required}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                          />
                        )}
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Languages Known (comma separated)
                      </label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages.join(", ")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            languages: e.target.value
                              .split(",")
                              .map((s) => s.trim()),
                          })
                        }
                        placeholder="e.g. English, Hindi, Spanish"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Current Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 resize-none"
                      ></textarea>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Permanent Address
                      </label>
                      <textarea
                        name="permanentAddress"
                        value={formData.permanentAddress}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "payroll" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Payroll Details
                      </h4>
                      <p className="text-sm text-slate-500">
                        Admin-only sensitive payroll information
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "EPF Number", name: "epfNumber", type: "text" },
                      {
                        label: "Basic Salary",
                        name: "basicSalary",
                        type: "number",
                      },
                      {
                        label: "Contract Type",
                        name: "contractType",
                        type: "select",
                        options: ["Permanent", "Contractual", "Probation"],
                      },
                      {
                        label: "Work Shift",
                        name: "workShift",
                        type: "select",
                        options: ["Day", "Night", "Evening"],
                      },
                      {
                        label: "Work Location",
                        name: "workLocation",
                        type: "text",
                      },
                      {
                        label: "Date of Leaving",
                        name: "dateOfLeaving",
                        type: "date",
                      },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {field.label}
                        </label>
                        {field.type === "select" ? (
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "leaves" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Leave Allocation
                      </h4>
                      <p className="text-sm text-slate-500">
                        Set annual leave quotas for the teacher
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Medical Leaves", name: "medicalLeaves" },
                      { label: "Casual Leaves", name: "casualLeaves" },
                      { label: "Sick Leaves", name: "sickLeaves" },
                      { label: "Maternity Leaves", name: "maternityLeaves" },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <input
                          type="number"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "bank" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Bank Details</h4>
                      <p className="text-sm text-slate-500">
                        Sensitive bank account information for salary transfer
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Account Name", name: "accountName" },
                      { label: "Account Number", name: "accountNumber" },
                      { label: "Bank Name", name: "bankName" },
                      { label: "IFSC Code", name: "ifscCode" },
                      { label: "Branch Name", name: "branchName" },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "documents" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">Documents</h4>
                      <p className="text-sm text-slate-500">
                        Upload and manage official documents (PDF only)
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors">
                      <input
                        type="file"
                        name="joiningLetter"
                        onChange={handleFileChange}
                        accept=".pdf"
                        id="joiningLetter"
                        className="hidden"
                      />
                      <label htmlFor="joiningLetter" className="cursor-pointer">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <Upload size={24} />
                        </div>
                        <p className="font-bold text-slate-900">
                          Upload Joining Letter
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Maximum file size: 10MB (PDF only)
                        </p>
                        {formData.joiningLetter && (
                          <div className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
                            <FileText size={14} /> {formData.joiningLetter.name}
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "password" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">
                        Authentication
                      </h4>
                      <p className="text-sm text-slate-500">
                        Set initial login credentials for the teacher
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Set Initial Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        autoComplete="new-password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        autoComplete="new-password"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-10 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Saving..."
                    : initialData
                    ? "Update Teacher"
                    : "Save Teacher Details"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherForm;
