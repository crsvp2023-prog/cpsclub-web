# CPSC Mobile (Native)

This folder contains the native mobile app (Expo + React Native + TypeScript) rebuilt from the CPSC website.

## Run locally

### 1) Start the Next.js web server (data source)

From the repo root:

```bash
npm install
npm run dev
```

By default the web app runs on `http://localhost:3000`.

### 2) Start the mobile app

In a second terminal:

```bash
cd mobile
npm install

# iOS simulator
npm run ios

# Android emulator
npm run android
```

## Configure the web base URL

The mobile app fetches existing JSON from the website (e.g. `/matches-data.json`).

Set `EXPO_PUBLIC_WEB_BASE_URL` so the phone/emulator can reach your web server:

- iOS simulator: `http://localhost:3000` usually works
- Android emulator: `http://10.0.2.2:3000`
- Physical device: use your machine LAN IP, e.g. `http://192.168.1.50:3000`

Example:

```bash
export EXPO_PUBLIC_WEB_BASE_URL='http://10.0.2.2:3000'
cd mobile
npm run android
```

## Firebase Auth configuration

The native app uses Firebase Auth directly (not the web `/login` page).

Set these Expo env vars (same values as your `NEXT_PUBLIC_FIREBASE_*` on web, but with `EXPO_PUBLIC_` prefix):

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Local example:

```bash
export EXPO_PUBLIC_FIREBASE_API_KEY='...'
export EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN='...'
export EXPO_PUBLIC_FIREBASE_PROJECT_ID='...'
export EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET='...'
export EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID='...'
export EXPO_PUBLIC_FIREBASE_APP_ID='...'
cd mobile
npm run ios
```

## Google Sign-In (Expo)

Set these env vars for Google OAuth:

- `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

You can create these in Google Cloud Console → OAuth 2.0 Client IDs.

## Deep links

The app scheme is `cpsc`.

- Open match detail: `cpsc://matches/1`
- Open login: `cpsc://login`

With Expo tooling you can test links like:

```bash
npx uri-scheme open cpsc://matches/1 --ios
```

## Current screens

- Home: shows “Next Match”
- Matches: list + match detail
- News: reads `/sports-news-data.json`
- More: quick links to email/social
