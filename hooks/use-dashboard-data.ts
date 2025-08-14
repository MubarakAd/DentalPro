"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  monthlyRevenue: number
  insuranceClaims: number
  patientSatisfaction: number
  appointmentUtilization: number
  pendingTreatments: number
  overduePayments: number
}

interface RevenueData {
  month: string
  revenue: number
  appointments: number
}

interface AppointmentData {
  day: string
  scheduled: number
  completed: number
  cancelled: number
}

interface TreatmentData {
  name: string
  value: number
  color: string
}

interface ActivityItem {
  id: string
  type: "appointment" | "payment" | "treatment" | "patient"
  title: string
  description: string
  time: string
  status?: "completed" | "pending" | "cancelled"
  amount?: number
  patient?: string
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    insuranceClaims: 0,
    patientSatisfaction: 0,
    appointmentUtilization: 0,
    pendingTreatments: 0,
    overduePayments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchStats() {
      try {
        // Get total patients
        const { count: totalPatients } = await supabase.from("patients").select("*", { count: "exact", head: true })

        // Get today's appointments
        const today = new Date().toISOString().split("T")[0]
        const { count: todayAppointments } = await supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .gte("appointment_time", `${today}T00:00:00`)
          .lt("appointment_time", `${today}T23:59:59`)

        // Get monthly revenue from treatments
        const currentMonth = new Date().toISOString().slice(0, 7)
        const { data: treatments } = await supabase
          .from("treatments")
          .select("cost")
          .gte("treatment_date", `${currentMonth}-01`)
          .lt("treatment_date", `${currentMonth}-32`)

        const monthlyRevenue = treatments?.reduce((sum, treatment) => sum + (treatment.cost || 0), 0) || 0

        // Get pending treatments count
        const { count: pendingTreatments } = await supabase
          .from("treatments")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        // Calculate appointment utilization (completed vs scheduled)
        const { data: weekAppointments } = await supabase
          .from("appointments")
          .select("status")
          .gte("appointment_time", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

        const completed = weekAppointments?.filter((apt) => apt.status === "completed").length || 0
        const total = weekAppointments?.length || 1
        const appointmentUtilization = Math.round((completed / total) * 100)

        setStats({
          totalPatients: totalPatients || 0,
          todayAppointments: todayAppointments || 0,
          monthlyRevenue,
          insuranceClaims: 0, // Would need claims table
          patientSatisfaction: 94, // Would need ratings table
          appointmentUtilization,
          pendingTreatments: pendingTreatments || 0,
          overduePayments: 0, // Would need payments table
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Set up real-time subscriptions
    const channel = supabase
      .channel("dashboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "patients" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, fetchStats)
      .on("postgres_changes", { event: "*", schema: "public", table: "treatments" }, fetchStats)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { stats, loading }
}

export function useRevenueData() {
  const [data, setData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchRevenueData() {
      try {
        const months = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthStr = date.toISOString().slice(0, 7)
          months.push({
            month: date.toLocaleDateString("en-US", { month: "short" }),
            monthStr,
          })
        }

        const revenueData = await Promise.all(
          months.map(async ({ month, monthStr }) => {
            // Get revenue from treatments
            const { data: treatments } = await supabase
              .from("treatments")
              .select("cost")
              .gte("treatment_date", `${monthStr}-01`)
              .lt("treatment_date", `${monthStr}-32`)

            // Get appointment count
            const { count: appointments } = await supabase
              .from("appointments")
              .select("*", { count: "exact", head: true })
              .gte("appointment_time", `${monthStr}-01`)
              .lt("appointment_time", `${monthStr}-32`)

            const revenue = treatments?.reduce((sum, treatment) => sum + (treatment.cost || 0), 0) || 0

            return {
              month,
              revenue,
              appointments: appointments || 0,
            }
          }),
        )

        setData(revenueData)
      } catch (error) {
        console.error("Error fetching revenue data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRevenueData()
  }, [])

  return { data, loading }
}

export function useWeeklyAppointments() {
  const [data, setData] = useState<AppointmentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchWeeklyData() {
      try {
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        const weekData = await Promise.all(
          days.map(async (day, index) => {
            const date = new Date()
            const dayOfWeek = date.getDay()
            const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) + index
            const targetDate = new Date(date.setDate(diff)).toISOString().split("T")[0]

            const { data: appointments } = await supabase
              .from("appointments")
              .select("status")
              .gte("appointment_time", `${targetDate}T00:00:00`)
              .lt("appointment_time", `${targetDate}T23:59:59`)

            const scheduled = appointments?.length || 0
            const completed = appointments?.filter((apt) => apt.status === "completed").length || 0
            const cancelled = appointments?.filter((apt) => apt.status === "cancelled").length || 0

            return {
              day,
              scheduled,
              completed,
              cancelled,
            }
          }),
        )

        setData(weekData)
      } catch (error) {
        console.error("Error fetching weekly appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeeklyData()
  }, [])

  return { data, loading }
}

export function useTreatmentDistribution() {
  const [data, setData] = useState<TreatmentData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchTreatmentData() {
      try {
        const currentMonth = new Date().toISOString().slice(0, 7)
        const { data: treatments } = await supabase
          .from("treatments")
          .select("procedure_name")
          .gte("treatment_date", `${currentMonth}-01`)
          .lt("treatment_date", `${currentMonth}-32`)

        // Count procedures
        const procedureCounts: { [key: string]: number } = {}
        treatments?.forEach((treatment) => {
          const procedure = treatment.procedure_name || "Other"
          procedureCounts[procedure] = (procedureCounts[procedure] || 0) + 1
        })

        const total = Object.values(procedureCounts).reduce((sum, count) => sum + count, 0)

        const colors = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]

        const treatmentData = Object.entries(procedureCounts)
          .map(([name, count], index) => ({
            name,
            value: Math.round((count / total) * 100),
            color: colors[index % colors.length],
          }))
          .sort((a, b) => b.value - a.value)

        setData(treatmentData)
      } catch (error) {
        console.error("Error fetching treatment distribution:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTreatmentData()
  }, [])

  return { data, loading }
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function fetchRecentActivity() {
      try {
        const recentActivities: ActivityItem[] = []

        // Get recent appointments
        const { data: appointments } = await supabase
          .from("appointments")
          .select(`
            id,
            appointment_time,
            status,
            procedure_type,
            patients (first_name, last_name)
          `)
          .order("appointment_time", { ascending: false })
          .limit(3)

        appointments?.forEach((apt) => {
          const patientName = apt.patients ? `${apt.patients.first_name} ${apt.patients.last_name}` : "Unknown Patient"
          recentActivities.push({
            id: `apt-${apt.id}`,
            type: "appointment",
            title: `Appointment ${apt.status}`,
            description: apt.procedure_type || "General appointment",
            time: new Date(apt.appointment_time).toLocaleString(),
            status: apt.status as any,
            patient: patientName,
          })
        })

        // Get recent treatments
        const { data: treatments } = await supabase
          .from("treatments")
          .select(`
            id,
            treatment_date,
            procedure_name,
            cost,
            patients (first_name, last_name)
          `)
          .order("treatment_date", { ascending: false })
          .limit(2)

        treatments?.forEach((treatment) => {
          const patientName = treatment.patients
            ? `${treatment.patients.first_name} ${treatment.patients.last_name}`
            : "Unknown Patient"
          recentActivities.push({
            id: `treatment-${treatment.id}`,
            type: "treatment",
            title: "Treatment Completed",
            description: treatment.procedure_name || "Medical procedure",
            time: new Date(treatment.treatment_date).toLocaleString(),
            amount: treatment.cost,
            patient: patientName,
          })
        })

        // Sort by most recent
        recentActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

        setActivities(recentActivities.slice(0, 5))
      } catch (error) {
        console.error("Error fetching recent activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()

    // Set up real-time subscriptions
    const channel = supabase
      .channel("activity-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, fetchRecentActivity)
      .on("postgres_changes", { event: "*", schema: "public", table: "treatments" }, fetchRecentActivity)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { activities, loading }
}
