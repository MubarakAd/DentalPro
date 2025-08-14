"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Eye, FileText, BarChart3, Users, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface ReportConfig {
  type: string
  title: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  filters: {
    patientStatus?: string
    insuranceProvider?: string
    treatmentType?: string
    paymentStatus?: string
  }
  columns: string[]
  exportFormat: "pdf" | "excel" | "csv"
}

const reportTypes = [
  {
    id: "financial",
    name: "Financial Report",
    description: "Revenue, payments, and outstanding balances",
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "patient",
    name: "Patient Report",
    description: "Patient demographics and contact information",
    icon: <Users className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "appointment",
    name: "Appointment Report",
    description: "Scheduling and attendance analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "treatment",
    name: "Treatment Report",
    description: "Procedures and treatment outcomes",
    icon: <FileText className="h-5 w-5" />,
    color: "bg-orange-100 text-orange-700",
  },
]

const columnOptions = {
  financial: [
    "Patient Name",
    "Treatment Date",
    "Procedure",
    "Total Cost",
    "Insurance Covered",
    "Patient Paid",
    "Outstanding Balance",
    "Payment Status",
  ],
  patient: [
    "Patient ID",
    "Full Name",
    "Date of Birth",
    "Phone",
    "Email",
    "Address",
    "Emergency Contact",
    "Registration Date",
    "Last Visit",
  ],
  appointment: ["Date", "Time", "Patient Name", "Procedure Type", "Duration", "Status", "Provider", "Notes"],
  treatment: [
    "Treatment Date",
    "Patient Name",
    "Procedure Code",
    "Procedure Name",
    "Tooth Number",
    "Cost",
    "Status",
    "Provider",
  ],
}

export default function ReportBuilder() {
  const [config, setConfig] = useState<ReportConfig>({
    type: "",
    title: "",
    dateRange: { from: undefined, to: undefined },
    filters: {},
    columns: [],
    exportFormat: "pdf",
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleReportTypeChange = (type: string) => {
    const reportType = reportTypes.find((r) => r.id === type)
    setConfig({
      ...config,
      type,
      title: reportType?.name || "",
      columns: columnOptions[type as keyof typeof columnOptions]?.slice(0, 4) || [],
    })
  }

  const handleColumnToggle = (column: string, checked: boolean) => {
    if (checked) {
      setConfig({ ...config, columns: [...config.columns, column] })
    } else {
      setConfig({ ...config, columns: config.columns.filter((c) => c !== column) })
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    setShowPreview(true)
  }

  const exportReport = async () => {
    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In a real app, this would trigger the actual export
    alert(`Report exported as ${config.exportFormat.toUpperCase()}`)
  }

  return (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Select Report Type</CardTitle>
          <CardDescription>Choose the type of report you want to generate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportTypes.map((type) => (
              <div
                key={type.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  config.type === type.id ? "border-violet-500 bg-violet-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleReportTypeChange(type.id)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${type.color}`}>
                  {type.icon}
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {config.type && (
        <>
          {/* Report Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Configure Report</CardTitle>
              <CardDescription>Set up filters and parameters for your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Report Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Enter report title"
                />
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="flex gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-[240px] justify-start text-left font-normal", {
                          "text-muted-foreground": !config.dateRange.from,
                        })}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {config.dateRange.from ? format(config.dateRange.from, "PPP") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={config.dateRange.from}
                        onSelect={(date) => setConfig({ ...config, dateRange: { ...config.dateRange, from: date } })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-[240px] justify-start text-left font-normal", {
                          "text-muted-foreground": !config.dateRange.to,
                        })}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {config.dateRange.to ? format(config.dateRange.to, "PPP") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={config.dateRange.to}
                        onSelect={(date) => setConfig({ ...config, dateRange: { ...config.dateRange, to: date } })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <Label>Filters</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.type === "patient" && (
                    <div className="space-y-2">
                      <Label htmlFor="patientStatus">Patient Status</Label>
                      <Select
                        value={config.filters.patientStatus}
                        onValueChange={(value) =>
                          setConfig({ ...config, filters: { ...config.filters, patientStatus: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All patients" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="new">New (Last 30 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(config.type === "financial" || config.type === "treatment") && (
                    <div className="space-y-2">
                      <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                      <Select
                        value={config.filters.insuranceProvider}
                        onValueChange={(value) =>
                          setConfig({ ...config, filters: { ...config.filters, insuranceProvider: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All providers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delta">Delta Dental</SelectItem>
                          <SelectItem value="cigna">Cigna</SelectItem>
                          <SelectItem value="aetna">Aetna</SelectItem>
                          <SelectItem value="metlife">MetLife</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {config.type === "treatment" && (
                    <div className="space-y-2">
                      <Label htmlFor="treatmentType">Treatment Type</Label>
                      <Select
                        value={config.filters.treatmentType}
                        onValueChange={(value) =>
                          setConfig({ ...config, filters: { ...config.filters, treatmentType: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All treatments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cleaning">Cleaning</SelectItem>
                          <SelectItem value="filling">Filling</SelectItem>
                          <SelectItem value="crown">Crown</SelectItem>
                          <SelectItem value="root-canal">Root Canal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {config.type === "financial" && (
                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select
                        value={config.filters.paymentStatus}
                        onValueChange={(value) =>
                          setConfig({ ...config, filters: { ...config.filters, paymentStatus: value } })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All payments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="partial">Partially Paid</SelectItem>
                          <SelectItem value="outstanding">Outstanding</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Column Selection */}
              <div className="space-y-4">
                <Label>Include Columns</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {columnOptions[config.type as keyof typeof columnOptions]?.map((column) => (
                    <div key={column} className="flex items-center space-x-2">
                      <Checkbox
                        id={column}
                        checked={config.columns.includes(column)}
                        onCheckedChange={(checked) => handleColumnToggle(column, checked as boolean)}
                      />
                      <Label htmlFor={column} className="text-sm font-normal">
                        {column}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.columns.map((column) => (
                    <Badge key={column} variant="secondary" className="text-xs">
                      {column}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Export Format */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={config.exportFormat}
                  onValueChange={(value: "pdf" | "excel" | "csv") => setConfig({ ...config, exportFormat: value })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={generateReport}
              disabled={isGenerating || !config.title}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Report
                </>
              )}
            </Button>

            {showPreview && (
              <Button onClick={exportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export {config.exportFormat.toUpperCase()}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
