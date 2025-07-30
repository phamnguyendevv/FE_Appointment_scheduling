"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { mockCategories, mockServices } from "@/lib/mock-data"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
  })

  useEffect(() => {
    // Load categories with service counts
    const categoriesWithCounts = mockCategories.map((category) => ({
      ...category,
      serviceCount: mockServices.filter((service) => service.category_id === category.id).length,
    }))
    setCategories(categoriesWithCounts)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingCategory) {
      // Update existing category
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                ...formData,
              }
            : cat,
        ),
      )
    } else {
      // Add new category
      const newCategory = {
        id: `cat-${Date.now()}`,
        ...formData,
        created_at: new Date().toISOString(),
        serviceCount: 0,
      }
      setCategories([...categories, newCategory])
    }

    setIsDialogOpen(false)
    setEditingCategory(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
    })
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (category && category.serviceCount > 0) {
      alert("Cannot delete category with existing services. Please move or delete services first.")
      return
    }
    setCategories(categories.filter((cat) => cat.id !== categoryId))
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage service categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update category details" : "Create a new service category"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
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
              <div>
                <Label htmlFor="icon">Icon Name</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., Sparkles, Heart, Dumbbell"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCategory ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-sm text-gray-600">Total Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {categories.reduce((sum, cat) => sum + cat.serviceCount, 0)}
            </div>
            <p className="text-sm text-gray-600">Total Services</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {categories.filter((cat) => cat.serviceCount > 0).length}
            </div>
            <p className="text-sm text-gray-600">Active Categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={category.serviceCount > 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Services</p>
                  <p className="text-2xl font-bold">{category.serviceCount}</p>
                </div>
                <div className="text-4xl text-gray-300">
                  {/* Icon placeholder - in real app you'd use dynamic icons */}
                  {category.icon === "Sparkles" && "✨"}
                  {category.icon === "Heart" && "❤️"}
                  {category.icon === "Dumbbell" && "🏋️"}
                  {category.icon === "BookOpen" && "📚"}
                  {category.icon === "Briefcase" && "💼"}
                  {!["Sparkles", "Heart", "Dumbbell", "BookOpen", "Briefcase"].includes(category.icon) && "📁"}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400">Created {new Date(category.created_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search criteria" : "Create your first category to get started"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Category
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
