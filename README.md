# Application de Suivi des Postulations

Application web pour suivre vos postulations d'emploi avec sauvegarde automatique dans MongoDB Atlas.

## Fonctionnalités

- ✅ Liste de suivi avec cases à cocher
- 📝 Colonnes : Nom entreprise, Poste, Plateforme/Lien
- ➕ Bouton pour ajouter de nouvelles lignes
- 💾 Sauvegarde automatique dans MongoDB Atlas
- 📥 Export des données en CSV
- 🎨 Interface moderne et responsive

## Structure du Projet

```
.
├── backend/          # API Express + MongoDB
│   ├── config/       # Configuration MongoDB
│   ├── models/       # Modèles Mongoose
│   ├── routes/       # Routes API
│   └── server.js     # Serveur Express
├── frontend/         # Application React
│   ├── public/
│   └── src/
└── package.json
```

## Installation Locale

1. **Installer les dépendances :**
```bash
npm run install-all
```

2. **Configurer les variables d'environnement :**

Créez un fichier `.env` dans le dossier `backend/` :

```env
PORT=5000
MONGODB_URI=mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/suivipostulation?retryWrites=true&w=majority
```

3. **Démarrer l'application :**
```bash
# Démarrer backend et frontend en même temps
npm run dev

# Ou séparément :
npm run server  # Backend sur http://localhost:5000
npm run client  # Frontend sur http://localhost:3000
```

## Déploiement sur Render

### Configuration - Service Unique (Frontend + Backend)

Le frontend et le backend sont hébergés sur **un seul service** Render. Le backend sert automatiquement les fichiers statiques du frontend en production.

1. **Créer un nouveau service Web sur Render :**
   - Allez sur [Render Dashboard](https://dashboard.render.com)
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repository GitHub

2. **Configurer les paramètres :**
   - **Name:** `suivi-postulation`
   - **Environment:** `Node`
   - **Build Command:** `npm run install-all && npm run build`
   - **Start Command:** `cd backend && node server.js`
   - **Root Directory:** (laissez vide ou mettez `.`)

3. **Variables d'environnement à ajouter :**
   
   Dans la section "Environment Variables" de Render, ajoutez :

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` (Render assignera automatiquement un port, mais gardez cette variable) |
   | `MONGODB_URI` | `mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/suivipostulation?retryWrites=true&w=majority` |

   **Important :** 
   - Pour `MONGODB_URI`, utilisez exactement cette valeur avec le nom de la base de données `suivipostulation` avant le point d'interrogation.
   - **Vous n'avez PAS besoin** de `REACT_APP_API_URL` car le frontend utilise automatiquement une URL relative (`/api`) en production.

4. **Déployer :**
   - Cliquez sur "Create Web Service"
   - Render va automatiquement déployer votre application
   - Le build peut prendre 5-10 minutes la première fois

5. **Accéder à l'application :**
   - Une fois déployé, votre application sera accessible à l'URL fournie par Render (ex: `https://suivi-postulation.onrender.com`)
   - Le frontend et le backend sont servis depuis la même URL

## Base de Données MongoDB Atlas

L'application utilise la base de données `suivipostulation` sur MongoDB Atlas.

La connexion se fait automatiquement avec l'URI fournie. La structure de la collection est :

```javascript
{
  nomEntreprise: String,
  poste: String,
  plateforme: String,  // "LinkedIn", "Indeed", ou "Autre"
  lien: String,        // Lien ou nom de plateforme si "Autre"
  coche: Boolean,      // Case à cocher
  createdAt: Date,
  updatedAt: Date
}
```

## Utilisation

1. **Ajouter une postulation :**
   - Cliquez sur "Ajouter une ligne"
   - Remplissez les champs : Nom entreprise, Poste, Plateforme
   - Les données sont sauvegardées automatiquement

2. **Cocher une postulation :**
   - Utilisez la case à cocher pour marquer une postulation comme traitée

3. **Exporter en CSV :**
   - Cliquez sur "Exporter en CSV"
   - Le fichier sera téléchargé avec toutes vos postulations

4. **Supprimer une postulation :**
   - Cliquez sur l'icône 🗑️ dans la colonne Actions

## Technologies Utilisées

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, Axios
- **Base de données:** MongoDB Atlas
- **Hébergement:** Render

## Support

Pour toute question ou problème, vérifiez :
- Les logs sur Render Dashboard
- La connexion MongoDB Atlas
- Les variables d'environnement configurées correctement
