"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, EyeOff, Edit, Trash2 } from "lucide-react"
import { mockServices, getUserById, getCategoryById } from "@/lib/mock-data"

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Load services with related data
    const servicesWithData = mockServices.map((service) => ({
      ...service,
      provider: getUserById(service.provider_id),
      category: getCategoryById(service.category_id),
    }))
    setServices(servicesWithData)
  }, [])

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "all" || service.category_id === categoryFilter
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? service.is_active : !service.is_active)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const toggleServiceStatus = (serviceId: string) => {
    setServices(
      services.map((service) => (service.id === serviceId ? { ...service, is_active: !service.is_active } : service)),
    )
  }

  const deleteService = (serviceId: string) => {
    setServices(services.filter((service) => service.id !== serviceId))
  }

  const totalServices = services.length
  const activeServices = services.filter((s) => s.is_active).length
  const inactiveServices = services.filter((s) => !s.is_active).length
  const averagePrice = services.reduce((sum, s) => sum + s.price, 0) / services.length

  // Get unique categories for filter
  const categories = [...new Set(services.map((s) => s.category).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Monitor and manage all platform services</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-sm text-gray-600">Total Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{activeServices}</div>
            <p className="text-sm text-gray-600">Active Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{inactiveServices}</div>
            <p className="text-sm text-gray-600">Inactive Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">${averagePrice.toFixed(2)}</div>
            <p className="text-sm text-gray-600">Average Price</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={`hover:shadow-md transition-shadow ${!service.is_active ? "opacity-60" : ""}`}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={service.provider?.avatar_url || "/placeholder.svg"}
                        alt={service.provider?.full_name}
                      />
                      <AvatarFallback className="text-xs">{service.provider?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{service.provider?.full_name}</span>
                  </CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleServiceStatus(service.id)}>
                    {service.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteService(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={service.image_url || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-32 object-cover rounded-md mb-4"
              />

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price:</span>
                  <span className="font-bold text-green-600">${service.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium">{service.duration} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Category:</span>
                  <Badge variant="secondary">{service.category?.name}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant={service.is_active ? "default" : "secondary"}>
                    {service.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-400">Created {new Date(service.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
