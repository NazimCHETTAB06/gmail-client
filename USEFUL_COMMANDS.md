# 🎯 Commandes Utiles

Référence rapide des commandes pour développer et maintenir le projet.

## ⭐ Démarrage Rapide

### Lancer tout

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 5500
# ou Live Server de VS Code
```

**Puis ouvrir:**
```
http://localhost:5500/frontend/index.html
```

## 🔧 Installation & Setup

```bash
# Installation initiale
cd backend
npm install

# Initialiser la base de données
npx prisma migrate dev --name init

# Générer le client Prisma (si modifié schema)
npx prisma generate

# Réinitialiser la BD (DANGER!)
npx prisma reset
```

## 🚀 Développement

```bash
# Lancer en mode development (auto-reload)
npm run dev

# Lancer en mode production
npm start

# Build pour production
npm run build

# Arrêter le serveur
Ctrl+C
```

## 🗄️ Base de Données

```bash
# Interface graphique Prisma Studio
npx prisma studio
# Ouvre: http://localhost:5555

# Voir les migrations
npx prisma migrate status

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Appliquer migrations en production
npx prisma migrate deploy

# Valider le schema
npx prisma validate

# Formater le schema
npx prisma format
```

## 🔍 Inspection & Debug

```bash
# Vérifier la santé du serveur
curl http://localhost:3000/health

# Vérifier la configuration
cat backend/.env

# Voir les logs (Terminal)
# Affiche automatiquement pour debug

# Tester une requête API
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer votre_token_jwt"

# Voir les fichiers ignores par Git
git status --ignored
```

## 📦 Gestion des dépendances

```bash
# Lister les packages installés
npm list

# Vérifier les mises à jour disponibles
npm outdated

# Mettre à jour une dépendance
npm update express

# Ajouter une nouvelle dépendance
npm install lodash

# Ajouter comme dev dependency
npm install --save-dev jest

# Supprimer une dépendance
npm uninstall express
```

## 📝 Code & Lint

```bash
# (Le projet n'a pas de linter configuré par défaut)

# Ajouter ESLint
npm install --save-dev eslint
npx eslint --init

# Linter tous les fichiers
npx eslint src/

# Fixer automatiquement les erreurs
npx eslint src/ --fix
```

## 🧪 Testing

```bash
# Installer Jest
npm install --save-dev jest

# Créer fichier de config
npx jest --init

# Lancer les tests
npm test

# Tests en watch mode
npm test -- --watch

# Tests avec coverage
npm test -- --coverage
```

## 📂 Fichiers & Dossiers

```bash
# Créer une sauvegarde
cp -r . ../backup-$(date +%Y%m%d)

# Supprimer node_modules (pour gagner de la place)
rm -rf node_modules/

# Réinstaller après suppression
npm install

# Supprimer le cache npm
npm cache clean --force

# Voir la taille des fichiers
du -sh ./
du -sh backend/ frontend/ node_modules/
```

## 🔐 Secrets & Variables

```bash
# Générer une clé secrète (Linux/Mac)
openssl rand -base64 32

# Afficher .env (attention au contenu sensible!)
cat backend/.env

# Éditer .env
# VS Code: Ctrl+K Ctrl+O → backend/.env
# vim backend/.env
# nano backend/.env

# Vérifier les variables sont chargées
node -e "require('dotenv').config({path:'backend/.env'}); console.log(process.env.GOOGLE_CLIENT_ID)"
```

## 🌐 API Testing

```bash
# Tester register
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Tester login
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Tester endpoint protégé
curl -X GET http://localhost:3000/api/me \
  -H "Authorization: Bearer votre_jwt_token"

# Tester Gmail auth URL
curl http://localhost:3000/api/gmail/auth

# Tester sync emails
curl http://localhost:3000/api/gmail/fetch \
  -H "Authorization: Bearer votre_jwt_token"
```

## 🎯 Git Commands

```bash
# Vérifier le statut
git status

# Voir les changements
git diff

# Ajouter les fichiers
git add .

# Commit avec message
git commit -m "Fix: Corriger le refresh token"

