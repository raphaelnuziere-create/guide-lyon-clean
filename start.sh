#!/bin/bash
echo "🚀 Starting Guide de Lyon on Railway..."
echo "Port: $PORT"
echo "Environment: $APP_ENV"

# Démarrer le serveur PHP
php -S 0.0.0.0:${PORT:-8000} -t .