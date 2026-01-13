import React, { useState } from "react";
import { MOCK_ANNOUNCEMENTS } from "../constants";
import { generateAnnouncement } from "../services/geminiService";
import {
  Megaphone,
  MessageSquare,
  Mail,
  Send,
  Sparkles,
  Loader2,
} from "lucide-react";

const Communication = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState("");

  const handleAIGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    const content = await generateAnnouncement(topic, "Parents and Students");
    setDraft(content || "");
    setIsGenerating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6 text-indigo-600 font-bold">
            <Sparkles size={20} />
            AI Content Assistant
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Announcement Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Summer vacation notice, Sports meet update"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Draft Content
              </label>
              <textarea
                rows={6}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                placeholder="The AI generated draft will appear here..."
              />
              <button
                onClick={handleAIGenerate}
                disabled={isGenerating}
                className="absolute right-3 bottom-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Sparkles size={16} />
                )}
                {draft ? "Regenerate" : "Generate with AI"}
              </button>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                <Mail size={18} /> Send as Email
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                <Megaphone size={18} /> Publish Notice
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold">Recent Announcements</h3>
          {MOCK_ANNOUNCEMENTS.map((ann) => (
            <div
              key={ann.id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex gap-4"
            >
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                <Megaphone size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-900">{ann.title}</h4>
                  <span className="text-xs text-slate-400 font-medium">
                    {ann.date}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                  {ann.content}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500 uppercase">
                    By {ann.author}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                    <Send size={12} /> {ann.target.length} Groups Notified
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-white h-fit">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
          <MessageSquare size={20} className="text-indigo-400" />
          Direct Messages
        </h3>
        <div className="space-y-4">
          {["Rajesh Sharma", "Amit Verma", "Suresh Kumar"].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold">
                {name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{name}</p>
                <p className="text-xs text-slate-400 truncate">
                  Last message: Hello, regarding the...
                </p>
              </div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full group-hover:scale-125 transition-transform"></div>
            </div>
          ))}
        </div>
        <button className="w-full mt-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold text-sm transition-colors">
          Start New Conversation
        </button>
      </div>
    </div>
  );
};

export default Communication;
