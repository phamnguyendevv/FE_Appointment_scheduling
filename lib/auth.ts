import { mockUsers } from "./mock-data"

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: "provider" | "client" = "client",
) {
  // Check if user already exists
  const existingUser = mockUsers.find((user) => user.email === email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Create new user
  const newUser = {
    id: `${role}-${Date.now()}`,
    email,
    password,
    full_name: fullName,
    phone: null,
    avatar_url: "/placeholder.svg?height=40&width=40",
    role,
    is_approved: role === "client", // Auto-approve clients, providers need admin approval
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // In a real app, this would be saved to database
  mockUsers.push(newUser)
  return newUser
}

export async function signIn(email: string, password: string) {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  if (!user) {
    throw new Error("Invalid credentials")
  }

  if (!user.is_approved) {
    throw new Error("Account not approved yet")
  }

  return user
}

export async function getCurrentUser() {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("currentUser")
    return userStr ? JSON.parse(userStr) : null
  }
  return null
}

export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}
