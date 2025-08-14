"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import * as XLSX from "xlsx"
import { supabase } from "@/lib/supabase/client"

interface ImportResult {
  success: number
  errors: Array<{ row: number; message: string }>
  total: number
}

interface FileImportProps {
  onImportComplete?: (result: ImportResult) => void
}

export default function FileImport({ onImportComplete }: FileImportProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [fullData, setFullData] = useState<any[]>([])
  const [importType, setImportType] = useState<"patients" | "insurance" | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setUploading(true)
    setProgress(0)
    setResult(null)

    try {
      const data = await parseFile(file)
      setFullData(data)
      setPreviewData(data.slice(0, 5)) // Show first 5 rows for preview

      // Auto-detect import type based on columns
      const columns = Object.keys(data[0] || {}).map((col) => col.toLowerCase())
      if (columns.includes("first_name") || columns.includes("last_name") || columns.includes("patient_name")) {
        setImportType("patients")
      } else if (columns.includes("insurance_name") || columns.includes("provider_name")) {
        setImportType("insurance")
      }
    } catch (error) {
      setResult({
        success: 0,
        errors: [{ row: 0, message: `Failed to parse file: ${error}` }],
        total: 0,
      })
    } finally {
      setUploading(false)
    }
  }, [])

  const parseFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const data = e.target?.result
          let jsonData: any[] = []

          if (file.name.endsWith(".csv")) {
            // Parse CSV
            const text = data as string
            const lines = text.split("\n")
            const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

            jsonData = lines
              .slice(1)
              .filter((line) => line.trim())
              .map((line) => {
                const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
                const obj: any = {}
                headers.forEach((header, index) => {
                  obj[header] = values[index] || ""
                })
                return obj
              })
          } else {
            // Parse Excel
            const workbook = XLSX.read(data, { type: "binary" })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            jsonData = XLSX.utils.sheet_to_json(worksheet)
          }

          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file)
      } else {
        reader.readAsBinaryString(file)
      }
    })
  }

  const processImport = async () => {
    if (!fullData.length || !importType) return

    setUploading(true)
    setProgress(0)

    const errors: Array<{ row: number; message: string }> = []
    let successCount = 0

    for (let i = 0; i < fullData.length; i++) {
      const row = fullData[i]
      setProgress((i / fullData.length) * 100)

      try {
        if (importType === "patients") {
          await importPatient(row, i + 1)
        } else if (importType === "insurance") {
          await importInsurance(row, i + 1)
        }
        successCount++
      } catch (error) {
        errors.push({
          row: i + 1,
          message: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    const finalResult = {
      success: successCount,
      errors,
      total: fullData.length, // Use fullData length
    }

    setResult(finalResult)
    setProgress(100)
    setUploading(false)
    onImportComplete?.(finalResult)
  }

  const importPatient = async (row: any, rowNumber: number) => {
    // Map common column variations
    const firstName = row.first_name || row.firstName || row["First Name"] || ""
    const lastName = row.last_name || row.lastName || row["Last Name"] || ""

    if (!firstName || !lastName) {
      throw new Error("First name and last name are required")
    }

    const patientData = {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: row.date_of_birth || row.dob || row["Date of Birth"] || null,
      phone: row.phone || row.phone_number || row["Phone Number"] || null,
      email: row.email || row["Email Address"] || null,
      address: row.address || row["Address"] || null,
      emergency_contact_name: row.emergency_contact_name || row["Emergency Contact"] || null,
      emergency_contact_phone: row.emergency_contact_phone || row["Emergency Phone"] || null,
      medical_history: row.medical_history || row["Medical History"] || null,
      allergies: row.allergies || row["Allergies"] || null,
    }

    const { error } = await supabase.from("patients").insert([patientData])
    if (error) throw error
  }

  const importInsurance = async (row: any, rowNumber: number) => {
    const name = row.insurance_name || row.provider_name || row.name || row["Insurance Name"] || ""

    if (!name) {
      throw new Error("Insurance provider name is required")
    }

    const insuranceData = {
      name,
      contact_phone: row.contact_phone || row.phone || row["Contact Phone"] || null,
      contact_email: row.contact_email || row.email || row["Contact Email"] || null,
      address: row.address || row["Address"] || null,
    }

    const { error } = await supabase.from("insurance_providers").insert([insuranceData])
    if (error) throw error
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Upload Excel (.xlsx, .xls) or CSV files to import patient or insurance provider data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag & drop a file here, or click to select</p>
                <p className="text-sm text-gray-500">Supports .xlsx, .xls, and .csv files</p>
              </div>
            )}
          </div>

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Processing...</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {previewData.length > 0 && !result && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">Preview Data</h3>
                  <p className="text-sm text-gray-500">
                    Showing first 5 rows of {fullData.length} total records • Detected type:{" "}
                    <Badge variant={importType === "patients" ? "default" : "secondary"}>
                      {importType === "patients" ? "Patients" : "Insurance Providers"}
                    </Badge>
                  </p>
                </div>
                <Button onClick={processImport} disabled={uploading}>
                  Import {fullData.length} Records
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(previewData[0] || {}).map((key) => (
                          <th key={key} className="px-4 py-2 text-left font-medium">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="px-4 py-2">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 space-y-4">
              <Alert
                className={
                  result.errors.length === 0 ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"
                }
              >
                <div className="flex items-center gap-2">
                  {result.errors.length === 0 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <AlertDescription>
                    Import completed: {result.success} successful, {result.errors.length} errors out of {result.total}{" "}
                    total records
                  </AlertDescription>
                </div>
              </Alert>

              {result.errors.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Import Errors
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600">
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => {
                  setResult(null)
                  setPreviewData([])
                  setFullData([])
                  setImportType(null)
                }}
                variant="outline"
              >
                Import Another File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
