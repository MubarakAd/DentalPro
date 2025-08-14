"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, DollarSign, FileText, User, Clock } from "lucide-react"
import { useRecentActivity } from "@/hooks/use-dashboard-data"

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

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "appointment":
      return <Calendar className="h-4 w-4" />
    case "payment":
      return <DollarSign className="h-4 w-4" />
    case "treatment":
      return <FileText className="h-4 w-4" />
    case "patient":
      return <User className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getStatusBadge(status?: string) {
  if (!status) return null

  const variants = {
    completed: "default",
    pending: "secondary",
    cancelled: "destructive",
  } as const

  return (
    <Badge variant={variants[status as keyof typeof variants]} className="text-xs">
      {status}
    </Badge>
  )
}

function getPatientInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
}

export default function RecentActivity() {
  const { activities, loading } = useRecentActivity()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
          <CardDescription>Latest updates from your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
        <CardDescription>Latest updates from your practice</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent activity found</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <div className="flex items-center gap-2">
                      {activity.amount && (
                        <span className="text-sm font-medium text-green-600">${activity.amount.toLocaleString()}</span>
                      )}
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{activity.description}</p>

                  <div className="flex items-center justify-between">
                    {activity.patient && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs bg-gray-200">
                            {getPatientInitials(activity.patient)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{activity.patient}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
