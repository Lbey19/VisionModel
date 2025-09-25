// ===== STATE MANAGEMENT =====
class ChatApp {
    constructor() {
        this.isLoading = false;
        this.messageHistory = [];
        this.initializeElements();
        this.attachEventListeners();
        this.checkServerStatus();
        this.autoResizeTextarea();
    }

    // Initialize DOM elements
    initializeElements() {
        this.elements = {
            form: document.getElementById('chatForm'),
            input: document.getElementById('messageInput'),
            sendButton: document.getElementById('sendButton'),
            messages: document.getElementById('messages'),
            loading: document.getElementById('loading'),
            status: document.getElementById('status'),
            charCount: document.getElementById('charCount'),
            toastContainer: document.getElementById('toast-container')
        };
    }

    // Attach event listeners
    attachEventListeners() {
        // Form submission
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Input events
        this.elements.input.addEventListener('input', () => this.updateCharCount());
        this.elements.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Auto-resize textarea
        this.elements.input.addEventListener('input', () => this.autoResizeTextarea());
        
        // Focus input on load
        window.addEventListener('load', () => this.elements.input.focus());
    }

    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.elements.input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input and update UI
        this.elements.input.value = '';
        this.updateCharCount();
        this.autoResizeTextarea();
        
        // Show loading and disable input
        this.setLoading(true);
        
