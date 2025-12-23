🚀 GUIDE DE DÉPLOIEMENT EN 7 ÉTAPES SIMPLES
══════════════════════════════════════════════════════

⚠️ IMPORTANT: Vous allez voir des URLs à cliquer et des commandes à COPIER-COLLER.
Ne changez RIEN, juste copiez exactement!

══════════════════════════════════════════════════════

✅ ÉTAPE 1: Créer un compte GitHub (5 minutes)
────────────────────────────────────────────────

1. CLIQUER: https://github.com

2. Cliquer "Sign up"

3. Remplir:
   - Email: votre email
   - Password: votre mot de passe
   - Username: votre nom d'utilisateur (exemple: gmail-client-user)

4. Cliquer "Create account"

5. Valider votre email (vérifier votre boîte mail)

✅ FAIT!

══════════════════════════════════════════════════════

✅ ÉTAPE 2: Créer un repository GitHub (5 minutes)
────────────────────────────────────────────────────

1. Une fois connecté sur GitHub

2. Cliquer: https://github.com/new

3. Remplir:
   Repository name: gmail-client
   Description: Gmail Client Application
   Public (cocher)
   
4. Cliquer "Create repository"

5. COPIER cette commande (en bas de la page, section "...or push an existing repository from the command line")

✅ FAIT!

══════════════════════════════════════════════════════

✅ ÉTAPE 3: Pousser votre code sur GitHub (10 minutes)
──────────────────────────────────────────────────────

1. Ouvrir PowerShell

2. COPIER-COLLER cette commande EXACTEMENT:

cd "c:\Users\nazim\Documents\Stage"

3. Appuyer sur ENTRÉE

4. COPIER-COLLER cette commande EXACTEMENT:

git init

5. COPIER-COLLER cette commande EXACTEMENT:

git add .

6. COPIER-COLLER cette commande EXACTEMENT:

git commit -m "Gmail Client - Production Ready"

7. COPIER-COLLER cette commande EXACTEMENT (remplacer VOTRE_USERNAME par votre nom GitHub):

git remote add origin https://github.com/VOTRE_USERNAME/gmail-client.git

8. COPIER-COLLER cette commande EXACTEMENT:

git branch -M main

9. COPIER-COLLER cette commande EXACTEMENT:

git push -u origin main

(Entrer votre username GitHub et votre password)

✅ FAIT! Votre code est sur GitHub!

══════════════════════════════════════════════════════

✅ ÉTAPE 4: Déployer le BACKEND sur Render (10 minutes)
────────────────────────────────────────────────────────

1. CLIQUER: https://render.com

2. Cliquer "Sign up"

3. Sélectionner "Continue with GitHub"

4. Autoriser l'accès à votre GitHub

5. Une fois connecté, cliquer: https://dashboard.render.com

6. Cliquer "New" → "Web Service"

7. Sélectionner votre repo "gmail-client"

8. Cliquer "Connect"

9. Remplir les champs:

   Name:                gmail-client-api
   Environment:         Node
   Branch:              main
   Build Command:       cd backend && npm install && npx prisma db push --skip-generate
   Start Command:       cd backend && npm start
   Instance Type:       Free

10. Scroll down, cliquer "Create Web Service"

