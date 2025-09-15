#!/bin/bash

# Script de déploiement automatique - Guide de Lyon
echo "🚀 Déploiement Guide de Lyon..."

# 1. Vérification des prérequis
echo "📋 Vérification des prérequis..."

if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé"
    exit 1
fi

if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI non installé, installation via Homebrew..."
    brew install gh
fi

# 2. Initialisation du repo Git
echo "📁 Initialisation du repository Git..."

if [ ! -d ".git" ]; then
    git init
    echo "✅ Repository Git initialisé"
else
    echo "✅ Repository Git déjà existant"
fi

# 3. Création du .gitignore
echo "📝 Création du .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
/vendor/
/node_modules/

# Environment files
.env
.env.local
.env.development
*.env

# Logs
*.log
/logs/

# Cache
/cache/
/tmp/

# OS Files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Backups
*.backup
*.bak

# Upload directories
/uploads/
/files/

# Test files
/tests/coverage/
phpunit.xml
EOF

# 4. Configuration Git
echo "🔧 Configuration Git..."
git config --global init.defaultBranch main 2>/dev/null || true

# 5. Ajout des fichiers
echo "📦 Ajout des fichiers au repository..."
git add .
git commit -m "🎉 Initial commit - Guide de Lyon Clean

✅ Features:
- PHP website with Directus CMS
- Real-time search functionality
- Advanced filters for directory
- Contact and business forms
- Clean URLs with .htaccess
- Responsive design
- SEO optimized

🚀 Ready for production deployment"

# 6. Création du repository GitHub
echo "🌐 Création du repository GitHub..."

# Vérification de l'authentification GitHub
if ! gh auth status &> /dev/null; then
    echo "🔐 Authentification GitHub requise..."
    gh auth login
fi

# Création du repository
REPO_NAME="guide-lyon-clean"
gh repo create $REPO_NAME --public --description "Guide de Lyon - Site web PHP avec Directus CMS" --clone=false

# Ajout du remote
git remote add origin https://github.com/$(gh api user --jq .login)/$REPO_NAME.git

# Push initial
git branch -M main
git push -u origin main

echo "✅ Repository GitHub créé et synchronisé"

# 7. Instructions pour Railway
echo ""
echo "🚂 Instructions pour déployer sur Railway:"
echo ""
echo "1. Va sur https://railway.app"
echo "2. Connecte-toi avec ton compte GitHub"
echo "3. Clique sur 'New Project'"
echo "4. Sélectionne 'Deploy from GitHub repo'"
echo "5. Choisis le repo 'guide-lyon-clean'"
echo "6. Railway détectera automatiquement PHP"
echo "7. Le site sera disponible sur une URL comme: https://guide-lyon-clean.up.railway.app"
echo ""
echo "🎯 Variables d'environnement à ajouter dans Railway:"
echo "- APP_ENV=production"
echo "- DIRECTUS_URL=https://guide-lyon-cms.directus.app"
echo "- DIRECTUS_EMAIL=raphael.nuziere@gmail.com"
echo "- DIRECTUS_PASSWORD=Azerty25!"
echo ""
echo "✅ Déploiement préparé avec succès!"
echo "🌐 Repository: https://github.com/$(gh api user --jq .login)/$REPO_NAME"