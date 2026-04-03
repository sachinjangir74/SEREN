import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { CalendarIcon, Clock, User, ChevronRight, CheckCircle2, FileText, Phone, Mail, UserIcon, ArrowRight } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "../lib/utils";
import { Badge } from "../components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

const DURATION_OPTIONS = [
  { label: '30 Minutes', value: 30 },
  { label: '45 Minutes', value: 45 },
  { label: '60 Minutes (Standard)', value: 60 },
  { label: '90 Minutes (Deep Dive)', value: 90 }
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

const fallbackDoctors = [
    { id: '60c72b2f9b1d8b0015A42abc', name: 'Dr. Sarah Jenkins', role: 'Clinical Psychologist', avatar: 'SJ', available: true },
    { id: '60c72b2f9b1d8b0015A42abd', name: 'David Chen, LMFT', role: 'Marriage & Family Therapist', avatar: 'DC', available: true },
    { id: '60c72b2f9b1d8b0015A42abe', name: 'Dr. Emily Rodriguez', role: 'Psychiatrist', avatar: 'ER', available: true },
    { id: '60c72b2f9b1d8b0015A42abf', name: 'James Wilson, LCSW', role: 'Licensed Clinical Social Worker', avatar: 'JW', available: true }
  ];

const fetchTherapists = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/therapists`);
    return res.data?.data || res.data || [];
  } catch (error) {
    console.error("Failed to fetch therapists", error);
    return [];
  }
};

const Appointment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get("service");
  const therapistParam = searchParams.get("therapist");
  const [doctors, setDoctors] = useState([]);
  
  useEffect(() => {
    fetchTherapists().then(data => {
      // Map data to expected format if needed
      if (data && data.length > 0) {
        setDoctors(data.map(t => ({
          id: t._id,
          name: t.name,
          role: t.therapistProfile?.title || t.specialization || 'Therapist',
          avatar: t.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          available: true
        })));
      } else {
        setDoctors(fallbackDoctors);
      }
    }).catch(err => {
      console.error(err);
      setDoctors(fallbackDoctors);
    });
  }, []);

  const [formData, setFormData] = useState({
    duration: 60,
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
    doctor: therapistParam || '',
    mode: 'Video',
    date: undefined,
    time: '',
    service: serviceParam ? serviceParam.includes('therapy') ? 'Therapy' : 'Psychiatry' : 'Therapy',
    notes: ''
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStep1Valid = formData.doctor !== '';
  const isStep2Valid = formData.date !== undefined && formData.time !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const selectedDoc = doctors.find(d => d.name === formData.doctor);
      const payload = {
        therapistId: selectedDoc ? selectedDoc.id : undefined,
        ...formData,
        date: formData.date ? format(formData.date, "yyyy-MM-dd") : ""
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      };
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/appointments`, payload, config);
      setStep(4);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to book appointment');
      setLoading(false);
    }
  };

  const steps = [
    { title: "Professional", icon: User },
    { title: "Schedule", icon: CalendarIcon },
    { title: "Details", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Book a Session</h1>
          <p className="text-slate-500 dark:text-slate-400">Take the next step in your wellness journey.</p>
        </div>

        {/* Progress Stepper */}
        {step < 4 && (
          <div className="relative flex justify-between items-center max-w-lg mx-auto mb-12">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full -z-10 overflow-hidden">
            <motion.div 
               className="h-full bg-teal-500" 
               initial={{ width: "0%" }} 
               animate={{ width: `${((step - 1) / 2) * 100}%` }}
               transition={{ duration: 0.3 }}
            />
          </div>
          
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            
            return (
              <div key={idx} className="flex flex-col items-center gap-2 bg-slate-50 dark:bg-slate-950 px-2 transition-colors duration-300">
                <motion.div 
                  initial={false}
                  animate={{ 
                    backgroundColor: isActive || isCompleted ? "#14b8a6" : "var(--bg-muted)",
                    borderColor: isActive ? "#0d9488" : isCompleted ? "#14b8a6" : "rgba(100,100,100,0.1)"
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                    isActive || isCompleted 
                      ? "border-teal-100 dark:border-teal-900/50 bg-teal-500 text-white" 
                      : "border-slate-100 dark:border-slate-800 bg-slate-200 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : <s.icon className="w-4 h-4" />}
                </motion.div>
                <span className={`text-xs font-semibold ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-500"}`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        )}

        {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 text-sm font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {error}
            </motion.div>
        )}

        <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl overflow-hidden">
          {step < 4 && (<CardHeader className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-xl">
                {step === 1 && "Choose your Professional"}
                {step === 2 && "Select Date & Time"}
                {step === 3 && "Complete your Details"}
            </CardTitle>
            <CardDescription>
                {step === 1 && "Select from our qualified team of therapists and psychiatrists."}
                {step === 2 && "Find a time that works best for your schedule."}
                {step === 3 && "Please review and confirm your booking information."}
            </CardDescription>
          </CardHeader>
          )}
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {doctors.map(doc => (
                      <div 
                        key={doc.id} 
                        onClick={() => doc.available && setField('doctor', doc.name)} 
                        className={`relative p-5 rounded-2xl border-2 transition-all duration-200 ${
                          !doc.available ? 'opacity-50 cursor-not-allowed border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50' :
                          formData.doctor === doc.name 
                            ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10 shadow-sm ring-4 ring-teal-500/10 cursor-pointer' 
                            : 'border-slate-100 dark:border-slate-800 hover:border-teal-200 dark:hover:border-teal-800 hover:shadow-sm cursor-pointer'
                        }`}
                      >     
                        {!doc.available && <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">Unavailable</Badge>}
                        {formData.doctor === doc.name && <div className="absolute top-3 right-3 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>}
                        
                        <div className="flex flex-col items-center text-center space-y-3 mt-2">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl ${
                             formData.doctor === doc.name ? 'bg-teal-500 text-white shadow-md shadow-teal-500/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {doc.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{doc.name}</h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">{doc.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex flex-col gap-8">
                  
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Session Duration</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DURATION_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setField('duration', opt.value)}      
                                className={`py-3 px-4 text-sm rounded-xl border transition-all font-medium flex items-center justify-center gap-2 ${        
                                    formData.duration === opt.value
                                    ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20 ring-2 ring-teal-500/20'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-300 hover:bg-teal-50/30'
                                }`}
                            >
                                {opt.label}        
                            </button>
                        ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                      <Label className="text-base font-semibold">Select Date</Label>
                    <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-white dark:bg-slate-950 inline-block shadow-sm">
                        <Calendar
                            mode="single"
                            selected={formData.date}
                            onSelect={(d) => setField('date', d)}
                            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                            className="rounded-md pointer-events-auto"
                        />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <Label className="text-base font-semibold flex items-center gap-2">
                        Available Times 
                        {formData.date && <span className="text-xs font-normal text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded-full">{format(formData.date, "MMM do")}</span>}
                    </Label>
                    
                    {!formData.date ? (
                        <div className="h-full min-h-[250px] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                            <CalendarIcon className="w-8 h-8 mb-3 opacity-50" />
                            <p className="text-sm">Please select a date first to view available time slots.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {timeSlots.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setField('time', time)}
                                    className={`py-3 px-4 text-sm rounded-xl border transition-all font-medium flex items-center justify-center gap-2 ${
                                        formData.time === time
                                        ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20 ring-2 ring-teal-500/20'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-300 hover:bg-teal-50/30'
                                    }`}
                                >
                                    <Clock className="w-4 h-4" /> {time}
                                </button>
                            ))}
                        </div>
                    )}
                  </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Success Confirmation */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6 py-8">
                  <div className="w-20 h-20 bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Booking Confirmed!</h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    Your {formData.mode.toLowerCase()} appointment with {formData.doctor} has been successfully scheduled for {formData.date ? format(formData.date, "MMMM do, yyyy") : ""} at {formData.time}.
                  </p>
                  <div className="pt-6">
                    <Link to="/profile">
                      <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-8 py-6 shadow-xl text-lg font-bold">
                        Go to My Profile
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                  
                  {/* Summary Card */}
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/10 dark:to-emerald-900/10 border border-teal-100 dark:border-teal-900/30 rounded-2xl p-5">
                    <h3 className="text-teal-800 dark:text-teal-300 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> Session Summary
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <span className="text-teal-600/70 dark:text-teal-400/70 text-xs font-semibold block mb-1">Professional</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{formData.doctor}</span>
                        </div>
                        <div>
                            <span className="text-teal-600/70 dark:text-teal-400/70 text-xs font-semibold block mb-1">Service Options</span>
                            <div className="flex gap-1">
                                <Badge variant="secondary" className="text-[10px] bg-white/60 dark:bg-slate-900/60">{formData.service}</Badge>
                                <Badge variant="secondary" className="text-[10px] bg-white/60 dark:bg-slate-900/60">{formData.mode}</Badge>
                            </div>
                        </div>
                        <div>
                            <span className="text-teal-600/70 dark:text-teal-400/70 text-xs font-semibold block mb-1">Date</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {formData.date ? format(formData.date, "MMM do, yyyy") : ""}
                            </span>
                        </div>
                        <div>
                            <span className="text-teal-600/70 dark:text-teal-400/70 text-xs font-semibold block mb-1">Time</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{formData.time}</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-slate-600 dark:text-slate-400">Full Name</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="pl-9 bg-white dark:bg-slate-900" required />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-slate-600 dark:text-slate-400">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="pl-9 bg-white dark:bg-slate-900" required />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-slate-600 dark:text-slate-400">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="pl-9 bg-white dark:bg-slate-900" required />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="mode" className="text-slate-600 dark:text-slate-400">Session Type (Video/Chat)</Label>
                      <Select defaultValue={formData.mode} onValueChange={(val) => setField('mode', val)}>
                        <SelectTrigger className="bg-white dark:bg-slate-900">
                            <SelectValue placeholder="Select session type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Video">Video Call</SelectItem>
                          <SelectItem value="Chat">Text Chat</SelectItem>
                          <SelectItem value="In-Person">In Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="service" className="text-slate-600 dark:text-slate-400">Service Category</Label>
                      <Select defaultValue={formData.service} onValueChange={(val) => setField('service', val)}>
                        <SelectTrigger className="bg-white dark:bg-slate-900">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Therapy">Individual Therapy</SelectItem>
                          <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="Couples">Couples Counseling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="notes" className="text-slate-600 dark:text-slate-400">Additional Notes <span className="text-slate-400 font-normal">(Optional)</span></Label>
                      <Input id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Anything your professional should know beforehand?" className="bg-white dark:bg-slate-900" />
                    </div>
                  </div>
                  
                </motion.div>
              )}

            </AnimatePresence>
          </CardContent>
          
          {step < 4 && (
          <CardFooter className="bg-slate-50 border-t border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/50 p-6 flex justify-between items-center rounded-b-xl">
            <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)} 
                disabled={step === 1 || loading}
                className={step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm'}
            >
                Back
            </Button>
            
            {step < 3 ? (
               <Button 
                   onClick={() => setStep(step + 1)} 
                   disabled={(step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)}
                   className="bg-teal-600 hover:bg-teal-700 text-white shadow-md px-6 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
               >
                   Next Step <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            ) : (
               <Button 
                   onClick={handleSubmit}
                   disabled={loading || !formData.name || !formData.email || !formData.phone}
                   className="bg-teal-600 hover:bg-teal-700 text-white shadow-md px-6 rounded-xl disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
               >
                   {loading ? "Confirming..." : "Confirm Booking"} {loading ? null : <CheckCircle2 className="w-4 h-4 ml-2" />}
               </Button>
            )}
          </CardFooter>
        )}
        </Card>

      </div>
    </div>
  );
};

export default Appointment;
