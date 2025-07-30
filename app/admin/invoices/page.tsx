"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Eye, Search, Filter, FileText } from "lucide-react"
import { mockAppointments, getUserById, getServiceById } from "@/lib/mock-data"

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [providerFilter, setProviderFilter] = useState("all")

  useEffect(() => {
    // Create invoices from completed appointments
    const mockInvoices = mockAppointments
      .filter((apt) => apt.status === "completed")
      .map((apt) => ({
        id: `inv-${apt.id}`,
        appointment_id: apt.id,
        provider_id: apt.provider_id,
        client_id: apt.client_id,
        service_id: apt.service_id,
        amount: apt.total_amount - apt.commission_amount, // Provider earnings
        commission_amount: apt.commission_amount, // Platform commission
        gross_amount: apt.total_amount,
        payment_status: "paid",
        stripe_payment_intent_id: `pi_${apt.id}`,
        created_at: apt.created_at,
        paid_at: apt.updated_at,
        client: getUserById(apt.client_id),
        provider: getUserById(apt.provider_id),
        service: getServiceById(apt.service_id),
        appointment: apt,
      }))

    setInvoices(mockInvoices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
  }, [])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.provider?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.payment_status === statusFilter
    const matchesProvider = providerFilter === "all" || invoice.provider_id === providerFilter

    return matchesSearch && matchesStatus && matchesProvider
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalInvoices = invoices.length
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.gross_amount, 0)
  const totalCommission = invoices.reduce((sum, inv) => sum + inv.commission_amount, 0)
  const totalProviderEarnings = invoices.reduce((sum, inv) => sum + inv.amount, 0)

  // Get unique providers for filter
  const providers = [...new Set(invoices.map((inv) => inv.provider).filter(Boolean))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Invoices</h1>
          <p className="text-gray-600">Monitor all payment transactions and invoices</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold">{totalInvoices}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="text-green-600">
                <Download className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platform Commission</p>
                <p className="text-2xl font-bold text-green-600">${totalCommission.toFixed(2)}</p>
              </div>
              <div className="text-green-600">
                <Filter className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Provider Earnings</p>
                <p className="text-2xl font-bold text-blue-600">${totalProviderEarnings.toFixed(2)}</p>
              </div>
              <div className="text-blue-600">
                <Eye className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            {providers.map((provider) => (
              <SelectItem key={provider.id} value={provider.id}>
                {provider.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History ({filteredInvoices.length})</CardTitle>
          <CardDescription>All platform payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={invoice.provider?.avatar_url || "/placeholder.svg"}
                      alt={invoice.provider?.full_name}
                    />
                    <AvatarFallback>{invoice.provider?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-gray-500">
                      {invoice.service?.name} • {invoice.client?.full_name} → {invoice.provider?.full_name}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(invoice.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-bold">${invoice.gross_amount.toFixed(2)}</p>
                    <p className="text-sm text-green-600">Commission: ${invoice.commission_amount.toFixed(2)}</p>
                    <p className="text-sm text-blue-600">Provider: ${invoice.amount.toFixed(2)}</p>
                  </div>

                  <Badge className={getStatusColor(invoice.payment_status)}>{invoice.payment_status}</Badge>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
