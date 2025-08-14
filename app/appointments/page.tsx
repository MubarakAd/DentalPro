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
import { Calendar, Plus, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

interface Appointment {
  id: string
  patient_id: string
  appointment_date: string
  appointment_time: string
  procedure_type: string
  status: "scheduled" | "completed" | "cancelled" | "no-show"
  notes: string | null
  created_at: string
  patients: {
    first_name: string
    last_name: string
    phone: string | null
  }
}

interface Patient {
  id: string
  first_name: string
  last_name: string
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [newAppointment, setNewAppointment] = useState({
    patient_id: "",
    appointment_date: new Date().toISOString().split("T")[0],
    appointment_time: "",
    procedure_type: "",
    notes: "",
  })

  useEffect(() => {
    fetchAppointments()
    fetchPatients()
  }, [selectedDate])

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients (
            first_name,
            last_name,
            phone
          )
        `)
        .eq("appointment_date", selectedDate)
        .order("appointment_time", { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
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

  const addAppointment = async () => {
    try {
      const { error } = await supabase.from("appointments").insert([
        {
          ...newAppointment,
          status: "scheduled",
        },
      ])
      if (error) throw error

      setIsAddDialogOpen(false)
      setNewAppointment({
        patient_id: "",
        appointment_date: new Date().toISOString().split("T")[0],
        appointment_time: "",
        procedure_type: "",
        notes: "",
      })
      fetchAppointments()
    } catch (error) {
      console.error("Error adding appointment:", error)
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase.from("appointments").update({ status }).eq("id", appointmentId)

      if (error) throw error
      fetchAppointments()
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "no-show":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading appointments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-500">Manage your appointment schedule</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
              <DialogDescription>Book an appointment for a patient.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select
                  value={newAppointment.patient_id}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, patient_id: value })}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.appointment_date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.appointment_time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="procedure">Procedure Type</Label>
                <Select
                  value={newAppointment.procedure_type}
                  onValueChange={(value) => setNewAppointment({ ...newAppointment, procedure_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select procedure type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="filling">Filling</SelectItem>
                    <SelectItem value="crown">Crown</SelectItem>
                    <SelectItem value="root-canal">Root Canal</SelectItem>
                    <SelectItem value="extraction">Extraction</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addAppointment} className="bg-violet-600 hover:bg-violet-700">
                Schedule Appointment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Schedule
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-auto"
              />
              <span>{appointments.length} appointments</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-violet-600">
                          {new Date(`2000-01-01T${appointment.appointment_time}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">
                            {appointment.patients.first_name} {appointment.patients.last_name}
                          </span>
                          {appointment.patients.phone && (
                            <span className="text-sm text-gray-500">• {appointment.patients.phone}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span className="capitalize">{appointment.procedure_type.replace("-", " ")}</span>
                        </div>

                        {appointment.notes && <p className="text-sm text-gray-500 mt-1">{appointment.notes}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(appointment.status)}
                          <span className="capitalize">{appointment.status.replace("-", " ")}</span>
                        </div>
                      </Badge>

                      {appointment.status === "scheduled" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            className="text-green-600 hover:text-green-700"
                          >
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            className="text-red-600 hover:text-red-700"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {appointments.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
              <p className="text-gray-500">
                Schedule your first appointment for {new Date(selectedDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
