# 🤖 VisionModel - Assistant IA de Survie & Préparation

## 📝 Description
**VisionModel** est un système d'intelligence artificielle conversationnelle spécialisé dans la **survie**, la **préparation d'urgence** et la **gestion de crise communautaire**. Basé sur la technologie RAG (Retrieval-Augmented Generation), il combine une base de connaissances documentaires étendue avec des modèles IA locaux Ollama pour fournir des réponses précises et contextuelles.

## ✨ Fonctionnalités Principales

### 🎯 Système RAG Avancé
- **Recherche sémantique** intelligente dans 15+ documents spécialisés
- **Classification automatique** : mode "survie" vs mode "général"
- **Sources citées** : traçabilité complète des informations
- **Index vectoriel** optimisé avec nomic-embed-text

### 🤖 IA Locale Puissante
- **Gemma2:2b** : Modèle principal, réponses rapides et précises
- **Llama3.1:8b** : Modèle alternatif pour analyses complexes
- **Nomic-embed-text** : Embeddings haute qualité pour la recherche
- **Fonctionnement hors-ligne** : aucune dépendance cloud

### 💬 Interface Utilisateur
- **Chat web interactif** : interface moderne et responsive
- **API REST complète** : intégration facile dans d'autres applications
- **Format structuré** : réponses organisées avec actions immédiates et plans
- **Affichage des sources** : transparence sur l'origine des informations

### 📚 Base de Connaissances Étendue (15 Documents)
- **Alimentation** : conservation, stockage, rotation des vivres
- **Eau potable** : purification, stockage, techniques d'urgence
- **Premiers secours** : soins de base, procédures d'urgence
- **Communications** : PMR446, protocoles radio, signalisation
- **Énergie** : solutions alternatives, éclairage, batteries
- **Abris** : protection thermique, isolation, ventilation
- **Hygiène** : assainissement, déchets, prévention maladies  
- **Sécurité** : surveillance périmètre, procédures d'alerte
- **Organisation** : gestion de groupe, résolution conflits
- **Psychologie** : gestion stress, soutien moral, cohésion
- **Réparations** : maintenance, récupération, outils
- **Navigation** : orientation, signalisation secours
- **Évacuation** : procédures d'urgence, codes d'alerte

