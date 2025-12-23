# 🎬 Démarrage Rapide en 2 Commandes

Si vous avez déjà configuré les credentials Google, utilisez ceci:

## Windows (PowerShell)

```powershell
# Ouvrir PowerShell dans le dossier du projet, puis:

# Terminal 1: Backend
cd backend; npm install; npx prisma migrate dev --name init; npm run dev

# Terminal 2: Frontend  
cd frontend; python -m http.server 5500
```

## Mac/Linux

```bash
# Terminal 1: Backend
cd backend && npm install && npx prisma migrate dev --name init && npm run dev

# Terminal 2: Frontend
cd frontend && python -m http.server 5500
```

## Puis...

Ouvrir: **http://localhost:5500/frontend/index.html**

---

**Note**: Vous devez avoir les credentials Google configurés dans `backend/.env` avant de lancer.

Voir [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) pour les obtenir.
