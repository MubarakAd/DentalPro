import FileImport from "@/components/file-import"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Users, Shield } from "lucide-react"

export default function ImportPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Import</h1>
        <p className="text-gray-600">Import patient and insurance provider data from Excel or CSV files</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-blue-600" />
              Patient Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Import patient information including contact details, medical history, and emergency contacts
            </CardDescription>
            <div className="mt-3 text-sm text-gray-500">
              <strong>Required columns:</strong> first_name, last_name
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-green-600" />
              Insurance Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Import insurance provider information including contact details and addresses
            </CardDescription>
            <div className="mt-3 text-sm text-gray-500">
              <strong>Required columns:</strong> insurance_name or provider_name
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="h-5 w-5 text-purple-600" />
              File Formats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Supports Excel (.xlsx, .xls) and CSV (.csv) file formats with automatic column mapping
            </CardDescription>
            <div className="mt-3 text-sm text-gray-500">
              <strong>Max file size:</strong> 10MB
            </div>
          </CardContent>
        </Card>
      </div>

      <FileImport />
    </div>
  )
}
