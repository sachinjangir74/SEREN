import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
   return (
      <footer className="bg-slate-900 text-slate-300 py-16 lg:py-20">
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
               <div className="col-span-2 lg:col-span-2">
                  <Link to="/" className="text-3xl font-black text-white mb-6 inline-block tracking-tight flex items-center gap-2">
                     <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-slate-900 rounded-full" />
                     </div>
                     SEREN
                  </Link>
                  <p className="text-slate-400 mb-8 max-w-sm leading-relaxed">
                     Professional online therapy and self-help programs designed to help you heal, grow, and thrive in an increasingly complex world.
                  </p>
               </div>

               <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Services</h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-400">
                     <li><Link to="/services/one-to-one-therapy" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">1-1 Therapy</Link></li>
                     <li><Link to="/services/psychiatric-sessions" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Psychiatric Sessions</Link></li>
                     <li><Link to="/services/couples-therapy" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Couples Therapy</Link></li>
                     <li><Link to="/services/teen-counseling" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Teen Counseling</Link></li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Programs</h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-400">
                     <li><Link to="/programs/self-help" className="hover:text-teal-400 transition-colors">Self Help</Link></li>
                     <li><Link to="/programs/happiness-program" className="hover:text-teal-400 transition-colors">Happiness Program</Link></li>
                     <li><Link to="/programs/anxiety-relief" className="hover:text-teal-400 transition-colors">Anxiety Relief</Link></li>
                     <li><Link to="/programs/free-assessments" className="hover:text-teal-400 transition-colors">Free Assessments</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Business</h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-400">
                     <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">About Us</Link></li>
                     <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Contact</Link></li>
                     <li><Link to="/careers" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Careers</Link></li>
                     <li><Link to="/press" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Press</Link></li>
                  </ul>
               </div>

               <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Assessments</h4>
                  <ul className="space-y-4 text-sm font-medium text-slate-400">
                     <li><Link to="/assessments/anxiety-assessment" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Anxiety Test</Link></li>
                     <li><Link to="/assessments/depression-assessment" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Depression Test</Link></li>
                     <li><Link to="/assessments/stress-assessment" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">Stress Level Test</Link></li>
                     <li><Link to="/assessments/ptsd-assessment" onClick={() => window.scrollTo(0, 0)} className="hover:text-teal-400 transition-colors">PTSD Evaluation</Link></li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-slate-800 pt-8 pb-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
               <p>© {new Date().getFullYear()} Seren Healthcare. All rights reserved.</p>
               <div className="flex gap-6 font-medium">
                  <Link to="/privacy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Privacy Policy</Link>
                  <Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Terms of Service</Link>
                  <Link to="/hipaa" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">HIPAA Notice</Link>
               </div>
            </div>

            <div className="mt-4 text-xs text-slate-600 max-w-5xl leading-relaxed border-t border-slate-800/50 pt-6">
               <strong>Disclaimer:</strong> If you are in a life-threatening situation or emergency, do NOT use this site. Call 911 or your local emergency line immediately. The resources and therapists provided by SEREN are not a substitute for medical advice or emergency psychiatric care. If you are experiencing a crisis, please go to the nearest emergency room.
            </div>
         </div>
      </footer>
   );
}

export default Footer;
