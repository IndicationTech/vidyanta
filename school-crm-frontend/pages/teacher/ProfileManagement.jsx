import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  CreditCard,
  Building2,
  FileText,
  Lock,
  Upload,
  Edit,
  Save,
  X,
  Globe,
  Award,
  Book,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Star,
  Target,
  Shield,
  Home,
  ChevronRight,
  BookOpen,
  Medal,
  Sparkles,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";
import { getProfile, updateProfile, uploadPhoto } from "../../api/profileApi";

const ProfileManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({});

  const fileBase = import.meta.env.VITE_API_HOST || "http://localhost:5000";

  // Demo data for robust UI
  const demoEnhancements = {
    schoolName: "Greenwood International School",
    designation: "Senior Mathematics Teacher",
    experience: "10+ Years",
    achievements: [
      { label: "Best Teacher Award", year: "2023" },
      { label: "Subject Excellence", year: "2022" },
      { label: "100% Results", year: "2021-2023" },
    ],
    stats: {
      studentsTeaching: 245,
      classesHandled: 8,
      averageScore: 92.5,
      attendanceRate: 98,
    },
    documents: [
      {
        name: "Teaching Certificate",
        type: "PDF",
        size: "2.4 MB",
        uploaded: "2023-01-15",
      },
      {
        name: "Experience Letter",
        type: "PDF",
        size: "1.2 MB",
        uploaded: "2023-01-10",
      },
      {
        name: "Educational Qualifications",
        type: "PDF",
        size: "3.1 MB",
        uploaded: "2023-01-05",
      },
    ],
    leaves: {
      total: 24,
      used: 8,
      pending: 2,
      available: 14,
    },
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedId = localStorage.getItem("userId");

      if (!storedId) {
        alert("No teacher profile found. Please login to access your profile.");
        setLoading(false);
        return;
      }

      console.log("Loading teacher profile with ID:", storedId);
      const res = await getProfile(storedId);
      const data = res.data;

      console.log("📥 Received profile data:", {
        _id: data._id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        qualification: data.qualification,
        experience: data.experience,
        dateOfJoining: data.dateOfJoining,
        phone: data.phone,
        address: data.address,
        allFields: Object.keys(data),
      });

      // Absolute URLs (like from Gravatar) start with http/https, use them directly
      // Local uploads are relative paths like /uploads/profiles/...
      let resolvedPhoto = data.photo;

      if (resolvedPhoto && !resolvedPhoto.startsWith("http")) {
        // If it's a relative path, make it absolute
        resolvedPhoto = resolvedPhoto.startsWith("/")
          ? `${fileBase}${resolvedPhoto}`
          : `${fileBase}/${resolvedPhoto}`;
      }

      if (
        !resolvedPhoto ||
        (!resolvedPhoto.startsWith("http") &&
          !resolvedPhoto.startsWith("https"))
      ) {
        // Use a reliable default avatar service
        resolvedPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.name || "User"
        )}&background=6366f1&color=fff&size=200`;
      }

      console.log("Resolved photo URL:", resolvedPhoto);

      setProfile({
        ...data,
        name:
          data.name || `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        languages: Array.isArray(data.languages) ? data.languages : [],
        photo: resolvedPhoto,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert(
        `Failed to load teacher profile: ${
          error.response?.data?.message || error.message
        }`
      );
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateProfile(profile._id, editForm);
      setProfile({ ...profile, ...editForm });
      setDrawerOpen(false);
      setIsEditing(false);
      setLoading(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
      setLoading(false);
    }
  };

  const openEditDrawer = () => {
    setEditForm({
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      permanentAddress: profile.permanentAddress,
      languages: profile.languages?.join(", ") || "",
    });
    setDrawerOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile._id) return;

    try {
      const formData = new FormData();
      formData.append("photo", file);

      console.log("Uploading photo for user:", profile._id);
      const res = await uploadPhoto(profile._id, formData);
      console.log("Photo upload response:", res.data);

      // Get the photo URL from the response
      const photoUrl = res.data?.photo || res.data?.data?.photo;

      if (!photoUrl) {
        console.error("No photo URL in response:", res.data);
        alert("Photo uploaded but URL not received. Please refresh the page.");
        return;
      }

      console.log("Photo URL received:", photoUrl);
      setProfile({ ...profile, photo: photoUrl });
      alert("Photo updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload photo";
      alert(`Failed to upload photo: ${errorMessage}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    const fields = [
      profile.firstName,
      profile.lastName,
      profile.email,
      profile.phone,
      profile.address,
      profile.dob,
      profile.qualification,
      profile.experience,
      profile.languages?.length,
      profile.photo,
      profile.accountNumber,
      profile.ifscCode,
    ];
    const filled = fields.filter((f) => f).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();

  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      icon: User,
      count: null,
    },
    {
      id: "professional",
      label: "Professional",
      icon: GraduationCap,
      count: null,
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: CreditCard,
      count: null,
    },
    {
      id: "leaves",
      label: "Leaves",
      icon: Calendar,
      count:
        demoEnhancements.leaves.pending > 0
          ? demoEnhancements.leaves.pending
          : null,
      badge: demoEnhancements.leaves.pending > 0,
    },
    {
      id: "bank",
      label: "Bank Account",
      icon: Building2,
      count: null,
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      count: demoEnhancements.documents.length,
    },
  ];

  const canEdit = (field) => {
    const editableFields = [
      "photo",
      "phone",
      "email",
      "address",
      "permanentAddress",
      "languages",
      "password",
      "confirmPassword",
    ];
    return isEditing && editableFields.includes(field);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Enhanced Header with School Name & Breadcrumb */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Home size={16} />
          <ChevronRight size={14} />
          <span>Teacher</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-semibold">
            Profile Management
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">
              My Profile
            </h2>
            <p className="text-slate-600 flex items-center gap-2">
              <Building2 size={16} className="text-indigo-600" />
              {demoEnhancements.schoolName}
            </p>
          </div>
          <button
            onClick={openEditDrawer}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 shadow-md"
          >
            <Edit size={18} />
            <span className="font-semibold">Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="h-40 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-indigo-600 flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              {demoEnhancements.experience}
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-20 mb-6 flex flex-col md:flex-row md:items-end gap-6">
            {/* Profile Photo */}
            <div className="relative group">
              <div className="w-36 h-36 rounded-2xl border-4 border-white overflow-hidden bg-slate-100 shadow-2xl ring-4 ring-indigo-100">
                <img
                  src={profile.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle size={20} className="text-white" />
              </div>
            </div>

            {/* Name & Designation */}
            <div className="flex-1 pb-2">
              <h3 className="text-3xl font-bold text-slate-900 mb-1">
                {profile.name || `${profile.firstName} ${profile.lastName}`}
              </h3>
              <p className="text-lg text-indigo-600 font-semibold mb-2 flex items-center gap-2">
                <Award size={18} />
                {demoEnhancements.designation}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center gap-1">
                  <Book size={12} />
                  {profile.subject || "Mathematics"}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                  ID: {profile.teacherId || "T001"}
                </span>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
                  <Shield size={12} />
                  Verified
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="pb-2">
              <span className="px-5 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-700 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>

          {/* Profile Completion Bar */}
          <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Target size={16} className="text-indigo-600" />
                Profile Completion
              </span>
              <span className="text-sm font-bold text-indigo-600">
                {profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            {profileCompletion < 100 && (
              <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                <AlertCircle size={12} />
                Complete your profile to unlock all features
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={Users}
              label="Students"
              value={demoEnhancements.stats.studentsTeaching}
              color="indigo"
            />
            <StatCard
              icon={BookOpen}
              label="Classes"
              value={demoEnhancements.stats.classesHandled}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Avg Score"
              value={`${demoEnhancements.stats.averageScore}%`}
              color="emerald"
            />
            <StatCard
              icon={CheckCircle}
              label="Attendance"
              value={`${demoEnhancements.stats.attendanceRate}%`}
              color="blue"
            />
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Medal size={16} className="text-yellow-500" />
              Recent Achievements
            </h4>
            <div className="flex flex-wrap gap-3">
              {demoEnhancements.achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                >
                  <Sparkles size={14} className="text-yellow-600" />
                  <span className="text-sm font-semibold text-slate-700">
                    {achievement.label}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({achievement.year})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-50 rounded-xl mb-8 border border-slate-200 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.count !== null && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : tab.badge
                        ? "bg-red-500 text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6 animate-fadeIn">
            {activeTab === "personal" && (
              <div className="space-y-6">
                <SectionHeader title="Basic Information" icon={User} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard
                    label="First Name"
                    value={profile.firstName}
                    icon={User}
                  />
                  <InfoCard
                    label="Last Name"
                    value={profile.lastName}
                    icon={User}
                  />
                  <InfoCard label="Gender" value={profile.gender} icon={User} />
                  <InfoCard
                    label="Date of Birth"
                    value={
                      profile.dob || profile.dateOfBirth
                        ? new Date(
                            profile.dob || profile.dateOfBirth
                          ).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : undefined
                    }
                    icon={Calendar}
                  />
                  <InfoCard
                    label="Blood Group"
                    value={profile.bloodGroup}
                    icon={User}
                  />
                  <InfoCard
                    label="Marital Status"
                    value={profile.maritalStatus}
                    icon={User}
                  />
                </div>

                <SectionHeader title="Contact Information" icon={Phone} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard
                    label="Phone Number"
                    value={profile.phone}
                    icon={Phone}
                    editable
                  />
                  <InfoCard
                    label="Email Address"
                    value={profile.email}
                    icon={Mail}
                    editable
                  />
                  <InfoCard
                    label="Languages Known"
                    value={profile.languages?.join(", ")}
                    icon={Globe}
                    editable
                  />
                </div>

                <SectionHeader title="Address Details" icon={MapPin} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard
                    label="Current Address"
                    value={profile.address}
                    icon={MapPin}
                    fullWidth
                    editable
                  />
                  <InfoCard
                    label="Permanent Address"
                    value={profile.permanentAddress}
                    icon={Home}
                    fullWidth
                    editable
                  />
                </div>

                <SectionHeader title="Family Information" icon={Users} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard
                    label="Father's Name"
                    value={profile.fatherName}
                    icon={User}
                  />
                  <InfoCard
                    label="Mother's Name"
                    value={profile.motherName}
                    icon={User}
                  />
                  <InfoCard
                    label="PAN / ID Number"
                    value={profile.panNumber}
                    icon={FileText}
                  />
                </div>
              </div>
            )}

            {activeTab === "professional" && (
              <div className="space-y-6">
                <SectionHeader title="Employment Details" icon={Briefcase} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard
                    label="Teacher ID"
                    value={profile.teacherId}
                    icon={CreditCard}
                  />
                  <InfoCard
                    label="Department"
                    value={profile.subject}
                    icon={Building2}
                  />
                  <InfoCard
                    label="Class Assigned"
                    value={profile.classAssigned}
                    icon={Users}
                  />
                  <InfoCard
                    label="Subject"
                    value={profile.subject}
                    icon={Book}
                  />
                  <InfoCard
                    label="Qualification"
                    value={profile.qualification}
                    icon={GraduationCap}
                  />
                  <InfoCard
                    label="Experience"
                    value={
                      profile.experience
                        ? typeof profile.experience === "string" &&
                          profile.experience.includes("Year")
                          ? profile.experience
                          : `${profile.experience} Years`
                        : undefined
                    }
                    icon={Award}
                  />
                  <InfoCard
                    label="Date of Joining"
                    value={
                      profile.dateOfJoining || profile.joiningDate
                        ? new Date(
                            profile.dateOfJoining || profile.joiningDate
                          ).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : undefined
                    }
                    icon={Calendar}
                  />
                  <InfoCard
                    label="Previous School"
                    value={profile.previousSchool}
                    icon={Building2}
                  />
                </div>
              </div>
            )}

            {activeTab === "payroll" && (
              <div className="space-y-6">
                <SectionHeader title="Salary & Employment" icon={CreditCard} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard
                    label="EPF Number"
                    value={profile.epfNumber}
                    icon={FileText}
                  />
                  <InfoCard
                    label="Basic Salary"
                    value={
                      profile.basicSalary
                        ? `₹${profile.basicSalary.toLocaleString()}`
                        : "N/A"
                    }
                    icon={CreditCard}
                  />
                  <InfoCard
                    label="Contract Type"
                    value={profile.contractType}
                    icon={FileText}
                  />
                  <InfoCard
                    label="Work Shift"
                    value={profile.workShift}
                    icon={Clock}
                  />
                  <InfoCard
                    label="Work Location"
                    value={profile.workLocation}
                    icon={MapPin}
                  />
                </div>
              </div>
            )}

            {activeTab === "leaves" && (
              <div className="space-y-6">
                <SectionHeader title="Leave Balance" icon={Calendar} />

                {/* Leave Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <LeaveStatCard
                    label="Total Leaves"
                    value={demoEnhancements.leaves.total}
                    color="indigo"
                    icon={Calendar}
                  />
                  <LeaveStatCard
                    label="Used"
                    value={demoEnhancements.leaves.used}
                    color="red"
                    icon={CheckCircle}
                  />
                  <LeaveStatCard
                    label="Pending"
                    value={demoEnhancements.leaves.pending}
                    color="yellow"
                    icon={Clock}
                  />
                  <LeaveStatCard
                    label="Available"
                    value={demoEnhancements.leaves.available}
                    color="green"
                    icon={CheckCircle}
                  />
                </div>

                <SectionHeader title="Leave Types" icon={FileText} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <InfoCard
                    label="Medical Leaves"
                    value={
                      profile.medicalLeaves !== undefined
                        ? profile.medicalLeaves.toString()
                        : "12"
                    }
                    icon={Calendar}
                  />
                  <InfoCard
                    label="Casual Leaves"
                    value={
                      profile.casualLeaves !== undefined
                        ? profile.casualLeaves.toString()
                        : "10"
                    }
                    icon={Calendar}
                  />
                  <InfoCard
                    label="Sick Leaves"
                    value={
                      profile.sickLeaves !== undefined
                        ? profile.sickLeaves.toString()
                        : "8"
                    }
                    icon={Calendar}
                  />
                  <InfoCard
                    label="Maternity Leaves"
                    value={profile.maternityLeaves || "N/A"}
                    icon={Calendar}
                  />
                </div>

                {/* Empty State for Leave History */}
                {demoEnhancements.leaves.used > 0 && (
                  <div className="mt-6">
                    <SectionHeader
                      title="Recent Leave History"
                      icon={FileText}
                    />
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                      <Calendar
                        size={48}
                        className="mx-auto text-slate-300 mb-3"
                      />
                      <p className="text-slate-600 font-semibold">
                        No recent leave applications
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Your leave history will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bank" && (
              <div className="space-y-6">
                <SectionHeader title="Bank Account Details" icon={Building2} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoCard
                    label="Account Name"
                    value={profile.accountName}
                    icon={User}
                  />
                  <InfoCard
                    label="Account Number"
                    value={profile.accountNumber}
                    icon={CreditCard}
                  />
                  <InfoCard
                    label="Bank Name"
                    value={profile.bankName}
                    icon={Building2}
                  />
                  <InfoCard
                    label="IFSC Code"
                    value={profile.ifscCode}
                    icon={FileText}
                  />
                  <InfoCard
                    label="Branch Name"
                    value={profile.branchName}
                    icon={MapPin}
                  />
                </div>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-6">
                <SectionHeader title="Uploaded Documents" icon={FileText} />
                {demoEnhancements.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {demoEnhancements.documents.map((doc, idx) => (
                      <DocumentCard key={idx} document={doc} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
                    <FileText
                      size={48}
                      className="mx-auto text-slate-300 mb-3"
                    />
                    <p className="text-slate-600 font-semibold">
                      No documents uploaded
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Upload your documents to keep them organized
                    </p>
                    <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Upload Document
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Side Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slideInRight">
            <div className="h-full flex flex-col">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Edit Profile
                    </h3>
                    <p className="text-sm text-indigo-100 mt-1">
                      Update your personal information
                    </p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-yellow-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-semibold text-yellow-900">
                      Read-only fields
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Some fields like name, DOB, and ID cannot be edited.
                      Contact admin for changes.
                    </p>
                  </div>
                </div>

                <EditField
                  label="Phone Number"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                  icon={Phone}
                  editable
                />
                <EditField
                  label="Email Address"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  icon={Mail}
                  editable
                />
                <EditField
                  label="Current Address"
                  name="address"
                  value={editForm.address}
                  onChange={handleChange}
                  icon={MapPin}
                  editable
                  multiline
                />
                <EditField
                  label="Permanent Address"
                  name="permanentAddress"
                  value={editForm.permanentAddress}
                  onChange={handleChange}
                  icon={Home}
                  editable
                  multiline
                />
                <EditField
                  label="Languages (comma-separated)"
                  name="languages"
                  value={editForm.languages}
                  onChange={handleChange}
                  icon={Globe}
                  editable
                />

                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-4">
                    Read-Only Information
                  </h4>
                  <EditField
                    label="Full Name"
                    value={profile.firstName + " " + profile.lastName}
                    icon={User}
                  />
                  <EditField
                    label="Teacher ID"
                    value={profile.teacherId}
                    icon={CreditCard}
                  />
                  <EditField
                    label="Date of Birth"
                    value={profile.dob}
                    icon={Calendar}
                  />
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex gap-3">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600 text-indigo-600",
    purple: "from-purple-500 to-purple-600 text-purple-600",
    emerald: "from-emerald-500 to-emerald-600 text-emerald-600",
    blue: "from-blue-500 to-blue-600 text-blue-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 hover:scale-105">
      <div
        className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center mb-3 text-white`}
      >
        <Icon size={20} />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-600 font-semibold mt-1">{label}</p>
    </div>
  );
};

