╔════════════════════════════════════════════════════════════════╗
║                                                                  ║
║        DÉPLOYER VOTRE APP - GUIDE COMPLET AVEC CAPTURES         ║
║                                                                  ║
║        Suivre ligne par ligne, ne rien changer!                 ║
║                                                                  ║
╚════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════
ÉTAPE 1: CRÉER UN COMPTE GITHUB (5 minutes)
═══════════════════════════════════════════════════════════════════

🔗 CLIQUER ICI: https://github.com

Vous verrez une page avec un bouton "Sign up" en haut à droite.

┌─────────────────────────────────────┐
│ CLIQUER: Sign up                    │
└─────────────────────────────────────┘

REMPLIR:
┌─────────────────────────────────────┐
│ Email:        votre@email.com       │
│ Password:     VotreMotDePasse2025   │
│ Username:     votrenomdutilisateur  │
└─────────────────────────────────────┘

CLIQUER: "Create account"

Une page va vous demander de vérifier votre email.

ALLER À VOTRE EMAIL et CLIQUER le lien de vérification.

✅ FAIT! Vous avez un compte GitHub!

═══════════════════════════════════════════════════════════════════
ÉTAPE 2: CRÉER UN NOUVEAU REPOSITORY (5 minutes)
═══════════════════════════════════════════════════════════════════

Une fois que vous êtes connecté sur GitHub (votre nom dans le coin haut droit).

🔗 CLIQUER ICI: https://github.com/new

Vous verrez un formulaire pour créer un repo.

REMPLIR:
┌──────────────────────────────────────────┐
│ Repository name:   gmail-client          │
│ Description:       Gmail Client App      │
│ Visibility:        Public (COCHER)       │
└──────────────────────────────────────────┘

CLIQUER: "Create repository"

✅ FAIT! Vous avez un repository!

═══════════════════════════════════════════════════════════════════
ÉTAPE 3: POUSSER VOTRE CODE (10 minutes)
═══════════════════════════════════════════════════════════════════

Maintenant on va pousser le code depuis votre ordinateur.

OUVRIR: PowerShell (Windows)
(Clic droit sur le bureau → Terminal Windows ou PowerShell)

TAPER et APPUYER SUR ENTRÉE (une par une):

────────────────────────────────────────────────────────────────────
1️⃣  ALLER DANS LE DOSSIER DU PROJET:

cd "c:\Users\nazim\Documents\Stage"

────────────────────────────────────────────────────────────────────
2️⃣  INITIALISER GIT:

git init

────────────────────────────────────────────────────────────────────
3️⃣  AJOUTER TOUS LES FICHIERS:

git add .

────────────────────────────────────────────────────────────────────
4️⃣  CRÉER UN COMMIT:

git commit -m "Gmail Client - Production Ready"

────────────────────────────────────────────────────────────────────
5️⃣  AJOUTER L'ADRESSE DISTANTE (remplacer VOTRE_USERNAME):

git remote add origin https://github.com/VOTRE_USERNAME/gmail-client.git

EXEMPLE:
Si votre username est "jean123", alors:
git remote add origin https://github.com/jean123/gmail-client.git

────────────────────────────────────────────────────────────────────
6️⃣  RENOMMER LA BRANCHE:

git branch -M main

────────────────────────────────────────────────────────────────────
7️⃣  POUSSER LE CODE:

git push -u origin main

────────────────────────────────────────────────────────────────────

Il va vous demander:
  username: VOTRE_USERNAME (votre nom GitHub)
  password: VOTRE_PASSWORD (votre mot de passe GitHub)

TAPER et APPUYER SUR ENTRÉE.

✅ FAIT! Votre code est sur GitHub!

═══════════════════════════════════════════════════════════════════
ÉTAPE 4: DÉPLOYER LE BACKEND SUR RENDER (15 minutes)
═══════════════════════════════════════════════════════════════════

🔗 CLIQUER ICI: https://render.com

Cliquer: "Sign up"

Cliquer: "Continue with GitHub"

Autoriser l'accès à GitHub (cliquer "Authorize render-oss")

UNE FOIS CONNECTÉ:

🔗 CLIQUER ICI: https://dashboard.render.com

Cliquer: "New" (bouton en haut à gauche)

Cliquer: "Web Service"

Sélectionner votre repository: "gmail-client"

Cliquer: "Connect"

REMPLIR LE FORMULAIRE:

