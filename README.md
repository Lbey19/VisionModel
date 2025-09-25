# 🤖 VisionModel - IA RAG System

## 📝 Description
Système d'IA conversationnelle basé sur RAG (Retrieval-Augmented Generation) utilisant Ollama pour traiter des documents de survie et fournir des réponses contextuelles précises.

## ✨ Fonctionnalités
- 🔍 **RAG System** : Recherche sémantique dans les documents
- 🤖 **IA Locale** : Utilise Ollama avec Gemma3:1b et Llama3.1:8b  
- 💬 **Interface Web** : Chat interactif simple et efficace
- 📚 **Base de connaissances** : Documents de survie spécialisés
- ⚡ **Réponses rapides** : Optimisé pour des réponses sous 60 secondes

## 🛠️ Technologies
- **Backend** : Node.js + Express
- **IA** : Ollama (Gemma3:1b, Llama3.1:8b, nomic-embed-text)
- **RAG** : Recherche vectorielle sémantique
- **Frontend** : HTML/CSS/JS vanilla
- **OS** : Compatible Windows/Linux/macOS

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [Ollama](https://ollama.ai/download)

### Installation rapide
```bash
# Cloner le projet
git clone https://github.com/Lbey19/VisionModel.git
cd VisionModel

# Installer les dépendances
npm install

# Installer les modèles IA
ollama pull gemma3:1b
ollama pull llama3.1:8b  
ollama pull nomic-embed-text

# Démarrer le serveur
npm start
# ou
.\start-server.bat  # Windows
```

### Accès
- **Interface Web** : http://localhost:3001
- **API Health** : http://localhost:3001/health
- **API Chat** : POST http://localhost:3001/ai

## 📖 Utilisation

### Interface Web
1. Ouvrir http://localhost:3001
2. Poser des questions sur la survie
3. Recevoir des réponses basées sur les documents

### Exemples de questions
- "Combien de litres d'eau par personne ?"
- "Comment purifier l'eau ?"
- "Quels canaux PMR446 utiliser ?"
- "Comment traiter une blessure ?"

### API
```javascript
// Exemple d'appel API
fetch('http://localhost:3001/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "Comment stocker l'eau ?" })
})
.then(r => r.json())
.then(data => console.log(data.reply));
```

## 📁 Structure du projet
```
VisionModel/
├── server.js              # Serveur principal
├── package.json           # Dépendances npm
├── rag.js                 # Module RAG 
├── rag.index.json         # Index vectoriel
├── start-server.bat       # Script de démarrage Windows
├── public/                # Interface web
│   ├── index.html
│   ├── style.css
│   └── script.js
├── docs/                  # Documents de base de connaissances
│   ├── eau_potable.md
│   ├── premiers_secours.txt
│   ├── communications_locales.md
│   ├── abris_froid_chaleur.md
│   ├── energie_lumiere.md
│   └── securite_discretion.md
└── DEPLOYMENT.md          # Guide de déploiement
```

## 🔧 Configuration

### Variables d'environnement
```env
PORT=3001
OLLAMA_URL=http://127.0.0.1:11434
MODEL=gemma3:1b
```

### Modèles IA disponibles
- **gemma3:1b** : Rapide, optimisé (par défaut)
- **llama3.1:8b** : Plus précis, plus lent
- **nomic-embed-text** : Embeddings pour la recherche

## 🛠️ Développement

### Ajouter des documents
1. Placer les fichiers dans `/docs/`
2. Relancer le serveur pour réindexation automatique

### Modifier les modèles
```javascript
// Dans server.js
const MODEL = "llama3.1:8b"; // Changer ici
```

## 📦 Déploiement

### Package portable
```bash
.\create-package.bat  # Crée VisionModel-Portable.zip
```

### Sur un nouveau PC
1. Copier les fichiers
2. Installer Node.js et Ollama  
3. Exécuter `.\install-new-pc.bat`

## 🤝 Contribution
1. Fork le projet
2. Créer une branche feature
3. Commit vos changes
4. Push et créer une Pull Request

## 📄 Licence
MIT License - Voir le fichier LICENSE

## 🆘 Support
- 📧 Issues GitHub pour les bugs
- 💬 Discussions pour les questions
- 📖 Consulter DEPLOYMENT.md pour l'installation

---
Développé avec ❤️ pour la communauté survivaliste