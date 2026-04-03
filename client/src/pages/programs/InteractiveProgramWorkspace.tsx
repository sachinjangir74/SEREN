import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, PlayCircle, Award, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Image } from '../../components/ui/Image';

const InteractiveProgramWorkspace = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [program, setProgram] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProgramAndProgress = async () => {
      try {
        setLoading(true);
        // Fetch program details
        const progRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/programs/${slug}`);
        if (progRes.data.success) {
          setProgram(progRes.data.data);
        }

        // Fetch user progress
        const progssRes = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/programs/${slug}/progress`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (progssRes.data.success) {
          setProgress(progssRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching workspace data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramAndProgress();
  }, [slug, user, navigate]);

  const handleMarkComplete = async (moduleId) => {
    if (marking) return;
    try {
      setMarking(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/programs/${slug}/modules/${moduleId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (res.data.success) {
        setProgress(res.data.data);
        toast.success("Module completed! Great job.");
        
        // Auto-advance if not the last module
        if (activeModuleIndex < program.modules.length - 1) {
          setActiveModuleIndex(prev => prev + 1);
        } else {
          toast.success("Congratulations! You have completed the entire program.", { icon: '🎉' });
        }
      }
    } catch (err) {
      toast.error("Failed to update progress.");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center font-sans bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 font-sans bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Workspace Unavailable</h2>
          <Link to="/profile" className="mt-4 inline-block text-teal-600 hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  const completedSet = new Set(progress?.completedSteps || []);
  const activeModule = program.modules[activeModuleIndex];
  const isCompleted = progress?.isCompleted;

  return (
    <div className="flex-grow font-sans bg-slate-50 dark:bg-slate-950 pt-12 pb-12">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <Link to="/profile" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                  {program.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                  {completedSet.size} of {program.modules.length} modules completed
                </p>
              </div>
              {isCompleted && (
                <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Program Completed
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 mt-6 overflow-hidden">
              <motion.div 
                className="bg-teal-600 h-2.5 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${(completedSet.size / program.modules.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Details */}
            <div className="lg:col-span-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl p-4 h-fit shadow-sm">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-4 px-2">Course Modules</h3>
              <div className="space-y-2">
                {program.modules.map((mod, idx) => {
                  const done = completedSet.has(mod._id);
                  const isActive = activeModuleIndex === idx;
                  return (
                    <button
                      key={mod._id}
                      onClick={() => setActiveModuleIndex(idx)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${isActive ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-800'} border border-transparent`}
                    >
                      <div className="flex items-center gap-3">
                        {done ? (
                          <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-500 shrink-0" />
                        ) : (
                          <Circle className={`w-5 h-5 shrink-0 ${isActive ? 'text-teal-600 dark:text-teal-500' : 'text-slate-300 dark:text-slate-600'}`} />
                        )}
                        <span className={`text-sm font-medium ${isActive ? 'text-teal-900 dark:text-teal-100' : 'text-slate-700 dark:text-slate-300'} line-clamp-2`}>
                          {mod.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Interactive Viewer */}
            <div className="lg:col-span-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              {/* Video placeholder */}
              <div className="aspect-video bg-slate-900 dark:bg-black w-full relative group">
                <Image 
                  src={`https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop`} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  alt="Video thumbnail"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center text-white hover:bg-teal-600 hover:border-teal-500 hover:scale-110 transition-all">
                    <PlayCircle className="w-8 h-8" />
                  </button>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-md">
                  {activeModule.duration}
                </div>
              </div>

              {/* Module Content */}
              <div className="p-6 sm:p-8 flex-grow">
                <div className="text-teal-600 dark:text-teal-400 font-medium text-sm tracking-widest uppercase mb-2">
                  Module {activeModuleIndex + 1}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  {activeModule.title}
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                  <p className="text-lg leading-relaxed">{activeModule.description}</p>
                  
                  {/* Dummy Interactive Element */}
                  <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Self-Reflection Exercise</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Take a moment to write down 3 things you observed about this topic in your own life.</p>
                    <textarea 
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none" 
                      rows="3" 
                      placeholder="Your reflections..."
                    ></textarea>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <button 
                    onClick={() => setActiveModuleIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeModuleIndex === 0}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:text-teal-600 transition-colors"
                  >
                    Previous Module
                  </button>
                  
                  <button
                    onClick={() => handleMarkComplete(activeModule._id)}
                    disabled={marking}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                      completedSet.has(activeModule._id)
                        ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20'
                    }`}
                  >
                    {marking ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : completedSet.has(activeModule._id) ? (
                      <>Completed <CheckCircle2 className="w-4 h-4" /></>
                    ) : (
                      <>Mark Complete</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveProgramWorkspace;