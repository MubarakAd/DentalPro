"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, Upload, BarChart3 } from "lucide-react"
import Link from "next/link"

const quickActions = [
  {
    title: "New Appointment",
    description: "Schedule a patient visit",
    icon: <Calendar className="h-5 w-5" />,
    href: "/appointments",
    color: "bg-violet-600 hover:bg-violet-700",
  },
  {
    title: "Add Patient",
    description: "Register new patient",
    icon: <Users className="h-5 w-5" />,
    href: "/patients",
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    title: "Import Data",
    description: "Upload patient records",
    icon: <Upload className="h-5 w-5" />,
    href: "/import",
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    title: "Generate Report",
    description: "Create practice reports",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/reports",
    color: "bg-amber-600 hover:bg-amber-700",
  },
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className={`w-full h-auto p-4 flex flex-col items-center gap-2 text-white border-0 ${action.color} transition-all duration-200 hover:scale-105`}
              >
                {action.icon}
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
