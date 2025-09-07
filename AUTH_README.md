# Authentication System Documentation

This is a development authentication system for the Depot Direct Next.js application. It provides JWT-based authentication with role-based access control.

## 🚨 Development Only

**This authentication system is for development and testing purposes only. Do not use in production without proper security enhancements.**

## Features

- JWT-based authentication with HTTP-only cookies
- Role-based access control (admin vs. regular users)
- App Router middleware for route protection
- Client-side user context and hooks
- Admin-only routes and layouts

## Quick Start

1. **Install dependencies** (already done):
   ```bash
   npm install jsonwebtoken @types/jsonwebtoken
   ```

2. **Set environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your JWT secret
   ```

3. **Test the system**:
   - Visit `/login` to access the login page
   - Use `admin@example.com` for admin access
   - Use `user@example.com` for regular user access
   - Any password works in development mode

## File Structure

```
middleware.ts                    # Route protection middleware
src/
├── lib/
│   └── auth.ts                 # JWT utilities and helpers
├── hooks/
│   └── useUser.ts              # Client-side user state hook
├── app/
│   ├── layout.tsx              # Root layout with UserProvider
│   ├── login/page.tsx          # Login page
│   ├── unauthorized/page.tsx   # Access denied page
│   ├── (admin)/               # Admin route group
│   │   ├── layout.tsx         # Admin layout with sidebar
│   │   ├── admin/page.tsx     # Admin dashboard
│   │   └── org-setup/page.tsx # Organization setup
│   ├── components/
│   │   └── UserProvider.tsx   # User context provider
│   └── api/auth/
│       ├── session/route.ts   # Session endpoint
│       └── login/route.ts     # Login/logout endpoints
```

## API Endpoints

### `GET /api/auth/session`
Returns current user session information.

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "role": "admin",
    "name": "admin",
    "company_id": 1
  }
}
```

### `POST /api/auth/login`
Development login endpoint.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "any-password"
}
```

**Response:**
```json
{
  "ok": true,
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "role": "admin",
    "name": "admin",
    "company_id": 1
  }
}
```

### `DELETE /api/auth/login`
Logout endpoint - clears the authentication cookie.

## Client-Side Usage

### useUser Hook

```typescript
import { useUser } from '@/hooks/useUser'

function MyComponent() {
  const { user, loading, isAdmin, isAuthenticated } = useUser()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {isAdmin && <AdminPanel />}
    </div>
  )
}
```

### Login/Logout Helpers

```typescript
import { loginUser, logoutUser } from '@/hooks/useUser'

// Login
const result = await loginUser('admin@example.com', 'password')
if (result.success) {
  // Redirect or update UI
}

// Logout
await logoutUser() // Automatically redirects to login
```

## Testing

### CURL Examples

**Login as admin:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"test"}'
```

**Check session:**
```bash
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: token=YOUR_TOKEN_HERE"
```

**Logout:**
```bash
curl -X DELETE http://localhost:3000/api/auth/login
```

### Test Routes

- `/login` - Login page (public)
- `/dashboard` - Protected route (requires authentication)
- `/admin` - Admin dashboard (admin only)
- `/org-setup` - Organization setup (admin only)
- `/unauthorized` - Access denied page

## Route Protection

The middleware automatically protects routes based on:

1. **Public routes**: `/`, `/login`, `/register`, `/unauthorized`
2. **Protected routes**: All other routes require authentication
3. **Admin routes**: `/admin/*`, `/org-setup` require admin role

## Security Considerations

### Current Implementation
- ✅ HTTP-only cookies
- ✅ JWT token verification
- ✅ Route-based protection
- ✅ Role-based access control

### ⚠️ Production Requirements
- [ ] Strong JWT secret (use `openssl rand -base64 32`)
- [ ] HTTPS only (Secure cookie flag)
- [ ] Password hashing (bcrypt/argon2)
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Session management
- [ ] Refresh token rotation
- [ ] Input validation and sanitization

## Migration to Production

### Option 1: NextAuth.js (Recommended)

1. Install NextAuth.js:
   ```bash
   npm install next-auth
   ```

2. Replace middleware:
   ```typescript
   import { withAuth } from "next-auth/middleware"

   export default withAuth(
     function middleware(req) {
       if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
         return NextResponse.rewrite(new URL("/unauthorized", req.url))
       }
     },
     {
       callbacks: {
         authorized: ({ token }) => !!token
       },
     }
   )
   ```

3. Update user hook:
   ```typescript
   import { useSession } from 'next-auth/react'

   export function useUser() {
     const { data: session, status } = useSession()
     return {
       user: session?.user || null,
       loading: status === 'loading',
       isAdmin: session?.user?.role === 'admin',
       isAuthenticated: !!session?.user
     }
   }
   ```

### Option 2: Auth0, Supabase, or Firebase Auth

Follow the respective documentation for your chosen provider and update the middleware and hooks accordingly.

## Environment Variables

```bash
# Required
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Optional
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**: Make sure all dependencies are installed
2. **Middleware not working**: Check that middleware.ts is in the project root
3. **Cookies not set**: Ensure you're testing with the same domain/port
4. **Admin routes accessible to non-admins**: Check middleware config and JWT payload

### Debug Tips

1. **Check middleware logs**: Look for console.error messages in the terminal
2. **Inspect cookies**: Use browser dev tools to check cookie values
3. **Test API endpoints**: Use CURL or Postman to test auth endpoints directly
4. **Check JWT payload**: Decode tokens at jwt.io (development only)

## Contributing

This is a development stub. For production use:

1. Replace with a proper authentication provider
2. Implement proper security measures
3. Add comprehensive testing
4. Add audit logging
5. Implement proper error handling

## Support

For questions about this authentication system, please refer to:
- Next.js App Router documentation
- NextAuth.js documentation (for production migration)
- JWT.io for token debugging (development only)
