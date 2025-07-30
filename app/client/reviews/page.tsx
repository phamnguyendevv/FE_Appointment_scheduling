"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star, Edit, Trash2, Plus, Search } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByClient, getUserById, getServiceById, mockReviews } from "@/lib/mock-data"

export default function MyReviewsPage() {
  const [user, setUser] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<any>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  })

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        // Get user's reviews
        const userReviews = mockReviews
          .filter((review) => review.client_id === currentUser.id)
          .map((review) => ({
            ...review,
            provider: getUserById(review.provider_id),
            service: getServiceById(review.service_id),
            appointment: getAppointmentsByClient(currentUser.id).find((apt) => apt.id === review.appointment_id),
          }))

        setReviews(userReviews)

        // Get completed appointments without reviews
        const appointments = getAppointmentsByClient(currentUser.id)
        const completedWithoutReviews = appointments
          .filter((apt) => apt.status === "completed")
          .filter((apt) => !userReviews.some((review) => review.appointment_id === apt.id))
          .map((apt) => ({
            ...apt,
            provider: getUserById(apt.provider_id),
            service: getServiceById(apt.service_id),
          }))

        setCompletedAppointments(completedWithoutReviews)
      }
    }
    loadData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingReview) {
      // Update existing review
      setReviews(
        reviews.map((review) =>
          review.id === editingReview.id
            ? {
                ...review,
                ...formData,
              }
            : review,
        ),
      )
    } else if (selectedAppointment) {
      // Add new review
      const newReview = {
        id: `review-${Date.now()}`,
        client_id: user.id,
        provider_id: selectedAppointment.provider_id,
        service_id: selectedAppointment.service_id,
        appointment_id: selectedAppointment.id,
        ...formData,
        created_at: new Date().toISOString(),
        provider: selectedAppointment.provider,
        service: selectedAppointment.service,
        appointment: selectedAppointment,
      }
      setReviews([newReview, ...reviews])

      // Remove from completed appointments
      setCompletedAppointments(completedAppointments.filter((apt) => apt.id !== selectedAppointment.id))
    }

    setIsDialogOpen(false)
    setEditingReview(null)
    setSelectedAppointment(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      rating: 5,
      comment: "",
    })
  }

  const handleEdit = (review: any) => {
    setEditingReview(review)
    setFormData({
      rating: review.rating,
      comment: review.comment,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      const review = reviews.find((r) => r.id === reviewId)
      setReviews(reviews.filter((r) => r.id !== reviewId))

      // Add back to completed appointments if needed
      if (review?.appointment) {
        setCompletedAppointments([...completedAppointments, review.appointment])
      }
    }
  }

  const handleAddReview = (appointment: any) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  const filteredReviews = reviews.filter(
    (review) =>
      review.provider?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.service?.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-600">Manage your service reviews and feedback</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{reviews.filter((r) => r.rating >= 4).length}</div>
            <p className="text-sm text-gray-600">Positive Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{completedAppointments.length}</div>
            <p className="text-sm text-gray-600">Pending Reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      {completedAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
            <CardDescription>Services you can review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={appointment.provider?.avatar_url || "/placeholder.svg"}
                        alt={appointment.provider?.full_name}
                      />
                      <AvatarFallback>{appointment.provider?.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{appointment.service?.name}</p>
                      <p className="text-sm text-gray-500">with {appointment.provider?.full_name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => handleAddReview(appointment)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Write Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={review.provider?.avatar_url || "/placeholder.svg"}
                      alt={review.provider?.full_name}
                    />
                    <AvatarFallback>{review.provider?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{review.service?.name}</CardTitle>
                    <CardDescription>with {review.provider?.full_name}</CardDescription>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(review)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search criteria" : "Complete some appointments to leave reviews"}
          </p>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingReview ? "Edit Review" : "Write Review"}</DialogTitle>
            <DialogDescription>
              {editingReview
                ? "Update your review"
                : `Share your experience with ${selectedAppointment?.service?.name}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= formData.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Share your experience..."
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingReview ? "Update" : "Submit"} Review</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