        try {
            // Send message to API
            const response = await this.sendToAPI(message);
            
            // Add bot response
            if (response.reply) {
                this.addMessage(response.reply, 'bot');
            } else {
                this.addMessage("Désolé, je n'ai pas pu traiter votre message.", 'bot');
                this.showToast("Réponse vide du serveur", 'warning');
            }
            
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            this.addMessage("❌ Désolé, une erreur s'est produite. Vérifiez que Ollama est démarré.", 'bot');
            this.showToast(`Erreur: ${error.message}`, 'error');
        } finally {
            this.setLoading(false);
            this.elements.input.focus();
        }
    }

    // Send message to API
    async sendToAPI(message) {
        // Up to 2 attempts total with exponential backoff
        const attempts = 2;
        let lastError;
        for (let i = 0; i < attempts; i++) {
            const controller = new AbortController();
            // 120s timeout to allow first-load of model; UI still shows progress
            const timeoutId = setTimeout(() => controller.abort(), 120000);

            try {
                // Update loading hint for user on retries
                if (i > 0) this.showToast('Nouvelle tentative… (Ollama se réveille peut-être)', 'warning', 3000);

                const response = await fetch('/ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
                    throw new Error(errorData.error || `Erreur HTTP ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                clearTimeout(timeoutId);
                lastError = error;
                // Retry only on timeout or network errors
                const isTimeout = error.name === 'AbortError' || /timeout/i.test(error.message);
                const isNetwork = /NetworkError|Failed to fetch|network/i.test(error.message);
                if (i < attempts - 1 && (isTimeout || isNetwork)) {
                    // Exponential backoff: 1s, then 2s
                    const delay = (i + 1) * 1000;
                    await new Promise(r => setTimeout(r, delay));
                    continue;
                }
                if (error.name === 'AbortError') {
                    throw new Error('Timeout: La requête a pris trop de temps');
                }
                throw error;
            }
        }
        // If loop exits without return
        throw lastError || new Error('Erreur inconnue');
    }

    // Add message to chat
    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        // Format content (handle code blocks, etc.)
        contentDiv.innerHTML = this.formatMessage(content);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.elements.messages.appendChild(messageDiv);
        
        // Store in history
        this.messageHistory.push({ content, type, timestamp: new Date() });
        
        // Scroll to bottom with smooth animation
        this.scrollToBottom();
    }

    // Format message content
    formatMessage(content) {
        // Escape HTML first
        content = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        
        // Format code blocks (```code```)
        content = content.replace(/```([\\s\\S]*?)```/g, '<pre><code>$1</code></pre>');
        
        // Format inline code (`code`)
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Format bold text (**text**)
        content = content.replace(/\\*\\*([^*]+)\\*\\*/g, '<strong>$1</strong>');
        
        // Format italic text (*text*)
        content = content.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
        
        // Format line breaks
        content = content.replace(/\\n/g, '<br>');
        
        return `<p>${content}</p>`;
    }

    // Handle keyboard shortcuts
    handleKeyDown(e) {
        // Enter to send (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.isLoading && this.elements.input.value.trim()) {
                this.handleSubmit(e);
            }
        }
        
        // Escape to clear
        if (e.key === 'Escape') {
            this.elements.input.value = '';
            this.updateCharCount();
            this.autoResizeTextarea();
        }
    }

    // Auto-resize textarea
    autoResizeTextarea() {
        const textarea = this.elements.input;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    // Update character count
    updateCharCount() {
        const count = this.elements.input.value.length;
        this.elements.charCount.textContent = count;
        
        // Visual feedback for character limit
        if (count > 900) {
            this.elements.charCount.style.color = 'var(--error)';
        } else if (count > 800) {
            this.elements.charCount.style.color = 'var(--warning)';
        } else {
            this.elements.charCount.style.color = 'var(--text-muted)';
        }
    }

    // Set loading state
    setLoading(loading) {
        this.isLoading = loading;
        
        if (loading) {
            this.elements.loading.classList.add('show');
            this.elements.sendButton.disabled = true;
            this.elements.input.disabled = true;
        } else {
            this.elements.loading.classList.remove('show');
            this.elements.sendButton.disabled = false;
            this.elements.input.disabled = false;
        }
    }

    // Scroll to bottom of messages
    scrollToBottom() {
        setTimeout(() => {
            this.elements.messages.scrollTo({
                top: this.elements.messages.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    // Check server status
    async checkServerStatus() {
        try {
            const response = await fetch('/health');
            const data = await response.json();
            
            if (data.ok) {
                this.updateStatus('connected', 'Connecté - ' + data.model);
                this.showToast('Connexion établie avec Vision AI', 'success');
            } else {
                this.updateStatus('error', 'Erreur serveur');
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            this.updateStatus('error', 'Déconnecté');
            this.showToast('Impossible de se connecter au serveur', 'error');
        }
    }

    // Update connection status
    updateStatus(status, text) {
        this.elements.status.className = `status ${status}`;
        this.elements.status.querySelector('span:last-child').textContent = text;
    }

    // Show toast notification
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        this.elements.toastContainer.appendChild(toast);
        
        // Auto remove toast
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
        
        // Click to dismiss
        toast.addEventListener('click', () => {
            toast.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        });
    }

    // Clear chat history
    clearChat() {
        this.elements.messages.innerHTML = `
            <div class="message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>👋 Salut ! Je suis Vision, votre assistant IA. Comment puis-je vous aider aujourd'hui ?</p>
                </div>
            </div>
        `;
        this.messageHistory = [];
        this.showToast('Conversation effacée', 'info');
    }

    // Export chat history
    exportChat() {
        const chatData = {
            timestamp: new Date().toISOString(),
            messages: this.messageHistory
        };
        
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `vision-chat-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Chat exporté avec succès', 'success');
    }
}

// ===== UTILITY FUNCTIONS =====

// Format timestamp
function formatTime(date) {
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Detect if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to clear chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (window.chatApp) {
            window.chatApp.clearChat();
        }
    }
    
    // Ctrl/Cmd + E to export chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (window.chatApp && window.chatApp.messageHistory.length > 0) {
            window.chatApp.exportChat();
        }
    }
});

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new ChatApp();
    
    // Add version info to console
    console.log('%cVision AI Chat Interface', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%cVersion 1.0.0 | Built with ❤️', 'color: #b4bcd0; font-size: 12px;');
    console.log('%cKeyboard shortcuts:', 'color: #f59e0b; font-weight: bold;');
    console.log('%c- Ctrl+K: Clear chat', 'color: #10b981;');
    console.log('%c- Ctrl+E: Export chat', 'color: #10b981;');
    console.log('%c- Enter: Send message', 'color: #10b981;');
    console.log('%c- Shift+Enter: New line', 'color: #10b981;');
    console.log('%c- Escape: Clear input', 'color: #10b981;');
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Erreur JavaScript:', e.error);
    if (window.chatApp) {
        window.chatApp.showToast('Une erreur inattendue s\'est produite', 'error');
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejetée:', e.reason);
    if (window.chatApp) {
        window.chatApp.showToast('Erreur de connexion réseau', 'error');
    }
});

// ===== PWA SUPPORT (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Could register service worker here for offline support
        console.log('Service Worker support detected');
    });
}