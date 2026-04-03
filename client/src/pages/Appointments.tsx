import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, Clock, Video, FileText, PlusCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const fetchAppointments = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5005'}/api/appointments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    // The backend returns { success: true, data: [...] } so we need response.data.data
    return response.data?.data || [];
};

const Appointments = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: appointments = [], isLoading, isError } = useQuery({
        queryKey: ['appointments'],
        queryFn: fetchAppointments,
        enabled: !!user
    });

    const appointmentsArray = Array.isArray(appointments) ? appointments : [];
    
    const upcoming = appointmentsArray.filter((apt: any) => new Date(apt.date) >= new Date() && apt.status !== 'cancelled');
    const past = appointmentsArray.filter((apt: any) => new Date(apt.date) < new Date() || apt.status === 'cancelled');

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                            <p className="mt-2 text-sm text-gray-600">Manage your sessions and booking history</p>
                        </div>
                        <button 
                            onClick={() => navigate('/appointment')}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Book New Session
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm animate-pulse border border-gray-100">
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="bg-red-50 p-6 rounded-xl flex items-center text-red-700">
                            <AlertCircle className="w-6 h-6 mr-3" />
                            <p>Failed to load appointments. Please try again later.</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Upcoming Sessions */}
                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">Upcoming Sessions</h2>
                                {upcoming.length === 0 ? (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                                        <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                        <p className="text-gray-500 mb-4">You have no upcoming appointments.</p>
                                        <button 
                                            onClick={() => navigate('/appointment')}
                                            className="text-indigo-600 font-medium hover:text-indigo-700"
                                        >
                                            Book your first session &rarr;
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {upcoming.map((apt: any) => (
                                            <div key={apt._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                                <div className="p-6">
                                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3 mb-2">
                                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                                                    {apt.status || 'Confirmed'}
                                                                </span>
                                                                <span className="text-sm text-gray-500 flex items-center">
                                                                    <Video className="w-4 h-4 mr-1" />
                                                                    Video Call
                                                                </span>
                                                            </div>
                                                            <h3 className="text-lg font-semibold text-gray-900">{apt.therapistName || 'Therapy Session'}</h3>
                                                            <span className="text-gray-600 flex items-center mt-2">
                                                                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                                                {new Date(apt.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                            </span>
                                                            <span className="text-gray-600 flex items-center mt-2">
                                                                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                                                                {apt.time || new Date(apt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col space-y-2 w-full sm:w-auto">
                                                            <button className="w-full px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                                                                Join Call
                                                            </button>
                                                            <button className="w-full px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
                                                                Reschedule
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            {/* Past History */}
                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-3 mb-6">Past Sessions</h2>
                                {past.length === 0 ? (
                                    <p className="text-gray-500 italic">No past sessions found.</p>
                                ) : (
                                    <div className="space-y-4 opacity-80">
                                        {past.map((apt: any) => (
                                            <div key={apt._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                                <div className="p-6">
                                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                                        <div className="w-full">
                                                            <div className="flex items-center space-x-3 mb-1">
                                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                                    {apt.status || 'Completed'}
                                                                </span>
                                                            </div>
                                                            <h3 className="text-md font-medium text-gray-900">{apt.therapistName || 'Therapy Session'}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {new Date(apt.date).toLocaleDateString()} at {apt.time || new Date(apt.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                        <button className="shrink-0 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                                                            <FileText className="w-4 h-4 mr-1" />
                                                            View Notes
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Appointments;
