# ❓ FAQ - Questions Fréquemment Posées

## 🔐 Authentification & Sécurité

### Q1: Où sont stockés les tokens?

**JWT (Frontend)**
- Stocké en `localStorage` du navigateur
- Utilisé pour authentifier les requêtes vers le backend
- Expire après 7 jours

**Google Tokens (Backend)**
- Access Token: Stocké en base de données (MailAccount.accessToken)
- Refresh Token: Stocké en base de données (MailAccount.refreshToken)
- JAMAIS exposés au frontend
- Access Token expire après ~1h, auto-refresh avec refresh token

### Q2: Est-ce que mon mot de passe est sécurisé?

Oui! Les passwords sont:
- Hashés avec **bcryptjs** (10 rounds de salting)
- Jamais stockés en clair
- Jamais transmis au frontend

```javascript
// Comment c'est hashé
const hashedPassword = await bcrypt.hash(password, 10);
```

### Q3: Pourquoi je dois accepter les permissions Gmail?

Google OAuth requiert l'approbation pour accéder à vos emails. Nous utilisons le scope minimal:
- `https://www.googleapis.com/auth/gmail.readonly` - **Lecture emails uniquement**

Pas de permissions pour:
- ❌ Supprimer emails
- ❌ Modifier emails
- ❌ Envoyer emails
- ❌ Accéder au calendrier

## 🛠️ Installation & Configuration

### Q4: Dois-je installer MongoDB/MySQL?

Non! Par défaut le projet utilise **SQLite** qui ne nécessite rien à installer.

SQLite est:
- ✅ Zéro configuration
- ✅ Fichier unique (`prisma/dev.db`)
- ✅ Parfait pour développement

Pour la production, vous pouvez changer vers MySQL/PostgreSQL en modifiant:
```env
# DATABASE_URL="sqlite:./prisma/dev.db"
DATABASE_URL="mysql://user:password@localhost:3306/gmail_client"
```

### Q5: Node.js version requise?

- ✅ 16+ (recommandé 18+)
- ❌ 14 et antérieur ne supportent pas async/await correctement

Vérifiez:
```bash
node --version
# v18.x.x ou supérieur
```

### Q6: Comment générer une clé JWT_SECRET sécurisée?

**Commande:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object {[char][byte](Get-Random -Minimum 33 -Maximum 127)}) -join ''))

