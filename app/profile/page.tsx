"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Save, Camera, Shield } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByProvider, getAppointmentsByClient, getReviewsByProvider } from "@/lib/mock-data"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState<any>({})
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
  })

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        setFormData({
          full_name: currentUser.full_name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          bio: currentUser.bio || "",
          location: currentUser.location || "",
          website: currentUser.website || "",
        })

        // Load role-specific stats
        if (currentUser.role === "provider") {
          const appointments = getAppointmentsByProvider(currentUser.id)
          const reviews = getReviewsByProvider(currentUser.id)
          const completedAppointments = appointments.filter((apt) => apt.status === "completed")
          const totalEarnings = completedAppointments.reduce(
            (sum, apt) => sum + (apt.total_amount - apt.commission_amount),
            0,
          )
          const averageRating =
            reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

          setStats({
            totalAppointments: appointments.length,
            completedAppointments: completedAppointments.length,
            totalEarnings,
            averageRating,
            totalReviews: reviews.length,
          })
        } else if (currentUser.role === "client") {
          const appointments = getAppointmentsByClient(currentUser.id)
          const completedAppointments = appointments.filter((apt) => apt.status === "completed")
          const totalSpent = completedAppointments.reduce((sum, apt) => sum + apt.total_amount, 0)

          setStats({
            totalAppointments: appointments.length,
            completedAppointments: completedAppointments.length,
            totalSpent,
          })
        }
      }
    }
    loadData()
  }, [])

  const handleSave = () => {
    // Update user data
    const updatedUser = { ...user, ...formData }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
    })
    setIsEditing(false)
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "provider":
        return "bg-blue-100 text-blue-800"
      case "client":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details and profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                        <AvatarFallback className="text-2xl">{user.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0 bg-transparent"
                          variant="outline"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{user.full_name}</h3>
                      <p className="text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                        {user.is_approved && <Badge variant="outline">Verified</Badge>}
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        disabled={!isEditing}
                        placeholder="City, Country"
                      />
                    </div>
                    {user.role === "provider" && (
                      <div className="md:col-span-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          disabled={!isEditing}
                          placeholder="https://your-website.com"
                        />
                      </div>
                    )}
                    <div className="md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        placeholder={
                          user.role === "provider"
                            ? "Tell clients about your experience and services..."
                            : "Tell us about yourself..."
                        }
                      />
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="pt-6 border-t">
                    <h4 className="font-medium mb-4">Account Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">Account Type</Label>
                        <p className="capitalize">{user.role}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Member Since</Label>
                        <p>{new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Account Status</Label>
                        <p>{user.is_approved ? "Approved" : "Pending Approval"}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Last Updated</Label>
                        <p>{new Date(user.updated_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Statistics</CardTitle>
                  <CardDescription>Your activity and performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  {user.role === "provider" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalAppointments || 0}</div>
                        <p className="text-sm text-gray-600">Total Appointments</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.completedAppointments || 0}</div>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          ${(stats.totalEarnings || 0).toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">Total Earnings</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {(stats.averageRating || 0).toFixed(1)}
                        </div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                      </div>
                    </div>
                  )}

                  {user.role === "client" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalAppointments || 0}</div>
                        <p className="text-sm text-gray-600">Total Bookings</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.completedAppointments || 0}</div>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">${(stats.totalSpent || 0).toFixed(2)}</div>
                        <p className="text-sm text-gray-600">Total Spent</p>
                      </div>
                    </div>
                  )}

                  {user.role === "admin" && (
                    <div className="text-center p-8">
                      <Shield className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Administrator Account</h3>
                      <p className="text-gray-600">You have full access to platform management features</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline">Change</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Manage your notification preferences</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Privacy Settings</h4>
                        <p className="text-sm text-gray-600">Control your profile visibility</p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h4 className="font-medium text-red-600 mb-4">Danger Zone</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-red-600">Deactivate Account</h4>
                          <p className="text-sm text-gray-600">Temporarily disable your account</p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        >
                          Deactivate
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-red-600">Delete Account</h4>
                          <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                        </div>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
