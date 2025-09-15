<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Cache-Control: max-age=300'); // Cache 5 minutes

try {
    // Récupération des entreprises depuis Directus
    $entreprises = directusRequest('entreprises?sort=-date_created');
    
    if (isset($entreprises['data'])) {
        // Nettoyage et formatage des données
        $formattedEntreprises = array_map(function($entreprise) {
            return [
                'id' => $entreprise['id'],
                'nom' => $entreprise['nom'] ?? '',
                'description' => $entreprise['description'] ?? '',
                'categorie' => $entreprise['categorie'] ?? '',
                'adresse' => $entreprise['adresse'] ?? '',
                'telephone' => $entreprise['telephone'] ?? '',
                'email' => $entreprise['email'] ?? '',
                'site_web' => $entreprise['site_web'] ?? '',
                'slug' => $entreprise['slug'] ?? $entreprise['id'],
                'date_created' => $entreprise['date_created'] ?? '',
                'image' => $entreprise['image'] ?? null
            ];
        }, $entreprises['data']);
        
        echo json_encode([
            'success' => true,
            'count' => count($formattedEntreprises),
            'entreprises' => $formattedEntreprises
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Aucune donnée trouvée',
            'entreprises' => []
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erreur serveur: ' . $e->getMessage(),
        'entreprises' => []
    ]);
}
?>