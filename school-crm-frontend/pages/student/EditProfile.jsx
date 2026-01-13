import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Globe,
  Upload,
  Save,
  X,
  ChevronRight,
  Heart,
  FileText,
  Building,
  CreditCard,
  Users,
} from "lucide-react";

const EditProfile = () => {
  const [activeSection, setActiveSection] = useState < string > "personal";
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "Aarav",
    lastName: "Sharma",
    dateOfBirth: "2008-05-15",
    gender: "Male",
    bloodGroup: "O+",
    email: "aarav.sharma@school.com",
    phone: "+91 98765 43210",
    address: "123 Student Street, City, State - 123456",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    nationality: "Indian",
    religion: "Hindu",
    category: "General",
    aadharNumber: "1234 5678 9012",

    // Parents & Guardian Info
    fatherName: "Rajesh Sharma",
    fatherOccupation: "Engineer",
    fatherPhone: "+91 98765 43211",
    fatherEmail: "rajesh.sharma@email.com",
    motherName: "Priya Sharma",
    motherOccupation: "Teacher",
    motherPhone: "+91 98765 43212",
    motherEmail: "priya.sharma@email.com",
    guardianName: "",
    guardianRelation: "",
    guardianPhone: "",
    guardianEmail: "",

    // Medical History
    medicalConditions: "",
    allergies: "",
    medications: "",
    emergencyContact: "+91 98765 43211",
    emergencyRelation: "Father",
    doctorName: "Dr. Anil Patel",
    doctorPhone: "+91 98765 43220",

    // Previous School Details
    previousSchoolName: "ABC School",
    previousSchoolAddress: "456 Old School Street",
    previousClass: "9th",
    previousYear: "2023",
    transferCertificate: "",
    leavingCertificate: "",

    // Bank Details
    bankName: "State Bank of India",
    accountNumber: "1234567890",
    ifscCode: "SBIN0001234",
    accountHolderName: "Aarav Sharma",
    branchName: "Mumbai Main Branch",
  });

  const [profilePhoto, setProfilePhoto] = (useState < File) | (null > null);

  const sections = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "parents", label: "Parents & Guardian", icon: Users },
    { id: "medical", label: "Medical History", icon: Heart },
    { id: "previous", label: "Previous School", icon: Building },
    { id: "bank", label: "Bank Details", icon: CreditCard },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileUpload = (field, file) => {
    if (field === "profilePhoto") {
      setProfilePhoto(file);
    } else {
      setFormData({ ...formData, [field]: file.name });
    }
  };

  const handleSave = () => {
    // Save logic
    console.log("Saving profile data:", formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <p className="text-slate-500">
            Update your personal and academic information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Icon size={18} />
                {section.label}
                <ChevronRight
                  size={16}
                  className={isActive ? "text-white" : "text-slate-400"}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Photo Upload */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-indigo-200">
            {profilePhoto ? (
              <img
                src={URL.createObjectURL(profilePhoto)}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={40} className="text-indigo-600" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files &&
                handleFileUpload("profilePhoto", e.target.files[0])
              }
              className="hidden"
              id="profilePhoto"
            />
            <label
              htmlFor="profilePhoto"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Upload size={18} />
              Choose File
            </label>
            <p className="text-xs text-slate-500 mt-2">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      {activeSection === "personal" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <User size={16} />
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Blood Group
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) =>
                  handleInputChange("bloodGroup", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nationality
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) =>
                  handleInputChange("nationality", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                <MapPin size={16} />
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Religion
              </label>
              <input
                type="text"
                value={formData.religion}
                onChange={(e) => handleInputChange("religion", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Aadhar Number
              </label>
              <input
                type="text"
                value={formData.aadharNumber}
                onChange={(e) =>
                  handleInputChange("aadharNumber", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="1234 5678 9012"
              />
            </div>
          </div>
        </div>
      )}

      {/* Parents & Guardian Info */}
      {activeSection === "parents" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-6">
            Parents & Guardian Information
          </h3>
          <div className="space-y-8">
            {/* Father's Information */}
            <div>
              <h4 className="text-md font-semibold mb-4 text-indigo-600">
                Father's Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName}
                    onChange={(e) =>
                      handleInputChange("fatherName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.fatherOccupation}
                    onChange={(e) =>
                      handleInputChange("fatherOccupation", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.fatherPhone}
                    onChange={(e) =>
                      handleInputChange("fatherPhone", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.fatherEmail}
                    onChange={(e) =>
                      handleInputChange("fatherEmail", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Mother's Information */}
            <div>
              <h4 className="text-md font-semibold mb-4 text-indigo-600">
                Mother's Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) =>
                      handleInputChange("motherName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={formData.motherOccupation}
                    onChange={(e) =>
                      handleInputChange("motherOccupation", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.motherPhone}
                    onChange={(e) =>
                      handleInputChange("motherPhone", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.motherEmail}
                    onChange={(e) =>
                      handleInputChange("motherEmail", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div>
              <h4 className="text-md font-semibold mb-4 text-indigo-600">
                Guardian Information (If Applicable)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.guardianName}
                    onChange={(e) =>
                      handleInputChange("guardianName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Relation
                  </label>
                  <input
                    type="text"
                    value={formData.guardianRelation}
                    onChange={(e) =>
                      handleInputChange("guardianRelation", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Uncle, Aunt, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.guardianPhone}
                    onChange={(e) =>
                      handleInputChange("guardianPhone", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.guardianEmail}
                    onChange={(e) =>
                      handleInputChange("guardianEmail", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical History */}
      {activeSection === "medical" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-6">Medical History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Medical Conditions
              </label>
              <textarea
                value={formData.medicalConditions}
                onChange={(e) =>
                  handleInputChange("medicalConditions", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="List any medical conditions..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allergies
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="List any allergies..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Current Medications
              </label>
              <textarea
                value={formData.medications}
                onChange={(e) =>
                  handleInputChange("medications", e.target.value)
                }
                rows={2}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="List any current medications..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) =>
                  handleInputChange("emergencyContact", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Emergency Relation
              </label>
              <input
                type="text"
                value={formData.emergencyRelation}
                onChange={(e) =>
                  handleInputChange("emergencyRelation", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Doctor Name
              </label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) =>
                  handleInputChange("doctorName", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Doctor Phone
              </label>
              <input
                type="tel"
                value={formData.doctorPhone}
                onChange={(e) =>
                  handleInputChange("doctorPhone", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Previous School Details */}
      {activeSection === "previous" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-6">Previous School Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                School Name
              </label>
              <input
                type="text"
                value={formData.previousSchoolName}
                onChange={(e) =>
                  handleInputChange("previousSchoolName", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                School Address
              </label>
              <input
                type="text"
                value={formData.previousSchoolAddress}
                onChange={(e) =>
                  handleInputChange("previousSchoolAddress", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Previous Class
              </label>
              <input
                type="text"
                value={formData.previousClass}
                onChange={(e) =>
                  handleInputChange("previousClass", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Previous Year
              </label>
              <input
                type="text"
                value={formData.previousYear}
                onChange={(e) =>
                  handleInputChange("previousYear", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Transfer Certificate
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files &&
                  handleFileUpload("transferCertificate", e.target.files[0])
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Leaving Certificate
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  e.target.files &&
                  handleFileUpload("leavingCertificate", e.target.files[0])
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bank Details */}
      {activeSection === "bank" && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold mb-6">Bank Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bank Name
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) =>
                  handleInputChange("accountNumber", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                IFSC Code
              </label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Account Holder Name
              </label>
              <input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) =>
                  handleInputChange("accountHolderName", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Branch Name
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) =>
                  handleInputChange("branchName", e.target.value)
                }
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
