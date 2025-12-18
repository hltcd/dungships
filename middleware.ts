import { auth } from "@/auth"
import { NextResponse } from "next/server"

// Route classification
const publicRoutes = [
  "/",
  "/courses",
  "/source-code",
  "/pro",
]

// Routes that should redirect logged-in users away
const authRoutes = [
  "/login",
  "/register",
]

// Routes that require ADMIN role
const adminRoutes = [
  "/admin",
]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  const pathname = nextUrl.pathname

  console.log("🔍 Middleware:", {
    pathname,
    isLoggedIn,
    userRole,
    userEmail: req.auth?.user?.email
  })

  // Check route types
  const isPublicRoute = publicRoutes.some(route => pathname === route) || 
                        pathname.startsWith("/courses/") || 
                        pathname.startsWith("/source-code/") ||
                        pathname.startsWith("/api/")
  const isAuthRoute = authRoutes.includes(pathname)
  const isAdminRoute = pathname.startsWith("/admin")

  // 1. Auth routes: redirect logged-in users to /courses
  if (isAuthRoute) {
    console.log("🔐 Auth route detected. isLoggedIn:", isLoggedIn)
    if (isLoggedIn) {
      console.log("⚠️ SHOULD REDIRECT logged-in user away from", pathname)
      return NextResponse.redirect(new URL("/courses", nextUrl))
    }
    return NextResponse.next()
  }

  // 2. Admin routes: require ADMIN role
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl))
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", nextUrl))
    }
    return NextResponse.next()
  }

  // 3. Public routes: allow everyone
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // 4. Default: allow (pages will handle their own auth)
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
}
