# Installation et Lancement Rapide

## 🚀 Start Up Guide

### Étape 1: Préparer Google OAuth

1. Allez sur https://console.cloud.google.com
2. Créez un nouveau projet
3. Recherchez et activez l'API "Gmail API"
4. Créez des identifiants OAuth 2.0:
   - Type: Application Web
   - URI autorisées: `http://localhost:3000/api/gmail/callback`
5. Copiez le **Client ID** et **Client Secret**

### Étape 2: Configuration Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer et éditer .env
echo "GOOGLE_CLIENT_ID=votre_client_id" > .env
echo "GOOGLE_CLIENT_SECRET=votre_client_secret" >> .env
echo "GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback" >> .env
echo "JWT_SECRET=clé_super_secrète" >> .env
echo "DATABASE_URL=sqlite:./prisma/dev.db" >> .env
echo "PORT=3000" >> .env
echo "NODE_ENV=development" >> .env

# Initialiser la base de données
npx prisma migrate dev --name init

# Lancer le backend
npm run dev
```

### Étape 3: Configuration Frontend

**Avec Live Server (VS Code)**:
- Installez l'extension "Live Server"
- Cliquez droit sur `frontend/index.html` → "Open with Live Server"

**Avec Python**:
```bash
cd frontend
python -m http.server 5500
```

**Avec Node**:
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

### Étape 4: Accéder à l'application

Ouvrez: **http://localhost:5500/frontend/index.html**

## ✅ Checklist d'installation

- [ ] Node.js installé (16+)
- [ ] Credentials Google obtenues
- [ ] Backend: `npm install` ✓
- [ ] Backend: `.env` configuré ✓
- [ ] Backend: `npx prisma migrate dev` ✓
- [ ] Backend: `npm run dev` lancé ✓
- [ ] Frontend: Serveur HTTP lancé (port 5500) ✓
- [ ] Frontend: Accessible sur http://localhost:5500/frontend/

## 📊 Vérification

```bash
# Terminal 1: Vérifier backend
curl http://localhost:3000/health
# Réponse: {"status":"OK"}

# Terminal 2: Ouvrir frontend
# http://localhost:5500/frontend/index.html
```

## 🐛 Problèmes courants

### "Cannot find module '@prisma/client'"
```bash
cd backend
npx prisma generate
```

### "EADDRINUSE: address already in use :::3000"
Le port 3000 est déjà utilisé. Changez `PORT` dans `.env`

### "CORS error"
Vérifiez les URLs dans `.env` et dans `server.js`

### "No emails appearing"
1. Cliquez "Connecter Gmail"
2. Acceptez les permissions Google
3. Cliquez "Synchroniser"

## 🎯 Pour aller plus loin

- [ ] Convertir SQLite en MySQL
- [ ] Ajouter plus d'endpoints Gmail (Mark as read, etc.)
- [ ] Implémenter la suppression d'emails
- [ ] Ajouter les dossiers (Labels) Gmail
- [ ] Support du multi-provider (Outlook, etc.)

---

**Questions? Consultez le README.md principal**
