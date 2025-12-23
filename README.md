# 📧 Gmail Client - Outlook Clone

Un mini-client Gmail minimaliste permettant de se connecter avec votre compte Google via OAuth2, de synchroniser vos emails et de les consulter dans une interface web simple.

## 🎯 Fonctionnalités

- ✅ **Authentification locale** : Inscription et connexion utilisateur (email + mot de passe)
- ✅ **OAuth2 Google** : Connexion sécurisée avec votre compte Google
- ✅ **Synchronisation emails** : Import des 50 derniers emails de votre Inbox Gmail
- ✅ **Base de données** : Stockage des emails avec Prisma ORM (SQLite par défaut)
- ✅ **Interface Inbox** : Liste des emails avec aperçu
- ✅ **Lecteur d'email** : Affichage complet du corps de l'email
- ✅ **JWT** : Authentification et sécurisation des endpoints API

## 🏗️ Architecture

```
project/
 ├─ backend/
 │   ├─ src/
 │   │   ├─ server.js                 (Point d'entrée)
 │   │   ├─ config/
 │   │   │   └─ google.js             (Configuration OAuth Google)
 │   │   ├─ routes/
 │   │   │   ├─ authRoutes.js         (Routes authentification)
 │   │   │   └─ gmailRoutes.js        (Routes Gmail API)
 │   │   ├─ controllers/
 │   │   │   ├─ authController.js     (Logique authentification)
 │   │   │   └─ gmailController.js    (Logique Gmail)
 │   │   └─ middleware/
 │   │       └─ verifyToken.js        (Vérification JWT)
 │   ├─ prisma/
 │   │   ├─ schema.prisma             (Schéma base de données)
 │   │   └─ dev.db                    (Base SQLite)
 │   ├─ package.json
 │   └─ .env                          (Variables d'environnement)
 │
 ├─ frontend/
 │   ├─ index.html                    (Login/Register)
 │   ├─ dashboard.html                (Inbox)
 │   ├─ email.html                    (Lecteur)
 │   ├─ css/
 │   │   └─ style.css                 (Styles)
 │   └─ js/
 │       └─ main.js                   (JavaScript client)
 │
 └─ README.md
```

## 🛠️ Technologies

| Catégorie | Technologies |
|-----------|--------------|
| **Backend** | Node.js, Express.js |
| **OAuth** | googleapis, Google OAuth2 |
| **Sécurité** | bcryptjs, jsonwebtoken |
| **BD** | Prisma ORM, SQLite (MySQL optionnel) |
| **Frontend** | HTML, CSS, Vanilla JavaScript |
| **Autres** | dotenv, cors, axios |

## ⚙️ Installation

### Prérequis

- Node.js 16+ installé
- npm ou yarn
- Compte Google pour créer les credentials OAuth

### 1️⃣ Configuration Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet
3. Activez l'API Gmail
4. Créez un "OAuth 2.0 Client ID" (Application Web)
5. Ajoutez l'URI de redirection autorisée : `http://localhost:3000/api/gmail/callback`
6. Copiez votre **Client ID** et **Client Secret**

### 2️⃣ Installation Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
# (voir .env.example et y ajouter vos credentials Google)
# Exemple:
# GOOGLE_CLIENT_ID=votre_client_id
# GOOGLE_CLIENT_SECRET=votre_client_secret
# GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
# JWT_SECRET=votre_clé_secrète
# DATABASE_URL=sqlite:./prisma/dev.db
# PORT=3000

# Initialiser la base de données
npx prisma migrate dev --name init

# Lancer le serveur
npm run dev
```

### 3️⃣ Installation Frontend

Le frontend fonctionne avec un simple serveur HTTP statique.

**Option A : Utiliser VS Code Live Server**
- Installez l'extension "Live Server"
- Cliquez droit sur `frontend/index.html` → "Open with Live Server"
- Le frontend sera à `http://localhost:5500/frontend/`

**Option B : Utiliser Python**
```bash
cd frontend
python -m http.server 5500
```

**Option C : Utiliser Node http-server**
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

## 🚀 Lancement

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Le backend tourne sur `http://localhost:3000`

### Terminal 2 - Frontend
- Via Live Server de VS Code, OU
- Via serveur Python, OU
- Via http-server

