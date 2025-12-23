# 📁 Structure Complète du Projet

## Vue d'ensemble

```
gmail-client/
├── backend/                    # API Node.js/Express
├── frontend/                   # Interface web (HTML/CSS/JS)
├── README.md                   # Documentation principale
├── QUICKSTART.md              # Guide d'installation rapide
├── GOOGLE_OAUTH_SETUP.md      # Guide credentials Google
├── TECHNICAL_NOTES.md         # Notes techniques avancées
├── ALTERNATIVE_CONFIGS.md     # Configurations alternatives
├── .gitignore                 # Fichiers à ignorer
├── setup.ps1                  # Script setup Windows
├── setup.sh                   # Script setup Linux/Mac
└── PROJECT_STRUCTURE.md       # Ce fichier
```

## 📂 Détail Backend

```
backend/
├── src/
│   ├── server.js              # Point d'entrée, express app
│   ├── config/
│   │   └── google.js          # Configuration OAuth Google
│   ├── routes/
│   │   ├── authRoutes.js      # Routes /register, /login
│   │   └── gmailRoutes.js     # Routes Gmail API
│   ├── controllers/
│   │   ├── authController.js  # Logique authentification
│   │   └── gmailController.js # Logique Gmail (sync, fetch)
│   ├── middleware/
│   │   └── verifyToken.js     # Middleware JWT
│   └── services/
│       └── tokenService.js    # Rafraîchissement auto tokens
├── prisma/
│   ├── schema.prisma          # Schéma base de données
│   └── dev.db                 # Base SQLite (auto-créée)
├── package.json               # Dépendances npm
├── .env                       # Credentials (SECRET)
├── .env.example               # Template .env
└── node_modules/              # Dépendances installées (ignoré)
```

## 📂 Détail Frontend

```
frontend/
├── index.html                 # Page Login/Register
├── dashboard.html             # Page Inbox
├── email.html                 # Page lecteur d'email
├── css/
│   └── style.css              # Styles globaux
├── js/
│   └── main.js                # Tout le JavaScript client
└── (pas de build process - vanilla JS)
```

## 📋 Description des Fichiers

### Backend Core

| Fichier | Rôle | Fonctionnalités |
|---------|------|-----------------|
| `server.js` | Point d'entrée | Express setup, middleware, routing |
| `config/google.js` | Config OAuth | getAuthUrl, getTokensFromCode, refreshAccessToken |
| `controllers/authController.js` | Auth logic | register, login, getCurrentUser |
| `controllers/gmailController.js` | Gmail logic | fetchAndSaveEmails, getEmails, getEmail |
| `middleware/verifyToken.js` | JWT middleware | Vérifie le token avant chaque requête |
| `services/tokenService.js` | Token refresh | Rafraîchit auto les tokens expirés |

### Routes API

| Method | Endpoint | Middleware | Description |
|--------|----------|-----------|-------------|
| POST | `/api/register` | - | Créer user |
| POST | `/api/login` | - | Se connecter |
| GET | `/api/me` | JWT | User actuel |
| GET | `/api/gmail/auth` | - | URL OAuth Google |
| GET | `/api/gmail/callback` | - | Callback OAuth |
| GET | `/api/gmail/fetch` | JWT | Sync emails |
| GET | `/api/gmail/emails` | JWT | Lister emails |
| GET | `/api/gmail/email/:id` | JWT | Un email |

### Base de Données

#### User
```
id          (PK, auto-increment)
email       (unique, string)
password    (hashed string)
createdAt   (datetime)
updatedAt   (datetime)
```

#### MailAccount (relation 1:Many avec User)
```
id           (PK)
provider     (string, "gmail")
accessToken  (string)
refreshToken (string, optional)
expiresAt    (datetime, optional)
userId       (FK vers User)
```

#### Email (relation Many:1 avec User)
```
id         (PK)
gmailId    (unique, string - ID Gmail)
userId     (FK vers User)
sender     (string)
subject    (string)
snippet    (string - aperçu)
body       (string, optional - contenu complet)
receivedAt (datetime)
```

### Frontend Pages

| Page | Fichier | Rôle |
|------|---------|------|
| Login/Register | `index.html` | Authentification |
| Dashboard | `dashboard.html` | Liste des emails |
| Email | `email.html` | Lecteur d'email |

### Styles CSS

