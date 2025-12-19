# 🔧 GitHub CLI Quick Reference for Eventify Repository

This guide provides quick commands for creating and managing your eventify repository using GitHub CLI.

## 📦 Installation

### Windows
```powershell
winget install --id GitHub.cli
```

### macOS
```bash
brew install gh
```

### Linux
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora/CentOS
sudo dnf install gh
```

## 🔐 Authentication

First, authenticate with GitHub:
```bash
gh auth login
```

Follow the prompts to authenticate via web browser or token.

## 🚀 Create Eventify Repository

### Create a Private Repository
```bash
# Basic creation
gh repo create eventify --private --description "Event management platform"

# Create with README and clone
gh repo create eventify --private --description "Event management platform" --readme --clone

# Create with specific .gitignore template
gh repo create eventify --private --gitignore Node --license mit --clone
```

### Available .gitignore Templates
```bash
gh repo create eventify --private --gitignore Node      # For Node.js projects
gh repo create eventify --private --gitignore Python    # For Python projects
gh repo create eventify --private --gitignore Java      # For Java projects
```

## 📋 Repository Management Commands

### View Repository Info
```bash
gh repo view YOUR-USERNAME/eventify
```

### Change Visibility
```bash
# Make repository private
gh repo edit YOUR-USERNAME/eventify --visibility private

# Make repository public
gh repo edit YOUR-USERNAME/eventify --visibility public
```

### Clone Repository
```bash
gh repo clone YOUR-USERNAME/eventify
```

### Add Collaborators
```bash
gh repo add-collaborator YOUR-USERNAME/eventify --username COLLABORATOR-USERNAME
```

### List Repositories
```bash
gh repo list
gh repo list --private    # Only private repos
```

## 🔄 Complete Workflow Example

```bash
# 1. Create private repository with README
gh repo create eventify --private --description "Event management platform" --readme

# 2. Clone the repository
gh repo clone YOUR-USERNAME/eventify

# 3. Navigate to directory
cd eventify

# 4. Copy template files (if you have them)
cp -r ../VisionModel/eventify-template/* .

# 5. Initialize git (if needed)
git add .
git commit -m "Initial commit: Setup eventify project structure"
git push origin main

# 6. View the repository in browser
gh repo view --web
```

## 📊 Additional Useful Commands

### Create Issues
```bash
gh issue create --title "Setup database schema" --body "Need to design database structure"
```

### Create Pull Requests
```bash
gh pr create --title "Add user authentication" --body "Implements user login/signup"
```

### View Repository Status
```bash
gh repo view --web          # Open in browser
gh issue list               # List all issues
gh pr list                  # List all pull requests
```

### Repository Settings
```bash
# Enable/disable features
gh repo edit YOUR-USERNAME/eventify --enable-issues
gh repo edit YOUR-USERNAME/eventify --enable-wiki
gh repo edit YOUR-USERNAME/eventify --enable-projects

# Update description
gh repo edit YOUR-USERNAME/eventify --description "New description"
```

## 🔒 Security & Privacy

### Make Repository Private
```bash
gh repo edit YOUR-USERNAME/eventify --visibility private
```

### Archive Repository
```bash
gh repo archive YOUR-USERNAME/eventify
```

### Delete Repository (Use with caution!)
```bash
gh repo delete YOUR-USERNAME/eventify
```

## 📚 Get Help

```bash
gh help                      # General help
gh repo create --help        # Help for creating repos
gh auth status              # Check authentication status
```

## 🔗 Useful Links

- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [GitHub CLI Repository](https://github.com/cli/cli)
- [GitHub Docs](https://docs.github.com/)

---

**Pro Tip**: Use `gh alias` to create shortcuts for frequently used commands!

```bash
# Create alias for creating private repos
gh alias set create-private 'repo create --private --clone'

# Use it
gh create-private my-new-project
```
