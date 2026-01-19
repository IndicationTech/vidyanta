import React, { useState, useEffect } from "react";
import { Plus, Mail, Phone, X } from "lucide-react";

const Admissions = () => {
  const [leads, setLeads] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "",
  });

  // Fetch leads from backend on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/leads");
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data = await res.json();
        setLeads(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeads();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save lead");

      const savedLead = await res.json();
      setLeads((prev) => [savedLead, ...prev]);
      setShowModal(false);
      setFormData({ name: "", email: "", phone: "", source: "", status: "" });
    } catch (error) {
      console.error("Error saving lead:", error);
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Admission CRM</h2>
          <p className="text-slate-500">
            Track and manage prospective student leads.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 cursor-pointer"
        >
          <Plus size={20} />
          Add New Lead
        </button>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["New", "Contacted", "Visit Scheduled", "Enrolled"].map((status) => (
          <div
            key={status}
            className="bg-slate-100/50 p-4 rounded-2xl min-h-125"
          >
            <h3 className="font-bold mb-4">{status}</h3>

            {leads
              .filter((l) => l.status === status)
              .map((lead) => (
                <div
                  key={lead._id}
                  className="bg-white p-4 rounded-xl shadow-sm mb-3"
                >
                  <h4 className="font-semibold">{lead.name}</h4>
                  <p className="text-xs flex gap-2 items-center">
                    <Mail size={12} /> {lead.email}
                  </p>
                  <p className="text-xs flex gap-2 items-center">
                    <Phone size={12} /> {lead.phone}
                  </p>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Add New Lead</h3>
              <button type="button" onClick={() => setShowModal(false)}>
                <X className="cursor-pointer text-gray-500"/>
              </button>
            </div>

            <input
              name="name"
              value={formData.name}
              placeholder="Student Name"
              className="w-full border p-2 rounded border-gray-300 outline-none"
              onChange={handleChange}
              required
            />
            <input
              name="email"
              value={formData.email}
              placeholder="Email"
              className="w-full border p-2 rounded border-gray-300 outline-none"
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              value={formData.phone}
              placeholder="Phone"
              className="w-full border p-2 rounded border-gray-300 outline-none"
              onChange={handleChange}
              required
            />
            <input
              name="source"
              value={formData.source}
              placeholder="Source (Website, Walk-in)"
              className="w-full border p-2 rounded border-gray-300 outline-none"
              onChange={handleChange}
            />

            {/* Status Dropdown */}
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded border-gray-300 outline-none"
              required
            >
              <option value="" className="text-gray-400" disabled>
                Select Status
              </option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Visit Scheduled">Visit Scheduled</option>
              <option value="Enrolled">Enrolled</option>
            </select>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold cursor-pointer py-2 rounded-md hover:scale-102 transition-all"
            >
              Save Lead
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admissions;
