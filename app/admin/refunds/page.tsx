"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { User, DollarSign, RefreshCw, AlertCircle, CheckCircle, XCircle, Search, Download } from "lucide-react"
import { getAllRefunds, getUserById, getServiceById, getAppointmentById } from "@/lib/mock-data"

export default function AdminRefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRefund, setSelectedRefund] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    // Load refunds with related data
    const refundsWithData = getAllRefunds().map((refund) => ({
      ...refund,
      client: getUserById(refund.client_id),
      provider: getUserById(refund.provider_id),
      appointment: getAppointmentById(refund.appointment_id),
      service: getServiceById(getAppointmentById(refund.appointment_id)?.service_id || ""),
    }))
    setRefunds(refundsWithData.sort((a, b) => new Date(b.requested_at).getTime() - new Date(a.requested_at).getTime()))
  }, [])

  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      refund.client?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.provider?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.reason.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || refund.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleRefundAction = async (refundId: string, action: "approve" | "reject") => {
    setProcessing(true)

    // Simulate API call
    setTimeout(() => {
      setRefunds(
        refunds.map((refund) =>
          refund.id === refundId
            ? {
                ...refund,
                status: action === "approve" ? "approved" : "rejected",
                processed_at: new Date().toISOString(),
                admin_notes: adminNotes || (action === "approve" ? "Refund approved" : "Refund rejected"),
              }
            : refund,
        ),
      )
      setDialogOpen(false)
      setSelectedRefund(null)
      setAdminNotes("")
      setProcessing(false)
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <RefreshCw className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "processing":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const totalRefunds = refunds.length
  const pendingRefunds = refunds.filter((r) => r.status === "pending").length
  const approvedRefunds = refunds.filter((r) => r.status === "approved").length
  const rejectedRefunds = refunds.filter((r) => r.status === "rejected").length
  const totalRefundAmount = refunds.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Refund Management</h1>
          <p className="text-gray-600">Review and process refund requests</p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalRefunds}</div>
            <p className="text-sm text-gray-600">Total Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{pendingRefunds}</div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{approvedRefunds}</div>
            <p className="text-sm text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{rejectedRefunds}</div>
            <p className="text-sm text-gray-600">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">${totalRefundAmount.toFixed(2)}</div>
            <p className="text-sm text-gray-600">Total Refunded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search refunds..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All ({filteredRefunds.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingRefunds})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedRefunds})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedRefunds})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRefunds.map((refund) => (
            <RefundCard
              key={refund.id}
              refund={refund}
              onAction={(refund) => {
                setSelectedRefund(refund)
                setAdminNotes(refund.admin_notes || "")
                setDialogOpen(true)
              }}
            />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredRefunds
            .filter((r) => r.status === "pending")
            .map((refund) => (
              <RefundCard
                key={refund.id}
                refund={refund}
                onAction={(refund) => {
                  setSelectedRefund(refund)
                  setAdminNotes(refund.admin_notes || "")
                  setDialogOpen(true)
                }}
              />
            ))}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredRefunds
            .filter((r) => r.status === "approved")
            .map((refund) => (
              <RefundCard key={refund.id} refund={refund} />
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredRefunds
            .filter((r) => r.status === "rejected")
            .map((refund) => (
              <RefundCard key={refund.id} refund={refund} />
            ))}
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Process Refund Request</DialogTitle>
            <DialogDescription>Review and take action on this refund request</DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Refund Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <strong>Client:</strong> {selectedRefund.client?.full_name}
                    </p>
                    <p>
                      <strong>Provider:</strong> {selectedRefund.provider?.full_name}
                    </p>
                    <p>
                      <strong>Service:</strong> {selectedRefund.service?.name}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Amount:</strong> ${selectedRefund.amount}
                    </p>
                    <p>
                      <strong>Requested:</strong> {new Date(selectedRefund.requested_at).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedRefund.status}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Client's Reason</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedRefund.reason}</p>
              </div>

              <div>
                <Label htmlFor="adminNotes">Admin Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={3}
                />
              </div>

              {selectedRefund.status === "pending" && (
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRefundAction(selectedRefund.id, "reject")}
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Reject"}
                  </Button>
                  <Button onClick={() => handleRefundAction(selectedRefund.id, "approve")} disabled={processing}>
                    {processing ? "Processing..." : "Approve"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {filteredRefunds.length === 0 && (
        <div className="text-center py-12">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No refund requests found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}

function RefundCard({ refund, onAction }: { refund: any; onAction?: (refund: any) => void }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <RefreshCw className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <XCircle className="h-4 w-4" />
      case "processing":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{refund.service?.name}</CardTitle>
            <CardDescription className="flex items-center space-x-4 mt-2">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {refund.client?.full_name}
              </span>
              <span>→</span>
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {refund.provider?.full_name}
              </span>
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />${refund.amount}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(refund.status)} flex items-center space-x-1`}>
              {getStatusIcon(refund.status)}
              <span>{refund.status}</span>
            </Badge>
            {refund.status === "pending" && onAction && (
              <Button size="sm" onClick={() => onAction(refund)}>
                Review
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">Request Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Requested: {new Date(refund.requested_at).toLocaleDateString()}</p>
              {refund.processed_at && <p>Processed: {new Date(refund.processed_at).toLocaleDateString()}</p>}
              <p>Method: {refund.refund_method.replace("_", " ")}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Client Reason</h4>
            <p className="text-sm text-gray-600 line-clamp-3">{refund.reason}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Admin Notes</h4>
            <p className="text-sm text-gray-600">{refund.admin_notes || "No notes added"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
