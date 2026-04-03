import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, Activity, Database, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    appointments: 0,
    appointmentData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch admin statistics');
        
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        toast.error('Failed to load admin statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-80px)] w-full items-center justify-center">
        <span className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const chartData = stats.appointmentData?.length ? stats.appointmentData : [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 7 },
    { name: 'Wed', value: 3 },
    { name: 'Thu', value: 8 },
    { name: 'Fri', value: 6 },
    { name: 'Sat', value: 2 },
    { name: 'Sun', value: 5 },
  ];

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl animate-fade-in custom-scrollbar">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
          Admin Control Center
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Welcome back, {user?.name}. Here's an overview of the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="bg-white dark:bg-slate-900 border-none shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.users}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-none shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Appointments</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.appointments}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-none shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl text-purple-600 dark:text-purple-400">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">System Status</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Optimal</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-slate-900 border-none shadow-sm shadow-slate-200/50 dark:shadow-none hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400">
              <Database size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Database</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Connected</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Appointment Activity</CardTitle>
            <CardDescription>Appointments booked over the past week</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Users size={18} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">Manage Users</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View and edit user accounts</p>
                </div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Key size={18} className="text-indigo-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">Security Settings</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Configure access controls</p>
                </div>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left group">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Database size={18} className="text-amber-500" />
                </div>
                <div>
                  <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100">System Logs</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View application logs</p>
                </div>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;