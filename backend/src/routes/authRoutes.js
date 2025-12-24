const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser, getGoogleAuthUrl } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

/**
 * POST /api/register
 * Enregistrer un nouvel utilisateur
 */
router.post('/register', register);

/**
 * POST /api/login
 * Connexion utilisateur
 */
router.post('/login', login);

/**
 * GET /api/me
 * Récupérer l'utilisateur actuel (protégé)
 */
router.get('/me', verifyToken, getCurrentUser);

/**
 * GET /api/auth/google
 * Obtenir l'URL d'authentification Google
 */
router.get('/auth/google', getGoogleAuthUrl);

module.exports = router;
