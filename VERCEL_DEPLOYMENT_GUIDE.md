# Vercel Deployment Guide for CPS Club Website

## Overview
This guide walks you through deploying the CPS Club website to Vercel with a staging and production environment setup.

---

## Step 1: Create GitHub Repository

### 1.1 Push code to GitHub
```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial CPS Club website commit"

# Create a repository on GitHub: https://github.com/new
# Name it: cpsclub-web
# Then run:
git remote add origin https://github.com/YOUR_USERNAME/cpsclub-web.git
git branch -M main
git push -u origin main
```

### 1.2 Create staging branch
```bash
git checkout -b staging
git push -u origin staging
```

---

## Step 2: Set Up Vercel Account & Project

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### 2.2 Import GitHub Repository
1. In Vercel dashboard, click "New Project"
2. Select "Import Git Repository"
3. Find and select `cpsclub-web` repository
4. Click "Import"

### 2.3 Configure Build Settings
**Framework**: Next.js (should auto-detect)
**Build Command**: `npm run build`
**Output Directory**: `.next`

Click "Deploy" to deploy from main branch first.

---

## Step 3: Configure Environment Variables

### 3.1 Get Your Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your CPS Club project
3. Click Settings ⚙️ → Project Settings
4. Copy these values:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

5. Go to Service Accounts tab
6. Select "Node.js" and click "Generate new private key"
7. Copy the entire JSON object (this is your `FIREBASE_ADMIN_SDK_KEY`)
   - **Important**: This will be a large JSON object - copy the entire thing including the curly braces

