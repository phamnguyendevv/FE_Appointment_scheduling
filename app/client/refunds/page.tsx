"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  Calendar,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
import {
  getAppointmentsByClient,
  getServiceById,
  getUserById,
  getRefundsByClient,
} from "@/lib/mock-data";

export default function ClientRefundsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock current client ID - in real app, get from auth
  const currentClientId = "client-1";

  // Get client's appointments and refunds
  const clientAppointments = getAppointmentsByClient(currentClientId);
  const clientRefunds = getRefundsByClient(currentClientId);

  // Filter appointments that can be refunded (completed or cancelled, no existing refund)
  const eligibleAppointments = clientAppointments.filter(
    (appointment) =>
      (appointment.status === "completed" ||
        appointment.status === "cancelled") &&
      !clientRefunds.some((refund) => refund.appointment_id === appointment.id)
  );

  const handleSubmitRefund = () => {
    // In real app, submit to API
    console.log("Submitting refund request:", {
      appointmentId: selectedAppointment,
      amount: refundAmount,
      reason: refundReason,
    });

    // Reset form and close dialog
    setSelectedAppointment("");
    setRefundAmount("");
    setRefundReason("");
    setIsDialogOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Refunds</h1>
          <p className="text-gray-600">
            Manage your refund requests and view their status
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Refund
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Refund</DialogTitle>
              <DialogDescription>
                Submit a refund request for a completed or cancelled
                appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="appointment">Select Appointment</Label>
                <Select
                  value={selectedAppointment}
                  onValueChange={setSelectedAppointment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligibleAppointments.map((appointment) => {
                      const service = getServiceById(appointment.service_id);
                      const provider = getUserById(appointment.provider_id);
                      return (
                        <SelectItem key={appointment.id} value={appointment.id}>
                          {service?.name} - {provider?.full_name} ($
                          {appointment.total_amount})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Refund Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Refund</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you're requesting a refund..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmitRefund}
                disabled={
                  !selectedAppointment || !refundAmount || !refundReason
                }
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Refund Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientRefunds.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientRefunds.filter((r) => r.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clientRefunds.filter((r) => r.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Refunded
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {clientRefunds
                .filter((r) => r.status === "approved")
                .reduce((sum, r) => sum + r.amount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Refund Requests List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Refund History</h2>
        {clientRefunds.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No refund requests
              </h3>
              <p className="text-gray-500 text-center mb-4">
                You haven't submitted any refund requests yet.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Request Your First Refund
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {clientRefunds.map((refund) => {
              const appointment = clientAppointments.find(
                (a) => a.id === refund.appointment_id
              );
              const service = appointment
                ? getServiceById(appointment.service_id)
                : null;
              const provider = appointment
                ? getUserById(appointment.provider_id)
                : null;

              return (
                <Card key={refund.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {service?.name}
                        </CardTitle>
                        <CardDescription>
                          Provider: {provider?.full_name}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(refund.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(refund.status)}
                          {refund.status.charAt(0).toUpperCase() +
                            refund.status.slice(1)}
                        </div>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>Amount: ${refund.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          Requested:{" "}
                          {new Date(refund.requested_at).toLocaleDateString()}
                        </span>
                      </div>
                      {refund.processed_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            Processed:{" "}
                            {new Date(refund.processed_at).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>
                          Method: {refund.refund_method.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">Reason:</h4>
                      <p className="text-sm text-gray-600">{refund.reason}</p>
                    </div>

                    {refund.admin_notes && (
                      <div>
                        <h4 className="font-medium mb-1">Admin Response:</h4>
                        <p className="text-sm text-gray-600">
                          {refund.admin_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
