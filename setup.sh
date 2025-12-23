#!/bin/bash

# ========================================
# SCRIPT DE SETUP AUTOMATISÉ
# Gmail Client - Installation rapide (Linux/Mac)
# ========================================

echo "========================================"
echo "📧 Gmail Client - Setup Automatisé"
echo "========================================"
echo ""

# Vérifier Node.js
echo "Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé!"
    echo "Téléchargez-le depuis: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION trouvé"
echo ""

# Installer les dépendances Backend
echo "Installation des dépendances Backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi
echo "✅ Backend dépendances installées"
echo ""

# Créer .env si n'existe pas
echo "Configuration du fichier .env..."
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  Fichier .env non trouvé!"
    echo "Vous devez configurer les credentials Google:"
    echo ""
    echo "1. Allez sur: https://console.cloud.google.com"
    echo "2. Suivez: ../GOOGLE_OAUTH_SETUP.md"
    echo "3. Créez un fichier 'backend/.env' avec:"
    echo ""
    echo "   GOOGLE_CLIENT_ID=votre_client_id"
    echo "   GOOGLE_CLIENT_SECRET=votre_secret"
    echo "   GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback"
    echo "   JWT_SECRET=votre_clé_secrète"
    echo "   DATABASE_URL=sqlite:./prisma/dev.db"
    echo "   PORT=3000"
    echo "   NODE_ENV=development"
    echo ""
    echo "Appuyez sur ENTER une fois le fichier .env créé..."
    read
else
    echo "✅ Fichier .env détecté"
fi
echo ""

# Initialiser Prisma
echo "Initialisation de la base de données..."
npx prisma migrate dev --name init
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'initialisation de la BD"
    echo "Vérifiez que .env est configuré correctement"
    exit 1
fi
echo "✅ Base de données initialisée"
echo ""

# Retour au répertoire parent
cd ..

# Afficher les instructions finales
echo "========================================"
echo "✅ Installation complète!"
echo "========================================"
echo ""
echo "🚀 Pour démarrer:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  python -m http.server 5500"
echo "  (ou utiliser Live Server de VS Code)"
echo ""
echo "Puis ouvrez:"
echo "  http://localhost:5500/frontend/index.html"
echo ""
echo "Lisez README.md pour plus d'infos"
echo ""
