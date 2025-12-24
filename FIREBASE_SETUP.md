# Firebase Integration - Setup Complete ✅

## What's Been Set Up

### 1. **Firebase Authentication**
- Real user registration with email/password
- Secure login with Firebase Auth
- User profiles stored in Firestore
- Session persistence across page refreshes

### 2. **User Data Storage**
All user information is stored in Firestore:
- `name` - Full name
- `email` - Email address
- `phone` - Phone number
- `role` - Player/Coach/Volunteer/Supporter
- `experience` - Beginner/Intermediate/Advanced/Professional
- `createdAt` - Registration timestamp

### 3. **Analytics Tracking**
Automatically tracks:
- **Page Views** - Every page visit (footfalls)
- **Button Clicks** - All button interactions
- **Sponsor Clicks** - Sponsor link clicks
- **Form Submissions** - Login/registration events
- **User Analytics** - Unique user counts

### 4. **New Pages**
- **`/login`** - User login with Firebase Auth
- **`/register`** - New user registration with data storage
- **`/dashboard`** - User profile and controls
- **`/analytics`** - View all analytics metrics

---

## How to Use

### 1. **Start the Dev Server**
```bash
npm run dev
```

### 2. **Register a New User**
- Go to `http://localhost:3000/register`
- Fill in your details (name, email, phone, role, etc.)
- Submit - user account is created in Firebase
- Redirected to dashboard

### 3. **Login**
- Go to `http://localhost:3000/login`
- Enter your email and password
- Access your dashboard

### 4. **View Analytics**
- From dashboard, click "📊 View Analytics"
- See all metrics:
  - Total page views
  - Total button clicks
  - Sponsor clicks
  - Unique users

---

## File Structure

```
app/
├── lib/
│   ├── firebase.ts          # Firebase config & initialization
│   ├── analytics.ts         # Analytics logging functions
│   └── usePageViewTracking.ts # Page view hook
├── context/
│   └── AuthContext.tsx      # Authentication context (Firebase)
├── components/
│   ├── PageViewTracker.tsx  # Auto page view tracking
│   └── Header.tsx           # Added Login button
├── login/
│   └── page.tsx            # Login page (Firebase Auth)
├── register/
│   └── page.tsx            # Registration (Firebase Auth + Firestore)
├── dashboard/
│   └── page.tsx            # User dashboard + Analytics link
└── analytics/
    └── page.tsx            # Analytics dashboard
```

---

## Key Features

### ✅ Real User Accounts
- Users register with email/password
- Data automatically stored in Firebase
- No mock accounts anymore

### ✅ Automatic Analytics
- Every page view is logged
- Click tracking on all buttons
- Sponsor clicks tracked separately
- Unique user identification

### ✅ Protected Routes
- Dashboard only accessible when logged in
- Auto-redirect to login if not authenticated
- Session persists across page refreshes

### ✅ Analytics Dashboard
- Real-time metrics
- View page views, clicks, sponsor engagement
- Refresh button to get latest data

---

## Firebase Collections

### `users` Collection
Stores all user profiles created during registration

**Example Document:**
```
{
  email: "user@example.com"
  name: "John Doe"
  phone: "+1234567890"
  role: "Player"
  experience: "Intermediate"
  createdAt: Timestamp
}
```

### `analytics` Collection
Stores all user interactions

**Example Document:**
```
{
  userId: "abc123" or "anonymous"
  eventType: "page_view" | "button_click" | "sponsor_click" | "form_submit"
  eventName: "Home Page" | "Register Button" | etc
  page: "/register"
  timestamp: Timestamp
  userAgent: "Mozilla/5.0..."
}
```

---

## Next Steps (Optional)

1. **Customize User Roles**
   - Add admin dashboard
   - Create role-based access control

2. **Enhanced Analytics**
   - Add charts and graphs
   - Export analytics to CSV
   - Date range filtering

3. **User Features**
   - Change password
   - Update profile
   - Email verification

4. **Email Notifications**
   - Verification emails
   - Password reset emails
   - Activity notifications

---

## Testing Credentials

Since this is using real Firebase, you need to register your own account!

1. Go to `/register`
2. Fill in details
3. Submit
4. Account created in Firebase
5. Automatically logged in

---

## Support

Firebase Console: https://console.firebase.google.com
- Project: `cps-club-374a5`
- View users in Authentication tab
- View data in Firestore tab
- Check analytics in Analytics tab
