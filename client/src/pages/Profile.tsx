import React, { useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity, Heart, Calendar as CalendarIcon, MessageSquare, TrendingUp, Clock, Plus, Video, ArrowRight, Star, Headphones, Wind, Sparkles, Download, Flame, Target, TrendingDown } from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Image } from '../components/ui/Image';

const moodData = [
  { name: "Mon", mood: 6, stress: 4 },
  { name: "Tue", mood: 7, stress: 3 },
  { name: "Wed", mood: 5, stress: 6 },
  { name: "Thu", mood: 8, stress: 2 },
  { name: "Fri", mood: 9, stress: 2 },
  { name: "Sat", mood: 8, stress: 3 },
  { name: "Sun", mood: 9, stress: 1 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const fetchAppointments = async (token: string) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/appointments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

const fetchInsights = async (token: string) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/ai/insights`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const moodEntries = payload[0]?.payload?.entries || [];
    const stressEntries = payload[1]?.payload?.entries || [];
    
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded-xl shadow-lg">
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-2">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Mood: <span className="font-bold text-slate-900 dark:text-white">{payload[0]?.value}</span>
            {moodEntries.length > 1 && (
              <span className="text-xs text-teal-600 ml-2 font-medium">({moodEntries.length} logs avg)</span>
            )}
          </span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Stress: <span className="font-bold text-slate-900 dark:text-white">{payload[1]?.value}</span>
              {stressEntries.length > 1 && (
                <span className="text-xs text-rose-600 ml-2 font-medium">({stressEntries.length} logs avg)</span>
              )}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};


// --- BEGIN ADVANCED DASHBOARD ---
const MoodAnalyticsDashboard = ({ moodHistory, onReset }: { moodHistory: any[], onReset: () => void }) => {
  const [timeRange, setTimeRange] = useState<'week'|'month'>('week');
  const [selectedDay, setSelectedDay] = useState<any>(null);

  const { chartData, heatmapData, streak, insights } = React.useMemo(() => {
    // 1. Process History into Day Buckets
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const daysMap: Record<string, { mood: number, stress: number, count: number, raw: string[], entries: any[] }> = {};
    
    // Sort chronological: oldest to newest
    const sorted = [...moodHistory].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    sorted.forEach((m) => {
      const rawMood = String(m.mood).toLowerCase().trim();
      let mv = 5; let sv = 5;
      if (rawMood === 'happy') { mv = 9; sv = 1; }
      else if (rawMood === 'calm') { mv = 6; sv = 4; }
      else if (rawMood === 'neutral') { mv = 5; sv = 5; }
      else if (rawMood === 'anxious') { mv = 2; sv = 8; }
      else if (rawMood === 'sad') { mv = 4; sv = 6; }
      else if (rawMood === 'angry') { mv = 1; sv = 9; }

      const dateObj = new Date(m.createdAt);
      const targetDate = new Date(dateObj);
      targetDate.setHours(0,0,0,0);
      const dayStr = targetDate.toLocaleDateString('en-CA');

      if (!daysMap[dayStr]) daysMap[dayStr] = { mood: 0, stress: 0, count: 0, raw: [], entries: [] };
      
      daysMap[dayStr].mood += mv;
      daysMap[dayStr].stress += sv;
      daysMap[dayStr].count += 1;
      daysMap[dayStr].raw.push(rawMood);
      daysMap[dayStr].entries.push({ time: dateObj.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'}), raw: rawMood, mv, sv });
    });

    // 2. Aggregate Data
    const fullData = [];
    let currentStreak = 0;
    let checkDate = new Date(today);

    // Calculate Streak (consecutive days checking backwards)
    let streakActive = true;
    while (streakActive) {
       const dStr = checkDate.toLocaleDateString('en-CA');
       if (daysMap[dStr]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
       } else {
          // If checking today and it's missing, check yesterday before breaking streak
          if (checkDate.getTime() === today.getTime()) checkDate.setDate(checkDate.getDate() - 1);
          else streakActive = false;
       }
       if (currentStreak > 365) break; 
    }

    // Determine slice range 
    const rangeDays = timeRange === 'week' ? 7 : 30;
    
    for (let i = rangeDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const formatName = d.toLocaleDateString('en-US', { weekday: 'short', month:'short', day:'numeric' });
        const mapKey = d.toLocaleDateString('en-CA');
        
        if (daysMap[mapKey]) {
           const avgMood = daysMap[mapKey].mood / daysMap[mapKey].count;
           const avgStr = daysMap[mapKey].stress / daysMap[mapKey].count;
           fullData.push({
              name: formatName, 
              fullDate: d.toLocaleDateString(),
              mood: Math.round(avgMood * 10)/10, 
              stress: Math.round(avgStr * 10)/10, 
              raw: daysMap[mapKey].raw[daysMap[mapKey].raw.length-1],
              entries: daysMap[mapKey].entries 
           });
        } else {
           fullData.push({ name: formatName, fullDate: d.toLocaleDateString(), mood: null, stress: null, raw: 'No Data', empty: true, entries: [] });
        }
    }

    // Heatmap (Last 14 days)
    const heatData = [];
    for(let i=0; i<14; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        heatData.unshift({ date: d, mapped: daysMap[d.toLocaleDateString('en-CA')] ? { 
            mood: Math.round((daysMap[d.toLocaleDateString('en-CA')].mood/daysMap[d.toLocaleDateString('en-CA')].count)*10)/10 
        } : null });
    }

    // Insights
    const validDays = fullData.filter(d => !d.empty);
    const avgM = validDays.length ? validDays.reduce((a,b)=>a+b.mood,0)/validDays.length : 5;
    const avgS = validDays.length ? validDays.reduce((a,b)=>a+b.stress,0)/validDays.length : 5;
    
    let suggestion = "You're doing great! Keep maintaining this balance.";
    let sColor = "bg-teal-50 text-teal-800 border-teal-200";
    if (avgM < 4) {
       suggestion = "Your mood has been consistently low. Consider speaking with a therapist.";
       sColor = "bg-rose-50 text-rose-800 border-rose-200";
    } else if (avgS > 7) {
       suggestion = "Stress levels are peaking. Try a 5-minute breathing exercise today.";
       sColor = "bg-orange-50 text-orange-800 border-orange-200";
    } else if (currentStreak >= 3 && avgM > 6) {
       suggestion = "3+ day streak of positive moods! Whatever you're doing is working.";
       sColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
    }

    return { 
       chartData: fullData, 
       streak: currentStreak, 
       heatmapData: heatData,
       insights: { avgMood: avgM.toFixed(1), avgStress: avgS.toFixed(1), suggestion, sColor }
    };
  }, [moodHistory, timeRange]);

  const handleExport = () => { window.print(); };

  return (
    <Card className="h-full overflow-hidden border-2 shadow-md">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-4">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            Advanced Analytics
            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
              <Flame className="w-3 h-3 text-orange-500" /> {streak} Day Streak
            </span>
          </CardTitle>
          <CardDescription>Deep dive into your emotional patterns</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center print:hidden">
            <button onClick={() => setTimeRange('week')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeRange==='week'?'bg-white shadow-sm text-slate-800':'text-slate-500'}`}>7 Days</button>
            <button onClick={() => setTimeRange('month')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${timeRange==='month'?'bg-white shadow-sm text-slate-800':'text-slate-500'}`}>30 Days</button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:flex print:hidden">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="ghost" size="sm" onClick={onReset} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 print:hidden text-xs ml-2">
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Top Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Insight 1 */}
           <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Average Mood</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-slate-800">{insights.avgMood}</span>
                <span className="text-sm font-medium text-teal-500 flex items-center mb-1"><TrendingUp className="w-3 h-3 mr-0.5"/> / 10</span>
              </div>
           </div>
           {/* Insight 2 */}
           <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Average Stress</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-extrabold text-slate-800">{insights.avgStress}</span>
                <span className="text-sm font-medium text-rose-500 flex items-center mb-1"><TrendingDown className="w-3 h-3 mr-0.5"/> / 10</span>
              </div>
           </div>
           {/* Insight 3: Goal */}
           <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-center relative overflow-hidden">
              <Target className="absolute right-[-10px] bottom-[-10px] w-20 h-20 text-slate-100 opacity-50" />
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1 relative z-10">Current Goal</p>
              <p className="font-semibold text-slate-800 text-sm relative z-10">Maintain Mood 7+</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 relative z-10">
                <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${Math.min((parseFloat(insights.avgMood) / 7) * 100, 100)}%` }}></div>
              </div>
           </div>
        </div>

        {/* AI Suggestion */}
        <div className={`p-4 rounded-xl ${insights.sColor} border border-black/5 flex items-start gap-3`}>
           <Sparkles className="w-5 h-5 mt-0.5 shrink-0" />
           <div>
             <h4 className="font-semibold text-sm">AI Wellness Insight</h4>
             <p className="text-sm mt-0.5 opacity-90">{insights.suggestion}</p>
           </div>
        </div>

        {/* Graph Section */}
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} onClick={(e) => {
                if (e && e.activePayload) {
                    setSelectedDay(e.activePayload[0].payload);
                }
              }}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area connectNulls type="monotone" dataKey="mood" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#14b8a6" }} activeDot={{ r: 6, strokeWidth: 0, fill: "#14b8a6", cursor: "pointer" }} />
              <Area connectNulls type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorStress)" dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#f43f5e" }} activeDot={{ r: 6, strokeWidth: 0, fill: "#f43f5e", cursor: "pointer" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-0">Tip: Click on any data point to view hourly details.</p>

        {/* Selected Day Drill-down */}
        {selectedDay && selectedDay.entries && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-slate-950 text-white rounded-xl shadow-inner mt-4 overflow-hidden">
             <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm">Detailed Hourly Log: {selectedDay.fullDate}</h4>
                <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-white text-xs bg-white/10 px-2 py-1 rounded">Close</button>
             </div>
             <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {selectedDay.entries.map((entry: any, i: number) => (
                  <div key={i} className="flex-shrink-0 bg-white/5 border border-white/10 rounded-lg p-3 w-32 border-l-2 border-l-teal-500">
                     <p className="text-[10px] text-slate-400 font-medium mb-1">{entry.time}</p>
                     <p className="text-sm font-bold capitalize truncate">{entry.raw}</p>
                     <p className="text-[10px] mt-1 text-slate-300">Mood: {entry.mv} | Str: {entry.sv}</p>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* Heatmap Section */}
        <div className="pt-4 border-t border-slate-100">
           <h4 className="text-xs uppercase tracking-wider font-bold text-slate-500 mb-3">14-Day Intensity Heatmap</h4>
           <div className="flex gap-1.5 overflow-x-auto pb-2">
              {heatmapData.map((hd: any, i: number) => {
                 let bgColor = 'bg-slate-100'; // Missing data
                 if (hd.mapped) {
                    if (hd.mapped.mood >= 7) bgColor = 'bg-emerald-400 shadow-sm shadow-emerald-400/20'; // Great
                    else if (hd.mapped.mood >= 5) bgColor = 'bg-teal-300';
                    else if (hd.mapped.mood >= 3) bgColor = 'bg-amber-400';
                    else bgColor = 'bg-rose-500 shadow-sm shadow-rose-500/20'; // Low mood
                 }
                 return (
                   <div key={i} className="flex flex-col items-center gap-1 group relative cursor-help">
                      <div className={`w-8 h-8 rounded-md ${bgColor} border border-black/5 transition-transform hover:scale-110`} />
                      <span className="text-[9px] text-slate-400 font-medium">{hd.date.getDate()}</span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        {hd.date.toLocaleDateString('short')} : {hd.mapped ? `Mood ${hd.mapped.mood}` : 'No logs'}
                      </div>
                   </div>
                 );
              })}
           </div>
        </div>

      </CardContent>
    </Card>
  );
};
// --- END ADVANCED DASHBOARD ---

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [mood, setMood] = useState('Happy');
  const [moodNote, setMoodNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetWeek = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/mood/reset-week`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      refetchMoods();
      toast.success('Weekly graph reset successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to reset graph data');
    }
  };

  const fetchMoods = async (token: string) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/mood/user`, {      
      headers: { Authorization: `Bearer ${token}` } 
    });
    return res.data.data;
  };

  const fetchAppointments = async (token: string) => {
    return res.data.data;
  };

  const fetchInsights = async (token: string) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/ai/insights`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.data;
  };

  const { data: moodHistory, refetch: refetchMoods } = useQuery({
    queryKey: ["moodData", user?._id],
    queryFn: () => fetchMoods(user?.token || ""),
    enabled: !!user?.token,
  });

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => fetchAppointments(user?.token || ""),
    enabled: !!user?.token,
  });

  const { data: aiInsights, isLoading: isLoadingInsights, refetch: refetchInsights } = useQuery({
    queryKey: ["aiInsights"],
    queryFn: () => fetchInsights(user?.token || ""),
    enabled: !!user?.token,
  });

  // DAILY CHECK-IN EXPERIENCE (Phase 5)
  React.useEffect(() => {
    if (aiInsights && aiInsights.gamification) {
      const lastActive = aiInsights.gamification.lastActiveDate;
      const today = new Date().toDateString();
      if (!lastActive || new Date(lastActive).toDateString() !== today) {
        // Only show if we haven't logged today
        setShowMoodModal(true);
      }
    }
  }, [aiInsights]);

  const handleLogMood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return toast.error('Please select a mood');
    setIsSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/mood`, { mood, note: moodNote }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setShowMoodModal(false);
      setMoodNote('');
      refetchMoods();
      refetchInsights(); // Refresh gamification UI
      toast.success('Mood logged successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to log mood: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const latestMoods = moodHistory || [];

  const upcomming = appointments?.filter((a: any) => new Date(a.date) >= new Date()) || [];

  // Recommender Logic
  const latestAssessment = user?.assessmentResults?.length > 0 
    ? [...user.assessmentResults].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] 
    : null;

  const severityStr = latestAssessment?.severity?.toLowerCase() || 'low';
  const requiresTherapy = ['moderate', 'high', 'severe'].includes(severityStr);

  const recommendedPrograms = [
    { title: "Managing Daily Stress", desc: "A 4-week audio guide to lower anxiety.", icon: Headphones, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-500/10", link: "/programs/managing-stress" },
    { title: "Mindful Breathing 101", desc: "Quick 5-minute exercises for immediate calm.", icon: Wind, color: "text-sky-500", bg: "bg-sky-100 dark:bg-sky-500/10", link: "/programs/mindful-breathing" }
  ];

  const recommendedTherapists = [
    { name: "Dr. Sarah Jenkins", spec: "Anxiety & Depression", rating: 4.9, img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300", link: "/therapists" },
    { name: "Dr. Michael Chen", spec: "CBT & Stress Management", rating: 4.8, img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300", link: "/therapists" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pt-24 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden mb-8 shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent z-10" />
             <Image src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=2000" alt="Dashboard Nature Banner" className="w-full h-full object-cover" />
           </div>
           
           <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="backdrop-blur-[2px] p-2 rounded-2xl bg-black/5 inline-block">
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-teal-100 uppercase bg-teal-900/40 rounded-full backdrop-blur-md border border-teal-500/20">Your Space</span>
                <h1 className="text-3xl md:text-5xl tracking-tight font-extrabold text-white mb-2 drop-shadow-sm">
                  Welcome back, <span className="text-teal-400 drop-shadow-md">{user?.name?.split(" ")[0] || "User"}</span>
                </h1>
                <p className="text-slate-200 text-lg max-w-xl font-medium">We're glad you're here. Let's take a deep breath and pick up where you left off.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md hidden sm:flex" onClick={() => setShowMoodModal(true)}>
                  <Activity className="w-4 h-4 mr-2" /> Log Mood
                </Button>
                <Button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold border-0" onClick={() => navigate("/appointment")}>
                  <Plus className="w-4 h-4 mr-2" /> New Session
                </Button>
              </div>
           </div>
        </motion.div>

        {/* Phase 2 & 8: Smart AI Dashboard & Journey Plan */}
        {aiInsights && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Gamification & Prediction */}
            <Card className="col-span-1 border-teal-100 dark:border-teal-900 bg-white dark:bg-slate-900 shadow-md">
              <CardHeader className="bg-teal-50 dark:bg-teal-900/20 pb-4">
                <CardTitle className="text-xl text-teal-800 dark:text-teal-300 flex items-center justify-between">
                  Daily Insights
                  <Sparkles className="w-5 h-5" />
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Powered by Seren AI
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-800/50 text-orange-600 dark:text-orange-400 rounded-lg">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Current Streak</p>
                      <p className="text-xs text-slate-500">Keep logging your mood!</p>
                    </div>
                  </div>
                  <strong className="text-xl text-orange-600">{aiInsights.gamification.currentStreak} Days</strong>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Emotion Forecast</p>
                  <div className="p-3 bg-sky-50 dark:bg-sky-900/10 rounded-xl text-sm text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-800/30">
                    "{aiInsights.prediction}"
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Suggested Next Step</p>
                  <Link to={aiInsights.recommendedAction.link} className="block p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm shadow-sm transition-transform hover:scale-[1.02]">
                    <strong>{aiInsights.recommendedAction.title}</strong>
                    <p className="text-teal-100 text-xs mt-1">{aiInsights.recommendedAction.desc}</p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Journey Plan */}
            <Card className="col-span-1 lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Your Journey Plan
                </CardTitle>
                <CardDescription>A personalized path to better mental wellbeing</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  
                  {Object.entries(aiInsights.journey).map(([key, step]: any, index) => (
                    <div key={key} className="relative flex items-start gap-4 mb-6 last:mb-0">
                      <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-lg z-10 shrink-0 transition-colors ${
                        step.completed 
                          ? 'border-teal-100 bg-teal-500 text-white dark:border-teal-900' 
                          : 'border-slate-100 bg-white text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <div className="pt-2 flex-grow">
                        <h4 className={`text-lg font-semibold ${step.completed ? 'text-teal-700 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          {key === 'step1' && 'Begin your journey by discovering your current mental state.'}
                          {key === 'step2' && 'Follow guided exercises tailored to your assessment results.'}
                          {key === 'step3' && 'Connect with a professional for deeper progress.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* Overview Bento */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
             <MoodAnalyticsDashboard moodHistory={latestMoods} onReset={handleResetWeek} />
          </motion.div>

          {/* Upcoming Sessions */}
          <motion.div variants={itemVariants} className="h-full" id="appointments">
            <Card className="h-full flex flex-col">
              <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Upcoming Sessions
                <CalendarIcon className="w-5 h-5 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                  <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                </div>
              ) : upcomming.length > 0 ? (
                upcomming.slice(0, 3).map((apt: any) => (
                  <div key={apt._id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col gap-2 hover:border-primary-500/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{apt.therapistName || "Therapist Session"}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(apt.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at {apt.time}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant={apt.type === "video" ? "primary" : "secondary"} className="w-full mt-2" onClick={() => navigate("/video", { state: { roomId: apt._id } })}>
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-6">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                    <CalendarIcon className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">No upcoming sessions</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/appointment")}>
                    Book Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>

          {/* NEW: Recommended For You */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
            <Card className="border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
               <CardHeader className="relative z-10 space-y-1">
                 <div className="flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-primary-500 animate-pulse" />
                   <CardTitle className="text-xl">Recommended For You</CardTitle>
                 </div>
                 <CardDescription>
                   {requiresTherapy 
                     ? "Based on your recent check-in, highly-rated professionals ready to support your journey."
                     : "Based on your check-in, guided programs to maintain your wellness."}
                 </CardDescription>
               </CardHeader>
               <CardContent className="relative z-10">
                 {requiresTherapy ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedTherapists.map((therapist, i) => (
                        <div key={i} className="flex flex-col p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300 transform hover:-translate-y-1">
                          <div className="flex items-center gap-4 mb-4">
                            <Image src={therapist.img} alt={therapist.name} className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-50 dark:ring-slate-800 transition-all" />
                            <div>
                              <h4 className="font-semibold text-slate-900 dark:text-white">{therapist.name}</h4>
                              <p className="text-xs text-slate-500">{therapist.spec}</p>
                              <div className="flex items-center gap-1 mt-1 text-amber-500">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <span className="text-xs font-medium">{therapist.rating}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full mt-auto hover:bg-primary-50 hover:text-primary-700 dark:hover:bg-primary-900/30 dark:hover:text-primary-300 border-slate-200 transition-colors" onClick={() => navigate(therapist.link)}>
                            Book Therapy <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      ))}
                    </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendedPrograms.map((prog, i) => (
                        <div key={i} className="group/card flex items-start gap-5 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800/50 transition-all duration-300 transform hover:-translate-y-1">
                           <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${prog.bg} group-hover/card:scale-105 transition-transform`}>
                             <prog.icon className={`w-6 h-6 ${prog.color}`} />
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="font-semibold text-slate-900 dark:text-white truncate">{prog.title}</h4>
                             <p className="text-sm text-slate-500 mt-1 line-clamp-2">{prog.desc}</p>
                             <Link to={prog.link} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 mt-3 group-hover/card:underline decoration-primary-300 underline-offset-4">
                               Start Program <ArrowRight className="w-4 h-4 ml-1 transform group-hover/card:translate-x-1 transition-transform" />
                             </Link>
                           </div>
                        </div>
                      ))}
                    </div>
                 )}
               </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions / Insights Bento */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
            <Card className="border-0 shadow-none bg-transparent">
              <CardContent className="p-0">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/10 border border-teal-100 dark:border-teal-900/30 relative overflow-hidden group">
                  <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-teal-500/10 dark:text-teal-400/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                       <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-950/50 rounded-full">Daily Affirmation</span>
                       <p className="text-teal-900 dark:text-teal-50 font-semibold text-xl md:text-2xl leading-relaxed max-w-2xl">
                        "I give myself permission to pause, breathe, and reset. My peace is my priority."
                       </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium text-sm">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      Keep your focus
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Program Progress */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
             <Card>
               <CardHeader>
                 <CardTitle>My Programs</CardTitle>
               </CardHeader>
               <CardContent>
                 {user?.enrolledPrograms?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {user.enrolledPrograms.map((prog: any, i: number) => (
                        <div key={i} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl relative overflow-hidden">
                           <h4 className="font-semibold text-slate-800 dark:text-white capitalize mb-2">{prog.programSlug.replace(/-/g, ' ')}</h4>
                           <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                             <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${prog.progress || 0}%` }}></div>
                           </div>
                           <div className="flex justify-between items-center text-xs text-slate-500">
                             <span>{prog.progress || 0}% Completed</span>
                             <Link to={`/programs/${prog.programSlug}`} className="text-primary-600 hover:text-primary-700 font-medium">Continue</Link>
                           </div>
                        </div>
                      ))}
                    </div>
                 ) : (
                    <p className="text-slate-500 text-sm italic">You haven't enrolled in any fast-track programs yet.</p>
                 )}
               </CardContent>
             </Card>
          </motion.div>

          {/* Assessment History */}
          <motion.div variants={itemVariants} className="col-span-1 md:col-span-3">
            <Card>
               <CardHeader>
                 <CardTitle>Assessment History</CardTitle>
               </CardHeader>
               <CardContent>
                 {user?.assessmentResults?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[...user.assessmentResults].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((result: any, i: number) => (
                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                           <h5 className="font-medium text-slate-700 dark:text-slate-300 capitalize text-sm mb-1">{result.assessmentSlug.replace(/-/g, ' ')}</h5>
                           <div className="flex justify-between items-end">
                             <div>
                               <p className="text-2xl font-bold">{result.score}</p>
                               <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${result.severity === 'Severe' || result.severity === 'High' ? 'bg-red-100 text-red-700' : result.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                 {result.severity || 'Normal'}
                               </span>
                             </div>
                             <p className="text-[10px] text-slate-400">{new Date(result.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                 ) : (
                    <p className="text-slate-500 text-sm italic">You haven't taken any assessments yet.</p>
                 )}
               </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
            <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[ 
                  { label: "Reflections", value: "12", icon: Heart, color: "text-rose-500", bg: "bg-rose-100 dark:bg-rose-500/10" },
                  { label: "Sessions", value: "4", icon: Video, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-500/10" },
                  { label: "Messages", value: "32", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
                  { label: "Current Streak", value: "5 Days", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/10" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <span className="font-bold text-2xl mb-1">{stat.value}</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </motion.div>

        </motion.div>

        <Dialog open={showMoodModal} onOpenChange={setShowMoodModal}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>How are you feeling?</DialogTitle>
              <DialogDescription>
                Keep track of your emotions to better understand your wellness journey.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleLogMood} className="space-y-4 pt-4">
              <div className="grid grid-cols-5 gap-2">
                {['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${mood === m ? 'border-teal-500 bg-teal-50 dark:bg-teal-500/10' : 'border-slate-100 hover:border-slate-300 dark:border-slate-800'}`}
                  >
                    <span className="text-2xl mb-1">
                      {m === 'Happy' ? '😊' : m === 'Calm' ? '😌' : m === 'Neutral' ? '😐' : m === 'Sad' ? '😔' : '😰'}
                    </span>
                    <span className="text-[10px] font-medium">{m}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Additional notes (optional)
                </label>
                <textarea
                  placeholder="Why are you feeling this way?"
                  value={moodNote}
                  onChange={(e) => setMoodNote(e.target.value)}
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300 resize-none"
                />
              </div>

              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setShowMoodModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-teal-500 hover:bg-teal-400 text-slate-950">
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const SparklesIcon = (props: any) => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default Profile;



