# Firebase Admin SDK Setup

The registration API uses Firebase Admin SDK to securely handle user creation and database updates server-side.

## Setup Steps

### 1. Generate Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `cps-club-374a5`
3. Click **Settings icon** (gear) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key** button
6. A JSON file will download - **keep this safe!**

### 2. Add Credentials to `.env.local`

Open `.env.local` and add the following from the downloaded JSON:

```
FIREBASE_PROJECT_ID="cps-club-374a5"
FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_PRIVATE_KEY="your-private-key-here"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@cps-club-374a5.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your-client-id"
```

### 3. Example JSON Format

When you download the private key, it looks like:

```json
{
  "type": "service_account",
  "project_id": "cps-club-374a5",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxx@cps-club-374a5.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

Copy these exact values into your `.env.local` file.

---

## Registration API Workflow

When a user submits the registration form:

1. **Client-side validation** (format checks)
2. **API call** to `/api/auth/register` with user data
3. **Server-side validation** (database checks)
4. **Check for duplicate email/phone** in Firestore
5. **Create user in Firebase Auth** with temporary password
6. **Store user profile in Firestore** database
7. **Return success/error response**
8. **Redirect to dashboard** on success

---

## API Response Examples

### Success (201)
```json
{
  "success": true,
  "message": "Registration successful",
  "userId": "abc123xyz",
  "user": {
    "id": "abc123xyz",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+1234567890",
    "role": "Player"
  }
}
```

### Error - Email Already Exists (409)
```json
{
  "error": "Email already registered. Please use a different email or login."
}
```

### Error - Invalid Format (400)
```json
{
  "error": "Invalid email format"
}
```

---

## Features

✅ **Database Validation**
- Check if email already exists
- Check if phone already exists
- Return duplicate errors

✅ **Secure User Creation**
- Create user in Firebase Auth
- Store profile in Firestore
- Atomic operations (rollback on failure)

✅ **Error Handling**
- Validates all inputs server-side
- Cleans up on failure
- Detailed error messages

✅ **Analytics**
- Log successful registrations
- Log registration failures
- Track validation errors

---

## Troubleshooting

**"FIREBASE_PRIVATE_KEY not configured"**
- Add Firebase Admin credentials to `.env.local`
- Restart dev server after adding env variables

**"Email already registered"**
- User tried to register with existing email
- Check Firestore or let them login instead

**"Failed to create user account"**
- Email might already exist in Firebase Auth
- Check Firebase Console > Authentication
