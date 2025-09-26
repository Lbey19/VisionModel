# 🚀 Déploiement VisionModel sur un autre PC

## Prérequis sur le nouveau PC

### 1. Installer Node.js
- Télécharger : https://nodejs.org/
- Version recommandée : LTS (v20+)

### 2. Installer Ollama
- Télécharger : https://ollama.ai/download
- Après installation, exécuter :
```bash
ollama pull llama3.1:8b
ollama pull gemma2:2b
ollama pull nomic-embed-text
```

## Méthode 1 : Git/GitHub (Recommandé)

### Étape 1 : Sur le PC actuel
```bash
# Initialiser Git
git init
git add .
git commit -m "Initial VisionModel commit"

# Créer un repo GitHub et pousser
git remote add origin https://github.com/VOTRE_USERNAME/vision-model.git
git push -u origin main
```

### Étape 2 : Sur le nouveau PC
```bash
# Cloner le projet
git clone https://github.com/VOTRE_USERNAME/vision-model.git
cd vision-model

# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

## Méthode 2 : Copie directe

### Fichiers essentiels à copier :
```
VisionModel1/
├── server.js          # Serveur principal
├── package.json       # Dépendances
├── start-server.bat   # Script de démarrage
├── public/            # Interface web
├── docs/              # Documents RAG
├── rag.js             # Module RAG
└── rag.index.json     # Index des documents
```

### Étapes sur le nouveau PC :
1. Créer dossier `VisionModel1`
2. Copier tous les fichiers
3. Ouvrir PowerShell dans le dossier
4. Exécuter : `npm install`
5. Démarrer : `.\start-server.bat`

## Méthode 3 : Package complet

### Créer un package zip avec script d'installation
```bash
# Sur PC actuel - créer package
npm pack

# Inclure dans le zip :
# - Tous les fichiers du projet
# - Script d'installation automatique
# - Documentation de déploiement
```

## Configuration post-déploiement

### 1. Vérifier Ollama
```bash
curl http://localhost:11434/api/tags
```

### 2. Tester l'application
```bash
curl http://localhost:3001/health
```

### 3. Interface web
Accéder à : http://localhost:3001

## Dépannage courant

### Problème : Port 3001 occupé
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [PID_NUMBER] /F
```

### Problème : Ollama non accessible
```bash
# Vérifier le service Ollama
ollama serve
```

### Problème : Modules manquants
```bash
# Réinstaller les dépendances
npm install --force
```

## Variables d'environnement

Créer `.env` si nécessaire :
```
OLLAMA_URL=http://127.0.0.1:11434
PORT=3001
MODEL=gemma2:2b
```

## Sécurité

- Ne pas exposer sur Internet sans authentification
- Utiliser un firewall local
- Vérifier les ports ouverts

## Support

En cas de problème :
1. Vérifier les logs dans la console
2. Tester Ollama séparément
3. Vérifier la connectivité réseau local