Ensuite ouvrez `http://localhost:5500/frontend/index.html` (ou votre URL locale)

## 📝 Utilisation

### 1️⃣ S'enregistrer
- Allez à la page Login
- Cliquez sur "Inscription"
- Remplissez email et mot de passe
- Cliquez "S'inscrire"

### 2️⃣ Se connecter
- Rentrez vos identifiants
- Cliquez "Se connecter"

### 3️⃣ Connecter Gmail
- Dans le dashboard, cliquez "🔑 Connecter Gmail"
- Acceptez les permissions Google (lecture des emails)
- Vous serez redirigé au dashboard

### 4️⃣ Synchroniser les emails
- Cliquez le bouton "🔄 Synchroniser"
- Attendez le message de confirmation
- Les emails s'affichent dans Inbox

### 5️⃣ Lire un email
- Cliquez sur un email de la liste
- Lisez son contenu complet

## 📊 Schéma Base de Données

```prisma
model User {
  id        Int
  email     String (unique)
  password  String (hashé)
  accounts  MailAccount[]  // Comptes OAuth (Gmail)
  emails    Email[]        // Emails stockés
}

model MailAccount {
  id           Int
  provider     String         // "gmail"
  accessToken  String         // Token d'accès Google
  refreshToken String?        // Token de rafraîchissement
  expiresAt    DateTime?      // Expiration du token
  user         User           // Relation
  userId       Int
}

model Email {
  id         Int
  gmailId    String (unique)  // ID Gmail
  userId     Int
  sender     String           // Expéditeur
  subject    String           // Sujet
  snippet    String           // Aperçu
  body       String?          // Corps (HTML/texte)
  receivedAt DateTime         // Date de réception
  user       User             // Relation
}
```

## 🔌 API Endpoints

### Authentification
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/register` | POST | Créer un nouvel utilisateur |
| `/api/login` | POST | Se connecter |
| `/api/me` | GET | Récupérer l'utilisateur actuel |

### Gmail (nécessite JWT)
| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/gmail/auth` | GET | Récupérer URL OAuth Google |
| `/api/gmail/callback` | GET | Callback OAuth Google |
| `/api/gmail/fetch` | GET | Synchroniser les emails |
| `/api/gmail/emails` | GET | Lister les emails (paginated) |
| `/api/gmail/email/:id` | GET | Récupérer un email |

## 🔐 Sécurité

- ✅ Passwords hashés avec bcryptjs
- ✅ JWT pour l'authentification
- ✅ Tokens Google stockés en base (NOT en frontend)
- ✅ Rafraîchissement automatique des tokens expirés
- ✅ Scopes minimalistes (lecture emails uniquement)
- ✅ CORS configuré

## 📝 Variables d'environnement (.env)

```env
# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback

# JWT
JWT_SECRET=votre_clé_secrète_super_longue

# Database
DATABASE_URL="sqlite:./prisma/dev.db"
# Pour MySQL: DATABASE_URL="mysql://user:password@localhost:3306/gmail_client"

# Server
PORT=3000
NODE_ENV=development
```

## 🐛 Dépannage

### Erreur "Gmail account not connected"
- Vérifiez que vous avez cliqué sur "Connecter Gmail"
- Vérifiez que la redirection OAuth s'est bien passée

### Erreur CORS
- Vérifiez que le frontend et backend tournent sur les bonnes URLs
- Vérifiez la configuration CORS dans `server.js`

### Erreur de base de données
```bash
cd backend
npx prisma reset  # Réinitialiser la BD
npx prisma migrate dev --name init
```

### Pas d'emails affichés
- Cliquez sur "Synchroniser" après connexion Gmail
- Vérifiez les permissions OAuth
- Vérifiez que votre Inbox Gmail n'est pas vide

## 📧 Support Gmail uniquement

Ce projet supporte **seulement Gmail**. Pas de support pour Outlook, Yahoo Mail, etc.

## 🎓 Ressources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API](https://developers.google.com/gmail/api)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js](https://expressjs.com)

## 📄 Licence

MIT

## 👨‍💻 Auteur

Créé comme exemple d'intégration OAuth2 Google avec Node.js

---

**Bon développement! 🚀**
