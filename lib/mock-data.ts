// Mock data for the entire application
export const mockUsers = [
  {
    id: "admin-1",
    email: "admin@example.com",
    password: "admin123",
    full_name: "System Admin",
    phone: "+1234567890",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "admin" as const,
    is_approved: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "provider-1",
    email: "provider@example.com",
    password: "provider123",
    full_name: "Sarah Johnson",
    phone: "+1234567891",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "provider" as const,
    is_approved: true,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
  },
  {
    id: "provider-2",
    email: "mike@example.com",
    password: "mike123",
    full_name: "Mike Wilson",
    phone: "+1234567892",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "provider" as const,
    is_approved: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z",
  },
  {
    id: "provider-3",
    email: "alex@example.com",
    password: "alex123",
    full_name: "Alex Rodriguez",
    phone: "+1234567893",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "provider" as const,
    is_approved: true,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z",
  },
  {
    id: "client-1",
    email: "client@example.com",
    password: "client123",
    full_name: "Jane Client",
    phone: "+0987654321",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "client" as const,
    is_approved: true,
    created_at: "2024-01-05T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "client-2",
    email: "john@example.com",
    password: "john123",
    full_name: "John Doe",
    phone: "+0987654322",
    avatar_url: "/placeholder.svg?height=40&width=40",
    role: "client" as const,
    is_approved: true,
    created_at: "2024-01-06T00:00:00Z",
    updated_at: "2024-01-06T00:00:00Z",
  },
];

export const mockCategories = [
  {
    id: "cat-1",
    name: "Beauty & Spa",
    description: "Beauty and spa services",
    icon: "Sparkles",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Healthcare",
    description: "Medical and healthcare services",
    icon: "Heart",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Fitness",
    description: "Fitness and wellness services",
    icon: "Dumbbell",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Education",
    description: "Educational and tutoring services",
    icon: "BookOpen",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Business",
    description: "Business and professional services",
    icon: "Briefcase",
    created_at: "2024-01-01T00:00:00Z",
  },
];

export const mockServices = [
  {
    id: "service-1",
    provider_id: "provider-1",
    category_id: "cat-1",
    name: "Hair Cut & Styling",
    description:
      "Professional hair cutting and styling service with the latest trends and techniques. Perfect for any occasion.",
    price: 50,
    duration: 60,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "service-2",
    provider_id: "provider-2",
    category_id: "cat-1",
    name: "Relaxing Massage",
    description:
      "Full body relaxing massage to relieve stress and tension. Perfect for unwinding after a long day.",
    price: 80,
    duration: 90,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-11T00:00:00Z",
    updated_at: "2024-01-11T00:00:00Z",
  },
  {
    id: "service-3",
    provider_id: "provider-3",
    category_id: "cat-3",
    name: "Personal Training",
    description:
      "One-on-one personal training session tailored to your fitness goals and current level.",
    price: 75,
    duration: 60,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-12T00:00:00Z",
    updated_at: "2024-01-12T00:00:00Z",
  },
  {
    id: "service-4",
    provider_id: "provider-1",
    category_id: "cat-2",
    name: "Dental Checkup",
    description:
      "Comprehensive dental examination including cleaning and oral health assessment.",
    price: 120,
    duration: 45,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-13T00:00:00Z",
    updated_at: "2024-01-13T00:00:00Z",
  },
  {
    id: "service-5",
    provider_id: "provider-2",
    category_id: "cat-4",
    name: "Math Tutoring",
    description:
      "Expert math tutoring for high school and college students. All levels welcome.",
    price: 40,
    duration: 60,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-14T00:00:00Z",
    updated_at: "2024-01-14T00:00:00Z",
  },
  {
    id: "service-6",
    provider_id: "provider-3",
    category_id: "cat-5",
    name: "Business Consulting",
    description:
      "Strategic business consulting to help grow your business and improve operations.",
    price: 150,
    duration: 120,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "service-7",
    provider_id: "provider-1",
    category_id: "cat-1",
    name: "Facial Treatment",
    description:
      "Deep cleansing facial treatment for all skin types. Includes exfoliation and moisturizing.",
    price: 65,
    duration: 75,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-16T00:00:00Z",
    updated_at: "2024-01-16T00:00:00Z",
  },
  {
    id: "service-8",
    provider_id: "provider-2",
    category_id: "cat-3",
    name: "Yoga Class",
    description:
      "Relaxing yoga session suitable for beginners and advanced practitioners.",
    price: 30,
    duration: 60,
    image_url: "/placeholder.svg?height=200&width=300",
    is_active: true,
    created_at: "2024-01-17T00:00:00Z",
    updated_at: "2024-01-17T00:00:00Z",
  },
];

