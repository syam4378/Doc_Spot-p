export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  specialization?: string; // for doctors
  licenseNumber?: string; // for doctors
  department?: string; // for doctors
  emergencyContact?: string; // for patients
  bloodType?: string; // for patients
  allergies?: string[]; // for patients
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface HealthData {
  id: string;
  patientId: string;
  date: string;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  weight?: number;
  height?: number;
  temperature?: number;
  bloodSugar?: number;
  notes?: string;
  createdAt: string;
}