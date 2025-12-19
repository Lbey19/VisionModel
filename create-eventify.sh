#!/bin/bash

# Eventify Repository Setup Script
# This script automates the creation of a private eventify repository

set -e  # Exit on error

echo "🎉 Eventify Repository Setup"
echo "=============================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed!"
    echo "Please install it from: https://cli.github.com/"
    echo ""
    echo "Installation commands:"
    echo "  macOS:   brew install gh"
    echo "  Windows: winget install --id GitHub.cli"
    echo "  Linux:   sudo apt install gh  (or use your package manager)"
    exit 1
fi

echo "✅ GitHub CLI is installed"

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "🔐 Not authenticated with GitHub. Please login..."
    gh auth login
fi

echo "✅ Authenticated with GitHub"
echo ""

# Get username
GITHUB_USER=$(gh api user --jq '.login')
echo "👤 GitHub Username: $GITHUB_USER"
echo ""

# Ask for confirmation
read -p "📋 Create private repository 'eventify'? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled"
    exit 0
fi

echo ""
echo "🚀 Creating private repository 'eventify'..."

# Create repository
gh repo create eventify \
    --private \
    --description "Event management and planning platform" \
    --clone

if [ $? -eq 0 ]; then
    echo "✅ Repository created successfully!"
else
    echo "❌ Failed to create repository"
    exit 1
fi

echo ""
echo "📁 Setting up project structure..."
cd eventify

# Get the path to the template directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
TEMPLATE_DIR="$SCRIPT_DIR/eventify-template"

if [ -d "$TEMPLATE_DIR" ]; then
    echo "📋 Copying template files..."
    
    # Copy all files
    cp -r "$TEMPLATE_DIR"/* .
    
    # Copy hidden files
    if [ -f "$TEMPLATE_DIR/.gitignore" ]; then
        cp "$TEMPLATE_DIR/.gitignore" .
    fi
    
    if [ -f "$TEMPLATE_DIR/.env.example" ]; then
        cp "$TEMPLATE_DIR/.env.example" .
    fi
    
    echo "✅ Template files copied"
else
    echo "⚠️  Template directory not found at: $TEMPLATE_DIR"
    echo "Creating basic structure manually..."
    
    mkdir -p src
    
    # Create basic package.json
    cat > package.json << 'EOF'
{
  "name": "eventify",
  "version": "1.0.0",
  "description": "Event management platform",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  },
  "private": true
}
EOF
    
    echo "✅ Basic structure created"
fi

echo ""
echo "📝 Committing changes..."
git add .
git commit -m "Initial commit: Setup eventify project structure"

echo ""
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Setup complete!"
echo ""
echo "📍 Repository: https://github.com/$GITHUB_USER/eventify"
echo ""
echo "🎯 Next steps:"
echo "   1. cd eventify"
echo "   2. npm install"
echo "   3. cp .env.example .env  (and configure)"
echo "   4. npm start"
echo ""
echo "🌐 Open repository in browser:"
echo "   gh repo view --web"
echo ""
echo "Happy coding! 🎉"
