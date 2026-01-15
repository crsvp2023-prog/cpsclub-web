# Firebase Configuration for Local Development

Follow these steps to set up Firebase for your local Next.js project:

## 1. Download Service Account Key (Admin SDK)
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Go to **Project Settings** > **Service Accounts**
- Click **Generate new private key**
- Download the JSON file

## 2. Set Environment Variables

### For Admin SDK (server-side)
- Open your `.env.local` file (create it if it doesn't exist)
- Add the following:

```
FIREBASE_SERVICE_ACCOUNT={...contents of your service account JSON, all on one line...}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```
- To convert the JSON to a single line, you can use:
  - `cat serviceAccount.json | tr -d '\n'` (or use an online tool)
  - Or wrap the value in single quotes and escape all double quotes: `'{"type":"service_account",...}'`

### For Client SDK (frontend)
- In `.env.local`, add:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```
- All these values are in your Firebase Console > Project Settings > General

## 3. Restart Your Dev Server
- Stop and restart `npm run dev` after changing any `.env.local` values.

## 4. Test Your API
- Try registering or logging in again.
- If you see errors, check the server logs for details.

## 5. Troubleshooting
- If you see `FIREBASE_SERVICE_ACCOUNT not set` or `Firebase not initialized`, your env variable is not being read.
- If you see `Cannot use undefined as a Firestore value`, check your user data for missing fields.
- If you see HTML in the response, your API route is not working or the server is not running.

---

**Never commit your service account JSON or `.env.local` to source control!**

If you need help with any step, let me know which part you are stuck on.