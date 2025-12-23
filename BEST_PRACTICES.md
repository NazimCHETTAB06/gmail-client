# 🏆 Meilleures Pratiques et Conventions

Guide des meilleures pratiques pour développer et maintenir ce projet.

## 📝 Code Style

### JavaScript

#### Nommage
```javascript
// ✅ Bon
const getUserEmail = () => { ... }
const isValidEmail = true
const MAX_RETRIES = 3

// ❌ Mauvais
const get_user_email = () => { ... }
const isvalidemail = true
const maxretries = 3
```

#### Indentation
```javascript
// ✅ Bon: 2 espaces
const user = {
  name: 'John',
  email: 'john@example.com'
}

// ❌ Mauvais: 4 espaces ou tabs
const user = {
    name: 'John',
    email: 'john@example.com'
}
```

#### Commentaires
```javascript
// ✅ Bon: Commentaires utiles
// Vérifier si l'email est valide avant de sauvegarder
if (email.includes('@')) {
  saveUser(email)
}

// ❌ Mauvais: Commentaires inutiles
// Boucler sur les users
users.forEach(user => {
  console.log(user.name)  // Afficher le nom
})
```

#### Async/Await
```javascript
// ✅ Bon
async function fetchEmails() {
  try {
    const emails = await gmail.getEmails()
    return emails
  } catch (err) {
    console.error('Error fetching emails:', err)
    throw err
  }
}

// ❌ Mauvais: Promises sans await
function fetchEmails() {
  return gmail.getEmails()
    .then(emails => emails)
    .catch(err => console.log(err))
}
```

### Prisma

#### Requêtes
```javascript
// ✅ Bon: Inclure seulement les champs nécessaires
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    createdAt: true
  }
})

// ❌ Mauvais: Récupérer tout
const user = await prisma.user.findUnique({
  where: { id: userId }
})
// Obtient aussi password, updatedAt, etc.
```

#### Transactions
```javascript
// ✅ Bon: Transactions pour plusieurs opérations
const result = await prisma.$transaction([
  prisma.user.create({ data: { email: 'test@example.com' } }),
  prisma.mailAccount.create({ data: { ... } })
])

// ❌ Mauvais: Opérations séparées
await prisma.user.create({ ... })
await prisma.mailAccount.create({ ... })
// Peut laisser la BD incohérente en cas d'erreur
```

### HTML/CSS

#### HTML
```html
<!-- ✅ Bon: Sémantique correcte -->
<header>
  <h1>Gmail Client</h1>
</header>
<main>
  <section id="inbox">
    <article class="email-item">
      <h2>Subject</h2>
      <p>Preview</p>
    </article>
  </section>
</main>

<!-- ❌ Mauvais: Divs partout -->
<div id="header">
  <div class="heading">Gmail Client</div>
</div>
<div id="main">
  <div id="inbox">
    <div class="email">
      <div>Subject</div>
      <div>Preview</div>
    </div>
  </div>
</div>
```

#### CSS
```css
/* ✅ Bon: Variables CSS */
:root {
  --primary-color: #4f46e5;
  --text-color: #1f2937;
}

.btn-primary {
  background-color: var(--primary-color);
}

/* ❌ Mauvais: Couleurs en dur */
.btn-primary {
  background-color: #4f46e5;
}
.btn-secondary {
  background-color: #4f46e5;  /* Pas de variable!)
}
```

## 🔐 Sécurité

### Authentification
```javascript
// ✅ Bon: Valider les inputs
const login = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email and password required')
  }
  
  if (!email.includes('@')) {
    throw new Error('Invalid email format')
  }
  
  const user = await findUserByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Invalid password')
  }
  
  return generateJWT(user)
}

// ❌ Mauvais: Pas de validation
const login = async (email, password) => {
  const user = await User.findOne({ email })
  if (user.password === password) {  // Pas de hash!)
    return user
  }
}
```

### Tokens
```javascript
// ✅ Bon: Tokens en backend
const mailAccount = await prisma.mailAccount.update({
  data: {
    accessToken: tokens.access_token,  // Sauvegardé en BD
    refreshToken: tokens.refresh_token  // Jamais au frontend
  }
})

// ❌ Mauvais: Tokens au frontend
fetch('/api/gmail/callback')
  .then(res => res.json())
  .then(data => {
    localStorage.setItem('accessToken', data.accessToken)  // Danger!)
  })
```

### Validation
```javascript
// ✅ Bon: Valider au backend ET frontend
// Frontend
if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
  showError('Invalid email')
  return
}

// Backend
const user = await prisma.user.findUnique({
  where: { id: req.userId }  // Du JWT, pas du body
})

// ❌ Mauvais: Faire confiance au frontend
const user = await prisma.user.findUnique({
  where: { id: req.body.userId }  // L'user peut mentir!
})
```

## 🏗️ Architecture

### Séparation des Responsabilités
```javascript
// ✅ Bon: Logique bien séparée
// server.js: Setup du serveur
// routes/: Définition des routes
// controllers/: Logique métier
// services/: Utilitaires (token, email, etc.)
// middleware/: Authentification, validation

// ❌ Mauvais: Tout dans server.js
app.post('/login', async (req, res) => {
  // Validation ici
  // Logique métier ici
  // Query BD ici
  // JWT ici
  // Erreur handling ici
})
```

