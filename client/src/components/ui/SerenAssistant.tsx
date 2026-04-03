import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { getCompanionReply } from "../../services/aiService";

const SerenAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: "user" | "ai", text: string}[]>([
    { role: "ai", text: "Hi, I am Seren. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const reply = await getCompanionReply(userMsg);
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "I am having trouble connecting right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 justify-between items-center flex">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-sm font-bold">S</span>
                 </div>
                 <div>
                   <h3 className="font-bold text-sm">Seren AI</h3>
                   <p className="text-xs text-slate-300">Your Wellness Companion</p>
                 </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                   <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-slate-900 text-white rounded-tr-sm dark:bg-white dark:text-slate-900" : "bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"}`}>
                      {msg.text}
                   </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                   <div className="bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 p-3 flex items-center gap-2 rounded-2xl rounded-tl-sm">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                      <span className="text-xs text-slate-500">Seren is typing...</span>
                   </div>
                </div>
              )}
            </div>

            {/* Input Make */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
               <input 
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Type your message..."
                 className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
               />
               <button 
                 type="submit"
                 disabled={!input.trim() || loading}
                 className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <Send className="w-4 h-4 mr-0.5 mt-0.5" />
               </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SerenAssistant;
