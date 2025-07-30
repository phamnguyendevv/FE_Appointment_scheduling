import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Star, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Book Your Perfect Appointment</h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Connect with service providers and schedule appointments effortlessly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/client/search">Find Services</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
                asChild
              >
                <Link href="/auth/register?role=provider">Become a Provider</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600">Everything you need to manage appointments efficiently</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Easy Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Book appointments with just a few clicks. Real-time availability and instant confirmation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Trusted Providers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All service providers are verified and approved by our admin team for quality assurance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Read genuine reviews and ratings from other clients to make informed decisions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get help whenever you need it with our round-the-clock customer support team.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of satisfied users who trust our platform</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/auth/register">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
