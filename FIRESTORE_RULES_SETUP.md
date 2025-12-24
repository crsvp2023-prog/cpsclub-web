# Firestore Security Rules Setup

Your Firestore is currently rejecting writes from the Admin SDK due to restrictive security rules. You need to update your Firestore rules to allow server-side operations.

## How to Update Firestore Rules

### Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **cps-club-374a5** project
3. Click **Firestore Database** in the left sidebar
4. Click the **Rules** tab at the top

### Step 2: Replace with These Rules

⚠️ **IMPORTANT - Try this simpler version first:**

Copy and paste this to Firebase Console Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    allow read, write: if request.time < timestamp.date(2099, 1, 1);
  }
}
```

This temporarily allows all access to test if Admin SDK works. Once confirmed working, you'll replace with the secure rules below.

**After confirming it works**, use these secure rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth == null;                    // Admin SDK
      allow read: if request.auth.uid == userId;                     // Users read own
    }
    
    // Members collection
    match /members/{document=**} {
      allow read, write: if request.auth == null;                    // Admin SDK
      allow read: if request.auth != null;                           // Auth users can read
    }
    
    // Match availability
    match /match_availability/{document=**} {
      allow read, write: if request.auth == null;                    // Admin SDK
      allow read: if request.auth != null;                           // Auth users can read
    }
    
    // Newsletter subscribers
    match /newsletter_subscribers/{document=**} {
      allow read, write: if request.auth == null;                    // Admin SDK only
    }
  }
}
```

### Step 3: Publish the Rules
1. Click **Publish** in the top right
2. Confirm when prompted

### What These Rules Do

- **Helper functions**: `isAdmin()` and `isAuth()` make the rules cleaner and less error-prone
- **Default rule**: Everything is denied unless explicitly allowed
- **Users collection**: 
  - Admin SDK has full read/write access (saves profiles after login)
  - Users can only read their own profile
- **Members collection**:
  - Admin SDK has full read/write access (register members, check status)
  - Authenticated users can read (for admin dashboards)
- **Match availability**:
  - Admin SDK has full read/write access (save/read availability)
  - Authenticated users can read (for admin dashboards)
- **Newsletter subscribers**:
  - Admin SDK only (no client-side access)

### Why request.auth == null?

When the Admin SDK makes requests, it doesn't have a Firebase Auth `uid`. This is how Firestore differentiates:
- `request.auth != null` = Firebase Auth user
- `request.auth == null` = Admin SDK (server-side) or unauthenticated

This is a secure way to allow server-side operations while protecting user data from unauthorized client access.

## Testing

After publishing the rules, test again:
```bash
curl http://localhost:3000/api/health
```

You should see:
```json
{"status":"healthy","message":"Firestore connection successful",...}
```

Then try Google/Facebook login - your profile should save to Firestore! ✅
