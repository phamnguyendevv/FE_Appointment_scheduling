"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Search, Star, Clock, Trash2 } from "lucide-react"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { getFavoritesByClient, getServiceById, getUserById, getCategoryById } from "@/lib/mock-data"

export default function FavoritesPage() {
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const userFavorites = getFavoritesByClient(currentUser.id).map((fav) => {
          const service = getServiceById(fav.service_id)
          return {
            ...fav,
            service: {
              ...service,
              provider: getUserById(service?.provider_id),
              category: getCategoryById(service?.category_id),
            },
          }
        })
        setFavorites(userFavorites)
      }
    }
    loadData()
  }, [])

  const removeFavorite = (favoriteId: string) => {
    setFavorites(favorites.filter((fav) => fav.id !== favoriteId))
  }

  const filteredFavorites = favorites.filter(
    (favorite) =>
      favorite.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.service?.provider?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.service?.category?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
        <p className="text-gray-600">Services you love and want to book again</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{favorites.length}</div>
            <p className="text-sm text-gray-600">Favorite Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {[...new Set(favorites.map((fav) => fav.service?.provider?.id))].length}
            </div>
            <p className="text-sm text-gray-600">Favorite Providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {[...new Set(favorites.map((fav) => fav.service?.category?.id))].length}
            </div>
            <p className="text-sm text-gray-600">Categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFavorites.map((favorite) => (
          <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{favorite.service?.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Avatar className="h-5 w-5">
                      <AvatarImage
                        src={favorite.service?.provider?.avatar_url || "/placeholder.svg"}
                        alt={favorite.service?.provider?.full_name}
                      />
                      <AvatarFallback className="text-xs">
                        {favorite.service?.provider?.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">by {favorite.service?.provider?.full_name}</span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFavorite(favorite.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={favorite.service?.image_url || "/placeholder.svg"}
                alt={favorite.service?.name}
                className="w-full h-32 object-cover rounded-md"
              />

              <p className="text-sm text-gray-600 line-clamp-2">{favorite.service?.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{favorite.service?.duration} min</span>
                </div>
                <Badge variant="secondary">{favorite.service?.category?.name}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-gray-500">(24 reviews)</span>
                </div>
                <span className="text-lg font-bold text-green-600">${favorite.service?.price}</span>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1" asChild>
                  <Link href={`/client/book/${favorite.service?.id}`}>Book Again</Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                </Button>
              </div>

              <div className="text-xs text-gray-400">Added {new Date(favorite.created_at).toLocaleDateString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFavorites.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No favorites found" : "No favorite services yet"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Try adjusting your search criteria"
              : "Start adding services to your favorites to see them here"}
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link href="/client/search">Discover Services</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
