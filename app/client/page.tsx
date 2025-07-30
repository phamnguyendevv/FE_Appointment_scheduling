"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Heart, Search, Star } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByClient, getFavoritesByClient, getUserById, getServiceById } from "@/lib/mock-data"

export default function ClientDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    favoriteServices: 0,
    completedAppointments: 0,
  })
  const [user, setUser] = useState<any>(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const appointments = getAppointmentsByClient(currentUser.id)
        const favorites = getFavoritesByClient(currentUser.id)
        const completedAppointments = appointments.filter((apt) => apt.status === "completed")

        // Get upcoming appointments with related data
        const upcoming = appointments
          .filter((apt) => ["pending", "confirmed"].includes(apt.status) && new Date(apt.appointment_date) > new Date())
          .map((apt) => ({
            ...apt,
            service: getServiceById(apt.service_id),
            provider: getUserById(apt.provider_id),
          }))
          .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
          .slice(0, 5)

        setStats({
          totalAppointments: appointments.length,
          favoriteServices: favorites.length,
          completedAppointments: completedAppointments.length,
        })

        setUpcomingAppointments(upcoming)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Services</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteServices}</div>
            <p className="text-xs text-muted-foreground">Services you love</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">Finished appointments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your next scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.service?.name}</p>
                      <p className="text-sm text-gray-500">with {appointment.provider?.full_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(appointment.appointment_date).toLocaleDateString()} at{" "}
                        {new Date(appointment.appointment_date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${appointment.total_amount}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No upcoming appointments</p>
                <Button asChild>
                  <Link href="/client/search">Find Services</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>What would you like to do?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/client/search">
                  <Search className="mr-2 h-4 w-4" />
                  Find New Services
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/client/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  View All Appointments
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/client/favorites">
                  <Heart className="mr-2 h-4 w-4" />
                  My Favorites
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/client/reviews">
                  <Star className="mr-2 h-4 w-4" />
                  My Reviews
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
