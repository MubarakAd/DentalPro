import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  phone?: string
  email?: string
  address?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_history?: string
  allergies?: string
  created_at: string
  updated_at: string
}

export interface InsuranceProvider {
  id: string
  name: string
  contact_phone?: string
  contact_email?: string
  address?: string
  created_at: string
}

export interface PatientInsurance {
  id: string
  patient_id: string
  insurance_provider_id: string
  policy_number?: string
  group_number?: string
  is_primary: boolean
  effective_date?: string
  expiration_date?: string
  created_at: string
}

export interface Appointment {
  id: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  procedure_type?: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Treatment {
  id: string
  patient_id: string
  appointment_id?: string
  treatment_date: string
  procedure_code?: string
  procedure_name: string
  tooth_number?: string
  cost?: number
  insurance_covered?: number
  patient_paid?: number
  status: string
  notes?: string
  created_at: string
}
