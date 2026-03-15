import React from "react";
import { MOCK_ANNOUNCEMENTS } from "../../constants";
import { Megaphone, MessageSquare, Send } from "lucide-react";

const StudentCommunication = () => {
  return (
    <div className="space-y-6">
      {/* Announcements Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Megaphone size={20} className="text-orange-600" />
          Announcements
        </h3>
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
              <p className="text-sm text-slate-600 mb-3">{ann.content}</p>
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

      {/* Messages Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <MessageSquare size={20} className="text-indigo-600" />
          Messages
        </h3>
        <div className="space-y-4">
          {["Rajesh Sharma (Teacher)", "Amit Verma (Principal)"].map(
            (name, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white">
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
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentCommunication;
