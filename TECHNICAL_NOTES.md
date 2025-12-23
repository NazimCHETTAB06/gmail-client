# 📝 Notes Techniques et Extensions

## Architecture Global

### Flow d'Authentification

```
1. L'utilisateur s'enregistre avec email/password localement
   └─> Password hashé avec bcryptjs
   └─> Stocké dans User.password

2. L'utilisateur se connecte
   └─> Token JWT généré
   └─> Token stocké en localStorage (frontend)

3. L'utilisateur clique "Connecter Gmail"
   └─> Redirect vers Google OAuth
   └─> Google retourne un code d'autorisation

4. Le callback reçoit le code
   └─> Code échangé contre access_token + refresh_token
   └─> Tokens stockés en base (MailAccount)

5. Chaque requête Gmail API
   └─> Vérifie si token expiré
   └─> Si expiré, le rafraîchit avec refresh_token
   └─> Utilise l'access_token pour l'appel API
```

### Sécurité des Tokens

- **JWT (Frontend)** : Token court terme (7 jours), stocké en localStorage, utilisé pour l'auth
- **Google Access Token (Backend)** : Token court terme (~1h), stocké en base de données
- **Google Refresh Token (Backend)** : Token long terme (illimité), stocké en base, ne jamais exposer au frontend
- **Service de refresh** : Toutes les heures, vérifie et rafraîchit les tokens expirés

## Fichiers Clés

### Backend

| Fichier | Responsabilité |
|---------|-----------------|
| `server.js` | Point d'entrée Express, middleware, services |
| `config/google.js` | Configuration OAuth et client Gmail |
| `routes/authRoutes.js` | POST /register, POST /login |
| `routes/gmailRoutes.js` | GET /auth, /callback, /fetch, /emails, /email/:id |
| `controllers/authController.js` | Logique register, login, getCurrentUser |
| `controllers/gmailController.js` | Logique OAuth, sync, fetch emails |
| `middleware/verifyToken.js` | Middleware JWT |
| `services/tokenService.js` | Rafraîchissement auto des tokens |
| `prisma/schema.prisma` | Schéma BD |

### Frontend

| Fichier | Responsabilité |
|---------|-----------------|
| `index.html` | Login/Register |
| `dashboard.html` | Inbox (liste emails) |
| `email.html` | Lecteur d'email |
| `css/style.css` | Styles globaux |
| `js/main.js` | Tout le JavaScript client |

## Extensions Possibles

### 1. Support MySQL

```bash
# Changer DATABASE_URL dans .env
DATABASE_URL="mysql://user:password@localhost:3306/gmail_client"

# Installer mysql2
npm install mysql2

# Migrer
npx prisma migrate dev --name init
```

### 2. Ajouter un Endpoint de Suppression

```javascript
// backend/src/controllers/gmailController.js
const deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const email = await prisma.email.delete({
      where: {
        id: parseInt(id)
      }
    });
    
    res.json({ message: 'Email deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete email' });
  }
};
```

### 3. Marquer Comme Lu

```javascript
const markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    const mailAccount = await prisma.mailAccount.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: 'gmail'
        }
      }
    });
    
    const gmail = getGmailClient(mailAccount.accessToken);
    
    await gmail.users.messages.modify({
      userId: 'me',
      id: req.query.gmailId,
      requestBody: {
        removeLabelIds: ['UNREAD']
      }
    });
    
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};
```

### 4. Ajouter Support Outlook / Yahoo

```javascript
// backend/src/config/microsoft.js
const { Client } = require('@microsoft/msgraph-sdk');

const getMicrosoftAuthClient = () => {
  // Configuration Outlook OAuth
};

// backend/src/controllers/microsoftController.js
const connectOutlook = async (req, res) => {
  // Flow similaire à Google
  // Sauvegarder avec provider: "outlook"
};
```

### 5. Ajouter Recherche

```javascript
// backend/src/routes/gmailRoutes.js
router.get('/search', verifyToken, async (req, res) => {
  const { query } = req.query;
  
  const emails = await prisma.email.findMany({
    where: {
      userId: req.userId,
      OR: [
        { subject: { contains: query } },
        { sender: { contains: query } },
        { body: { contains: query } }
      ]
    },
    take: 50
  });
  
  res.json(emails);
});
```

### 6. Mode Dark

```javascript
// frontend/js/main.js
function toggleDarkMode() {
  document.documentElement.style.setProperty(
    '--primary-color',
    '#ffffff'
  );
  // ... et autres variables
}
```

### 7. Notifications en Temps Réel (WebSocket)

```javascript
// backend/src/server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ noServer: true });

// Notifier les clients quand de nouveaux emails arrivent
```

### 8. IMAP Support (Autres providers)

```bash
npm install imap mail-parser
```

## Performance

### Optimisations Possibles

1. **Pagination** : Déjà implémentée (20 emails par page)
2. **Caching** : Ajouter Redis pour les emails fréquemment accédés
3. **Compression** : Compresser les réponses avec gzip
4. **Indexing** : Index BD sur userId et receivedAt
5. **Lazy Loading** : Charger les corps d'email à la demande

### Requête SQL Optimisée

```sql
-- Ajouter les index
CREATE INDEX idx_email_userId_receivedAt ON Email(userId, receivedAt DESC);
CREATE INDEX idx_mailAccount_userId_provider ON MailAccount(userId, provider);
```

## Déploiement

### Heroku

```bash
# Créer app
heroku create mon-gmail-client

# Ajouter le plugin MySQL
heroku addons:create cleardb:ignite

# Déployer
git push heroku main

# Voir logs
heroku logs --tail
```

### Railway.app

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Login
railway login

# Linker le projet
railway link

# Deployer
railway up
```

### Variable d'environnement en production

```bash
# Sur Heroku
heroku config:set GOOGLE_CLIENT_ID=xxx
heroku config:set GOOGLE_CLIENT_SECRET=yyy
heroku config:set JWT_SECRET=zzz
heroku config:set DATABASE_URL=mysql://...
heroku config:set NODE_ENV=production
```

## Testing

### Unit Tests (Jest)

```bash
npm install --save-dev jest
```

```javascript
// backend/__tests__/auth.test.js
describe('Auth Controller', () => {
  test('should register new user', async () => {
    // Test logic
  });
});
```

### E2E Tests (Cypress)

```bash
npm install --save-dev cypress
npx cypress open
```

## Monitoring et Logging

### Ajouter Winston Logger

```bash
npm install winston
```

```javascript
// backend/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
```

## Limites Actuelles

⚠️ **À savoir**

1. **Pas de streaming** : Les corps des emails complets sont chargés en mémoire
2. **Rate limiting** : Pas de rate limiting sur les endpoints (ajouter express-rate-limit)
3. **XSRF Protection** : À ajouter pour les formulaires
4. **Email Parsing** : Les emails HTML peuvent contenir des scripts (risque XSS)
5. **Authentification 2FA** : Pas de 2FA pour les comptes locaux

## Sécurité Supplémentaire

### Helmet.js

```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Validation des inputs

```bash
npm install joi
```

```javascript
const schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required()
});
```

---

**Questions? Consultez la documentation des packages utilisés:**
- [Prisma](https://www.prisma.io/docs/)
- [Express](https://expressjs.com/)
- [Google API Client](https://github.com/googleapis/google-api-nodejs-client)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