export const mockAppointments = [
  {
    id: "apt-1",
    client_id: "client-1",
    provider_id: "provider-1",
    service_id: "service-1",
    appointment_date: "2024-02-15T14:00:00Z",
    status: "confirmed" as const,
    notes: "First time client, please be gentle",
    total_amount: 50,
    commission_amount: 5,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "apt-2",
    client_id: "client-1",
    provider_id: "provider-2",
    service_id: "service-2",
    appointment_date: "2024-02-16T10:00:00Z",
    status: "pending" as const,
    notes: "Need relaxing massage after work stress",
    total_amount: 80,
    commission_amount: 8,
    created_at: "2024-02-02T00:00:00Z",
    updated_at: "2024-02-02T00:00:00Z",
  },
  {
    id: "apt-3",
    client_id: "client-2",
    provider_id: "provider-1",
    service_id: "service-1",
    appointment_date: "2024-01-20T16:00:00Z",
    status: "completed" as const,
    notes: "Regular customer",
    total_amount: 50,
    commission_amount: 5,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "apt-4",
    client_id: "client-1",
    provider_id: "provider-3",
    service_id: "service-3",
    appointment_date: "2024-01-25T09:00:00Z",
    status: "completed" as const,
    notes: "Focus on cardio training",
    total_amount: 75,
    commission_amount: 7.5,
    created_at: "2024-01-20T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z",
  },
  {
    id: "apt-5",
    client_id: "client-2",
    provider_id: "provider-2",
    service_id: "service-5",
    appointment_date: "2024-02-20T15:00:00Z",
    status: "confirmed" as const,
    notes: "Help with calculus homework",
    total_amount: 40,
    commission_amount: 4,
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z",
  },
  {
    id: "apt-6",
    client_id: "client-1",
    provider_id: "provider-1",
    service_id: "service-7",
    appointment_date: "2024-01-18T11:00:00Z",
    status: "cancelled" as const,
    notes: "Client cancelled due to emergency",
    total_amount: 65,
    commission_amount: 6.5,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-18T00:00:00Z",
  },
];

export const mockReviews = [
  {
    id: "review-1",
    client_id: "client-2",
    provider_id: "provider-1",
    service_id: "service-1",
    appointment_id: "apt-3",
    rating: 5,
    comment:
      "Excellent service! Very professional and the results exceeded my expectations.",
    created_at: "2024-01-21T00:00:00Z",
  },
  {
    id: "review-2",
    client_id: "client-1",
    provider_id: "provider-3",
    service_id: "service-3",
    appointment_id: "apt-4",
    rating: 4,
    comment:
      "Great workout session. Alex really knows how to motivate and push you to your limits.",
    created_at: "2024-01-26T00:00:00Z",
  },
  {
    id: "review-3",
    client_id: "client-2",
    provider_id: "provider-2",
    service_id: "service-2",
    appointment_id: "apt-6",
    rating: 5,
    comment:
      "Amazing massage! I felt so relaxed afterwards. Will definitely book again.",
    created_at: "2024-01-28T00:00:00Z",
  },
];

export const mockNotifications = [
  {
    id: "notif-1",
    user_id: "provider-1",
    title: "New Appointment Booked",
    message:
      "Jane Client has booked Hair Cut & Styling for Feb 15, 2024 at 2:00 PM",
    type: "appointment",
    is_read: false,
    created_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "notif-2",
    user_id: "client-1",
    title: "Appointment Confirmed",
    message:
      "Your Hair Cut & Styling appointment has been confirmed for Feb 15, 2024 at 2:00 PM",
    type: "appointment",
    is_read: true,
    created_at: "2024-02-01T01:00:00Z",
  },
  {
    id: "notif-3",
    user_id: "provider-2",
    title: "Payment Received",
    message: "Payment of $80 received for Relaxing Massage service",
    type: "payment",
    is_read: false,
    created_at: "2024-02-02T00:00:00Z",
  },
];

