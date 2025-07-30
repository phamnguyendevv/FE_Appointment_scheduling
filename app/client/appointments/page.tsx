"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Star } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByClient, getUserById, getServiceById } from "@/lib/mock-data"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const userAppointments = getAppointmentsByClient(currentUser.id)
        const appointmentsWithData = userAppointments
          .map((apt) => ({
            ...apt,
            service: getServiceById(apt.service_id),
            provider: getUserById(apt.provider_id),
          }))
          .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())

        setAppointments(appointmentsWithData)
      }
      setLoading(false)
    }

    fetchAppointments()
  }, [])

  const upcomingAppointments = appointments.filter(
    (apt) => ["pending", "confirmed"].includes(apt.status) && new Date(apt.appointment_date) > new Date(),
  )

  const pastAppointments = appointments.filter(
    (apt) => apt.status === "completed" || apt.status === "cancelled" || new Date(apt.appointment_date) < new Date(),
  )

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600">Manage your scheduled appointments</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
          <TabsTrigger value="all">All ({appointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
              <p className="text-gray-500 mb-4">Book a new service to get started</p>
              <Button>Find Services</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} showReview />
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {appointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AppointmentCard({ appointment, showReview = false }: { appointment: any; showReview?: boolean }) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{appointment.service?.name}</CardTitle>
            <CardDescription className="flex items-center space-x-4 mt-2">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {appointment.provider?.full_name}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(appointment.appointment_date).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(appointment.appointment_date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Duration: {appointment.service?.duration} minutes</p>
            <p className="text-lg font-semibold">${appointment.total_amount}</p>
            {appointment.notes && <p className="text-sm text-gray-500 mt-2">Notes: {appointment.notes}</p>}
          </div>
          <div className="flex space-x-2">
            {appointment.status === "pending" && (
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            )}
            {appointment.status === "confirmed" && (
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
            )}
            {showReview && appointment.status === "completed" && (
              <Button size="sm">
                <Star className="h-4 w-4 mr-1" />
                Review
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
