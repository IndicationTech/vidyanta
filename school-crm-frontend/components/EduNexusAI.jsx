import React, { useState } from "react";
import { Sparkles } from "lucide-react";

const EduNexusAI = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:5000/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch (err) {
      console.error("Frontend error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Backend error. Check console." },
      ]);
    }
  };

  return (
    <>
      {/* 🔵 Floating Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform group relative"
        >
          <Sparkles size={24} />
          <div className="absolute right-16 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-lg text-slate-900 font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Ask EduNexus AI Assistant
          </div>
        </button>
      </div>

      {/* 🧠 Chat Modal */}
      {open && (
        <div className="fixed bottom-24 right-8 w-96 bg-white rounded-2xl shadow-2xl border z-50">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-indigo-600">EduNexus AI</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          <div className="p-4 h-64 overflow-y-auto text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span className="inline-block bg-slate-100 px-3 py-2 rounded-xl">
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded-xl px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white px-4 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EduNexusAI;
