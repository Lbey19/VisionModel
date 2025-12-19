# 🚀 Quick Start: Creating Your Eventify Repository

Follow these simple steps to create your private "eventify" repository.

## ⚡ Fastest Method (Using GitHub CLI)

**Prerequisites**: Install [GitHub CLI](https://cli.github.com/)

```bash
# 1. Authenticate (first time only)
gh auth login

# 2. Create private repository and clone it
gh repo create eventify --private --description "Event management platform" --clone

# 3. Navigate to the repository
cd eventify

# 4. Copy the template files from this repository
# (Adjust the path to where you have this VisionModel repo cloned)
cp -r ../VisionModel/eventify-template/* .
cp ../VisionModel/eventify-template/.gitignore .
cp ../VisionModel/eventify-template/.env.example .

# 5. Initialize and push
git add .
git commit -m "Initial commit: Setup eventify project"
git push origin main

# 6. Open repository in browser
gh repo view --web
```

**Done! Your private eventify repository is ready! 🎉**

---

## 🌐 Alternative: Using GitHub Web Interface

### Step 1: Create Repository
1. Go to [github.com/new](https://github.com/new)
2. Enter repository name: `eventify`
3. Select **"Private"** visibility ✅
4. Check "Add a README file"
5. Click **"Create repository"**

### Step 2: Clone and Setup
```bash
# Clone your new repository
git clone https://github.com/YOUR-USERNAME/eventify.git
cd eventify

# Copy template files (adjust path as needed)
cp -r ../VisionModel/eventify-template/* .
cp ../VisionModel/eventify-template/.gitignore .
cp ../VisionModel/eventify-template/.env.example .

# Commit and push
git add .
git commit -m "Initial commit: Setup eventify project"
git push origin main
```

---

## 📦 What's Included in the Template

Your eventify repository will include:

- ✅ **README.md** - Project documentation
- ✅ **package.json** - Node.js project configuration
- ✅ **.gitignore** - Ignore unnecessary files
- ✅ **.env.example** - Environment variables template
- ✅ **src/index.js** - Basic Express server

---

## 🔧 Next Steps After Setup

1. **Install dependencies**:
   ```bash
   cd eventify
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Open http://localhost:3000
   - API Health: http://localhost:3000/api/health

---

## 🔒 Repository Privacy

Your repository is **PRIVATE** by default, which means:
- ✅ Only you can see it
- ✅ You control who has access
- ✅ Not visible in search results
- ✅ Code is not publicly accessible

### Add Collaborators (Optional)
```bash
gh repo add-collaborator YOUR-USERNAME/eventify --username COLLABORATOR
```

Or via web:
1. Go to repository Settings
2. Click "Collaborators"
3. Add people by username/email

---

## 📚 Additional Resources

- [EVENTIFY_SETUP_GUIDE.md](./EVENTIFY_SETUP_GUIDE.md) - Comprehensive setup guide
- [GITHUB_CLI_COMMANDS.md](./GITHUB_CLI_COMMANDS.md) - GitHub CLI reference
- [eventify-template/](./eventify-template/) - Project template files

---

## ❓ Need Help?

### Common Issues

**"gh: command not found"**
- Install GitHub CLI: https://cli.github.com/

**"authentication required"**
```bash
gh auth login
```

**"repository already exists"**
- Choose a different name or delete the existing one

**"permission denied"**
- Check your GitHub authentication
- Ensure you have repository creation permissions

---

## 🎯 Summary

```bash
# The complete workflow in one go:
gh auth login
gh repo create eventify --private --clone
cd eventify
# Copy template files here
git add .
git commit -m "Initial commit"
git push
```

**That's it! Happy coding! 🎉**
