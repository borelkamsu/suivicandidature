# Guide de Déploiement sur Render

## 🚀 Déploiement Rapide

### Étape 1 : Backend (Service Web)

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Configurez :

   **Paramètres de base :**
   - **Name:** `suivi-postulation-backend`
   - **Environment:** `Node`
   - **Region:** Choisissez la région la plus proche
   - **Branch:** `main` (ou votre branche principale)
   - **Root Directory:** (laissez vide)
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`

   **Variables d'environnement :**
   
   Cliquez sur "Environment" et ajoutez :

   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/suivipostulation?retryWrites=true&w=majority
   ```

   ⚠️ **Important :** Copiez exactement l'URI ci-dessus avec `suivipostulation` avant le `?`

5. Cliquez sur **"Create Web Service"**
6. Attendez que le déploiement se termine
7. Notez l'URL de votre backend (ex: `https://suivi-postulation-backend.onrender.com`)

### Étape 2 : Frontend (Static Site)

1. Toujours sur Render Dashboard
2. Cliquez sur **"New +"** → **"Static Site"**
3. Connectez le même repository GitHub
4. Configurez :

   **Paramètres de base :**
   - **Name:** `suivi-postulation-frontend`
   - **Branch:** `main` (ou votre branche principale)
   - **Root Directory:** (laissez vide)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`

   **Variables d'environnement :**
   
   Cliquez sur "Environment" et ajoutez :

   ```
   REACT_APP_API_URL = https://votre-backend-url.onrender.com/api
   ```

   ⚠️ Remplacez `votre-backend-url` par l'URL réelle de votre backend (sans le `https://` et sans `/api`)

5. Cliquez sur **"Create Static Site"**
6. Attendez que le déploiement se termine

### Étape 3 : Vérification

1. Ouvrez l'URL de votre frontend
2. Testez l'ajout d'une postulation
3. Vérifiez que les données sont sauvegardées (elles apparaissent après rechargement)

## 🔧 Résolution de Problèmes

### Le backend ne démarre pas
- Vérifiez les logs dans Render Dashboard
- Vérifiez que `MONGODB_URI` est correctement configuré
- Assurez-vous que votre IP est autorisée dans MongoDB Atlas (Network Access)

### Le frontend ne peut pas se connecter au backend
- Vérifiez que `REACT_APP_API_URL` pointe vers la bonne URL
- Vérifiez que l'URL du backend se termine par `/api`
- Vérifiez les logs du frontend dans Render

### Erreur de connexion MongoDB
- Vérifiez que l'URI contient bien `suivipostulation` avant le `?`
- Vérifiez vos identifiants MongoDB Atlas
- Vérifiez que votre IP est autorisée dans MongoDB Atlas

## 📝 Notes Importantes

- Render assigne automatiquement un port, mais gardez `PORT=5000` dans les variables d'environnement
- Les variables d'environnement sont sensibles à la casse
- Après chaque modification des variables d'environnement, Render redéploie automatiquement
- Le premier déploiement peut prendre 5-10 minutes
