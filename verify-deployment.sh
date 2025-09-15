#!/bin/bash

echo "🔍 VÉRIFICATION DÉPLOIEMENT RAILWAY"
echo "==================================="

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Récupérer l'URL Railway
echo -e "${BLUE}1. URL du site Railway...${NC}"
RAILWAY_URL=$(railway status --json 2>/dev/null | jq -r '.deployments[0].url' 2>/dev/null || echo "")

if [ -z "$RAILWAY_URL" ] || [ "$RAILWAY_URL" = "null" ]; then
    # Alternative : utiliser railway domain
    RAILWAY_URL=$(railway domain 2>/dev/null | head -1 | awk '{print $1}' 2>/dev/null || echo "")
fi

if [ -z "$RAILWAY_URL" ]; then
    echo -e "${RED}❌ Impossible de récupérer l'URL Railway${NC}"
    echo "Lance manuellement : railway status"
    exit 1
fi

echo -e "${GREEN}✅ URL trouvée: $RAILWAY_URL${NC}"

# Test de base
echo -e "${BLUE}2. Test de connectivité...${NC}"
if curl -s --head "$RAILWAY_URL" | head -1 | grep -q "200 OK"; then
    echo -e "${GREEN}✅ Site accessible${NC}"
else
    echo -e "${RED}❌ Site non accessible${NC}"
    echo "Vérification des logs Railway..."
    railway logs --tail 20
    exit 1
fi

# Test des pages principales
echo -e "${BLUE}3. Test des pages principales...${NC}"

PAGES=("/" "/annuaire" "/evenements" "/tarifs" "/contact" "/ajouter-entreprise")

for page in "${PAGES[@]}"; do
    if curl -s "${RAILWAY_URL}${page}" | grep -q "<title>"; then
        echo -e "${GREEN}✅ ${page}${NC}"
    else
        echo -e "${YELLOW}⚠️ ${page} (peut avoir des erreurs)${NC}"
    fi
done

# Test API endpoints
echo -e "${BLUE}4. Test des APIs...${NC}"

API_ENDPOINTS=("/api/search.php?q=test" "/api/annuaire-data.php")

for api in "${API_ENDPOINTS[@]}"; do
    if curl -s "${RAILWAY_URL}${api}" | grep -q "{"; then
        echo -e "${GREEN}✅ API ${api}${NC}"
    else
        echo -e "${YELLOW}⚠️ API ${api} (vérifier Directus)${NC}"
    fi
done

# Variables d'environnement
echo -e "${BLUE}5. Variables d'environnement...${NC}"
echo "Variables configurées dans Railway:"
railway variables list 2>/dev/null | grep -E "(APP_ENV|DIRECTUS_URL)" || echo "Lance 'railway variables list' pour voir"

# Status final
echo ""
echo -e "${GREEN}🎉 VÉRIFICATION TERMINÉE${NC}"
echo "==================================="
echo ""
echo -e "${BLUE}📱 TON SITE EST LIVE :${NC}"
echo "$RAILWAY_URL"
echo ""
echo -e "${YELLOW}📋 PROCHAINES ÉTAPES :${NC}"
echo "1. Tester toutes les fonctionnalités"
echo "2. Configurer le domaine custom guide-de-lyon.fr"
echo "3. Vérifier que Directus fonctionne bien"
echo ""
echo -e "${BLUE}🔧 COMMANDES UTILES :${NC}"
echo "- railway logs : voir les logs"
echo "- railway domains : configurer domaine"
echo "- railway redeploy : redéployer si besoin"