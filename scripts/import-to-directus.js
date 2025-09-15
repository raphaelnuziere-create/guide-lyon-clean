const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration Directus
const DIRECTUS_URL = 'https://guide-lyon-cms.directus.app';
const DIRECTUS_EMAIL = 'raphael.nuziere@gmail.com';
const DIRECTUS_PASSWORD = 'Azerty25!';

// Chemins des fichiers d'export
const EXPORTS_DIR = path.join(__dirname, '..', 'export');
const DATA_EXPORT_DIR = path.join(__dirname, '..', 'data-export');

// Fonction pour faire des requêtes HTTP
function makeRequest(url, options = {}, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const jsonResponse = JSON.parse(body);
                    resolve({ status: res.statusCode, data: jsonResponse });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', reject);
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Fonction pour obtenir le token Directus
async function getDirectusToken() {
    try {
        console.log('🔑 Authentification Directus...');
        
        const authData = {
            email: DIRECTUS_EMAIL,
            password: DIRECTUS_PASSWORD
        };

        const response = await makeRequest(`${DIRECTUS_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }, authData);

        if (response.status === 200 && response.data.data) {
            console.log('✅ Authentification réussie!');
            return response.data.data.access_token;
        } else {
            console.log('❌ Échec de l\'authentification:', response.status, response.data);
            return null;
        }
    } catch (error) {
        console.log('❌ Erreur lors de l\'authentification:', error.message);
        return null;
    }
}

// Fonction pour créer une collection dans Directus
async function createCollection(token, collectionName, schema) {
    try {
        console.log(`📊 Création de la collection ${collectionName}...`);
        
        const response = await makeRequest(`${DIRECTUS_URL}/collections`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }, {
            collection: collectionName,
            meta: {
                collection: collectionName,
                icon: 'article',
                note: null,
                display_template: null,
                hidden: false,
                singleton: false,
                translations: null,
                archive_field: null,
                archive_app_filter: true,
                archive_value: null,
                unarchive_value: null,
                sort_field: null,
                accountability: 'all',
                color: null,
                item_duplication_fields: null,
                sort: null,
                group: null,
                collapse: 'open'
            },
            schema: {
                name: collectionName
            }
        });

        if (response.status === 200 || response.status === 201) {
            console.log(`✅ Collection ${collectionName} créée!`);
            return true;
        } else {
            console.log(`❌ Erreur création ${collectionName}:`, response.status, response.data);
            return false;
        }
    } catch (error) {
        console.log(`❌ Erreur lors de la création de ${collectionName}:`, error.message);
        return false;
    }
}

// Fonction pour ajouter des champs à une collection
async function createField(token, collection, fieldName, fieldType, options = {}) {
    try {
        const response = await makeRequest(`${DIRECTUS_URL}/fields/${collection}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }, {
            field: fieldName,
            type: fieldType,
            meta: {
                field: fieldName,
                special: null,
                interface: fieldType === 'text' ? 'input' : 'textarea',
                options: null,
                display: null,
                display_options: null,
                readonly: false,
                hidden: false,
                sort: null,
                width: 'full',
                translations: null,
                note: null,
                conditions: null,
                required: options.required || false,
                group: null,
                validation: null,
                validation_message: null
            },
            schema: {
                name: fieldName,
                table: collection,
                data_type: fieldType === 'text' ? 'varchar' : 'text',
                default_value: null,
                max_length: fieldType === 'text' ? 255 : null,
                numeric_precision: null,
                numeric_scale: null,
                is_nullable: !options.required,
                is_unique: false,
                is_primary_key: false,
                is_generated: false,
                generation_expression: null,
                has_auto_increment: false,
                foreign_key_column: null,
                foreign_key_table: null
            }
        });

        if (response.status === 200 || response.status === 201) {
            console.log(`  ✅ Champ ${fieldName} ajouté à ${collection}`);
            return true;
        } else {
            console.log(`  ❌ Erreur champ ${fieldName}:`, response.status);
            return false;
        }
    } catch (error) {
        console.log(`  ❌ Erreur champ ${fieldName}:`, error.message);
        return false;
    }
}

