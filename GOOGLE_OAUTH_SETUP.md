# 🔐 Guide: Obtenir les Credentials Google OAuth

Ce guide vous montrera comment créer une application Google et obtenir les credentials OAuth2 nécessaires.

## Étape 1: Créer un Projet Google Cloud

### 1.1 Accéder à Google Cloud Console
- Allez sur [Google Cloud Console](https://console.cloud.google.com)
- Cliquez sur le sélecteur de projet en haut à gauche

### 1.2 Créer un nouveau projet
- Cliquez sur **"NEW PROJECT"**
- Nom: `Gmail Client` (ou votre préférence)
- Cliquez **"CREATE"**
- Attendez la création (30 secondes environ)

### 1.3 Sélectionner le projet
- Une fois créé, le projet s'ouvrira automatiquement
- Vérifiez le nom du projet en haut à gauche

## Étape 2: Activer l'API Gmail

### 2.1 Accéder aux APIs
- Allez à **"APIs & Services"** → **"Enabled APIs & services"**
- Cliquez sur **"+ ENABLE APIS AND SERVICES"**

### 2.2 Rechercher Gmail API
- Tapez **"Gmail API"** dans la barre de recherche
- Cliquez sur **"Gmail API"** dans les résultats
- Cliquez le bouton bleu **"ENABLE"**

### 2.3 Attendre l'activation
- Attendez quelques secondes
- Vous verrez **"API enabled"** ✓

## Étape 3: Créer des Credentials OAuth

### 3.1 Aller à Credentials
- Allez à **"APIs & Services"** → **"Credentials"**
- Cliquez sur **"+ CREATE CREDENTIALS"** (bleu)
- Choisissez **"OAuth client ID"**

### 3.2 Configurer l'écran de consentement
- Un message apparaît: **"To create an OAuth client ID, you must first create an OAuth consent screen"**
- Cliquez **"CREATE CONSENT SCREEN"**

### 3.3 Remplir l'écran de consentement
- **User Type**: Sélectionnez **"External"** (pour développement)
- Cliquez **"CREATE"**

### 3.4 Formulaire OAuth
Remplissez les champs obligatoires:
- **App name**: `Gmail Client`
- **User support email**: Votre email
- **Developer contact**: Votre email
- Cliquez **"SAVE AND CONTINUE"**

### 3.5 Scopes
- Cliquez **"ADD OR REMOVE SCOPES"**
- Cherchez et sélectionnez: `https://www.googleapis.com/auth/gmail.readonly`
- Cliquez **"UPDATE"**
- Cliquez **"SAVE AND CONTINUE"**

### 3.6 Utilisateurs de test
- Cliquez **"ADD USERS"**
- Entrez votre email (celui du compte Google à utiliser)
- Cliquez **"ADD"**
- Cliquez **"SAVE AND CONTINUE"**

### 3.7 Résumé
- Vérifiez les infos
- Cliquez **"BACK TO DASHBOARD"**

## Étape 4: Créer les Credentials OAuth Client

### 4.1 Retourner à Credentials
- Allez à **"APIs & Services"** → **"Credentials"**
- Cliquez sur **"+ CREATE CREDENTIALS"** (bleu)
- Choisissez **"OAuth client ID"**

### 4.2 Type d'application
- Application type: **"Web application"**
- Name: `Gmail Client Credentials`
- Cliquez **"CREATE"**

### 4.3 Ajouter les URIs autorisés
Dans la section "Authorized redirect URIs", cliquez **"+ ADD URI"**:
- Ajoutez: `http://localhost:3000/api/gmail/callback`
- Cliquez **"CREATE"**

### 4.4 Récupérer vos credentials
Un popup apparaît avec:
- **Client ID** (commence par `xxx.apps.googleusercontent.com`)
- **Client Secret**

📋 **Copiez ces deux valeurs!**

Vous pouvez aussi les récupérer plus tard:
- Allez à **"APIs & Services"** → **"Credentials"**
- Dans la section "OAuth 2.0 Client IDs"
- Cliquez le client ID que vous viens de créer
- Copiez les valeurs

## Étape 5: Configurer le Fichier .env

Une fois les credentials obtenus:

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback
JWT_SECRET=votre_clé_secrète_très_longue
DATABASE_URL=sqlite:./prisma/dev.db
PORT=3000
NODE_ENV=development
```

Remplacez:
- `xxx.apps.googleusercontent.com` par votre **Client ID**
- `your_client_secret_here` par votre **Client Secret**

## Étape 6: Tester les Credentials

Lancez le backend:
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev
```

Si vous voyez ✅, les credentials sont bons!

## ⚠️ Important

- **JAMAIS** partager votre Client Secret publiquement
- **JAMAIS** le commiter sur GitHub
- Toujours utiliser `.env` pour les secrets
- Pour produire, créer des credentials différentes

## 🔒 Sécurité

### Limiter les URIs autorisés
- En production, utilisez votre domaine réel
- Exemple: `https://mon-app.com/api/gmail/callback`

### Restreindre les scopes
- Nous utilisons uniquement `gmail.readonly`
- C'est le minimum pour lire les emails
- Pas d'accès à la suppression ou modification

### Rotation des secrets
- Régulièrement, générez de nouveaux credentials
- Désactivez les anciens
- C'est simple via Google Cloud Console

## 🐛 Troubleshooting

### "Invalid Client ID"
- Vérifiez que vous avez copié le bon Client ID
- Pas d'espaces à la fin
- Vérifiez dans Google Cloud Console

### "Redirect URI mismatch"
- Vérifiez que `http://localhost:3000/api/gmail/callback` est exact
- Respectez la casse
- Pas de `/` manquante ou supplémentaire

### "The authorization server does not support this operation"
- L'API Gmail n'est pas activée
- Refaites l'**Étape 2**

### "Access denied" lors du login
- Vérifiez que vous avez ajouté votre email en "Utilisateurs de test"
- Refaites l'**Étape 3.6**

## 📚 Ressources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
- [Google Cloud Console](https://console.cloud.google.com)

---

**Une fois les credentials configurés, passez à [QUICKSTART.md](./QUICKSTART.md)**
