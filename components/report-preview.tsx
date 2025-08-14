"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ReportPreviewProps {
  config: {
    type: string
    title: string
    dateRange: {
      from: Date | undefined
      to: Date | undefined
    }
    columns: string[]
  }
}

// Mock data for preview
const mockData = {
  financial: [
    {
      "Patient Name": "Sarah Johnson",
      "Treatment Date": "2024-01-15",
      Procedure: "Routine Cleaning",
      "Total Cost": "$150.00",
      "Insurance Covered": "$120.00",
      "Patient Paid": "$30.00",
      "Outstanding Balance": "$0.00",
      "Payment Status": "Paid",
    },
    {
      "Patient Name": "Michael Chen",
      "Treatment Date": "2024-01-16",
      Procedure: "Crown Preparation",
      "Total Cost": "$1,200.00",
      "Insurance Covered": "$800.00",
      "Patient Paid": "$200.00",
      "Outstanding Balance": "$200.00",
      "Payment Status": "Partial",
    },
    {
      "Patient Name": "Emma Wilson",
      "Treatment Date": "2024-01-17",
      Procedure: "Filling",
      "Total Cost": "$300.00",
      "Insurance Covered": "$240.00",
      "Patient Paid": "$60.00",
      "Outstanding Balance": "$0.00",
      "Payment Status": "Paid",
    },
  ],
  patient: [
    {
      "Patient ID": "P001",
      "Full Name": "Sarah Johnson",
      "Date of Birth": "1985-03-15",
      Phone: "(555) 123-4567",
      Email: "sarah.j@email.com",
      Address: "123 Main St, City, ST 12345",
      "Emergency Contact": "John Johnson - (555) 987-6543",
      "Registration Date": "2023-01-10",
      "Last Visit": "2024-01-15",
    },
    {
      "Patient ID": "P002",
      "Full Name": "Michael Chen",
      "Date of Birth": "1978-07-22",
      Phone: "(555) 234-5678",
      Email: "m.chen@email.com",
      Address: "456 Oak Ave, City, ST 12345",
      "Emergency Contact": "Lisa Chen - (555) 876-5432",
      "Registration Date": "2023-02-05",
      "Last Visit": "2024-01-16",
    },
  ],
  appointment: [
    {
      Date: "2024-01-15",
      Time: "09:00 AM",
      "Patient Name": "Sarah Johnson",
      "Procedure Type": "Cleaning",
      Duration: "60 min",
      Status: "Completed",
      Provider: "Dr. Smith",
      Notes: "Routine cleaning completed",
    },
    {
      Date: "2024-01-16",
      Time: "10:30 AM",
      "Patient Name": "Michael Chen",
      "Procedure Type": "Crown Prep",
      Duration: "90 min",
      Status: "Completed",
      Provider: "Dr. Johnson",
      Notes: "Crown preparation successful",
    },
  ],
  treatment: [
    {
      "Treatment Date": "2024-01-15",
      "Patient Name": "Sarah Johnson",
      "Procedure Code": "D1110",
      "Procedure Name": "Adult Prophylaxis",
      "Tooth Number": "N/A",
      Cost: "$150.00",
      Status: "Completed",
      Provider: "Dr. Smith",
    },
    {
      "Treatment Date": "2024-01-16",
      "Patient Name": "Michael Chen",
      "Procedure Code": "D2740",
      "Procedure Name": "Crown - Porcelain",
      "Tooth Number": "#14",
      Cost: "$1,200.00",
      Status: "In Progress",
      Provider: "Dr. Johnson",
    },
  ],
}

export default function ReportPreview({ config }: ReportPreviewProps) {
  const data = mockData[config.type as keyof typeof mockData] || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Report Preview</CardTitle>
        <CardDescription>Preview of your generated report</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Report Header */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{config.title}</h2>
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {config.dateRange.from && (
              <Badge variant="outline">From: {config.dateRange.from.toLocaleDateString()}</Badge>
            )}
            {config.dateRange.to && <Badge variant="outline">To: {config.dateRange.to.toLocaleDateString()}</Badge>}
            <Badge variant="outline">Records: {data.length}</Badge>
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Report Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                {config.columns.map((column) => (
                  <th key={column} className="px-4 py-3 text-left font-medium text-gray-900">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 5).map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  {config.columns.map((column) => (
                    <td key={column} className="px-4 py-3 text-gray-700">
                      {row[column as keyof typeof row] || "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length > 5 && (
          <div className="mt-4 text-center text-sm text-gray-500">Showing 5 of {data.length} records in preview</div>
        )}
      </CardContent>
    </Card>
  )
}
