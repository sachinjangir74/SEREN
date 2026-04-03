import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { Button } from "./ui/Button";
import { CheckCircle2, ChevronRight, Video, Calendar } from "lucide-react";

const UserDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>Your next scheduled therapy sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600">
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Dr. Sarah Jenkins</p>
                      <p className="text-sm text-slate-500">Today, 2:00 PM (45 min)</p>
                    </div>
                 </div>
                 <Link to="/call" className="hidden sm:block">
                    <Button>Join Call</Button>
                 </Link>
               </div>
               <Link to="/appointments" className="block sm:hidden">
                  <Button className="w-full">Join Call</Button>
               </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
             <CardContent>
                <p className="text-slate-500 dark:text-slate-400">No recent activity to show.</p>
             </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle>Quick Links</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               <Link to="/appointments" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                 <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                   <Calendar className="w-5 h-5 text-primary-500" /> Book Session
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </Link>
               <Link to="/chat" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                 <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                   <CheckCircle2 className="w-5 h-5 text-indigo-500" /> Messaging
                 </div>
                 <ChevronRight className="w-4 h-4 text-slate-400" />
               </Link>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
