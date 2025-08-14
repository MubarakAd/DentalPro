"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Plus, Search, User, Calendar, DollarSign, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Treatment {
  id: string
  patient_id: string
  procedure_name: string
  treatment_date: string
  cost: number | null
  status: "planned" | "in-progress" | "completed"
  notes: string | null
  created_at: string
  patients: {
    first_name: string
    last_name: string
  }
}

interface Patient {
  id: string
  first_name: string
  last_name: string
}

export default function TreatmentsPage() {
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTreatment, setNewTreatment] = useState({
    patient_id: "",
    procedure_name: "",
    treatment_date: new Date().toISOString().split("T")[0],
    cost: "",
    notes: "",
  })

  useEffect(() => {
    fetchTreatments()
    fetchPatients()
  }, [])

  const fetchTreatments = async () => {
    try {
      const { data, error } = await supabase
        .from("treatments")
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .order("treatment_date", { ascending: false })

      if (error) throw error
      setTreatments(data || [])
    } catch (error) {
      console.error("Error fetching treatments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .order("first_name", { ascending: true })

      if (error) throw error
      setPatients(data || [])
    } catch (error) {
      console.error("Error fetching patients:", error)
    }
  }

  const addTreatment = async () => {
    try {
      const { error } = await supabase.from("treatments").insert([
        {
          ...newTreatment,
          cost: newTreatment.cost ? Number.parseFloat(newTreatment.cost) : null,
          status: "planned",
        },
      ])
      if (error) throw error

      setIsAddDialogOpen(false)
      setNewTreatment({
        patient_id: "",
        procedure_name: "",
        treatment_date: new Date().toISOString().split("T")[0],
        cost: "",
        notes: "",
      })
      fetchTreatments()
    } catch (error) {
      console.error("Error adding treatment:", error)
    }
  }

  const updateTreatmentStatus = async (treatmentId: string, status: string) => {
    try {
      const { error } = await supabase.from("treatments").update({ status }).eq("id", treatmentId)

      if (error) throw error
      fetchTreatments()
    } catch (error) {
      console.error("Error updating treatment:", error)
    }
  }

  const filteredTreatments = treatments.filter((treatment) => {
    const matchesSearch =
      treatment.patients.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.patients.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.procedure_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || treatment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = treatments
    .filter((t) => t.status === "completed" && t.cost)
    .reduce((sum, t) => sum + (t.cost || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading treatments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Treatments</h1>
          <p className="text-gray-500">Manage patient treatments and procedures</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Treatment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Treatment</DialogTitle>
              <DialogDescription>Record a new treatment or procedure.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select
                  value={newTreatment.patient_id}
                  onValueChange={(value) => setNewTreatment({ ...newTreatment, patient_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="procedure_name">Treatment Type</Label>
                <Select
                  value={newTreatment.procedure_name}
                  onValueChange={(value) => setNewTreatment({ ...newTreatment, procedure_name: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select treatment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="filling">Filling</SelectItem>
                    <SelectItem value="crown">Crown</SelectItem>
                    <SelectItem value="root-canal">Root Canal</SelectItem>
                    <SelectItem value="extraction">Extraction</SelectItem>
                    <SelectItem value="implant">Implant</SelectItem>
                    <SelectItem value="whitening">Whitening</SelectItem>
                    <SelectItem value="orthodontics">Orthodontics</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="treatment_date">Treatment Date</Label>
                  <Input
                    id="treatment_date"
                    type="date"
                    value={newTreatment.treatment_date}
                    onChange={(e) => setNewTreatment({ ...newTreatment, treatment_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="cost">Cost ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={newTreatment.cost}
                    onChange={(e) => setNewTreatment({ ...newTreatment, cost: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newTreatment.notes}
                  onChange={(e) => setNewTreatment({ ...newTreatment, notes: e.target.value })}
                  placeholder="Treatment notes and details..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addTreatment} className="bg-violet-600 hover:bg-violet-700">
                Add Treatment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-600" />
              <div>
                <p className="text-sm text-gray-500">Total Treatments</p>
                <p className="text-2xl font-bold">{treatments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">{treatments.filter((t) => t.status === "in-progress").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold">{treatments.filter((t) => t.status === "completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Treatment Records
          </CardTitle>
          <CardDescription>{filteredTreatments.length} treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search treatments by patient or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredTreatments.map((treatment) => (
              <Card key={treatment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {treatment.patients.first_name} {treatment.patients.last_name}
                          </span>
                        </div>
                        <Badge className={getStatusColor(treatment.status)}>{treatment.status.replace("-", " ")}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="capitalize">{treatment.procedure_name.replace("-", " ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(treatment.treatment_date).toLocaleDateString()}
                        </div>
                        {treatment.cost && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />${treatment.cost.toLocaleString()}
                          </div>
                        )}
                      </div>

                      {treatment.notes && <p className="text-sm text-gray-500 mt-2">{treatment.notes}</p>}
                    </div>

                    <div className="flex gap-2">
                      {treatment.status === "planned" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTreatmentStatus(treatment.id, "in-progress")}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Start
                        </Button>
                      )}
                      {treatment.status === "in-progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateTreatmentStatus(treatment.id, "completed")}
                          className="text-green-600 hover:text-green-700"
                        >
                          Complete
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTreatments.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No treatments found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first treatment record to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
