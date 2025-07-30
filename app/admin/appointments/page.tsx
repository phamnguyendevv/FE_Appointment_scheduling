"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Search, Download } from "lucide-react"
import { mockAppointments, getUserById, getServiceById } from "@/lib/mock-data"

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  useEffect(() => {
    // Load appointments with related data
    const appointmentsWithData = mockAppointments.map((apt) => ({
      ...apt,
      client: getUserById(apt.client_id),
      provider: getUserById(apt.provider_id),
      service: getServiceById(apt.service_id),
    }))
    setAppointments(
      appointmentsWithData.sort(
        (a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime(),
      ),
    )
  }, [])

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.provider?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    let matchesDate = true
    if (dateFilter === "today") {
      matchesDate = new Date(appointment.appointment_date).toDateString() === new Date().toDateString()
    } else if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      matchesDate = new Date(appointment.appointment_date) >= weekAgo
    } else if (dateFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      matchesDate = new Date(appointment.appointment_date) >= monthAgo
    }

    return matchesSearch && matchesStatus && matchesDate
  })

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

  const totalAppointments = appointments.length
  const pendingAppointments = appointments.filter((apt) => apt.status === "pending").length
  const confirmedAppointments = appointments.filter((apt) => apt.status === "confirmed").length
  const completedAppointments = appointments.filter((apt) => apt.status === "completed").length
  const cancelledAppointments = appointments.filter((apt) => apt.status === "cancelled").length

  const totalRevenue = appointments
    .filter((apt) => apt.status === "completed")
    .reduce((sum, apt) => sum + apt.commission_amount, 0)

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
              <span>→</span>
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
                {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">Client Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Email: {appointment.client?.email}</p>
              {appointment.client?.phone && <p>Phone: {appointment.client.phone}</p>}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Service Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Duration: {appointment.service?.duration} minutes</p>
              <p>Price: ${appointment.total_amount}</p>
              <p>Commission: ${appointment.commission_amount}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Appointment Info</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Booked: {new Date(appointment.created_at).toLocaleDateString()}</p>
              {appointment.notes && <p>Notes: {appointment.notes}</p>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Monitor all platform appointments</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalAppointments}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingAppointments}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{confirmedAppointments}</div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{completedAppointments}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{cancelledAppointments}</div>
            <p className="text-sm text-gray-600">Cancelled</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-sm text-gray-600">Commission</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({filteredAppointments.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingAppointments})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmedAppointments})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAppointments})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledAppointments})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {filteredAppointments
            .filter((apt) => apt.status === "pending")
            .map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </TabsContent>

        <TabsContent value="confirmed">
          {filteredAppointments
            .filter((apt) => apt.status === "confirmed")
            .map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </TabsContent>

        <TabsContent value="completed">
          {filteredAppointments
            .filter((apt) => apt.status === "completed")
            .map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </TabsContent>

        <TabsContent value="cancelled">
          {filteredAppointments
            .filter((apt) => apt.status === "cancelled")
            .map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
        </TabsContent>
      </Tabs>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
