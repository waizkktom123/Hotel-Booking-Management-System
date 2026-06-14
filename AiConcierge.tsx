import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Check, Copy, User, MessageCircle, Bot, Terminal, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  role: "user" | "bot";
  content: string;
}

export const AiConcierge: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Warm greetings! I am **Aura**, your dedicated AI Concierge powered by **Gemini 3.5 Flash**. I can guide you through our Suite services, explain Stripe dynamic card billing, or walk you through the C# Clean Architecture design. How may I elevate your stay?" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPills = [
    "List deluxe Room amenities",
    "Show ASP.NET Controllers",
    "Is cancellation refundable?",
    "Tell me about Muhammad Waiz"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // Append user message
    const updatedMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(updatedMessages);
    setInputVal("");
    setLoading(true);

    try {
      // Map message history
      const formattedLog = updatedMessages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: formattedLog })
      });

      const data = await res.json();
      setMessages([...updatedMessages, { role: "bot", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        { role: "bot", content: "Our premium server channels are slightly congested. As a backup recommendation: Our high-end suites feature standalone private Jacuzzis on the deck overlooking Maldives beachfront, with complimentary dining set as standards. Designed by Muhammad Waiz!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-[520px]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 p-4 text-white flex justify-between items-center border-b border-blue-500/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300 animate-pulse border border-white/20">
            <Bot size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-sans">AURA AI Concierge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping"></span>
            </div>
            <p className="text-[10px] text-blue-100 font-medium font-mono">Real-time Server-side Gemini Connection</p>
          </div>
        </div>

        <div className="text-[9px] font-mono p-1 px-2.5 rounded-full bg-slate-900/40 text-blue-50 uppercase tracking-widest border border-white/10">
          Muhammad Waiz Engine
        </div>
      </div>

      {/* Messages Viewport */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
          >
            {/* Icon representation */}
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
              m.role === "user" ? "bg-slate-900 text-white border-slate-900" : "bg-gradient-to-br from-indigo-500 to-blue-500 text-white border-indigo-400"
            }`}>
              {m.role === "user" ? <User size={13} /> : <Bot size={13} />}
            </div>

            {/* Bubble content */}
            <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-sm border ${
              m.role === "user"
                ? "bg-slate-900 text-white border-slate-900 rounded-tr-none"
                : "bg-white text-slate-800 border-slate-150 rounded-tl-none"
            }`}>
              {/* Parse basic markdown descriptors such as bold text */}
              <div className="prose text-slate-600">
                {m.content.split("\n\n").map((para, pIdx) => (
                  <p key={pIdx} className={m.role === "user" ? "text-slate-100 font-sans" : "text-slate-700 font-sans"}>
                    {para.split("**").map((frag, fIdx) => {
                      if (fIdx % 2 === 1) {
                        return <strong key={fIdx} className={m.role === 'user' ? "font-bold text-white" : "font-extrabold text-slate-900"}>{frag}</strong>;
                      }
                      return frag;
                    })}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 border border-indigo-400 animate-bounce">
              <Bot size={13} />
            </div>
            <div className="p-3 bg-white text-indigo-500 border border-slate-150 rounded-2xl rounded-tl-none text-xs font-mono font-bold tracking-widest flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: "0.2s" }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: "0.4s" }}></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Pills */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-1.5 select-none">
        {quickPills.map(pill => (
          <button
            key={pill}
            onClick={() => handleSendMessage(pill)}
            className="text-[10px] bg-white border border-slate-200/80 hover:border-slate-350 text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-full transition cursor-pointer"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Inputs tray */}
      <div className="p-3 border-t border-slate-150 bg-white flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputVal)}
          placeholder="Ask about dynamic pricing, SQL migrations, Stripe hooks, or luxury rooms..."
          className="flex-1 px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-blue-500 focus:bg-white text-slate-700 transition"
        />
        <button
          onClick={() => handleSendMessage(inputVal)}
          className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition cursor-pointer"
        >
          <Send size={14} />
        </button>
      </div>

    </div>
  );
};
