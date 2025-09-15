<?php
require_once 'config.php';

header('Content-Type: application/json');

$query = $_GET['q'] ?? '';
$category = $_GET['category'] ?? '';
$type = $_GET['type'] ?? 'all'; // all, entreprises, evenements

$results = [];

if (strlen($query) >= 2) {
    // Recherche dans les entreprises
    if ($type === 'all' || $type === 'entreprises') {
        $filter = [];
        
        if (!empty($query)) {
            $filter['_or'] = [
                ['nom' => ['_icontains' => $query]],
                ['description' => ['_icontains' => $query]],
                ['adresse' => ['_icontains' => $query]]
            ];
        }
        
        if (!empty($category)) {
            $filter['categorie'] = ['_eq' => $category];
        }
        
        $filterQuery = !empty($filter) ? '?filter=' . json_encode($filter) : '';
        $entreprises = directusRequest('entreprises' . $filterQuery);
        
        if (!empty($entreprises['data'])) {
            foreach ($entreprises['data'] as $entreprise) {
                $results[] = [
                    'type' => 'entreprise',
                    'id' => $entreprise['id'],
                    'title' => $entreprise['nom'],
                    'description' => substr($entreprise['description'] ?? '', 0, 150),
                    'category' => $entreprise['categorie'] ?? '',
                    'url' => '/entreprise/' . ($entreprise['slug'] ?? $entreprise['id']),
                    'image' => $entreprise['image'] ?? null
                ];
            }
        }
    }
    
    // Recherche dans les événements
    if ($type === 'all' || $type === 'evenements') {
        $filter = [];
        
        if (!empty($query)) {
            $filter['_or'] = [
                ['titre' => ['_icontains' => $query]],
                ['description' => ['_icontains' => $query]],
                ['lieu' => ['_icontains' => $query]]
            ];
        }
        
        $filterQuery = !empty($filter) ? '?filter=' . json_encode($filter) : '';
        $evenements = directusRequest('evenements' . $filterQuery);
        
        if (!empty($evenements['data'])) {
            foreach ($evenements['data'] as $evenement) {
                $results[] = [
                    'type' => 'evenement',
                    'id' => $evenement['id'],
                    'title' => $evenement['titre'],
                    'description' => substr($evenement['description'] ?? '', 0, 150),
                    'date' => $evenement['date_evenement'] ?? null,
                    'lieu' => $evenement['lieu'] ?? '',
                    'url' => '/evenements#event-' . $evenement['id'],
                    'image' => $evenement['image'] ?? null
                ];
            }
        }
    }
}

// Trier par pertinence (titre exact en premier)
usort($results, function($a, $b) use ($query) {
    $aExact = stripos($a['title'], $query) === 0 ? 1 : 0;
    $bExact = stripos($b['title'], $query) === 0 ? 1 : 0;
    return $bExact - $aExact;
});

echo json_encode([
    'query' => $query,
    'count' => count($results),
    'results' => array_slice($results, 0, 20) // Limite à 20 résultats
]);
?>