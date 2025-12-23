# 🚀 GUIDE COMPLET DE DÉPLOIEMENT

## 📋 RÉSUMÉ DES OPTIONS

| Solution | Backend | Frontend | DB | Coût | Setup |
|----------|---------|----------|----|----|-------|
| **Render + Vercel** ⭐ | ✅ | ✅ | ✅ | Gratuit | 30 min |
| Railway + Netlify | ✅ | ✅ | ✅ | Gratuit | 30 min |
| AWS + S3 | ✅ | ✅ | ✅ | ~$5/mois | 1h |
| Heroku (fermé) | ❌ | ❌ | ❌ | N/A | N/A |

---

## ✅ SOLUTION RECOMMANDÉE: RENDER + VERCEL (GRATUIT)

### Avantages:
- ✅ **100% Gratuit** (avec limitations)
- ✅ **HTTPS automatique**
- ✅ **Auto-déploiement** via GitHub
- ✅ **Base de données** incluse
- ✅ **Facile à configurer** (30 minutes)
- ✅ **Bon pour démo/production légère**

### Limitations gratuites:
- Backend Render: Spin-down après 15 min d'inactivité
- 1 instance gratuite backend
- 100 GB bande passante/mois frontend
- Base de données: 1 DB PostgreSQL gratuite

---

## 🔧 ÉTAPE 1: PRÉPARER LE PROJET

### 1.1 Ajouter le fichier de configuration Render

```bash
# Créer le fichier build.sh
```

Fichier: `render.yaml` (à la racine)

```yaml
services:
  - type: web
    name: gmail-client-api
    env: node
    plan: free
    buildCommand: cd backend && npm install && npx prisma generate && npx prisma migrate deploy
    startCommand: cd backend && npm start
    envVars:
      - key: DATABASE_URL
        scope: build
      - key: GOOGLE_CLIENT_ID
      - key: GOOGLE_CLIENT_SECRET
      - key: JWT_SECRET
      - key: BACKEND_URL
        value: ${RENDER_EXTERNAL_URL}
    healthCheckPath: /health
    healthCheckStartupTimeout: 300
    
  - type: static_site
    name: gmail-client-web
    buildCommand: npm install && npm run build
    staticPublishPath: frontend
    envVars:
      - key: VITE_API_URL
        fromService:
          name: gmail-client-api
          property: host

databases:
  - name: gmail_client_db
    databaseName: gmail_client_db
    plan: free
    version: 14
```

### 1.2 Modifier `backend/package.json`

Ajouter le script start:
```json
"start": "node src/server.js"
```

### 1.3 Configurer la BD pour PostgreSQL

Modifier `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changer de "sqlite" à "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 📦 ÉTAPE 2: DÉPLOYER SUR GITHUB

### 2.1 Initialiser un repo GitHub

```bash
cd c:\Users\nazim\Documents\Stage

# Initialiser Git
git init
git add .
git commit -m "Gmail Client - Project Complete"

# Créer un repo sur https://github.com/new
# Puis:
git remote add origin https://github.com/VotreUsername/gmail-client.git
git branch -M main
git push -u origin main
```

### 2.2 Structure pour GitHub

```
gmail-client/
├── backend/              # Backend Node.js
├── frontend/             # Frontend HTML/CSS/JS
├── render.yaml          # Configuration Render
├── .gitignore           # Fichiers à ignorer
├── README.md
└── ...
```

---

## 🎯 ÉTAPE 3: DÉPLOYER LE BACKEND (RENDER)

### 3.1 Créer un compte Render

1. Aller à https://render.com
2. S'inscrire avec GitHub
3. Créer un nouveau Web Service

### 3.2 Configurer le Web Service

1. **Connecter le repo GitHub**
   - Sélectionner `gmail-client` repo
   - Branch: `main`

2. **Configuration**
   - Name: `gmail-client-api`
   - Environment: `Node`
   - Build Command: `cd backend && npm install && npx prisma migrate deploy`
   - Start Command: `cd backend && npm start`
   - Instance: `Free`

3. **Variables d'environnement** (à ajouter):
   ```
   DATABASE_URL=postgresql://user:pass@host/db
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   JWT_SECRET=your_jwt_secret
   BACKEND_URL=https://gmail-client-api.render.com
   NODE_ENV=production
   PORT=10000
   ```

4. **Cliquer Deploy**

⏰ Attendre ~5 minutes
✅ Votre backend sera en ligne à: `https://gmail-client-api.render.com`

---

## 🌐 ÉTAPE 4: DÉPLOYER LE FRONTEND (VERCEL)

### 4.1 Créer un compte Vercel

