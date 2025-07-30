"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, Star, Phone, Mail, CreditCard } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getServiceById, getUserById, getReviewsByProvider, mockPromotions } from "@/lib/mock-data"

export default function BookServicePage() {
  const params = useParams()
  const router = useRouter()
  const serviceId = params.serviceId as string

  const [service, setService] = useState<any>(null)
  const [provider, setProvider] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [step, setStep] = useState(1) // 1: Service Info, 2: Date/Time, 3: Payment

  useEffect(() => {
    const loadData = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)

      const serviceData = getServiceById(serviceId)
      if (serviceData) {
        setService(serviceData)
        const providerData = getUserById(serviceData.provider_id)
        setProvider(providerData)

        const providerReviews = getReviewsByProvider(serviceData.provider_id).map((review) => ({
          ...review,
          client: getUserById(review.client_id),
        }))
        setReviews(providerReviews)
      }
    }
    loadData()
  }, [serviceId])

  const applyPromoCode = () => {
    const promo = mockPromotions.find((p) => p.code === promoCode && p.is_active && new Date(p.end_date) > new Date())

    if (promo && service) {
      if (service.price >= (promo.min_amount || 0)) {
        const discountAmount =
          promo.discount_type === "percentage" ? (service.price * promo.discount_value) / 100 : promo.discount_value
        setDiscount(Math.min(discountAmount, service.price))
      } else {
        alert(`Minimum amount required: $${promo.min_amount}`)
      }
    } else {
      alert("Invalid or expired promo code")
    }
  }

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select date and time")
      return
    }

    // Create appointment
    const appointmentData = {
      service_id: serviceId,
      provider_id: service.provider_id,
      client_id: user.id,
      appointment_date: new Date(`${selectedDate.toDateString()} ${selectedTime}`).toISOString(),
      notes,
      total_amount: service.price - discount,
      commission_amount: (service.price - discount) * 0.1, // 10% commission
      status: "pending",
    }

    // In real app, this would be sent to backend
    console.log("Booking appointment:", appointmentData)

    // Redirect to payment
    setStep(3)
  }

  const handlePayment = () => {
    // In real app, integrate with Stripe or other payment processor
    alert("Payment successful! Your appointment has been booked.")
    router.push("/client/appointments")
  }

  if (!service || !provider) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  const finalPrice = service.price - discount

  // Generate available time slots
  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && (
              <>
                {/* Service Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <img
                        src={service.image_url || "/placeholder.svg"}
                        alt={service.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-2xl">{service.name}</CardTitle>
                        <CardDescription className="text-lg mt-2">{service.description}</CardDescription>
                        <div className="flex items-center space-x-4 mt-4">
                          <Badge variant="secondary">{service.category?.name}</Badge>
                          <span className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration} minutes
                          </span>
                          <span className="text-2xl font-bold text-green-600">${service.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Provider Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>About the Provider</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={provider.avatar_url || "/placeholder.svg"} alt={provider.full_name} />
                        <AvatarFallback className="text-lg">{provider.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{provider.full_name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium">{averageRating.toFixed(1)}</span>
                            <span className="text-gray-500 ml-1">({reviews.length} reviews)</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {provider.email}
                          </span>
                          {provider.phone && (
                            <span className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {provider.phone}
                            </span>
                          )}
                        </div>
                        {provider.bio && <p className="mt-3 text-gray-600">{provider.bio}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews */}
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews ({reviews.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="border-b pb-4 last:border-b-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={review.client?.avatar_url || "/placeholder.svg"}
                                alt={review.client?.full_name}
                              />
                              <AvatarFallback className="text-sm">{review.client?.full_name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{review.client?.full_name}</p>
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={() => setStep(2)} className="w-full" size="lg">
                  Continue to Booking
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                {/* Date & Time Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Date & Time</CardTitle>
                    <CardDescription>Choose your preferred appointment slot</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
                        className="rounded-md border"
                      />
                    </div>

                    {selectedDate && (
                      <div>
                        <Label>Select Time</Label>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="notes">Special Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requests or notes for the provider..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleBooking} className="flex-1" disabled={!selectedDate || !selectedTime}>
                    Continue to Payment
                  </Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Complete your booking payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input id="expiry" placeholder="MM/YY" />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handlePayment} className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ${finalPrice.toFixed(2)}
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={service.image_url || "/placeholder.svg"}
                    alt={service.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={provider.avatar_url || "/placeholder.svg"} alt={provider.full_name} />
                    <AvatarFallback>{provider.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{provider.full_name}</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{selectedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{selectedTime}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between">
                    <span>Service Price</span>
                    <span>${service.price.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>${finalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {step < 3 && (
                  <div className="pt-4 border-t">
                    <Label htmlFor="promo">Promo Code</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="promo"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                      />
                      <Button variant="outline" size="sm" onClick={applyPromoCode}>
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
