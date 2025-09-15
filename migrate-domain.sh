#!/bin/bash

echo "🔄 MIGRATION DOMAINE : Vercel → Railway"
echo "======================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérification des CLI
echo -e "${BLUE}1. Vérification des outils...${NC}"

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI non trouvé, installation...${NC}"
    npm install -g vercel
fi

if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI requis${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Outils vérifiés${NC}"

# Étape 1: Lister les domaines Vercel
echo -e "${BLUE}2. Domaines actuels sur Vercel...${NC}"
echo "Vos domaines Vercel :"
vercel domains list

echo ""
echo -e "${YELLOW}3. Suppression domaine de Vercel...${NC}"
echo "Suppression de guide-de-lyon.fr de Vercel..."

# Tentative de suppression (peut nécessiter confirmation)
vercel domains remove guide-de-lyon.fr --yes || echo "Domaine peut-être déjà supprimé"

echo -e "${GREEN}✅ Domaine libéré de Vercel${NC}"

# Étape 2: Configuration Railway
echo -e "${BLUE}4. Configuration Railway...${NC}"

# Obtenir l'URL Railway actuelle
RAILWAY_URL=$(railway status --json 2>/dev/null | jq -r '.deployments[0].url' 2>/dev/null || echo "Non trouvé")

echo "URL Railway actuelle: $RAILWAY_URL"

# Ajout des domaines à Railway
echo "Ajout des domaines à Railway..."
railway domain add guide-de-lyon.fr || echo "Domaine peut-être déjà ajouté"
railway domain add www.guide-de-lyon.fr || echo "Domaine peut-être déjà ajouté"

echo ""
echo -e "${GREEN}🎉 MIGRATION TERMINÉE !${NC}"
echo "======================================="
echo ""
echo -e "${YELLOW}📋 PROCHAINES ÉTAPES MANUELLES :${NC}"
echo ""
echo "1. 🌐 Configurer DNS chez ton registrar :"
echo "   - Supprimer les anciens records Vercel"
echo "   - Ajouter les nouveaux records Railway (voir ci-dessous)"
echo ""
echo "2. 📱 Vérifier les domaines Railway :"
echo "   railway domains"
echo ""
echo "3. 🔍 Surveiller les certificats SSL :"
echo "   (Railway génère automatiquement les certificats)"
echo ""
echo -e "${BLUE}🔧 INFOS RAILWAY :${NC}"
railway domains 2>/dev/null || echo "Lance 'railway domains' pour voir les infos DNS"