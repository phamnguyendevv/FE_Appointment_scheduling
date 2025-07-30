"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { mockUsers, mockAppointments } from "@/lib/mock-data"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    monthlyGrowth: 12.5,
  })

  useEffect(() => {
    const completedAppointments = mockAppointments.filter((apt) => apt.status === "completed")
    const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.commission_amount, 0)

    setStats({
      totalUsers: mockUsers.length,
      totalAppointments: mockAppointments.length,
      totalRevenue,
      monthlyGrowth: 12.5,
    })
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your platform performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New provider registered</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment completed</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment processed</p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50">
                <div className="font-medium">Approve Pending Providers</div>
                <div className="text-sm text-gray-500">Review and approve new provider applications</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50">
                <div className="font-medium">Generate Monthly Report</div>
                <div className="text-sm text-gray-500">Create comprehensive platform analytics</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border hover:bg-gray-50">
                <div className="font-medium">Manage Categories</div>
                <div className="text-sm text-gray-500">Add or edit service categories</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
