"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { BarChart3 } from "lucide-react"
import { useRevenueData, useWeeklyAppointments, useTreatmentDistribution } from "@/hooks/use-dashboard-data"

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  appointments: {
    label: "Appointments",
    color: "hsl(var(--chart-2))",
  },
  scheduled: {
    label: "Scheduled",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
}

export default function DashboardCharts() {
  const { data: revenueData, loading: revenueLoading } = useRevenueData()
  const { data: appointmentData, loading: appointmentLoading } = useWeeklyAppointments()
  const { data: treatmentData, loading: treatmentLoading } = useTreatmentDistribution()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trends */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Monthly Revenue Trends</CardTitle>
          <CardDescription>Revenue over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueLoading ? (
            <div className="h-[300px] bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: "#7c3aed", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Weekly Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Weekly Appointment Overview</CardTitle>
          <CardDescription>This week's appointment status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentLoading ? (
            <div className="h-[250px] bg-gray-100 animate-pulse rounded"></div>
          ) : (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="completed" stackId="a" fill="#7c3aed" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="cancelled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Treatment Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Treatment Distribution</CardTitle>
          <CardDescription>Most common procedures this month</CardDescription>
        </CardHeader>
        <CardContent>
          {treatmentLoading ? (
            <div className="h-[250px] bg-gray-100 animate-pulse rounded"></div>
          ) : treatmentData.length > 0 ? (
            <>
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={treatmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {treatmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {treatmentData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No treatment data available</p>
                <p className="text-sm">Add some treatments to see the distribution</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
