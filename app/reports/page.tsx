"use client"

import { useState } from "react"
import ReportBuilder from "@/components/report-builder"
import ReportPreview from "@/components/report-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, TrendingUp, Users } from "lucide-react"

const reportStats = [
  {
    title: "Reports Generated",
    value: "247",
    description: "This month",
    icon: <FileText className="h-5 w-5" />,
    color: "text-blue-600",
  },
  {
    title: "Most Popular",
    value: "Financial",
    description: "Report type",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "text-green-600",
  },
  {
    title: "Average Export Time",
    value: "2.3s",
    description: "Processing speed",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "text-purple-600",
  },
  {
    title: "Active Users",
    value: "12",
    description: "Using reports",
    icon: <Users className="h-5 w-5" />,
    color: "text-orange-600",
  },
]

export default function ReportsPage() {
  const [showPreview, setShowPreview] = useState(false)
  const [reportConfig, setReportConfig] = useState<any>(null)

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Report Generation</h1>
        <p className="text-gray-600">
          Create comprehensive reports for your dental practice with customizable filters and export options.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`${stat.color}`}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Builder */}
      <ReportBuilder />

      {/* Report Preview */}
      {showPreview && reportConfig && <ReportPreview config={reportConfig} />}
    </div>
  )
}
