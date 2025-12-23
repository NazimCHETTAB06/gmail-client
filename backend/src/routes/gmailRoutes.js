const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getAuthorizationUrl,
  handleCallback,
  fetchAndSaveEmails,
  getEmails,
  getEmail
} = require('../controllers/gmailController');

/**
 * GET /api/gmail/auth
 * Retourner l'URL d'autorisation Google
 */
router.get('/auth', getAuthorizationUrl);

/**
 * GET /api/gmail/callback
 * Callback après autorisation Google
 */
router.get('/callback', handleCallback);

/**
 * GET /api/gmail/fetch
 * Récupérer et sauvegarder les emails (protégé)
 */
router.get('/fetch', verifyToken, fetchAndSaveEmails);

/**
 * GET /api/gmail/emails
 * Récupérer la liste des emails (protégé)
 */
router.get('/emails', verifyToken, getEmails);

/**
 * GET /api/gmail/email/:id
 * Récupérer un email spécifique (protégé)
 */
router.get('/email/:id', verifyToken, getEmail);

module.exports = router;
