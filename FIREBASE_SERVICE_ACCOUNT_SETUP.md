# Firebase Service Account Setup Guide

## Problem
The app is using the Client SDK for server-side Firestore operations, which enforces security rules and fails with `permission-denied` errors. You need the **Firebase Admin SDK** to bypass these restrictions on the server side.

## Solution: Add Service Account Key

### Step 1: Download Service Account Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your **cpsclub-web** project
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file - DO NOT commit this to GitHub

### Step 2: Add to Environment Variables

The key needs to be added as an environment variable. You have two options:

#### Option A: Add to `.env.local` (Recommended for Development)
```bash
# Copy the entire JSON from the service account key file and convert to single line:
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"cpsclub-web","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-...@cpsclub-web.iam.gserviceaccount.com","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-...%40cpsclub-web.iam.gserviceaccount.com"}'
```

#### Option B: Add to Production Environment (Hostinger)
If deploying to production:
1. Go to Hostinger/your hosting control panel
2. Add the `FIREBASE_SERVICE_ACCOUNT` environment variable
3. Paste the entire JSON content

### Step 3: Restart Your App
```bash
npm run dev  # or redeploy if in production
```

### What Changes Were Made
- Created `app/lib/firebase-admin.ts` - uses Firebase Admin SDK
- Updated all API endpoints to use Admin SDK:
  - `/api/auth/update-profile`
  - `/api/members/register`
  - `/api/members/check`
  - `/api/match-availability`
  - `/api/newsletter/subscribe`

### Testing
After adding the service account:
1. Try Google/Facebook login - should now save profile to Firestore
2. Test member registration - should save to Firestore
3. Check `/api/health` endpoint - should show "healthy"

### Security Notes
⚠️ **IMPORTANT:**
- Never commit the service account JSON to GitHub
- Add `.env.local` to `.gitignore` (it should already be there)
- The `FIREBASE_SERVICE_ACCOUNT` environment variable contains sensitive credentials
- In production, set this through your hosting provider's dashboard
- Rotate the service account key periodically for security
