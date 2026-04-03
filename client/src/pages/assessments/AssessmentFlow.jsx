import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AuthContext from '../../context/AuthContext';

const AssessmentFlow = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const refreshUser = authContext ? authContext.refreshUser : null;

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Test State
  const [currentIndex, setCurrentIndex] = useState(-1); // -1 is the intro screen
  const [answers, setAnswers] = useState([]); // Will store numeric scores
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Fetch Assessment details
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/assessments/${slug}`);
        if (response.data.success) {
          setAssessment(response.data.data);
          // Initialize answers array with nulls
          setAnswers(new Array(response.data.data.questions.length).fill(null));
        } else {
          setError(response.data.message || 'Assessment not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Error connecting to the server to load the assessment.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [slug]);

  const handleStart = () => {
    setCurrentIndex(0);
  };

  const handleSelectOption = (score) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = score;
    setAnswers(newAnswers);

    // Auto-advance after a tiny delay for UX feel
    setTimeout(() => {
      if (currentIndex < assessment.questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 400);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(-1); // Go back to intro
    }
  };

  const handleSubmit = async () => {
    // Ensure all questions are answered
    if (answers.some(a => a === null)) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/assessments/${slug}/submit`, {
        answers
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.data.success) {
        setResult(response.data.data);
          if (token && refreshUser) await refreshUser();
      } else {
        setError('Failed to calculate results.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while submitting your assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------
  // Render States
  // ------------------------------------

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-stone-500 font-medium">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex-grow flex items-center justify-center px-4 py-12 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full border border-rose-100">
          <h2 className="text-2xl font-serif text-rose-700 mb-4">Assessment Not Found</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="bg-teal-700 text-white px-6 py-2 rounded-md hover:bg-teal-800 transition-colors w-full">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const isCompleted = currentIndex >= assessment.questions.length;
  const currentQ = assessment.questions[currentIndex];
  // Calculate progress percentage
  const progress = currentIndex >= 0 ? ((currentIndex) / assessment.questions.length) * 100 : 0;

  return (
    <div className="flex-grow flex flex-col font-sans py-12 px-6 items-center justify-center">
      <div className="w-full max-w-2xl">
          
          {/* Progress Bar (Hidden during intro and results) */}
          {currentIndex >= 0 && !result && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-stone-500 mb-2 font-medium">
                <span>Question {currentIndex + 1} of {assessment.questions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-600 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden relative">
            <AnimatePresence mode="wait">
              
              {/* STATE 1: Intro Screen */}
              {currentIndex === -1 && !result && (
                <motion.div 
                  key="intro"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 sm:p-12 text-center"
                >
                  <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                  </div>
                  <h1 className="text-3xl font-serif text-teal-900 mb-4">{assessment.title}</h1>
                  <p className="text-stone-600 text-lg leading-relaxed mb-8">
                    {assessment.description}
                  </p>
                  <p className="text-sm text-stone-500 mb-8 bg-stone-50 p-4 rounded-lg">
                    <strong>Note:</strong> This assessment is a tool to help understand your symptoms and is not a substitute for clinical diagnosis.
                  </p>
                  <button 
                    onClick={handleStart}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md font-medium text-lg transition-colors w-full sm:w-auto min-w-[200px]"
                  >
                    Start Assessment
                  </button>
                </motion.div>
              )}

              {/* STATE 2: Questions Wizard */}
              {currentIndex >= 0 && currentIndex < assessment.questions.length && !result && (
                <motion.div 
                  key={`question-${currentIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 sm:p-12"
                >
                  <h2 className="text-2xl font-serif text-teal-950 mb-8 text-center">
                    {currentQ.text}
                  </h2>
                  
                  <div className="space-y-3">
                    {currentQ.options.map((option, i) => (
                      <button
                        key={option._id || i}
                        onClick={() => handleSelectOption(option.score)}
                        className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 block ${
                          answers[currentIndex] === option.score 
                            ? 'border-teal-600 bg-teal-50 text-teal-900 font-medium' 
                            : 'border-stone-200 text-stone-700 hover:border-teal-300 hover:bg-stone-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border flex flex-shrink-0 items-center justify-center mr-4 ${
                            answers[currentIndex] === option.score ? 'border-teal-600 bg-teal-600' : 'border-stone-300'
                          }`}>
                            {answers[currentIndex] === option.score && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span>{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-10 flex justify-between items-center">
                    <button 
                      onClick={handlePrevious}
                      className="text-stone-500 hover:text-teal-700 font-medium px-4 py-2"
                    >
                      &larr; Back
                    </button>

                    {currentIndex === assessment.questions.length - 1 ? (
                      <button 
                        onClick={handleSubmit}
                        disabled={answers[currentIndex] === null || submitting}
                        className={`px-8 py-2 rounded-md font-medium transition-colors ${
                          answers[currentIndex] === null || submitting
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-teal-700 hover:bg-teal-800 text-white'
                        }`}
                      >
                        {submitting ? 'Submitting...' : 'See Results'}
                      </button>
                    ) : (
                      <span className="text-sm text-stone-400">
                        {answers[currentIndex] === null ? 'Select an answer to continue' : 'Auto-advancing...'}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STATE 3: Results */}
              {result && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-12 text-center"
                >
                  <div className="mb-8">
                    <h2 className="text-sm font-bold tracking-widest text-teal-600 uppercase mb-2">Your Results</h2>
                    <h3 className="text-4xl font-serif text-teal-900 mb-4">{result.severity}</h3>
                    
                    <div className="inline-block bg-teal-50 text-teal-800 px-4 py-2 rounded-full font-medium mb-6">
                      Score: {result.totalScore} / {assessment.questions.reduce((max, q) => max + Math.max(...q.options.map(o => o.score)), 0)}
                    </div>
                  </div>

                  <div className="bg-stone-50 p-6 rounded-xl text-left mb-8 border border-stone-100">
                    <p className="text-stone-700 leading-relaxed text-lg">
                      {result.recommendation}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {result.suggestedProgramSlug ? (
                      result.suggestedProgramSlug.includes('therapy') ? (
                        <Link 
                          to={`/appointment?service=${result.suggestedProgramSlug}`}
                          className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
                        >
                          Book Therapy Session
                        </Link>
                      ) : (
                        <Link 
                          to={`/programs/${result.suggestedProgramSlug}`}
                          className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
                        >
                          View Recommended Program
                        </Link>
                      )
                    ) : (
                      <Link 
                        to="/appointment"
                        className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-md font-medium transition-colors"
                      >
                        Book a Consultation
                      </Link>
                    )}
                    
                    <button 
                      onClick={() => {
                        setResult(null);
                        setCurrentIndex(-1);
                        setAnswers(new Array(assessment.questions.length).fill(null));
                      }}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-8 py-3 rounded-md font-medium transition-colors"
                    >
                      Retake Assessment
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };
  
  export default AssessmentFlow;