### Gestion d'Erreurs
```javascript
// ✅ Bon: Centralisé et clair
try {
  const result = await fetchEmails()
  res.json({ success: true, data: result })
} catch (err) {
  console.error('Error:', err.message)
  
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message })
  } else if (err instanceof AuthError) {
    res.status(401).json({ error: 'Unauthorized' })
  } else {
    res.status(500).json({ error: 'Internal error' })
  }
}

// ❌ Mauvais: Pas d'erreur handling
app.get('/api/emails', async (req, res) => {
  const emails = await prisma.email.findMany()
  res.json(emails)  // Crash si BD down
})
```

## 📊 Performance

### Requêtes BD
```javascript
// ✅ Bon: Pagination
const page = req.query.page || 1
const limit = 20
const skip = (page - 1) * limit

const emails = await prisma.email.findMany({
  skip,
  take: limit,
  orderBy: { receivedAt: 'desc' }
})

// ❌ Mauvais: Récupérer tout
const emails = await prisma.email.findMany()
// 10000 emails en mémoire = crash!
```

### Requêtes API
```javascript
// ✅ Bon: Lazy loading
async function loadEmail(id) {
  const email = await fetch(`/api/gmail/email/${id}`)
  return email.json()
}

// ❌ Mauvais: Charger tout au départ
async function loadInbox() {
  const emails = await fetch(`/api/gmail/emails?limit=10000`)
  return emails.json()  // 10000 requêtes au render!)
}
```

## 📝 Logging

### Logs Utiles
```javascript
// ✅ Bon: Logs informatifs
console.log('🚀 Server running on port 3000')
console.log('User registered:', userId)
console.error('❌ Email sync failed:', err.message)

// ❌ Mauvais: Logs inutiles
console.log('test')
console.log('done')
console.log(user)  // Peut contenir des secrets!
```

## 🧪 Testing

### Frontend
```javascript
// ✅ Bon: Vérifier les cas limite
test('Login avec email vide', () => {
  expect(validateEmail('')).toBe(false)
})

test('Login avec password court', () => {
  expect(validatePassword('123')).toBe(false)
})

// ❌ Mauvais: Pas de tests
// Ou tests qui testent seulement le chemin heureux
test('Login réussit', () => {
  expect(login('test@example.com', 'password')).toBe(true)
})
```

## 🚀 Déploiement

### Environment Variables
```env
# ✅ Bon
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
JWT_SECRET=super_secret_key_very_long
DATABASE_URL=mysql://user:pass@host/db
NODE_ENV=production
PORT=3000

# ❌ Mauvais
GOOGLE_CLIENT_ID=test
SECRET=123  # Trop court
DB=mydb  # Pas de credentials
```

### Conventions de Versioning
```
v1.0.0
│││
││└─ Patch (bug fixes): 1.0.1, 1.0.2
│└── Minor (new features): 1.1.0, 1.2.0
└─── Major (breaking changes): 2.0.0
```

## 📚 Documentation

### Code Comments
```javascript
// ✅ Bon: Explique le "pourquoi", pas le "quoi"
// Rafraîchir le token avant expiration (~5min)
// pour éviter les erreurs API pendant la sync
if (expiresAt < now + 5 * 60 * 1000) {
  await refreshToken()
}

// ❌ Mauvais: Répète le code
// Vérifier si expiresAt < now + 5 * 60 * 1000
if (expiresAt < now + 5 * 60 * 1000) {
  await refreshToken()
}
```

### README
```markdown
✅ Bon: Clair et structuré
# Project Name
Description en 1 ligne

## Features
- Feature 1
- Feature 2

## Installation
...

## Usage
...

❌ Mauvais: Trop court ou trop long
# My Project
Blah blah...
[50 pages de documentation détaillée]
```

## 🔄 Code Review

### Checklist
```
Avant de commiter:
- [ ] Code fonctionne
- [ ] Pas de console.log() de debug
- [ ] Pas de credentials dans le code
- [ ] Tests passent
- [ ] Documentation à jour
- [ ] Conventions suivies
- [ ] Pas de code mort
```

## 🎯 Git Commits

### Bons Commits
```bash
# ✅ Bon: Clair et concis
git commit -m "feat: Add email search functionality"
git commit -m "fix: Prevent token refresh infinite loop"
git commit -m "docs: Update README with examples"

# ❌ Mauvais: Vague ou trop long
git commit -m "fix stuff"
git commit -m "Fixed a bug that was preventing emails from loading sometimes when the connection was slow or the server was having issues"
```

Format recommandé:
```
<type>: <subject>

<body (optionnel)>
```

Types:
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage
- `refactor:` - Refactoring
- `test:` - Tests

## 🌟 Ressources

### Articles
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

### Tools
- ESLint - Code linting
- Prettier - Code formatting
- Husky - Git hooks
- Jest - Testing framework

## 📋 Checklist Avant Production

```
Code
- [ ] Tests passent
- [ ] Pas de bugs connus
- [ ] Performance vérifiée
- [ ] Sécurité auditée

Configuration
- [ ] Variables d'environnement configurées
- [ ] Credentials séparés de code
- [ ] Database migrée
- [ ] HTTPS activé

Documentation
- [ ] README à jour
- [ ] API documentée
- [ ] Erreurs communes documentées
- [ ] Processus de déploiement clair

Monitoring
- [ ] Logs configurés
- [ ] Alertes configurées
- [ ] Backups automatisés
- [ ] Plan de rollback

Opérations
- [ ] Process pour déployer
- [ ] Process pour rollback
- [ ] Support plan
- [ ] Escalade plan
```

---

**Suivez ces pratiques pour un code de qualité et maintenable!**
