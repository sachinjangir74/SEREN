import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Video, MessageCircle, Calendar } from 'lucide-react';
import { TherapistCard } from '../../components/ui/TherapistCard';
import { Image } from '../../components/ui/Image';

export default function ServiceDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({ service: null, therapists: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // We are currently running from local dev API which is on 5005 per our manual testing
  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/services/${slug}`);
        if (response.data.success) {
          setData(response.data.data);
        } else {
          setError(response.data.message || 'Service not found');
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch service data. Please try again later.');
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    const getSectionImage1 = (slug) => {
    if (slug.includes('couple') || slug.includes('marriage')) return 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800';
    if (slug.includes('teen') || slug.includes('child')) return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800';
    if (slug.includes('psychiatric') || slug.includes('medication')) return 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800';
  };

  const getSectionImage2 = (slug) => {
    if (slug.includes('couple') || slug.includes('marriage')) return 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800';
    if (slug.includes('teen') || slug.includes('child')) return 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=800';
    if (slug.includes('psychiatric') || slug.includes('medication')) return 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800';
    return 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800';
  };

  return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-xl text-teal-600 font-medium">Loading your healing journey...</div>
      </div>
    );
  }

  if (error || !data || !data.service) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Therapy Service Not Found</h2>
        <p className="text-gray-600 mt-2">{error || 'Could not find the requested service.'}</p>
        <Button onClick={() => navigate('/')} className="mt-4">Return Home</Button>
      </div>
    );
  }

  const { service, therapists } = data;

  // Determine a hero image based on the service slug or title
  const getHeroImage = (slug) => {
    if (slug.includes('couple') || slug.includes('marriage')) return 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80&w=1600';
    if (slug.includes('teen') || slug.includes('child')) return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600';
    if (slug.includes('psychiatric') || slug.includes('medication')) return 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=1600';
    return 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&q=80&w=1600';
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20">
      {/* Hero Section */}
      <section className="relative text-white py-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-teal-900/70 z-10 mix-blend-multiply" />
          <Image src={getHeroImage(slug)} alt={service.title} className="w-full h-full object-cover" />
        </div>
        <div className="max-w-4xl mx-auto relative z-20">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">{service.title}</h1>
          <p className="text-xl md:text-2xl opacity-95 leading-relaxed mb-10 drop-shadow-md">{service.shortDescription}</p>
          <Button 
            onClick={() => navigate(`/appointment?service=${slug}`)}
            className="bg-white text-teal-800 hover:bg-gray-100 hover:scale-105 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-xl"
          >
            Start Therapy Now
          </Button>
        </div>
      </section>

      {/* Description & Benefits Context */}
      <section className="py-20 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold text-teal-900 mb-6">About this Service</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{service.fullDescription}</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-teal-900 mb-6">What You'll Gain</h2>
          <ul className="space-y-4">
            {service.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start">
                <span className="text-teal-500 mr-3 text-xl">✓</span>
                <span className="text-gray-700 text-lg">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="bg-teal-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-teal-900 mb-16">How Your Journey Begins</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {service.howItWorks.map((stepItem, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-teal-100 relative z-10">
                <div className="w-14 h-14 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  {stepItem.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{stepItem.title}</h3>
                <p className="text-gray-600">{stepItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Relevant Therapists Section */}
      {therapists && therapists.length > 0 && (
          <section className="py-20 max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-teal-900 mb-4">Meet Our Specialized Care Providers</h2>
          <p className="text-center text-gray-600 mb-12">Licensed professionals highly experienced in {service.title.toLowerCase()}.</p>
          
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {therapists.map((t, index) => (
              <TherapistCard key={t._id || index} therapist={t} index={index} />
            ))}
          </div>
        </section>
      )}

      {/* Psychiatric Disclaimer Mapping */}
      {service.category === 'psychiatry' && (
        <div className="max-w-4xl mx-auto px-6 pb-10">
          <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-xl">
            <h4 className="text-orange-800 font-bold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              Standard Medical Disclaimer
            </h4>
            <p className="text-orange-700 text-sm">
              Psychiatric sessions involve formal medical evaluations and potential medication management. Any immediate life-threatening emergency should be directed to 911 or your local emergency response service instead of online booking.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
