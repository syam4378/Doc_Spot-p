import { User, Appointment, MedicalRecord, Prescription, Message, HealthData } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'healthcare_users',
  APPOINTMENTS: 'healthcare_appointments',
  MEDICAL_RECORDS: 'healthcare_medical_records',
  PRESCRIPTIONS: 'healthcare_prescriptions',
  MESSAGES: 'healthcare_messages',
  HEALTH_DATA: 'healthcare_health_data',
  CURRENT_USER: 'healthcare_user'
};

// Generic storage functions
export const getFromStorage = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from storage:', error);
    return [];
  }
};

export const saveToStorage = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

// User functions
export const getUsers = (): User[] => getFromStorage<User>(STORAGE_KEYS.USERS);
export const saveUsers = (users: User[]): void => saveToStorage(STORAGE_KEYS.USERS, users);

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    saveUsers(users);
  }
};

export const deleteUser = (userId: string): void => {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  saveUsers(filteredUsers);
};

// Appointment functions
export const getAppointments = (): Appointment[] => getFromStorage<Appointment>(STORAGE_KEYS.APPOINTMENTS);
export const saveAppointments = (appointments: Appointment[]): void => saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);

export const addAppointment = (appointment: Appointment): void => {
  const appointments = getAppointments();
  appointments.push(appointment);
  saveAppointments(appointments);
};

export const updateAppointment = (updatedAppointment: Appointment): void => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === updatedAppointment.id);
  if (index !== -1) {
    appointments[index] = updatedAppointment;
    saveAppointments(appointments);
  }
};

export const deleteAppointment = (appointmentId: string): void => {
  const appointments = getAppointments();
  const filteredAppointments = appointments.filter(a => a.id !== appointmentId);
  saveAppointments(filteredAppointments);
};

// Medical Record functions
export const getMedicalRecords = (): MedicalRecord[] => getFromStorage<MedicalRecord>(STORAGE_KEYS.MEDICAL_RECORDS);
export const saveMedicalRecords = (records: MedicalRecord[]): void => saveToStorage(STORAGE_KEYS.MEDICAL_RECORDS, records);

export const addMedicalRecord = (record: MedicalRecord): void => {
  const records = getMedicalRecords();
  records.push(record);
  saveMedicalRecords(records);
};

export const updateMedicalRecord = (updatedRecord: MedicalRecord): void => {
  const records = getMedicalRecords();
  const index = records.findIndex(r => r.id === updatedRecord.id);
  if (index !== -1) {
    records[index] = updatedRecord;
    saveMedicalRecords(records);
  }
};

export const deleteMedicalRecord = (recordId: string): void => {
  const records = getMedicalRecords();
  const filteredRecords = records.filter(r => r.id !== recordId);
  saveMedicalRecords(filteredRecords);
};

// Prescription functions
export const getPrescriptions = (): Prescription[] => getFromStorage<Prescription>(STORAGE_KEYS.PRESCRIPTIONS);
export const savePrescriptions = (prescriptions: Prescription[]): void => saveToStorage(STORAGE_KEYS.PRESCRIPTIONS, prescriptions);

export const addPrescription = (prescription: Prescription): void => {
  const prescriptions = getPrescriptions();
  prescriptions.push(prescription);
  savePrescriptions(prescriptions);
};

export const updatePrescription = (updatedPrescription: Prescription): void => {
  const prescriptions = getPrescriptions();
  const index = prescriptions.findIndex(p => p.id === updatedPrescription.id);
  if (index !== -1) {
    prescriptions[index] = updatedPrescription;
    savePrescriptions(prescriptions);
  }
};

export const deletePrescription = (prescriptionId: string): void => {
  const prescriptions = getPrescriptions();
  const filteredPrescriptions = prescriptions.filter(p => p.id !== prescriptionId);
  savePrescriptions(filteredPrescriptions);
};

// Message functions
export const getMessages = (): Message[] => getFromStorage<Message>(STORAGE_KEYS.MESSAGES);
export const saveMessages = (messages: Message[]): void => saveToStorage(STORAGE_KEYS.MESSAGES, messages);

export const addMessage = (message: Message): void => {
  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
};

export const markMessageAsRead = (messageId: string): void => {
  const messages = getMessages();
  const message = messages.find(m => m.id === messageId);
  if (message) {
    message.read = true;
    saveMessages(messages);
  }
};

