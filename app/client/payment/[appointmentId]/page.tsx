"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Calendar, Clock, User, Shield, CheckCircle } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getUserById, getServiceById } from "@/lib/mock-data"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const appointmentId = params.appointmentId as string

  const [appointment, setAppointment] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [processing, setProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
  })

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      // In real app, fetch appointment from API
      const mockAppointment = {
        id: appointmentId,
        client_id: currentUser?.id,
        provider_id: "provider-1",
        service_id: "service-1",
        appointment_date: "2024-02-15T14:00:00Z",
        status: "pending",
        notes: "First time client",
        total_amount: 50,
        commission_amount: 5,
        created_at: "2024-02-01T00:00:00Z",
      }

      const appointmentWithData = {
        ...mockAppointment,
        client: getUserById(mockAppointment.client_id),
        provider: getUserById(mockAppointment.provider_id),
        service: getServiceById(mockAppointment.service_id),
      }

      setAppointment(appointmentWithData)
    }
    loadData()
  }, [appointmentId])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      setPaymentComplete(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/client/appointments")
      }, 3000)
    }, 2000)
  }

  if (!appointment || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been confirmed and the provider has been notified.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Appointment ID: {appointment.id}</p>
              <p>Date: {new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p>
                Time:{" "}
                {new Date(appointment.appointment_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <Button onClick={() => router.push("/client/appointments")} className="w-full mt-6">
              View My Appointments
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Details</span>
                </CardTitle>
                <CardDescription>Complete your payment to confirm the appointment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <Label className="text-base font-medium">Payment Method</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Button
                        type="button"
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                        className="justify-start"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit Card
                      </Button>
                      <Button
                        type="button"
                        variant={paymentMethod === "paypal" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("paypal")}
                        className="justify-start"
                      >
                        PayPal
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <>
                      {/* Card Details */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                              placeholder="MM/YY"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                              placeholder="123"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            value={formData.cardholderName}
                            onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </div>

                      {/* Billing Address */}
                      <div className="space-y-4">
                        <h3 className="font-medium">Billing Address</h3>
                        <div>
                          <Label htmlFor="billingAddress">Address</Label>
                          <Input
                            id="billingAddress"
                            value={formData.billingAddress}
                            onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                            placeholder="123 Main Street"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={formData.city}
                              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                              placeholder="New York"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={formData.zipCode}
                              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                              placeholder="10001"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Security Notice */}
                  <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Secure Payment</p>
                      <p className="text-blue-700">Your payment information is encrypted and secure</p>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={processing}>
                    {processing ? "Processing..." : `Pay $${appointment.total_amount.toFixed(2)}`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Service Details */}
                <div className="flex items-center space-x-3">
                  <img
                    src={appointment.service?.image_url || "/placeholder.svg"}
                    alt={appointment.service?.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{appointment.service?.name}</p>
                    <p className="text-sm text-gray-600">{appointment.service?.duration} minutes</p>
                  </div>
                </div>

                {/* Provider Details */}
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={appointment.provider?.avatar_url || "/placeholder.svg"}
                      alt={appointment.provider?.full_name}
                    />
                    <AvatarFallback>{appointment.provider?.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{appointment.provider?.full_name}</p>
                    <p className="text-sm text-gray-600">Service Provider</p>
                  </div>
                </div>

                <Separator />

                {/* Appointment Details */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(appointment.appointment_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{appointment.client?.full_name}</span>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service Price</span>
                    <span>${appointment.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${appointment.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Cancellation Policy */}
                <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
                  <p className="font-medium mb-1">Cancellation Policy</p>
                  <p>Free cancellation up to 24 hours before the appointment. Late cancellations may incur charges.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