## 🛠️ Stack Technique Moderne
- **Backend** : Node.js 18+ + Express.js (architecture modulaire)
- **IA Locale** : Ollama (gemma2:2b, llama3.1:8b, nomic-embed-text)
- **RAG System** : Recherche vectorielle cosinus + cache intelligent
- **Frontend** : HTML5/CSS3/ES6+ vanilla (0 dépendance)
- **Base données** : JSON vectoriel optimisé
- **Plateforme** : Windows/Linux/macOS (scripts d'installation inclus)

## 🚀 Installation & Configuration

### Prérequis Système
- **Node.js** v18+ ([télécharger](https://nodejs.org/))
- **Ollama** ([télécharger](https://ollama.ai/download))
- **Git** ([télécharger](https://git-scm.com/downloads))
- **Espace disque** : ~8GB pour les modèles IA

### 🔧 Installation Automatique (Windows)
```powershell
# Cloner le projet
git clone https://github.com/Lbey19/VisionModel.git
cd VisionModel

# Installation complète automatique
.\install-new-pc.bat
```

### 🐧 Installation Manuelle (Tous OS)
```bash
# 1. Cloner le projet
git clone https://github.com/Lbey19/VisionModel.git
cd VisionModel

# 2. Installer les dépendances Node.js
npm install

# 3. Configurer l'environnement (Windows uniquement)
.\setup-environment.ps1

# 4. Télécharger les modèles IA (patient, ~6GB)
ollama pull gemma2:2b
ollama pull llama3.1:8b
ollama pull nomic-embed-text

# 5. Construire l'index RAG
npm run ingest

# 6. Démarrer le serveur
npm start
# OU sur Windows :
.\start-server.bat
```

### 🌐 Points d'Accès
- **Interface Chat** : http://localhost:3001
- **API Santé** : GET http://localhost:3001/api/health  
- **API Chat** : POST http://localhost:3001/api/chat
- **Fichiers statiques** : http://localhost:3001/public/

## 📖 Guide d'Utilisation

### 🖥️ Interface Web
1. **Accès** : Ouvrir http://localhost:3001
2. **Chat** : Poser vos questions dans la zone de saisie
3. **Réponses structurées** : Format survie avec actions immédiates et sources
4. **Sources visibles** : Cliquer sur les sources pour voir les documents utilisés

### 🎯 Exemples de Questions par Catégorie

**💧 Eau & Alimentation**
- "Comment purifier de l'eau trouble avec de la javel ?"
- "Combien de gouttes de javel par litre d'eau ?"  
- "Techniques de conservation alimentaire sans frigo ?"

**🏠 Abri & Énergie**
- "Comment chauffer une pièce sans électricité ?"
- "Solutions d'éclairage d'urgence avec batteries ?"
- "Isolation thermique avec matériaux de récupération ?"

**📡 Communication & Sécurité**
- "Quels canaux PMR446 recommandés pour l'urgence ?"
- "Comment organiser la surveillance d'un périmètre ?"
- "Procédures d'évacuation et codes d'alerte ?"

**🩹 Santé & Hygiène**
- "Comment traiter une brûlure en urgence ?"
- "Désinfection d'urgence sans produits chimiques ?"
- "Gestion du stress en situation de crise ?"

### 🔌 API REST Complète

#### Vérification du Statut
```bash
curl http://localhost:3001/api/health
```

#### Chat avec l'IA
```javascript
// JavaScript/Node.js
const response = await fetch('http://localhost:3001/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: "Comment organiser une équipe de survie ?" 
  })
});

const data = await response.json();
console.log('Réponse:', data.reply);
console.log('Sources:', data.sources);
console.log('Mode:', data.mode); // "survival" ou "general"
```

```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/chat" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"message":"Comment stocker de l eau potable?"}'
```

### 📊 Réponse API Format
```json
{
  "reply": "# Évaluation rapide\n...",
  "sources": ["eau_potable.md", "hygiene_assainissement.md"],
  "modelUsed": "gemma2:2b",
  "mode": "survival"
}
```

## 📁 Architecture du Projet

```
VisionModel/
├── 🌐 Backend & API
│   ├── server.js                    # Serveur Express principal
│   ├── api.js                       # Routes API (/health, /chat)
│   ├── rag.js                       # Moteur de recherche RAG
│   └── ingest.js                    # Construction index vectoriel
│
├── 📊 Base de Données  
│   ├── rag.index.json               # Index vectoriel (15 docs)
│   └── context/community.json       # Profil communauté
│
├── 🎨 Interface Utilisateur
│   └── public/
│       ├── index.html               # Interface chat
│       ├── script.js                # Logique frontend
│       └── styles.css               # Styles modernes
│
├── 📚 Base de Connaissances (15 docs)
│   └── docs/
│       ├── 💧 eau_potable.md
│       ├── 🩹 premiers_secours.txt
│       ├── 📡 communications_locales.md
│       ├── 🏠 abris_froid_chaleur.md
│       ├── ⚡ energie_lumiere.md
│       ├── 🔒 securite_discretion.md
│       ├── 🍽️ alimentation_conservation.md
│       ├── 🔥 chauffage_ventilation.md
│       ├── 🧼 hygiene_assainissement.md
│       ├── 🧭 navigation_orientation.md
│       ├── 👥 organisation_communautaire.md
│       ├── 🧠 psychologie_gestion_stress.md
│       ├── 🔧 reparations_maintenance.md
│       ├── 🛡️ securite_perimetres.md
│       └── 🚨 signalisation_evacuation.md
│
├── 🛠️ Scripts & Outils
│   ├── start-server.bat            # Démarrage Windows
│   ├── setup-environment.ps1       # Config PATH Ollama
│   ├── install-new-pc.bat          # Installation complète
│   └── create-package.bat          # Package portable
│
├── 📝 Configuration
│   ├── package.json                # Dépendances npm
│   ├── .gitignore                  # Exclusions Git
│   └── DEPLOYMENT.md               # Guide déploiement
│
└── 🤖 Modèles IA (local)
    └── ollama-windows-amd64.exe    # Exécutable Ollama
```

## ⚙️ Configuration Avancée

### Variables d'Environnement
```bash
# Configuration serveur
PORT=3001                           # Port d'écoute
OLLAMA_URL=http://127.0.0.1:11434   # URL Ollama local

# Modèles IA utilisés
LLM_MODEL=gemma2:2b                 # Modèle principal (réponses)
EMBED_MODEL=nomic-embed-text        # Modèle embeddings (recherche)
```

### 🤖 Modèles IA Supportés

| Modèle | Taille | Usage | Performance | RAM |
|--------|--------|-------|-------------|-----|
| **gemma2:2b** | ~1.6GB | Principal (défaut) | Rapide, précis | 4GB+ |
| **llama3.1:8b** | ~4.7GB | Alternatif précis | Lent, très précis | 8GB+ |
| **nomic-embed-text** | ~274MB | Embeddings RAG | Recherche | 2GB+ |

### 🎛️ Modes de Fonctionnement

**Mode Survie** (détection automatique)
- Mots-clés : survie, eau, javel, PMR446, premiers secours, etc.
- Format structuré : Évaluation → Actions → Plan → Matériel → Vigilance
- Sources RAG prioritaires

**Mode Général**  
- Questions encyclopédiques, culture, définitions
- Format libre, pas de structure survie
- Connaissances internes du modèle

## � Développement & Extension

### 📄 Ajouter des Documents
```bash
# 1. Créer le document (formats supportés)
echo "# Mon Guide" > docs/nouveau_guide.md     # Markdown
echo "Contenu texte" > docs/guide.txt          # Texte brut
# Formats : .md, .txt, .docx (PDF via conversion)

# 2. Reconstruire l'index RAG
npm run ingest
# OU
node ingest.js

# 3. Redémarrer le serveur
npm start
```

### 🔄 Changer le Modèle IA
```bash
# Option 1 : Variable d'environnement
set LLM_MODEL=llama3.1:8b
npm start

# Option 2 : Modifier start-server.bat
# set LLM_MODEL=llama3.1:8b

# Option 3 : Modifier api.js
# const MODEL = process.env.LLM_MODEL || "llama3.1:8b";
```

### 📊 Scripts NPM Disponibles
```bash
npm start        # Démarrer le serveur
npm run ingest   # Reconstruire l'index RAG
```

## 📦 Déploiement & Distribution

### 📀 Package Portable Windows
```batch
# Créer un package ZIP autonome
.\create-package.bat
# → Génère VisionModel-Portable.zip
```

### 🖥️ Installation sur Nouveau PC
```batch
# Installation automatique complète
.\install-new-pc.bat
# Installe : Node.js + Ollama + Dépendances + Modèles
```

### 🐳 Docker (Bientôt)
```bash
# Build de l'image (en développement)
docker build -t visionmodel .
docker run -p 3001:3001 visionmodel
```

### ☁️ Déploiement Cloud
- **Heroku** : Voir `DEPLOYMENT.md`
- **VPS/Serveur** : Node.js + reverse proxy nginx
- **⚠️ Limitation** : Nécessite Ollama installé sur le serveur

## 🛠️ Maintenance & Dépannage

### 🩺 Diagnostic Rapide
```bash
# Vérifier Ollama
ollama list

# Vérifier Node.js
node --version
npm --version

# Tester l'API
curl http://localhost:3001/api/health
```

### 🚨 Problèmes Courants

| Problème | Cause | Solution |
|----------|-------|----------|
| "Ollama not found" | PATH incorrect | `.\setup-environment.ps1` |
| "Port 3001 in use" | Serveur déjà lancé | `Get-Process node \| Stop-Process` |
| "No response from model" | Modèle non téléchargé | `ollama pull gemma2:2b` |
| "RAG index empty" | Documents non indexés | `npm run ingest` |

## 📊 Statistiques du Projet

- **📚 Base de connaissances** : 15 documents spécialisés
- **🔍 Index RAG** : ~15 chunks vectoriels
- **🤖 Modèles IA** : 3 modèles (6,5GB total)
- **💻 Code source** : ~800 lignes (JS/HTML/CSS)
- **📝 Documentation** : 5 fichiers guides
- **🛠️ Scripts** : 6 outils d'installation/maintenance

## 🤝 Contribution & Communauté

### 🌟 Contribuer au Projet
1. **Fork** le repository
2. **Clone** votre fork : `git clone https://github.com/VotreUsername/VisionModel.git`
3. **Créer** une branche : `git checkout -b feature/nouvelle-fonctionnalité`
4. **Développer** et tester vos modifications
5. **Commit** : `git commit -m "✨ Ajout nouvelle fonctionnalité"`
6. **Push** : `git push origin feature/nouvelle-fonctionnalité`
7. **Pull Request** vers la branche `main`

### 📋 Types de Contributions Recherchées
- **📚 Nouveaux documents** de survie/préparation
- **🌍 Traductions** (anglais, espagnol, etc.)
- **🎨 Améliorations UI/UX** de l'interface
- **⚡ Optimisations** performance RAG
- **🐛 Corrections** de bugs
- **📖 Documentation** supplémentaire

### 💬 Communauté
- **🐛 Issues** : [GitHub Issues](https://github.com/Lbey19/VisionModel/issues)
- **💡 Discussions** : [GitHub Discussions](https://github.com/Lbey19/VisionModel/discussions) 
- **📧 Contact** : Via GitHub ou Issues

## 📄 Licence & Légal

**Licence MIT** - Utilisation libre pour projets personnels et commerciaux

### ⚠️ Avertissements Importants
- **🩺 Médical** : Informations à titre éducatif uniquement, consulter un professionnel
- **⚖️ Légal** : Respecter les lois locales (radio, sécurité, etc.)
- **🛡️ Sécurité** : Tester les techniques en environnement sûr
- **🤖 IA** : Les réponses peuvent contenir des erreurs, toujours vérifier

## 🆘 Support & Documentation

- **� Guide complet** : `DEPLOYMENT.md`
- **🛠️ Installation** : Scripts automatiques inclus
- **🐛 Problèmes** : GitHub Issues avec logs détaillés
- **💬 Questions** : GitHub Discussions pour l'aide communautaire

---

## 🎯 Roadmap Futur

- [ ] � **Containerisation Docker**
- [ ] 🌍 **Interface multilingue** 
- [ ] 📱 **Application mobile** (PWA)
- [ ] 🔊 **Synthèse vocale** des réponses
- [ ] 📸 **Analyse d'images** (blessures, plantes, etc.)
- [ ] 🗺️ **Cartes hors-ligne** intégrées
- [ ] 📡 **Mode déconnecté** complet

---

**Développé avec ❤️ pour la communauté de préparation et survie**  
*Un projet open-source pour l'autonomie et la résilience communautaire*