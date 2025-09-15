#!/bin/bash

echo "🚂 DÉPLOIEMENT AUTOMATIQUE RAILWAY - Guide de Lyon"
echo "=================================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérification Railway CLI
echo -e "${BLUE}1. Vérification Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI non installé${NC}"
    echo "Installation en cours..."
    brew install railway
fi

echo -e "${GREEN}✅ Railway CLI installé${NC}"

# Vérification connexion
echo -e "${BLUE}2. Vérification connexion Railway...${NC}"
if ! railway status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Connexion Railway requise${NC}"
    echo "Lance: railway login"
    echo "Puis relance ce script"
    exit 1
fi

echo -e "${GREEN}✅ Connecté à Railway${NC}"

# Création du projet Railway
echo -e "${BLUE}3. Création du projet Railway...${NC}"
railway project create guide-lyon-clean

# Connexion au GitHub repo
echo -e "${BLUE}4. Connexion au repository GitHub...${NC}"
railway connect --repo raphaelnuziere-create/guide-lyon-clean

# Configuration des variables d'environnement
echo -e "${BLUE}5. Configuration des variables d'environnement...${NC}"
railway env:set APP_ENV=production
railway env:set DIRECTUS_URL=https://guide-lyon-cms.directus.app
railway env:set DIRECTUS_EMAIL=raphael.nuziere@gmail.com
railway env:set DIRECTUS_PASSWORD=Azerty25!

# Premier déploiement
echo -e "${BLUE}6. Premier déploiement...${NC}"
railway deploy

# Récupération de l'URL
echo -e "${BLUE}7. Récupération de l'URL du site...${NC}"
RAILWAY_URL=$(railway url)

echo ""
echo -e "${GREEN}🎉 DÉPLOIEMENT TERMINÉ !${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Site déployé sur: ${RAILWAY_URL}${NC}"
echo ""
echo -e "${YELLOW}📋 PROCHAINES ÉTAPES:${NC}"
echo "1. Tester le site: ${RAILWAY_URL}"
echo "2. Configurer le domaine guide-de-lyon.fr"
echo "3. Déconnecter le domaine de Vercel"
echo ""
echo -e "${BLUE}🔧 COMMANDES UTILES:${NC}"
echo "- Voir les logs: railway logs"
echo "- Redéployer: railway deploy"
echo "- Variables env: railway env"
echo "- Domaine custom: railway domain:add guide-de-lyon.fr"