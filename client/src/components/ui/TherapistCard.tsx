import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, MessageCircle, Calendar } from 'lucide-react';
import { Image } from './Image';

interface TherapistCardProps {
  therapist: any;
  index?: number;
}

export const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, index = 0 }) => {
  // Rich fallback backend data to mirror Therapists.tsx
  const MOCK_PROFILES: Record<string, any> = {
    "Dr. Sarah Jenkins": { expertise: ["Anxiety", "Depression", "Relationship"], languages: ["English", "Spanish"], experience: "12", rating: 4.9, reviews: 124, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300", title: "Clinical Psychologist" },
    "David Chen, LMFT": { expertise: ["Couples", "Trauma", "Family"], languages: ["English", "Mandarin"], experience: "8", rating: 4.8, reviews: 89, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300", title: "Marriage & Family Therapist" },
    "Dr. Emily Rodriguez": { expertise: ["ADHD", "Bipolar", "Medication"], languages: ["English", "French"], experience: "15", rating: 4.9, reviews: 205, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300", title: "Psychiatrist" },
    "James Wilson, LCSW": { expertise: ["Stress", "Career", "Men's Issues"], languages: ["English"], experience: "5", rating: 4.7, reviews: 64, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300", title: "Licensed Clinical Social Worker" }
  };

  const normalizedName = (therapist.name || "Default").trim();
  const richProfile = MOCK_PROFILES[normalizedName] || {};

  const fallbackImage = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300';
  const imgUrl = richProfile.image || therapist.image || therapist.imageUrl || therapist.img || fallbackImage;

  const rating = therapist.rating || richProfile.rating || 4.9;
  const reviews = therapist.reviews || richProfile.reviews;

  const rawExp = therapist.expertise || richProfile.expertise || therapist.specialties || therapist.exp;
  let expertiseStr = "Anxiety, Depression";
  if (Array.isArray(rawExp)) expertiseStr = rawExp.slice(0, 3).join(", ") || expertiseStr;
  else if (typeof rawExp === 'string') expertiseStr = rawExp;

  const rawLang = therapist.languages || richProfile.languages || therapist.lang;
  let languagesStr = "English";
  if (Array.isArray(rawLang)) languagesStr = rawLang.join(", ") || languagesStr;
  else if (typeof rawLang === 'string') languagesStr = rawLang;

  const nameEncoded = encodeURIComponent(normalizedName || "Default");
  const title = therapist.title || richProfile.title || "Certified Therapist";

  let experience = therapist.experience || richProfile.experience;
  if (typeof experience === 'number') experience = String(experience);
  if (typeof experience === 'string') experience = experience.replace(/ Years? Exp\\.?/i, '').replace(/Years?/i, '').trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border border-slate-200 dark:border-slate-700/50 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative bg-white dark:bg-slate-800 flex flex-col h-full group"
    >
      <div className="absolute top-4 right-4 lg:top-5 lg:right-5 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 text-slate-700 dark:text-slate-200 z-10 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span>{rating}</span>
        {reviews && <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-0.5">({reviews})</span>}
      </div>

      <div className="flex items-center gap-5 mb-8 mt-2">
        <Image
          src={imgUrl}
          alt={therapist.name}
          className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform duration-300"
        />
        <div className="flex-1 pr-14 lg:pr-10 min-w-0">
          <h3 className="font-bold text-[1.15rem] xl:text-xl text-slate-900 dark:text-white leading-snug">{therapist.name}</h3>
          <p className="text-teal-600 font-medium text-sm mt-0.5">{title}</p>
          {experience && (
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">{experience} Years Exp.</p>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-8 text-sm text-slate-600 dark:text-slate-300 pb-6 border-b border-slate-100 dark:border-slate-700/50 flex-grow">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <span><strong className="text-slate-800 dark:text-slate-200">Expertise:</strong> {expertiseStr}</span>
        </div>
        <div className="flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <span><strong className="text-slate-800 dark:text-slate-200">Languages:</strong> {languagesStr}</span>
        </div>
      </div>

      <div className="flex gap-3 mt-auto">
        <button className="flex-1 bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 font-bold py-3.5 rounded-xl hover:bg-teal-100 dark:hover:bg-teal-500/20 transition flex items-center justify-center gap-2">
          <MessageCircle size={18}/> Chat
        </button>
        <Link to={`/appointment?therapist=${nameEncoded}`} className="flex-1 block">
          <button className="w-full bg-slate-900 dark:bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-800 dark:hover:bg-teal-500 transition flex items-center justify-center gap-2 shadow-md">
            <Calendar size={18}/> Book
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