| Classe | Utilisation |
|--------|------------|
| `.auth-container` | Container login/register |
| `.auth-box` | Box formulaire |
| `.dashboard-container` | Layout principal |
| `.sidebar` | Barre latérale |
| `.emails-container` | Zone emails |
| `.email-item` | Un email dans la liste |
| `.email-content` | Contenu d'un email |
| `.btn*` | Tous les boutons |
| `.form-group` | Groupe formulaire |

### JavaScript Main

| Fonction | Fichier | Rôle |
|----------|---------|------|
| `register()` | main.js | Enregistrement |
| `login()` | main.js | Connexion |
| `logout()` | main.js | Déconnexion |
| `connectGmail()` | main.js | OAuth Google |
| `syncEmails()` | main.js | Sync emails |
| `loadEmails()` | main.js | Charger liste |
| `loadEmail()` | main.js | Charger détail |
| `openEmail()` | main.js | Ouvrir email |
| `switchTab()` | main.js | Changer onglet |

## 🔄 Flow de Données

### Authentification Locale
```
User (Frontend)
  ↓ POST /api/register {email, password}
Backend
  ↓ Hash password (bcryptjs)
  ↓ Save to User table
  ↓ Response: {success, userId}
```

### Login Local
```
User (Frontend)
  ↓ POST /api/login {email, password}
Backend
  ↓ Find user
  ↓ Compare password
  ↓ Generate JWT
  ↓ Response: {token, userId}
User stores token in localStorage
```

### OAuth Google
```
User clicks "Connect Gmail" (Frontend)
  ↓ GET /api/gmail/auth
Backend
  ↓ Return Google Auth URL
  ↓ User redirected to Google
User authorizes
  ↓ Google redirects to /api/gmail/callback?code=xxx
Backend
  ↓ Exchange code for tokens
  ↓ Save to MailAccount table
  ↓ Redirect to dashboard
```

### Sync Emails
```
User clicks "Synchronize" (Frontend)
  ↓ GET /api/gmail/fetch (avec JWT)
Backend
  ↓ Get MailAccount for user
  ↓ Check if token expired
  ↓ If expired, refresh with refresh_token
  ↓ Call Gmail API (last 50 emails)
  ↓ Parse headers (from, subject, date, snippet)
  ↓ Get body for each email
  ↓ Save to Email table
  ↓ Response: {count: 50}
```

### Get Emails List
```
Frontend: GET /api/gmail/emails?page=1 (avec JWT)
Backend:
  ↓ Verify JWT token
  ↓ Query Email table (userId, paginated)
  ↓ Response: {emails: [], pagination: {page, total, pages}}
Frontend:
  ↓ Render email list
```

## 🔐 Sécurité

| Aspect | Implémentation |
|--------|-----------------|
| Passwords | Hashés avec bcryptjs (10 rounds) |
| JWT | Signé avec JWT_SECRET, 7 jours expiration |
| Google Tokens | Stockés en base (NOT en frontend) |
| Token Refresh | Auto-refresh si expiré (<5 min) |
| CORS | Configuré pour localhost uniquement |
| XSS Prevention | escapeHtml() pour user input |
| API Protection | Middleware JWT sur endpoints sensibles |

## 📊 Dépendances

### Backend
- **express**: Framework web
- **googleapis**: Google API client
- **@prisma/client**: ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT
- **dotenv**: Configuration
- **cors**: CORS middleware
- **axios**: HTTP client (optional)

### Frontend
- Vanilla JavaScript (0 dépendances)
- HTML5
- CSS3

### Dev
- **prisma**: CLI migrations
- **nodemon**: Auto-reload

## 🚀 Déploiement

### Variables d'environnement à configurer

```
GOOGLE_CLIENT_ID          (de Google Cloud)
GOOGLE_CLIENT_SECRET      (de Google Cloud)
GOOGLE_REDIRECT_URI       (votre URL)
JWT_SECRET                (clé aléatoire)
DATABASE_URL              (votre BD)
PORT                      (3000)
NODE_ENV                  (production)
```

### Processus de déploiement

1. Cloner repo
2. `npm install` dans backend
3. Configurer `.env`
4. `npx prisma migrate deploy`
5. `npm start`

## 📈 Métriques

| Métrique | Valeur |
|----------|--------|
| Fichiers source backend | ~500 lignes |
| Fichiers source frontend | ~800 lignes |
| Endpoints API | 8 |
| Tables BD | 3 |
| Dépendances npm | 10 principales |
| Temps setup initial | ~5 minutes |

## 📖 Documentation Externe

- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API](https://developers.google.com/gmail/api)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [JWT](https://jwt.io/)

---

**Commencez avec [QUICKSTART.md](./QUICKSTART.md)**