const SectionHeader = ({ title, icon: Icon }) => (
  <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
      <Icon size={16} className="text-white" />
    </div>
    <h4 className="text-lg font-bold text-slate-900">{title}</h4>
  </div>
);

const InfoCard = ({
  label,
  value,
  icon: Icon,
  editable = false,
  fullWidth = false,
}) => (
  <div
    className={`${
      fullWidth ? "md:col-span-2 lg:col-span-3" : ""
    } bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-all duration-200`}
  >
    <div className="flex items-center gap-2 mb-2">
      <Icon size={14} className="text-indigo-600" />
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      {editable && (
        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
          Editable
        </span>
      )}
    </div>
    <p className="text-sm font-semibold text-slate-900">
      {value || "Not provided"}
    </p>
  </div>
);

const LeaveStatCard = ({ label, value, color, icon: Icon }) => {
  const colorClasses = {
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-600",
    red: "bg-red-50 border-red-200 text-red-600",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-600",
    green: "bg-green-50 border-green-200 text-green-600",
  };

  return (
    <div
      className={`${colorClasses[color]} border-2 rounded-xl p-4 text-center`}
    >
      <Icon size={20} className="mx-auto mb-2" />
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs font-semibold mt-1">{label}</p>
    </div>
  );
};

const DocumentCard = ({ document }) => (
  <div className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex items-center gap-4">
    <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
      <FileText size={24} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-slate-900 truncate">{document.name}</p>
      <p className="text-xs text-slate-500 mt-1">
        {document.type} • {document.size} • Uploaded {document.uploaded}
      </p>
    </div>
    <div className="flex gap-2 flex-shrink-0">
      <button className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-200 transition-colors">
        <Eye size={18} />
      </button>
      <button className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-200 transition-colors">
        <Download size={18} />
      </button>
    </div>
  </div>
);

