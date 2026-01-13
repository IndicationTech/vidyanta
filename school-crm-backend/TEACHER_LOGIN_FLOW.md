# Teacher Login Flow Documentation

## Overview
This document explains how teachers created by School Admins can log in and access their dashboard with all their filled details properly displayed.

## Recent Fixes (January 5, 2026)

### Issue Fixed
Teachers created by School Admins were able to login but their profile details were showing "Not provided" even when the admin had filled in all the information.

### Root Causes Identified
1. **Field Name Mismatches**: Some fields had different names in the form vs display (e.g., `dateOfJoining` vs `joiningDate`)
2. **Data Type Handling**: Experience field wasn't handling both string and number types
3. **Date Formatting**: Dates weren't being formatted properly for display
4. **Dashboard Field Mapping**: Teacher dashboard was looking for `subjects` (array) but backend stored `subject` (string)
5. **Leave Balance Display**: Zero values were being treated as falsy and showing defaults

### Changes Made

#### 1. ProfileManagement.jsx
- ✅ Fixed experience field to handle both string and number values
- ✅ Fixed date of birth to check both `dob` and `dateOfBirth` fields with proper formatting
- ✅ Fixed date of joining to check both `dateOfJoining` and `joiningDate` fields
- ✅ Fixed leave balance displays to properly show 0 values (using !== undefined check)
- ✅ All dates now display in Indian format (e.g., "5 Jan, 2026")

#### 2. TeacherDashboard.jsx  
- ✅ Changed from `subjects` (array) to `subject` (string) to match backend data
- ✅ Added `phone` and `email` display in profile card
- ✅ Fixed teacher ID to check both `teacherId` and `id` fields

#### 3. Backend (Already Fixed)
- ✅ profileController.js - Uses correct "TEACHER" role (uppercase)
- ✅ User model - Added all teacher-specific fields
- ✅ Password hashing - Automatic via pre-save hook

## Teacher Creation Flow

### 1. School Admin Creates Teacher
When a School Admin creates a teacher through the Staff page:

1. **Frontend** (`pages/Staff.jsx`):
   - School Admin fills out the teacher form with:
     - First Name, Last Name
     - Email, Password
     - Additional details (phone, subject, salary, etc.)
   - Calls `createTeacherProfile(payload)` API

2. **Backend** (`controllers/profileController.js`):
   - Receives teacher data
   - Creates a new User with:
     - `role: "TEACHER"` (uppercase to match enum)
     - `email: email.toLowerCase()` (lowercase for consistency)
     - `password` (will be automatically hashed by User model pre-save hook)
     - `status: "Active"`
     - `teacherId: TCH####` (auto-generated unique ID)
   - Saves to database with hashed password
   - Returns teacher data (without password)

## Teacher Login Flow

### 1. Teacher Accesses Login Page
- Teacher navigates to login page
- Enters their email and password

### 2. Authentication (`controllers/authController.js`)
- Backend receives login request
- Finds user by email (case-insensitive)
- Verifies user status is "Active"
- Compares entered password with hashed password
- If valid:
  - Generates JWT token with user ID, email, and role
  - Returns token and user data including `role: "TEACHER"`

### 3. Frontend Login Handler (`pages/Login.jsx`)
- Receives login response
- Stores in localStorage:
  - `token`
  - `userId`
  - `userName`
  - `userEmail`
  - `userRole: "TEACHER"`
- Calls `onLogin("TEACHER")` to update app state

### 4. Role-Based Routing (`App.jsx` & `RoleRouter.jsx`)
- App detects user is authenticated with TEACHER role
- Routes to teacher dashboard: `/teacher/dashboard`
- `RoleRouter` renders `<TeacherDashboard />` component

## Key Points

### Password Security
- Passwords are **automatically hashed** using bcrypt (10 salt rounds)
- Hash happens in User model's pre-save hook
- Never store plain text passwords
- Password comparison uses bcrypt's compare method

### Role Consistency
- Backend uses **uppercase roles**: "TEACHER", "SCHOOL_ADMIN", etc.
- User model enum enforces valid roles
- Frontend TypeScript enum matches: `UserRole.TEACHER`

### Email Handling
- All emails stored in **lowercase** for consistency
- Login accepts any case, converts to lowercase for lookup

### Teacher ID
- Auto-generated format: `TCH####` (e.g., TCH1234)
- Unique constraint ensures no duplicates
- Used for teacher identification and profile lookup

## Testing the Flow

### Manual Test Steps:

1. **Start Backend Server:**
   ```bash
   cd school-crm-backend
   node server.js
   ```

2. **Login as School Admin:**
   - Email: (your school admin email)
   - Password: (your school admin password)

3. **Create Teacher:**
   - Navigate to Staff page
   - Click "Add Teacher"
   - Fill in form:
     - First Name: John
     - Last Name: Doe
     - Email: john.doe@school.com
     - Password: password123
     - Additional details
   - Submit form
   - Note the success message

4. **Logout:**
   - Click logout button

5. **Login as Teacher:**
   - Email: john.doe@school.com
   - Password: password123
   - Should successfully login to Teacher Dashboard

### Expected Results:
✅ Teacher account created with TEACHER role
✅ Password properly hashed in database
✅ Teacher can login with credentials
✅ Teacher redirected to Teacher Dashboard
✅ Teacher has access to teacher-specific features:
   - Attendance Management
   - Syllabus Management
   - Marks Management
   - Student Performance
   - Leave Management
   - Profile Management
   - Payroll View

## Troubleshooting

### Teacher Cannot Login
1. **Check email format:** Ensure email is correct (case doesn't matter)
2. **Verify account status:** Check database - `status` should be "Active"
3. **Check role:** Database should have `role: "TEACHER"` (uppercase)
4. **Password issue:** Ensure password was properly hashed during creation

### Role Not Recognized
1. **Check User model:** Verify "TEACHER" is in role enum
2. **Check frontend types:** Verify `UserRole.TEACHER` exists in types.ts
3. **Check RoleRouter:** Verify TEACHER case exists in switch statement

### Dashboard Not Loading
1. **Check route config:** Verify teacher routes in config/routes.ts
2. **Check permissions:** Verify teacher has access to /teacher/dashboard
3. **Check component imports:** Verify TeacherDashboard is properly imported

## Database Schema

### User Model Fields (for Teachers)
```javascript
{
  name: String,
  firstName: String,
  lastName: String,
  email: String (unique, lowercase),
  password: String (hashed),
  role: "TEACHER",
  status: "Active" | "Inactive" | "Suspended",
  teacherId: String (unique, e.g., "TCH1234"),
  phone: String,
  address: String,
  dateOfBirth: Date,
  joiningDate: Date,
  photo: String (URL),
  subject: String,
  department: String,
  qualification: String,
  experience: String,
  basicSalary: Number,
  medicalLeaves: Number,
  casualLeaves: Number,
  sickLeaves: Number,
  maternityLeaves: Number,
  languages: [String],
  permanentAddress: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Create Teacher
- **POST** `/api/profile`
- **Body:** Teacher data (firstName, lastName, email, password, etc.)
- **Response:** Created teacher object (without password)

### Login
- **POST** `/api/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ token, user: { _id, name, email, role, status } }`

### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object without password
