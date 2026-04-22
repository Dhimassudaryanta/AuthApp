# User Authentication App

A React Native (Expo) app demonstrating authentication flows using React Context API, React Navigation, and AsyncStorage for persistence.

## Features

- **Login** — email/password validation, credential verification, error messages
- **Signup** — name/email/password validation, duplicate email detection
- **Home** — displays logged-in user's name and email with a logout button
- **Persistent auth** — session survives app restarts via AsyncStorage
- **Password visibility toggle** — eye icon on all password fields
- **Auth-aware navigation** — automatically redirects based on login state

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript |
| State | React Context API |
| Navigation | React Navigation v7 (Native Stack) |
| Persistence | @react-native-async-storage/async-storage |
| Icons | @expo/vector-icons (Ionicons) |

## Project Structure

```
src/
├── context/
│   └── AuthContext.tsx      # Auth state, login/signup/logout, AsyncStorage
├── navigation/
│   └── AppNavigator.tsx     # Auth vs App stack, loading splash
└── screens/
    ├── LoginScreen.tsx
    ├── SignupScreen.tsx
    └── HomeScreen.tsx
```

## Setup

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with the Expo Go app.

## Requirements

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator, or the Expo Go app on a physical device
