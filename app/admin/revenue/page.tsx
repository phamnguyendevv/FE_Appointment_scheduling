"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Calendar, Users, Download } from "lucide-react"
import { mockAppointments, getUserById, getServiceById } from "@/lib/mock-data"

export default function AdminRevenuePage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  useEffect(() => {
    // Load appointments with related data
    const appointmentsWithData = mockAppointments.map((apt) => ({
      ...apt,
      client: getUserById(apt.client_id),
      provider: getUserById(apt.provider_id),
      service: getServiceById(apt.service_id),
    }))
    setAppointments(appointmentsWithData)
  }, [])

  const completedAppointments = appointments.filter((apt) => apt.status === "completed")
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.total_amount, 0)
  const platformCommission = completedAppointments.reduce((sum, apt) => sum + apt.commission_amount, 0)
  const providerEarnings = totalRevenue - platformCommission

  // Revenue by provider
  const revenueByProvider = completedAppointments.reduce(
    (acc, apt) => {
      const providerName = apt.provider?.full_name || "Unknown Provider"
      if (!acc[providerName]) {
        acc[providerName] = {
          count: 0,
          totalRevenue: 0,
          commission: 0,
          earnings: 0,
          provider: apt.provider,
        }
      }
      acc[providerName].count += 1
      acc[providerName].totalRevenue += apt.total_amount
      acc[providerName].commission += apt.commission_amount
      acc[providerName].earnings += apt.total_amount - apt.commission_amount
      return acc
    },
    {} as Record<string, { count: number; totalRevenue: number; commission: number; earnings: number; provider: any }>,
  )

  // Revenue by service category
  const revenueByCategory = completedAppointments.reduce(
    (acc, apt) => {
      const categoryName = apt.service?.category?.name || "Unknown Category"
      if (!acc[categoryName]) {
        acc[categoryName] = { count: 0, revenue: 0, commission: 0 }
      }
      acc[categoryName].count += 1
      acc[categoryName].revenue += apt.total_amount
      acc[categoryName].commission += apt.commission_amount
      return acc
    },
    {} as Record<string, { count: number; revenue: number; commission: number }>,
  )

  // Revenue by month
  const revenueByMonth = completedAppointments.reduce(
    (acc, apt) => {
      const month = new Date(apt.appointment_date).toLocaleDateString("en-US", { year: "numeric", month: "long" })
      if (!acc[month]) {
        acc[month] = { count: 0, revenue: 0, commission: 0 }
      }
      acc[month].count += 1
      acc[month].revenue += apt.total_amount
      acc[month].commission += apt.commission_amount
      return acc
    },
    {} as Record<string, { count: number; revenue: number; commission: number }>,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
          <p className="text-gray-600">Monitor platform financial performance</p>
        </div>
        <div className="flex space-x-2">
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
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Commission</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${platformCommission.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider Earnings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${providerEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments.length}</div>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Provider */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Provider</CardTitle>
            <CardDescription>Top performing service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueByProvider)
                .sort(([, a], [, b]) => b.commission - a.commission)
                .slice(0, 10)
                .map(([providerName, data]) => (
                  <div key={providerName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">{providerName.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{providerName}</p>
                        <p className="text-sm text-gray-500">{data.count} appointments</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${data.commission.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Total: ${data.totalRevenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Performance breakdown by service category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(revenueByCategory)
                .sort(([, a], [, b]) => b.commission - a.commission)
                .map(([categoryName, data]) => (
                  <div key={categoryName} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{categoryName}</p>
                      <p className="text-sm text-gray-500">{data.count} appointments</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${data.commission.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Total: ${data.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Revenue Trend</CardTitle>
          <CardDescription>Revenue and commission trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(revenueByMonth)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([month, data]) => (
                <div key={month} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{month}</p>
                    <p className="text-sm text-gray-500">{data.count} appointments completed</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${data.commission.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Total Revenue: ${data.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent High-Value Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent High-Value Transactions</CardTitle>
          <CardDescription>Latest completed appointments with highest commission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedAppointments
              .sort((a, b) => b.commission_amount - a.commission_amount)
              .slice(0, 10)
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.service?.name}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.client?.full_name} → {appointment.provider?.full_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(appointment.appointment_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+${appointment.commission_amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Total: ${appointment.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