# Ou simplement utiliser une clé aléatoire longue:
supersecretkey1234567890abcdefghijklmnop
```

Puis mettez-la dans `.env`:
```env
JWT_SECRET=votre_clé_générée
```

## 🌐 Frontend & Navigation

### Q7: Comment passer le token au backend?

Le frontend ajoute automatiquement le JWT en header:
```javascript
const response = await fetch(`${API_BASE_URL}/api/gmail/emails`, {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

Le backend vérifie automatiquement avec `verifyToken` middleware.

### Q8: Pourquoi je suis redirigé vers index.html?

C'est normal! Quand votre JWT expire (après 7 jours), vous êtes redirigé à la connexion. C'est la sécurité!

### Q9: Où sont les styles CSS?

Tous les styles sont dans **un seul fichier**: `frontend/css/style.css`

C'est facile à maintenir et modifier. Des variables CSS permettent de changer les couleurs:
```css
:root {
  --primary-color: #1f2937;
  --secondary-color: #4f46e5;
  --danger-color: #dc2626;
  /* ... */
}
```

## 📧 Gmail & Emails

### Q10: Pourquoi je vois 0 emails après la sync?

Possibilités:
1. ✅ Votre Inbox Gmail est vide
   - Vérifiez https://mail.google.com
2. ✅ Vous n'avez pas cliqué "Connecter Gmail" d'abord
   - Cliquez le bouton bleu "🔑 Connecter Gmail"
3. ✅ Les permissions Gmail n'ont pas été acceptées
   - Vérifiez le dropdown "Gmail" dans Gmail settings
4. ✅ Le refresh token n'est pas stocké
   - Essayez de reconnecter Gmail

### Q11: Comment je rafraîchis les emails manuellement?

Cliquez le bouton **"🔄 Synchroniser"** sur le dashboard. Cela:
1. Appelle Gmail API
2. Récupère les 50 derniers emails
3. Les sauvegarde en base
4. Ignore les doublons

C'est automatique - vous n'avez pas besoin de cliquer souvent.

### Q12: Pourquoi je vois seulement les 50 derniers emails?

C'est un design choice pour la performance:
- Plus rapide
- Moins de requêtes API
- Moins de données stockées

Vous pouvez augmenter le nombre dans `gmailController.js`:
```javascript
const response = await gmail.users.messages.list({
  maxResults: 50,  // ← Changer ici
});
```

### Q13: Pourquoi certains emails n'ont pas le body complet?

Certains emails:
- Sont en HTML complexe
- Ont des pièces jointes
- Sont mal formatés

Le projet capture le texte/HTML trouvé. Pour du HTML complexe, une meilleure approche serait d'utiliser une librairie comme `mailparser`.

## 🗄️ Base de Données

### Q14: Comment sauvegarder ma base de données?

**SQLite:**
```bash
# Copier le fichier
cp backend/prisma/dev.db backup/dev.db
```

**Pour MySQL/PostgreSQL**, utiliser les outils natifs:
```bash
# MySQL
mysqldump -u user -p database > backup.sql

# PostgreSQL
pg_dump -U user database > backup.sql
```

### Q15: Comment réinitialiser la base de données?

⚠️ **Attention: Cela supprime TOUS les données!**

```bash
cd backend
npx prisma reset
npx prisma migrate dev --name init
```

Cela va:
1. Supprimer toutes les tables
2. Recréer les tables vides

### Q16: Comment voir les données de la base?

Utiliser **Prisma Studio** (interface graphique):
```bash
cd backend
npx prisma studio
```

Ouvre automatiquement http://localhost:5555 avec une UI pour:
- Voir les tables
- Ajouter/modifier/supprimer des données
- Tester les requêtes

### Q17: Comment exporter les emails en CSV?

Vous pouvez modifier `gmailController.js` pour exporter:
```javascript
const csv = emails.map(e => 
  `"${e.sender}","${e.subject}","${e.receivedAt}"`
).join('\n');

res.setHeader('Content-Type', 'text/csv');
res.send(csv);
```

## 🚀 Déploiement & Production

### Q18: Comment déployer en production?

Options populaires:

**Heroku:**
```bash
heroku create app-name
heroku addons:create cleardb:ignite  # MySQL
git push heroku main
```

**Railway.app:**
```bash
railway login
railway link
railway up
```

**Vercel (Frontend seulement):**
```bash
npm install -g vercel
vercel
```

Consultez [TECHNICAL_NOTES.md](./TECHNICAL_NOTES.md#déploiement) pour plus.

### Q19: Est-ce que je dois utiliser HTTPS?

- ✅ OUI en production
- ❌ Non nécessaire en développement local

Pour local HTTPS, voir [ALTERNATIVE_CONFIGS.md](./ALTERNATIVE_CONFIGS.md#8-configuration-https-local)

### Q20: Comment ajouter une base de données MySQL en production?

1. Créer une base MySQL (Heroku, AWS RDS, etc.)
2. Changer `.env`:
   ```env
   DATABASE_URL="mysql://user:password@host:3306/dbname"
   ```
3. Lancer migrations:
   ```bash
   npx prisma migrate deploy
   ```

## 🐛 Dépannage

### Q21: "EADDRINUSE: address already in use :::3000"

Le port 3000 est déjà utilisé. Solution:

**Option 1: Trouver et tuer le processus**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Option 2: Changer le port**
```env
PORT=3001
```

### Q22: "Invalid Client ID" lors du login Google

Vérifiez:
1. ✅ Vous avez copié le bon Client ID depuis Google Cloud
2. ✅ Pas d'espaces au début/fin
3. ✅ Correspond au projet Google
4. ✅ Commence par `xxx.apps.googleusercontent.com`

Copiez à nouveau depuis Google Cloud Console.

### Q23: "Redirect URI mismatch"

Google rejette la redirection. Vérifiez:
1. ✅ Dans Google Cloud Console, URI configurée: `http://localhost:3000/api/gmail/callback`
2. ✅ Dans `.env`, GOOGLE_REDIRECT_URI exact: `http://localhost:3000/api/gmail/callback`
3. ✅ Pas de `/` manquante
4. ✅ Pas d'espace

Les URIs **doivent match exactement** (byte pour byte).

### Q24: "The authorization server does not support this operation"

L'API Gmail n'est pas activée. Refaites:
1. Google Cloud Console → APIs & Services
2. "+ ENABLE APIS AND SERVICES"
3. Cherchez "Gmail API"
4. Cliquez "ENABLE"

### Q25: JWT token invalid/expired

Solutions:
1. Supprimer localStorage et se reconnecter
   ```javascript
   localStorage.clear()
   ```
2. Vérifier que JWT_SECRET est le même que celui utilisé pour signer
3. Vérifier que la date/heure du serveur est correct

## 💡 Optimisations

### Q26: Comment ajouter une recherche?

Voir [TECHNICAL_NOTES.md - Extension Recherche](./TECHNICAL_NOTES.md#5-ajouter-recherche)

### Q27: Comment ajouter un dark mode?

Modifier `frontend/css/style.css`:
```css
body.dark-mode {
  --primary-color: #ffffff;
  --text-color: #f5f5f5;
  --bg-color: #1a1a1a;
  /* ... */
}
```

### Q28: Comment ajouter plus d'endpoints Gmail?

Vous pouvez ajouter:
- Marquer comme lu
- Archiver
- Supprimer
- Appliquer labels

Consultez [Gmail API Documentation](https://developers.google.com/gmail/api)

## 📞 Besoin d'aide?

- 📖 Lire [README.md](./README.md) - Documentation complète
- 🚀 Lire [QUICKSTART.md](./QUICKSTART.md) - Setup rapide
- 🔐 Lire [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) - Guide Google
- 📝 Lire [TECHNICAL_NOTES.md](./TECHNICAL_NOTES.md) - Architecture avancée
- ⚙️ Lire [ALTERNATIVE_CONFIGS.md](./ALTERNATIVE_CONFIGS.md) - Configs alternatives

---

**Votre question n'est pas ici? Créez une issue ou consultez la documentation des packages:**
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [Google APIs](https://developers.google.com/gmail/api)
