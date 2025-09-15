# Guide de Lyon - Version PHP Clean

## 🎯 Projet
**Guide de Lyon** est un annuaire local et gestionnaire d'événements pour la ville de Lyon, utilisant PHP + Directus Cloud.

## 🏗️ Architecture
- **Frontend** : PHP + CSS 
- **Backend** : Directus Cloud CMS
- **Base de données** : Directus (PostgreSQL)
- **API** : Directus REST API

## 📁 Structure du projet

```
guide-lyon-clean/
├── api/                    # Pages PHP principales
│   ├── config.php         # Configuration Directus
│   ├── index.php          # Page d'accueil
│   ├── evenements.php     # Page événements
│   ├── annuaire.php       # Annuaire entreprises
│   ├── entreprise.php     # Page entreprise individuelle
│   ├── tarifs.php         # Page tarifs
│   └── debug-directus.php # Page de debug
├── css/                   # Styles CSS
│   └── style.css
├── scripts/               # Scripts Node.js utilitaires
│   ├── import-to-directus.js      # Import de données
│   ├── test-directus-final.js     # Tests d'intégration
│   └── check-establishments.js    # Vérification données
├── config/                # Configuration
│   ├── .env.local         # Variables d'environnement
│   └── .env.local.example # Exemple de configuration
├── docs/                  # Documentation
│   ├── DIRECTUS_SETUP.md  # Guide de configuration
│   └── *.md              # Autres guides
└── test-web-integration.php # Test complet
```

## ⚙️ Configuration

### Directus Cloud
- **URL** : https://guide-lyon-cms.directus.app
- **Email** : raphael.nuziere@gmail.com
- **Password** : Azerty25!

### Collections Directus
- `articles` - Articles du blog
- `entreprises` - Annuaire des entreprises
- `evenements` - Événements à Lyon
- `categories_entreprises` - Catégories
- `establishments` - Établissements existants

## 🚀 Démarrage rapide

### 1. Configuration
```bash
# Copier la configuration
cp config/.env.local.example config/.env.local
# Éditer avec vos vraies clés API
```

### 2. Test de l'intégration
```bash
# Tester la connexion Directus
php test-web-integration.php
```

### 3. Import de données (optionnel)
```bash
# Installer Node.js si nécessaire, puis :
node scripts/import-to-directus.js
```

### 4. Serveur local
```bash
# Avec PHP built-in server
php -S localhost:8000 -t .

# Puis ouvrir : http://localhost:8000/api/index.php
```

## 📊 Pages disponibles

- **Accueil** : `/api/index.php`
- **Événements** : `/api/evenements.php`
- **Annuaire** : `/api/annuaire.php`
- **Tarifs** : `/api/tarifs.php`
- **Debug** : `/api/debug-directus.php`
- **Test** : `/test-web-integration.php`

## 🔧 Développement

### Ajouter de nouvelles données
```bash
node scripts/import-to-directus.js
```

### Tester la connexion
```bash
node scripts/test-directus-final.js
```

### Vérifier les établissements
```bash
node scripts/check-establishments.js
```

## 📝 Prochaines étapes

1. **Design** : Améliorer le CSS responsive
2. **Fonctionnalités** : Ajouter la recherche avancée
3. **Contenu** : Enrichir les données avec plus d'établissements
4. **Performance** : Optimiser les requêtes Directus

## 🏪 Modèle économique

- **Gratuit** : Consultation publique
- **Payant** : Inscription d'entreprises avec options premium

## 🎯 Objectif

Créer **le guide local de référence pour Lyon** avec un annuaire complet et des événements à jour.

---

✨ **Projet PHP pur, simple et efficace avec Directus Cloud !** ✨