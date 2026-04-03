import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MessageCircle, FileText, Video, BellRing, UserCircle, BookOpen } from "lucide-react";
import { Image } from '../components/ui/Image';

const Resources = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-16 font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        <div className="text-center mb-16">
           <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">Mental Health Resources</h1>
           <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Explore our curated collection of articles, guides, and tools designed to support your wellness journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
           {[ 
             { title: "Understanding Anxiety", type: "Article", icon: FileText, desc: "Learn to identify triggers and navigate daily anxiety with these coping mechanisms.", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=600&q=80" },
             { title: "Couples Communication", type: "Guide", icon: MessageCircle, desc: "Tools to improve active listening and resolve conflicts healthily.", img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80" },
             { title: "Guided Meditation", type: "Video", icon: Video, desc: "A 10-minute mindfulness exercise to center your thoughts.", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80" },
             { title: "Sleep Hygiene", type: "Article", icon: BellRing, desc: "Develop healthy nighttime routines for better rest.", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80" },
             { title: "Setting Boundaries", type: "Workbook", icon: BookOpen, desc: "Interactive exercises to help set and maintain personal boundaries.", img: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?auto=format&fit=crop&w=600&q=80" },
             { title: "Self-Care Rituals", type: "Guide", icon: UserCircle, desc: "Building sustainable self-care practices into your busy life.", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" } 
           ].map((r, i) => (
              <motion.div key={i} initial={{opacity: 0, y: 10}} whileInView={{opacity: 1, y: 0}} transition={{delay: i*0.1}} viewport={{once: true}}>
                 <Card className="h-full hover:-translate-y-1 transition-transform cursor-pointer hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-500/30 overflow-hidden">
                    <div className="h-48 w-full overflow-hidden relative">
                       <Image src={r.img} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    </div>
                    <CardContent className="p-6 flex flex-col h-[calc(100%-12rem)]">
                       <div className="flex items-center gap-2 mb-4 text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10 w-fit px-3 py-1 rounded-full">
                          <r.icon className="w-4 h-4" /> {r.type}
                       </div>
                       <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{r.title}</h3>
                       <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 flex-1">{r.desc}</p>
                       <Button variant="ghost" className="w-full justify-between px-0 font-semibold group mt-auto">
                         Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                       </Button>
                    </CardContent>
                 </Card>
              </motion.div>
           ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/20 to-transparent pointer-events-none" />
           <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Need immediate support?</h2>
           <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10">If you are in a crisis or any other person may be in danger, please call emergency services right away.</p>
           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8">View Emergency Contacts</Button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Resources;
