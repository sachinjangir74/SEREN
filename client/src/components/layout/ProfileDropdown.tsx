import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown, LogOut, Settings, Calendar, HelpCircle, ChevronRight, MessageCircle, BookOpen, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AvatarDisplay = ({ user, isOpen, toggleDropdown }: any) => {
  const displayName = user?.name || user?.firstName || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <button 
      onClick={toggleDropdown}
      className={`flex items-center gap-2.5 hover:bg-slate-50 border border-transparent hover:border-slate-200 px-1.5 py-1.5 pr-3 pl-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      <div className="w-8 h-8 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-teal-100">
        {initial}
      </div>
      <span className="text-sm font-medium text-slate-700">{(displayName || '').split(' ')[0]}</span>
      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

const HelpSubmenu = () => (
  <div className="absolute hidden group-hover:block right-[100%] top-0 pr-2 w-56">
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 py-2">
      <Link to="/faq" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-teal-700 hover:bg-teal-50 transition-colors">
        <MessageCircle size={16} className="text-slate-400" />
        FAQs & Support
      </Link>
      <Link to="/contact" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-teal-700 hover:bg-teal-50 transition-colors">
        <BookOpen size={16} className="text-slate-400" />
        Contact Us
      </Link>
      <Link to="/terms" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-teal-700 hover:bg-teal-50 transition-colors">
        <FileText size={16} className="text-slate-400" />
        Terms & Policies
      </Link>
    </div>
  </div>
);

const DropdownMenu = ({ user, isOpen, closeDropdown, handleLogout }: any) => {
  const displayName = user?.name || user?.firstName || 'User';

  return (
    <div 
      className={`absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 py-2 z-50 transform origin-top-right transition-all duration-200 ease-out ${isOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}
    >
      <div className="px-4 py-2 border-b border-slate-50 mb-1">
        <p className="text-sm font-medium text-slate-800 truncate mb-0.5">{displayName}</p>
        <p className="text-xs font-medium text-slate-500 truncate">{user?.email || "No email provided"}</p>
      </div>

      <div className="px-2 flex flex-col gap-0.5 border-b border-slate-50 pb-1 mb-1">
        <Link to="/profile" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-teal-700 hover:bg-teal-50 transition-colors">
          <User size={16} className="text-slate-400" /> Profile
        </Link>
        <Link to="/appointments" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-teal-700 hover:bg-teal-50 transition-colors">
          <Calendar size={16} className="text-slate-400" /> Appointments
        </Link>
        <Link to="/settings" onClick={closeDropdown} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-teal-700 hover:bg-teal-50 transition-colors">
          <Settings size={16} className="text-slate-400" /> Settings
        </Link>
      </div>

      <div className="px-2 flex flex-col gap-0.5 border-b border-slate-50 pb-1 mb-1">
        <div className="group relative">
          <button className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-teal-700 hover:bg-teal-50 transition-colors">
            <span className="flex items-center gap-3">
              <HelpCircle size={16} className="text-slate-400" /> Help
            </span>
            <ChevronRight size={14} className="text-slate-400" />
          </button>
          <HelpSubmenu />
        </div>
      </div>

      <div className="px-2 pt-1">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut size={16} className="text-red-500" /> Log Out
        </button>
      </div>
    </div>
  );
};

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <AvatarDisplay user={user} isOpen={isOpen} toggleDropdown={() => setIsOpen(!isOpen)} />
      <DropdownMenu user={user} isOpen={isOpen} closeDropdown={() => setIsOpen(false)} handleLogout={handleLogout} />
    </div>
  );
};

export default ProfileDropdown;
