<?php
require_once 'config.php';

$message = '';
$error = '';

if ($_POST) {
    $nom = trim($_POST['nom'] ?? '');
    $description = trim($_POST['description'] ?? '');
    $categorie = trim($_POST['categorie'] ?? '');
    $adresse = trim($_POST['adresse'] ?? '');
    $telephone = trim($_POST['telephone'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $site_web = trim($_POST['site_web'] ?? '');
    $horaires = trim($_POST['horaires'] ?? '');
    $services = trim($_POST['services'] ?? '');
    
    // Validation
    $errors = [];
    
    if (empty($nom)) $errors[] = 'Le nom de l\'entreprise est obligatoire';
    if (empty($description)) $errors[] = 'La description est obligatoire';
    if (empty($categorie)) $errors[] = 'La catégorie est obligatoire';
    if (empty($adresse)) $errors[] = 'L\'adresse est obligatoire';
    if (empty($email)) $errors[] = 'L\'email est obligatoire';
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'L\'email n\'est pas valide';
    if (!empty($site_web) && !filter_var($site_web, FILTER_VALIDATE_URL)) $errors[] = 'L\'URL du site web n\'est pas valide';
    
    if (empty($errors)) {
        // Créer le slug
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $nom)));
        
        // Données à envoyer à Directus
        $entrepriseData = [
            'nom' => $nom,
            'description' => $description,
            'categorie' => $categorie,
            'adresse' => $adresse,
            'telephone' => $telephone,
            'email' => $email,
            'site_web' => $site_web,
            'horaires' => $horaires,
            'services' => $services,
            'slug' => $slug,
            'status' => 'pending' // En attente de validation
        ];
        
        // Envoyer à Directus (ici on simule)
        $result = directusRequest('entreprises', 'POST', $entrepriseData);
        
        if (isset($result['data'])) {
            $message = 'Votre entreprise a été soumise avec succès ! Elle sera validée sous 48h.';
            // Reset form
            $nom = $description = $categorie = $adresse = $telephone = $email = $site_web = $horaires = $services = '';
        } else {
            $error = 'Erreur lors de l\'envoi. Veuillez réessayer.';
        }
    } else {
        $error = implode('<br>', $errors);
    }
}

// Récupérer les catégories
$categories = directusRequest('categories_entreprises');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ajouter votre entreprise - Guide de Lyon</title>
    <meta name="description" content="Ajoutez votre entreprise au Guide de Lyon et augmentez votre visibilité.">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <h1>Guide de Lyon</h1>
                </a>
                <div class="nav-menu">
                    <a href="/annuaire" class="nav-link">Annuaire</a>
                    <a href="/evenements" class="nav-link">Événements</a>
                    <a href="/tarifs" class="nav-link">Tarifs</a>
                    <a href="/contact" class="nav-link">Contact</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">Ajoutez votre entreprise</h1>
            <p class="hero-subtitle">Rejoignez le Guide de Lyon et boostez votre visibilité</p>
        </div>
    </section>

    <!-- Form Section -->
    <section class="section">
        <div class="container">
            <div class="form-container">
                <div class="form-intro">
                    <h2>Pourquoi rejoindre le Guide de Lyon ?</h2>
                    <ul class="benefits-list">
                        <li>✅ Augmentez votre visibilité locale</li>
                        <li>✅ Attirez de nouveaux clients</li>
                        <li>✅ Référencement SEO gratuit</li>
                        <li>✅ Fiche entreprise détaillée</li>
                        <li>✅ Support client réactif</li>
                    </ul>
                </div>

                <div class="form-wrapper">
                    <?php if ($message): ?>
                        <div class="alert alert-success">
                            <?= htmlspecialchars($message) ?>
                            <p><a href="/tarifs">Découvrez nos offres premium</a> pour plus de visibilité !</p>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($error): ?>
                        <div class="alert alert-error">
                            <?= $error ?>
                        </div>
                    <?php endif; ?>

                    <form method="POST" class="form">
                        <h3>Informations de base</h3>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="nom">Nom de l'entreprise *</label>
                                <input type="text" id="nom" name="nom" value="<?= htmlspecialchars($nom ?? '') ?>" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="categorie">Catégorie *</label>
                                <select id="categorie" name="categorie" required>
                                    <option value="">Choisissez une catégorie</option>
                                    <?php if (!empty($categories['data'])): ?>
                                        <?php foreach ($categories['data'] as $category): ?>
                                            <option value="<?= htmlspecialchars($category['nom']) ?>" 
                                                    <?= ($categorie ?? '') === $category['nom'] ? 'selected' : '' ?>>
                                                <?= htmlspecialchars($category['nom']) ?>
                                            </option>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="description">Description de l'entreprise *</label>
                            <textarea id="description" name="description" rows="4" required 
                                      placeholder="Décrivez votre entreprise, vos spécialités, votre histoire..."><?= htmlspecialchars($description ?? '') ?></textarea>
                        </div>

                        <h3>Coordonnées</h3>
                        
                        <div class="form-group">
                            <label for="adresse">Adresse complète *</label>
                            <input type="text" id="adresse" name="adresse" value="<?= htmlspecialchars($adresse ?? '') ?>" 
                                   placeholder="123 Rue de la République, 69001 Lyon" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="telephone">Téléphone</label>
                                <input type="tel" id="telephone" name="telephone" value="<?= htmlspecialchars($telephone ?? '') ?>" 
                                       placeholder="04 XX XX XX XX">
                            </div>
                            
                            <div class="form-group">
                                <label for="email">Email *</label>
                                <input type="email" id="email" name="email" value="<?= htmlspecialchars($email ?? '') ?>" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="site_web">Site web</label>
                            <input type="url" id="site_web" name="site_web" value="<?= htmlspecialchars($site_web ?? '') ?>" 
                                   placeholder="https://www.monentreprise.fr">
                        </div>

                        <h3>Informations complémentaires</h3>
                        
                        <div class="form-group">
                            <label for="horaires">Horaires d'ouverture</label>
                            <textarea id="horaires" name="horaires" rows="3" 
                                      placeholder="Lundi-Vendredi: 9h-18h&#10;Samedi: 9h-12h&#10;Dimanche: Fermé"><?= htmlspecialchars($horaires ?? '') ?></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="services">Services proposés</label>
                            <textarea id="services" name="services" rows="3" 
                                      placeholder="Listez vos principaux services..."><?= htmlspecialchars($services ?? '') ?></textarea>
                        </div>

                        <div class="form-submit">
                            <button type="submit" class="btn-primary">Soumettre ma demande</button>
                            <p class="form-note">
                                Votre fiche sera validée sous 48h. Vous recevrez un email de confirmation.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>Guide de Lyon</h3>
                    <p>Votre guide complet pour découvrir Lyon et ses environs.</p>
                </div>
                <div class="footer-section">
                    <h4>Navigation</h4>
                    <ul>
                        <li><a href="/annuaire">Annuaire</a></li>
                        <li><a href="/evenements">Événements</a></li>
                        <li><a href="/tarifs">Tarifs</a></li>
                        <li><a href="/contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>Email: contact@guide-de-lyon.fr</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Guide de Lyon. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
    
    <!-- Search JavaScript -->
    <script src="/js/search.js"></script>
</body>
</html>