"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Phone, Mail, CheckCircle, XCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByProvider, getUserById, getServiceById } from "@/lib/mock-data"

export default function ProviderAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const providerAppointments = getAppointmentsByProvider(currentUser.id).map((apt) => ({
          ...apt,
          client: getUserById(apt.client_id),
          service: getServiceById(apt.service_id),
        }))
        setAppointments(
          providerAppointments.sort(
            (a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime(),
          ),
        )
      }
    }
    loadData()
  }, [])

  const updateAppointmentStatus = (appointmentId: string, newStatus: string) => {
    setAppointments(appointments.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt)))
  }

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending")
  const confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed")
  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const AppointmentCard = ({ appointment }: { appointment: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{appointment.service?.name}</CardTitle>
            <CardDescription className="flex items-center space-x-4 mt-2">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {appointment.client?.full_name}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(appointment.appointment_date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Client Information</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                {appointment.client?.email}
              </div>
              {appointment.client?.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {appointment.client.phone}
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Appointment Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Duration: {appointment.service?.duration} minutes</p>
              <p>Amount: ${appointment.total_amount}</p>
              {appointment.notes && <p>Notes: {appointment.notes}</p>}
            </div>
          </div>
        </div>

        {appointment.status === "pending" && (
          <div className="flex space-x-2 mt-4">
            <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}>
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm
            </Button>
            <Button variant="outline" size="sm" onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}>
              <XCircle className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        )}

        {appointment.status === "confirmed" && new Date(appointment.appointment_date) < new Date() && (
          <div className="flex space-x-2 mt-4">
            <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, "completed")}>
              Mark as Completed
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <p className="text-gray-600">Manage your client appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingAppointments.length}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{confirmedAppointments.length}</div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{completedAppointments.length}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{cancelledAppointments.length}</div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingAppointments.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedAppointments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAppointments.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingAppointments.length > 0 ? (
            pendingAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending appointments</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed">
          {confirmedAppointments.length > 0 ? (
            confirmedAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No confirmed appointments</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedAppointments.length > 0 ? (
            completedAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No completed appointments</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledAppointments.length > 0 ? (
            cancelledAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No cancelled appointments</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
