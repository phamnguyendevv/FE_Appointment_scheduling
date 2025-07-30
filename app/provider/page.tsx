"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, DollarSign, Users, Star } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByProvider, getReviewsByProvider, getUserById, getServiceById } from "@/lib/mock-data"

export default function ProviderDashboard() {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalRevenue: 0,
    totalClients: 0,
    averageRating: 0,
  })
  const [user, setUser] = useState<any>(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [recentReviews, setRecentReviews] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const appointments = getAppointmentsByProvider(currentUser.id)
        const reviews = getReviewsByProvider(currentUser.id)

        const completedAppointments = appointments.filter((apt) => apt.status === "completed")
        const totalRevenue = completedAppointments.reduce(
          (sum, apt) => sum + (apt.total_amount - apt.commission_amount),
          0,
        )

        const uniqueClients = new Set(appointments.map((apt) => apt.client_id))
        const averageRating =
          reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

        // Get upcoming appointments with client data
        const upcoming = appointments
          .filter((apt) => ["pending", "confirmed"].includes(apt.status) && new Date(apt.appointment_date) > new Date())
          .map((apt) => ({
            ...apt,
            service: getServiceById(apt.service_id),
            client: getUserById(apt.client_id),
          }))
          .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
          .slice(0, 5)

        // Get recent reviews with client data
        const recentReviewsWithData = reviews
          .map((review) => ({
            ...review,
            client: getUserById(review.client_id),
          }))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)

        setStats({
          totalAppointments: appointments.length,
          totalRevenue,
          totalClients: uniqueClients.size,
          averageRating,
        })

        setUpcomingAppointments(upcoming)
        setRecentReviews(recentReviewsWithData)
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.full_name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">+0.2 from last month</p>
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
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.service?.name}</p>
                      <p className="text-sm text-gray-500">with {appointment.client?.full_name}</p>
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
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
            <CardDescription>What clients are saying about your services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">by {review.client?.full_name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No reviews yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
