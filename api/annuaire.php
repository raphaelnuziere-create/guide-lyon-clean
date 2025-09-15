<?php
require_once 'config.php';

// Récupération des entreprises depuis Directus
$entreprises = directusRequest('entreprises?sort=-date_created');
$categories = directusRequest('categories_entreprises');

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Annuaire - Guide de Lyon</title>
    <meta name="description" content="Découvrez l'annuaire complet des entreprises de Lyon : restaurants, hôtels, services et commerces.">
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
                    <a href="/ajouter-entreprise" class="nav-link">Ajouter entreprise</a>
                    <a href="/contact" class="nav-link">Contact</a>
                </div>
            </div>
        </nav>
    </header>

    <!-- Page Header -->
    <section class="hero">
        <div class="hero-content">
            <h1 class="hero-title">Annuaire des Entreprises</h1>
            <p class="hero-subtitle">Découvrez les meilleures entreprises de Lyon</p>
        </div>
    </section>

    <!-- Filters Section -->
    <section class="filters-section">
        <div class="container">
            <div class="filters-container">
                <div class="filter-group">
                    <label for="category-filter">Catégorie :</label>
                    <select id="category-filter">
                        <option value="">Toutes les catégories</option>
                        <?php if (!empty($categories['data'])): ?>
                            <?php foreach ($categories['data'] as $category): ?>
                                <option value="<?= htmlspecialchars($category['nom']) ?>">
                                    <?= htmlspecialchars($category['nom']) ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label for="sort-filter">Trier par :</label>
                    <select id="sort-filter">
                        <option value="date">Plus récent</option>
                        <option value="name">Nom A-Z</option>
                        <option value="name-desc">Nom Z-A</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <button id="reset-filters" class="reset-btn">Réinitialiser</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Annuaire Section -->
    <section class="section">
        <div class="container">
            <div class="results-info">
                <span id="results-count">Chargement...</span>
            </div>
            <div class="grid" id="entreprises-grid">
                <!-- Contenu chargé dynamiquement via JavaScript -->
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
    <!-- Filters JavaScript -->
    <script src="/js/filters.js"></script>
</body>
</html>