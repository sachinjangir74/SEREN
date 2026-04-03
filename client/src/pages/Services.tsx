import React from 'react';
import { motion } from 'framer-motion';

const servicesList = [
  {
    title: 'Individual Therapy',
    description: 'One-on-one sessions tailored to your unique mental health needs. Find a safe space to explore your thoughts and emotions.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'ri-user-heart-line',
  },
  {
    title: 'Couples Counseling',
    description: 'Improve communication, resolve conflicts, and strengthen your relationship with guided sessions by expert therapists.',
    image: 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'ri-group-line',
  },
  {
    title: 'Group Therapy',
    description: 'Connect with others facing similar challenges. Share experiences and support each other in a professionally mediated environment.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'ri-team-line',
  },
  {
    title: 'Cognitive Behavioral Therapy (CBT)',
    description: 'A structured, goal-oriented therapy to help manage problems by changing how you think and behave.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'ri-brain-line',
  },
  {
    title: 'Mindfulness & Meditation',
    description: 'Learn techniques to stay present, reduce stress, and improve overall mental well-being in your daily life.',
    image: 'https://images.unsplash.com/photo-1528315651484-ac94f1ac6d73?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'ri-leaf-line',
  },
  {
    title: 'Psychiatric Evaluations',
    description: 'Comprehensive assessments to diagnose mental health conditions and formulate effective, personalized treatment plans.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'ri-stethoscope-line',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const Services = () => {
  return (
    <main className="flex-grow bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1473221326025-9183a48ffcbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Services Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-teal-900/60 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl tracking-tight">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-teal-50 drop-shadow-md">
              Comprehensive mental health support tailored completely to your evolving needs and journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {servicesList.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl shadow-teal-900/5 border border-gray-100 dark:border-gray-700 flex flex-col group cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-teal-900/20 group-hover:bg-transparent transition-colors z-10 duration-500" />
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg text-teal-600">
                  <i className={`${service.icon} text-2xl`}></i>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 flex-grow leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <span className="inline-flex items-center font-semibold text-teal-600 dark:text-teal-400 group-hover:text-teal-700 transition-colors">
                    Learn more <i className="ri-arrow-right-line ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
};

export default Services;
