# 🌐 Configuration DNS - Migration Vercel → Railway

## 🎯 **OBJECTIF**
Transférer `guide-de-lyon.fr` de Vercel vers Railway avec SSL automatique.

## 📋 **ÉTAPES À SUIVRE**

### **1. Récupérer les infos Railway**
```bash
railway domains
```
Cette commande va te donner :
- **CNAME target** pour www.guide-de-lyon.fr
- **A record IP** pour guide-de-lyon.fr

### **2. Aller dans ton panel DNS**
Selon ton registrar :
- **OVH** : Manager → Domaines → guide-de-lyon.fr → Zone DNS
- **Gandi** : Domaines → guide-de-lyon.fr → DNS Records
- **Cloudflare** : Dashboard → guide-de-lyon.fr → DNS

### **3. Supprimer les anciens records Vercel**
Supprimer TOUS les records qui pointent vers Vercel :
- `A` records vers `76.76.19.61` (exemple IP Vercel)
- `CNAME` records vers `cname.vercel-dns.com`

### **4. Ajouter les nouveaux records Railway**

#### **Pour le domaine principal :**
```
Type: A
Name: @
Value: [IP fournie par Railway]
TTL: 3600
```

#### **Pour le sous-domaine www :**
```
Type: CNAME  
Name: www
Value: [CNAME fourni par Railway]
TTL: 3600
```

## ⏱️ **PROPAGATION DNS**
- **Délai normal** : 15 minutes à 2 heures
- **Maximum** : 24-48 heures dans de rares cas

## ✅ **VÉRIFICATIONS**

### **Test DNS**
```bash
# Vérifier le domaine principal
dig guide-de-lyon.fr A

# Vérifier le sous-domaine
dig www.guide-de-lyon.fr CNAME
```

### **Test HTTPS**
- https://guide-de-lyon.fr (redirection automatique)
- https://www.guide-de-lyon.fr

## 🔧 **EN CAS DE PROBLÈME**

### **DNS ne se propage pas**
1. Vider le cache DNS : `sudo dscacheutil -flushcache`
2. Utiliser DNS publics : 8.8.8.8 ou 1.1.1.1
3. Tester avec : https://whatsmydns.net

### **Certificat SSL manquant**
Railway génère automatiquement les certificats Let's Encrypt.
Si problème : attendre 10-15 minutes après la propagation DNS.

### **Redirection www ↔ non-www**
Railway gère automatiquement les redirections.

## 📱 **COMMANDES UTILES**

```bash
# Statut Railway
railway status

# Voir tous les domaines
railway domains

# Logs en temps réel
railway logs --follow

# Redéployer si nécessaire
railway redeploy
```

## 🎉 **RÉSULTAT FINAL**
- ✅ https://guide-de-lyon.fr → Site Railway
- ✅ https://www.guide-de-lyon.fr → Site Railway  
- ✅ Certificat SSL automatique
- ✅ Déploiement continu GitHub → Railway