import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Video, MessageCircle, Calendar, Star, CheckCircle, ChevronDown } from 'lucide-react';
import { TherapistCard } from '../components/ui/TherapistCard';
import { Button } from '../components/ui/button';
import { Image } from '../components/ui/Image';

const therapistsData = [
  {
    id: 1,
    name: "Dr. Sarah Jenkins",
    title: "Clinical Psychologist",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 4.9,
    reviews: 124,
    expertise: ["Anxiety", "Depression", "Relationship"],
    languages: ["English", "Spanish"],
    experience: "12 Years",
    available: "Today"
  },
  {
    id: 2,
    name: "David Chen, LMFT",
    title: "Marriage & Family Therapist",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 4.8,
    reviews: 89,
    expertise: ["Couples", "Trauma", "Family"],
    languages: ["English", "Mandarin"],
    experience: "8 Years",
    available: "Tomorrow"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    title: "Psychiatrist",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 4.9,
    reviews: 205,
    expertise: ["ADHD", "Bipolar", "Medication"],
    languages: ["English", "French"],
    experience: "15 Years",
    available: "In 2 days"
  },
  {
    id: 4,
    name: "James Wilson, LCSW",
    title: "Licensed Clinical Social Worker",
    image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200&h=200",
    rating: 4.7,
    reviews: 64,
    expertise: ["Stress", "Career", "Men's Issues"],
    languages: ["English"],
    experience: "5 Years",
    available: "Today"
  }
];

import { SkeletonCard } from "../components/ui/skeleton";

export default function Therapists() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [sessionType, setSessionType] = useState("Individual");

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auth/therapists`);
        // Map backend data to UI format securely
        const mappedData = res.data.data.map(t => ({
          id: t._id,
          name: t.name,
          title: t.therapistProfile?.title || 'Certified Therapist',
          image: t.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
          rating: t.therapistProfile?.rating || 4.9,
          reviews: t.therapistProfile?.reviews || 120,
          expertise: t.therapistProfile?.expertise?.length > 0 ? t.therapistProfile.expertise : ['Anxiety', 'Depression'],
          languages: t.therapistProfile?.languages?.length > 0 ? t.therapistProfile.languages : ['English'],
          experience: `${t.therapistProfile?.experienceYears || 5} Years`,
          available: 'Today'
        }));
        setTherapists(mappedData.length > 0 ? mappedData : therapistsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch therapists', error);
        setTherapists(therapistsData);
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  const filteredTherapists = therapists.filter(t => {
    if (selectedExpertise !== 'All' && !t.expertise.includes(selectedExpertise)) return false;
    if (selectedLanguage !== 'All' && !t.languages.includes(selectedLanguage)) return false;
    return true;
  });

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="bg-primary-900 dark:bg-slate-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                Talk to Top Rated <span className="text-teal-400">Therapists Online</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-lg">
                All of our online therapists hold a Masters Degree in Psychology and undergo over 400+ hours of rigorous training.
              </p>
              <Button size="lg" className="rounded-full bg-teal-500 hover:bg-teal-400 text-white border-0 text-lg px-8 py-6 h-auto">
                Match with a Therapist
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <Image src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800" alt="Therapy Session" className="w-full h-auto object-cover" />
                <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center gap-4">
                  <div className="bg-teal-500 rounded-full p-3 shadow-lg">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Secure Video Sessions</p>
                    <p className="text-teal-100 text-sm">HIPAA compliant platform</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl mt-8">
        {/* Filters Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap">
              <Search className="w-5 h-5" /> Filter
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700 dark:text-slate-200"
                  value={selectedExpertise}
                  onChange={(e) => setSelectedExpertise(e.target.value)}
                >
                  <option value="All">Expertise</option>
                  <option value="Anxiety">Anxiety & Stress</option>
                  <option value="Depression">Depression</option>
                  <option value="Relationships">Relationship Issues</option>
                  <option value="Trauma">Trauma</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700 dark:text-slate-200"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="All">Languages</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Hindi">Hindi</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-700 dark:text-slate-200"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                >
                  <option value="Individual">Individual Session</option>
                  <option value="Couple">Couple's Session</option>
                  <option value="Family">Family Session</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            <Button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-8">
              Search
            </Button>
          </div>
        </div>

        {/* Therapist Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} className="min-h-[300px]" />
            ))}
          </div>
        ) :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTherapists.map((therapist, index) => (
              <TherapistCard key={therapist.id || index} therapist={therapist} index={index} />
            ))}
        </div>
        }
      </div>
    </div>
  );
}
