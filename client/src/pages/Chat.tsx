import { useState, useEffect, useContext, useRef } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, UserCheck, Send, Loader2, Bot, User as UserIcon, MessageSquare, Menu, X, FileText, CheckCircle2, MoreVertical, Search, Paperclip, Smile, Mic } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '../components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from 'emoji-picker-react';
import toast from 'react-hot-toast';
import { Image } from '../components/ui/Image';

const fetchAppointments = async (token) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/appointments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const [activeChat, setActiveChat] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Summarize state
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [typingSender, setTypingSender] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const setSocketConnected = useAppStore((state) => state.setSocketConnected);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'therapist') {
      fetchAppointments(user.token).then(data => {
        const uniquePatients = [];
        const seenIds = new Set();
        data.forEach((apt) => {
          if (apt.user && !seenIds.has(apt.user._id)) {
            seenIds.add(apt.user._id);
            uniquePatients.push({ id: apt.user._id, name: apt.user.name, avatar: apt.user.avatar, type: 'patient' });
          }
        });
        setContacts(uniquePatients);
        if (uniquePatients.length > 0 && !activeChat) setActiveChat(uniquePatients[0]);
      });
    } else {
      const defaultContacts = [
        { id: 'therapist', name: 'My Care Team', type: 'therapist', icon: UserCheck },
        { id: 'ai', name: 'Seren AI Companion', type: 'ai', icon: Sparkles }
      ];
      setContacts(defaultContacts);
      if (!activeChat) setActiveChat(defaultContacts[0]);
    }
  }, [user]);

  const getRoomId = () => {
    if (!user || !activeChat) return null;
    if (user.role === 'therapist') return `${activeChat.id}_therapist`;
    return `${user._id}_${activeChat.id}`;
  };

  const roomId = getRoomId();
  const senderType = user?.role === 'therapist' ? 'therapist' : 'user';

  useEffect(() => {
    if (!roomId) return;
    setMessages([]);
    setIsLoadingHistory(true);

    const fetchHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/chat/${roomId}`, config);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load chat history', err);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    fetchHistory();

    socketRef.current = io(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}`);
    
    socketRef.current.on('connect', () => {
      setSocketConnected(true);
      socketRef.current.emit('join_room', roomId);
      socketRef.current.emit('mark_read', { room: roomId, readerType: senderType });
    });

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false);
    });

    socketRef.current.on('receive_message', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
      socketRef.current.emit('mark_read', { room: roomId, readerType: senderType });
    });

    socketRef.current.on('display_typing', ({ senderType: st }) => {
      if (st !== senderType) {
        setIsTyping(true);
        setTypingSender(st);
      }
    });

    socketRef.current.on('hide_typing', ({ senderType: st }) => {
      if (st !== senderType) {
        setIsTyping(false);
        setTypingSender('');
      }
    });

    socketRef.current.on('messages_read', () => {
      setMessages((prev) =>
        prev.map(msg => msg.senderType === senderType ? { ...msg, status: 'read' } : msg)
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId, user, setSocketConnected, senderType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);
    if (!roomId) return;

    socketRef.current.emit('typing', { room: roomId, senderType });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stop_typing', { room: roomId, senderType });
    }, 1000);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage.trim() === '' || !roomId || !activeChat) return;

    const messageText = currentMessage;
    setCurrentMessage('');
    setShowEmojiPicker(false);

    socketRef.current.emit('stop_typing', { room: roomId, senderType });
    clearTimeout(typingTimeoutRef.current);

    const messageData = {
      room: roomId,
      message: messageText,
      senderType,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    try {
      socketRef.current.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);

      if (activeChat.type === 'ai') {
        setIsTyping(true);
        setTypingSender('ai');

        try {
          const config = { headers: { Authorization: `Bearer ${user?.token}` } };
          const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/chat/ai`, {
             message: messageText,
             history: messages.slice(-5)
          }, config);

          const aiResponseData = {
            room: roomId,
            message: response.data.reply,
            senderType: 'ai',
            createdAt: new Date().toISOString(),
          };

          socketRef.current.emit('send_message', aiResponseData);
          setIsTyping(false);
          setTypingSender('');
        } catch (apiError) {
          console.error('AI API error', apiError);
          setIsTyping(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateSummary = async () => {
    if (messages.length === 0) return;
    setIsSummarizing(true);
    setSummaryModalOpen(true);
    setSummary(null);

    try {
      const transcript = messages.map(m => `${m.senderType === 'user' ? 'Patient' : 'Therapist'}: ${m.message}`).join('\n');
      
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/ai/summarize`, {
        sessionTranscript: transcript
      }, config);
      
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Failed to summarize session", err);
      setSummary("Error generating summary. Please try again.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Helper to format time like 10:30
  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(' AM', '').replace(' PM', '').toLowerCase();
  };

  return (
    <div className="w-full h-full max-h-[calc(100vh)] sm:h-[calc(100vh-6rem)] mt-0 sm:mt-4 flex bg-[#e5ddd5] dark:bg-[#111b21] sm:rounded-none lg:rounded-md shadow-2xl overflow-hidden font-sans relative">
      
      {/* Sidebar / Contacts List */}
      <div className={`absolute inset-y-0 left-0 w-full sm:w-[350px] md:w-[400px] bg-white dark:bg-[#111b21] flex flex-col z-30 transform transition-transform duration-300 ease-in-out sm:relative sm:translate-x-0 border-r border-[#e9edef] dark:border-[#202c33] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Sidebar Header (User Profile Area) */}
        <div className="h-16 shrink-0 flex items-center justify-between px-4 bg-[#f0f2f5] dark:bg-[#202c33]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#dfe5e7] dark:bg-[#374248] flex items-center justify-center text-[#54656f] dark:text-[#aebac1]">
                 <UserIcon className="w-6 h-6" />
             </div>
             <span className="font-semibold text-[#111b21] dark:text-[#e9edef] sm:hidden">Chats</span>
          </div>
          <div className="flex items-center gap-4 text-[#54656f] dark:text-[#aebac1]">
             <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="sm:hidden w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                <X className="w-5 h-5" />
             </Button>
             <MoreVertical className="w-5 h-5 hidden sm:block cursor-pointer" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-[#e9edef] dark:border-[#202c33] bg-white dark:bg-[#111b21] shrink-0">
           <div className="flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-lg px-3 py-1.5 h-9">
              <Search className="w-4 h-4 text-[#54656f] dark:text-[#aebac1] mr-3" />
              <input 
                type="text" 
                placeholder="Search or start new chat" 
                className="bg-transparent border-none w-full text-[15px] focus:outline-none text-[#111b21] dark:text-[#d1d7db] placeholder:text-[#54656f] dark:placeholder:text-[#8696a0]"
              />
           </div>
        </div>
        
        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto bg-white dark:bg-[#111b21] custom-scrollbar">
          {contacts.length === 0 ? (
            <p className="text-sm text-[#54656f] dark:text-[#8696a0] text-center mt-6">No contacts found.</p>
          ) : (
            contacts.map((contact, index) => {
              const isActive = activeChat?.id === contact.id;
              const Icon = contact.icon || UserIcon;
              const isLast = index === contacts.length - 1;
              
              return (
                <div
                  key={contact.id}
                  onClick={() => { setActiveChat(contact); setSidebarOpen(false); }}
                  className={`flex items-center cursor-pointer transition-colors ${isActive ? 'bg-[#f0f2f5] dark:bg-[#2a3942]' : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202c33]'}`}
                >
                  <div className="pl-3 pr-3 py-3 shrink-0">
                     <div className="w-[49px] h-[49px] rounded-full overflow-hidden flex items-center justify-center bg-[#dfe5e7] dark:bg-[#374248] text-[#54656f] dark:text-[#aebac1]">
                        {contact.type === 'patient' ? (
                           <span className="font-semibold text-[22px] leading-none">{(contact.name?.[0] || 'P').toUpperCase()}</span>
                        ) : (
                           <Icon className="w-7 h-7" />
                        )}
                     </div>
                  </div>
                  
                  <div className={`flex-1 py-3 pr-4 flex flex-col justify-center min-w-0 ${!isLast ? 'border-b border-[#e9edef] dark:border-[#202c33]' : ''}`}>
                    <div className="flex justify-between items-center mb-[2px]">
                       <span className="text-[17px] text-[#111b21] dark:text-[#e9edef] truncate pr-2">{contact.name}</span>
                       <span className="text-xs text-[#667781] dark:text-[#8696a0] shrink-0">12:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[14px] text-[#667781] dark:text-[#8696a0] truncate" title={contact.type === 'ai' ? '24/7 AI Support' : 'Tap to view secure chat'}>
                         {contact.type === 'ai' ? '24/7 AI Support' : 'Tap to view secure chat'}
                       </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {sidebarOpen && (
         <div className="absolute inset-0 bg-[#0b141a]/80 z-20 sm:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#efeae2] dark:bg-[#0b141a] relative z-10 w-full overflow-hidden">
        {/* Mock WhatsApp signature background pattern (subtle graphic representation) */}
        <div 
           className="absolute inset-0 z-0 opacity-40 dark:opacity-10 pointer-events-none" 
           style={{ 
               backgroundColor: 'transparent',
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172H51.05a3.172 3.172 0 0 1-3.172-3.172V.83l.83-.83h5.92zm-28.8 0l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172H22.25a3.172 3.172 0 0 1-3.172-3.172V.83l.83-.83h5.92zm-28.8 0l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172H-3.55a3.172 3.172 0 0 1-3.172-3.172V.83l.83-.83h5.92zM15.422 30l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172h-1.235a3.172 3.172 0 0 1-3.172-3.172V30.83l.83-.83h5.92zm28.8 0l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172h-1.235a3.172 3.172 0 0 1-3.172-3.172V30.83l.83-.83h5.92zM40.222 60l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172h-1.235a3.172 3.172 0 0 1-3.172-3.172V60.83l.83-.83h5.92zm-28.8 0l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172H10.18a3.172 3.172 0 0 1-3.172-3.172V60.83l.83-.83h5.92zm-28.8 0l.83.83v2.834a3.172 3.172 0 0 1-3.172 3.172H-18.62a3.172 3.172 0 0 1-3.172-3.172V60.83l.83-.83h5.92z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")` 
           }}>
        </div>
        
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-[#f0f2f5] dark:bg-[#222e35] z-10 border-b-[6px] border-[#00a884]">
            <Image src="/whatsapp-web-light.png" alt="" className="w-[320px] mb-8 opacity-50 dark:hidden hidden" />
            <div className="w-64 h-[180px] bg-[url('https://static.whatsapp.net/rsrc.php/v3/y6/r/wa669aeJeom.png')] bg-no-repeat bg-contain bg-center opacity-70 dark:opacity-40 mb-6"></div>
            <h3 className="text-[32px] font-light text-[#41525d] dark:text-[#e9edef] mb-4 mt-2">Seren Web</h3>
            <p className="text-[14px] text-[#667781] dark:text-[#8696a0] max-w-lg leading-6">
              Send and receive messages without keeping your phone online.<br/>
              Use Seren on up to 4 linked devices and 1 phone at the same time.
            </p>
            <div className="flex items-center text-[#8696a0] mt-10 text-[14px] gap-2">
                <svg viewBox="0 0 10 12" width="10" height="12"><path fill="currentColor" d="M5.008 1.456C6.764 1.456 8.19 2.88 8.19 4.636V5.42a1 1 0 0 1 1 1v4.062a1 1 0 0 1-1 1H1.815a1 1 0 0 1-1-1V6.42a1 1 0 0 1 1-1v-.784c0-1.756 1.425-3.18 3.193-3.18zm2.08 3.964V4.636c0-1.144-.933-2.074-2.08-2.074-1.146 0-2.081.93-2.081 2.074v.784h4.161z" /></svg>
                <span>End-to-end encrypted</span>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-[59px] px-4 flex justify-between items-center bg-[#f0f2f5] dark:bg-[#202c33] shrink-0 z-10">
              <div className="flex items-center overflow-hidden">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="sm:hidden mr-2 -ml-2 text-[#54656f] dark:text-[#aebac1]">
                   <Menu className="w-6 h-6" />
                </Button>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#dfe5e7] dark:bg-[#374248] text-[#54656f] dark:text-[#aebac1] mr-4 shrink-0 cursor-pointer">
                   {activeChat.type === 'patient' ? (
                       <span className="font-semibold text-lg">{(activeChat.name?.[0] || 'P').toUpperCase()}</span>
                    ) : (
                       activeChat.icon ? <activeChat.icon className="w-[1.2rem] h-[1.2rem]" /> : <UserIcon className="w-6 h-6" />
                    )}
                </div>
                <div className="flex flex-col cursor-pointer overflow-hidden">
                  <h2 className="text-[16px] text-[#111b21] dark:text-[#e9edef] truncate">
                    {activeChat.name}
                  </h2>
                  <p className="text-[13px] text-[#667781] dark:text-[#8696a0] truncate mt-[1px]">
                    {activeChat.type === 'ai' ? 'online' : 'click here for contact info'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-5 ml-4 shrink-0">
                 {/* Therapist Tools */}
                 {user?.role === 'therapist' && activeChat.type === 'patient' && (
                    <Button onClick={handleGenerateSummary} size="sm" variant="outline" className="gap-2 border-[#128C7E] text-[#128C7E] hover:bg-[#128C7E] hover:text-white dark:border-[#00a884] dark:text-[#00a884] dark:hover:bg-[#00a884] dark:hover:text-white transition-colors h-8">
                        <Sparkles className="w-[15px] h-[15px]" />
                        <span className="hidden sm:inline font-medium text-sm">AI Notes</span>
                    </Button>
                 )}
                 <Search className="w-[20px] h-[20px] text-[#54656f] dark:text-[#aebac1] cursor-pointer" />
                 <MoreVertical className="w-[20px] h-[20px] text-[#54656f] dark:text-[#aebac1] cursor-pointer" />
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 px-[9%] sm:px-[5%] md:px-[9%] py-4 overflow-y-auto overflow-x-hidden space-y-[2px] flex flex-col z-10 custom-scrollbar">
              
              <div className="flex justify-center mb-4 mt-2">
                 <div className="bg-[#ffeecd] dark:bg-[#182229] border border-transparent dark:border-[#182229]/80 text-[#54656f] dark:text-[#fad964] text-[12.5px] px-3 py-1.5 rounded-[8px] text-center shadow-sm max-w-sm flex items-start gap-1">
                    <svg viewBox="0 0 10 12" width="10" height="12" className="mt-[2px] shrink-0"><path fill="currentColor" d="M5.008 1.456C6.764 1.456 8.19 2.88 8.19 4.636V5.42a1 1 0 0 1 1 1v4.062a1 1 0 0 1-1 1H1.815a1 1 0 0 1-1-1V6.42a1 1 0 0 1 1-1v-.784c0-1.756 1.425-3.18 3.193-3.18zm2.08 3.964V4.636c0-1.144-.933-2.074-2.08-2.074-1.146 0-2.081.93-2.081 2.074v.784h4.161z" /></svg>
                    <span className="leading-[1.3] text-left">Messages are end-to-end encrypted. No one outside of this chat, not even Seren, can read or listen to them. <span className="text-[#008f6f] dark:text-[#53bdeb] cursor-pointer">Click to learn more.</span></span>
                 </div>
              </div>

              {isLoadingHistory ? (
                <div className="w-full flex items-center justify-center my-8">
                    <Loader2 className="w-8 h-8 text-[#00a884] animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                 null
              ) : (
                <AnimatePresence initial={false}>
                    {messages.map((msg, idx) => {
                        const isSender = msg.senderType === senderType;
                        // Tail visibility logic: Show tail if it's the first message from this sender in a cluster
                        const hasTail = idx === 0 || messages[idx-1].senderType !== msg.senderType;
                        
                        // Add some space if the previous message is from a different sender
                        const isNewCluster = idx > 0 && messages[idx-1].senderType !== msg.senderType;

                        return (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.1 }}
                                key={idx}
                                className={`flex w-full ${isSender ? 'justify-end pl-12 sm:pl-20' : 'justify-start pr-12 sm:pr-20'} ${isNewCluster ? 'mt-3' : ''}`}
                            >
                                <div className={`relative max-w-[100%] px-[9px] py-[6px] shadow-sm text-[14.2px] leading-snug ${
                                    isSender 
                                      ? `bg-[#d9fdd3] dark:bg-[#005c4b] text-[#111b21] dark:text-[#e9edef] rounded-lg ${hasTail ? 'rounded-tr-none' : ''}` 
                                      : `bg-[#ffffff] dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-lg ${hasTail ? 'rounded-tl-none' : ''}`
                                }`}>
                                  
                                  {/* Render Tail SVG */}
                                  {hasTail && (
                                     <svg viewBox="0 0 8 13" width="8" height="13" className={`absolute top-0 ${isSender ? '-right-[8px] text-[#d9fdd3] dark:text-[#005c4b]' : '-left-[8px] text-[#ffffff] dark:text-[#202c33]'}`}>
                                       {isSender 
                                          ? <path opacity="0.13" fill="#0000000" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z" /> 
                                          : <path opacity="0.13" fill="#0000000" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z" />
                                       }
                                       {isSender
                                          ? <path fill="currentColor" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z" />
                                          : <path fill="currentColor" d="M1.533,2.568L8,11.193V0H2.812C1.042,0,0.474,1.156,1.533,2.568z" />
                                       }
                                     </svg>
                                  )}

                                  <div className="flex flex-wrap items-end" style={{ wordBreak: 'break-word' }}>
                                      <span className="whitespace-pre-wrap min-w-0 pb-[8px] mr-12 text-[#111b21] dark:text-[#e9edef] font-normal" dangerouslySetInnerHTML={{ __html: msg.message.replace(/\n/g, '<br />') }} />
                                      
                                      <div className="flex items-center gap-1 float-right mt-1 ml-auto shrink-0 -mr-0.5 -mb-[3px] absolute bottom-1 right-[7px]">
                                          <span className="text-[11px] text-[#667781] dark:text-[#8696a0]/80 leading-none">
                                              {formatTime(msg.createdAt)}
                                          </span>
                                          {isSender && (
                                            <span className="text-[#53bdeb] dark:text-[#53bdeb] ml-0.5">
                                                <svg viewBox="0 0 16 15" width="16" height="15" className="mb-[1px]">
                                                    <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" />
                                                </svg>
                                            </span>
                                          )}
                                      </div>
                                  </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
              )}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex w-full justify-start mt-3">
                    <div className="relative bg-[#ffffff] dark:bg-[#202c33] px-4 py-3 rounded-lg rounded-tl-none shadow-sm flex gap-1.5 items-center">
                         <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -left-[8px] text-[#ffffff] dark:text-[#202c33]">
                             <path fill="currentColor" d="M1.533,2.568L8,11.193V0H2.812C1.042,0,0.474,1.156,1.533,2.568z" />
                         </svg>
                        <span className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-1.5 h-1.5 bg-[#8696a0] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                    </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area (WhatsApp style footer) */}
            <form onSubmit={sendMessage} className="min-h-[62px] px-3 sm:px-4 py-[10px] bg-[#f0f2f5] dark:bg-[#202c33] flex items-end gap-2 sm:gap-4 shrink-0 z-10 w-full relative">
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className="absolute bottom-20 left-4 z-50 shadow-2xl"
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiObject) => {
                          setCurrentMessage((prev) => prev + emojiObject.emoji);
                        }}
                        theme="auto"
                        lazyLoadEmojis={true}
                        searchDisabled={false}
                        skinTonesDisabled={true}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex pb-2 pl-2 text-[#54656f] dark:text-[#8696a0] gap-4 relative">
                   <Smile 
                     className={`w-[26px] h-[26px] cursor-pointer hover:text-[#111b21] dark:hover:text-[#d1d7db] transition-colors stroke-[1.5] ${showEmojiPicker ? 'text-[#008069]' : ''}`} 
                     onClick={() => setShowEmojiPicker((prev) => !prev)}
                   />
                   <Paperclip 
                     className="w-[24px] h-[24px] cursor-pointer hover:text-[#111b21] dark:hover:text-[#d1d7db] transition-colors hidden sm:block stroke-[1.5]" 
                     onClick={() => toast('Attachment feature coming soon!', { icon: '📎' })}
                   />                  </div>              <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-lg overflow-hidden flex items-center min-h-[42px]">
                  <Input
                      type="text"
                      value={currentMessage}
                      onChange={handleTyping}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              const fakeEvent = { preventDefault: () => {} };
                              sendMessage(fakeEvent);
                          }
                      }}
                      placeholder={activeChat.type === 'ai' ? 'Message AI...' : 'Type a message'}
                      className="w-full h-full px-4 py-2 bg-transparent border-none focus-visible:ring-0 text-[15px] placeholder:text-[#54656f] dark:placeholder:text-[#8696a0] text-[#111b21] dark:text-[#d1d7db]"
                      style={{ boxShadow: 'none' }}
                  />
              </div>

              <div className="pb-1 px-1">
                {(currentMessage.trim().length > 0 || isTyping) ? (
                   <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full text-[#111b21] hover:bg-black/5 dark:text-[#aebac1] dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                      disabled={!currentMessage.trim()}
                   >
                      <Send className="w-5 h-5 ml-1" />
                   </Button>
                ) : (
                   <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10 rounded-full text-[#54656f] dark:text-[#8696a0] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                   >
                      <svg viewBox="0 0 24 24" width="24" height="24" className="w-[24px] h-[24px]" fill="currentColor">
                         <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.349 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"></path>
                      </svg>
                   </Button>
                )}
              </div>
            </form>
          </>
        )}
      </div>

      {/* AI Summary Modal (Styled to match the dark slate/green vibe minimally or keep current) */}
      <Dialog open={summaryModalOpen} onOpenChange={setSummaryModalOpen}>
        <DialogContent className="sm:max-w-[600px] border-[#e9edef] dark:border-[#202c33] bg-[#f0f2f5] dark:bg-[#111b21] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#111b21] dark:text-[#e9edef]">
               <Sparkles className="w-5 h-5 text-[#00a884]" />
               AI Clinical Session Summary
            </DialogTitle>
            <DialogDescription className="text-[#54656f] dark:text-[#8696a0]">
               Automatically generated synthesis of your secure text session with {activeChat?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-white dark:bg-[#202c33] rounded-xl p-5 mt-4 border border-[#e9edef] dark:border-[#2a3942] min-h-[150px] max-h-[400px] overflow-y-auto shadow-sm">
            {isSummarizing ? (
              <div className="flex flex-col items-center justify-center text-[#54656f] dark:text-[#8696a0] py-8 gap-4">
                 <Loader2 className="w-8 h-8 animate-spin text-[#00a884]" />
                 <p className="animate-pulse">Gemini is analyzing the transcript...</p>
              </div>
            ) : summary ? (
              <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-[#111b21] dark:text-[#e9edef]">
                 {summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                 ))}
              </div>
            ) : (
              <div className="text-center text-[#54656f] dark:text-[#8696a0] py-8">No summary available.</div>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="border-[#e9edef] dark:border-[#2a3942] text-[#54656f] dark:text-[#aebac1] hover:bg-[#e9edef] dark:hover:bg-[#202c33]" onClick={() => setSummaryModalOpen(false)}>Close</Button>
            <Button className="bg-[#00a884] hover:bg-[#008f6f] text-white" disabled={!summary}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Save to EHR Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;
