# Installation Guide de Lyon Clean

## ⚡ Installation rapide

### 1. Prérequis
- PHP 7.4+ (avec curl activé)
- Node.js 16+ (pour les scripts utilitaires)
- Serveur web (Apache/Nginx/PHP built-in)

### 2. Configuration Directus
Le projet utilise **Directus Cloud** (déjà configuré) :
- URL : `https://guide-lyon-cms.directus.app`
- Credentials dans `config/.env.local`

### 3. Lancement local

#### Option A : PHP Built-in Server (recommandé pour dev)
```bash
cd guide-lyon-clean
php -S localhost:8000 -t .
```
Puis : http://localhost:8000/api/index.php

#### Option B : Apache/Nginx
1. Pointer le document root vers le dossier `guide-lyon-clean`
2. Configurer le rewrite pour `/api/` si nécessaire

### 4. Test de fonctionnement
```bash
# Test complet de l'intégration
php test-web-integration.php

# Ou via navigateur
http://localhost:8000/test-web-integration.php
```

### 5. Scripts Node.js (optionnel)
```bash
# Installer les dépendances Node (si besoin des scripts)
npm init -y
npm install https

# Tester Directus
node scripts/test-directus-final.js

# Importer plus de données
node scripts/import-to-directus.js
```

## 🔧 Configuration avancée

### Variables d'environnement
Éditer `config/.env.local` :
```bash
DIRECTUS_URL=https://guide-lyon-cms.directus.app
DIRECTUS_EMAIL=raphael.nuziere@gmail.com
DIRECTUS_PASSWORD=Azerty25!
```

### Personnalisation CSS
Modifier `css/style.css` pour changer l'apparence.

### Ajouter de nouvelles pages
1. Créer un nouveau fichier PHP dans `/api/`
2. Inclure `config.php` pour accéder à Directus
3. Utiliser `directusRequest()` pour récupérer les données

## 🚀 Déploiement production

### Hébergement web classique
1. Uploader tous les fichiers sauf `/scripts/` et `/docs/`
2. Configurer les variables d'environnement
3. Tester l'accès à Directus

### Sécurité
- Changer le mot de passe Directus en production
- Utiliser HTTPS
- Configurer les permissions Directus appropriées

---

📞 **Support** : Se référer à la documentation dans `/docs/`