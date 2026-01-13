# Authentication System Documentation

## Overview
Complete authentication system with JWT-based login, signup, password management, and role-based access control.

## Features

### ✅ User Registration (Signup)
- Email validation
- Password strength validation (min 6 characters)
- Role-based registration
- Duplicate email prevention
- Teachers CANNOT self-register (managed by School Admin)

### ✅ User Login
- Email/password authentication
- JWT token generation (7-day expiry)
- Account status verification
- Secure password comparison

### ✅ Protected Routes
- JWT token verification
- User authentication middleware
- Role-based authorization
- Account status checking

### ✅ Password Management
- Change password functionality
- Current password verification
- Password hashing with bcrypt

### ✅ User Profile
- Get current user details
- Last login tracking
- Profile photo support

## API Endpoints

### Public Routes

#### 1. **Signup** (POST `/api/auth/signup`)
```json
// Request
{
  "name": "John Doe",
  "email": "john@school.com",
  "password": "password123",
  "role": "SCHOOL_ADMIN"
}

// Response (Success)
{
  "success": true,
  "message": "Signup successful! You can now log in."
}

// Response (Error)
{
  "success": false,
  "message": "Email already in use"
}
```

**Valid Roles for Signup:**
- `SCHOOL_ADMIN`
- `SUPER_ADMIN`
- `STUDENT`
- `PARENT`
- `ACCOUNTS_HR`

**Note:** `TEACHER` role is NOT available for self-registration.

#### 2. **Login** (POST `/api/auth/login`)
```json
// Request
{
  "email": "john@school.com",
  "password": "password123"
}

// Response (Success)
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@school.com",
    "role": "SCHOOL_ADMIN",
    "status": "Active"
  }
}

// Response (Error)
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Protected Routes
**All protected routes require Bearer token in Authorization header:**
```
Authorization: Bearer <your_token_here>
```

#### 3. **Get Current User** (GET `/api/auth/me`)
```json
// Response
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@school.com",
    "role": "SCHOOL_ADMIN",
    "status": "Active"
  }
}
```

#### 4. **Logout** (POST `/api/auth/logout`)
```json
// Response
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### 5. **Change Password** (PUT `/api/auth/change-password`)
```json
// Request
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}

// Response
{
  "success": true,
  "message": "Password changed successfully"
}
```

## User Roles & Permissions

### Role Hierarchy
1. **SUPER_ADMIN** - Full system access
2. **SCHOOL_ADMIN** - School-wide management
3. **TEACHER** - Teacher features (registered by admin)
4. **STUDENT** - Student portal access
5. **PARENT** - Parent dashboard access
6. **ACCOUNTS_HR** - Finance & HR features

## Middleware

### 1. **protect** - Authentication Middleware
```javascript
import { protect } from "../middleware/auth.js";

router.get("/protected", protect, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### 2. **authorize** - Role-based Authorization
```javascript
import { protect, authorize } from "../middleware/auth.js";

// Only SUPER_ADMIN and SCHOOL_ADMIN can access
router.delete("/users/:id", 
  protect, 
  authorize("SUPER_ADMIN", "SCHOOL_ADMIN"), 
  deleteUser
);
```

### 3. **isAdmin** - Admin Check
```javascript
import { protect, isAdmin } from "../middleware/auth.js";

// Only admins (SUPER_ADMIN or SCHOOL_ADMIN)
router.post("/teachers", protect, isAdmin, createTeacher);
```

## Security Features

### 🔒 Password Security
- **bcrypt** hashing with salt rounds (10)
- Pre-save middleware for automatic hashing
- Secure password comparison method

### 🔐 JWT Security
- 7-day token expiration
- Secure secret key (from environment)
- Token includes: user ID, email, role

### ✅ Validation
- Email format validation
- Password strength requirements
- Role validation against enum
- Account status verification

### 🛡️ Error Handling
- Detailed error messages in development
- Generic messages in production
- Proper HTTP status codes
- Comprehensive logging

## Environment Variables

Add to `.env` file:
```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

## Usage Example (Frontend)

### Login
```typescript
import { login } from "../api/authApi";

const handleLogin = async (email, password) => {
  try {
    const response = await login(email, password);
    
    if (response.data.success) {
      // Store token
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("userRole", response.data.user.role);
      
      // Redirect to dashboard
      navigate("/dashboard");
    }
  } catch (error) {
    console.error(error.response?.data?.message);
  }
};
```

### Protected API Calls
```typescript
import API from "../api/authApi";

// Token is automatically added by interceptor
const getProfile = async () => {
  const response = await API.get("/auth/me");
  return response.data;
};
```

## Testing

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@school.com",
    "password": "test123",
    "role": "SCHOOL_ADMIN"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@school.com",
    "password": "test123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues & Solutions

### Issue: "Server error during signup"
**Solution:** Check MongoDB connection, ensure all required fields are provided

### Issue: "Invalid email or password"
**Solution:** Verify credentials, check if user exists, ensure password is correct

### Issue: "Token expired"
**Solution:** User needs to login again to get a new token

### Issue: "Not authorized, no token provided"
**Solution:** Ensure Authorization header is set with Bearer token

## File Structure
```
school-crm-backend/
├── controllers/
│   └── authController.js       # Authentication logic
├── middleware/
│   └── auth.js                 # JWT verification & authorization
├── models/
│   └── User.js                 # User schema with password hashing
├── routes/
│   └── authRoutes.js           # Auth endpoints
└── server.js                   # Main app with routes
```

## Next Steps

1. ✅ Implement password reset functionality
2. ✅ Add email verification
3. ✅ Implement refresh tokens
4. ✅ Add rate limiting for login attempts
5. ✅ Add OAuth integration (Google, Microsoft)
6. ✅ Add 2FA (Two-Factor Authentication)

---

**Created:** January 4, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
