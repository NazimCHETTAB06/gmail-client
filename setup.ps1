# ========================================
# SCRIPT DE SETUP AUTOMATISÉ
# Gmail Client - Installation rapide
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📧 Gmail Client - Setup Automatisé" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
Write-Host "Vérification de Node.js..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "Téléchargez-le depuis: https://nodejs.org" -ForegroundColor Yellow
    exit
}
$nodeVersion = node -v
Write-Host "✅ Node.js $nodeVersion trouvé" -ForegroundColor Green
Write-Host ""

# Installer les dépendances Backend
Write-Host "Installation des dépendances Backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit
}
Write-Host "✅ Backend dépendances installées" -ForegroundColor Green
Write-Host ""

# Créer .env si n'existe pas
Write-Host "Configuration du fichier .env..." -ForegroundColor Yellow
if (!(Test-Path .env)) {
    Write-Host ""
    Write-Host "⚠️  Fichier .env non trouvé!" -ForegroundColor Yellow
    Write-Host "Vous devez configurer les credentials Google:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Allez sur: https://console.cloud.google.com" -ForegroundColor Cyan
    Write-Host "2. Suivez: ../GOOGLE_OAUTH_SETUP.md" -ForegroundColor Cyan
    Write-Host "3. Créez un fichier 'backend/.env' avec:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   GOOGLE_CLIENT_ID=votre_client_id" -ForegroundColor Gray
    Write-Host "   GOOGLE_CLIENT_SECRET=votre_secret" -ForegroundColor Gray
    Write-Host "   GOOGLE_REDIRECT_URI=http://localhost:3000/api/gmail/callback" -ForegroundColor Gray
    Write-Host "   JWT_SECRET=votre_clé_secrète" -ForegroundColor Gray
    Write-Host "   DATABASE_URL=sqlite:./prisma/dev.db" -ForegroundColor Gray
    Write-Host "   PORT=3000" -ForegroundColor Gray
    Write-Host "   NODE_ENV=development" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Appuyez sur ENTER une fois le fichier .env créé..."
    Read-Host
} else {
    Write-Host "✅ Fichier .env détecté" -ForegroundColor Green
}
Write-Host ""

# Initialiser Prisma
Write-Host "Initialisation de la base de données..." -ForegroundColor Yellow
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de l'initialisation de la BD" -ForegroundColor Red
    Write-Host "Vérifiez que .env est configuré correctement" -ForegroundColor Yellow
    exit
}
Write-Host "✅ Base de données initialisée" -ForegroundColor Green
Write-Host ""

# Retour au répertoire parent
Set-Location ..

# Afficher les instructions finales
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Installation complète!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Pour démarrer:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "  cd backend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "  cd frontend" -ForegroundColor Gray
Write-Host "  python -m http.server 5500" -ForegroundColor Gray
Write-Host "  (ou utiliser Live Server de VS Code)" -ForegroundColor Gray
Write-Host ""
Write-Host "Puis ouvrez:" -ForegroundColor Cyan
Write-Host "  http://localhost:5500/frontend/index.html" -ForegroundColor Green
Write-Host ""
Write-Host "Lisez README.md pour plus d'infos" -ForegroundColor Cyan
Write-Host ""
