"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Star, Clock } from "lucide-react"
import Link from "next/link"
import { mockServices, mockCategories, getUserById, getCategoryById } from "@/lib/mock-data"

export default function SearchServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [favorites, setFavorites] = useState<string[]>([])

  // Get services with related data
  const servicesWithData = mockServices.map((service) => ({
    ...service,
    provider: getUserById(service.provider_id),
    category: getCategoryById(service.category_id),
  }))

  const filteredServices = servicesWithData.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.provider?.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category_id === selectedCategory
    return matchesSearch && matchesCategory && service.is_active
  })

  const toggleFavorite = (serviceId: string) => {
    setFavorites((prev) => (prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Services</h1>
        <p className="text-gray-600">Discover and book amazing services from verified providers</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search services or providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {mockCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-500">by {service.provider?.full_name}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(service.id)}
                  className={`${favorites.includes(service.id) ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(service.id) ? "fill-current" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={service.image_url || "/placeholder.svg"}
                alt={service.name}
                className="w-full h-32 object-cover rounded-md"
              />

              <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>
                <Badge variant="secondary">{service.category?.name}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-gray-500">(24 reviews)</span>
                </div>
                <span className="text-lg font-bold text-green-600">${service.price}</span>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/client/book/${service.id}`}>Book Now</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