11. ATTENDRE 5-10 MINUTES (c'est normal, ça télécharge et compile)

12. Une fois que c'est GREEN, vous verrez une URL du type:
    https://gmail-client-api-XXXX.render.com

13. NOTER CETTE URL (vous en aurez besoin!)

✅ FAIT! Votre backend est en ligne!

══════════════════════════════════════════════════════

✅ ÉTAPE 5: Ajouter les variables d'environnement (5 minutes)
─────────────────────────────────────────────────────────────

1. Aller à: https://dashboard.render.com

2. Cliquer sur votre Web Service "gmail-client-api"

3. Aller à l'onglet "Environment"

4. Cliquer "Add Environment Variable"

5. Ajouter ces variables (générer des valeurs aléatoires pour les secrets):

   DATABASE_URL       → (Render génère une DB PostgreSQL automatiquement, il faut ATTENDRE que Render la crée)
   GOOGLE_CLIENT_ID   → (vous l'obtiendrez à l'étape 7)
   GOOGLE_CLIENT_SECRET → (vous l'obtiendrez à l'étape 7)
   JWT_SECRET         → abc123def456ghi789jkl (n'importe quelle chaîne longue)
   FRONTEND_URL       → (vous la saurez à l'étape 6)
   NODE_ENV           → production

6. Cliquer "Save"

7. Attendre que le service redémarre (5 min)

✅ FAIT! Backend configuré!

══════════════════════════════════════════════════════

✅ ÉTAPE 6: Déployer le FRONTEND sur Vercel (10 minutes)
────────────────────────────────────────────────────────

1. CLIQUER: https://vercel.com

2. Cliquer "Sign Up"

3. Sélectionner "Continue with GitHub"

4. Autoriser l'accès

5. Une fois connecté, cliquer "Add New" → "Project"

6. Sélectionner votre repo "gmail-client"

7. Cliquer "Import"

8. Remplir:

   Project Name:       gmail-client
   Framework:          Other
   Root Directory:     ./frontend

9. Cliquer "Deploy"

10. ATTENDRE 2-3 MINUTES

11. Une fois que c'est BLUE et que vous voyez "Visit", CLIQUER sur le lien

12. Vous verrez une URL du type:
    https://gmail-client-XXXX.vercel.app

13. NOTER CETTE URL (c'est votre site!)

✅ FAIT! Votre frontend est en ligne!

══════════════════════════════════════════════════════

✅ ÉTAPE 7: Configurer Google OAuth (10 minutes)
────────────────────────────────────────────────

1. CLIQUER: https://console.cloud.google.com

2. Créer un nouveau projet:
   - Cliquer le menu déroulant en haut
   - Cliquer "NEW PROJECT"
   - Nom: Gmail Client
   - Cliquer "CREATE"

3. Attendre que le projet se crée

4. Une fois créé, aller à: https://console.cloud.google.com/apis/dashboard

5. Cliquer "Enable APIs and Services"

6. Chercher "Gmail API"

7. Cliquer "Enable"

8. Aller à: https://console.cloud.google.com/apis/credentials

9. Cliquer "Create Credentials" → "OAuth client ID"

10. Sélectionner "Web application"

11. Sous "Authorized redirect URIs", ajouter:
    
    https://VOTRE_RENDER_URL/api/gmail/callback
    (remplacer VOTRE_RENDER_URL par l'URL Render que vous avez notée)

12. Cliquer "Create"

13. COPIER et NOTER:
    - Client ID
    - Client Secret

14. Aller à Render (https://dashboard.render.com)

15. Cliquer sur "gmail-client-api"

16. Aller à "Environment"

17. Modifier:
    GOOGLE_CLIENT_ID → (coller votre Client ID)
    GOOGLE_CLIENT_SECRET → (coller votre Secret)

18. Cliquer "Save"

✅ FAIT! Google OAuth est configuré!

══════════════════════════════════════════════════════

🎉 C'EST TOUT! VOTRE APP EST EN LIGNE!

Vos URLs:

🌐 FRONTEND (où les gens vont):
   https://gmail-client-XXXX.vercel.app

🔧 BACKEND API (pour les appels):
   https://gmail-client-api-XXXX.render.com

═════════════════════════════════════════════════════

✅ TESTER VOTRE APP:

1. Ouvrir: https://gmail-client-XXXX.vercel.app

2. Créer un compte:
   Email: test@example.com
   Password: Password123

3. Cliquer "Connect Gmail"

4. Autoriser l'accès à votre Gmail

5. Cliquer "Sync Emails"

6. Voir vos emails! 🎉

═════════════════════════════════════════════════════

👉 PARTAGER AVEC LE MONDE:

Donnez cette URL à tous vos amis:

https://gmail-client-XXXX.vercel.app

Ils peuvent:
- Créer un compte
- Se connecter à leur Gmail
- Voir leurs emails

C'EST GRATUIT, EN LIGNE, ET ACCESSIBLE À TOUS! 🚀

═════════════════════════════════════════════════════

📞 SI VOUS AVEZ UNE ERREUR:

Problème:          Solution:
─────────────────────────────────────────────
App charge pas      Attendre 1 minute et rafraîchir
OAuth ne marche     Vérifier la redirect URI sur Google
Email ne synce pas  Vérifier que vous avez autorisé Gmail

═════════════════════════════════════════════════════

✨ FÉLICITATIONS! 

Vous avez maintenant une application Gmail Client:
✅ Complète
✅ Sécurisée
✅ En ligne
✅ Gratuite
✅ Accessible au monde entier!

🎊 BON TRAVAIL! 🎊

═════════════════════════════════════════════════════
