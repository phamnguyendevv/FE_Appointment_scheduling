"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getServicesByProvider, mockCategories, getCategoryById } from "@/lib/mock-data"

export default function MyServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category_id: "",
    is_active: true,
  })

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const providerServices = getServicesByProvider(currentUser.id).map((service) => ({
          ...service,
          category: getCategoryById(service.category_id),
        }))
        setServices(providerServices)
      }
    }
    loadData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingService) {
      // Update existing service
      setServices(
        services.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                ...formData,
                price: Number.parseFloat(formData.price),
                duration: Number.parseInt(formData.duration),
              }
            : service,
        ),
      )
    } else {
      // Add new service
      const newService = {
        id: `service-${Date.now()}`,
        provider_id: user.id,
        ...formData,
        price: Number.parseFloat(formData.price),
        duration: Number.parseInt(formData.duration),
        image_url: "/placeholder.svg?height=200&width=300",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category: getCategoryById(formData.category_id),
      }
      setServices([...services, newService])
    }

    setIsDialogOpen(false)
    setEditingService(null)
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category_id: "",
      is_active: true,
    })
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category_id: service.category_id,
      is_active: service.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (serviceId: string) => {
    setServices(services.filter((service) => service.id !== serviceId))
  }

  const toggleActive = (serviceId: string) => {
    setServices(
      services.map((service) => (service.id === serviceId ? { ...service, is_active: !service.is_active } : service)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600">Manage your service offerings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
              <DialogDescription>
                {editingService ? "Update your service details" : "Create a new service offering"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (min)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingService ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className={`${!service.is_active ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.category?.name}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(service.id)}>
                    {service.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
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
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-bold text-green-600">${service.price}</span>
                <span className="text-sm text-gray-500">{service.duration} min</span>
              </div>
              <Badge variant={service.is_active ? "default" : "secondary"}>
                {service.is_active ? "Active" : "Inactive"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-500 mb-4">Create your first service to start accepting bookings</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Service
          </Button>
        </div>
      )}
    </div>
  )
}
