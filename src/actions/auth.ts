'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

type AuthState = { error?: string; success?: boolean } | null

export async function registerUser(prevState: AuthState, formData: FormData): Promise<AuthState> {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Register attempt:", { name, email, passwordLength: password?.length })

    if (!name || !email || !password) {
      return { error: "Vui lòng điền đầy đủ thông tin" }
    }

    if (password.length < 6) {
      return { error: "Mật khẩu phải có ít nhất 6 ký tự" }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    console.log("Existing user check:", existingUser)

    if (existingUser) {
      return { error: "Email này đã được đăng ký" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    console.log("Password hashed successfully")

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })
    console.log("User created:", newUser)

    return { success: true }
  } catch (error) {
    console.error("Register error:", error)
    return { error: "Đã có lỗi xảy ra. Vui lòng thử lại." }
  }
}

// Logout action
export async function logoutAction() {
  const { signOut } = await import("@/auth")
  await signOut({ redirectTo: "/" })
}


export async function loginWithCredentials(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/courses"
    })
    return null
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email hoặc mật khẩu không chính xác" }
        default:
          return { error: "Đã có lỗi xảy ra" }
      }
    }
    throw error // Re-throw for redirect
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/courses" })
}
