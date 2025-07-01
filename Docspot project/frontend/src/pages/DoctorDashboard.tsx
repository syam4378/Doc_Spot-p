import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import PatientCreator from '../components/PatientCreator';
import PatientSearch from '../components/PatientSearch';
import PrescriptionCreator from '../components/PrescriptionCreator';
import ProfileSettings from '../components/ProfileSettings';
import {
  Calendar,
  Users,
  FileText,
  MessageCircle,
  User,
  Clock,
  Activity,
  AlertTriangle,
  Plus,
  Search,
  Eye,
  Check,
  X,
  Trash2
} from 'lucide-react';
import * as Recharts from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, getAppointments, getPrescriptions, updateAppointment, deleteAppointment } from '../utils/storage';
import { User as UserType, Appointment, Prescription } from '../types';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<UserType[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showPatientCreator, setShowPatientCreator] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showPrescriptionCreator, setShowPrescriptionCreator] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState<string | undefined>();

  const navigation = [
    { name: 'Dashboard', icon: <Activity className="w-5 h-5" />, path: '/doctor/dashboard', current: location.pathname === '/doctor/dashboard' },
    { name: 'Appointments', icon: <Calendar className="w-5 h-5" />, path: '/doctor/appointments', current: location.pathname === '/doctor/appointments' },
    { name: 'Patients', icon: <Users className="w-5 h-5" />, path: '/doctor/patients', current: location.pathname === '/doctor/patients' },
    { name: 'Medical Records', icon: <FileText className="w-5 h-5" />, path: '/doctor/records', current: location.pathname === '/doctor/records' },
    { name: 'Messages', icon: <MessageCircle className="w-5 h-5" />, path: '/doctor/messages', current: location.pathname === '/doctor/messages' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, path: '/doctor/profile', current: location.pathname === '/doctor/profile' },
  ];

  useEffect(() => {
    loadData();
  }, [user]);

  // Check if we're on the profile route and show modal
  useEffect(() => {
    if (location.pathname === '/doctor/profile') {
      setShowProfileSettings(true);
    }
  }, [location.pathname]);

  const loadData = () => {
    if (user) {
      // Load all patients
      const allUsers = getUsers();
      const patientUsers = allUsers.filter(u => u.role === 'patient');
      setPatients(patientUsers);

      // Load doctor's appointments
      const allAppointments = getAppointments();
      const doctorAppointments = allAppointments.filter(apt => apt.doctorId === user.id);
      setAppointments(doctorAppointments);

      // Load doctor's prescriptions
      const allPrescriptions = getPrescriptions();
      const doctorPrescriptions = allPrescriptions.filter(presc => presc.doctorId === user.id);
      setPrescriptions(doctorPrescriptions);
    }
  };

  const handleProfileClose = () => {
    setShowProfileSettings(false);
    navigate('/doctor/dashboard');
  };

  const appointmentData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 15 },
    { name: 'Wed', appointments: 8 },
    { name: 'Thu', appointments: 14 },
    { name: 'Fri', appointments: 18 },
    { name: 'Sat', appointments: 6 },
    { name: 'Sun', appointments: 3 },
  ];

  const patientTypeData = [
    { name: 'Regular', value: 45, color: '#3b82f6' },
    { name: 'Follow-up', value: 30, color: '#10b981' },
    { name: 'Emergency', value: 15, color: '#ef4444' },
    { name: 'Consultation', value: 10, color: '#f59e0b' },
  ];

  const todayAppointments = appointments
    .filter(apt => apt.date === new Date().toISOString().split('T')[0])
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 4);

  const urgentCases = appointments
    .filter(apt => apt.type === 'Emergency' && apt.status !== 'completed')
    .slice(0, 2);

  const handlePatientCreated = () => {
    loadData();
  };

  const handleSelectPatientForPrescription = (patient: UserType) => {
    setSelectedPatientForPrescription(patient.id);
    setShowPrescriptionCreator(true);
  };

  const handlePrescriptionCreated = () => {
    loadData();
    setSelectedPatientForPrescription(undefined);
  };

  return (
    <DashboardLayout 
      navigation={navigation} 
    >
      <Routes>
        <Route path="/dashboard" element={<DashboardOverview />} />
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/records" element={<MedicalRecordsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>

      <PatientCreator
        isOpen={showPatientCreator}
        onClose={() => setShowPatientCreator(false)}
        onSuccess={handlePatientCreated}
      />

      <PatientSearch
        isOpen={showPatientSearch}
        onClose={() => setShowPatientSearch(false)}
        onSelectPatient={handleSelectPatientForPrescription}
      />

      <PrescriptionCreator
        isOpen={showPrescriptionCreator}
        onClose={() => {
          setShowPrescriptionCreator(false);
          setSelectedPatientForPrescription(undefined);
        }}
        onSuccess={handlePrescriptionCreated}
        preselectedPatientId={selectedPatientForPrescription}
      />

      <ProfileSettings
        isOpen={showProfileSettings}
        onClose={handleProfileClose}
      />
    </DashboardLayout>
  );

  function DashboardOverview() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-medical-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Good morning, {user?.name}!</h1>
          <p className="opacity-90">You have {todayAppointments.length} appointments scheduled for today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
                <p className="text-sm text-green-600">{urgentCases.length} urgent</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                <p className="text-sm text-green-600">Active patients</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                <p className="text-sm text-green-600">This month</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Urgent Cases</p>
                <p className="text-2xl font-bold text-gray-900">{urgentCases.length}</p>
                <p className="text-sm text-red-600">Needs attention</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Appointment Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Appointments</h2>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-64">
              <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.BarChart data={appointmentData}>
                  <Recharts.CartesianGrid strokeDasharray="3 3" />
                  <Recharts.XAxis dataKey="name" />
                  <Recharts.YAxis />
                  <Recharts.Tooltip />
                  <Recharts.Bar dataKey="appointments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </Recharts.BarChart>
              </Recharts.ResponsiveContainer>
            </div>
          </div>

          {/* Patient Types */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Types</h2>
            <div className="h-48">
              <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.PieChart>
                  <Recharts.Pie
                    data={patientTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {patientTypeData.map((entry, index) => (
                      <Recharts.Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Recharts.Pie>
                  <Recharts.Tooltip />
                </Recharts.PieChart>
              </Recharts.ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {patientTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-sm text-gray-500">{appointment.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.time}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Urgent Cases */}
            {urgentCases.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Urgent Cases</h2>
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="space-y-4">
                  {urgentCases.map((case_item) => (
                    <div key={case_item.id} className="p-4 border-l-4 border-red-400 bg-red-50 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{case_item.patientName}</p>
                          <p className="text-sm text-gray-600">{case_item.type}</p>
                          <p className="text-xs text-gray-500">{case_item.time}</p>
                        </div>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                          Urgent
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <motion.button
                  onClick={() => setShowPatientCreator(true)}
                  className="w-full flex items-center justify-center p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Patient
                </motion.button>
                
                <motion.button
                  onClick={() => setShowPatientSearch(true)}
                  className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Patients
                </motion.button>
                
                <motion.button
                  onClick={() => setShowPrescriptionCreator(true)}
                  className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Create Prescription
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  function AppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

    // Filter appointments based on search and filters
    const filteredAppointments = appointments.filter(appointment => {
      const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesDate = !dateFilter || appointment.date === dateFilter;
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    const handleAcceptAppointment = (appointment: Appointment) => {
      const updatedAppointment = { ...appointment, status: 'confirmed' as const };
      updateAppointment(updatedAppointment);
      loadData();
    };

    const handleRejectAppointment = (appointment: Appointment) => {
      const updatedAppointment = { ...appointment, status: 'cancelled' as const };
      updateAppointment(updatedAppointment);
      loadData();
    };

    const handleDeleteAppointment = (appointmentId: string) => {
      if (window.confirm('Are you sure you want to delete this appointment?')) {
        deleteAppointment(appointmentId);
        loadData();
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-800';
        case 'scheduled': return 'bg-yellow-100 text-yellow-800';
        case 'completed': return 'bg-blue-100 text-blue-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getTypeColor = (type: string) => {
      switch (type) {
        case 'Emergency': return 'bg-red-100 text-red-800';
        case 'Regular Checkup': return 'bg-blue-100 text-blue-800';
        case 'Follow-up': return 'bg-green-100 text-green-800';
        case 'Consultation': return 'bg-purple-100 text-purple-800';
        case 'Specialist Visit': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const upcomingAppointments = filteredAppointments.filter(apt => 
      apt.status === 'scheduled' || apt.status === 'confirmed'
    ).length;

    const todayAppointments = filteredAppointments.filter(apt => 
      apt.date === new Date().toISOString().split('T')[0]
    ).length;

    const pendingAppointments = filteredAppointments.filter(apt => 
      apt.status === 'scheduled'
    ).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
            <p className="text-gray-600">Manage appointments booked by your patients</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingAppointments}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Appointments ({filteredAppointments.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.patientName}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                            {appointment.type}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Date:</span> {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Time:</span> {appointment.time}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> 30 minutes
                          </div>
                        </div>
                        
                        {appointment.notes && (
                          <div className="mb-3">
                            <span className="font-medium text-gray-700">Notes:</span>
                            <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowAppointmentDetails(true);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>

                      {appointment.status === 'scheduled' && (
                        <>
                          <motion.button
                            onClick={() => handleAcceptAppointment(appointment)}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Accept Appointment"
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            onClick={() => handleRejectAppointment(appointment)}
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Reject Appointment"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}

                      <motion.button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Delete Appointment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' || dateFilter 
                    ? 'Try adjusting your filters to see more results.'
                    : 'No appointments have been booked yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Details Modal */}
        {showAppointmentDetails && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                  <button
                    onClick={() => {
                      setShowAppointmentDetails(false);
                      setSelectedAppointment(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Patient Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Patient Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Name:</span>
                          <p className="text-gray-900">{selectedAppointment.patientName}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Patient ID:</span>
                          <p className="text-gray-900">{selectedAppointment.patientId}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Appointment Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium text-gray-700">Date:</span>
                          <p className="text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Time:</span>
                          <p className="text-gray-900">{selectedAppointment.time}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Type:</span>
                          <p className="text-gray-900">{selectedAppointment.type}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Status:</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAppointment.status)}`}>
                            {selectedAppointment.status}
                          </span>
                        </div>
                      </div>
                      {selectedAppointment.notes && (
                        <div className="mt-4">
                          <span className="font-medium text-gray-700">Notes:</span>
                          <p className="text-gray-900 mt-1">{selectedAppointment.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedAppointment.status === 'scheduled' && (
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          handleAcceptAppointment(selectedAppointment);
                          setShowAppointmentDetails(false);
                          setSelectedAppointment(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          handleRejectAppointment(selectedAppointment);
                          setShowAppointmentDetails(false);
                          setSelectedAppointment(null);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  function PatientsPage() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <motion.button
            onClick={() => setShowPatientCreator(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4 mr-2 inline" />
            Add Patient
          </motion.button>
        </div>
        {/* Add patients list here */}
      </div>
    );
  }

  function MedicalRecordsPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        {/* Add medical records management here */}
      </div>
    );
  }

  function MessagesPage() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        {/* Add messages management here */}
      </div>
    );
  }

  function ProfilePage() {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Profile settings will open automatically.</p>
      </div>
    );
  }
};

export default DoctorDashboard;