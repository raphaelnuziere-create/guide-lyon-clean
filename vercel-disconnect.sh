#!/bin/bash

echo "🔌 DÉCONNEXION DOMAINE VERCEL - guide-de-lyon.fr"
echo "==============================================="

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Vérification Vercel CLI
echo -e "${BLUE}1. Vérification Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI non installé${NC}"
    echo "Tu peux le faire manuellement sur vercel.com"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI trouvé${NC}"

# Liste des projets
echo -e "${BLUE}2. Liste de tes projets Vercel...${NC}"
vercel list

echo ""
echo -e "${YELLOW}3. Déconnexion du domaine guide-de-lyon.fr...${NC}"

# Liste des domaines
echo "Domaines actuels:"
vercel domains list

echo ""
echo -e "${BLUE}Suppression du domaine guide-de-lyon.fr de Vercel...${NC}"

# Suppression du domaine (tu devras confirmer)
vercel domains rm guide-de-lyon.fr --yes

echo ""
echo -e "${GREEN}✅ Domaine déconnecté de Vercel !${NC}"
echo ""
echo -e "${YELLOW}📋 PROCHAINES ÉTAPES:${NC}"
echo "1. ✅ Domaine libéré de Vercel"
echo "2. 🚂 Maintenant on peut l'ajouter à Railway"
echo "3. 🌐 Configurer les DNS"

echo ""
echo -e "${BLUE}🔧 Si tu veux voir tes projets Vercel restants:${NC}"
echo "vercel list"