export const deleteMessage = (messageId: string): void => {
  const messages = getMessages();
  const filteredMessages = messages.filter(m => m.id !== messageId);
  saveMessages(filteredMessages);
};

// Health Data functions
export const getHealthData = (): HealthData[] => getFromStorage<HealthData>(STORAGE_KEYS.HEALTH_DATA);
export const saveHealthData = (healthData: HealthData[]): void => saveToStorage(STORAGE_KEYS.HEALTH_DATA, healthData);

export const addHealthData = (data: HealthData): void => {
  const healthData = getHealthData();
  healthData.push(data);
  saveHealthData(healthData);
};

export const updateHealthData = (updatedData: HealthData): void => {
  const healthData = getHealthData();
  const index = healthData.findIndex(h => h.id === updatedData.id);
  if (index !== -1) {
    healthData[index] = updatedData;
    saveHealthData(healthData);
  }
};

export const deleteHealthData = (dataId: string): void => {
  const healthData = getHealthData();
  const filteredData = healthData.filter(h => h.id !== dataId);
  saveHealthData(filteredData);
};

// File upload simulation
export const uploadFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate file upload delay
    setTimeout(() => {
      // Create a blob URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);
      resolve(fileUrl);
    }, 1000);
  });
};

// Generate sample data
export const generateSampleData = (): void => {
  // Only generate if no data exists
  if (getUsers().length === 0) {
    const sampleUsers: User[] = [
      {
        id: 'doctor-1',
        name: 'Dr. Sarah Johnson',
        email: 'doctor@demo.com',
        role: 'doctor',
        phone: '+1-555-0101',
        specialization: 'Cardiology',
        licenseNumber: 'MD12345',
        department: 'Cardiology',
        avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
        createdAt: new Date().toISOString()
      },
      {
        id: 'doctor-2',
        name: 'Dr. Michael Chen',
        email: 'michael.chen@demo.com',
        role: 'doctor',
        phone: '+1-555-0102',
        specialization: 'Dermatology',
        licenseNumber: 'MD12346',
        department: 'Dermatology',
        avatar: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150',
        createdAt: new Date().toISOString()
      },
      {
        id: 'patient-1',
        name: 'Alice Johnson',
        email: 'patient@demo.com',
        role: 'patient',
        phone: '+1-555-0201',
        dateOfBirth: '1985-06-15',
        bloodType: 'A+',
        allergies: ['Penicillin'],
        emergencyContact: '+1-555-0301',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        createdAt: new Date().toISOString()
      },
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@demo.com',
        role: 'admin',
        phone: '+1-555-0001',
        avatar: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=150',
        createdAt: new Date().toISOString()
      }
    ];
    
    saveUsers(sampleUsers);
    
    // Store demo passwords
    localStorage.setItem('password_doctor@demo.com', 'doctor123');
    localStorage.setItem('password_patient@demo.com', 'patient123');
    localStorage.setItem('password_admin@demo.com', 'admin123');
    localStorage.setItem('password_michael.chen@demo.com', 'doctor123');

    // Generate sample appointments
    const sampleAppointments: Appointment[] = [
      {
        id: 'apt-1',
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        patientName: 'Alice Johnson',
        doctorName: 'Dr. Sarah Johnson',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        time: '10:00',
        type: 'Regular Checkup',
        status: 'confirmed',
        notes: 'Annual physical examination',
        createdAt: new Date().toISOString()
      },
      {
        id: 'apt-2',
        patientId: 'patient-1',
        doctorId: 'doctor-2',
        patientName: 'Alice Johnson',
        doctorName: 'Dr. Michael Chen',
        date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // Day after tomorrow
        time: '14:30',
        type: 'Consultation',
        status: 'scheduled',
        notes: 'Skin consultation',
        createdAt: new Date().toISOString()
      }
    ];
    
    saveAppointments(sampleAppointments);

    // Generate sample prescriptions
    const samplePrescriptions: Prescription[] = [
      {
        id: 'presc-1',
        patientId: 'patient-1',
        doctorId: 'doctor-1',
        patientName: 'Alice Johnson',
        doctorName: 'Dr. Sarah Johnson',
        medications: [
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take with food'
          },
          {
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            duration: '30 days',
            instructions: 'Take with meals'
          }
        ],
        date: new Date().toISOString().split('T')[0],
        notes: 'Continue current medication regimen',
        createdAt: new Date().toISOString()
      }
    ];
    
    savePrescriptions(samplePrescriptions);
  }
};