1. Aller à https://vercel.com
2. S'inscrire avec GitHub
3. Importer le projet

### 4.2 Configurer Vercel

1. **Importer le repo**
   - URL: `https://github.com/VotreUsername/gmail-client`

2. **Paramètres du projet**
   - Framework: `Other`
   - Build Command: Laisser vide (c'est du HTML statique)
   - Output Directory: `frontend`

3. **Variables d'environnement**
   ```
   VITE_API_URL=https://gmail-client-api.render.com
   ```

4. **Cliquer Deploy**

⏰ Attendre ~2 minutes
✅ Votre frontend sera en ligne à: `https://gmail-client.vercel.app`

---

## 🔐 ÉTAPE 5: CONFIGURER GOOGLE OAUTH

### 5.1 Ajouter les URLs de callback

1. Aller à https://console.cloud.google.com
2. Sélectionner votre projet Gmail Client
3. Aller à **Credentials** > Votre OAuth App
4. Ajouter **Authorized redirect URIs**:
   ```
   https://gmail-client-api.render.com/api/gmail/callback
   http://localhost:3000/api/gmail/callback
   ```

5. **Sauvegarde**

---

## 🧪 ÉTAPE 6: TESTER LE DÉPLOIEMENT

### 6.1 Tester le backend

```bash
curl https://gmail-client-api.render.com/health
# Résultat attendu: {"status":"OK"}
```

### 6.2 Tester le frontend

Ouvrir: https://gmail-client.vercel.app
- Tester l'enregistrement
- Tester la connexion
- Tester OAuth Gmail

### 6.3 Tester les emails

1. Se connecter
2. Cliquer "Connect Gmail"
3. Autoriser
4. Cliquer "Sync Emails"
5. Vérifier les emails dans Inbox

---

## 📊 APERÇU DU DÉPLOIEMENT

```
                    Internet Public
                          |
                  ________|_________
                 |                  |
            Vercel            Render.com
        (Frontend)            (Backend)
            |                      |
      HTML/CSS/JS            Node.js API
      Statique                    |
                           PostgreSQL
                              DB
```

---

## 💰 COÛTS MENSUELS

| Service | Coût | Limite |
|---------|------|--------|
| Render Frontend | Gratuit | Inclus |
| Render Backend | Gratuit | Spin-down après 15 min |
| Render PostgreSQL | Gratuit | 256 MB RAM |
| Vercel | Gratuit | 100 GB bande passante |
| **Total** | **Gratuit** | Démo/Petite prod |

💡 **Upgrade**: Si besoin de production réelle:
- Render Web Service: $7/mois
- Render PostgreSQL: $7/mois
- Vercel Pro: $20/mois
- **Total: ~$34/mois** (très bon marché!)

---

## 🚨 PROBLÈMES COURANTS

### Backend reste en "Building" trop longtemps
- Solution: Augmenter le timeout dans Render
- Ou exécuter `npx prisma generate` localement avant de push

### "DATABASE_URL not found"
- Vérifier: Render > votre Web Service > Environment
- Redéployer après avoir ajouté la var

### Frontend ne peut pas appeler le backend
- Vérifier: `VITE_API_URL` dans Vercel
- Vérifier: `CORS` dans `backend/src/server.js`

### OAuth ne fonctionne pas
- Vérifier: Google Cloud Console - Authorized redirect URIs
- Vérifier: `BACKEND_URL` dans les variables d'env Render

---

## 🔄 DÉPLOIEMENT CONTINU

Après chaque modification:

```bash
git add .
git commit -m "Mise à jour: description"
git push origin main
```

✅ Les deployments se font **automatiquement**!

---

## ✅ CHECKLIST FINAL

- [ ] Repo GitHub créé et poussé
- [ ] Backend déployé sur Render
- [ ] Frontend déployé sur Vercel
- [ ] Variables d'env configurées (Render)
- [ ] Google OAuth URLs mises à jour
- [ ] `/health` endpoint fonctionne
- [ ] Frontend charge correctement
- [ ] Enregistrement fonctionne
- [ ] OAuth Gmail fonctionne
- [ ] Sync emails fonctionne

---

## 🎉 RÉSULTAT FINAL

**Votre application est maintenant ONLINE!**

| Service | URL |
|---------|-----|
| 🌐 Frontend | `https://gmail-client.vercel.app` |
| 🔧 Backend API | `https://gmail-client-api.render.com` |
| 📧 API Health | `https://gmail-client-api.render.com/health` |

---

## 📞 SUPPORT

- Problème Render? → https://render.com/docs
- Problème Vercel? → https://vercel.com/docs
- Problème OAuth? → [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
- Problème général? → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Créé avec ❤️ | Version 1.0.0**
