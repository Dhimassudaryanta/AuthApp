# User Authentication App

A React Native (Expo) app with Login and Signup functionality using React Context API to manage authentication state.

## Features

### Core Requirements
- **AuthContext** — global auth state with `login`, `signup`, `logout`, and `user` via React Context API
- **Login Screen** — email + password fields, credential validation, inline error messages, navigate to Signup
- **Signup Screen** — name + email + password fields, full validation (missing fields, invalid email, password < 6 chars), navigate to Login
- **Home Screen** — displays logged-in user's name and email, logout button returns to Login
- **Persistent auth** — session survives app restarts via AsyncStorage (users stored locally as mock DB)
- **React Navigation** — auth-aware stack navigator; automatically switches between Login/Signup and Home based on auth state

### Bonus
- **Password visibility toggle** — eye icon on all password fields (Login + Signup)
- **Password strength meter** — 3-level indicator (Weak / Fair / Strong) on Signup based on character type combinations:
  - **Weak** — single character type or length < 6
  - **Fair** — length ≥ 6 with 2+ character types
  - **Strong** — length ≥ 8 with 3+ character types (upper + lower + number/symbol)

### UI Extras
- **Inter font** — loaded via `@expo-google-fonts/inter` (Regular, Medium, SemiBold, Bold)
- **Design system** — shared `COLOR` and `FAMILY` tokens in `src/theme.ts`
- **Home dashboard** — shows join date (stored at signup), active session count, and security status card
- **Safe area handling** — `SafeAreaProvider` + `useSafeAreaInsets` for correct status bar behaviour on iOS and Android edge-to-edge

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Language | TypeScript |
| State management | React Context API |
| Navigation | React Navigation v7 (Native Stack) |
| Persistence | @react-native-async-storage/async-storage |
| Font | @expo-google-fonts/inter |
| Icons | @expo/vector-icons (Ionicons) |
| Safe area | react-native-safe-area-context |

## Project Structure

```
src/
├── context/
│   └── AuthContext.tsx      # login, signup, logout, user state, AsyncStorage
├── navigation/
│   └── AppNavigator.tsx     # auth-aware root navigator, loading state
├── screens/
│   ├── LoginScreen.tsx      # email + password, validation, error messages
│   ├── SignupScreen.tsx     # name + email + password, strength meter
│   └── HomeScreen.tsx      # user profile, stats, sign out
└── theme.ts                 # COLOR and FAMILY design tokens
```

## Setup

```bash
# Requires Node.js >= 20
node --version

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with the Expo Go app.

## Requirements

- Node.js 20+
- iOS Simulator (macOS) or Android Emulator, or the Expo Go app on a physical device
