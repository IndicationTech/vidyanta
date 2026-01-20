import React, { useState, useEffect } from "react";
import TeacherForm from "../components/TeacherForm";
import * as XLSX from "xlsx";
import {
  createTeacherProfile,
  uploadPhoto,
  createStaffProfile,
  getAllStaff,
  deleteStaff,
  updateProfile,
} from "../api/profileApi";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Download,
  Trash2,
  Edit,
  CheckCircle2,
  CircleX,
} from "lucide-react";

const Staff = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [teacherModalMode, setTeacherModalMode] = useState("add"); // "add" or "edit"
  const [teacherInitialData, setTeacherInitialData] = useState(null);
  const [entryMode, setEntryMode] = useState("manual"); // "manual" or "auto"
  const [teacherEntryMode, setTeacherEntryMode] = useState("manual"); // "manual" or "auto" for teachers
  const [uploadedFile, setUploadedFile] = useState(null);
  const [teacherUploadedFile, setTeacherUploadedFile] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [failedRows, setFailedRows] = useState([]);
  const [teacherFailedRows, setTeacherFailedRows] = useState([]);
  const [showUploadResult, setShowUploadResult] = useState(false);
  const [showTeacherUploadResult, setShowTeacherUploadResult] = useState(false);
  const [uploadStats, setUploadStats] = useState({ success: 0, failed: 0 });
  const [teacherUploadStats, setTeacherUploadStats] = useState({
    success: 0,
    failed: 0,
  });

  // Fetch staff data on component mount
  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const response = await getAllStaff();
      const staffData = response.data.map((member) => ({
        id: member._id,
        name: member.name,
        role:
          member.role === "TEACHER"
            ? "Teacher"
            : member.role === "PARENT"
              ? "Parent"
              : "Account HR",
        department:
          member.department ||
          (member.role === "TEACHER"
            ? member.subject || "Teaching"
            : member.role === "PARENT"
              ? "Parent"
              : "HR"),
        email: member.email,
        phone: member.phone || "N/A",
        status: member.status || "Active",
      }));
      setStaff(staffData);
    } catch (error) {
      console.error("Failed to fetch staff data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleSaveTeacher = async (data) => {
    try {
      const { confirmPassword, profilePhoto, joiningLetter, ...rest } = data;

      // Process numeric fields and handle empty strings
      const payload = {
        ...rest,
        name: `${data.firstName} ${data.lastName}`.trim(),
        basicSalary: data.basicSalary ? Number(data.basicSalary) : undefined,
        medicalLeaves: Number(data.medicalLeaves) || 0,
        casualLeaves: Number(data.casualLeaves) || 0,
        sickLeaves: Number(data.sickLeaves) || 0,
        maternityLeaves: Number(data.maternityLeaves) || 0,
        experience: data.experience?.toString() || "",
        languages: Array.isArray(data.languages)
          ? data.languages.filter((l) => l.trim() !== "")
          : [],
        classAssigned: Array.isArray(data.classAssigned)
          ? data.classAssigned.join(", ")
          : data.classAssigned || "",
        section: Array.isArray(data.section)
          ? data.section.join(", ")
          : data.section || "",
        subject: Array.isArray(data.subject)
          ? data.subject.join(", ")
          : data.subject || "",
      };

      // Handle both create and update
      const response =
        teacherModalMode === "edit" && selectedStaff
          ? await updateProfile(selectedStaff.id, payload)
          : await createTeacherProfile(payload);
      const saved = response.data;

      let photoUrl = saved.photo;
      if (profilePhoto && saved._id) {
        try {
          const formData = new FormData();
          formData.append("photo", profilePhoto);
          const uploadRes = await uploadPhoto(saved._id, formData);
          photoUrl = uploadRes.data?.photo || photoUrl;
        } catch (uploadError) {
          console.warn(
            "Photo upload failed, but profile was created:",
            uploadError,
          );
          // Continue even if photo upload fails - profile is already saved
        }
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("teacherProfileId", saved._id || "");
        localStorage.setItem("teacherProfileCode", saved.teacherId || "");
      }

      const newTeacher = {
        id: saved.teacherId || saved._id,
        name: saved.name,
        role: saved.role || "Teacher",
        department: saved.subject || "Teaching",
        email: saved.email,
        phone: saved.phone,
        status: saved.status || "Active",
        photo: photoUrl,
      };

      // Refresh staff list from database
      await fetchStaffData();

      setShowTeacherModal(false);
      setTeacherModalMode("add");
      setTeacherInitialData(null);
      setSelectedStaff(null);
      alert(
        teacherModalMode === "edit"
          ? `Teacher ${saved.name} updated successfully!`
          : `Teacher ${saved.name} created successfully! You can now view their profile.`,
      );
    } catch (error) {
      console.error("Failed to save teacher", error);
      // Propagate to form so it can show a user-friendly message
      throw error;
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    try {
      // Map department to role enum values
      const roleMap = {
        Parent: "PARENT",
        "Account HR": "ACCOUNTS_HR",
      };

      const payload = {
        firstName: formData.name.split(" ")[0] || formData.name,
        lastName: formData.name.split(" ").slice(1).join(" ") || "",
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: roleMap[formData.department] || "PARENT",
        department: formData.department,
        status: "Active",
      };

      const response = await createStaffProfile(payload);
      const saved = response.data;

      // Refresh staff list from database
      await fetchStaffData();

      setShowModal(false);
      setEntryMode("manual");
      setUploadedFile(null);
      setFormData({
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
        password: "",
      });

      alert(
        `Staff member ${saved.name} created successfully! They can now login with their credentials.`,
      );
    } catch (error) {
      console.error("Failed to save staff member", error);
      alert(
        error.response?.data?.message ||
          "Failed to create staff member. Please try again.",
      );
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleTeacherFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTeacherUploadedFile(file);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        Name: "John Doe",
        Email: "john@example.com",
        Phone: "+91 9876543210",
        Role: "Parent",
        Department: "Parent",
        Password: "password123",
      },
      {
        Name: "Jane Smith",
        Email: "jane@example.com",
        Phone: "+91 9876543211",
        Role: "Account HR",
        Department: "HR",
        Password: "password123",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff Template");
    XLSX.writeFile(wb, "Staff_Upload_Template.xlsx");
  };

  const downloadTeacherTemplate = () => {
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
      {
        FirstName: "Jane",
        LastName: "Smith",
        Email: "teacher2@example.com",
        Password: "password123",
        Phone: "+91 9876543211",
        Subject: "Science",
        Qualification: "M.Sc Physics",
        DateOfBirth: "1988-05-20",
        Gender: "Female",
        Address: "456 Park Avenue",
        City: "Delhi",
        State: "Delhi",
        Country: "India",
        PostalCode: "110001",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Teacher Template");
    XLSX.writeFile(wb, "Teacher_Upload_Template.xlsx");
  };

  const downloadFailedRows = () => {
    if (failedRows.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(failedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failed Entries");
    XLSX.writeFile(wb, "Failed_Staff_Entries.xlsx");
  };

  const downloadTeacherFailedRows = () => {
    if (teacherFailedRows.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(teacherFailedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Failed Entries");
    XLSX.writeFile(wb, "Failed_Teacher_Entries.xlsx");
  };

  const handleTeacherAutoSubmit = async (e) => {
    e.preventDefault();
    if (!teacherUploadedFile) {
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
              "The uploaded file is empty. Please add teacher data and try again.",
            );
            return;
          }

          let successCount = 0;
          let errorCount = 0;
          const errors = [];
          const failedData = [];

          for (const row of jsonData) {
            try {
              // Validate required fields
              const firstName = row.FirstName || row.firstName || "";
              const lastName = row.LastName || row.lastName || "";
              const email = row.Email || row.email || "";

              if (!firstName || !email) {
                throw new Error("FirstName and Email are required fields");
              }

              const payload = {
                firstName: firstName,
                lastName: lastName,
                name: `${firstName} ${lastName}`.trim(),
                email: email,
                password: row.Password || row.password || "password123",
                phone: row.Phone || row.phone || "",
                subject: row.Subject || row.subject || "",
                qualification: row.Qualification || row.qualification || "",
                dateOfBirth: row.DateOfBirth || row.dateOfBirth || "",
                gender: row.Gender || row.gender || "",
                address: row.Address || row.address || "",
                city: row.City || row.city || "",
                state: row.State || row.state || "",
                country: row.Country || row.country || "",
                postalCode: row.PostalCode || row.postalCode || "",
                role: "TEACHER",
                status: "Active",
              };

              await createTeacherProfile(payload);
              successCount++;
            } catch (err) {
              errorCount++;
              const errorMessage = err.response?.data?.message || err.message;
              errors.push(
                `${
                  row.FirstName || row.firstName || "Unknown"
                }: ${errorMessage}`,
              );

              // Store failed row with incomplete fields as-is
              failedData.push(row);

              console.error(`Failed to create teacher ${row.FirstName}:`, err);
            }
          }

          // Store failed rows for download
          setTeacherFailedRows(failedData);

          // Refresh staff list
          await fetchStaffData();

          setShowTeacherModal(false);
          setTeacherEntryMode("manual");
          setTeacherUploadedFile(null);

          // Store upload statistics
          setTeacherUploadStats({ success: successCount, failed: errorCount });
          setShowTeacherUploadResult(true);

          if (errorCount > 0) {
            // Auto-hide notification after 10 seconds if user doesn't interact
            setTimeout(() => {
              setShowTeacherUploadResult(false);
            }, 10000);
          } else {
            setTeacherFailedRows([]);
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
              setShowTeacherUploadResult(false);
            }, 5000);
          }
        } catch (parseError) {
          console.error("Error parsing file:", parseError);
          alert(
            "Failed to parse the file. Please ensure it's a valid Excel/CSV file with the correct format.",
          );
        }
      };

      reader.readAsArrayBuffer(teacherUploadedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process the file. Please try again.");
    }
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
              "The uploaded file is empty. Please add staff data and try again.",
            );
            return;
          }

          let successCount = 0;
          let errorCount = 0;
          const errors = [];
          const failedData = [];

          for (const row of jsonData) {
            try {
              // Validate required fields
              const name = row.Name || row.name || "";
              const email = row.Email || row.email || "";

              if (!name || !email) {
                throw new Error("Name and Email are required fields");
              }

              // Map Excel columns to payload fields
              const roleMap = {
                Parent: "PARENT",
                "Account HR": "ACCOUNTS_HR",
                PARENT: "PARENT",
                ACCOUNTS_HR: "ACCOUNTS_HR",
              };

              const nameParts = name.split(" ");

              const payload = {
                firstName: nameParts[0] || name,
                lastName: nameParts.slice(1).join(" ") || "",
                name: name,
                email: email,
                password: row.Password || row.password || "password123",
                phone: row.Phone || row.phone || "",
                role: roleMap[row.Role || row.role] || "PARENT",
                department:
                  row.Department || row.department || row.Role || row.role,
                status: "Active",
              };

              await createStaffProfile(payload);
              successCount++;
            } catch (err) {
              errorCount++;
              const errorMessage = err.response?.data?.message || err.message;
              errors.push(
                `${row.Name || row.name || "Unknown"}: ${errorMessage}`,
              );

              // Store failed row with incomplete fields as-is
              failedData.push(row);

              console.error(`Failed to create staff member ${row.Name}:`, err);
            }
          }

          // Store failed rows for download
          setFailedRows(failedData);

          // Refresh staff list
          await fetchStaffData();

          setShowModal(false);
          setEntryMode("manual");
          setUploadedFile(null);

          // Store upload statistics
          setUploadStats({ success: successCount, failed: errorCount });
          setShowUploadResult(true);

          if (errorCount > 0) {
            // Auto-hide notification after 10 seconds if user doesn't interact
            setTimeout(() => {
              setShowUploadResult(false);
            }, 10000);
          } else {
            setFailedRows([]);
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
              setShowUploadResult(false);
            }, 5000);
          }
        } catch (parseError) {
          console.error("Error parsing file:", parseError);
          alert(
            "Failed to parse the file. Please ensure it's a valid Excel/CSV file with the correct format.",
          );
        }
      };

      reader.readAsArrayBuffer(uploadedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Failed to process the file. Please try again.");
    }
  };

  const handleEdit = async (member) => {
    try {
      setSelectedStaff(member);

      // Fetch full profile data using the getProfile API
      const { getProfile } = await import("../api/profileApi");
      const response = await getProfile(member.id);
      const fullData = response.data;

      // Split name into firstName and lastName
      const nameParts = fullData.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Prepare initial data for TeacherForm
      const initialData = {
        ...fullData,
        firstName: firstName,
        lastName: lastName,
        teacherId: fullData.teacherId || fullData._id,
        gender: fullData.gender || "",
        dob: fullData.dob || "",
        bloodGroup: fullData.bloodGroup || "",
        maritalStatus: fullData.maritalStatus || "",
        languages: fullData.languages || [],
        classAssigned: Array.isArray(fullData.classAssigned)
          ? fullData.classAssigned
          : fullData.classAssigned
            ? fullData.classAssigned
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        section: Array.isArray(fullData.section)
          ? fullData.section
          : fullData.section
            ? fullData.section
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        subject: Array.isArray(fullData.subject)
          ? fullData.subject
          : fullData.subject
            ? fullData.subject
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        qualification: fullData.qualification || "",
        experience: fullData.experience || "",
        dateOfJoining: fullData.dateOfJoining || "",
        status: fullData.status || "Active",
        phone: fullData.phone || "",
        email: fullData.email || "",
        address: fullData.address || "",
        permanentAddress: fullData.permanentAddress || "",
        fatherName: fullData.fatherName || "",
        motherName: fullData.motherName || "",
        emergencyContact: fullData.emergencyContact || "",
        emergencyContactName: fullData.emergencyContactName || "",
        aadharNumber: fullData.aadharNumber || "",
        panNumber: fullData.panNumber || "",
        bankName: fullData.bankName || "",
        accountNumber: fullData.accountNumber || "",
        ifscCode: fullData.ifscCode || "",
        basicSalary: fullData.basicSalary || "",
        medicalLeaves: fullData.medicalLeaves || 0,
        casualLeaves: fullData.casualLeaves || 0,
        sickLeaves: fullData.sickLeaves || 0,
        maternityLeaves: fullData.maternityLeaves || 0,
        password: "", // Don't populate password
        confirmPassword: "",
      };

      setTeacherInitialData(initialData);
      setTeacherModalMode("edit");
      setShowTeacherModal(true);
    } catch (error) {
      console.error("Error loading staff data:", error);
      alert("Failed to load staff data. Please try again.");
    }
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    try {
      await deleteStaff(memberId);
      alert("Staff member deleted successfully!");
      fetchStaffData();
    } catch (error) {
      console.error("Failed to delete staff member:", error);
      alert("Failed to delete staff member. Please try again.");
    }
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        role:
          formData.role === "Teacher"
            ? "TEACHER"
            : formData.role === "Parent"
              ? "PARENT"
              : "ACCOUNTS_HR",
      };

      // Only include password if it's not empty
      if (formData.password) {
        payload.password = formData.password;
      }

      await updateProfile(selectedStaff.id, payload);
      alert("Staff member updated successfully!");
      setShowEditModal(false);
      setSelectedStaff(null);
      setFormData({
        name: "",
        role: "",
        department: "",
        email: "",
        phone: "",
        password: "",
      });
      fetchStaffData();
    } catch (error) {
      console.error("Failed to update staff member:", error);
      alert("Failed to update staff member. Please try again.");
    }
  };

  // Filter staff based on search query and role filter
  const filteredStaff = staff
    .filter((member) => {
      const matchesSearch =
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "All Roles" ||
        member.role === roleFilter ||
        (roleFilter === "Teacher" && member.role === "Teacher") ||
        (roleFilter === "Parent" && member.role === "Parent") ||
        (roleFilter === "Account HR" && member.role === "Account HR");

      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      // Sort by createdAt date in descending order (newest first)
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Staff & Teacher Management
          </h2>
          <p className="text-slate-500">
            Manage your institution's human resources and teaching staff.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border cursor-pointer border-slate-200 px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            <span>Add Staff Member</span>
          </button>
          <button
            onClick={() => {
              setTeacherModalMode("add");
              setTeacherInitialData(null);
              setSelectedStaff(null);
              setShowTeacherModal(true);
            }}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
          >
            <Plus size={18} />
            <span>Add Teacher</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Staff",
            value: staff.length.toString(),
            color: "bg-blue-500",
          },
          {
            label: "Teaching Staff",
            value: staff.filter((s) => s.role === "Teacher").length.toString(),
            color: "bg-indigo-500",
          },
          {
            label: "Parents",
            value: staff.filter((s) => s.role === "Parent").length.toString(),
            color: "bg-emerald-500",
          },
          {
            label: "Account HR",
            value: staff
              .filter((s) => s.role === "Account HR")
              .length.toString(),
            color: "bg-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
          >
            <div className={`w-1 h-8 rounded-full ${stat.color}`}></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
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
            placeholder="Search by name, ID or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="px-4 py-2 rounded-xl border border-slate-200 focus:outline-none bg-slate-50/50 text-slate-600 text-sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option>All Roles</option>
            <option>Teacher</option>
            <option>Parent</option>
            <option>Account HR</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Staff Member
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Role & Dept
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                  Contact Info
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
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-slate-500">Loading staff data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <p className="text-slate-500">
                      No staff members match your search criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold text-sm">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500">{member.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {member.role}
                      </p>
                      <p className="text-xs text-slate-500">
                        {member.department}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Mail size={12} className="text-slate-400" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Phone size={12} className="text-slate-400" />
                          {member.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          member.status === "Active"
                            ? "bg-green-100 text-green-600"
                            : member.status === "On Leave"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-slate-100"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-slate-100"
                        >
                          <Trash2 size={16} />
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

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Add Staff Member
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEntryMode("manual");
                    setUploadedFile(null);
                  }}
                  className="w-8 h-8 rounded-full flex items-center hover:bg-slate-200 justify-center cursor-pointer"
                >
                  <CircleX
                    size={20}
                    className="text-slate-500 cursor-pointer"
                  />
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
              <form onSubmit={handleAddStaff} className="p-6 space-y-4">
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
                      placeholder="e.g. Dr. Jane Doe"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Role
                    </label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    >
                      <option value="">Select Role</option>
                      <option value="Parent">Parent</option>
                      <option value="Account HR">Account HR</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="email@edunexus.ai"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      autoComplete="new-password"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">
                      Phone
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+91 00000 00000"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEntryMode("manual");
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                  >
                    Confirm Addition
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
                      id="staff-file-upload"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="staff-file-upload"
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
                        • Include columns: Name, Email, Phone, Role, Department,
                        Password
                      </li>
                      <li>• First row should contain column headers</li>
                      <li>• Ensure all required fields are filled</li>
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
      {/* Add Teacher Modal - Toggle Selection or Auto Upload */}
      {showTeacherModal && teacherEntryMode === "auto" && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900">
                  Add Teacher
                </h3>
                <button
                  onClick={() => {
                    setShowTeacherModal(false);
                    setTeacherEntryMode("manual");
                    setTeacherUploadedFile(null);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200"
                >
                  <MoreVertical size={20} className="rotate-45" />
                </button>
              </div>

              {/* Toggle Buttons */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setTeacherEntryMode("manual")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    teacherEntryMode === "manual"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setTeacherEntryMode("auto")}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    teacherEntryMode === "auto"
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Auto Upload
                </button>
              </div>
            </div>

            {/* Auto Upload Form */}
            <form onSubmit={handleTeacherAutoSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    id="teacher-file-upload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleTeacherFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="teacher-file-upload"
                    className="cursor-pointer block"
                  >
                    <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Download size={32} className="text-emerald-600" />
                    </div>
                    <p className="text-slate-900 font-semibold mb-2">
                      {teacherUploadedFile
                        ? teacherUploadedFile.name
                        : "Click to upload file"}
                    </p>
                    <p className="text-sm text-slate-500">
                      Supports CSV, Excel files (.csv, .xlsx, .xls)
                    </p>
                  </label>
                </div>

                {teacherUploadedFile && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900">
                        File ready to upload
                      </p>
                      <p className="text-xs text-green-700">
                        {teacherUploadedFile.name} (
                        {(teacherUploadedFile.size / 1024).toFixed(2)} KB)
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
                      onClick={downloadTeacherTemplate}
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
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowTeacherModal(false);
                    setTeacherEntryMode("manual");
                    setTeacherUploadedFile(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!teacherUploadedFile}
                >
                  Upload & Process
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TeacherForm - Manual Entry Mode */}
      {showTeacherModal && teacherEntryMode === "manual" && (
        <TeacherForm
          isOpen={true}
          onClose={() => {
            setShowTeacherModal(false);
            setTeacherEntryMode("manual");
            setTeacherModalMode("add");
            setTeacherInitialData(null);
            setSelectedStaff(null);
          }}
          onSave={handleSaveTeacher}
          initialData={teacherInitialData}
          mode={teacherModalMode}
        />
      )}

      {/* Teacher Upload Result Notification */}
      {showTeacherUploadResult && (
        <div className="fixed bottom-6 left-6 z-50 max-w-md">
          <div
            className={`rounded-2xl shadow-2xl border-2 p-6 ${
              teacherUploadStats.failed > 0
                ? "bg-amber-50 border-amber-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                {teacherUploadStats.failed > 0 ? (
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
                  <h4 className="font-bold text-slate-900">
                    Teacher Upload Complete
                  </h4>
                  <p className="text-sm text-slate-600">
                    {teacherUploadStats.failed > 0
                      ? "Some teacher entries failed"
                      : "All teachers uploaded successfully"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTeacherUploadResult(false)}
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
                  {teacherUploadStats.success}
                </span>
              </div>
              {teacherUploadStats.failed > 0 && (
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
                    {teacherUploadStats.failed}
                  </span>
                </div>
              )}
            </div>

            {teacherUploadStats.failed > 0 && teacherFailedRows.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-600 bg-white/50 p-2 rounded-lg">
                  Failed teacher entries have incomplete fields. Download to see
                  which fields are missing and fill them in.
                </p>
                <button
                  onClick={() => {
                    downloadTeacherFailedRows();
                    setShowTeacherUploadResult(false);
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
                      : "All entries uploaded successfully"}
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

      {/* Edit Staff Modal */}
      {showEditModal && selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">
                  Edit Staff Member
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStaff(null);
                    setFormData({
                      name: "",
                      role: "",
                      department: "",
                      email: "",
                      phone: "",
                      password: "",
                    });
                  }}
                  className="w-8 h-8 rounded-full flex items-center hover:bg-slate-200 justify-center cursor-pointer"
                >
                  <CircleX
                    size={20}
                    className="text-slate-500 cursor-pointer"
                  />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateStaff} className="p-6 space-y-4">
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
                    placeholder="e.g. Dr. Jane Doe"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Role
                  </label>
                  <select
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select Role</option>
                    <option value="Parent">Parent</option>
                    <option value="Account HR">Account HR</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@edunexus.ai"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    autoComplete="new-password"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91 00000 00000"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStaff(null);
                    setFormData({
                      name: "",
                      role: "",
                      department: "",
                      email: "",
                      phone: "",
                      password: "",
                    });
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
                >
                  Update Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
