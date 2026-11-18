# DrapeAI

An AI wardrobe app, built as a full-stack learning project (inspired by Alta).

## Planned features

- Digital wardrobe: add your own clothing items (photo + metadata)
- Outfit suggestions based on location, weather, occasion and personal style, using only wardrobe items
- Outfit preview as a collage
- Explanation of why a look works

## Tech stack

| Part     | Technology                                                        |
| -------- | ----------------------------------------------------------------- |
| Frontend | React Native with Expo SDK 58 (iOS, Android, web), Expo Router    |
| Styling  | NativeWind (Tailwind CSS), React Native Reusables (UI components) |
| Backend  | Django, Django REST Framework                                     |
| AI       | External APIs only (planned)                                      |

## Project structure

```
DrapeAI/
├── backend/    Django project (settings package: config/)
└── frontend/   Expo app (routes in src/app/)
```

## Getting started

### Prerequisites

- Node.js 24 LTS
- Python 3.14 (version used in development)

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env   # then set SECRET_KEY in .env
python manage.py migrate
python manage.py runserver 0.0.0.0:8000   # 0.0.0.0 makes it reachable from a phone in the same network
```

To use the app on a phone with Expo Go, add your PC's LAN IP to `ALLOWED_HOSTS` in `backend/.env`. The frontend finds the backend automatically via the Expo dev server's host.

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env   # backend URL, see comment inside
npx expo start
```

Press `w` in the terminal to open the web version, or scan the QR code with Expo Go. The phone needs an Expo Go version for SDK 58 (see [expo.dev/go](https://expo.dev/go)).

## Status

Early phase. The onboarding is built: a welcome page that asks for the name, then age, sign-up with email and password, and a final "You're all set" page. Signing up creates the account on the backend (`POST /api/auth/signup/`). The app behind the onboarding is still the Expo starter template.
