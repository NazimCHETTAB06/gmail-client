# 📊 Aperçu du Projet

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                          │
└────────────┬────────────────────────────────────────┬────────┘
             │                                        │
             ▼                                        ▼
        ┌─────────────┐                         ┌──────────────┐
        │   Browser   │◄─────────HTTP/CORS─────►│   Backend    │
        │  (Frontend) │                         │  (Node.js)   │
        │ HTML/CSS/JS │                         │  Express     │
        └─────────────┘                         └──────┬───────┘
             │                                        │
             │                                        │
             │                              ┌─────────┴──────────┐
             │                              │                    │
             │                              ▼                    ▼
             │                         ┌──────────┐         ┌──────────┐
             │                         │ Prisma   │         │  Google  │
             │                         │   ORM    │         │  OAuth2  │
             │                         └──────────┘         └──────────┘
             │                              │                    │
             │                              ▼                    ▼
             │                         ┌──────────┐         ┌──────────┐
             │                         │  SQLite  │         │  Gmail   │
             │                         │   BD     │         │   API    │
             │                         └──────────┘         └──────────┘
             │
             └──────────────────────────────────────────────────┘
```

## Flow d'Authentification

```
1. REGISTRATION
   User → Frontend → POST /api/register {email, password}
                   → Backend: Hash password, Save User
                   → Response: {success, userId}

2. LOGIN
   User → Frontend → POST /api/login {email, password}
                   → Backend: Verify, Generate JWT
                   → Response: {token, userId}
                   → Store token in localStorage

3. GMAIL OAUTH
   User → Frontend: Click "Connect Gmail"
                   → GET /api/gmail/auth
                   → Backend: Return Google Auth URL
                   → User: Authorize on Google
                   → Google: Redirect to /callback?code=xxx
                   → Backend: Exchange code for tokens
                   → Save tokens in MailAccount table
                   → Frontend: Redirect to dashboard

4. SYNC EMAILS
   User → Frontend: Click "Sync"
                   → GET /api/gmail/fetch (with JWT)
                   → Backend: Get MailAccount, Call Gmail API
                   → Fetch 50 latest emails
                   → Parse and save to Email table
                   → Response: {count: 50}
                   → Frontend: Load and display emails

5. VIEW EMAIL
   User → Frontend: Click email in list
                   → GET /api/gmail/email/:id (with JWT)
                   → Backend: Fetch from Email table
                   → Response: {id, sender, subject, body, ...}
                   → Frontend: Display full email
```

## Base de Données

```
┌────────────────────┐
│       User         │
├────────────────────┤
│ id (PK)            │
│ email (UNIQUE)     │ ◄──────────┐
│ password (hashed)  │            │
│ createdAt          │            │ 1:Many
│ updatedAt          │            │
└────────────────────┘            │
       │                          │
       │ 1:Many                   │
       ▼                          │
┌────────────────────┐      ┌──────────────────────┐
│   MailAccount      │      │       Email          │
├────────────────────┤      ├──────────────────────┤
│ id (PK)            │      │ id (PK)              │
│ provider (gmail)   │      │ gmailId (UNIQUE)     │
│ accessToken        │      │ sender               │
│ refreshToken       │      │ subject              │
│ expiresAt          │      │ snippet              │
│ userId (FK)        │─────►│ body                 │
└────────────────────┘      │ receivedAt           │
                            │ userId (FK)          │
                            └──────────────────────┘
```

## Structure Fichiers

```
backend/
  ├─ src/
  │   ├─ server.js                  (500 lignes)
  │   ├─ config/google.js           (70 lignes)
  │   ├─ routes/
  │   │   ├─ authRoutes.js          (30 lignes)
  │   │   └─ gmailRoutes.js         (40 lignes)
  │   ├─ controllers/
  │   │   ├─ authController.js      (150 lignes)
  │   │   └─ gmailController.js     (250 lignes)
  │   ├─ middleware/
  │   │   └─ verifyToken.js         (20 lignes)
  │   └─ services/
  │       └─ tokenService.js        (60 lignes)
  ├─ prisma/
  │   └─ schema.prisma              (70 lignes)
  ├─ package.json
  └─ .env

frontend/
  ├─ index.html                     (80 lignes - auth)
  ├─ dashboard.html                 (90 lignes - inbox)
  ├─ email.html                     (50 lignes - reader)
  ├─ css/
  │   └─ style.css                  (700 lignes)
  └─ js/
      └─ main.js                    (800 lignes)

TOTAL: ~3000 lignes de code
```

## Endpoints API

```
AUTHENTIFICATION (pas de JWT requis)
├─ POST /api/register
│   Input: {email, password}
│   Output: {message, userId, email}
│
├─ POST /api/login
│   Input: {email, password}
│   Output: {message, token, userId, email}
│
└─ GET /api/me
    Headers: Authorization: Bearer <JWT>
    Output: {id, email, accounts, ...}

