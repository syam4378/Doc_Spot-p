import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Eye, EyeOff, User, Stethoscope, Shield, UserPlus } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
  role: 'patient' | 'doctor' | 'admin';
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'patient' | 'doctor' | 'admin';
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [authError, setAuthError] = useState('');
  const { login, signup, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const loginForm = useForm<LoginForm>({
    defaultValues: { role: 'patient' }
  });
  
  const signupForm = useForm<SignupForm>({
    defaultValues: { role: 'patient' }
  });

  const onLogin = async (data: LoginForm) => {
    setAuthError('');
    const result = await login(data.email, data.password);
    
    if (result.success) {
      navigate(`/${data.role}/dashboard`);
    } else {
      setAuthError(result.error || 'Login failed');
    }
  };

  const onSignup = async (data: SignupForm) => {
    setAuthError('');
    
    if (data.password !== data.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    if (data.password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    const result = await signup(data.name, data.email, data.password, data.role);
    
    if (result.success) {
      setAuthError('Account created successfully! Please check your email to verify your account.');
      // Optionally redirect to login or dashboard
      setTimeout(() => {
        setIsSignup(false);
        setAuthError('');
      }, 3000);
    } else {
      setAuthError(result.error || 'Signup failed');
    }
  };

  const roleOptions = [
    { value: 'patient', label: 'Patient', icon: <User className="w-5 h-5" />, color: 'text-medical-600' },
    { value: 'doctor', label: 'Doctor', icon: <Stethoscope className="w-5 h-5" />, color: 'text-primary-600' },
    { value: 'admin', label: 'Administrator', icon: <Shield className="w-5 h-5" />, color: 'text-purple-600' }
  ];

  const selectedRole = isSignup ? signupForm.watch('role') : loginForm.watch('role');

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-medical-600 p-12 flex-col justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-white">
          <div className="flex items-center mb-8">
            <Heart className="w-10 h-10" />
            <span className="ml-3 text-2xl font-bold">HealthCare Pro</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">
            {isSignup ? 'Join Our Healthcare Community' : 'Welcome to the Future of Healthcare Management'}
          </h1>
          <p className="text-xl opacity-90 mb-8">
            {isSignup 
              ? 'Create your account and start managing your healthcare journey with our comprehensive platform.'
              : 'Secure, efficient, and user-friendly platform designed specifically for healthcare professionals and patients.'
            }
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>HIPAA Compliant & Secure</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Real-time Patient Monitoring</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
              <span>Comprehensive Analytics</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel - Auth Form */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-md mx-auto w-full">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold">HealthCare Pro</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => setIsSignup(false)}
                className={`px-4 py-2 rounded-l-lg font-medium transition-colors ${
                  !isSignup ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignup(true)}
                className={`px-4 py-2 rounded-r-lg font-medium transition-colors ${
                  isSignup ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Sign Up
              </button>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignup ? 'Create Account' : 'Sign In'}
            </h2>
            <p className="text-gray-600">
              {isSignup ? 'Join our healthcare platform' : 'Access your healthcare dashboard'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {isSignup ? (
              <motion.form
                key="signup"
                onSubmit={signupForm.handleSubmit(onSignup)}
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roleOptions.map((option) => (
                      <label key={option.value} className="cursor-pointer">
                        <input
                          type="radio"
                          value={option.value}
                          {...signupForm.register('role', { required: 'Please select a role' })}
                          className="sr-only"
                        />
                        <div className={`
                          p-3 rounded-lg border-2 text-center transition-all
                          ${selectedRole === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}>
                          <div className={`flex justify-center mb-1 ${option.color}`}>
                            {option.icon}
                          </div>
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {signupForm.formState.errors.role && (
                    <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.role.message}</p>
                  )}
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...signupForm.register('name', {
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your full name"
                  />
                  {signupForm.formState.errors.name && (
                    <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    {...signupForm.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      {...signupForm.register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...signupForm.register('confirmPassword', {
                        required: 'Please confirm your password'
                      })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {authError && (
                  <div className={`border rounded-lg p-3 ${
                    authError.includes('successfully') 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      authError.includes('successfully') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {authError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Account
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="login"
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {roleOptions.map((option) => (
                      <label key={option.value} className="cursor-pointer">
                        <input
                          type="radio"
                          value={option.value}
                          {...loginForm.register('role', { required: 'Please select a role' })}
                          className="sr-only"
                        />
                        <div className={`
                          p-3 rounded-lg border-2 text-center transition-all
                          ${selectedRole === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}>
                          <div className={`flex justify-center mb-1 ${option.color}`}>
                            {option.icon}
                          </div>
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {loginForm.formState.errors.role && (
                    <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.role.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    {...loginForm.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter your email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      {...loginForm.register('password', {
                        required: 'Password is required'
                      })}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                {authError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-600">{authError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center">
            <Link to="/" className="text-primary-600 hover:text-primary-700 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;