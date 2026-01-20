# Syllabus Management System - Implementation Guide

## Overview

A comprehensive syllabus management system has been added to the School ERP, allowing school administrators to create, manage, and assign syllabi to teachers. Teachers can then view and track their assigned syllabi.

## Features Implemented

### 1. **Backend API** (`school-crm-backend`)

#### New Model: `Syllabus.js`

- Location: `models/Syllabus.js`
- Stores syllabus data with the following structure:
  - School ID
  - Standard (grade level)
  - Subject
  - Semester (1 or 2)
  - Syllabus data (topics with key learning points, dates, homework, etc.)
  - Assigned teachers
  - Creation metadata

#### New Routes: `syllabusRoutes.js`

- Location: `routes/syllabusRoutes.js`
- API Endpoints:
  - `GET /api/syllabus` - Get all syllabi (with filters)
  - `GET /api/syllabus/teacher/:teacherId` - Get syllabi for a specific teacher
  - `GET /api/syllabus/:id` - Get a single syllabus
  - `POST /api/syllabus` - Create new syllabus
  - `PUT /api/syllabus/:id` - Update syllabus
  - `DELETE /api/syllabus/:id` - Delete syllabus
  - `POST /api/syllabus/:id/assign-teachers` - Assign teachers to syllabus

#### Server Configuration

- Updated `server.js` to include syllabus routes

### 2. **Frontend Components** (`school-crm-frontend`)

#### New Page: `SchoolAdminSyllabus.jsx`

- Location: `pages/SchoolAdminSyllabus.jsx`
- Features:
  - Create/Edit/Delete syllabi
  - Search and filter by standard, subject, and semester
  - Assign teachers to specific syllabi
  - Add topics with:
    - Topic name
    - Scheduled date
    - Homework/assignments
    - Key learning points
  - Visual card-based layout
  - Real-time notifications

#### Updated Components

**SchoolAdminSidebar.jsx**

- Added "Syllabus" menu item with BookOpen icon

**SuperAdminSidebar.jsx**

- Added "Syllabus" menu item for super admin access

**RoleRouter.jsx**

- Added routing logic for syllabus page
- School Admin/Super Admin → `SchoolAdminSyllabus`
- Teacher → `SyllabusManagement` (existing)

**routes.js**

- Added routes for both school admin and super admin

## How to Use

### For School Administrators

1. **Access Syllabus Management**
   - Log in as School Admin
   - Click "Syllabus" in the sidebar

2. **Create New Syllabus**
   - Click "Add New Syllabus" button
   - Fill in required fields:
     - Standard (1st - 12th)
     - Subject (Mathematics, Science, English, etc.)
     - Semester (1 or 2)
   - Assign teachers (optional)
   - Add topics with details:
     - Topic name
     - Scheduled date
     - Homework description
     - Key learning points
   - Click "Create Syllabus"

3. **Edit Existing Syllabus**
   - Click "Edit" on any syllabus card
   - Modify topics, assignments, or teacher assignments
   - Click "Update Syllabus"

4. **Delete Syllabus**
   - Click the trash icon on any syllabus card
   - Confirm deletion

5. **Filter & Search**
   - Use search bar to find by subject or standard
   - Filter by standard dropdown
   - Filter by semester dropdown

### For Teachers

Teachers assigned to a syllabus will be able to view it in their existing "Syllabus & Lesson Plan" section (`SyllabusManagement.jsx`).

## Database Schema

```javascript
{
  schoolId: ObjectId,          // Reference to school
  standard: String,             // e.g., "10th"
  subject: String,              // e.g., "Mathematics"
  semester: Number,             // 1 or 2
  syllabusData: {
    id: String,
    name: String,
    topics: [{
      id: String,
      name: String,
      status: String,          // "pending", "in-progress", "completed"
      progress: Number,        // 0-100
      date: String,
      materials: Array,
      homework: String,
      keyPoints: [String]
    }]
  },
  assignedTeachers: [ObjectId], // References to User (teachers)
  createdBy: ObjectId,          // Reference to admin who created
  timestamps: true              // createdAt, updatedAt
}
```

## API Usage Examples

### Create Syllabus

```javascript
POST /api/syllabus
Headers: { Authorization: "Bearer <token>" }
Body: {
  schoolId: "123...",
  standard: "10th",
  subject: "Mathematics",
  semester: 1,
  syllabusData: {
    id: "math-sem1",
    name: "Mathematics",
    topics: [...]
  },
  assignedTeachers: ["teacher_id_1", "teacher_id_2"]
}
```

### Get Syllabi with Filters

```javascript
GET /api/syllabus?schoolId=123&standard=10th&semester=1
Headers: { Authorization: "Bearer <token>" }
```

### Assign Teachers

```javascript
POST /api/syllabus/:syllabusId/assign-teachers
Headers: { Authorization: "Bearer <token>" }
Body: {
  teacherIds: ["teacher_id_1", "teacher_id_2"]
}
```

## Testing Steps

1. **Start Backend Server**

   ```bash
   cd school-crm-backend
   npm start
   ```

2. **Start Frontend Server**

   ```bash
   cd school-crm-frontend
   npm run dev
   ```

3. **Login as School Admin**
   - Navigate to login page
   - Use school admin credentials

4. **Test Syllabus Creation**
   - Go to Syllabus section
   - Create a new syllabus with topics
   - Assign teachers

5. **Verify Teacher Access**
   - Login as a teacher assigned to the syllabus
   - Check if syllabus appears in their dashboard

## Notes

- The syllabus format follows the structure from `SyllabusManagement.jsx`
- Unique constraint: One syllabus per school/standard/subject/semester combination
- Teachers must be created before they can be assigned to syllabi
- All API endpoints are protected with authentication middleware

## Future Enhancements

- Bulk upload syllabus via Excel/CSV
- Copy syllabus from previous year
- Template system for common subjects
- Progress tracking and analytics
- Student view of syllabus
- Notifications when syllabus is updated
