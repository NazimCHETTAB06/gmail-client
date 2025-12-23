#!/usr/bin/env python3
"""
Script de vérification du déploiement
Vérifie que tout est prêt pour le déploiement
"""

import os
import sys
import json
from pathlib import Path

def check_files():
    """Vérifier que tous les fichiers de déploiement existent"""
    files_to_check = [
        'render.yaml',
        'vercel.json',
        'package.json',
        'DEPLOYMENT.md',
        'QUICK_DEPLOY.md',
        'backend/package.json',
        'backend/src/server.js',
        'backend/prisma/schema.prisma',
        'frontend/index.html',
        'frontend/css/style.css',
        'frontend/js/main.js',
    ]
    
    print("📋 Vérification des fichiers...")
    all_ok = True
    
    for file_path in files_to_check:
        if Path(file_path).exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path}")
            all_ok = False
    
    return all_ok

def check_env():
    """Vérifier la configuration d'environnement"""
    print("\n🔐 Vérification du .env...")
    
    if Path('backend/.env').exists():
        print("  ✅ backend/.env existe")
        return True
    elif Path('backend/.env.example').exists():
        print("  ⚠️ backend/.env.example existe, mais pas backend/.env")
        print("     → Créer backend/.env à partir du .env.example")
        return False
    else:
        print("  ❌ Aucun fichier .env trouvé")
        return False

def check_git():
    """Vérifier que Git est initialisé"""
    print("\n📦 Vérification de Git...")
    
    if Path('.git').exists():
        print("  ✅ Repository Git initialisé")
        return True
    else:
        print("  ⚠️ Repository Git non initialisé")
        print("     → Exécuter: git init && git add . && git commit -m 'Initial commit'")
        return False

def main():
    print("🚀 Gmail Client - Deployment Readiness Check")
    print("=" * 50)
    print()
    
    files_ok = check_files()
    env_ok = check_env()
    git_ok = check_git()
    
    print("\n" + "=" * 50)
    print("\n📊 RÉSUMÉ:")
    print()
    
    if files_ok and env_ok and git_ok:
        print("✅ TOUT EST PRÊT POUR LE DÉPLOIEMENT!")
        print()
        print("👉 Prochaine étape: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)")
        return 0
    else:
        print("⚠️ QUELQUES ÉLÉMENTS À VÉRIFIER:")
        print()
        if not files_ok:
            print("  - Vérifier les fichiers manquants ci-dessus")
        if not env_ok:
            print("  - Créer backend/.env (voir .env.example)")
        if not git_ok:
            print("  - Initialiser Git: git init && git add . && git commit")
        print()
        print("📚 Documentation: [DEPLOYMENT.md](./DEPLOYMENT.md)")
        return 1

if __name__ == '__main__':
    sys.exit(main())
