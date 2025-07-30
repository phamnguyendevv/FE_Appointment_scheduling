"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, TrendingUp, Calendar } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByProvider, getUserById, getServiceById } from "@/lib/mock-data"

export default function RevenueePage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("month")

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
        setAppointments(providerAppointments)
      }
    }
    loadData()
  }, [])

  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + (apt.total_amount - apt.commission_amount), 0)
  const totalCommission = completedAppointments.reduce((sum, apt) => sum + apt.commission_amount, 0)
  const totalGross = completedAppointments.reduce((sum, apt) => sum + apt.total_amount, 0)

  // Group revenue by service
  const revenueByService = completedAppointments.reduce(
    (acc, apt) => {
      const serviceName = apt.service?.name || "Unknown Service"
      if (!acc[serviceName]) {
        acc[serviceName] = { count: 0, revenue: 0, gross: 0 }
      }
      acc[serviceName].count += 1
      acc[serviceName].revenue += apt.total_amount - apt.commission_amount
      acc[serviceName].gross += apt.total_amount
      return acc
    },
    {} as Record<string, { count: number; revenue: number; gross: number }>,
  )

  // Group revenue by month
  const revenueByMonth = completedAppointments.reduce(
    (acc, apt) => {
      const month = new Date(apt.appointment_date).toLocaleDateString("en-US", { year: "numeric", month: "long" })
      if (!acc[month]) {
        acc[month] = { count: 0, revenue: 0, gross: 0 }
      }
      acc[month].count += 1
      acc[month].revenue += apt.total_amount - apt.commission_amount
      acc[month].gross += apt.total_amount
      return acc
    },
    {} as Record<string, { count: number; revenue: number; gross: number }>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue</h1>
          <p className="text-gray-600">Track your earnings and financial performance</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After platform commission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGross.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Before commission</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalCommission.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Platform fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Total completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
            <CardDescription>Performance breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueByService).map(([service, data]) => (
                <div key={service} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{service}</p>
                    <p className="text-sm text-gray-500">{data.count} appointments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${data.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Gross: ${data.gross.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueByMonth).map(([month, data]) => (
                <div key={month} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{month}</p>
                    <p className="text-sm text-gray-500">{data.count} appointments</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${data.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Gross: ${data.gross.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest completed appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedAppointments.slice(0, 10).map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{appointment.service?.name}</p>
                  <p className="text-sm text-gray-500">
                    {appointment.client?.full_name} • {new Date(appointment.appointment_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    +${(appointment.total_amount - appointment.commission_amount).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Commission: ${appointment.commission_amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
