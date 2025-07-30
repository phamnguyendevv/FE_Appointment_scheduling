"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Eye, Search, Filter } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getAppointmentsByProvider, getUserById, getServiceById } from "@/lib/mock-data"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      if (currentUser) {
        const appointments = getAppointmentsByProvider(currentUser.id)

        // Create invoices from completed appointments
        const mockInvoices = appointments
          .filter((apt) => apt.status === "completed")
          .map((apt) => ({
            id: `inv-${apt.id}`,
            appointment_id: apt.id,
            provider_id: apt.provider_id,
            amount: apt.total_amount - apt.commission_amount,
            commission_amount: apt.commission_amount,
            gross_amount: apt.total_amount,
            payment_status: "paid",
            stripe_payment_intent_id: `pi_${apt.id}`,
            created_at: apt.created_at,
            paid_at: apt.updated_at,
            client: getUserById(apt.client_id),
            service: getServiceById(apt.service_id),
            appointment: apt,
          }))

        setInvoices(mockInvoices.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
      }
    }
    loadData()
  }, [])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.payment_status === statusFilter

    return matchesSearch && matchesStatus
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

  const totalEarnings = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalCommission = invoices.reduce((sum, inv) => sum + inv.commission_amount, 0)
  const totalGross = invoices.reduce((sum, inv) => sum + inv.gross_amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
        <p className="text-gray-600">Manage your payment records and invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
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
                <p className="text-2xl font-bold text-red-600">${totalCommission.toFixed(2)}</p>
              </div>
              <div className="text-red-600">
                <Filter className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gross Revenue</p>
                <p className="text-2xl font-bold">${totalGross.toFixed(2)}</p>
              </div>
              <div className="text-blue-600">
                <Eye className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>All your payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{invoice.id}</p>
                      <p className="text-sm text-gray-500">
                        {invoice.service?.name} • {invoice.client?.full_name}
                      </p>
                      <p className="text-xs text-gray-400">{new Date(invoice.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-bold text-green-600">${invoice.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Gross: ${invoice.gross_amount.toFixed(2)}</p>
                    <p className="text-xs text-red-500">Commission: ${invoice.commission_amount.toFixed(2)}</p>
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
              <p className="text-gray-500">No invoices found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
