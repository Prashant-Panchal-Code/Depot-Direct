# .NET API JWT Authentication Integration

## Overview

This document outlines the integration of your Next.js application with your .NET API's JWT authentication system. The integration replaces the previous mock authentication with real API calls to your .NET backend.

## Changes Made

### 1. Updated Login API Route (`/src/app/api/auth/login/route.ts`)

**Key Changes:**
- Replaced mock login with real .NET API call to `http://localhost:5204/api/Auth/login`
- Stores JWT token from .NET API response in HTTP-only cookie
- Maps .NET user data structure to frontend format
- Handles authentication errors properly

**API Integration:**
```typescript
// Calls your .NET API endpoint
const dotNetResponse = await fetch('http://localhost:5204/api/Auth/login', {
  method: 'POST',
  headers: {
    'accept': 'text/plain',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
})
```

### 2. Updated Session API Route (`/src/app/api/auth/session/route.ts`)

**Key Changes:**
- Decodes JWT tokens from your .NET API
- Maps .NET JWT claims to frontend user structure
- Handles token expiration checking

**JWT Token Mapping:**
- `nameid` → `id` (User ID)
- `unique_name` → `name` (Full Name)
- `email` → `email` (Email)
- `role` → `role` (User Role)
- `CompanyId` → `company_id` (Company ID)

### 3. Updated API Configuration (`/src/lib/api/config.ts`)

**Key Changes:**
- Changed ADMIN module from Basic auth to Bearer token
- Updated `getAuthHeaders()` to use Bearer tokens only
- Both ADMIN and USER modules now use JWT authentication

### 4. New API Client (`/src/lib/api/client.ts`)

**Features:**
- Automatically includes JWT token from cookies
- Provides convenient methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`
- Handles authentication errors
- Type-safe API responses

**Usage Example:**
```typescript
import { api } from '@/lib/api/client'

// Get regions with authentication
const { data, error } = await api.get('ADMIN', '/regions')

// Create new company
const { data, error } = await api.post('ADMIN', '/companies', {
  name: 'New Company',
  country: 'US'
})
```

### 5. Updated User Interface

**Enhanced User Type:**
```typescript
export interface User {
  id: number | string
  email: string
  role: string
  name: string
  company_id: number
  companyName?: string
  roleId?: number
  phone?: string
  active?: boolean
}
```

### 6. Authentication Utilities (`/src/lib/auth.ts`)

**New Function:**
- `getTokenFromCookies()` - Client-side token retrieval from cookies

## Test Pages Created

### 1. Login Test Page (`/test-login-real`)
- Tests login with your real credentials
- Shows complete authentication flow
- Displays user data after successful login

### 2. API Test Page (`/test-api`)
- Tests authenticated API calls to regions endpoint
- Demonstrates how to use the new API client
- Shows user context and role-based access

## How to Use

### 1. Login Flow

The login now works with your real .NET API:

```typescript
import { loginUser } from '@/hooks/useUser'

const handleLogin = async () => {
  const result = await loginUser('prashant619panchal@gmail.com', 'Ronaldo07!')
  if (result.success) {
    // User is logged in, JWT token stored in cookie
    // Redirect to appropriate page based on role
  }
}
```

### 2. Making Authenticated API Calls

```typescript
import { api } from '@/lib/api/client'

// The token is automatically included from cookies
const { data, error } = await api.get('ADMIN', '/regions')

if (error) {
  console.error('API Error:', error)
} else {
  console.log('Regions:', data)
}
```

### 3. Role-Based Access

The middleware automatically handles role-based routing:
- Admin users: Access to `/admin/*` routes
- Regular users: Access to `/dashboard`, `/vehicles`, etc.
- Unauthorized access redirected to `/unauthorized`

## JWT Token Structure

Your .NET API JWT tokens contain these claims:
- `nameid`: User ID
- `unique_name`: Full name
- `email`: Email address
- `role`: User role (admin, etc.)
- `RoleId`: Numeric role ID
- `CompanyId`: Company ID
- `exp`: Token expiration
- `iat`: Issued at time

## Testing

### Test Login Integration
Visit: `http://localhost:3000/test-login-real`
- Tests login with your credentials
- Shows session data
- Verifies token storage

### Test API Calls
Visit: `http://localhost:3000/test-api`
- Tests authenticated API calls
- Shows regions data from your .NET API
- Demonstrates role-based access

## Security Features

- **HTTP-only cookies**: JWT tokens stored securely
- **Automatic token inclusion**: API client handles authentication
- **Role-based routing**: Middleware enforces access control (case-insensitive)
- **Token expiration**: Automatic token validation
- **Error handling**: Proper error responses for auth failures
- **Case-insensitive role checking**: Works with "Admin", "admin", etc.

## Environment Variables

Make sure your .NET API is running on `http://localhost:5204` or update the URLs in:
- `/src/app/api/auth/login/route.ts`
- `/src/lib/api/config.ts`

## Next Steps

1. **Test the login**: Use the test pages to verify everything works
2. **Update other components**: Replace any hardcoded API calls with the new `api` client
3. **Handle token refresh**: Consider implementing token refresh logic if needed
4. **Production settings**: Update URLs and security settings for production

## Migration Summary

✅ **Completed:**
- Login integration with .NET API
- JWT token handling
- Session management
- API client with authentication
- Role-based access control
- Test pages for verification

✅ **Ready to use:**
- Real authentication with your .NET API
- Automatic token handling for API calls
- Secure token storage in HTTP-only cookies
- Role-based route protection