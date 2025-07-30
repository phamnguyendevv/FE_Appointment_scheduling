"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Search, Phone, Video } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByProvider, getUserById } from "@/lib/mock-data"

// Mock chat messages
const mockMessages = [
  {
    id: "msg-1",
    sender_id: "client-1",
    receiver_id: "provider-1",
    message: "Hi! I'd like to book an appointment for next week.",
    is_read: true,
    created_at: "2024-02-10T10:00:00Z",
  },
  {
    id: "msg-2",
    sender_id: "provider-1",
    receiver_id: "client-1",
    message: "Hello! I'd be happy to help you. What service are you interested in?",
    is_read: true,
    created_at: "2024-02-10T10:05:00Z",
  },
  {
    id: "msg-3",
    sender_id: "client-1",
    receiver_id: "provider-1",
    message: "I'm looking for a hair cut and styling session. Do you have any availability on Tuesday?",
    is_read: true,
    created_at: "2024-02-10T10:10:00Z",
  },
  {
    id: "msg-4",
    sender_id: "provider-1",
    receiver_id: "client-1",
    message: "Yes, I have slots available at 2:00 PM and 4:00 PM on Tuesday. Which would work better for you?",
    is_read: false,
    created_at: "2024-02-10T10:15:00Z",
  },
  {
    id: "msg-5",
    sender_id: "client-2",
    receiver_id: "provider-1",
    message: "Thank you for the great service yesterday! I'll definitely book again soon.",
    is_read: false,
    created_at: "2024-02-11T09:00:00Z",
  },
]

export default function ChatPage() {
  const [user, setUser] = useState<any>(null)
  const [clients, setClients] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        // Get unique clients from appointments
        const appointments = getAppointmentsByProvider(currentUser.id)
        const uniqueClientIds = [...new Set(appointments.map((apt) => apt.client_id))]
        const clientsData = uniqueClientIds
          .map((clientId) => {
            const client = getUserById(clientId)
            const clientMessages = mockMessages.filter(
              (msg) =>
                (msg.sender_id === clientId && msg.receiver_id === currentUser.id) ||
                (msg.sender_id === currentUser.id && msg.receiver_id === clientId),
            )
            const lastMessage = clientMessages[clientMessages.length - 1]
            const unreadCount = clientMessages.filter((msg) => !msg.is_read && msg.sender_id === clientId).length

            return {
              ...client,
              lastMessage,
              unreadCount,
              messages: clientMessages,
            }
          })
          .filter(Boolean)

        setClients(
          clientsData.sort((a, b) => {
            const aTime = a.lastMessage ? new Date(a.lastMessage.created_at).getTime() : 0
            const bTime = b.lastMessage ? new Date(b.lastMessage.created_at).getTime() : 0
            return bTime - aTime
          }),
        )

        if (clientsData.length > 0) {
          setSelectedClient(clientsData[0])
          setMessages(clientsData[0].messages)
        }
      }
    }
    loadData()
  }, [])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedClient || !user) return

    const message = {
      id: `msg-${Date.now()}`,
      sender_id: user.id,
      receiver_id: selectedClient.id,
      message: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setNewMessage("")

    // Update client's last message
    setClients(
      clients.map((client) => (client.id === selectedClient.id ? { ...client, lastMessage: message } : client)),
    )
  }

  const selectClient = (client: any) => {
    setSelectedClient(client)
    setMessages(client.messages)

    // Mark messages as read
    setClients(clients.map((c) => (c.id === client.id ? { ...c, unreadCount: 0 } : c)))
  }

  const filteredClients = clients.filter((client) => client.full_name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
        <p className="text-gray-600">Communicate with your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Client List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                    selectedClient?.id === client.id ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => selectClient(client)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={client.avatar_url || "/placeholder.svg"} alt={client.full_name} />
                      <AvatarFallback>{client.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{client.full_name}</p>
                        {client.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2">
                            {client.unreadCount}
                          </Badge>
                        )}
                      </div>
                      {client.lastMessage && (
                        <p className="text-sm text-gray-500 truncate">{client.lastMessage.message}</p>
                      )}
                      {client.lastMessage && (
                        <p className="text-xs text-gray-400">
                          {new Date(client.lastMessage.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedClient ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedClient.avatar_url || "/placeholder.svg"}
                        alt={selectedClient.full_name}
                      />
                      <AvatarFallback>{selectedClient.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedClient.full_name}</CardTitle>
                      <CardDescription>Online</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender_id === user?.id ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a client to start chatting</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
