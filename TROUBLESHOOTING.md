# 🔧 Diagnostic & Troubleshooting

Guide complet pour diagnostiquer et résoudre les problèmes.

## ⚡ Diagnostic Rapide

Avant de chercher d'autres problèmes, faites ceci:

```bash
# 1. Vérifier Node.js
node --version    # Doit être 16+

# 2. Vérifier npm
npm --version

# 3. Vérifier que .env existe
ls -la backend/.env

# 4. Vérifier que les fichiers existent
ls -la backend/src/server.js
ls -la frontend/index.html

# 5. Vérifier que les ports sont libres
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

## 🚀 Backend Ne Démarre Pas

### Erreur: "Cannot find module"

**Symptôme:**
```
Error: Cannot find module '@prisma/client'
```

**Solution:**
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

**Explications:**
- Les dépendances ne sont pas installées
- Prisma n'a pas généré le client

---

### Erreur: "EADDRINUSE: address already in use :::3000"

**Symptôme:**
```
listen EADDRINUSE: address already in use :::3000
```

**Solution Option 1 - Tuer le processus:**

Windows:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -i :3000
kill -9 <PID>
```

**Solution Option 2 - Changer le port:**

```env
# backend/.env
PORT=3001  # ← Changer ici
```

Puis:
```bash
npm run dev
# Serveur sur port 3001
```

---

### Erreur: ".env file not found"

**Symptôme:**
```
Error loading .env file
```

**Solution:**
```bash
cd backend
cp .env.example .env

# Éditer .env avec vos credentials Google
nano .env   # ou vim, ou VS Code
```

Voir [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) pour obtenir les credentials.

---

### Erreur: "database not found"

**Symptôme:**
```
ENOENT: no such file or directory, open 'backend/prisma/dev.db'
```

**Solution:**
```bash
cd backend
npx prisma migrate dev --name init
```

Cela va:
- Créer la base de données
- Créer les tables
- Initialiser les données

---

## 🌐 Frontend Ne Charge Pas

### Erreur: "404 Not Found"

**Symptôme:**
```
GET http://localhost:5500/frontend/index.html 404
```

**Solution:**
1. Vérifier que le serveur HTTP tourne sur port 5500
2. Vérifier que le fichier existe:
   ```bash
   ls -la frontend/index.html
   ```
3. Vérifier l'URL est correcte:
   ```
   http://localhost:5500/frontend/index.html
   ```
4. Relancer le serveur:
   ```bash
   cd frontend
   python -m http.server 5500
   ```

---

### Erreur: "CORS error in console"

**Symptôme:**
```
Access to XMLHttpRequest at 'http://localhost:3000/api/login' 
from origin 'http://localhost:5500' has been blocked by CORS policy
```

**Solution:**

Vérifiez dans `backend/src/server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5500'],
  credentials: true
}));
```

Si le port est différent, modifiez-le.

---

### Erreur: "CSS not loading"

**Symptôme:**
```
No style on page, Console: 404 for css/style.css
```

**Solution:**
```bash
# Vérifier que le fichier existe
ls -la frontend/css/style.css

# Vérifier les chemins dans HTML
# index.html doit contenir:
# <link rel="stylesheet" href="css/style.css">

# Vérifier l'URL:
# http://localhost:5500/frontend/index.html
#                                 ^^^^^^^^^
#                           Pas de slash final!
```

---

## 🔐 Authentification

### Erreur: "Invalid credentials"

**Symptôme:**
```
Email/Password login fails même avec le bon mot de passe
```

**Causes possibles:**
1. L'utilisateur n'existe pas
2. Le mot de passe est faux
3. Le hash n'a pas fonctionné

**Solution:**
```bash
# 1. Vérifiez que l'utilisateur existe
cd backend
npx prisma studio  # http://localhost:5555

# Allez sur User table et cherchez l'email

# 2. Si pas d'utilisateur, créez-le
# Via l'interface ou via le frontend

# 3. Réessayez le login
```

---

### Erreur: "Invalid token"

**Symptôme:**
```
API calls fail avec erreur 403 "Invalid token"
```

**Causes:**
1. Token expiré (après 7 jours)
2. JWT_SECRET a changé
3. Token corrompu

**Solution:**
```javascript
// Frontend console
localStorage.clear()  // Supprimer le token
// Puis se reconnecter
```

