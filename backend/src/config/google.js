const { google } = require('googleapis');

/**
 * Crée un client OAuth2 Google
 */
const getGoogleAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

/**
 * Génère l'URL d'autorisation Google
 */
const getAuthUrl = () => {
  const oauth2Client = getGoogleAuthClient();
  
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
  ];
  
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent' // Force à demander le consentement à chaque fois
  });
};

/**
 * Échange le code d'autorisation contre les tokens
 */
const getTokensFromCode = async (code) => {
  const oauth2Client = getGoogleAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
};

/**
 * Crée un client Gmail avec le token
 */
const getGmailClient = (accessToken) => {
  const oauth2Client = getGoogleAuthClient();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.gmail({ version: 'v1', auth: oauth2Client });
};

/**
 * Rafraîchit le token d'accès avec le refresh token
 */
const refreshAccessToken = async (refreshToken) => {
  const oauth2Client = getGoogleAuthClient();
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
};

module.exports = {
  getGoogleAuthClient,
  getAuthUrl,
  getTokensFromCode,
  getGmailClient,
  refreshAccessToken
};