# Voir l'historique
git log --oneline

# Créer une branche
git checkout -b feature/ma-feature

# Switcher de branche
git checkout main

# Voir les branches
git branch -a

# Fusionner une branche
git merge feature/ma-feature

# Supprimer une branche
git branch -d feature/ma-feature
```

## 🐳 Docker (optionnel)

```bash
# Créer une image
docker build -t gmail-client:latest .

# Lancer un container
docker run -p 3000:3000 -e DATABASE_URL="sqlite:./prisma/dev.db" gmail-client:latest

# Docker Compose
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down
```

## 📊 Monitoring

```bash
# Vérifier l'utilisation de la mémoire (Node)
node -e "console.log('Memory:', Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB')"

# Voir les processus Node
ps aux | grep node

# Monitorer en temps réel (Linux/Mac)
top -p $(pgrep -f "node src/server.js")

# Monitorer avec pm2
npm install -g pm2
pm2 start backend/src/server.js
pm2 monit
pm2 logs
pm2 stop all
```

## 🔄 Maintenance

```bash
# Vérifier les mises à jour de Node
node --version
# Puis installer la dernière LTS depuis nodejs.org

# Vérifier la santé de npm
npm doctor

# Auditer les vulnérabilités
npm audit

# Fixer les vulnérabilités
npm audit fix

# Nettoyer les fichiers inutiles
npm prune
```

## 📚 Documenter

```bash
# Générer documentation Prisma
npx prisma generate

# Voir les fichiers du projet
tree -L 3 -I 'node_modules'

# Créer un fichier de struktur
ls -laR > PROJECT_FILES.txt
```

## 🎬 Problèmes Courants

```bash
# Port déjà utilisé
# Option 1: Tuer le processus
lsof -i :3000
kill -9 <PID>

# Option 2: Changer le port
PORT=3001 npm run dev

# Erreur de permissions
sudo chown -R $USER:$USER .

# Permissions fichier .env
chmod 600 backend/.env

# Vider le cache Node
rm -rf node_modules package-lock.json
npm install

# Vider la base de données
rm backend/prisma/dev.db
npx prisma migrate dev --name init
```

## 📱 Mobile Testing

```bash
# Trouver votre IP locale
ipconfig getifaddr en0        # Mac
hostname -I                   # Linux
ipconfig                      # Windows

# Accéder depuis mobile
http://<votre-ip>:5500/frontend/index.html

# Exemple:
http://192.168.1.100:5500/frontend/index.html
```

## 🚀 Deployment Checklist

```bash
# Avant de déployer
npm audit                     # Vérifier vulnérabilités
npm test                      # Lancer tests
npx eslint src/              # Linter code
npx prisma validate          # Valider schema

# Minifier le frontend
npm install -g minify
minify frontend/js/main.js > frontend/js/main.min.js

# Créer le build
npm run build

# Vérifier la taille
du -sh ./dist
```

## 💾 Backup & Restore

```bash
# Backup complet
zip -r backup-$(date +%Y%m%d).zip . \
  --exclude="node_modules/*" \
  --exclude=".git/*" \
  --exclude="*.log"

# Restore
unzip backup-20240101.zip

# Backup base de données
cp backend/prisma/dev.db backups/dev-$(date +%Y%m%d).db
```

## 🔐 Security Checks

```bash
# Vérifier que .env n'est pas commité
git log --all -- backend/.env

# Vérifier les fichiers secrets
grep -r "SECRET\|PASSWORD\|API_KEY" . --exclude-dir=node_modules

# Vérifier les dépendances non sécurisées
npm audit --audit-level=moderate
```

## 📞 Support Rapide

```bash
# Voir la version de Node
node --version

# Voir la version de npm
npm --version

# Voir les infos du projet
cat package.json

# Voir les infos Prisma
npx prisma --version

# Voir l'aide npm
npm help
npm help install
npm help scripts
```

---

**Besoin d'aide? Consultez la documentation:**
- [README.md](./README.md)
- [FAQ.md](./FAQ.md)
- [QUICKSTART.md](./QUICKSTART.md)
