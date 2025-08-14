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
import { Textarea } from "@/components/ui/textarea"
import { Users, Plus, Search, Phone, Mail, Calendar, FileText } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Patient {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  phone: string | null
  email: string | null
  address: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_history: string | null
  allergies: string | null
  created_at: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newPatient, setNewPatient] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    medical_history: "",
    allergies: "",
  })
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    appointment_date: "",
    appointment_time: "",
    procedure_type: "",
    notes: "",
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase.from("patients").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPatients(data || [])
    } catch (error) {
      console.error("Error fetching patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const addPatient = async () => {
    try {
      const { error } = await supabase.from("patients").insert([newPatient])
      if (error) throw error

      setIsAddDialogOpen(false)
      setNewPatient({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        phone: "",
        email: "",
        address: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        medical_history: "",
        allergies: "",
      })
      fetchPatients()
    } catch (error) {
      console.error("Error adding patient:", error)
    }
  }

  const scheduleAppointment = async () => {
    if (!selectedPatient) return

    try {
      const appointmentDateTime = `${newAppointment.appointment_date}T${newAppointment.appointment_time}:00`

      const { error } = await supabase.from("appointments").insert([
        {
          patient_id: selectedPatient.id,
          appointment_time: appointmentDateTime,
          procedure_type: newAppointment.procedure_type,
          status: "scheduled",
          notes: newAppointment.notes,
        },
      ])

      if (error) throw error

      setIsScheduleDialogOpen(false)
      setNewAppointment({
        appointment_date: "",
        appointment_time: "",
        procedure_type: "",
        notes: "",
      })
      alert("Appointment scheduled successfully!")
    } catch (error) {
      console.error("Error scheduling appointment:", error)
      alert("Error scheduling appointment")
    }
  }

  const filteredPatients = patients.filter(
    (patient) =>
      patient.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-500">Manage your patient records</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
              <DialogDescription>Enter the patient's information below.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={newPatient.first_name}
                  onChange={(e) => setNewPatient({ ...newPatient, first_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={newPatient.last_name}
                  onChange={(e) => setNewPatient({ ...newPatient, last_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={newPatient.date_of_birth}
                  onChange={(e) => setNewPatient({ ...newPatient, date_of_birth: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact_name">Emergency Contact</Label>
                <Input
                  id="emergency_contact_name"
                  value={newPatient.emergency_contact_name}
                  onChange={(e) => setNewPatient({ ...newPatient, emergency_contact_name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="medical_history">Medical History</Label>
                <Textarea
                  id="medical_history"
                  value={newPatient.medical_history}
                  onChange={(e) => setNewPatient({ ...newPatient, medical_history: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addPatient} className="bg-violet-600 hover:bg-violet-700">
                Add Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Records
          </CardTitle>
          <CardDescription>{patients.length} total patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        {patient.date_of_birth && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(patient.date_of_birth).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        {patient.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {patient.phone}
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {patient.email}
                          </div>
                        )}
                        {patient.emergency_contact_name && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Emergency: {patient.emergency_contact_name}
                          </div>
                        )}
                        {(patient.medical_history || patient.allergies) && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Medical notes available
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient)
                          setIsDetailsDialogOpen(true)
                        }}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient)
                          setIsScheduleDialogOpen(true)
                        }}
                      >
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "Add your first patient to get started"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedPatient?.first_name} {selectedPatient?.last_name}
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <p className="text-sm text-gray-900">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                  <p className="text-sm text-gray-900">
                    {selectedPatient.date_of_birth
                      ? new Date(selectedPatient.date_of_birth).toLocaleDateString()
                      : "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-sm text-gray-900">{selectedPatient.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{selectedPatient.email || "Not provided"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                <p className="text-sm text-gray-900">{selectedPatient.address || "Not provided"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Emergency Contact</Label>
                  <p className="text-sm text-gray-900">{selectedPatient.emergency_contact_name || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Emergency Phone</Label>
                  <p className="text-sm text-gray-900">{selectedPatient.emergency_contact_phone || "Not provided"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Medical History</Label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                  {selectedPatient.medical_history || "No medical history recorded"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Allergies</Label>
                <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-md">
                  {selectedPatient.allergies || "No allergies recorded"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Patient Since</Label>
                <p className="text-sm text-gray-900">{new Date(selectedPatient.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Schedule an appointment for {selectedPatient?.first_name} {selectedPatient?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="appointment_date">Date</Label>
              <Input
                id="appointment_date"
                type="date"
                value={newAppointment.appointment_date}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="appointment_time">Time</Label>
              <Input
                id="appointment_time"
                type="time"
                value={newAppointment.appointment_time}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="procedure_type">Procedure Type</Label>
              <Input
                id="procedure_type"
                placeholder="e.g., Cleaning, Filling, Consultation"
                value={newAppointment.procedure_type}
                onChange={(e) => setNewAppointment({ ...newAppointment, procedure_type: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes for the appointment"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={scheduleAppointment}
              className="bg-violet-600 hover:bg-violet-700"
              disabled={
                !newAppointment.appointment_date || !newAppointment.appointment_time || !newAppointment.procedure_type
              }
            >
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
