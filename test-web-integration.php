<?php
require_once 'api/config.php';

echo "<h1>Test d'Intégration Directus - Guide de Lyon</h1>\n";
echo "<p>Vérification des connexions API...</p>\n";

// Test authentification
echo "<h2>1. Test Authentification</h2>\n";
$token = getDirectusToken();
if ($token) {
    echo "<p style='color: green;'>✅ Authentification réussie!</p>\n";
    echo "<p>Token: " . substr($token, 0, 20) . "...</p>\n";
} else {
    echo "<p style='color: red;'>❌ Échec authentification</p>\n";
    exit;
}

// Test articles
echo "<h2>2. Test Articles</h2>\n";
$articles = directusRequest('articles');
if (isset($articles['data'])) {
    echo "<p style='color: green;'>✅ " . count($articles['data']) . " articles trouvés</p>\n";
    foreach ($articles['data'] as $article) {
        echo "<li>" . htmlspecialchars($article['titre']) . "</li>\n";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Aucun article ou erreur: " . json_encode($articles) . "</p>\n";
}

// Test entreprises
echo "<h2>3. Test Entreprises</h2>\n";
$entreprises = directusRequest('entreprises');
if (isset($entreprises['data'])) {
    echo "<p style='color: green;'>✅ " . count($entreprises['data']) . " entreprises trouvées</p>\n";
    foreach ($entreprises['data'] as $entreprise) {
        echo "<li>" . htmlspecialchars($entreprise['nom']) . " - " . htmlspecialchars($entreprise['categorie'] ?? 'Sans catégorie') . "</li>\n";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Aucune entreprise ou erreur: " . json_encode($entreprises) . "</p>\n";
}

// Test événements
echo "<h2>4. Test Événements</h2>\n";
$evenements = directusRequest('evenements');
if (isset($evenements['data'])) {
    echo "<p style='color: green;'>✅ " . count($evenements['data']) . " événements trouvés</p>\n";
    foreach ($evenements['data'] as $evenement) {
        echo "<li>" . htmlspecialchars($evenement['titre']) . "</li>\n";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Aucun événement ou erreur: " . json_encode($evenements) . "</p>\n";
}

// Test catégories
echo "<h2>5. Test Catégories</h2>\n";
$categories = directusRequest('categories_entreprises');
if (isset($categories['data'])) {
    echo "<p style='color: green;'>✅ " . count($categories['data']) . " catégories trouvées</p>\n";
    foreach ($categories['data'] as $categorie) {
        echo "<li>" . htmlspecialchars($categorie['nom']) . " - " . htmlspecialchars($categorie['description']) . "</li>\n";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Aucune catégorie ou erreur: " . json_encode($categories) . "</p>\n";
}

echo "<h2>🎉 Test Terminé</h2>\n";
echo "<p><a href='/api/index.php'>Voir la page d'accueil</a></p>\n";
echo "<p><a href='/api/evenements.php'>Voir les événements</a></p>\n";
echo "<p><a href='/api/annuaire.php'>Voir l'annuaire</a></p>\n";
?>