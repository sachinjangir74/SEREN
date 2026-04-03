import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 font-sans overflow-hidden relative">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-teal-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100/50 border border-teal-200 text-teal-700 font-bold mb-6 text-sm tracking-wide uppercase">
            <MessageSquare size={16} /> Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
            We'd love to hear <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">from you.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Whether you have a question about features, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </motion.div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/5 border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/5 bg-slate-900 text-white p-10 lg:p-14 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596524430615-b46475ddff6e?auto=format&fit=crop&q=80&w=800')] opacity-20 mix-blend-overlay bg-cover bg-center" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 z-0" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 z-0" />

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10"
            >
              <h3 className="text-3xl font-bold mb-2">Chat with us</h3>
              <p className="text-slate-400 mb-12 text-lg">We're here to help and answer any question you might have.</p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-teal-300">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <p className="text-slate-400 mb-1 text-sm">Our friendly team is here to help.</p>
                    <a href="mailto:hello@seren.com" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">hello@seren.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-teal-300">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Office</h4>
                    <p className="text-slate-400 mb-1 text-sm">Come say hello at our HQ.</p>
                    <p className="text-teal-400 font-medium">100 Wellness Blvd, Suite 2A<br/>San Francisco, CA 94105</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-teal-300">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-slate-400 mb-1 text-sm">Mon-Fri from 8am to 5pm.</p>
                    <a href="tel:+15550000000" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">+1 (555) 000-0000</a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-3/5 p-10 lg:p-14">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h3>
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-center py-16 px-4 bg-teal-50 rounded-3xl border border-teal-100"
                  >
                    <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                    <p className="text-slate-600">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">First Name</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="you@company.com"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Subject</label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Message</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Write your message here..."
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className={"w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all " + (status === 'submitting' ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-teal-600 text-white hover:bg-teal-700 shadow-xl hover:-translate-y-1 shadow-teal-600/30')}
                    >
                      {status === 'submitting' ? (
                        'Sending...'
                      ) : (
                        <React.Fragment>Send Message <Send size={18} /></React.Fragment>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