export const mockFavorites = [
  {
    id: "fav-1",
    client_id: "client-1",
    service_id: "service-1",
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "fav-2",
    client_id: "client-1",
    service_id: "service-2",
    created_at: "2024-01-21T00:00:00Z",
  },
  {
    id: "fav-3",
    client_id: "client-2",
    service_id: "service-3",
    created_at: "2024-01-22T00:00:00Z",
  },
];

export const mockPromotions = [
  {
    id: "promo-1",
    provider_id: "provider-1",
    code: "WELCOME20",
    description: "20% off for new customers",
    discount_type: "percentage" as const,
    discount_value: 20,
    min_amount: 30,
    max_uses: 100,
    used_count: 15,
    start_date: "2024-01-01T00:00:00Z",
    end_date: "2024-12-31T23:59:59Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "promo-2",
    provider_id: "provider-2",
    code: "RELAX10",
    description: "$10 off massage services",
    discount_type: "fixed" as const,
    discount_value: 10,
    min_amount: 50,
    max_uses: 50,
    used_count: 8,
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-02-29T23:59:59Z",
    is_active: true,
    created_at: "2024-02-01T00:00:00Z",
  },
];

// New mock data for refunds
export const mockRefunds = [
  {
    id: "refund-1",
    appointment_id: "apt-6",
    client_id: "client-1",
    provider_id: "provider-1",
    amount: 65,
    reason: "Service was cancelled by provider",
    status: "approved" as const,
    requested_at: "2024-01-18T12:00:00Z",
    processed_at: "2024-01-18T14:00:00Z",
    admin_notes: "Approved due to provider cancellation",
    refund_method: "original_payment" as const,
  },
  {
    id: "refund-2",
    appointment_id: "apt-4",
    client_id: "client-1",
    provider_id: "provider-3",
    amount: 75,
    reason: "Service quality was not satisfactory",
    status: "pending" as const,
    requested_at: "2024-01-26T10:00:00Z",
    processed_at: null,
    admin_notes: null,
    refund_method: "original_payment" as const,
  },
  {
    id: "refund-3",
    appointment_id: "apt-3",
    client_id: "client-2",
    provider_id: "provider-1",
    amount: 25,
    reason: "Partial refund for late service",
    status: "rejected" as const,
    requested_at: "2024-01-21T09:00:00Z",
    processed_at: "2024-01-21T15:00:00Z",
    admin_notes: "Service was completed as scheduled",
    refund_method: "original_payment" as const,
  },
];

// Helper functions to get related data
export const getUserById = (id: string) =>
  mockUsers.find((user) => user.id === id);
export const getServiceById = (id: string) =>
  mockServices.find((service) => service.id === id);
export const getCategoryById = (id: string) =>
  mockCategories.find((category) => category.id === id);
export const getAppointmentById = (id: string) =>
  mockAppointments.find((appointment) => appointment.id === id);

export const getServicesByProvider = (providerId: string) =>
  mockServices.filter((service) => service.provider_id === providerId);

export const getAppointmentsByClient = (clientId: string) =>
  mockAppointments.filter((appointment) => appointment.client_id === clientId);

export const getAppointmentsByProvider = (providerId: string) =>
  mockAppointments.filter(
    (appointment) => appointment.provider_id === providerId
  );

export const getReviewsByProvider = (providerId: string) =>
  mockReviews.filter((review) => review.provider_id === providerId);

export const getFavoritesByClient = (clientId: string) =>
  mockFavorites.filter((favorite) => favorite.client_id === clientId);

export const getNotificationsByUser = (userId: string) =>
  mockNotifications.filter((notification) => notification.user_id === userId);

export const getPromotionsByProvider = (providerId: string) =>
  mockPromotions.filter((promotion) => promotion.provider_id === providerId);

// New helper functions for refunds
export const getRefundsByClient = (clientId: string) =>
  mockRefunds.filter((refund) => refund.client_id === clientId);

export const getRefundsByProvider = (providerId: string) =>
  mockRefunds.filter((refund) => refund.provider_id === providerId);

export const getRefundByAppointment = (appointmentId: string) =>
  mockRefunds.find((refund) => refund.appointment_id === appointmentId);

export const getAllRefunds = () => mockRefunds;
