#!/bin/bash

# Script de déploiement complet
# Usage: ./deploy.sh

set -e

echo "🚀 Gmail Client - Deployment Script"
echo "===================================="
echo ""

# Vérifier les prérequis
check_requirements() {
  echo "📋 Vérification des prérequis..."
  
  if ! command -v git &> /dev/null; then
    echo "❌ Git non installé"
    exit 1
  fi
  
  if ! command -v node &> /dev/null; then
    echo "❌ Node.js non installé"
    exit 1
  fi
  
  echo "✅ Git: $(git --version | awk '{print $3}')"
  echo "✅ Node.js: $(node --version)"
  echo ""
}

# Initialiser le repo Git
init_git() {
  echo "📦 Initialisation du repository Git..."
  
  if [ ! -d .git ]; then
    git init
    git config user.email "${GIT_EMAIL:-deployment@gmail-client.com}"
    git config user.name "${GIT_NAME:-Gmail Client Bot}"
  fi
  
  git add .
  git commit -m "Gmail Client - $(date '+%Y-%m-%d %H:%M:%S')" || echo "⚠️ Aucune modification à committer"
  
  echo "✅ Git initialisé"
  echo ""
}

# Configuration Render
setup_render() {
  echo "🔧 Configuration Render..."
  echo ""
  echo "📍 Étapes:"
  echo "1. Aller à https://render.com"
  echo "2. Signer avec GitHub"
  echo "3. Créer un nouveau Web Service"
  echo "4. Sélectionner ce repo (gmail-client)"
  echo "5. Configuration:"
  echo "   - Name: gmail-client-api"
  echo "   - Environment: Node"
  echo "   - Build: cd backend && npm install && npx prisma db push"
  echo "   - Start: cd backend && npm start"
  echo "6. Ajouter les variables d'env:"
  echo "   - DATABASE_URL (PostgreSQL)"
  echo "   - GOOGLE_CLIENT_ID"
  echo "   - GOOGLE_CLIENT_SECRET"
  echo "   - JWT_SECRET"
  echo "   - FRONTEND_URL (après déploiement Vercel)"
  echo ""
}

# Configuration Vercel
setup_vercel() {
  echo "🌐 Configuration Vercel..."
  echo ""
  echo "📍 Étapes:"
  echo "1. Aller à https://vercel.com"
  echo "2. Signer avec GitHub"
  echo "3. Importer ce repo (gmail-client)"
  echo "4. Configuration:"
  echo "   - Framework: Other"
  echo "   - Build Command: (laisser vide)"
  echo "   - Output Directory: frontend"
  echo "5. Ajouter la variable d'env:"
  echo "   - VITE_API_URL (URL Render backend)"
  echo ""
}

# Configuration Google OAuth
setup_google() {
  echo "🔐 Configuration Google OAuth2..."
  echo ""
  echo "📍 Étapes:"
  echo "1. Aller à https://console.cloud.google.com"
  echo "2. Sélectionner votre projet Gmail Client"
  echo "3. Credentials > OAuth App > Edit"
  echo "4. Ajouter les redirect URIs:"
  echo "   - https://VOTRE_DOMAIN_RENDER.com/api/gmail/callback"
  echo "   - http://localhost:3000/api/gmail/callback (dev)"
  echo ""
}

# Vérifier les variables d'env
check_env() {
  echo "🔐 Vérification des variables d'environnement..."
  
  if [ -f backend/.env ]; then
    echo "✅ backend/.env existe"
  else
    echo "⚠️ backend/.env manquant"
    echo "   Créer à partir de backend/.env.example"
  fi
  
  echo ""
}

# Main
main() {
  check_requirements
  init_git
  check_env
  
  echo "🎯 Prochaines étapes:"
  echo ""
  setup_render
  setup_vercel
  setup_google
  
  echo "📚 Documentation:"
  echo "- DEPLOYMENT.md pour plus de détails"
  echo "- GOOGLE_OAUTH_SETUP.md pour Google OAuth"
  echo "- TROUBLESHOOTING.md pour les problèmes"
  echo ""
  
  echo "✅ Préparation au déploiement terminée!"
  echo ""
  echo "👉 Prochaine étape: Pousser vers GitHub et configurer Render/Vercel"
  echo ""
}

main
