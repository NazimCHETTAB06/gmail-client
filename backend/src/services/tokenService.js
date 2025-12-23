const { PrismaClient } = require('@prisma/client');
const { refreshAccessToken } = require('./google');

const prisma = new PrismaClient();

/**
 * Vérifie et rafraîchit les tokens expirés toutes les heures
 */
async function refreshExpiredTokens() {
    try {
        const now = new Date();
        
        // Trouver tous les comptes avec des tokens expirés
        const expiredAccounts = await prisma.mailAccount.findMany({
            where: {
                expiresAt: {
                    lte: new Date(now.getTime() + 5 * 60 * 1000) // Expirés ou expiration dans < 5 min
                },
                refreshToken: {
                    not: null
                }
            }
        });

        console.log(`Found ${expiredAccounts.length} accounts with expired tokens`);

        for (const account of expiredAccounts) {
            try {
                const newCredentials = await refreshAccessToken(account.refreshToken);
                
                await prisma.mailAccount.update({
                    where: { id: account.id },
                    data: {
                        accessToken: newCredentials.access_token,
                        expiresAt: newCredentials.expiry_date ? new Date(newCredentials.expiry_date) : null
                    }
                });

                console.log(`✅ Token refreshed for account ${account.id}`);
            } catch (err) {
                console.error(`❌ Failed to refresh token for account ${account.id}:`, err.message);
            }
        }
    } catch (err) {
        console.error('Token refresh service error:', err);
    }
}

/**
 * Démarrer le service de rafraîchissement des tokens
 */
function startTokenRefreshService() {
    console.log('🔄 Starting token refresh service');
    
    // Rafraîchir les tokens toutes les heures
    setInterval(refreshExpiredTokens, 60 * 60 * 1000);
    
    // Exécuter une première vérification au démarrage
    refreshExpiredTokens();
}

module.exports = {
    startTokenRefreshService,
    refreshExpiredTokens
};
