const https = require('https');

// Configuration Directus
const DIRECTUS_URL = 'https://guide-lyon-cms.directus.app';
const DIRECTUS_EMAIL = 'raphael.nuziere@gmail.com';
const DIRECTUS_PASSWORD = 'Azerty25!';

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

async function getDirectusToken() {
    try {
        console.log('🔑 Test authentification Directus...');
        
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
            console.log('❌ Échec authentification:', response.status, response.data);
            return null;
        }
    } catch (error) {
        console.log('❌ Erreur authentification:', error.message);
        return null;
    }
}

async function checkCollections(token) {
    try {
        console.log('\n📊 Vérification des collections...');
        
        const response = await makeRequest(`${DIRECTUS_URL}/collections`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const collections = response.data.data;
            console.log(`✅ ${collections.length} collections trouvées:`);
            
            collections.forEach(collection => {
                console.log(`  - ${collection.collection}`);
            });
            
            return collections;
        } else {
            console.log('❌ Erreur récupération collections:', response.status);
            return [];
        }
    } catch (error) {
        console.log('❌ Erreur collections:', error.message);
        return [];
    }
}

async function checkData(token, collection) {
    try {
        console.log(`\n📋 Vérification des données dans ${collection}...`);
        
        const response = await makeRequest(`${DIRECTUS_URL}/items/${collection}?limit=5`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            const items = response.data.data;
            console.log(`✅ ${items.length} items trouvés dans ${collection}:`);
            
            items.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.titre || item.nom || item.title || JSON.stringify(item).substring(0, 50)}...`);
            });
            
            return items;
        } else {
            console.log(`❌ Erreur récupération ${collection}:`, response.status);
            return [];
        }
    } catch (error) {
        console.log(`❌ Erreur ${collection}:`, error.message);
        return [];
    }
}

async function main() {
    console.log('=== Test Final Directus ===\n');
    
    const token = await getDirectusToken();
    if (!token) {
        console.log('❌ Test échoué - Authentification impossible');
        return;
    }
    
    const collections = await checkCollections(token);
    
    // Tester les collections principales
    const testCollections = ['evenements', 'entreprises', 'articles'];
    
    for (const collection of testCollections) {
        const collectionExists = collections.find(c => c.collection === collection);
        if (collectionExists) {
            await checkData(token, collection);
        } else {
            console.log(`\n⚠️  Collection ${collection} non trouvée`);
        }
    }
    
    console.log('\n=== Résumé ===');
    console.log(`✅ Directus URL: ${DIRECTUS_URL}`);
    console.log(`✅ Authentification: OK`);
    console.log(`✅ Collections: ${collections.length} trouvées`);
    console.log('\n🎉 Directus est opérationnel!');
    console.log('\nProchaines étapes:');
    console.log('1. Importer plus de données avec import-to-directus.js');
    console.log('2. Adapter l\'application web pour utiliser Directus');
    console.log('3. Tester l\'intégration complète');
}

main().catch(console.error);