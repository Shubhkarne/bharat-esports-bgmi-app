# Bharat Esports — BGMI Mobile App

Cross-platform React Native (Expo) esports hub for **BGMI (Battlegrounds Mobile India)**, styled with a dark theme (`#0d0d0d`) and gold/amber accents (`#f5b800`).

## Features
- **Tournaments:** Filter BGMI tournaments by entry type (`ALL`, `OPEN`, `INVITE`, `OPEN + INVITE`), view event details, and toggle reminders.
- **Rankings:** Browse BGMI squad standings, view stats (WWCD, finishes, points), and inspect point-decay details.
- **Calendar & Scrims:** Check upcoming match schedules and claim or release custom scrim lobby slots.
- **Videos:** Filter highlights, trailers, and recaps, and save videos to a watchlist.
- **3rd Party Tournaments:** Filter community and regional cups (`OPEN`, `UPCOMING`, `CLOSED`) and set event reminders.
- **Squad Roster:** View existing BGMI squad lineups and create or update a 4-player squad with IGNs and roles.
- **Account Modal:** Log in or sign up with an In-Game Name (IGN) and email/ID.

## Project Structure
- `App.js` — Main navigation hub, section preview, and authentication modal.
- `app.json` & `package.json` — Expo app configuration and dependencies.
- `eas.json` — EAS build profiles (`preview` and `production`).
- `src/data/` — Data modules for tournaments, rankings, calendar/scrims, videos, 3rd party tournaments, and squads.
- `src/screens/` — UI screens for each feature module.

## Running & Building
1. Install dependencies:
   ```bash
   npm install
