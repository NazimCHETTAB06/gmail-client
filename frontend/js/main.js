// ========================================
// API Configuration
// ========================================

// Déterminer l'URL de l'API en fonction de l'environnement
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;

const FRONTEND_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5500/frontend'
  : window.location.origin;

// ========================================
// Authentication Functions
// ========================================

/**
 * S'inscrire
 */
async function register() {
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

    const errorDiv = document.getElementById('registerError');
    const successDiv = document.getElementById('registerSuccess');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    if (!email || !password) {
        errorDiv.textContent = 'Veuillez remplir tous les champs';
        errorDiv.style.display = 'block';
        return;
    }

    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Les mots de passe ne correspondent pas';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.error || 'Erreur lors de l\'inscription';
            errorDiv.style.display = 'block';
            return;
        }

        successDiv.textContent = 'Inscription réussie! Vous pouvez maintenant vous connecter.';
        successDiv.style.display = 'block';
        
        document.getElementById('registerForm').reset();
        
        setTimeout(() => {
            switchTab('login');
        }, 2000);
    } catch (error) {
        console.error('Register error:', error);
        errorDiv.textContent = 'Erreur réseau';
        errorDiv.style.display = 'block';
    }
}

/**
 * Se connecter avec Google OAuth
 */
async function loginWithGoogle() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'GET'
        });

        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Erreur lors de la connexion Google');
            return;
        }

        // Rediriger vers Google OAuth
        window.location.href = data.authUrl;
    } catch (error) {
        console.error('Login with Google error:', error);
        alert('Erreur lors de la connexion Google');
    }
}

/**
 * Se connecter
 */
async function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const errorDiv = document.getElementById('loginError');
    errorDiv.style.display = 'none';

    if (!email || !password) {
        errorDiv.textContent = 'Veuillez remplir tous les champs';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorDiv.textContent = data.error || 'Erreur lors de la connexion';
            errorDiv.style.display = 'block';
            return;
        }

        // Sauvegarder le token
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        
        // Rediriger vers le dashboard
        window.location.href = `${FRONTEND_BASE_URL}/dashboard.html`;
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'Erreur réseau';
        errorDiv.style.display = 'block';
    }
}

/**
 * Se déconnecter
 */
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = `${FRONTEND_BASE_URL}/index.html`;
}

// ========================================
// Tab Functions
// ========================================

/**
 * Changer d'onglet
 */
function switchTab(tabName) {
    // Cacher tous les tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Déactiver tous les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Afficher le tab sélectionné
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Activer le bouton sélectionné
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
}

// ========================================
// Gmail OAuth Functions
// ========================================

/**
 * Connecter Gmail via OAuth
 */
async function connectGmail() {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        alert('Veuillez d\'abord vous connecter');
        window.location.href = `${FRONTEND_BASE_URL}/index.html`;
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/gmail/auth`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Erreur');
            return;
        }

        // Rediriger vers Google OAuth avec l'userId en paramètre
        const authUrl = new URL(data.authUrl);
        authUrl.searchParams.set('userId', userId);
        window.location.href = authUrl.toString();
    } catch (error) {
        console.error('Connect Gmail error:', error);
        alert('Erreur lors de la connexion à Gmail');
    }
}

/**
 * Synchroniser les emails
 */
async function syncEmails() {
    const syncBtn = document.getElementById('syncBtn');
    syncBtn.disabled = true;
    syncBtn.textContent = '🔄 Synchronisation...';

    try {
        const response = await fetch(`${API_BASE_URL}/gmail/fetch`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Erreur lors de la synchronisation');
            syncBtn.disabled = false;
            syncBtn.textContent = '🔄 Synchroniser';
            return;
        }

        alert(`✅ ${data.count} emails synchronisés`);
        syncBtn.disabled = false;
        syncBtn.textContent = '🔄 Synchroniser';
        
        // Recharger la liste des emails
        loadEmails();
    } catch (error) {
        console.error('Sync emails error:', error);
        alert('Erreur lors de la synchronisation');
        syncBtn.disabled = false;
        syncBtn.textContent = '🔄 Synchroniser';
    }
}

// ========================================
// Dashboard Functions
// ========================================

/**
 * Charger les infos utilisateur
 */
async function loadUserInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}/me`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }

        const user = await response.json();

        const userInfoDiv = document.getElementById('userInfo');
        if (userInfoDiv) {
            const gmailConnected = user.accounts.some(acc => acc.provider === 'gmail');
            userInfoDiv.innerHTML = `
                <p><strong>${user.email}</strong></p>
                <p style="font-size: 12px; margin-top: 10px;">
                    ${gmailConnected ? '✅ Gmail connecté' : '❌ Gmail non connecté'}
                </p>
            `;
        }
    } catch (error) {
        console.error('Load user info error:', error);
    }
}

/**
 * Charger la liste des emails
 */
