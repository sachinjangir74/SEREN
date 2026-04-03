import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const fetchNotifications = async () => {
  const token = localStorage.getItem('token');
  if (!token) return [];
  const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/notifications`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

const markAsRead = async (id: string) => {
  const token = localStorage.getItem('token');
  await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000, // check every 30s
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const mutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.preventDefault();
    mutation.mutate('all');
  };

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) mutation.mutate(id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-slate-950"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Notifications</h3>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs text-primary-500 hover:text-primary-600 font-medium transition-colors">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No new notifications
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif: any) => (
                <Link
                  to={notif.link || '#'}
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif._id, notif.isRead)}
                  className={`px-4 py-3 block hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-50 dark:border-slate-800/30 last:border-0 ${notif.isRead ? 'opacity-60' : 'bg-primary-50/30 dark:bg-primary-900/10'}`}
                >
                  <div className="flex gap-3 items-start">
                    {!notif.isRead && <div className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0"></div>}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-tight">
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};