const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getAuthUrl } = require('../config/google');

const prisma = new PrismaClient();

/**
 * Enregistrer un nouvel utilisateur
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash le password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: user.id,
      email: user.email
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

/**
 * Connexion utilisateur
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Vérifier le password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Générer JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      userId: user.id,
      email: user.email
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

/**
 * Récupérer les infos de l'utilisateur actuel
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        accounts: {
          select: {
            id: true,
            provider: true,
            createdAt: true
          }
        }
      }
    });
    
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

/**
 * Obtenir l'URL d'authentification Google
 */
const getGoogleAuthUrl = async (req, res) => {
  try {
    const authUrl = getAuthUrl();
    res.json({ authUrl });
  } catch (err) {
    console.error('Get Google auth URL error:', err);
    res.status(500).json({ error: 'Failed to get Google auth URL' });
  }
};

/**
 * Callback après authentification Google
 */
const handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code not found' });
    }

    // Échanger le code contre les tokens
    const { getTokensFromCode } = require('../config/google');
    const tokens = await getTokensFromCode(code);

    // Créer ou récupérer l'utilisateur Google
    const { email } = tokens;
    
    // Pour simplifier, créer un utilisateur avec email Google
    let user = await prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            provider: 'google',
            providerAccountId: tokens.sub || code
          }
        }
      }
    });

    if (!user) {
      // Créer un nouvel utilisateur
      user = await prisma.user.create({
        data: {
          email: email || `google-${Date.now()}@gmail.com`,
          password: null, // Google auth doesn't need password
          accounts: {
            create: {
              provider: 'google',
              providerAccountId: tokens.sub || code,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null
            }
          }
        },
        include: { accounts: true }
      });
    } else {
      // Mettre à jour les tokens
      await prisma.account.updateMany({
        where: {
          userId: user.id,
          provider: 'google'
        },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null
        }
      });
    }

    // Générer JWT pour la session
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Rediriger vers le dashboard avec le token
    const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard.html?token=${jwtToken}&userId=${user.id}`;
    res.redirect(dashboardUrl);
  } catch (err) {
    console.error('Google callback error:', err);
    res.redirect(`${process.env.FRONTEND_URL}/?error=${encodeURIComponent(err.message)}`);
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getGoogleAuthUrl,
  handleGoogleCallback
};
