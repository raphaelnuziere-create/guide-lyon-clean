#!/bin/bash

echo "🌐 CONFIGURATION DOMAINE RAILWAY - guide-de-lyon.fr"
echo "==================================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}1. Ajout du domaine à Railway...${NC}"

# Ajout domaine principal
railway domain:add guide-de-lyon.fr

# Ajout sous-domaine www
railway domain:add www.guide-de-lyon.fr

echo ""
echo -e "${GREEN}✅ Domaines ajoutés à Railway !${NC}"

echo ""
echo -e "${YELLOW}📋 CONFIGURATION DNS REQUISE:${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}Chez ton registrar (OVH/Gandi/Cloudflare):${NC}"
echo ""
echo "🔹 CNAME Records à créer:"
echo "  www.guide-de-lyon.fr → [CNAME fourni par Railway]"
echo ""
echo "🔹 A Record pour le domaine nu:"
echo "  guide-de-lyon.fr → [IP fournie par Railway]"
echo ""

# Récupération des infos Railway
echo -e "${BLUE}2. Récupération des infos DNS Railway...${NC}"
railway domains

echo ""
echo -e "${YELLOW}📋 ÉTAPES DNS:${NC}"
echo "1. Va dans le panel DNS de ton registrar"
echo "2. Supprime les anciens records Vercel"
echo "3. Ajoute les nouveaux records Railway (affichés ci-dessus)"
echo "4. Attends 24-48h pour la propagation DNS"

echo ""
echo -e "${GREEN}🎯 RÉSULTAT FINAL:${NC}"
echo "- https://guide-de-lyon.fr → Ton site Railway"
echo "- https://www.guide-de-lyon.fr → Ton site Railway"
echo "- Certificat SSL automatique"

echo ""
echo -e "${BLUE}🔧 COMMANDES UTILES:${NC}"
echo "- Voir domaines: railway domains"
echo "- Voir logs: railway logs"
echo "- Redéployer: railway deploy"