// ========================================
// ALTERNATIVE CONFIGURATIONS
// ========================================

/**
 * Ce fichier documente les configurations alternatives
 * pour la base de données et les services
 */

// ========================================
// 1. CONFIGURATION MONGODB (Alternative à SQLite/MySQL)
// ========================================

/*
Modification du schema.prisma:

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  accounts  MailAccount[]
  emails    Email[]
}

model MailAccount {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  provider     String
  accessToken  String
  refreshToken String?
  expiresAt    DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId       String   @db.ObjectId
  
  @@unique([userId, provider])
}

model Email {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  gmailId    String   @unique
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId     String   @db.ObjectId
  sender     String
  subject    String
  snippet    String
  body       String?
  receivedAt DateTime
  createdAt  DateTime @default(now())
  
  @@index([userId])
  @@index([receivedAt])
}

.env:
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/gmail_client"

Installation:
npm install -D prisma @prisma/client mongodb
npx prisma migrate dev --name init
*/

// ========================================
// 2. CONFIGURATION PostgreSQL
// ========================================

/*
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

.env:
DATABASE_URL="postgresql://user:password@localhost:5432/gmail_client"

Installation:
npm install pg
npx prisma migrate dev --name init
*/

// ========================================
// 3. CONFIGURATION S3 POUR STOCKER LES EMAILS
// ========================================

/*
npm install aws-sdk

// backend/src/services/storageService.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

async function storeEmailBody(userId, emailId, body) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `emails/${userId}/${emailId}.txt`,
    Body: body
  };
  
  return await s3.upload(params).promise();
}

async function getEmailBody(userId, emailId) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `emails/${userId}/${emailId}.txt`
  };
  
  return await s3.getObject(params).promise();
}

.env:
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=yyy
AWS_BUCKET_NAME=gmail-client-emails
*/

// ========================================
// 4. CONFIGURATION REDIS POUR LE CACHING
// ========================================

/*
npm install redis

// backend/src/services/cacheService.js
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

async function getEmailsFromCache(userId) {
  const cached = await client.get(`emails:${userId}`);
  return cached ? JSON.parse(cached) : null;
}

async function setEmailsInCache(userId, emails, ttl = 300) {
  await client.setex(
    `emails:${userId}`,
    ttl,
    JSON.stringify(emails)
  );
}

// Dans gmailController.js:
const getEmails = async (req, res) => {
  const userId = req.userId;
  
  // Essayer le cache en premier
  const cached = await getEmailsFromCache(userId);
  if (cached) {
    return res.json(cached);
  }
  
  // Sinon, récupérer de la BD
  const emails = await prisma.email.findMany({
    where: { userId },
    orderBy: { receivedAt: 'desc' }
  });
  
  // Cacher le résultat
  setEmailsInCache(userId, emails);
  
  res.json(emails);
};

.env:
REDIS_HOST=localhost
REDIS_PORT=6379
*/

// ========================================
// 5. CONFIGURATION LOGGING AVANCÉ
// ========================================

/*
npm install winston pino

// backend/src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'gmail-client' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;

// Usage:
logger.info('User logged in', { userId: 123 });
logger.error('Database error', { error: err.message });
*/

// ========================================
// 6. CONFIGURATION EMAIL NOTIFICATIONS
// ========================================

/*
npm install nodemailer

// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

async function sendEmailNotification(userEmail, subject, message) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: subject,
    html: message
  });
}

.env:
SMTP_USER=xxx@gmail.com
SMTP_PASSWORD=votre_app_password
SMTP_FROM=noreply@gmail-client.app
*/

// ========================================
// 7. CONFIGURATION WEBSOCKET POUR SYNC REAL-TIME
// ========================================

/*
npm install ws socket.io

// backend/src/server.js
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = extractUserIdFromToken(req);
  clients.set(userId, ws);
  
  ws.on('close', () => {
    clients.delete(userId);
  });
});

// Quand les emails sont synchronisés:
function notifyUserNewEmails(userId, count) {
  const ws = clients.get(userId);
  if (ws) {
    ws.send(JSON.stringify({
      type: 'NEW_EMAILS',
      count: count
    }));
  }
}

server.listen(PORT);

// Frontend:
const ws = new WebSocket('ws://localhost:3000');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'NEW_EMAILS') {
    loadEmails();
    showNotification(`${data.count} nouveaux emails`);
  }
};
*/

// ========================================
// 8. CONFIGURATION HTTPS LOCAL
// ========================================

/*
npm install --save-dev https-localhost

// backend/src/server.js
const https = require('https');
const fs = require('fs');
const localHttps = require('https-localhost');

// Pour le développement local avec HTTPS:
const { key, cert } = await localHttps();

const options = {
  key: key,
  cert: cert
};

https.createServer(options, app).listen(PORT);

// .env:
USE_HTTPS=true
*/

// ========================================
// 9. CONFIGURATION DOCKER
// ========================================

/*
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]

# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:password@mysql:3306/gmail_client
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mysql
  
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: gmail_client
      MYSQL_USER: user
      MYSQL_PASSWORD: password
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:

# Lancer:
docker-compose up -d
*/

// ========================================
// 10. CONFIGURATION AUTHENTIFICATION AVANCÉE
// ========================================

/*
npm install passport passport-google-oauth20 passport-local

// Utiliser Passport pour OAuth2 au lieu du code custom
// Simplifie la gestion des stratégies d'authentification
*/

module.exports = {
  info: 'Ce fichier documente les configurations alternatives disponibles'
};
