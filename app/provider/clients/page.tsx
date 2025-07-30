"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Mail, Phone, Calendar, Star, MessageCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByProvider, getUserById, getServiceById, getReviewsByProvider } from "@/lib/mock-data"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const appointments = getAppointmentsByProvider(currentUser.id)
        const reviews = getReviewsByProvider(currentUser.id)

        // Group appointments by client
        const clientMap = new Map()

        appointments.forEach((apt) => {
          const client = getUserById(apt.client_id)
          if (client && !clientMap.has(client.id)) {
            clientMap.set(client.id, {
              ...client,
              appointments: [],
              totalSpent: 0,
              lastVisit: null,
              status: "active",
              reviews: [],
            })
          }

          if (client) {
            const clientData = clientMap.get(client.id)
            clientData.appointments.push({
              ...apt,
              service: getServiceById(apt.service_id),
            })

            if (apt.status === "completed") {
              clientData.totalSpent += apt.total_amount
            }

            const aptDate = new Date(apt.appointment_date)
            if (!clientData.lastVisit || aptDate > new Date(clientData.lastVisit)) {
              clientData.lastVisit = apt.appointment_date
            }
          }
        })

        // Add reviews to clients
        reviews.forEach((review) => {
          const client = clientMap.get(review.client_id)
          if (client) {
            client.reviews.push(review)
          }
        })

        const clientsArray = Array.from(clientMap.values())
        setClients(
          clientsArray.sort((a, b) => new Date(b.lastVisit || 0).getTime() - new Date(a.lastVisit || 0).getTime()),
        )
      }
    }
    loadData()
  }, [])

  const filteredClients = clients.filter(
    (client) =>
      client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const regularClients = clients.filter((client) => client.appointments.length >= 3)
  const newClients = clients.filter((client) => client.appointments.length === 1)
  const vipClients = clients.filter((client) => client.totalSpent >= 200)

  const ClientCard = ({ client }: { client: any }) => {
    const completedAppointments = client.appointments.filter((apt: any) => apt.status === "completed")
    const averageRating =
      client.reviews.length > 0
        ? client.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / client.reviews.length
        : 0

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={client.avatar_url || "/placeholder.svg"} alt={client.full_name} />
                <AvatarFallback>{client.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{client.full_name}</CardTitle>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {client.email}
                  </span>
                  {client.phone && (
                    <span className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      {client.phone}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Total Appointments</p>
              <p className="font-bold">{client.appointments.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="font-bold text-green-600">{completedAppointments.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="font-bold">${client.totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rating</p>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                <p className="font-bold">{averageRating > 0 ? averageRating.toFixed(1) : "N/A"}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Last Visit</p>
              <p className="font-medium">
                {client.lastVisit ? new Date(client.lastVisit).toLocaleDateString() : "Never"}
              </p>
            </div>
            <div className="flex space-x-2">
              {client.appointments.length >= 5 && <Badge variant="default">VIP</Badge>}
              {client.appointments.length >= 3 && <Badge variant="secondary">Regular</Badge>}
              {client.appointments.length === 1 && <Badge variant="outline">New</Badge>}
            </div>
          </div>

          {client.reviews.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-1">Latest Review:</p>
              <p className="text-sm text-gray-600">"{client.reviews[client.reviews.length - 1].comment}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Clients</h1>
        <p className="text-gray-600">Manage your client relationships</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-sm text-gray-600">Total Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{regularClients.length}</div>
            <p className="text-sm text-gray-600">Regular Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{newClients.length}</div>
            <p className="text-sm text-gray-600">New Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{vipClients.length}</div>
            <p className="text-sm text-gray-600">VIP Clients</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Clients ({clients.length})</TabsTrigger>
          <TabsTrigger value="regular">Regular ({regularClients.length})</TabsTrigger>
          <TabsTrigger value="new">New ({newClients.length})</TabsTrigger>
          <TabsTrigger value="vip">VIP ({vipClients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </TabsContent>

        <TabsContent value="regular" className="space-y-4">
          {regularClients
            .filter(
              (client) =>
                client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          {newClients
            .filter(
              (client) =>
                client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          {vipClients
            .filter(
              (client) =>
                client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
        </TabsContent>
      </Tabs>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
