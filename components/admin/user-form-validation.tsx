"use client"

export const validateUserForm = (formData: any, existingUsers: any[], isEditing = false, currentUserId?: string) => {
  const errors: Record<string, string> = {}

  // Required fields
  if (!formData.full_name?.trim()) {
    errors.full_name = "Full name is required"
  }

  if (!formData.email?.trim()) {
    errors.email = "Email is required"
  } else {
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    } else {
      // Check for duplicate email
      const existingUser = existingUsers.find(
        (user) =>
          user.email.toLowerCase() === formData.email.toLowerCase() && (!isEditing || user.id !== currentUserId),
      )
      if (existingUser) {
        errors.email = "This email is already registered"
      }
    }
  }

  if (!formData.password?.trim() && !isEditing) {
    errors.password = "Password is required"
  } else if (formData.password && formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
  }

  if (!formData.role) {
    errors.role = "Role is required"
  }

  // Phone validation (optional but if provided, should be valid)
  if (formData.phone && formData.phone.trim()) {
    const phoneRegex = /^\+?[\d\s\-$$$$]+$/
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number"
    }
  }

  // Email validation
  if (formData.email && formData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const generateRandomPassword = (length = 12): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
  let password = ""
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export const formatUserData = (formData: any, isNew = true) => {
  const userData = {
    ...formData,
    full_name: formData.full_name?.trim(),
    email: formData.email?.toLowerCase().trim(),
    phone: formData.phone?.trim() || null,
    bio: formData.bio?.trim() || null,
    location: formData.location?.trim() || null,
    updated_at: new Date().toISOString(),
  }

  if (isNew) {
    userData.id = `${formData.role}-${Date.now()}`
    userData.created_at = new Date().toISOString()
    userData.avatar_url = "/placeholder.svg?height=40&width=40"
  }

  return userData
}