### 3.2 Get Resend API Key
Since you're already using Resend for your local server:
1. Go to [resend.com](https://resend.com) - you'll be taken to your Dashboard
2. In the left sidebar, click **"API Keys"**
3. You should see your existing API key(s) listed
4. Look for the key you've been using - it will be partially hidden (like `re_****...`)
5. Click on it or hover over it to see the **"Copy"** button
6. Click **"Copy"** to copy the full API key to your clipboard
7. This is your `RESEND_API_KEY` value for Vercel

**Note:** If you can't see the full key even after clicking, you may need to:
- Check your `.env.local` file in your project - it should have `RESEND_API_KEY=re_...` with the full key
- Or create a new API key (go to API Keys → "Create API Key" → name it → copy the new key)

### 3.3 Add Environment Variables in Vercel

**For Production (main branch):**
1. In Vercel dashboard, go to Project Settings → Environment Variables
2. Add the public Firebase variables (those starting with `NEXT_PUBLIC_`):
   - Click "Add New"
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`, Value: (your API key)
   - Repeat for all `NEXT_PUBLIC_` variables
   - Set scope to "Production"

3. Add the Firebase Admin SDK key:
   - Click "Add New"
   - Name: `FIREBASE_ADMIN_SDK_KEY`
   - Value: Paste the **entire JSON object** from Firebase (including the curly braces `{}`)
   - Set scope to "Production"
   - **Note**: This should be pasted as-is - Vercel handles the JSON parsing automatically

4. Add the Resend API key:
   - Click "Add New"
   - Name: `RESEND_API_KEY`
   - Value: (your Resend API key)
   - Set scope to "Production"

**For Staging (staging branch):**
1. Same process but set scope to "Preview" (applies to staging branch deployments)
2. Can use same values or different Firebase project for complete isolation

---

## Step 4: Set Up Custom Domains

### 4.1 Configure Production Domain
1. In Vercel, go to Project Settings → Domains
2. Click "Add Domain"
3. Enter: `cpsclub.com.au`
4. Vercel will provide DNS records to update

### 4.2 Update DNS Records
1. Log into your domain registrar (Hostinger or wherever you bought the domain)
2. Go to DNS settings
3. Add the records Vercel provided
4. Wait 24-48 hours for DNS propagation

### 4.3 Configure Staging Domain (Optional but Recommended)
1. In Vercel, go to Project Settings → Domains
2. Click "Add Domain"
3. Enter: `staging.cpsclub.com.au`
4. Select the staging branch in the dropdown
5. Update DNS with provided records

---

## Step 5: Enable Auto-Deployment

### 5.1 Configure Git Integration
Your Vercel project is already connected to GitHub with auto-deployment enabled.

**Workflow:**
- Push to `main` → Auto-deploys to production
- Push to `staging` → Auto-deploys to staging
- Create PR → Auto-generates preview URL

### 5.2 Test the Workflow
```bash
# Make a small change
echo "<!-- Updated -->" >> app/page.tsx

# Commit and push to main
git add .
git commit -m "Test deployment"
git push origin main

# Watch Vercel dashboard for deployment
# Visit https://cpsclub.com.au to verify
```

---

## Step 6: Development Workflow

### For Feature Development:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test locally
npm run dev

# Push feature branch
git push -u origin feature/new-feature

# Create Pull Request on GitHub
# Vercel will auto-generate a preview URL for testing
# (shared with team in the PR)
```

### For Staging:
```bash
# When feature is ready for QA
git checkout staging
git pull origin staging
git merge feature/new-feature

# Push to staging
git push origin staging

# Visit staging.cpsclub.com.au to test
# Or use Vercel preview URL from PR
```

### For Production:
```bash
# When feature is tested and approved
git checkout main
git pull origin main
git merge staging

# Push to production
git push origin main

# Visit cpsclub.com.au to verify live
```

---

## Step 7: Monitor & Logs

### View Deployment Logs
1. In Vercel dashboard, click "Deployments"
2. Select any deployment to see build and runtime logs
3. Check for errors or warnings

### Enable Analytics (Optional)
1. In Vercel, go to Project Settings → Analytics
2. Enable "Web Analytics"
3. View real-time performance metrics

---

## Step 8: Troubleshooting

### Build Fails
1. Check Vercel build logs for specific error
2. Common issues:
   - Missing environment variables → Add to Vercel dashboard
   - TypeScript errors → Check `npm run build` locally first
   - Missing dependencies → Run `npm install` and push updated `package-lock.json`

### Environment Variables Not Working
1. Verify variable names exactly match your code
2. For public variables, must start with `NEXT_PUBLIC_`
3. Redeploy after adding variables (Vercel should auto-redeploy)
4. For `FIREBASE_ADMIN_SDK_KEY`, ensure you pasted the complete JSON object as-is

### DNS Not Resolving
1. Wait 24-48 hours for propagation
2. Check DNS records in Vercel match your registrar
3. Use `nslookup cpsclub.com.au` to check DNS status

### Newsletter/Firebase Not Working
1. Verify `FIREBASE_ADMIN_SDK_KEY` is correctly formatted JSON string
2. Check Firebase Firestore rules allow API access
3. Verify `RESEND_API_KEY` is valid

---

## Summary of URLs After Setup

| Environment | URL | Branch | Use Case |
|---|---|---|---|
| Production | `cpsclub.com.au` | `main` | Live website |
| Staging | `staging.cpsclub.com.au` | `staging` | Full QA testing |
| Preview | `cpsclub-web-[hash].vercel.app` | PR branches | Feature testing |
| Local | `localhost:3000` | any | Development |

---

## Cost Breakdown

- **Vercel**: $0/month (free tier includes unlimited PRs, deployments, and staging)
- **Firebase**: $0/month (free tier, current usage well below limits)
- **Resend**: $20/month (for transactional emails after 100/day limit)
- **Domain**: Paid separately to registrar
- **Total**: $20-30/month (just domain + Resend)

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Vercel account and import project
3. ✅ Add all environment variables
4. ✅ Configure custom domains
5. ✅ Test workflow with a small change
6. ✅ Decommission WordPress site
7. ✅ Update website links/bookmarks to new URLs

---

**Questions?** Refer to [Vercel Documentation](https://vercel.com/docs) or Firebase docs for more details.
