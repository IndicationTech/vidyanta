import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Search,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const SchoolAdminSyllabus = () => {
  const [syllabi, setSyllabi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStandard, setFilterStandard] = useState("All");
  const [filterSemester, setFilterSemester] = useState("All");
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    standard: "",
    subject: "",
    semester: 1,
    section: [],
    syllabusData: {
      id: "",
      name: "",
      topics: [],
    },
  });

  const standards = [
    "1st",
    "2nd",
    "3rd",
    "4th",
    "5th",
    "6th",
    "7th",
    "8th",
    "9th",
    "10th",
    "11th",
    "12th",
  ];
  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "Social Science",
    "Hindi",
    "Computer Science",
    "Physical Education",
  ];
  const sections = ["A", "B", "C", "D"];

  useEffect(() => {
    fetchSyllabi();
  }, []);

  const fetchSyllabi = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("userId");

      const response = await axios.get(
        `http://localhost:5000/api/syllabus?schoolId=${schoolId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSyllabi(response.data);
    } catch (error) {
      console.error("Error fetching syllabi:", error);
      showNotification("error", "Failed to fetch syllabi");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleOpenModal = (mode, syllabus = null) => {
    setModalMode(mode);
    setSelectedSyllabus(syllabus);

    if (mode === "edit" && syllabus) {
      setFormData({
        standard: syllabus.standard,
        subject: syllabus.subject,
        semester: syllabus.semester,
        section: syllabus.section || [],
        syllabusData: syllabus.syllabusData,
      });
    } else {
      // Reset form for create mode
      setFormData({
        standard: "",
        subject: "",
        semester: 1,
        section: [],
        syllabusData: {
          id: "",
          name: "",
          topics: [],
        },
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSyllabus(null);
    setFormData({
      standard: "",
      subject: "",
      semester: 1,
      section: [],
      syllabusData: {
        id: "",
        name: "",
        topics: [],
      },
    });
  };

  const handleAddTopic = () => {
    const newTopic = {
      id: `topic-${Date.now()}`,
      name: "",
      status: "pending",
      progress: 0,
      date: new Date().toISOString().split("T")[0],
      materials: [],
      homework: "Not assigned",
      keyPoints: [""],
    };

    setFormData({
      ...formData,
      syllabusData: {
        ...formData.syllabusData,
        topics: [...formData.syllabusData.topics, newTopic],
      },
    });
  };

  const handleRemoveTopic = (index) => {
    const updatedTopics = formData.syllabusData.topics.filter(
      (_, i) => i !== index,
    );
    setFormData({
      ...formData,
      syllabusData: {
        ...formData.syllabusData,
        topics: updatedTopics,
      },
    });
  };

  const handleTopicChange = (index, field, value) => {
    const updatedTopics = [...formData.syllabusData.topics];
    updatedTopics[index] = {
      ...updatedTopics[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      syllabusData: {
        ...formData.syllabusData,
        topics: updatedTopics,
      },
    });
  };

  const handleKeyPointChange = (topicIndex, keyPointIndex, value) => {
    const updatedTopics = [...formData.syllabusData.topics];
    updatedTopics[topicIndex].keyPoints[keyPointIndex] = value;
    setFormData({
      ...formData,
      syllabusData: {
        ...formData.syllabusData,
        topics: updatedTopics,
      },
    });
  };

  const handleAddKeyPoint = (topicIndex) => {
    const updatedTopics = [...formData.syllabusData.topics];
    updatedTopics[topicIndex].keyPoints.push("");
    setFormData({
      ...formData,
      syllabusData: {
        ...formData.syllabusData,
        topics: updatedTopics,
      },
    });
  };

  const handleRemoveKeyPoint = (topicIndex, keyPointIndex) => {
    const updatedTopics = [...formData.syllabusData.topics];
    updatedTopics[topicIndex].keyPoints = updatedTopics[
      topicIndex
    ].keyPoints.filter((_, i) => i !== keyPointIndex);
    setFormData({
      ...formData,
      syllabusData: {
        ...formData.syllabusData,
        topics: updatedTopics,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.standard || !formData.subject) {
      showNotification("error", "Please fill in all required fields");
      return;
    }

    // Auto-generate subject ID and name if not set
    const syllabusData = {
      ...formData.syllabusData,
      id:
        formData.syllabusData.id ||
        `${formData.subject.toLowerCase().replace(/\s+/g, "-")}-sem${
          formData.semester
        }`,
      name: formData.syllabusData.name || formData.subject,
    };

    try {
      const token = localStorage.getItem("token");
      const schoolId = localStorage.getItem("userId");

      const payload = {
        schoolId,
        standard: formData.standard,
        subject: formData.subject,
        semester: formData.semester,
        section: formData.section,
        syllabusData,
      };

      if (modalMode === "create") {
        await axios.post("http://localhost:5000/api/syllabus", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification("success", "Syllabus created successfully");
      } else {
        await axios.put(
          `http://localhost:5000/api/syllabus/${selectedSyllabus._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        showNotification("success", "Syllabus updated successfully");
      }

      fetchSyllabi();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving syllabus:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Failed to save syllabus",
      );
    }
  };

  const handleDelete = async (syllabusId) => {
    if (!window.confirm("Are you sure you want to delete this syllabus?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/syllabus/${syllabusId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showNotification("success", "Syllabus deleted successfully");
      fetchSyllabi();
    } catch (error) {
      console.error("Error deleting syllabus:", error);
      showNotification("error", "Failed to delete syllabus");
    }
  };

  const filteredSyllabi = syllabi.filter((syllabus) => {
    const matchesSearch =
      syllabus.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      syllabus.standard.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStandard =
      filterStandard === "All" || syllabus.standard === filterStandard;

    const matchesSemester =
      filterSemester === "All" ||
      syllabus.semester === parseInt(filterSemester);

    return matchesSearch && matchesStandard && matchesSemester;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading syllabi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Syllabus Management</h2>
          <p className="text-slate-500">
            Manage syllabus for all standards and subjects
          </p>
        </div>
        <button
          onClick={() => handleOpenModal("create")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
        >
          <Plus size={20} />
          Add New Syllabus
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by subject or standard..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStandard}
            onChange={(e) => setFilterStandard(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Standards</option>
            {standards.map((std) => (
              <option key={std} value={std}>
                {std}
              </option>
            ))}
          </select>
          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Semesters</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
          <div className="text-sm text-slate-600 flex items-center">
            Total: <strong className="ml-2">{filteredSyllabi.length}</strong>
          </div>
        </div>
      </div>

      {/* Syllabi Grid */}
      {filteredSyllabi.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <BookOpen size={64} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">
            No Syllabi Found
          </h3>
          <p className="text-slate-500 mb-6">
            Start by adding a syllabus for your students
          </p>
          <button
            onClick={() => handleOpenModal("create")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add First Syllabus
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSyllabi.map((syllabus) => (
            <div
              key={syllabus._id}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {syllabus.subject}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Standard: {syllabus.standard} | Semester {syllabus.semester}
                  </p>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  {syllabus.syllabusData?.topics?.length || 0} Topics
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-sm text-slate-600">
                  {/* <Users size={16} />
                  <span>
                    {syllabus.assignedTeachers?.length || 0} Teacher(s) Assigned
                  </span> */}
                </div>
                {syllabus.assignedTeachers?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {syllabus.assignedTeachers.map((teacher) => (
                      <span
                        key={teacher._id}
                        className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        {teacher.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                <Calendar size={16} />
                <span>
                  Updated: {new Date(syllabus.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleOpenModal("edit", syllabus)}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(syllabus._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold">
                {modalMode === "create" ? "Add New Syllabus" : "Edit Syllabus"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Standard *
                  </label>
                  <select
                    value={formData.standard}
                    onChange={(e) =>
                      setFormData({ ...formData, standard: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Standard</option>
                    {standards.map((std) => (
                      <option key={std} value={std}>
                        {std}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Semester *
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semester: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              {/* Section Multi-Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Section
                </label>
                <div className="border border-slate-300 rounded-lg p-3">
                  {formData.section.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.section.map((sec) => (
                        <span
                          key={sec}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                        >
                          {sec}
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                section: formData.section.filter(
                                  (s) => s !== sec,
                                ),
                              })
                            }
                            className="hover:bg-indigo-200 rounded-full p-0.5"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-2">
                    {sections.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          if (formData.section.includes(sec)) {
                            setFormData({
                              ...formData,
                              section: formData.section.filter(
                                (s) => s !== sec,
                              ),
                            });
                          } else {
                            setFormData({
                              ...formData,
                              section: [...formData.section, sec],
                            });
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          formData.section.includes(sec)
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Topics Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Syllabus Topics
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus size={16} />
                    Add Topic
                  </button>
                </div>

                {formData.syllabusData.topics.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                    <BookOpen
                      size={48}
                      className="mx-auto text-slate-300 mb-2"
                    />
                    <p className="text-slate-500 text-sm">
                      No topics added yet. Click "Add Topic" to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.syllabusData.topics.map((topic, topicIndex) => (
                      <div
                        key={topic.id}
                        className="border border-slate-300 rounded-lg p-4 bg-slate-50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-slate-700">
                            Topic {topicIndex + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveTopic(topicIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Topic Name *
                            </label>
                            <input
                              type="text"
                              value={topic.name}
                              onChange={(e) =>
                                handleTopicChange(
                                  topicIndex,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                              Scheduled Date
                            </label>
                            <input
                              type="date"
                              value={topic.date}
                              onChange={(e) =>
                                handleTopicChange(
                                  topicIndex,
                                  "date",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-xs font-medium text-slate-600 mb-1">
                            Homework/Assignment
                          </label>
                          <input
                            type="text"
                            value={topic.homework}
                            onChange={(e) =>
                              handleTopicChange(
                                topicIndex,
                                "homework",
                                e.target.value,
                              )
                            }
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-slate-600">
                              Key Learning Points
                            </label>
                            <button
                              type="button"
                              onClick={() => handleAddKeyPoint(topicIndex)}
                              className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                              <Plus size={12} />
                              Add Point
                            </button>
                          </div>
                          <div className="space-y-2">
                            {topic.keyPoints.map((keyPoint, kpIndex) => (
                              <div key={kpIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={keyPoint}
                                  onChange={(e) =>
                                    handleKeyPointChange(
                                      topicIndex,
                                      kpIndex,
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Enter key point..."
                                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveKeyPoint(topicIndex, kpIndex)
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  {modalMode === "create"
                    ? "Create Syllabus"
                    : "Update Syllabus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolAdminSyllabus;
