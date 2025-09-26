# 🛡️ VisionModel - IA de Survie Locale

> *Assistant IA spécialisé survie/préparation avec RAG local (15 docs) - Fonctionne hors-ligne*

## 🚀 Installation Rapide

### Prérequis
- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.ai/download)

### Windows (Auto)
```bat
git clone https://github.com/Lbey19/VisionModel.git
cd VisionModel
.\install-new-pc.bat
```

### Manuel (Tous OS)
```bash
git clone https://github.com/Lbey19/VisionModel.git
cd VisionModel
npm install
ollama pull gemma2:2b
ollama pull llama3.1:8b  
ollama pull nomic-embed-text
npm run ingest
npm start
```

## 🖥️ Utilisation

**Interface Web** : http://localhost:3001  
**API Health** : `GET http://localhost:3001/api/health`  
**API Chat** : `POST http://localhost:3001/api/chat`

### Exemples Questions
- *"Comment purifier de l'eau avec de la javel ?"*
- *"Procédures d'évacuation d'urgence ?"*
- *"Organiser la surveillance d'un périmètre ?"*
- *"Traitement brûlure sans médecin ?"*

## 🤖 Modèles IA

| Modèle | Usage | Taille |
|--------|-------|--------|
| gemma2:2b | Principal (rapide) | 1.6GB |
| llama3.1:8b | Backup (précis) | 4.9GB |
| nomic-embed-text | Recherche RAG | 274MB |

## 📚 Base de Connaissances (15 Documents)

- 💧 Eau potable & purification
- 🩹 Premiers secours
- 🍽️ Alimentation & conservation  
- 📡 Communications PMR446
- ⚡ Énergie & éclairage
- 🏠 Abris & chauffage
- 🧼 Hygiène & assainissement
- 🛡️ Sécurité périmètre
- 👥 Organisation communautaire
- 🧠 Psychologie de crise
- 🔧 Réparations & maintenance
- 🧭 Navigation & orientation
- 🚨 Signalisation & évacuation

## 🔧 Scripts Utiles

```bash
npm start                # Démarrer serveur
npm run ingest          # Reconstruire index RAG
.\start-server.bat      # Windows rapide
.\setup-environment.ps1 # Config PATH Ollama
```

## 🛠️ Dépannage Rapide

| Problème | Solution |
|----------|----------|
| "Ollama not found" | `.\setup-environment.ps1` |
| "Port 3001 in use" | `Get-Process node \| Stop-Process` |
| "No model" | `ollama pull gemma2:2b` |
| "Empty RAG" | `npm run ingest` |

---

**Développé pour la résilience communautaire** - *Un projet open-source contre l'oubli*
