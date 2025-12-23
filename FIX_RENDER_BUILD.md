🔧 CORRIGER LA COMMANDE DE BUILD DANS RENDER

======================================================

1️⃣ ALLER À: https://dashboard.render.com

2️⃣ CLIQUER sur votre service: "gmail-client-api"

3️⃣ CLIQUER sur l'onglet: "Settings"

4️⃣ TROUVER: "Build Command"

5️⃣ EFFACER COMPLÈTEMENT la commande actuelle

6️⃣ COPIER-COLLER EXACTEMENT:

cd backend && npm install && npx prisma db push

(Ne pas ajouter --skip-generate ou autre chose)

7️⃣ CLIQUER: "Save"

8️⃣ CLIQUER: "Manual Deploy" → "Deploy latest commit"

9️⃣ ⏳ ATTENDRE 5-10 MINUTES

1️⃣0️⃣ VÉRIFIER que c'est VERT avec "Live" ✅

======================================================

C'EST TOUT!

Après cela, continuez avec l'ÉTAPE 5 du guide.

======================================================
