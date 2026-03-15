import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_ANNOUNCEMENTS } from "../constants";
import { generateAnnouncement } from "../services/geminiService";
import {
  Megaphone,
  MessageSquare,
  Mail,
  Send,
  Sparkles,
  Loader2,
  Trash2,
  Bell,
  Search,
  Plus,
  MoreVertical,
  ArrowRight,
} from "lucide-react";

const Communication = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, name: "Rajesh Sharma", time: "12:45 PM", lastMessage: "Hello, regarding the school event...", status: "online" },
    { id: 2, name: "Amit Verma", time: "11:30 AM", lastMessage: "Meeting scheduled for tomorrow.", status: "offline" },
    { id: 3, name: "Suresh Kumar", time: "Yesterday", lastMessage: "The reports are ready.", status: "online" },
  ]);

  const handleAIGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const content = await generateAnnouncement(topic, "Parents and Students");
    setDraft(content || "");
    setIsGenerating(false);
  };

  const clearDraft = () => {
    setTopic("");
    setDraft("");
  };

  const handlePublish = () => {
    if (!draft) return;
    const newAnnouncement = {
      id: `A${announcements.length + 1}`,
      title: topic || "New Announcement",
      content: draft,
      date: new Date().toISOString().split('T')[0],
      author: "Admin",
      target: ["Students", "Parents"],
      isDraft: false
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    clearDraft();
    alert("Announcement published successfully!");
  };

  const handleSaveDraft = () => {
    if (!draft) return;
    const newAnnouncement = {
      id: `A${announcements.length + 1}`,
      title: topic || "New Announcement (Draft)",
      content: draft,
      date: new Date().toISOString().split('T')[0],
      author: "Admin",
      target: ["Students", "Parents"],
      isDraft: true
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    clearDraft();
    alert("Draft saved successfully!");
  };

  const handleDeleteAnnouncement = (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter(ann => ann.id !== id));
    }
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || (activeTab === "published" && !ann.isDraft) || (activeTab === "drafts" && ann.isDraft);
    return matchesSearch && matchesTab;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-[1600px] mx-auto p-4 md:p-6"
    >
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Communication Center</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage school-wide announcements and direct messaging.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm w-64"
            />
          </div>
          <button 
            onClick={() => setActiveTab("drafts")}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            <Plus size={18} />
            New Message
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* AI Content Assistant Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="bg-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 text-white font-bold">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Sparkles size={20} className="text-white" />
                </div>
                AI Content Assistant
              </div>
              <div className="text-indigo-100 text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full">
                Powered by Gemini AI
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                    Announcement Topic
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Summer vacation notice, Sports meet update"
                      className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-600"
                    />
                    {topic && (
                      <button 
                        onClick={() => setTopic("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 flex justify-between">
                    Draft Content
                    {draft && <span className="text-xs font-medium text-slate-400">{draft.length} characters</span>}
                  </label>
                  <textarea
                    rows={6}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-600 resize-none leading-relaxed"
                    placeholder="The AI generated draft will appear here..."
                  />
                  
                  <div className="absolute right-4 bottom-4 flex items-center gap-2">
                    {draft && (
                      <button 
                        onClick={clearDraft}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
                        title="Clear all"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <button
                      onClick={handleAIGenerate}
                      disabled={isGenerating}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-100 group-hover:scale-105"
                    >
                      {isGenerating ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <Sparkles size={18} />
                      )}
                      {draft ? "Regenerate" : "Generate Draft"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Draft Auto-saved</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => {
                      if (draft) {
                        alert(`Emailing draft: ${topic}\n\n${draft}`);
                      } else {
                        alert("Please generate a draft first.");
                      }
                    }}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all"
                  >
                    <Mail size={18} /> Send Email
                  </button>
                  <button 
                    onClick={handleSaveDraft}
                    disabled={!draft}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 disabled:opacity-50 transition-all"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={handlePublish}
                    disabled={!draft}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-xl shadow-slate-200"
                  >
                    <Megaphone size={18} /> Publish
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Announcements Feed Header */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-extrabold text-slate-900">Recent Announcements</h3>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              {["all", "published", "drafts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeTab === tab 
                      ? "bg-white text-indigo-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((ann, idx) => (
                <motion.div
                  key={ann.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col md:flex-row gap-5"
                >
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    <Megaphone size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{ann.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                            <Bell size={12} /> {ann.date}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-tight">
                            {ann.isDraft ? "Draft" : "Published"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {ann.content}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 border border-white">
                            {ann.author[0]}
                          </div>
                          <span className="text-xs font-bold text-slate-500">
                            {ann.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                          <Send size={12} className="text-indigo-400" /> 
                          {ann.target.length} Recipient Groups
                        </div>
                      </div>
                      <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:gap-2 transition-all">
                        View Details <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-100 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                  <Megaphone size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">No announcements found</h4>
                <p className="text-slate-500 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-extrabold flex items-center gap-3">
                  <div className="bg-indigo-500/20 p-2 rounded-xl">
                    <MessageSquare size={22} className="text-indigo-400" />
                  </div>
                  Messages
                </h3>
                <span className="bg-indigo-500 text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-indigo-500/30">
                  3 New
                </span>
              </div>

              <div className="space-y-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    whileHover={{ x: 8 }}
                    onClick={() => alert(`Opening conversation with ${msg.name}`)}
                    className="flex items-center gap-4 p-4 rounded-3xl hover:bg-white/5 transition-all cursor-pointer group border border-transparent hover:border-white/10"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg">
                        {msg.name[0]}
                      </div>
                      {msg.status === "online" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-900 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <p className="font-bold text-sm truncate">{msg.name}</p>
                        <span className="text-[10px] text-slate-500 font-medium">{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate font-medium">
                        {msg.lastMessage}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => {
                  const name = prompt("Enter name for new conversation:");
                  if (name) {
                    setMessages([{
                      id: messages.length + 1,
                      name: name,
                      time: "Just now",
                      lastMessage: "Started a new conversation",
                      status: "online"
                    }, ...messages]);
                  }
                }}
                className="w-full mt-8 py-4 bg-white text-slate-900 hover:bg-indigo-50 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                <Plus size={18} />
                New Conversation
                <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0" />
              </button>
              
              <div className="mt-8 pt-8 border-t border-white/5">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Groups</h4>
                <div className="flex flex-wrap gap-2">
                  {["Staff Room", "Class 10-A", "PTA 2024"].map((group, idx) => (
                    <span key={idx} className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer text-slate-300">
                      # {group}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Help Card */}
          <div className="bg-indigo-50 rounded-[2rem] p-6 border border-indigo-100">
            <div className="bg-white w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <Megaphone size={20} />
            </div>
            <h4 className="font-extrabold text-slate-900 mb-2">Announcement Tip</h4>
            <p className="text-sm text-slate-600 font-medium leading-relaxed">
              Use the AI assistant to draft professional notices in seconds. Be specific about the event and date for better results.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Communication;
