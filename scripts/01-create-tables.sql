-- Create tables for dental practice management system

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  medical_history TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance providers table
CREATE TABLE IF NOT EXISTS insurance_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient insurance table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS patient_insurance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  insurance_provider_id UUID REFERENCES insurance_providers(id) ON DELETE CASCADE,
  policy_number VARCHAR(100),
  group_number VARCHAR(100),
  is_primary BOOLEAN DEFAULT false,
  effective_date DATE,
  expiration_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  procedure_type VARCHAR(200),
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Treatments table
CREATE TABLE IF NOT EXISTS treatments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  treatment_date DATE NOT NULL,
  procedure_code VARCHAR(20),
  procedure_name VARCHAR(200) NOT NULL,
  tooth_number VARCHAR(10),
  cost DECIMAL(10,2),
  insurance_covered DECIMAL(10,2) DEFAULT 0,
  patient_paid DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(last_name, first_name);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_treatments_date ON treatments(treatment_date);
CREATE INDEX IF NOT EXISTS idx_patient_insurance_patient ON patient_insurance(patient_id);
