# ✅ Pre-Launch Checklist

Utilisez cette checklist avant de lancer l'application pour vous assurer que tout est correctement configuré.

## 🔐 Configuration Google OAuth

- [ ] Compte Google créé
- [ ] Google Cloud Console: https://console.cloud.google.com
- [ ] Nouveau projet créé
- [ ] API Gmail activée
- [ ] Écran de consentement OAuth créé
- [ ] OAuth 2.0 Client ID (Web application) créé
- [ ] URI autorisée: `http://localhost:3000/api/gmail/callback` ✓
- [ ] Client ID copié
- [ ] Client Secret copié

Ressource: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

## 🛠️ Installation Backend

- [ ] Node.js 16+ installé
  ```bash
  node --version  # Vérifier
  ```
- [ ] npm installé
  ```bash
  npm --version   # Vérifier
  ```
- [ ] Répertoire `backend` existe
- [ ] `package.json` créé
- [ ] Dépendances installées
  ```bash
  cd backend
  npm install
  ```
- [ ] Fichier `.env` créé avec:
  ```
  GOOGLE_CLIENT_ID=votre_client_id
  GOOGLE_CLIENT_SECRET=votre_secret
  GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
  JWT_SECRET=votre_cle_secrete
  DATABASE_URL=sqlite:./prisma/dev.db
  PORT=3000
  NODE_ENV=development
  ```

## 🗄️ Base de Données

- [ ] Prisma installé
  ```bash
  npm install @prisma/client prisma
  ```
- [ ] Fichier `prisma/schema.prisma` créé
- [ ] Migration initialisée
  ```bash
  npx prisma migrate dev --name init
  ```
- [ ] Fichier `prisma/dev.db` créé
- [ ] Tables créées:
  - [ ] User
  - [ ] MailAccount
  - [ ] Email

Vérifier avec:
```bash
npx prisma studio  # Ouvre l'interface graphique
```

## 📝 Code Backend

- [ ] `src/server.js` créé et contient Express setup
- [ ] `src/config/google.js` créé avec OAuth config
- [ ] `src/routes/authRoutes.js` créé avec /register, /login
- [ ] `src/routes/gmailRoutes.js` créé avec endpoints Gmail
- [ ] `src/controllers/authController.js` créé avec logique auth
- [ ] `src/controllers/gmailController.js` créé avec logique Gmail
- [ ] `src/middleware/verifyToken.js` créé pour JWT
- [ ] `src/services/tokenService.js` créé pour auto-refresh

## 🌐 Frontend

- [ ] Répertoire `frontend` existe
- [ ] `frontend/index.html` créé (login/register)
- [ ] `frontend/dashboard.html` créé (inbox)
- [ ] `frontend/email.html` créé (lecteur)
- [ ] `frontend/css/style.css` créé avec styles
- [ ] `frontend/js/main.js` créé avec logique client

## 🚀 Configuration Serveur

- [ ] Port 3000 disponible (pas en utilisation)
  ```bash
  # Windows
  netstat -ano | findstr :3000
  
  # Mac/Linux
  lsof -i :3000
  ```
- [ ] Port 5500 disponible pour frontend
  ```bash
  # Windows
  netstat -ano | findstr :5500
  
  # Mac/Linux
  lsof -i :5500
  ```

## 📚 Documentation

- [ ] `README.md` créé
- [ ] `QUICKSTART.md` créé
- [ ] `GOOGLE_OAUTH_SETUP.md` créé
- [ ] `TECHNICAL_NOTES.md` créé
- [ ] `PROJECT_STRUCTURE.md` créé
- [ ] `.gitignore` créé

## ✨ Vérifications Finales

### Backend Health Check
```bash
cd backend
npm run dev
# Attendez: ✅ Server running on http://localhost:3000
# Attendez: 🔄 Starting token refresh service
```

Ouvrez dans un nouvel onglet: `http://localhost:3000/health`
- [ ] Response: `{"status":"OK"}`

### Frontend Access
1. Lancez le serveur frontend (Live Server ou `python -m http.server 5500`)
2. [ ] Accessible sur `http://localhost:5500/frontend/index.html`
3. [ ] Page charge correctement
4. [ ] Formulaire login/register visible
5. [ ] CSS chargé (pas d'erreurs 404)

### Fonctionnalité Register
- [ ] Remplir email unique
- [ ] Remplir mot de passe
- [ ] Cliquer "S'inscrire"
- [ ] Message succès apparu
- [ ] User créé en base (vérifier avec Prisma Studio)

### Fonctionnalité Login
- [ ] Utiliser l'email créé
- [ ] Utiliser le bon mot de passe
- [ ] Cliquer "Se connecter"
- [ ] Redirigé vers dashboard
- [ ] JWT stocké en localStorage

### Fonctionnalité Gmail OAuth
- [ ] Sur dashboard, cliquer "🔑 Connecter Gmail"
- [ ] Redirigé vers écran Google
- [ ] Cliquer "Accepter" les permissions
- [ ] Redirigé vers dashboard
- [ ] Message "✅ Gmail connecté" apparu
- [ ] MailAccount créé en base

### Fonctionnalité Sync
- [ ] Cliquer "🔄 Synchroniser"
- [ ] Message avec nombre d'emails
- [ ] Emails affichés dans Inbox
- [ ] Email table remplie en base

### Fonctionnalité Lecture
- [ ] Cliquer sur un email
- [ ] Redirection vers email.html
- [ ] Contenu complet affiché
- [ ] Sujet, expéditeur, date visibles

## 🐛 Dépannage Rapide

| Problème | Solution |
|----------|----------|
| Port 3000 en utilisation | Changer PORT dans .env |
| Erreur credentials Google | Vérifier Client ID/Secret |
| Pas d'emails après sync | Vérifier Gmail autorisé, Inbox non vide |
| CORS error | Vérifier URL du frontend dans CORS config |
| Token invalide | Supprimer localStorage, se reconnecter |
| Erreur BD | `npx prisma reset` puis migrations |

## 📝 Notes

- Garder deux terminaux ouverts: un pour backend, un pour commands
- Garder Google Cloud Console ouverte pour vérifier credentials
- Utiliser Prisma Studio pour vérifier la BD: `npx prisma studio`
- Les tokens JWT expirent après 7 jours
- Les credentials Google expirent après ~1 heure (auto-refresh)

## 🎉 C'est prêt!

Une fois toutes les cases cochées, vous êtes prêt à:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
python -m http.server 5500

# Puis ouvrir
http://localhost:5500/frontend/index.html
```

---

**Questions? Consultez:**
- [QUICKSTART.md](./QUICKSTART.md) - Installation rapide
- [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - Guide Google
- [README.md](./README.md) - Documentation complète
