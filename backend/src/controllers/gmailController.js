const { PrismaClient } = require('@prisma/client');
const { getAuthUrl, getTokensFromCode, getGmailClient, refreshAccessToken } = require('../config/google');

const prisma = new PrismaClient();

/**
 * Retourner l'URL d'autorisation Google
 */
const getAuthorizationUrl = (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (err) {
    console.error('Get auth URL error:', err);
    res.status(500).json({ error: 'Failed to get authorization URL' });
  }
};

/**
 * Callback après autorisation Google (échange le code contre les tokens)
 */
const handleCallback = async (req, res) => {
  try {
    const { code, userId } = req.query;
    
    if (!code || !userId) {
      return res.status(400).json({ error: 'Missing code or userId' });
    }
    
    // Échanger le code contre les tokens
    const tokens = await getTokensFromCode(code);
    
    // Sauvegarder les tokens en base de données
    await prisma.account.upsert({
      where: {
        userId_provider: {
          userId: parseInt(userId),
          provider: 'gmail'
        }
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      },
      create: {
        userId: parseInt(userId),
        provider: 'gmail',
        providerAccountId: tokens.sub || code,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      }
    });
    
    res.redirect(`http://localhost:5500/frontend/dashboard.html?success=true`);
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).json({ error: 'Failed to handle callback' });
  }
};

/**
 * Récupérer et sauvegarder les emails depuis Gmail
 */
const fetchAndSaveEmails = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Récupérer le compte Gmail de l'utilisateur
    const mailAccount = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'gmail'
      }
    });
    
    if (!mailAccount) {
      return res.status(404).json({ error: 'Gmail account not connected' });
    }
    
    // Vérifier si le token a expiré et le rafraîchir si nécessaire
    let accessToken = mailAccount.accessToken;
    if (mailAccount.expiresAt && new Date() > mailAccount.expiresAt && mailAccount.refreshToken) {
      try {
        const newCredentials = await refreshAccessToken(mailAccount.refreshToken);
        accessToken = newCredentials.access_token;
        
        await prisma.account.update({
          where: { id: mailAccount.id },
          data: {
            accessToken: newCredentials.access_token,
            expiresAt: newCredentials.expiry_date ? new Date(newCredentials.expiry_date) : null
          }
        });
      } catch (err) {
        console.error('Token refresh error:', err);
        return res.status(401).json({ error: 'Failed to refresh Gmail token' });
      }
    }
    
    // Créer le client Gmail
    const gmail = getGmailClient(accessToken);
    
    // Récupérer les messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 50,
      q: 'in:inbox'
    });
    
    const messages = response.data.messages || [];
    
    if (messages.length === 0) {
      return res.json({ message: 'No emails found', count: 0 });
    }
    
    // Récupérer les détails de chaque message
    const emailsToSave = [];
    
    for (const msg of messages) {
      try {
        const msgData = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full'
        });
        
        const headers = msgData.data.payload.headers;
        const sender = headers.find(h => h.name === 'From')?.value || 'Unknown';
        const subject = headers.find(h => h.name === 'Subject')?.value || '(No Subject)';
        const date = headers.find(h => h.name === 'Date')?.value || new Date().toISOString();
        
        let body = '';
        if (msgData.data.payload.parts) {
          const part = msgData.data.payload.parts.find(p => p.mimeType === 'text/plain' || p.mimeType === 'text/html');
          if (part && part.body.data) {
            body = Buffer.from(part.body.data, 'base64').toString('utf-8');
          }
        } else if (msgData.data.payload.body.data) {
          body = Buffer.from(msgData.data.payload.body.data, 'base64').toString('utf-8');
        }
        
        const snippet = msgData.data.snippet || '';
        
        emailsToSave.push({
          gmailId: msg.id,
          userId,
          sender,
          subject,
          snippet,
          body: body || snippet,
          receivedAt: new Date(parseInt(msgData.data.internalDate))
        });
      } catch (err) {
        console.error(`Error fetching message ${msg.id}:`, err);
      }
    }
    
    // Sauvegarder les emails en base (ignorer les doublons)
    for (const email of emailsToSave) {
      await prisma.email.upsert({
        where: { gmailId: email.gmailId },
        update: {},
        create: email
      });
    }
    
    res.json({
      message: 'Emails fetched and saved',
      count: emailsToSave.length
    });
  } catch (err) {
    console.error('Fetch emails error:', err);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
};

/**
 * Récupérer la liste des emails de l'utilisateur
 */
const getEmails = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    
    const emails = await prisma.email.findMany({
      where: { userId },
      orderBy: { receivedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        gmailId: true,
        sender: true,
        subject: true,
        snippet: true,
        receivedAt: true
      }
    });
    
    const total = await prisma.email.count({ where: { userId } });
    
    res.json({
      emails,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get emails error:', err);
    res.status(500).json({ error: 'Failed to get emails' });
  }
};

/**
 * Récupérer un email spécifique
 */
const getEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const email = await prisma.email.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });
    
    if (!email) {
      return res.status(404).json({ error: 'Email not found' });
    }
    
    res.json(email);
  } catch (err) {
    console.error('Get email error:', err);
    res.status(500).json({ error: 'Failed to get email' });
  }
};

module.exports = {
  getAuthorizationUrl,
  handleCallback,
  fetchAndSaveEmails,
  getEmails,
  getEmail
};
