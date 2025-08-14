"use client"

import DashboardStats from "@/components/dashboard-stats"
import DashboardCharts from "@/components/dashboard-charts"
import RecentActivity from "@/components/recent-activity"
import QuickActions from "@/components/quick-actions"
import { useDashboardStats } from "@/hooks/use-dashboard-data"

export default function DashboardPage() {
  const { stats, loading } = useDashboardStats()

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Performance Overview</h1>
        <p className="text-gray-600">
          Monitor your practice's performance at a glance with actionable insights to enhance patient care and
          operational efficiency.
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Charts Section */}
      <DashboardCharts />

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
