#!/usr/bin/env pwsh

# Script de déploiement complet - Windows PowerShell
# Usage: ./deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Gmail Client - Deployment Script (Windows)" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Fonction: Vérifier les prérequis
function Check-Requirements {
    Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow
    
    $git = Get-Command git -ErrorAction SilentlyContinue
    if (-not $git) {
        Write-Host "❌ Git non installé" -ForegroundColor Red
        exit 1
    }
    
    $node = Get-Command node -ErrorAction SilentlyContinue
    if (-not $node) {
        Write-Host "❌ Node.js non installé" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Git: $((git --version).Split()[2])" -ForegroundColor Green
    Write-Host "✅ Node.js: $(node --version)" -ForegroundColor Green
    Write-Host ""
}

# Fonction: Initialiser Git
function Init-Git {
    Write-Host "📦 Initialisation du repository Git..." -ForegroundColor Yellow
    
    if (-not (Test-Path .git)) {
        git init
        git config user.email "deployment@gmail-client.com"
        git config user.name "Gmail Client Bot"
    }
    
    git add .
    $date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Gmail Client - $date" -ErrorAction SilentlyContinue | Out-Null
    
    Write-Host "✅ Git initialisé" -ForegroundColor Green
    Write-Host ""
}

# Fonction: Vérifier .env
function Check-Env {
    Write-Host "🔐 Vérification des variables d'environnement..." -ForegroundColor Yellow
    
    if (Test-Path backend\.env) {
        Write-Host "✅ backend\.env existe" -ForegroundColor Green
    } else {
        Write-Host "⚠️ backend\.env manquant" -ForegroundColor Yellow
        Write-Host "   Créer à partir de backend\.env.example" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Fonction: Setup Render
function Setup-Render {
    Write-Host "🔧 Configuration Render..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📍 Étapes:" -ForegroundColor Cyan
    Write-Host "1. Aller à https://render.com"
    Write-Host "2. Signer avec GitHub"
    Write-Host "3. Créer un nouveau Web Service"
    Write-Host "4. Sélectionner ce repo (gmail-client)"
    Write-Host "5. Configuration:"
    Write-Host "   - Name: gmail-client-api"
    Write-Host "   - Environment: Node"
    Write-Host "   - Build: cd backend && npm install && npx prisma db push"
    Write-Host "   - Start: cd backend && npm start"
    Write-Host "6. Ajouter les variables d'env:"
    Write-Host "   - DATABASE_URL (PostgreSQL)"
    Write-Host "   - GOOGLE_CLIENT_ID"
    Write-Host "   - GOOGLE_CLIENT_SECRET"
    Write-Host "   - JWT_SECRET"
    Write-Host "   - FRONTEND_URL (après déploiement Vercel)"
    Write-Host ""
}

# Fonction: Setup Vercel
function Setup-Vercel {
    Write-Host "🌐 Configuration Vercel..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📍 Étapes:" -ForegroundColor Cyan
    Write-Host "1. Aller à https://vercel.com"
    Write-Host "2. Signer avec GitHub"
    Write-Host "3. Importer ce repo (gmail-client)"
    Write-Host "4. Configuration:"
    Write-Host "   - Framework: Other"
    Write-Host "   - Build Command: (laisser vide)"
    Write-Host "   - Output Directory: frontend"
    Write-Host "5. Ajouter la variable d'env:"
    Write-Host "   - VITE_API_URL (URL Render backend)"
    Write-Host ""
}

# Fonction: Setup Google
function Setup-Google {
    Write-Host "🔐 Configuration Google OAuth2..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📍 Étapes:" -ForegroundColor Cyan
    Write-Host "1. Aller à https://console.cloud.google.com"
    Write-Host "2. Sélectionner votre projet Gmail Client"
    Write-Host "3. Credentials > OAuth App > Edit"
    Write-Host "4. Ajouter les redirect URIs:"
    Write-Host "   - https://VOTRE_DOMAIN_RENDER.com/api/gmail/callback"
    Write-Host "   - http://localhost:3000/api/gmail/callback (dev)"
    Write-Host ""
}

# Main
function Main {
    Check-Requirements
    Init-Git
    Check-Env
    
    Write-Host "🎯 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host ""
    Setup-Render
    Setup-Vercel
    Setup-Google
    
    Write-Host "📚 Documentation:" -ForegroundColor Cyan
    Write-Host "- DEPLOYMENT.md pour plus de détails"
    Write-Host "- GOOGLE_OAUTH_SETUP.md pour Google OAuth"
    Write-Host "- TROUBLESHOOTING.md pour les problèmes"
    Write-Host ""
    
    Write-Host "✅ Préparation au déploiement terminée!" -ForegroundColor Green
    Write-Host ""
    Write-Host "👉 Prochaine étape: Pousser vers GitHub et configurer Render/Vercel" -ForegroundColor Green
    Write-Host ""
}

Main