async function loadEmails(page = 1) {
    const emailsList = document.getElementById('emailsList');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    const emailCount = document.getElementById('emailCount');

    if (loadingState) loadingState.style.display = 'block';
    if (emailsList) emailsList.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE_URL}/gmail/emails?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            if (loadingState) loadingState.style.display = 'none';
            if (emptyState) {
                emptyState.textContent = data.error || 'Erreur lors du chargement';
                emptyState.style.display = 'block';
            }
            return;
        }

        if (loadingState) loadingState.style.display = 'none';

        const emails = data.emails;
        const pagination = data.pagination;

        if (emails.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (emailCount) emailCount.textContent = '0';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';
        if (emailCount) emailCount.textContent = pagination.total;

        // Afficher les emails
        if (emailsList) {
            emailsList.innerHTML = emails.map(email => `
                <div class="email-item" onclick="openEmail(${email.id})">
                    <div class="email-item-from">${escapeHtml(email.sender)}</div>
                    <div class="email-item-subject">${escapeHtml(email.subject)}</div>
                    <div class="email-item-snippet">${escapeHtml(email.snippet)}</div>
                    <div class="email-item-date">${formatDate(email.receivedAt)}</div>
                </div>
            `).join('');
        }

        // Afficher la pagination
        const paginationDiv = document.getElementById('pagination');
        if (pagination.pages > 1) {
            let paginationHtml = '';
            for (let i = 1; i <= pagination.pages; i++) {
                paginationHtml += `<button onclick="loadEmails(${i})" ${i === page ? 'disabled' : ''}>${i}</button>`;
            }
            if (paginationDiv) {
                paginationDiv.innerHTML = paginationHtml;
                paginationDiv.style.display = 'block';
            }
        } else if (paginationDiv) {
            paginationDiv.style.display = 'none';
        }
    } catch (error) {
        console.error('Load emails error:', error);
        if (loadingState) loadingState.style.display = 'none';
        if (emptyState) {
            emptyState.textContent = 'Erreur réseau';
            emptyState.style.display = 'block';
        }
    }
}

/**
 * Ouvrir un email
 */
function openEmail(emailId) {
    window.location.href = `${FRONTEND_BASE_URL}/email.html?id=${emailId}`;
}

// ========================================
// Email View Functions
// ========================================

/**
 * Charger et afficher un email spécifique
 */
async function loadEmail() {
    const params = new URLSearchParams(window.location.search);
    const emailId = params.get('id');

    if (!emailId) {
        document.getElementById('emailContent').innerHTML = '<p>Email non trouvé</p>';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/gmail/email/${emailId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            document.getElementById('emailContent').innerHTML = '<p>Erreur lors du chargement de l\'email</p>';
            return;
        }

        const email = await response.json();

        document.getElementById('emailContent').innerHTML = `
            <div class="email-full">
                <div class="email-full-header">
                    <div class="email-full-from">${escapeHtml(email.sender)}</div>
                    <div class="email-full-subject">${escapeHtml(email.subject)}</div>
                    <div class="email-full-date">${formatDate(email.receivedAt)}</div>
                </div>
                <div class="email-full-body">${email.body}</div>
            </div>
        `;

        // Ajouter l'ID de l'email au bouton de suppression
        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.onclick = () => deleteEmail(emailId);
        }
    } catch (error) {
        console.error('Load email error:', error);
        document.getElementById('emailContent').innerHTML = '<p>Erreur réseau</p>';
    }
}

/**
 * Supprimer un email (local uniquement)
 */
async function deleteEmail(emailId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet email?')) return;

    try {
        // Note: Il faudrait implémenter l'endpoint de suppression au backend
        alert('Suppression non implémentée sur cette version');
    } catch (error) {
        console.error('Delete email error:', error);
        alert('Erreur lors de la suppression');
    }
}

// ========================================
// Utility Functions
// ========================================

/**
 * Échapper les caractères HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Formater une date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 7) {
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
    } else if (days > 0) {
        return `il y a ${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        return `il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
        return `il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        return 'À l\'instant';
    }
}

// ========================================
// Callback Handler
// ========================================

/**
 * Gérer le callback de redirection (token dans l'URL)
 */
function handleAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    
    if (token && userId) {
        // Sauvegarder le token et rediriger
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        
        // Nettoyer l'URL et rediriger vers le dashboard
        window.location.href = `${FRONTEND_BASE_URL}/dashboard.html`;
    }
}

// ========================================
// Event Listeners
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Gérer le callback d'authentification Google
    handleAuthCallback();
    
            e.preventDefault();
            login();
        });

        document.getElementById('registerForm').addEventListener('submit', (e) => {
            e.preventDefault();
            register();
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                switchTab(e.target.dataset.tab);
            });
        });
    }

    // Page de dashboard
    if (document.getElementById('syncBtn')) {
        loadUserInfo();
        loadEmails();

        document.getElementById('logoutBtn').addEventListener('click', logout);
        document.getElementById('syncBtn').addEventListener('click', syncEmails);
        document.getElementById('connectGmailBtn').addEventListener('click', connectGmail);
        
        // Recharger les infos utilisateur toutes les 30 secondes
        setInterval(loadUserInfo, 30000);
    }

    // Page de lecture d'email
    if (document.getElementById('emailContent') && window.location.pathname.includes('email.html')) {
        loadEmail();
    }
});
