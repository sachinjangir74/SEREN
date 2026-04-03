import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Copy, Check, User, ChevronDown, LogOut, Settings, Calendar, Bell } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
  import { useQuery, useQueryClient } from '@tanstack/react-query';

export const TopBanner = ({ visible, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText('SEREN10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-teal-700 text-teal-50 text-sm py-2 px-4 flex justify-between items-center w-full z-50">
      <div className="flex-1 flex flex-wrap justify-center items-center gap-x-2 font-medium">
        <span>Get 10% Off On Your First Therapy Plan</span>
        <span className="hidden sm:inline">|</span>
        <div className="flex items-center gap-2">
          <span>Code:</span>
          <span className="font-bold bg-teal-800/80 px-2.5 py-0.5 rounded border border-dashed border-teal-300 text-white tracking-widest">SEREN10</span>
          <button 
            onClick={handleCopy} 
            className="p-1 hover:bg-teal-600 rounded transition-colors flex items-center justify-center text-teal-200 hover:text-white"
            title="Copy promo code"
          >
            {copied ? <Check size={16} className="text-green-300" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-teal-800 transition">
        <X size={16} />
      </button>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const markAllAsRead = async () => {
    try {
      queryClient.setQueryData(["navbarNotifications"], (oldData: any) => 
        oldData?.map((n: any) => ({ ...n, isRead: true }))
      );
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/notifications/all/read`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      queryClient.invalidateQueries({ queryKey: ["navbarNotifications"] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => window.scrollTo(0, 0), 100);
    }
  };

  const { data: notifications } = useQuery({
    queryKey: ["navbarNotifications"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/notifications`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return res.data.data;
    },
    enabled: !!user?.token,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > (bannerVisible ? 40 : 10));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [bannerVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target as Node);
      const isOutsideBell = bellRef.current && !bellRef.current.contains(event.target as Node);
      
      if (isOutsideDropdown && isOutsideBell) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { 
      name: 'Services', 
      isDropdown: true,
      items: [
        { name: '1-on-1 Therapy', href: '/services/one-to-one-therapy' },
        { name: 'Couples Therapy', href: '/services/couples-therapy' },
        { name: 'Psychiatric Sessions', href: '/services/psychiatric-sessions' },
        { name: 'Teen Counseling', href: '/services/teen-counseling' }
      ]
    },
    { name: 'Programs', isDropdown: true, items: [{ name: 'Self Help', href: '/programs/self-help' }, { name: 'Happiness Program', href: '/programs/happiness-program' }, { name: 'Anxiety Relief', href: '/programs/anxiety-relief' }, { name: 'Free Assessments', href: '/programs/free-assessments' }] },
    { name: 'Therapists', href: '/therapists' },
    { name: 'Resources', href: '/resources' },
    { name: 'FAQ', href: '/#faq' },
  ];

  return (
    <div className="fixed w-full top-0 z-50 flex flex-col shadow-sm">
      <TopBanner visible={bannerVisible} onClose={() => setBannerVisible(false)} />
      
      <nav className={`w-full transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md py-3' : 'bg-white py-5'}`}>
        <div className="container mx-auto px-4 max-w-7xl flex justify-between items-center">
           <a href="/" onClick={handleLogoClick} className="text-2xl font-black tracking-tight text-teal-600 flex items-center gap-2 cursor-pointer">
             <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
             </div>
             SEREN
           </a>
           
           <div className="hidden md:flex items-center gap-8" ref={dropdownRef}>
             {navLinks.map(link => {
                if (link.isDropdown) {
                  return (
                    <div 
                      key={link.name} 
                      className="relative group"
                      onMouseEnter={() => setActiveDropdown(link.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button 
                         className="flex items-center text-slate-600 hover:text-teal-600 font-medium text-sm transition"
                         onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      >
                         {link.name} <ChevronDown size={14} className="ml-1" />
                      </button>
                      
                      <div 
                         className={`absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 transition-all duration-200 ${activeDropdown === link.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} group-hover:opacity-100 group-hover:visible group-hover:translate-y-0`}
                      >
                        {link.items.map(subItem => (
                           <Link 
                             key={subItem.name} 
                             to={subItem.href} 
                             className="block px-4 py-2 text-sm text-slate-600 hover:text-teal-600 hover:bg-slate-50 transition"
                             onClick={() => setActiveDropdown(null)}
                           >
                              {subItem.name}
                           </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return link.href.startsWith('/#') ? 
                  <a key={link.name} href={link.href} className="text-slate-600 hover:text-teal-600 font-medium text-sm transition">{link.name}</a> :
                  <Link key={link.name} to={link.href} className="text-slate-600 hover:text-teal-600 font-medium text-sm transition">{link.name}</Link>
             })}
           </div>

           <div className="hidden md:flex items-center gap-5">
              <Link to="/assessments/anxiety-assessment" className="text-teal-600 hover:text-teal-700 font-bold text-sm transition mr-2">Take Assessment</Link> 

              {user ? (
                <div className="flex items-center gap-4">
                  <div className="relative" ref={bellRef}>
                    <button 
                      onClick={() => {
                        setActiveDropdown(activeDropdown === 'notifications' ? null : 'notifications');
                      }}
                      className="relative text-slate-500 hover:text-teal-600 transition cursor-pointer p-1"
                    >
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white shadow-sm ring-2 ring-white">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    <div className={`absolute right-0 mt-2 w-80 bg-white border border-slate-100 shadow-xl rounded-xl py-2 overflow-hidden transition-all duration-200 z-50 ${activeDropdown === 'notifications' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onPointerDown={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAllAsRead();
                            }} 
                            className="text-xs font-semibold text-teal-600 hover:text-teal-800 transition"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {!notifications || notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-slate-500">
                            You're all caught up!
                          </div>
                        ) : (
                          notifications.map((notif: any) => (
                            <div key={notif._id} className={`px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 last:border-0 ${!notif.isRead ? 'bg-teal-50/30' : 'opacity-60'}`}>
                              <p className={`text-sm ${!notif.isRead ? 'font-bold text-slate-800' : 'text-slate-500'}`}>{notif.message}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <ProfileDropdown />
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-teal-600 font-bold text-sm transition">Sign In</Link>
                  <Link to="/signup" className="bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md shadow-teal-500/20 hover:bg-teal-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">Get Started</Link>
                </>
              )}
           </div>

           <button className="md:hidden text-slate-700" onClick={() => setIsOpen(!isOpen)}>
             {isOpen ? <X size={28} /> : <Menu size={28} />}
           </button>
         </div>

         {/* Mobile menu */}
         {isOpen && (
           <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 p-4 flex flex-col gap-4">
             {navLinks.map(link => {
                if (link.isDropdown) {
                  return (
                    <div key={link.name} className="flex flex-col gap-2">
                      <span className="text-slate-900 font-bold py-2 px-4">{link.name}</span>
                      <div className="flex flex-col pl-4 border-l-2 border-slate-100 ml-4">
                        {link.items.map(subItem => (
                          <Link 
                            key={subItem.name} 
                            to={subItem.href} 
                            onClick={() => setIsOpen(false)}
                            className="text-slate-600 font-medium py-2 px-4 rounded-xl hover:bg-slate-50 hover:text-teal-600"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return link.href.startsWith('/#') ? 
                  <a key={link.name} onClick={() => setIsOpen(false)} href={link.href} className="text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-50">{link.name}</a> :
                  <Link key={link.name} onClick={() => setIsOpen(false)} to={link.href} className="text-slate-700 font-medium py-3 px-4 rounded-xl hover:bg-slate-50">{link.name}</Link>
             })}
             <div className="border-t border-slate-100 pt-6 mt-2 flex flex-col gap-3 px-4 pb-4">
                <Link to="/assessments/anxiety-assessment" onClick={() => setIsOpen(false)} className="text-teal-700 font-bold py-3 text-center border-2 border-teal-100 bg-teal-50 rounded-full hover:border-teal-200">Take Assessment</Link>
                
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="text-slate-700 font-bold py-3 text-center border-2 border-slate-100 rounded-full hover:border-slate-200 flex items-center justify-center gap-2">
                      <User size={18} /> Profile
                    </Link>
                    <Link to="/appointments" onClick={() => setIsOpen(false)} className="text-slate-700 font-bold py-3 text-center border-2 border-slate-100 rounded-full hover:border-slate-200 flex items-center justify-center gap-2">
                      <Calendar size={18} /> Appointments
                    </Link>
                    <Link to="/settings" onClick={() => setIsOpen(false)} className="text-slate-700 font-bold py-3 text-center border-2 border-slate-100 rounded-full hover:border-slate-200 flex items-center justify-center gap-2">
                      <Settings size={18} /> Settings
                    </Link>
                    <button 
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                        navigate('/');
                      }} 
                      className="text-red-600 font-bold py-3 text-center border-2 border-red-100 bg-red-50 rounded-full hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-slate-700 font-bold py-3 text-center border-2 border-slate-200 rounded-full hover:border-slate-300">Sign In</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-teal-600 text-white font-bold py-3 text-center rounded-full hover:bg-teal-700 shadow-md">Get Started</Link>
                  </>
                )}
             </div>
           </div>
         )}
      </nav>
    </div>
  );
};

export default Navbar;
