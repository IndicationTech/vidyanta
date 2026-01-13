# Staff Upload Template Guide

## Excel/CSV File Format

When uploading staff members using the "Auto Upload" feature, your file should have the following columns:

### Required Columns:
- **Name**: Full name of the staff member (e.g., "John Doe")
- **Email**: Email address (e.g., "john.doe@example.com")
- **Phone**: Phone number (e.g., "+91 9876543210")
- **Role**: Either "Parent" or "Account HR"
- **Password**: Login password (if not provided, defaults to "password123")

### Optional Columns:
- **Department**: Department name (optional, will use Role if not provided)

## Sample Excel Format:

| Name | Email | Phone | Role | Department | Password |
|------|-------|-------|------|------------|----------|
| John Doe | john@example.com | +91 9876543210 | Parent | Parent | password123 |
| Jane Smith | jane@example.com | +91 9876543211 | Account HR | HR | password123 |
| Mike Johnson | mike@example.com | +91 9876543212 | Parent | Parent | mypassword |

## Important Notes:

1. **First row must contain column headers** (Name, Email, Phone, Role, Password)
2. **Supported file formats**: .csv, .xlsx, .xls
3. **Role values**: Must be exactly "Parent" or "Account HR"
4. **Email**: Must be unique for each staff member
5. **Password**: If not provided, system will use "password123" as default

## After Upload:

- Staff members will be created in the database
- They can immediately login using their email and password
- They will be routed to their role-specific dashboard
- Any errors during upload will be reported with specific row details

## Download Sample Template:

Create an Excel file with the columns mentioned above and save as .xlsx or .csv format.
