# Guide de Configuration Directus Cloud

## Étapes pour configurer Directus Cloud

### 1. Création du projet Directus Cloud

1. Aller sur [https://directus.cloud](https://directus.cloud)
2. Créer un compte ou se connecter
3. Créer un nouveau projet avec :
   - Nom du projet: `guide-lyon-cms`
   - Région: Europe (Frankfurt ou Paris)
   - Plan: Starter (gratuit pour commencer)

### 2. Configuration de l'utilisateur admin

1. Une fois le projet créé, noter l'URL du projet : `https://guide-lyon-cms.directus.app`
2. Créer l'utilisateur administrateur :
   - Email: `admin@guide-lyon.fr`
   - Mot de passe: `AdminPassword123!` (à changer pour la production)
   - Rôle: Administrator

### 3. Mise à jour des credentials

Mettre à jour le fichier `api/config.php` avec les vraies credentials :

```php
// Configuration Directus Cloud
define('DIRECTUS_URL', 'https://guide-lyon-cms.directus.app');
define('DIRECTUS_EMAIL', 'admin@guide-lyon.fr');
define('DIRECTUS_PASSWORD', 'AdminPassword123!');
```

### 4. Création des collections

Vous pouvez soit :

**Option A: Créer manuellement via l'interface Directus**
1. Se connecter à l'interface Directus
2. Créer les collections suivantes :

#### Collection `evenements`
- `titre` (Text, requis)
- `description` (Textarea)
- `date_evenement` (DateTime)
- `lieu` (Text)
- `prix` (Text)
- `category` (Text)

#### Collection `entreprises`
- `nom` (Text, requis)
- `description` (Textarea)
- `adresse` (Text)
- `categorie` (Text)
- `slug` (Text, unique)
- `telephone` (Text)
- `email` (Email)
- `site_web` (URL)

#### Collection `articles`
- `titre` (Text, requis)
- `contenu` (Textarea/Rich Text)
- `categorie` (Text)
- `slug` (Text, unique)

**Option B: Utiliser le script d'import**
```bash
node scripts/import-to-directus.js
```

### 5. Configuration des permissions

1. Dans Directus, aller dans Settings > Access Control
2. Créer un rôle "Public" avec permissions de lecture pour :
   - Collection `evenements`
   - Collection `entreprises`
   - Collection `articles`
3. Configurer l'accès public pour l'API

### 6. Test de la configuration

1. Tester la page de debug : `https://votre-site.vercel.app/debug-directus`
2. Vérifier que l'authentification fonctionne
3. Vérifier que les collections sont accessibles

### 7. Import des données

Une fois Directus configuré, importer les données exportées de Supabase :

```bash
node scripts/import-to-directus.js
```

### 8. Variables d'environnement Vercel (optionnel)

Pour plus de sécurité, configurer les variables d'environnement sur Vercel :

1. Dans le dashboard Vercel, aller dans Settings > Environment Variables
2. Ajouter :
   - `DIRECTUS_URL`: `https://guide-lyon-cms.directus.app`
   - `DIRECTUS_EMAIL`: `admin@guide-lyon.fr`
   - `DIRECTUS_PASSWORD`: `AdminPassword123!`

Puis modifier `api/config.php` pour utiliser ces variables :

```php
define('DIRECTUS_URL', $_ENV['DIRECTUS_URL'] ?? 'https://guide-lyon-cms.directus.app');
define('DIRECTUS_EMAIL', $_ENV['DIRECTUS_EMAIL'] ?? 'admin@guide-lyon.fr');
define('DIRECTUS_PASSWORD', $_ENV['DIRECTUS_PASSWORD'] ?? 'AdminPassword123!');
```

## Troubleshooting

### Erreur 401 (Authentication failed)
- Vérifier les credentials dans `api/config.php`
- Vérifier que l'utilisateur admin existe dans Directus
- Vérifier l'URL du projet Directus

### Collections non trouvées
- Vérifier que les collections ont été créées dans Directus
- Vérifier les permissions d'accès aux collections
- Utiliser la page de debug pour diagnostiquer

### Problèmes de CORS
- Dans Directus, aller dans Settings > Project Settings
- Ajouter le domaine Vercel dans les CORS Origins
- Exemple: `https://votre-projet.vercel.app`

## Prochaines étapes

Une fois Directus configuré et les données importées :
1. Le site utilisera les vraies données au lieu des données mock
2. Désactiver la protection SSO sur Vercel pour l'accès public
3. Configurer le domaine personnalisé si nécessaire