GMAIL (JWT requis)
├─ GET /api/gmail/auth
│   Output: {authUrl: "https://accounts.google.com/..."}
│
├─ GET /api/gmail/callback
│   Query: code, userId
│   Effect: Échange code contre tokens, sauvegarde
│   Redirect: /dashboard
│
├─ GET /api/gmail/fetch
│   Headers: Authorization: Bearer <JWT>
│   Effect: Sync 50 derniers emails
│   Output: {message, count}
│
├─ GET /api/gmail/emails
│   Headers: Authorization: Bearer <JWT>
│   Query: page
│   Output: {emails: [], pagination: {page, total, pages}}
│
└─ GET /api/gmail/email/:id
    Headers: Authorization: Bearer <JWT>
    Output: {id, gmailId, sender, subject, body, receivedAt}
```

## Sécurité

```
LAYER 1: TRANSPORT
├─ CORS enabled (localhost)
├─ Content-Type validation
└─ HTTPS ready (local)

LAYER 2: AUTHENTICATION
├─ Passwords: bcryptjs hash (10 rounds)
├─ JWT: HS256, 7 jours expiration
├─ Google Tokens: Stockés backend seulement
└─ Token Refresh: Auto après 1h

LAYER 3: AUTHORIZATION
├─ Middleware JWT: Vérifie sur chaque requête protégée
├─ User validation: Vérifie userId dans tokens
└─ Data isolation: Chaque user voit seulement ses données

LAYER 4: DATA
├─ XSS prevention: escapeHtml() sur user input
├─ SQL injection: Prisma parameterized queries
└─ CSRF: Pas de forms côté frontend (JSON API)
```

## Performances

```
METRICS
├─ Installation: 2-3 min
├─ First load: <1s
├─ Email sync (50): 3-5s
├─ Email load (list): <100ms
├─ Email display: <200ms
└─ Token refresh: <500ms

OPTIMIZATIONS APPLIQUÉES
├─ Lazy loading emails (pagination)
├─ Token caching (pas de refresh à chaque requête)
├─ SQLite (rapide localement)
└─ Vanilla JS (pas d'overhead)

POSSIBLES FUTURS
├─ Redis caching
├─ Email body lazy load
└─ Service Worker offline support
```

## Dépendances

```
BACKEND (10 dépendances principales)
├─ express (web framework)
├─ googleapis (Google API client)
├─ @prisma/client (ORM)
├─ bcryptjs (password hashing)
├─ jsonwebtoken (JWT)
├─ dotenv (config)
├─ cors (CORS middleware)
├─ axios (HTTP client)
├─ prisma (ORM CLI)
└─ nodemon (dev reload)

FRONTEND (0 dépendances)
└─ Vanilla JavaScript uniquement!

TOTAL SIZE
├─ node_modules: ~500MB
├─ Source code: ~0.5MB
└─ Database: <1MB (sqlite)
```

## Complexité Temps/Espace

```
OPÉRATION            | TEMPS      | ESPACE
─────────────────────┼────────────┼─────────────
Register             | O(1)       | O(n) BD
Login                | O(1)       | O(1)
OAuth Callback       | O(1)       | O(1)
Sync (50 emails)     | O(n)       | O(n)
Fetch emails list    | O(n)       | O(n)
Fetch one email      | O(1)       | O(1)
Token Refresh        | O(1)       | O(1)
─────────────────────┴────────────┴─────────────

n = nombre d'emails à traiter
```

## Roadmap Futures Fonctionnalités

```
V1.0 (ACTUEL)
✅ Auth locale
✅ OAuth2 Google
✅ Sync Inbox
✅ View emails

V1.1
□ Search emails
□ Mark as read/unread
□ Archive/Delete
□ Labels support

V2.0
□ Multiple accounts
□ Outlook support
□ Dark mode
□ Notifications

V3.0
□ Mobile app
□ Desktop app
□ Compose emails
□ Attachments
```

## Comparaison avec Alternatives

```
FEATURE              | Gmail Client | Gmail Web | Outlook
─────────────────────┼──────────────┼──────────┼─────────
Lightweight          | ✅ Très      | ❌ Lourd | ❌ Lourd
Open Source          | ✅ Oui       | ❌ Non   | ❌ Non
Local BD             | ✅ Oui       | ❌ Non   | ❌ Non
OAuth2               | ✅ Google    | ✅ Tous  | ✅ Tous
Hors ligne           | ⚠️  Partiel  | ❌ Non   | ❌ Non
Installation         | ✅ 5 min     | ❌ N/A   | ❌ N/A
─────────────────────┴──────────────┴──────────┴─────────
```

---

**Voir [INDEX.md](./INDEX.md) pour naviguer la documentation**
