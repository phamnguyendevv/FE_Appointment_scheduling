"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, UserPlus, Edit, Trash2, CheckCircle, XCircle, Eye } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"
import { Textarea } from "@/components/ui/textarea"
// Import the new BulkUserActions component
import BulkUserActions from "@/components/admin/bulk-user-actions"
// Import validation utilities
import { validateUserForm, generateRandomPassword, formatUserData } from "@/components/admin/user-form-validation"

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Thêm state cho dialog và form
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUserForm, setNewUserForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "client",
    password: "",
    bio: "",
    location: "",
    is_approved: true,
  })

  // Add form validation state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load users data
    setUsers(mockUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || (statusFilter === "approved" ? user.is_approved : !user.is_approved)
    return matchesSearch && matchesRole && matchesStatus
  })

  const approveUser = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, is_approved: true } : user)))
  }

  const suspendUser = (userId: string) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, is_approved: false } : user)))
  }

  const deleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const viewUser = (user: any) => {
    setSelectedUser(user)
    setIsViewDialogOpen(true)
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

  const getStatusColor = (isApproved: boolean) => {
    return isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const totalUsers = users.length
  const adminUsers = users.filter((u) => u.role === "admin").length
  const providerUsers = users.filter((u) => u.role === "provider").length
  const clientUsers = users.filter((u) => u.role === "client").length
  const pendingApproval = users.filter((u) => !u.is_approved && u.role === "provider").length

  // Update handleAddUser with validation
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateUserForm(newUserForm, users)
    if (!validation.isValid) {
      setFormErrors(validation.errors)
      return
    }

    const newUser = formatUserData(newUserForm, true)
    setUsers([newUser, ...users])
    setIsAddDialogOpen(false)
    resetNewUserForm()
    setFormErrors({})
    alert("User created successfully!")
  }

  const resetNewUserForm = () => {
    setNewUserForm({
      full_name: "",
      email: "",
      phone: "",
      role: "client",
      password: "",
      bio: "",
      location: "",
      is_approved: true,
    })
  }

  // Add password generation function
  const generatePassword = () => {
    const password = generateRandomPassword()
    setNewUserForm({ ...newUserForm, password })
  }

  // Add bulk actions functions
  const handleBulkImport = (importedUsers: any[]) => {
    // Check for duplicate emails
    const existingEmails = users.map((u) => u.email.toLowerCase())
    const validUsers = importedUsers.filter((user) => !existingEmails.includes(user.email.toLowerCase()))

    if (validUsers.length !== importedUsers.length) {
      alert(`${importedUsers.length - validUsers.length} users were skipped due to duplicate emails`)
    }

    setUsers([...validUsers, ...users])
    alert(`Successfully imported ${validUsers.length} users`)
  }

  const handleBulkExport = () => {
    const csvHeaders = ["full_name", "email", "phone", "role", "is_approved", "location", "created_at"]
    const csvData = [
      csvHeaders.join(","),
      ...users.map((user) =>
        csvHeaders
          .map((header) => {
            const value = user[header] || ""
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Update the header section to include bulk actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
          <p className="text-gray-600">Manage all platform users and their permissions</p>
        </div>
        <div className="flex space-x-2">
          <BulkUserActions onBulkImport={handleBulkImport} onBulkExport={handleBulkExport} />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account for the platform</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="new_full_name">Full Name *</Label>
                    <Input
                      id="new_full_name"
                      value={newUserForm.full_name}
                      onChange={(e) => {
                        setNewUserForm({ ...newUserForm, full_name: e.target.value })
                        if (formErrors.full_name) {
                          setFormErrors({ ...formErrors, full_name: "" })
                        }
                      }}
                      className={formErrors.full_name ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.full_name && <p className="text-red-500 text-sm mt-1">{formErrors.full_name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="new_email">Email *</Label>
                    <Input
                      id="new_email"
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => {
                        setNewUserForm({ ...newUserForm, email: e.target.value })
                        if (formErrors.email) {
                          setFormErrors({ ...formErrors, email: "" })
                        }
                      }}
                      className={formErrors.email ? "border-red-500" : ""}
                      required
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="new_phone">Phone</Label>
                    <Input
                      id="new_phone"
                      value={newUserForm.phone}
                      onChange={(e) => {
                        setNewUserForm({ ...newUserForm, phone: e.target.value })
                        if (formErrors.phone) {
                          setFormErrors({ ...formErrors, phone: "" })
                        }
                      }}
                      className={formErrors.phone ? "border-red-500" : ""}
                      placeholder="+1234567890"
                    />
                    {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="new_role">Role *</Label>
                    <Select
                      value={newUserForm.role}
                      onValueChange={(value) => setNewUserForm({ ...newUserForm, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="provider">Provider</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new_password">Password *</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="new_password"
                        type="password"
                        value={newUserForm.password}
                        onChange={(e) => {
                          setNewUserForm({ ...newUserForm, password: e.target.value })
                          if (formErrors.password) {
                            setFormErrors({ ...formErrors, password: "" })
                          }
                        }}
                        className={formErrors.password ? "border-red-500" : ""}
                        required
                        minLength={6}
                      />
                      <Button type="button" variant="outline" onClick={generatePassword}>
                        Generate
                      </Button>
                    </div>
                    {formErrors.password && <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="new_location">Location</Label>
                    <Input
                      id="new_location"
                      value={newUserForm.location}
                      onChange={(e) => setNewUserForm({ ...newUserForm, location: e.target.value })}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="new_bio">Bio</Label>
                  <Textarea
                    id="new_bio"
                    value={newUserForm.bio}
                    onChange={(e) => setNewUserForm({ ...newUserForm, bio: e.target.value })}
                    placeholder="Tell us about this user..."
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="new_is_approved"
                    checked={newUserForm.is_approved}
                    onChange={(e) => setNewUserForm({ ...newUserForm, is_approved: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="new_is_approved">
                    Approve user immediately{" "}
                    {newUserForm.role === "provider" && "(Providers normally require approval)"}
                  </Label>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{adminUsers}</div>
            <p className="text-sm text-gray-600">Admins</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{providerUsers}</div>
            <p className="text-sm text-gray-600">Providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{clientUsers}</div>
            <p className="text-sm text-gray-600">Clients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingApproval}</div>
            <p className="text-sm text-gray-600">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="provider">Provider</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage platform users and their access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                    <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user.full_name}</h4>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    <div className="mt-1">
                      <Badge className={getStatusColor(user.is_approved)}>
                        {user.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => viewUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!user.is_approved && user.role === "provider" && (
                      <Button size="sm" onClick={() => approveUser(user.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {user.is_approved && user.role !== "admin" && (
                      <Button variant="outline" size="sm" onClick={() => suspendUser(user.id)}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {user.role !== "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information and activity</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.avatar_url || "/placeholder.svg"} alt={selectedUser.full_name} />
                  <AvatarFallback className="text-lg">{selectedUser.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.full_name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex space-x-2 mt-2">
                    <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge>
                    <Badge className={getStatusColor(selectedUser.is_approved)}>
                      {selectedUser.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Phone</Label>
                  <p>{selectedUser.phone || "Not provided"}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Role</Label>
                  <p className="capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <p>{selectedUser.is_approved ? "Approved" : "Pending Approval"}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Joined</Label>
                  <p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                {!selectedUser.is_approved && selectedUser.role === "provider" && (
                  <Button
                    onClick={() => {
                      approveUser(selectedUser.id)
                      setIsViewDialogOpen(false)
                    }}
                  >
                    Approve User
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