┌──────────────────────────────────────────────────────────────┐
│ Name:                                                         │
│   gmail-client-api                                            │
│                                                               │
│ Environment:                                                  │
│   Node                                                        │
│                                                               │
│ Region:                                                       │
│   Ohio (ou votre région)                                      │
│                                                               │
│ Branch:                                                       │
│   main                                                        │
│                                                               │
│ Build Command:                                                │
│   cd backend && npm install && npx prisma db push --skip-ge  │
│                                                               │
│ Start Command:                                                │
│   cd backend && npm start                                    │
│                                                               │
│ Instance Type:                                                │
│   Free                                                        │
└──────────────────────────────────────────────────────────────┘

CLIQUER: "Create Web Service"

⏳ ATTENDRE 5-10 MINUTES (c'est normal, ça compile)

Une fois que c'est VERT avec "Live":

COPIER L'URL QUI RESSEMBLE À:
https://gmail-client-api-xxxx.render.com

⚠️  NOTER CETTE URL! (vous en aurez besoin!)

✅ FAIT! Votre backend est en ligne!

═══════════════════════════════════════════════════════════════════
ÉTAPE 5: AJOUTER LES VARIABLES D'ENVIRONNEMENT (5 minutes)
═══════════════════════════════════════════════════════════════════

⚠️  ATTENDEZ! Render crée automatiquement une base de données PostgreSQL.
Il faut vérifier que c'est créé.

ALLER À: https://dashboard.render.com

Cliquer sur votre Web Service "gmail-client-api"

En haut, il y a plusieurs onglets. Cliquer: "Environment"

Vous devriez voir une variable DATABASE_URL déjà créée.

CLIQUER: "Add Environment Variable"

AJOUTER CES VARIABLES:

1️⃣  GOOGLE_CLIENT_ID
    VALUE: (vous l'aurez à l'étape 7)

2️⃣  GOOGLE_CLIENT_SECRET
    VALUE: (vous l'aurez à l'étape 7)

3️⃣  JWT_SECRET
    VALUE: abc123def456ghi789jklmno123pqr456stu

4️⃣  FRONTEND_URL
    VALUE: (vous l'aurez à l'étape 6)

5️⃣  NODE_ENV
    VALUE: production

CLIQUER: "Save"

⏳ LE SERVICE VA REDÉMARRER (5 min)

✅ FAIT! Variables configurées!

═══════════════════════════════════════════════════════════════════
ÉTAPE 6: DÉPLOYER LE FRONTEND SUR VERCEL (10 minutes)
═══════════════════════════════════════════════════════════════════

🔗 CLIQUER ICI: https://vercel.com

Cliquer: "Sign Up"

Cliquer: "Continue with GitHub"

Autoriser l'accès

UNE FOIS CONNECTÉ:

Cliquer: "Add New" → "Project"

Sélectionner votre repository "gmail-client"

Cliquer: "Import"

REMPLIR:

┌──────────────────────────────────────────────────────────────┐
│ Project Name:                                                │
│   gmail-client                                               │
│                                                               │
│ Framework:                                                   │
│   Other (ou Static)                                          │
│                                                               │
│ Root Directory:                                              │
│   (cliquer et sélectionner ./frontend)                      │
└──────────────────────────────────────────────────────────────┘

CLIQUER: "Deploy"

⏳ ATTENDRE 2-3 MINUTES

Une fois que c'est BLEU avec "Visit":

CLIQUER: le lien "Visit"

OU

COPIER L'URL QUI RESSEMBLE À:
https://gmail-client-xxxx.vercel.app

⚠️  NOTER CETTE URL! (c'est votre site!)

✅ FAIT! Votre frontend est en ligne!

═══════════════════════════════════════════════════════════════════
ÉTAPE 7: CONFIGURER GOOGLE OAUTH (10 minutes)
═══════════════════════════════════════════════════════════════════

🔗 CLIQUER ICI: https://console.cloud.google.com

CRÉER UN NOUVEAU PROJET:

Cliquer le menu déroulant en haut (à côté du logo Google Cloud)

Cliquer: "NEW PROJECT"

REMPLIR:
┌──────────────────────────────────────────┐
│ Project name: Gmail Client App           │
└──────────────────────────────────────────┘

Cliquer: "CREATE"

⏳ ATTENDRE QUE LE PROJET SE CRÉE (1-2 minutes)

Une fois créé, vous verrez le projet sélectionné.

────────────────────────────────────────────────────────────────────

ACTIVER L'API GMAIL:

Aller à: https://console.cloud.google.com/apis/dashboard

Cliquer: "Enable APIs and Services" (gros bouton bleu)

Chercher: "Gmail"

Cliquer: "Gmail API"

Cliquer: "ENABLE"

────────────────────────────────────────────────────────────────────

CRÉER LES CREDENTIALS:

Aller à: https://console.cloud.google.com/apis/credentials

Cliquer: "Create Credentials"

Sélectionner: "OAuth client ID"

⚠️  SI ON VOUS DIT "You need to configure the OAuth consent screen first"

Cliquer: "Configure Consent Screen"

REMPLIR:

┌────────────────────────────────────────┐
│ User type: External                    │
│ Cliquer: CREATE                        │
│                                        │
│ App name: Gmail Client                 │
│ User support email: votre@email.com    │
│ Cliquer: SAVE AND CONTINUE             │
└────────────────────────────────────────┘

Continuer jusqu'au bout et cliquer "FINISH"

────────────────────────────────────────────────────────────────────

REVENIR AUX CREDENTIALS:

Aller à: https://console.cloud.google.com/apis/credentials

Cliquer: "Create Credentials"

Sélectionner: "OAuth client ID"

SÉLECTIONNER: "Web application"

REMPLIR:

┌──────────────────────────────────────────┐
│ Name: Gmail Client Web App               │
│                                          │
│ Authorized JavaScript origins:           │
│   (laisser vide)                         │
│                                          │
│ Authorized redirect URIs:                │
│   (AJOUTER):                             │
│   https://[VOTRE_URL_RENDER]/api/gmail/callback    │
│                                          │
│   EXEMPLE:                               │
│   https://gmail-client-api-xyz.render.com/api/gmail/callback │
│                                          │
│   (Vous trouverez votre URL Render      │
│    sur le dashboard Render)              │
└──────────────────────────────────────────┘

Cliquer: "CREATE"

────────────────────────────────────────────────────────────────────

COPIER VOS CREDENTIALS:

Vous verrez un écran avec:
  - Client ID
  - Client Secret

⚠️  COPIER LES DEUX!

────────────────────────────────────────────────────────────────────

AJOUTER LES CREDENTIALS À RENDER:

Aller à: https://dashboard.render.com

Cliquer sur: "gmail-client-api"

Aller à: "Environment"

MODIFIER:
  GOOGLE_CLIENT_ID → (coller votre Client ID)
  GOOGLE_CLIENT_SECRET → (coller votre Client Secret)

Cliquer: "Save"

⏳ LE SERVICE VA REDÉMARRER

✅ FAIT! Google OAuth configuré!

═══════════════════════════════════════════════════════════════════
🎉 C'EST TOUT! VOTRE APP EST EN LIGNE!
═══════════════════════════════════════════════════════════════════

VOS URLS:

🌐 FRONTEND (où partager):
   https://gmail-client-XXXX.vercel.app

🔧 BACKEND (pour l'app):
   https://gmail-client-api-XXXX.render.com

═══════════════════════════════════════════════════════════════════
TESTER VOTRE APP
═══════════════════════════════════════════════════════════════════

1. OUVRIR: https://gmail-client-XXXX.vercel.app

2. CRÉER UN COMPTE:
   - Email: test@example.com
   - Password: Test123456

3. CLIQUER: "Connect Gmail"

4. AUTORISER l'accès à votre Gmail

5. CLIQUER: "Sync Emails"

6. VOIR VOS EMAILS! 🎉

═══════════════════════════════════════════════════════════════════
PARTAGER AVEC LE MONDE
═══════════════════════════════════════════════════════════════════

Donnez cette URL à tout le monde:

👉 https://gmail-client-XXXX.vercel.app

N'importe qui peut:
✅ Créer un compte
✅ Se connecter à son Gmail
✅ Voir ses emails
✅ Tout est GRATUIT et SÉCURISÉ!

═══════════════════════════════════════════════════════════════════
✨ VOUS AVEZ FINI! BRAVO! 🎊
═══════════════════════════════════════════════════════════════════

Vous avez une app Gmail Client:
✅ En ligne
✅ Gratuite
✅ Sécurisée
✅ Accessible au monde entier
✅ Fonctionnelle

PARTAGEZ AVEC VOS AMIS! 🚀

═══════════════════════════════════════════════════════════════════
