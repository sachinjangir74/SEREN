import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, MessageSquare, Clock, Users, Video, FileText, CheckCircle } from "lucide-react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { Image } from '../components/ui/Image';

const fetchTherapistAppointments = async (token: string) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/appointments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

const TherapistDashboard = () => {
  const { user } = useContext(AuthContext);
  
  const { data: appointments, isLoading } = useQuery({
    queryKey: ["therapist-appointments"],
    queryFn: () => fetchTherapistAppointments(user?.token || ""),
    enabled: !!user?.token,
  });

  const upcoming = appointments?.filter((a: any) => new Date(a.date) >= new Date()) || [];
  const todayAppointments = upcoming.filter((a: any) => {
    const aptDate = new Date(a.date);
    const today = new Date();
    return aptDate.getDate() === today.getDate() && aptDate.getMonth() === today.getMonth() && aptDate.getFullYear() === today.getFullYear();
  });

  const patientCount = new Set(appointments?.map((a: any) => a.user?._id)).size || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 pt-24 font-sans text-slate-800 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Therapist Welcome Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-3xl overflow-hidden mb-8 shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-blue-900/60 mix-blend-multiply" />
             <Image src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=2000" alt="Therapist Office" className="w-full h-full object-cover" />
           </div>
           
           <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-100 uppercase bg-blue-900/50 rounded-full backdrop-blur-md border border-blue-500/30">Provider Portal</span>
                <h1 className="text-3xl md:text-5xl tracking-tight font-extrabold text-white mb-2">
                  Good morning, <span className="text-blue-300">Dr. {user?.name?.split(" ")[0] || "Therapist"}</span>
                </h1>
                <p className="text-slate-200 text-lg max-w-xl">You have {todayAppointments.length} sessions scheduled today. Let's make a difference.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md hidden sm:flex" asChild>
                  <Link to="/chat"><MessageSquare className="w-4 h-4 mr-2" /> Patient Messages</Link>
                </Button>
              </div>
           </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sessions Today</p>
                  <p className="text-3xl font-bold">{todayAppointments.length}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-2xl">
                  <CalendarIcon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Patients</p>
                  <p className="text-3xl font-bold">{patientCount || 5}</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-2xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upcoming This Week</p>
                  <p className="text-3xl font-bold">{upcoming.length || 12}</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-2xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Unread Notes</p>
                  <p className="text-3xl font-bold">3</p>
                </div>
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule Section */}
          <Card className="lg:col-span-2 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
                <CardDescription>You have {todayAppointments.length} sessions booked for today.</CardDescription>
              </div>
              <Button size="sm" variant="ghost">View Full Calendar</Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8"><span className="animate-spin w-8 h-8 rounded-full border-4 border-t-primary-500 border-slate-200 dark:border-slate-700"></span></div>
              ) : todayAppointments.length > 0 ? (
                <div className="space-y-4 mt-4">
                  {todayAppointments.map((apt: any) => (
                    <div key={apt._id} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">
                          {(apt.user?.name || "P")[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {apt.user?.name || "Patient Name"}
                            {apt.user?.age && <span className="text-xs font-normal text-slate-500 ml-2">({apt.user.age}{apt.user.gender ? `, ${apt.user.gender}` : ''})</span>}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{apt.time} - {apt.type || "Video Session"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Link className="flex-1" to="/video" state={{ roomId: apt._id }}>
                          <Button className="w-full" size="sm">
                            <Video className="w-4 h-4 mr-2" /> Join Call
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="px-2">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl mt-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">No more sessions today!</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-1">Take some time to rest or catch up on notes.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Notes */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-3" /> Write Clinical Notes
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-3" /> Manage Availability
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-3" /> Patient Roster
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Patient Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { n: "Alex Johnson", a: "Completed Weekly Assessment", time: "2h ago" },
                    { n: "Sarah Smith", a: "Rescheduled appointment", time: "5h ago" },
                    { n: "Michael B.", a: "Sent a new message", time: "1d ago" }
                  ].map((act, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="mt-1 w-2 h-2 rounded-full bg-primary-500 shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{act.n}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{act.a}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TherapistDashboard;