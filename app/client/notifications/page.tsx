"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Calendar, DollarSign, Star, Heart, CheckCircle, Trash2 } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"

// Mock notifications for client
const clientNotifications = [
  {
    id: "notif-c1",
    user_id: "client-1",
    title: "Appointment Confirmed",
    message: "Your Hair Cut & Styling appointment with Sarah Johnson has been confirmed for Feb 15, 2024 at 2:00 PM",
    type: "appointment",
    is_read: false,
    created_at: "2024-02-10T10:00:00Z",
  },
  {
    id: "notif-c2",
    user_id: "client-1",
    title: "Payment Successful",
    message: "Payment of $50.00 for Hair Cut & Styling has been processed successfully",
    type: "payment",
    is_read: false,
    created_at: "2024-02-10T09:30:00Z",
  },
  {
    id: "notif-c3",
    user_id: "client-1",
    title: "Appointment Reminder",
    message: "Don't forget your appointment tomorrow at 2:00 PM with Sarah Johnson",
    type: "reminder",
    is_read: true,
    created_at: "2024-02-14T09:00:00Z",
  },
  {
    id: "notif-c4",
    user_id: "client-1",
    title: "New Service Available",
    message: "Sarah Johnson has added a new service: Facial Treatment. Check it out!",
    type: "promotion",
    is_read: true,
    created_at: "2024-02-08T14:20:00Z",
  },
  {
    id: "notif-c5",
    user_id: "client-1",
    title: "Review Request",
    message: "How was your experience with Mike Wilson? Please leave a review to help other clients",
    type: "review",
    is_read: false,
    created_at: "2024-02-07T16:00:00Z",
  },
  {
    id: "notif-c6",
    user_id: "client-1",
    title: "Special Offer",
    message: "Get 20% off your next booking with code SAVE20. Valid until Feb 29th!",
    type: "promotion",
    is_read: true,
    created_at: "2024-02-05T12:00:00Z",
  },
]

export default function ClientNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const userNotifications = clientNotifications.filter((notif) => notif.user_id === currentUser.id)
        setNotifications(
          userNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        )
      }
    }
    loadData()
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, is_read: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== notificationId))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-600" />
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-600" />
      case "review":
        return <Star className="h-5 w-5 text-yellow-600" />
      case "promotion":
        return <Heart className="h-5 w-5 text-pink-600" />
      case "reminder":
        return <Bell className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const unreadNotifications = notifications.filter((notif) => !notif.is_read)
  const readNotifications = notifications.filter((notif) => notif.is_read)

  const NotificationCard = ({ notification }: { notification: any }) => (
    <Card className={`${!notification.is_read ? "border-blue-200 bg-blue-50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                {!notification.is_read && (
                  <Badge variant="default" className="text-xs">
                    New
                  </Badge>
                )}
                <div className="flex space-x-1">
                  {!notification.is_read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your appointments and activities</p>
        </div>
        {unreadNotifications.length > 0 && <Button onClick={markAllAsRead}>Mark All as Read</Button>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-blue-600">{unreadNotifications.length}</p>
              </div>
              <Badge variant="default">{unreadNotifications.length}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter((n) => n.type === "appointment").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Promotions</p>
                <p className="text-2xl font-bold text-pink-600">
                  {notifications.filter((n) => n.type === "promotion").length}
                </p>
              </div>
              <Heart className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadNotifications.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {unreadNotifications.length > 0 ? (
            unreadNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500">You have no unread notifications</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {readNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>
      </Tabs>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-500">You'll see notifications here when you have updates</p>
        </div>
      )}
    </div>
  )
}
