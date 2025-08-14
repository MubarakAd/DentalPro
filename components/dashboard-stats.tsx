"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Shield, Clock, AlertTriangle } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
  color?: "default" | "success" | "warning" | "danger"
}

function StatCard({ title, value, description, trend, icon, color = "default" }: StatCardProps) {
  const colorClasses = {
    default: "text-violet-600",
    success: "text-emerald-600",
    warning: "text-amber-600",
    danger: "text-red-600",
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gray-50 ${colorClasses[color]}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm text-gray-500">{description}</CardDescription>
          {trend && (
            <Badge variant={trend.isPositive ? "default" : "secondary"} className="text-xs">
              {trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(trend.value)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  stats: {
    totalPatients: number
    todayAppointments: number
    monthlyRevenue: number
    insuranceClaims: number
    patientSatisfaction: number
    appointmentUtilization: number
    pendingTreatments: number
    overduePayments: number
  }
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Patients"
        value={stats.totalPatients.toLocaleString()}
        description="Active patient records"
        trend={{ value: 12, isPositive: true }}
        icon={<Users className="h-4 w-4" />}
        color="success"
      />

      <StatCard
        title="Today's Appointments"
        value={stats.todayAppointments}
        description="Scheduled for today"
        trend={{ value: 8, isPositive: true }}
        icon={<Calendar className="h-4 w-4" />}
        color="default"
      />

      <StatCard
        title="Monthly Revenue"
        value={`$${stats.monthlyRevenue.toLocaleString()}`}
        description="Current month earnings"
        trend={{ value: 15, isPositive: true }}
        icon={<DollarSign className="h-4 w-4" />}
        color="success"
      />

      <StatCard
        title="Insurance Claims"
        value={stats.insuranceClaims}
        description="Pending processing"
        trend={{ value: 5, isPositive: false }}
        icon={<Shield className="h-4 w-4" />}
        color="warning"
      />

      <StatCard
        title="Patient Satisfaction"
        value={`${stats.patientSatisfaction}%`}
        description="Average rating this month"
        trend={{ value: 3, isPositive: true }}
        icon={<TrendingUp className="h-4 w-4" />}
        color="success"
      />

      <StatCard
        title="Appointment Utilization"
        value={`${stats.appointmentUtilization}%`}
        description="Schedule efficiency"
        trend={{ value: 7, isPositive: true }}
        icon={<Clock className="h-4 w-4" />}
        color="default"
      />

      <StatCard
        title="Pending Treatments"
        value={stats.pendingTreatments}
        description="Awaiting completion"
        icon={<AlertTriangle className="h-4 w-4" />}
        color="warning"
      />

      <StatCard
        title="Overdue Payments"
        value={`$${stats.overduePayments.toLocaleString()}`}
        description="Requires follow-up"
        trend={{ value: 2, isPositive: false }}
        icon={<DollarSign className="h-4 w-4" />}
        color="danger"
      />
    </div>
  )
}
