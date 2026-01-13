# Default Admin Accounts Setup

## Quick Setup

To create the default admin accounts, run:

```bash
cd school-crm-backend
npm run seed
```

This will create two default admin accounts:

### 1. Super Admin
- **Email:** admin@gmail.com
- **Password:** password123
- **Role:** SUPER_ADMIN

### 2. School Admin
- **Email:** schooladmin@gmail.com
- **Password:** password123
- **Role:** SCHOOL_ADMIN

## What the Seed Script Does

The `seedAdmins.js` script:
1. Connects to your MongoDB database
2. Checks if the admin accounts already exist
3. Creates them if they don't exist (passwords are automatically hashed)
4. Skips creation if they already exist

## Login Page

The login page has been simplified:
- ✅ Removed signup functionality
- ✅ Only login form is shown
- ✅ Default credentials are displayed on the login page
- ✅ Clean, simple interface

## Usage

1. **First Time Setup:**
   ```bash
   # Make sure MongoDB is running
   # Then seed the admin accounts
   cd school-crm-backend
   npm run seed
   ```

2. **Start the Backend:**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

3. **Login:**
   - Navigate to the login page
   - Use either admin account:
     - Super Admin: admin@gmail.com / password123
     - School Admin: schooladmin@gmail.com / password123

## Security Notes

⚠️ **IMPORTANT:** These are default credentials for development/testing purposes only!

For production:
1. Change these default passwords immediately
2. Use strong, unique passwords
3. Consider implementing 2FA
4. Remove the credentials display from the login page
5. Use environment variables for sensitive data

## Troubleshooting

### "Admin accounts already exist"
This is normal - it means the accounts were already created. You can login with the existing credentials.

### "Error connecting to MongoDB"
Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

### "Cannot find module"
Install dependencies first:
```bash
npm install
```

## Manual Creation (Alternative)

If you prefer to create accounts manually, you can use the signup endpoint (you'll need to enable it temporarily) or create them directly in MongoDB:

```javascript
// Using MongoDB Shell
use school-erp

db.users.insertOne({
  name: "Super Administrator",
  email: "admin@gmail.com",
  password: "$2a$10$...", // Use bcrypt to hash "password123"
  role: "SUPER_ADMIN",
  status: "Active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Next Steps

After logging in:
1. **Super Admin** can manage all schools and system settings
2. **School Admin** can create teachers, students, and manage school operations
3. Teachers created by School Admin can login with their assigned credentials
