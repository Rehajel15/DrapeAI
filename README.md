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
| Frontend | React Native with Expo (iOS, Android, web), Expo Router           |
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

- Node.js 24 LTS (Expo SDK 58 requires Node >= 22.13)
- Python 3.14 (version used in development)

### Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```powershell
cd frontend
npm install
npx expo start
```

Press `w` in the terminal to open the web version, or scan the QR code with Expo Go.

## Status

Early setup phase. The frontend is still the Expo starter template; the backend has no apps yet.
