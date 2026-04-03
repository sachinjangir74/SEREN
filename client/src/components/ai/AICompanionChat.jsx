import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AICompanionChat = () => {
  const [messages, setMessages] = useState([{ senderType: 'seren', message: "Hi there! I'm Seren. How are you feeling today?" }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { senderType: 'user', message: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/ai/companion`, {
        message: userMessage.message,
        history: messages
      });

      setMessages((prev) => [...prev, { senderType: 'seren', message: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { senderType: 'seren', message: "I'm having trouble connecting right now, but please know I'm here for you." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-teal-600 text-white">
        <div className="bg-white/20 p-2 rounded-full">
          <Sparkles className="w-5 h-5 text-teal-100" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Seren Companion</h3>
          <p className="text-teal-100 text-xs">Always here to listen</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
        {messages.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`flex gap-3 ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.senderType === 'seren' && (
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              </div>
            )}
            
            <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${msg.senderType === 'user' ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-sm'}`}>
              {msg.message}
            </div>
            
            {msg.senderType === 'user' && (
               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                 <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
               </div>
            )}
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-teal-600" />
             </div>
             <div className="bg-white dark:bg-slate-800 px-4 py-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-1 items-center">
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
               <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
             </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};