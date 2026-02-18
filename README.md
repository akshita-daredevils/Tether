# Tether

A private, real-time space for two people: chat, presence, and synced YouTube music.

## Stack

- React + Vite + TypeScript
- Firebase Auth + Firestore
- TailwindCSS

## Local Setup

1) Install dependencies:

```bash
npm install
```

2) Create a Firebase project and add a Web app. Copy the config values into `.env`:

```bash
cp .env.example .env
```

3) Start the app:

```bash
npm run dev
```

## Firebase Emulator

1) Install the Firebase CLI:

```bash
npm install -g firebase-tools
```

2) Log in and start emulators:

```bash
firebase login
firebase emulators:start
```

3) Keep `VITE_USE_FIREBASE_EMULATOR=true` in `.env` while developing locally.

Emulator UI will be available at `http://localhost:4000`.

## Features

- Email/password + Google OAuth sign-in
- Create or join a 1-to-1 room via room code
- Real-time chat with typing indicators
- Presence (online/offline) badges
- Synced YouTube player with drift correction (500ms)

## Data Model

```
users/{uid}
  displayName
  photoURL
  online

rooms/{roomId}
  members: [uid1, uid2]
  createdAt

rooms/{roomId}/messages/{messageId}
  senderId
  text
  createdAt

rooms/{roomId}/playerState/state
  videoId
  isPlaying
  timestamp
  updatedBy
  updatedAt
```

## Development Notes

- The app uses Firestore for all realtime updates.
- Presence updates are triggered on visibility changes and unload.
- YouTube sync sends a timestamp update every few seconds while playing.
