# Debug Teacher Profile Display Issue

## Current Issue
Teacher details filled by school admin are showing "Not provided" in the teacher dashboard/profile.

## Debugging Steps Added

### 1. Backend Logging (profileController.js)
Added comprehensive logging to track data flow:

**When Creating Teacher:**
- Logs all incoming data fields
- Shows sample values for key fields (subject, qualification, etc.)
- Logs saved data to verify it's in database
- Shows all fields being sent in response

**When Fetching Profile:**
- Logs profile data being retrieved from database
- Shows all fields being returned to client

### 2. Frontend Logging (ProfileManagement.jsx)
- Logs all received profile data
- Shows which fields have values

## How to Debug

### Step 1: Restart Backend Server
```bash
cd school-crm-backend
node server.js
```

### Step 2: Create a New Teacher
1. Login as School Admin
2. Go to Staff page
3. Click "Add Teacher"
4. Fill in ALL fields:
   - **Personal:** First Name, Last Name, Email, Password, Phone, Address, DOB
   - **Professional:** Subject, Qualification, Experience, Class Assigned, Date of Joining
   - **Payroll:** Basic Salary, EPF Number, Contract Type
   - **Leaves:** Medical, Casual, Sick leaves (numbers)
   - **Bank:** Account Name, Account Number, Bank Name, IFSC, Branch
5. Submit the form

### Step 3: Check Backend Console Logs
Look for these messages:
```
📝 Creating teacher with data: { ... }
✅ Teacher created successfully: { ... }
📤 Sending response with fields: [ ... ]
```

**What to check:**
- Are all fields present in "Creating teacher with data"?
- Are the values correct?
- Is "Sending response" showing all expected fields?

### Step 4: Login as Teacher
1. Logout from School Admin
2. Login with teacher credentials
3. Go to Profile Management page

### Step 5: Check Frontend Console Logs
Open browser DevTools Console and look for:
```
Loading teacher profile with ID: ...
📥 Received profile data: { ... }
```

**What to check:**
- Is the profile data showing all the fields?
- Do the values match what was entered?
- Which fields are undefined/null?

### Step 6: Check Database Directly
If fields are missing, check MongoDB:

```bash
# Connect to MongoDB
mongo

# Use your database
use <your-database-name>

# Find the teacher
db.users.findOne({ role: "TEACHER" })
```

**What to check:**
- Are all fields saved in the database?
- Do they have the correct values?

## Common Issues and Solutions

### Issue 1: Fields Not Being Saved
**Symptom:** Backend log shows fields missing when creating teacher

**Solution:** 
- Check User model schema - ensure all fields are defined
- Check TeacherForm - verify field names match backend

### Issue 2: Fields Saved But Not Returned
**Symptom:** Database has data, but getProfile doesn't return it

**Solution:**
- Check if password is hiding other fields
- Verify toObject() is working correctly
- Check for field name typos

### Issue 3: Fields Returned But Not Displayed
**Symptom:** Frontend receives data but shows "Not provided"

**Solution:**
- Check ProfileManagement.jsx field mappings
- Verify InfoCard component is receiving correct values
- Check for typos in field names (e.g., dateOfJoining vs joiningDate)

### Issue 4: Data Type Mismatches
**Symptom:** Some fields show, others don't

**Solution:**
- Check if numbers are being sent as strings
- Verify date formats
- Check array vs string (e.g., languages)

## Field Name Reference

### TeacherForm Field Names → Database Field Names
```javascript
{
  firstName: "firstName",
  lastName: "lastName", 
  email: "email",
  password: "password",
  phone: "phone",
  address: "address",
  permanentAddress: "permanentAddress",
  dob: "dob",
  dateOfJoining: "dateOfJoining",
  subject: "subject",
  qualification: "qualification",
  experience: "experience",
  classAssigned: "classAssigned",
  basicSalary: "basicSalary",
  medicalLeaves: "medicalLeaves",
  casualLeaves: "casualLeaves",
  sickLeaves: "sickLeaves",
  maternityLeaves: "maternityLeaves",
  accountName: "accountName",
  accountNumber: "accountNumber",
  bankName: "bankName",
  ifscCode: "ifscCode",
  branchName: "branchName",
  epfNumber: "epfNumber",
  contractType: "contractType",
  workShift: "workShift",
  workLocation: "workLocation",
  fatherName: "fatherName",
  motherName: "motherName",
  panNumber: "panNumber",
  previousSchool: "previousSchool",
  languages: "languages", // Array
}
```

## Next Steps After Debugging

1. **If data is not being saved:**
   - Check the User model schema
   - Ensure all fields are defined in the schema
   - Check for validation errors

2. **If data is saved but not retrieved:**
   - Check getProfile function
   - Ensure no field filtering is happening
   - Verify password field is being excluded properly

3. **If data is retrieved but not displayed:**
   - Check ProfileManagement.jsx
   - Verify field name mappings
   - Check InfoCard component rendering

## Test with Sample Data

Use this sample teacher data for testing:
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@test.com",
  password: "password123",
  phone: "9876543210",
  address: "123 Test Street, City",
  permanentAddress: "456 Home Street, City",
  dob: "1990-01-15",
  dateOfJoining: "2025-01-01",
  subject: "Mathematics",
  qualification: "M.Sc Mathematics, B.Ed",
  experience: "5",
  classAssigned: "10A, 10B",
  basicSalary: 50000,
  medicalLeaves: 12,
  casualLeaves: 10,
  sickLeaves: 8,
  maternityLeaves: 0,
  accountName: "John Doe",
  accountNumber: "1234567890",
  bankName: "Test Bank",
  ifscCode: "TEST0001234",
  branchName: "Main Branch",
  epfNumber: "EPF123456",
  contractType: "Permanent",
  workShift: "Day",
  workLocation: "Main Campus"
}
```

Expected Result: All these fields should display in the teacher's profile, not showing "Not provided".