const EditField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  editable = false,
  multiline = false,
}) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
      {Icon && <Icon size={16} className="text-indigo-600" />}
      {label}
    </label>
    {editable ? (
      multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-900 transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-lg border-2 border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium text-slate-900 transition-all"
        />
      )
    ) : (
      <div className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 bg-slate-50 font-medium text-slate-500">
        {value || "Not provided"}
      </div>
    )}
  </div>
);

const Field = ({
  label,
  value,
  editable = false,
  fullWidth = false,
  type = "text",
  name,
  onChange,
}) => {
  const getAutocomplete = () => {
    if (type === "password") {
      if (
        name === "confirmPassword" ||
        label.toLowerCase().includes("confirm")
      ) {
        return "new-password";
      }
      return "new-password";
    }
    return undefined;
  };

  return (
    <div
      className={`${
        fullWidth ? "md:col-span-2 lg:col-span-3" : ""
      } space-y-1.5`}
    >
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}
      </label>
      {editable ? (
        <input
          type={type}
          name={name}
          defaultValue={type === "password" ? "" : value}
          onChange={onChange}
          autoComplete={getAutocomplete()}
          className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-indigo-50/30 font-medium text-slate-900 transition-all"
        />
      ) : (
        <div className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50/50 font-medium text-slate-700">
          {type === "password" ? "••••••••" : value || "N/A"}
        </div>
      )}
    </div>
  );
};

export default ProfileManagement;
