const https = require('https');

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
            return response.data.data.access_token;
        }
        return null;
    } catch (error) {
        console.log('❌ Erreur lors de l\'authentification:', error.message);
        return null;
    }
}

async function checkCollections(token) {
    try {
        console.log('🔍 Vérification des collections disponibles...\n');
        
        // Lister toutes les collections
        const response = await makeRequest(`${DIRECTUS_URL}/collections`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200 && response.data.data) {
            console.log(`📊 ${response.data.data.length} collections trouvées:\n`);
            
            for (const collection of response.data.data) {
                console.log(`✅ ${collection.collection}`);
                if (collection.meta) {
                    console.log(`   - Note: ${collection.meta.note || 'Aucune note'}`);
                }
            }
            
            console.log('\n🔎 Collections nécessaires pour le projet:');
            const neededCollections = ['entreprises', 'evenements', 'articles'];
            const existingCollections = response.data.data.map(c => c.collection);
            
            for (const needed of neededCollections) {
                if (existingCollections.includes(needed)) {
                    console.log(`✅ ${needed} - Existe`);
                } else {
                    console.log(`❌ ${needed} - À créer`);
                }
            }
            
        } else {
            console.log('❌ Erreur lors de la récupération des collections:', response.status);
        }
        
    } catch (error) {
        console.log('❌ Erreur:', error.message);
    }
}

async function main() {
    console.log('=== Vérification des collections Directus ===\n');
    
    const token = await getDirectusToken();
    if (token) {
        console.log('✅ Authentification réussie!\n');
        await checkCollections(token);
    } else {
        console.log('❌ Échec de l\'authentification');
    }
    
    console.log('\n=== Fin de la vérification ===');
}

main().catch(console.error);