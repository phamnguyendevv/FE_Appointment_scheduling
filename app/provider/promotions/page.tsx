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
import { Plus, Edit, Trash2, Copy, Eye, EyeOff } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getPromotionsByProvider } from "@/lib/mock-data"

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_amount: "",
    max_uses: "",
    start_date: "",
    end_date: "",
    is_active: true,
  })

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const providerPromotions = getPromotionsByProvider(currentUser.id)
        setPromotions(providerPromotions)
      }
    }
    loadData()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPromotion) {
      // Update existing promotion
      setPromotions(
        promotions.map((promo) =>
          promo.id === editingPromotion.id
            ? {
                ...promo,
                ...formData,
                discount_value: Number.parseFloat(formData.discount_value),
                min_amount: Number.parseFloat(formData.min_amount) || 0,
                max_uses: Number.parseInt(formData.max_uses) || null,
              }
            : promo,
        ),
      )
    } else {
      // Add new promotion
      const newPromotion = {
        id: `promo-${Date.now()}`,
        provider_id: user.id,
        ...formData,
        discount_value: Number.parseFloat(formData.discount_value),
        min_amount: Number.parseFloat(formData.min_amount) || 0,
        max_uses: Number.parseInt(formData.max_uses) || null,
        used_count: 0,
        created_at: new Date().toISOString(),
      }
      setPromotions([...promotions, newPromotion])
    }

    setIsDialogOpen(false)
    setEditingPromotion(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      min_amount: "",
      max_uses: "",
      start_date: "",
      end_date: "",
      is_active: true,
    })
  }

  const handleEdit = (promotion: any) => {
    setEditingPromotion(promotion)
    setFormData({
      code: promotion.code,
      description: promotion.description,
      discount_type: promotion.discount_type,
      discount_value: promotion.discount_value.toString(),
      min_amount: promotion.min_amount?.toString() || "",
      max_uses: promotion.max_uses?.toString() || "",
      start_date: promotion.start_date.split("T")[0],
      end_date: promotion.end_date.split("T")[0],
      is_active: promotion.is_active,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (promotionId: string) => {
    setPromotions(promotions.filter((promo) => promo.id !== promotionId))
  }

  const toggleActive = (promotionId: string) => {
    setPromotions(
      promotions.map((promo) => (promo.id === promotionId ? { ...promo, is_active: !promo.is_active } : promo)),
    )
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  const isExpired = (endDate: string) => new Date(endDate) < new Date()
  const isActive = (promotion: any) => promotion.is_active && !isExpired(promotion.end_date)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
          <p className="text-gray-600">Create and manage discount codes for your services</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Promotion
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPromotion ? "Edit Promotion" : "Create New Promotion"}</DialogTitle>
              <DialogDescription>
                {editingPromotion ? "Update your promotion details" : "Create a new discount code"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">Promotion Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., SAVE20"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your promotion"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discount_value">
                    {formData.discount_type === "percentage" ? "Percentage (%)" : "Amount ($)"}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    step={formData.discount_type === "percentage" ? "1" : "0.01"}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min_amount">Min Amount ($)</Label>
                  <Input
                    id="min_amount"
                    type="number"
                    step="0.01"
                    value={formData.min_amount}
                    onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label htmlFor="max_uses">Max Uses</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="Unlimited"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingPromotion ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promotion) => (
          <Card key={promotion.id} className={`${!isActive(promotion) ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{promotion.code}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyCode(promotion.code)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                  <CardDescription>{promotion.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(promotion.id)}>
                    {promotion.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(promotion)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(promotion.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Discount:</span>
                  <span className="font-medium">
                    {promotion.discount_type === "percentage"
                      ? `${promotion.discount_value}%`
                      : `$${promotion.discount_value}`}
                  </span>
                </div>

                {promotion.min_amount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min Amount:</span>
                    <span className="font-medium">${promotion.min_amount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Usage:</span>
                  <span className="font-medium">
                    {promotion.used_count}/{promotion.max_uses || "∞"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valid Until:</span>
                  <span className="font-medium">{new Date(promotion.end_date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  <Badge variant={isActive(promotion) ? "default" : "secondary"}>
                    {isExpired(promotion.end_date) ? "Expired" : promotion.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {promotions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions yet</h3>
          <p className="text-gray-500 mb-4">Create your first promotion to attract more clients</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Promotion
          </Button>
        </div>
      )}
    </div>
  )
}
