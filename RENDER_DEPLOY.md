# Guide de Déploiement sur Render

## 🚀 Déploiement Rapide - Service Unique

Le frontend et le backend sont hébergés sur **un seul service** Render. Le backend sert automatiquement les fichiers statiques du frontend.

### Étape 1 : Créer le Service Web

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Configurez :

   **Paramètres de base :**
   - **Name:** `suivi-postulation`
   - **Environment:** `Node`
   - **Region:** Choisissez la région la plus proche
   - **Branch:** `main` (ou votre branche principale)
   - **Root Directory:** (laissez vide)
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `cd backend && node server.js`

   ⚠️ **Important :** Le Build Command doit s'exécuter avec succès. Vérifiez les logs pour vous assurer que le frontend a bien été buildé (dossier `frontend/build` créé).

   **Variables d'environnement :**
   
   Cliquez sur "Environment" et ajoutez :

   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/suivipostulation?retryWrites=true&w=majority
   ```

   ⚠️ **Important :** 
   - Copiez exactement l'URI ci-dessus avec `suivipostulation` avant le `?`
   - **Vous n'avez PAS besoin** de `REACT_APP_API_URL` car le frontend utilise une URL relative en production

5. Cliquez sur **"Create Web Service"**
6. Attendez que le déploiement se termine (5-10 minutes la première fois)

### Étape 2 : Vérification

1. Ouvrez l'URL de votre service (ex: `https://suivi-postulation.onrender.com`)
2. Vous devriez voir l'interface de l'application
3. Testez l'ajout d'une postulation
4. Vérifiez que les données sont sauvegardées (elles apparaissent après rechargement)

## 🔧 Résolution de Problèmes

### Le backend ne démarre pas
- Vérifiez les logs dans Render Dashboard
- Vérifiez que `MONGODB_URI` est correctement configuré
- Assurez-vous que votre IP est autorisée dans MongoDB Atlas (Network Access)

### Le frontend ne peut pas se connecter au backend
- En production, le frontend utilise automatiquement `/api` (URL relative)
- Vérifiez que les routes API fonctionnent en testant directement : `https://votre-url.onrender.com/api/postulations`
- Vérifiez les logs dans Render Dashboard

### Erreur de connexion MongoDB
- Vérifiez que l'URI contient bien `suivipostulation` avant le `?`
- Vérifiez vos identifiants MongoDB Atlas
- Vérifiez que votre IP est autorisée dans MongoDB Atlas

## 📝 Notes Importantes

- Render assigne automatiquement un port, mais gardez `PORT=5000` dans les variables d'environnement
- Les variables d'environnement sont sensibles à la casse
- Après chaque modification des variables d'environnement, Render redéploie automatiquement
- Le premier déploiement peut prendre 5-10 minutes
