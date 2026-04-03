import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import axios from "axios";
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { motion } from 'framer-motion';
import { Image } from '../../components/ui/Image';

const ProgramDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useContext(AuthContext);
  const isEnrolled = user?.enrolledPrograms?.some(p => p.programSlug === slug); 

  const handleEnroll = async () => {
    if (!user) {
      navigate(`/signup?program=${slug}`);
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/auth/enroll`, { programSlug: slug }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      await refreshUser();
      alert("Successfully enrolled! Check your dashboard.");
      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to enroll or already enrolled.");
    }
  };

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/programs/${slug}`);

        if (response.data.success) {
          setProgram(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load program.');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Program not found.');
        } else {
          setError(err.response?.data?.message || 'An error occurred while connecting to the server.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center font-sans text-stone-800 bg-stone-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-500 font-medium">Loading program details...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 font-sans text-stone-800 bg-stone-50">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-serif text-rose-700 mb-4">Program Not Found</h2>
          <p className="text-stone-600 mb-6">{error || "The program you're looking for doesn't exist or is currently unavailable."}</p>
          <Link to="/" className="inline-block bg-teal-700 text-white px-6 py-3 rounded-md hover:bg-teal-800 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow font-sans text-stone-800 bg-stone-50">

      <div>
        {/* Hero Section */}
        <section className="relative bg-teal-900 text-white py-24 px-6 sm:px-12 lg:px-24 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-teal-900/80 z-10 mix-blend-multiply" />
             <img
  src={
    program.slug.includes('sleep') ? 'https://images.unsplash.com/photo-1516302752946-601249ab6e8a?auto=format&fit=crop&q=80&w=1600' :
    program.slug.includes('stress') || program.slug.includes('anxiety') ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1600' :
    program.slug.includes('happ') || program.slug.includes('joy') ? 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1600' :
    program.slug.includes('assess') ? 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&q=80&w=1600' :
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600'
  }
  alt={program.title}
  className="w-full h-full object-cover"
/>
          </div>

          <div className="max-w-7xl mx-auto relative z-20 flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl flex-1"
            >
              <div className="inline-block bg-teal-500/30 border border-teal-400 text-teal-50 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm shadow-sm">
                {program.duration} Self-Guided Course
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-sans font-extrabold mb-6 leading-[1.1] drop-shadow-md">
                {program.title}
              </h1>
              <p className="text-xl text-teal-50/90 mb-10 max-w-2xl leading-relaxed drop-shadow-sm font-medium">
                {program.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isEnrolled ? (
                  <Link to={`/programs/${slug}/workspace`} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-lg inline-flex justify-center items-center">
                    Continue Program
                  </Link>
                ) : (
                  <button onClick={handleEnroll} className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:-translate-y-1 shadow-lg inline-flex justify-center items-center">     
                    Enroll in Program
                  </button>
                )}
                <Link to="/contact" className="bg-transparent border-2 border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors inline-flex justify-center items-center backdrop-blur-sm">       
                  Ask a Question
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Abstract graphic */}
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <svg width="600" height="600" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M45.7,-76.4C58.9,-69.3,69,-55.4,76.6,-40.7C84.3,-26,89.5,-10.6,87.9,4.2C86.3,19,77.9,33.1,68.1,45.4C58.3,57.7,47.1,68.1,33.6,74.7C20.1,81.3,4.3,84.1,-10.8,81.3C-25.9,78.5,-40.3,70.1,-52.3,59C-64.3,47.9,-73.9,34.1,-79.8,18.8C-85.7,3.5,-87.9,-13.2,-82.1,-27C-76.3,-40.8,-62.5,-51.7,-48.4,-59.1C-34.3,-66.5,-19.9,-70.3,-4,-65.6C11.9,-60.9,23.8,-47.7,32.5,-83.5L45.7,-76.4Z" transform="translate(100 100) scale(1.2)" />
            </svg>
          </div>
        </section>

        {/* Modules Section */}

          <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <div className="inline-block px-5 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 font-semibold text-sm mb-6 shadow-sm">
              ✨ Step-by-Step Curriculum
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">Your Journey Awaits</h2>
            <p className="text-slate-600 text-xl leading-relaxed">
              What you will learn over the next {program.duration}. This program is progressive and designed to build upon each module.
            </p>
          </div>

          <div className="grid gap-8 max-w-5xl mx-auto relative">
            {program.modules && program.modules.map((module, index) => (        
              <motion.div
                key={module._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 flex flex-col md:flex-row gap-10 relative overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-b from-teal-400 to-emerald-400" />
                <div className="md:w-1/4 shrink-0 flex flex-col justify-center border-r border-slate-100 pr-6">
                  <div className="text-teal-600 font-bold text-sm tracking-widest uppercase mb-3 px-4 py-1.5 bg-teal-50 rounded-full inline-block w-max">Module {index + 1}</div>
                  <div className="text-slate-500 font-medium text-lg flex items-center"><span className="text-xl mr-2">⏱</span>{module.duration}</div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-teal-700 transition-colors">{module.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{module.description}</p>
                </div>
                <div className="md:w-1/4 rounded-2xl overflow-hidden shadow-inner hidden md:block">
                  <Image 
  src={
    program.slug.includes('sleep') ?
    ['https://images.unsplash.com/photo-1470115636492-6d2b56f9146d', 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1'][index % 2] + '?auto=format&fit=crop&q=80&w=400' :
    program.slug.includes('stress') || program.slug.includes('anxiety') ?
    ['https://images.unsplash.com/photo-1469854523086-cc02fe5d8800', 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3', 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8'][index % 3] + '?auto=format&fit=crop&q=80&w=400' :
    program.slug.includes('assess') ?
    ['https://images.unsplash.com/photo-1454496522488-7a8e488e8606', 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe'][index % 2] + '?auto=format&fit=crop&q=80&w=400' :
    ['https://images.unsplash.com/photo-1542626991-cbc4e32524cc', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c', 'https://images.unsplash.com/photo-1517409257657-3aedfc5eef3c'][index % 3] + '?auto=format&fit=crop&q=80&w=400'
  }
  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
  alt="Module visual"
/>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-stone-100 py-16 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-serif text-teal-900 mb-4">Ready to start your journey?</h2>
            <p className="text-stone-600 mb-8">Begin your {program.duration.toLowerCase()} transformation today.</p>
            {isEnrolled ? (
              <Link to={`/programs/${slug}/workspace`} className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md font-medium transition-colors inline-block w-full sm:w-auto">
                Continue Program
              </Link>
            ) : (
              <button onClick={handleEnroll} className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md font-medium transition-colors inline-block w-full sm:w-auto">
                Start Program Now
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProgramDetail;
