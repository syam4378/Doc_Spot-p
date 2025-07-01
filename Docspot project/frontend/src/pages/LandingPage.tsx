import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Calendar, Stethoscope, ClipboardList } from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Patient Care',
      description: 'Comprehensive patient management with health tracking and medical records.'
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: 'Doctor Portal',
      description: 'Professional tools for doctors to manage appointments and patient care.'
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: 'Admin Dashboard',
      description: 'Complete system management with analytics and reporting tools.'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Scheduling',
      description: 'Smart appointment scheduling with automated reminders.'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure & HIPAA',
      description: 'Bank-level security with full HIPAA compliance.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Multi-Role Access',
      description: 'Role-based access for patients, doctors, and administrators.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">HealthCare Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-medical-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Modern Healthcare
              <span className="text-primary-600"> Management System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your healthcare operations with our comprehensive platform designed for 
              patients, doctors, and administrators. Experience the future of healthcare management.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
              >
                Get Started
              </Link>
              <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors">
                Watch Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage healthcare operations efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-primary-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Healthcare Management?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of healthcare professionals using our platform
            </p>
            <Link
              to="/login"
              className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
            >
              Start Your Free Trial
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary-400" />
            <span className="ml-2 text-lg font-semibold text-white">HealthCare Pro</span>
          </div>
          <p className="text-center text-gray-400 mt-4">
            © 2024 HealthCare Pro. All rights reserved. Built with care for healthcare professionals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;