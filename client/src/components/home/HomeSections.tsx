import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Video, MessageCircle, Calendar, Star, CheckCircle2, Heart, Brain, Sparkles } from 'lucide-react';
import { TherapistCard } from '../ui/TherapistCard';
import { Link } from 'react-router-dom';
import { Image } from '../ui/Image';

export const HeroSection = () => {
  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-white px-4">
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-center lg:text-left z-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-semibold text-sm mb-6">
            ✨ Your journey starts here
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Rediscover Your Balance, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">Reclaim Your Life</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Experience compassionate, expert mental health care on your terms. Whether through secure video, voice, or chat, we are here to support your journey to lasting wellness.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/signup">
              <button className="w-full sm:w-auto bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-teal-700 transition shadow-xl hover:-translate-y-1">
                Get Stronger Now
              </button>
            </Link>
            <a href="#how-it-works">
               <button className="w-full sm:w-auto bg-slate-100 text-slate-900 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-200 transition">
                 Learn How It Works
               </button>
            </a>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex-1 relative w-full max-w-lg lg:max-w-none"
        >
           <div className="absolute inset-0 bg-teal-200/40 blur-[100px] -z-10 rounded-full" />
           <Image src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=1000" alt="Therapy Session" className="rounded-[2.5rem] shadow-2xl relative z-10 w-full object-cover aspect-[4/3] border-4 border-white" />
           
           {/* Floating Badge */}
           <motion.div 
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20 border border-slate-100"
           >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                 <CheckCircle2 size={24} />
              </div>
              <div>
                 <p className="font-bold text-slate-900">Highly Rated</p>
                 <p className="text-sm text-slate-500">4.9/5 Average</p>
              </div>
           </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export const TrustLogos = () => {
  return (
    <section className="py-10 border-y border-slate-100 bg-slate-50/50">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Trusted by organizations & featured in</p>
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-60 grayscale items-center">
          {['Forbes', 'Healthline', 'Wellness Post', 'Therapy Today', 'TechCrunch'].map(logo => (
             <span key={logo} className="text-xl md:text-2xl font-black text-slate-800">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export const QuoteSection = () => {
  return (
    <section className="py-20 bg-teal-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518133835878-5a93ac30fabc?auto=format&fit=crop&q=80&w=2000')] opacity-10 bg-cover bg-center mix-blend-overlay" />
      <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
        <svg className="w-12 h-12 text-teal-400/50 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <blockquote className="text-3xl md:text-5xl font-bold leading-tight mb-8">
          "The curious paradox is that when I accept myself just as I am, then I can change."
        </blockquote>
        <cite className="block text-xl font-medium text-teal-100">― Carl Rogers</cite>
        <span className="text-teal-200/80 text-sm tracking-widest uppercase mt-2 block">Pioneer of Humanistic Psychology</span>
      </div>
    </section>
  );
};

export const InfoSection = () => {
  return (
    <section id="how-it-works" className="py-24 container mx-auto px-4 max-w-7xl scroll-mt-20">
      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <div className="flex-1 relative w-full">
          <div className="absolute top-4 -inset-4 bg-teal-500/10 rounded-3xl blur-2xl transform rotate-3" />
          <Image src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&q=80&w=800" alt="How it works" className="relative rounded-3xl shadow-xl w-full object-cover aspect-[4/5]" />
        </div>
        <div className="flex-1">
          <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-4 block">Your Path To Peace</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-10 text-slate-900 leading-tight">A guided, frictionless journey to the right expert.</h2>
          <div className="space-y-10">
             {[
               { step: 1, title: 'Share Your Story', text: 'Complete a brief, thoughtful assessment so we can understand the unique nuances of what you are going through.' },
               { step: 2, title: 'Discover Your Guide', text: 'Get paired with highly-vetted, compassionate professionals who specialize in exactly what you need.' },
               { step: 3, title: 'Heal on Your Terms', text: 'Engage through secure video sessions, voice calls, or asynchronous messaging—whatever feels most grounding for you.' },
             ].map(s => (
               <div key={s.step} className="flex gap-6 group">
                 <div className="w-14 h-14 rounded-2xl bg-teal-50 border-2 border-teal-100 text-teal-600 flex items-center justify-center font-bold text-xl flex-shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">
                    {s.step}
                 </div>
                 <div>
                   <h3 className="text-2xl font-bold mb-2 text-slate-900">{s.title}</h3>
                   <p className="text-slate-600 text-lg leading-relaxed">{s.text}</p>
                 </div>
               </div>
             ))}
          </div>
          <Link to="/signup">
             <button className="mt-12 bg-slate-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-teal-600 hover:-translate-y-1 transition-all shadow-xl">
               Start Therapy Today
             </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-4 block">Areas of Focus</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Evolve Beyond Your Challenges</h2>
          <p className="text-lg text-slate-600">Equip yourself with evidence-based tools and profound insights to break cycles, untangle complex emotions, and thrive daily.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { title: 'Relationships', desc: 'Build stronger, healthier connections with effective communication tools.', img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=400' },
             { title: 'Self-Confidence', desc: 'Develop deep self-esteem and unlearn limiting core beliefs.', img: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=400' },
             { title: 'Stress & Anxiety', desc: 'Master concrete coping mechanisms to manage overwhelm safely.', img: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=400' },
             { title: 'Trauma & PTSD', desc: 'Process and heal from past experiences in a highly secure space.', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=400' },
             { title: 'Depression', desc: 'Find light, routine, and purpose again with guided clinical help.', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400' },
             { title: 'Career & Growth', desc: 'Break through mental blocks to reach your full ambitious potential.', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=400' },
           ].map((f, i) => (
             <div key={i} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col">
               <div className="h-56 overflow-hidden relative">
                 <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10" />
                 <Image src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
               </div>
               <div className="p-8 flex-1 flex flex-col">
                 <h3 className="text-2xl font-bold mb-3 text-slate-900">{f.title}</h3>
                 <p className="text-slate-600 mb-6 flex-1 leading-relaxed">{f.desc}</p>
                 <button className="text-teal-600 font-bold flex items-center group-hover:text-teal-700 transition-colors w-max">
                    Read More <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                 </button>
               </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export const TherapistPreview = () => {
  const therapists = [
    { name: "Dr. Sarah Jenkins", title: "Clinical Psychologist", exp: "Anxiety, Depression", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300", lang: "English, Spanish", rating: "4.9" },
    { name: "David Chen, LMFT", title: "Family Therapist", exp: "Relationships, Trauma", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300", lang: "English, Mandarin", rating: "5.0" },
    { name: "Dr. Emily Rodriguez", title: "Psychiatrist", exp: "ADHD, Bipolar", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300", lang: "English", rating: "4.8" },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
             <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-4 block">World-Class Clinicians</span>
             <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">Guides Dedicated to Your Growth</h2>
             <p className="text-lg text-slate-600">Work seamlessly with licensed, deeply empathetic specialists who bring decades of clinical excellence to your healing process.</p>
          </div>
          <Link to="/therapists">
             <button className="bg-slate-100 text-slate-800 font-bold px-8 py-3 rounded-full hover:bg-teal-50 hover:text-teal-700 transition">
                View All Therapists
             </button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
           {therapists.map((t, idx) => (
             <TherapistCard key={idx} therapist={t} index={idx} />
           ))}
        </div>
      </div>
    </section>
  );
};

export const CTABanner = () => {
  return (
    <section className="py-12 px-4">
       <div className="container mx-auto max-w-6xl rounded-[3rem] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-teal-900/80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800/90 to-transparent z-10" />
          <Image src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=1200" alt="CTA Background" className="absolute inset-0 w-full h-full object-cover z-0" />
          <div className="relative z-20 px-8 py-24 md:py-32 text-center md:text-left md:px-20 text-white flex flex-col md:flex-row items-center justify-between gap-12">
             <div className="flex-1">
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Ready to step into a brighter, clearer tomorrow?</h2>
                <p className="text-lg md:text-xl text-teal-100 max-w-xl">Take our intuitive 3-minute assessment. We'll thoughtfully pair you with a clinical expert who truly understands your life's complexities.</p>
             </div>
             <div>
                <Link to="/signup">
                   <button className="bg-white text-teal-700 font-bold text-lg px-10 py-5 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:bg-slate-100 hover:scale-105 transition-all text-nowrap">
                      Find My Match
                   </button>
                </Link>
             </div>
          </div>
       </div>
    </section>
  );
};

export const ServicesSection = () => {
  const services = [
    { icon: Heart, title: "1-on-1 Therapy", desc: "Private recurring sessions with a dedicated expert.", color: "text-rose-600", bg: "bg-rose-100" },
    { icon: Brain, title: "Psychiatric Evaluation", desc: "Medical diagnosis and ongoing medication management.", color: "text-indigo-600", bg: "bg-indigo-100" },
    { icon: Star, title: "Couples Counseling", desc: "Navigate conflict and rebuild intimacy together.", color: "text-amber-600", bg: "bg-amber-100" },
    { icon: Sparkles, title: "Guided Self-Help", desc: "Interactive modules to guide your personal growth.", color: "text-teal-600", bg: "bg-teal-100" },
  ];

  return (
    <section id="services" className="py-24 bg-slate-50 border-t border-slate-100 scroll-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
           <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-4 block">Pathways to Care</span>
           <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Holistic Mental Wealth</h2>
           <p className="text-lg text-slate-600">From personalized deep-dives to shared relationship counseling, map out a care plan that perfectly aligns with your emotional bandwidth.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
           {services.map((s, i) => (
             <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${s.bg} ${s.color} group-hover:scale-110 transition-transform duration-500`}>
                   <s.icon size={32} strokeWidth={2.5}/>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{s.title}</h3>
                <p className="text-slate-600 flex-1 mb-8 leading-relaxed">{s.desc}</p>
                <button className="flex items-center text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                   Explore Service <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </button>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 max-w-7xl">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
               <span className="text-teal-600 font-bold tracking-wider uppercase text-sm mb-4 block">Digital Resources</span>
               <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">Empower Your Mind</h2>
               <p className="text-lg text-slate-600">Explore our structured, self-paced clinical modules, intentionally designed to multiply the deep work you accomplish in therapy.</p>
            </div>
            <button className="bg-slate-50 text-slate-800 border border-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition">View All Programs</button>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            {[
              { tag: "Free Base", title: "Anxiety Assessment", link: "/assessments/anxiety-assessment", desc: "A comprehensive deep-dive quiz to evaluate your current emotional well-being.", img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600" },
              { tag: "Self-Guided", title: "Anxiety Relief Protocol", desc: "Day-by-day practical exercises proven to radically regulate your nervous system.", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600" },
              { tag: "Premium Course", title: "The Happiness Program", desc: "An intensive 6-week video course heavily focused on applied positive psychology.", img: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=600" }
            ].map((p, i) => (
              <div key={i} className="group rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                 <div className="relative h-64 overflow-hidden">
                    <Image src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold rounded-full text-slate-900 shadow-sm">{p.tag}</div>
                 </div>
                 <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 text-slate-900">{p.title}</h3>
                    <p className="text-slate-600 mb-8 leading-relaxed">{p.desc}</p>
                    <button className="w-full py-3.5 rounded-xl border-2 border-slate-100 font-bold text-slate-800 hover:border-teal-600 hover:text-teal-700 hover:bg-teal-50 transition-all">Explore Program</button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
};

export const FAQSection = () => {
  const [openId, setOpenId] = useState(1);

  const faqs = [
    { id: 1, q: "Can I get psychological counselling online?", a: "Yes, you can get psychological counselling online in India and from any part of the world with SEREN. Online psychological counselling allows you to take counselling from your therapist from the comfort of your home and at your convenient time. SEREN offers quality psychological counselling online by trained and experienced listed therapists which is as effective as face-to-face counselling." },
    { id: 3, q: "How much does online therapy cost?", a: "Online therapy in India costs like a traditional setup, sometimes lesser. You can expect a 40-60 minute appointment in between 800₹ to 2000₹. You can start your journey with SEREN by purchasing 1 session where the per session cost is highly optimized. All sessions at SEREN are for 45 minutes. Therapy prices differ for clients outside India as we have to use different mediums to create awareness and deliver therapy beyond our borders." },
    { id: 5, q: "Who needs Online counselling and therapy?", a: "Online therapy is for someone who is undergoing discomfort, stress, anxiety, depression, insomnia or emotional health challenges due to personal, professional or environmental issues such as Covid 19, climate change, or even inflation issues etc. Online therapy is also for people, who are unable to continue with traditional online therapy sessions. SEREN not only helps people heal from the above mentioned issues but also helps people to thrive in life with counselling for confidence, motivation, professional growth and fulfilling relationships." },
    { id: 7, q: "What services are being offered by SEREN?", a: "SEREN is an online mental health counselling platform that offers confidential counseling sessions through online modes. The services offered by SEREN include, but are not limited to, individual counseling, couples counseling, and psychiatric consults." },
    { id: 2, q: "What are the advantages of online counseling?", a: "There are various advantages when it comes to Online Counseling. Accessibility is one of the primary advantages. Because the entire setup is online, one can access counseling from their home. Online counselling also helps with a lot of flexibility when it comes to the timing of an appointment which you can choose as per your convenience by choosing the mode of Psychological Counselling, be it call, video call or chat. Online Counseling is also advantageous in terms of finances because you can save the travel & inconvenience costs. You can start your online counselling with SEREN: The most trusted and rated online therapy service provider." },
    { id: 4, q: "Is online counselling expensive?", a: "Online Counseling is not expensive. In fact, it turns out to be less expensive than traditional setups because it helps you save travel costs and also online therapy sessions at SEREN are more cost-effective. Therefore, online counselling being expensive is not false and online counseling platforms like SEREN offer counselling plans available at various price points." },
    { id: 6, q: "Is my information secure and confidential in online counselling?", a: "Yes, online counseling is secure and all your information is confidential. Online counseling setups ensure privacy and confidentiality of a client. SEREN offers anonymous and confidential counselling where the client's records are accessible only by the counsellor and the client. Usually, the portals used for online therapy are HIPAA and FERPA compliant portals. Though these are not Indian laws, the usual platforms used for various modes of online counselling as well are the ones mentioned above and hence have these regulations in place." },
    { id: 8, q: "How Can a Couple Benefit from Couples online Therapy?", a: "Couples can join from the same or completely different locations. It creates a safe, mediated space to learn communication skills, understand emotional triggers, and resolve deep-seated conflicts from the comfort of their own personal environment without any added stress of traveling to clinics." },
  ];

  const leftColumn = faqs.filter((_, i) => i < 4);
  const rightColumn = faqs.filter((_, i) => i >= 4);

  const renderFaq = (faq) => (
    <div key={faq.id} className="mb-4">
      <button
        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
        className={`w-full text-left px-5 py-4 flex justify-between items-center transition-colors duration-300 ${openId === faq.id ? 'bg-[#e7fcfb]' : 'bg-[#e7fcfb] hover:bg-[#d8f8f6]'}`}
      >
        <span className="font-medium text-[#00c5bd] text-[15px] pr-6">{faq.q}</span>
        <div className="w-5 h-5 rounded-full border border-[#00c5bd] flex items-center justify-center flex-shrink-0 bg-transparent">
          <ChevronDown className={`w-3.5 h-3.5 text-[#00c5bd] transition-transform duration-300 ${openId === faq.id ? 'rotate-180' : ''}`} strokeWidth={2.5} />
        </div>
      </button>
      <AnimatePresence>
        {openId === faq.id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#fafafa]"
          >
            <div className="p-5 text-[#6c757d] text-[14px] leading-[1.8] border-t border-white/50 text-justify">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section id="faq" className="py-24 bg-white border-none">
      <div className="container mx-auto px-4 max-w-[1200px]">
        <h2 className="text-[32px] md:text-[40px] font-bold text-center mb-12 text-[#1a1a1a] tracking-tight">
          FAQ on Online Therapy & Counselling
        </h2>
        <div className="grid md:grid-cols-2 gap-x-6 gap-y-0 items-start">
           <div>{leftColumn.map(renderFaq)}</div>
           <div>{rightColumn.map(renderFaq)}</div>
        </div>
      </div>
    </section>
  );
}


