# Backend - Suivi Postulation

API REST pour l'application de suivi des postulations.

**Note :** En production, ce serveur sert aussi les fichiers statiques du frontend depuis `/frontend/build`.

## Variables d'environnement

Créez un fichier `.env` à la racine du dossier `backend/` :

```env
PORT=5000
MONGODB_URI=mongodb+srv://lama:lama@cluster0.254tgqb.mongodb.net/suivipostulation?retryWrites=true&w=majority
```

**Important :** Le nom de la base de données `suivipostulation` doit être présent dans l'URI avant le point d'interrogation.

## Routes API

- `GET /api/postulations` - Obtenir toutes les postulations
- `POST /api/postulations` - Créer une nouvelle postulation
- `PUT /api/postulations/:id` - Mettre à jour une postulation
- `DELETE /api/postulations/:id` - Supprimer une postulation

## Démarrage

```bash
npm install
node server.js
```

Pour le développement avec auto-reload :
```bash
npm run dev
```
