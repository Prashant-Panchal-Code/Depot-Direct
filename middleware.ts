import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Debug logging
  console.log(`🚀 MIDDLEWARE RUNNING FOR: ${path}`)
  
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/login-test', '/login-test2']
  
  // Allow public paths
  if (publicPaths.includes(path)) {
    console.log(`✅ ALLOWING ACCESS TO LOGIN`)
    return NextResponse.next()
  }
  
  // Get token from cookie
  const token = request.cookies.get('token')?.value
  
  console.log(`🔍 MIDDLEWARE - Token present:`, !!token)
  console.log(`🔍 MIDDLEWARE - All cookies:`, request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
  console.log(`🔍 MIDDLEWARE - Request headers:`, Object.fromEntries(request.headers.entries()))
  if (token) {
    console.log(`� MIDDLEWARE - Token preview:`, token.substring(0, 20) + '...')
  } else {
    console.log(`🔍 MIDDLEWARE - No token found in cookies`)
  }
  
  if (!token) {
    // No token, redirect to login
    console.log(`🚫 BLOCKING ACCESS TO: ${path}`)
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // For now, just check if token exists (basic check)
  // TODO: Add proper JWT verification when Edge Runtime crypto issue is resolved
  try {
    // Basic token format check
    if (token.split('.').length !== 3) {
      throw new Error('Invalid token format')
    }
    
    // Decode payload without verification (temporary)
    const payload = JSON.parse(atob(token.split('.')[1]))
    
    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error('Token expired')
    }
    
    // Admin routes that require admin role
    const adminPaths = ['/admin', '/users', '/data-management', '/org-setup', '/countries', '/companies', '/regions', '/admin-users', '/assignments', '/import-export']
    
    // Regular user routes that should redirect admin users to admin equivalent
    const regularUserPaths = ['/dashboard', '/schedule', '/vehicles', '/depot', '/sites', '/parking', '/reports']
    
    // Check if this is an admin route (case-insensitive role check)
    const userRole = payload.role?.toLowerCase()
    const isAdmin = userRole === 'admin'
    
    if (adminPaths.some(adminPath => path.startsWith(adminPath))) {
      if (!isAdmin) {
        console.log(`🚫 ADMIN ACCESS DENIED FOR: ${path} (role: ${payload.role})`)
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    }
    
    // If admin user tries to access regular user routes, redirect to admin dashboard
    if (isAdmin && regularUserPaths.some(userPath => path.startsWith(userPath))) {
      console.log(`🔄 REDIRECTING ADMIN FROM USER ROUTE ${path} TO ADMIN DASHBOARD`)
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    
    // If regular user tries to access admin routes, redirect to unauthorized
    if (!isAdmin && adminPaths.some(adminPath => path.startsWith(adminPath))) {
      console.log(`🚫 USER ACCESS DENIED FOR ADMIN ROUTE: ${path} (role: ${payload.role})`)
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    
    // Token exists and is valid format, allow access
    console.log(`✅ ACCESS GRANTED TO: ${path} (role: ${payload.role})`)
    return NextResponse.next()
  } catch (error) {
    // Invalid token, redirect to login
    console.error('Token check failed:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (all API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.ico).*)',
  ],
}
