#!/bin/bash
set -e

echo "🚀 Starting Guide de Lyon on Railway..."
echo "PHP Version: $(php -v | head -1)"
echo "Port: ${PORT:-8000}"
echo "Environment: ${APP_ENV:-production}"

# Vérifier que le dossier api existe
if [ ! -d "api" ]; then
    echo "❌ Error: api directory not found"
    exit 1
fi

# Démarrer le serveur PHP
echo "✅ Starting PHP server..."
exec php -S 0.0.0.0:${PORT:-8000} -t .