---

### Erreur: "No token provided"

**Symptôme:**
```
API call retourne 401 "No token provided"
```

**Cause:**
Le header Authorization n'est pas envoyé.

**Solution:**
Vérifiez dans `frontend/js/main.js`:
```javascript
const response = await fetch(`${API_BASE_URL}/api/gmail/emails`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
    //           ↑ Important!
  }
});
```

---

## 📧 Gmail OAuth

### Erreur: "Invalid Client ID"

**Symptôme:**
```
During Google OAuth flow:
Error: invalid_client
The OAuth client was not found.
```

**Cause:**
Le Client ID est incorrect ou mal configuré.

**Solution:**
```bash
# 1. Vérifiez dans .env
cat backend/.env | grep GOOGLE_CLIENT_ID

# 2. Allez sur Google Cloud Console
# https://console.cloud.google.com

# 3. APIs & Services > Credentials
# 4. Trouvez votre OAuth 2.0 Client ID
# 5. Copiez le Client ID (complet)
# 6. Mettez dans .env:
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

Doit commencer par `...apps.googleusercontent.com`

---

### Erreur: "Redirect URI mismatch"

**Symptôme:**
```
redirect_uri_mismatch
The redirect_uri parameter does not match the registered redirect URI.
```

**Cause:**
L'URI de redirection ne correspond pas.

**Solution:**

1. **Dans Google Cloud Console:**
   - APIs & Services > Credentials
   - Cliquez sur votre Client ID
   - Vérifiez "Authorized redirect URIs"
   - Doit contenir: `http://localhost:3000/api/gmail/callback`

2. **Dans backend/.env:**
   ```env
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
   ```

Les deux doivent être **exactement identiques** (byte pour byte).

---

### Erreur: "The authorization server does not support this operation"

**Symptôme:**
```
Error: The authorization server does not support this operation
```

**Cause:**
L'API Gmail n'est pas activée.

**Solution:**
1. Allez sur [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services > Enabled APIs & services
3. Cherchez "Gmail API"
4. Si absent, cliquez "+ ENABLE APIS AND SERVICES"
5. Cherchez "Gmail"
6. Cliquez dessus
7. Cliquez "ENABLE"

---

### Erreur: "Access denied" lors de l'autorisation

**Symptôme:**
```
During Google OAuth:
Error: access_denied
```

**Causes:**
1. Vous n'êtes pas "Utilisateur de test"
2. Le scope demandé n'est pas autorisé

**Solution:**
1. Allez sur Google Cloud Console
2. APIs & Services > OAuth consent screen
3. Allez sur "Test users"
4. Cliquez "+ ADD USERS"
5. Entrez votre email Google
6. Cliquez "ADD"
7. Réessayez l'OAuth

---

## 📥 Gmail Sync

### Problème: "0 emails après sync"

**Symptôme:**
```
Click "Sync", get message "0 emails fetched"
```

**Causes possibles:**

1. **Inbox vide**
   - Vérifiez https://mail.google.com
   - Envoyez-vous un email de test

2. **Gmail non autorisé**
   - Cliquez "Connect Gmail"
   - Vérifiez que vous avez cliqué "Allow"

3. **Pas de MailAccount créé**
   ```bash
   # Vérifiez
   cd backend && npx prisma studio
   # Allez sur MailAccount table
   # Doit avoir une ligne avec provider="gmail"
   ```

4. **Token expiré**
   ```bash
   # Réconnectez Gmail
   # Cliquez "Connect Gmail" à nouveau
   ```

**Solution:**
```bash
# 1. Envoyez-vous un email
# Depuis Gmail: Send yourself a test email

# 2. Réauthorisez Gmail
# Backend: Voilà un email dans votre Inbox

# 3. Sync
# Click "Synchroniser"

# 4. Vérifiez la BD
# npx prisma studio → Email table
```

---

### Problème: "Erreur lors de la synchronisation"

**Symptôme:**
```
API error: Failed to fetch emails
```

**Cause:**
Token Google expiré ou invalide.

**Solution:**
```bash
# 1. Reconnectez Gmail
# Frontend: Click "Connect Gmail"

# 2. Réauthenifiez
# Click "Allow" sur Google

# 3. Réessayez sync
```

---

### Problème: "Les emails ne s'affichent pas"

**Symptôme:**
```
Inbox reste vide même après sync
```

**Vérification:**
```bash
cd backend
npx prisma studio  # http://localhost:5555

# Allez sur Email table
# Doit avoir des lignes
# Si vide: Prisma reset et refaites sync
```

---

## 🗄️ Base de Données

### Erreur: "database locked"

**Symptôme:**
```
SQLITE_BUSY: database is locked
```

**Cause:**
Deux processus accèdent à la BD simultanément.

**Solution:**
1. Arrêtez le backend: `Ctrl+C`
2. Attendez 5 secondes
3. Relancez: `npm run dev`

---

### Erreur: "syntax error near"

**Symptôme:**
```
SQLITE_ERROR: syntax error
```

**Cause:**
Le schéma Prisma est invalide.

**Solution:**
```bash
# Validez le schema
npx prisma validate

# Si erreur, corrigez backend/prisma/schema.prisma

# Puis refaites la migration
npx prisma migrate dev --name fix
```

---

### Besoin de réinitialiser la BD

**Solution:**
```bash
cd backend

# ⚠️ DANGER: Supprime TOUTES les données!
npx prisma reset

# Refaites la migration
npx prisma migrate dev --name init

# Puis relancez le backend
npm run dev
```

---

## 🧪 Tester l'API Manuellement

### Test Register

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Réponse attendue:
```json
{
  "message": "User registered successfully",
  "userId": 1,
  "email": "test@example.com"
}
```

---

### Test Login

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Réponse attendue:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "userId": 1,
  "email": "test@example.com"
}
```

---

### Test Endpoint Protégé

```bash
# Remplacez TOKEN par le token reçu ci-dessus
TOKEN="eyJhbGciOiJIUzI1NiIs..."

curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer $TOKEN"
```

Réponse attendue:
```json
{
  "id": 1,
  "email": "test@example.com",
  "createdAt": "2024-01-01T...",
  "accounts": [],
  "emails": []
}
```

---

## 📊 Vérifier l'État du Système

### Vérifier les processus

**Windows:**
```powershell
Get-Process | findstr node
# Doit montrer le backend
```

**Mac/Linux:**
```bash
ps aux | grep node
# Doit montrer le backend
```

---

### Vérifier les ports

**Windows:**
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :5500
```

**Mac/Linux:**
```bash
lsof -i :3000
lsof -i :5500
```

---

### Vérifier la connectivité

```bash
# Ping le backend
curl http://localhost:3000/health
# Doit retourner: {"status":"OK"}

# Vérifier le frontend
curl http://localhost:5500/frontend/index.html
# Doit retourner du HTML
```

---

## 📞 Support Avancé

### Activer les logs détaillés

**Node.js:**
```bash
DEBUG=* npm run dev
# Beaucoup plus de détails
```

**Prisma:**
```bash
export DEBUG="prisma:*"
npm run dev
```

---

### Inspecteur Node.js

```bash
# Lancer avec inspecteur
node --inspect src/server.js

# Ouvrir chrome://inspect dans Chrome
# Peut debugger en direct
```

---

### Vérifier les versions

```bash
node --version
npm --version
npx prisma --version
npm list express
npm list @prisma/client
```

---

## 🆘 Si Rien Ne Marche

1. **Réinstallez tout:**
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   npx prisma migrate reset
   npm run dev
   ```

2. **Réinitialisez la BD:**
   ```bash
   cd backend
   npx prisma reset
   npx prisma migrate dev --name init
   ```

3. **Vérifiez les credentials Google:**
   - Allez sur Google Cloud Console
   - Vérifiez le Client ID
   - Vérifiez l'URI de redirection
   - Vérifiez l'API Gmail est activée

4. **Vérifiez les ports:**
   ```bash
   # Tuer les processus qui utilisent les ports
   # Windows: taskkill /PID <PID> /F
   # Mac/Linux: kill -9 <PID>
   ```

5. **Consultez la documentation:**
   - [FAQ.md](./FAQ.md)
   - [README.md](./README.md)
   - [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)

---

**Problème non résolu? Consultez les fichiers:**
- [TECHNICAL_NOTES.md](./TECHNICAL_NOTES.md) - Architecture détaillée
- [USEFUL_COMMANDS.md](./USEFUL_COMMANDS.md) - Commandes utiles
- [FAQ.md](./FAQ.md) - Questions fréquentes