// Fonction pour insérer des données dans une collection
async function insertData(token, collection, items) {
    try {
        console.log(`📝 Insertion de ${items.length} items dans ${collection}...`);
        
        for (const item of items) {
            const response = await makeRequest(`${DIRECTUS_URL}/items/${collection}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }, item);

            if (response.status === 200 || response.status === 201) {
                console.log(`  ✅ Item inséré: ${item.title || item.nom || item.titre || 'Sans titre'}`);
            } else {
                console.log(`  ❌ Erreur insertion:`, response.status, response.data);
            }
        }
        
        return true;
    } catch (error) {
        console.log(`❌ Erreur lors de l'insertion dans ${collection}:`, error.message);
        return false;
    }
}

// Fonction pour lire les fichiers d'export
function readExportFile(filename) {
    const filePaths = [
        path.join(EXPORTS_DIR, filename),
        path.join(DATA_EXPORT_DIR, filename)
    ];
    
    for (const filePath of filePaths) {
        if (fs.existsSync(filePath)) {
            console.log(`📁 Lecture de ${filePath}`);
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    }
    
    console.log(`❌ Fichier ${filename} non trouvé`);
    return null;
}

// Configuration des schémas
const COLLECTIONS_SCHEMA = {
    evenements: [
        { name: 'titre', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'date_evenement', type: 'timestamp' },
        { name: 'lieu', type: 'text' },
        { name: 'prix', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'date_debut', type: 'timestamp' },
        { name: 'date_fin', type: 'timestamp' }
    ],
    entreprises: [
        { name: 'nom', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'adresse', type: 'text' },
        { name: 'categorie', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'telephone', type: 'text' },
        { name: 'email', type: 'text' },
        { name: 'site_web', type: 'text' }
    ],
    articles: [
        { name: 'titre', type: 'text', required: true },
        { name: 'contenu', type: 'text' },
        { name: 'categorie', type: 'text' },
        { name: 'slug', type: 'text' }
    ]
};

// Fonction principale
async function main() {
    console.log('=== Import des données vers Directus ===\n');
    
    const token = await getDirectusToken();
    if (!token) {
        console.log('❌ Impossible de continuer sans authentification');
        return;
    }
    
    // Créer toutes les collections nécessaires
    console.log('📊 Création des collections...\n');
    
    // Collection articles
    await createCollection(token, 'articles', COLLECTIONS_SCHEMA.articles);
    for (const field of COLLECTIONS_SCHEMA.articles) {
        await createField(token, 'articles', field.name, field.type, { required: field.required });
    }
    
    // Collection entreprises
    await createCollection(token, 'entreprises', COLLECTIONS_SCHEMA.entreprises);
    for (const field of COLLECTIONS_SCHEMA.entreprises) {
        await createField(token, 'entreprises', field.name, field.type, { required: field.required });
    }
    
    // Collection categories_entreprises
    await createCollection(token, 'categories_entreprises', [
        { name: 'nom', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'couleur', type: 'text' }
    ]);
    await createField(token, 'categories_entreprises', 'nom', 'text', { required: true });
    await createField(token, 'categories_entreprises', 'description', 'text');
    await createField(token, 'categories_entreprises', 'couleur', 'text');
    
    // Ajouter des données d'exemple
    console.log('\n📝 Ajout de données d\'exemple...\n');
    
    // Articles d'exemple
    const sampleArticles = [
        {
            titre: 'Les meilleures brasseries de Lyon',
            contenu: 'Découvrez les brasseries emblématiques de Lyon, de la célèbre Brasserie Georges aux adresses plus confidentielles du Vieux-Lyon.',
            categorie: 'Gastronomie',
            slug: 'meilleures-brasseries-lyon'
        },
        {
            titre: 'Visiter la Presqu\'île de Lyon',
            contenu: 'Guide complet pour explorer la Presqu\'île lyonnaise : shopping, culture, architecture et bonnes adresses.',
            categorie: 'Tourisme',
            slug: 'visiter-presquile-lyon'
        }
    ];
    await insertData(token, 'articles', sampleArticles);
    
    // Entreprises d'exemple
    const sampleEntreprises = [
        {
            nom: 'Brasserie Georges',
            description: 'Restaurant emblématique de Lyon depuis 1836, proposant une cuisine traditionnelle lyonnaise.',
            adresse: '30 Cours de Verdun Gensoul, 69002 Lyon',
            categorie: 'Restaurant',
            slug: 'brasserie-georges',
            telephone: '04 72 56 54 54',
            site_web: 'https://brasserie-georges.com'
        },
        {
            nom: 'Musée des Beaux-Arts',
            description: 'L\'un des plus grands musées de France avec une collection exceptionnelle.',
            adresse: '20 Place des Terreaux, 69001 Lyon',
            categorie: 'Culture',
            slug: 'musee-beaux-arts',
            telephone: '04 72 10 17 40',
            site_web: 'https://www.mba-lyon.fr'
        }
    ];
    await insertData(token, 'entreprises', sampleEntreprises);
    
    // Catégories d'entreprises
    const categories = [
        { nom: 'Restaurant', description: 'Restaurants et brasseries', couleur: '#FF6B6B' },
        { nom: 'Culture', description: 'Musées, théâtres, cinémas', couleur: '#4ECDC4' },
        { nom: 'Shopping', description: 'Boutiques et commerces', couleur: '#45B7D1' },
        { nom: 'Services', description: 'Services professionnels', couleur: '#96CEB4' }
    ];
    await insertData(token, 'categories_entreprises', categories);
    
    console.log('\n=== Import terminé ===');
    console.log('Pour vérifier les données:');
    console.log(`- Interface Directus: ${DIRECTUS_URL}`);
    console.log('- Page de debug: https://votre-site.vercel.app/debug-directus');
}

main().catch(console.error);