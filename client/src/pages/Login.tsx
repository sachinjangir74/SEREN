import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Image } from '../components/ui/Image';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const loadingToast = toast.loading('Signing in...');

    try {
      const loggedInUser = await login({ email: formData.email, password: formData.password });
      if (loggedInUser) {
        toast.success('Signed in successfully!', { id: loadingToast });
        if (loggedInUser.role === 'admin') {
          navigate('/admin');
        } else if (loggedInUser.role === 'therapist') {
          navigate('/therapist');
        } else {
          navigate('/profile');
        }
      } else {
        const errorMsg = 'Invalid credentials';
        setError(errorMsg);
        toast.error(errorMsg, { id: loadingToast });
      }
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : (err.message || 'Login failed');
      setError(errorMessage);
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-surface-light dark:bg-slate-900">
      <div className="hidden lg:block lg:w-1/2 relative inset-y-0">
        <div className="absolute inset-0 bg-primary-900/40 mix-blend-multiply z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          alt="Wellness" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-16 text-white">
          <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome to serenity.</h2>
          <p className="text-xl text-primary-50 max-w-md drop-shadow-md pb-12">
            Sign in to resume your personal wellness journey and reconnect with yourself.
          </p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-surface-dark dark:border-slate-800 rounded-3xl shadow-2xl border border-slate-100 overflow-hidden w-full max-w-md">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h1>
                <p className="text-slate-500 dark:text-slate-400">Sign in to continue your wellness journey</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500 rounded-r-md text-red-700 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 placeholder-slate-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 placeholder-slate-400 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition duration-150 ease-in-out"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm text-slate-600 dark:text-slate-400 cursor-pointer group">
                    <input type="checkbox" className="rounded border-slate-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 mr-2 bg-white dark:bg-slate-700" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  isLoading={loading}
                  className="w-full mt-6"
                >
                  Sign In
                  {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don't have an account? {' '}
                  <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;