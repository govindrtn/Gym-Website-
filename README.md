# Silver Gym

A complete React + Vite gym website for Silver Gym, built with a Metronic-inspired theme setup and reusable UI components.

## Tech

- React 18
- Vite 5
- Tailwind CSS 4
- Node.js + Express API
- MongoDB + Mongoose database
- JWT auth with seeded admin/member demo accounts
- Metronic-style theme tokens
- Reusable Button, Card, Badge, and Input components
- Lucide icons

## Run

```bash
npm install
npm run dev
```

Frontend only runs at `http://127.0.0.1:5173`.

## Full Stack

1. MongoDB local service start karo, ya MongoDB Atlas URI use karo.
2. `.env.example` se `.env` banao and values update karo.
3. Frontend + backend ek saath run karo:

```bash
npm run dev:full
```

- Frontend: `http://127.0.0.1:5173`
- Backend API: `http://127.0.0.1:5000/api`
- Health check: `http://127.0.0.1:5000/api/health`

Demo login seed hoga:

```text
admin@silvergym.com / admin123
member@silvergym.com / member123
```

## Build

```bash
npm run build
```

## Free Deployment

Deployment setup repository me included hai:

- Frontend: GitHub Pages at `https://govindrtn.github.io/Gym-Website-/`
- Backend: Render at `https://silver-gym-api-govindrtn.onrender.com`
- Database: MongoDB Atlas free cluster

Deploy karne ke steps:

1. MongoDB Atlas me free cluster banao, database user create karo, aur Network Access me Render ke liye `0.0.0.0/0` allow karo.
2. Atlas connection string me password aur database name set karke `MONGODB_URI` ready karo.
3. Render dashboard me `New > Blueprint` select karke ye GitHub repository connect karo.
4. Blueprint deploy ke waqt `MONGODB_URI` enter karo. Baaki backend values `render.yaml` se configure hongi.
5. GitHub repository me `Settings > Pages > Build and deployment > Source` ko `GitHub Actions` select karo.
6. `main` branch push hone par `.github/workflows/deploy-pages.yml` frontend deploy karega.

Render free service inactivity ke baad sleep ho sakta hai, isliye first API request/login me kuch seconds lag sakte hain. Demo forgot-password link response me expose hota hai; real production use se pehle email provider add karke `EXPOSE_RESET_LINK=false` karo.

## Backend API

- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/logout`
- `GET /api/members`
- `POST /api/members`
- `PATCH /api/members/:id/attendance`
- `PATCH /api/members/:id/due-paid`
- `DELETE /api/members/:id`
- `POST /api/members/reset-demo`
- `GET /api/coaches`
- `POST /api/coaches`
- `DELETE /api/coaches/:id`
- `POST /api/enquiries`

Frontend backend unavailable hone par localStorage fallback use karega, so UI development block nahi hoti.

Development mode me forgot-password response reset link return karta hai, jo Forgot Password screen par show hota hai. Production me email provider connect karke `EXPOSE_RESET_LINK=false` rakho.

## Client Theme Config

Header ke theme button se light/dark mode, template, aur brand accent color change ho sakta hai. Selection browser localStorage me save hoti hai.

Config options yahan maintain hote hain:

- `src/constants/theme.js` - modes, templates, accent colors
- `src/services/themePreferenceService.js` - persistence and DOM theme application
- `src/components/site/ThemeCustomizer.jsx` - header customizer UI
- `src/styles/metronic/config.metronic.css` - CSS token presets

Client-specific default set karna ho to `DEFAULT_THEME_PREFERENCES` update karo.

## Google Sheet Sync

Google Sheet URL abhi optional hai. URL nahi hoga to app localStorage par normal chalega.

1. Google Sheet create karo.
2. Sheet me `Extensions > Apps Script` open karo.
3. `google-sheets/apps-script-web-app.gs` ka code paste karo.
4. Deploy as Web App: execute as `Me`, access `Anyone with the link`.
5. Web App `/exec` URL ko `.env.local` me add karo:

```bash
VITE_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_WEB_APP_ID/exec
```

## Key Files

- `src/App.jsx` - app state and section composition
- `src/data/siteData.jsx` - brand, section, schedule, coach, and plan data
- `src/components/site` - section-level website components and CSS
- `src/constants` - shared colors and fonts constants
- `src/services/gymApiService.js` - frontend API service for backend data
- `src/services/googleSheetService.js` - optional Google Sheet sync webhook service
- `src/constants/theme.js` - client theme/template/color options
- `server/index.js` - Express API entry point
- `server/models` - MongoDB models
- `server/routes` - auth, members, coaches, and enquiries API routes
- `src/styles/metronic/globals.css` - Metronic-inspired theme config
- `src/components/ui` - reusable UI components
- `public/assets/gym-hero.png` - generated hero image

## Standards

- `REACT_CODING_STANDARDS.md` - project React coding conventions
