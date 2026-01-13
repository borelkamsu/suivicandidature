# Frontend - Suivi Postulation

Application React pour l'interface de suivi des postulations.

## Variables d'environnement

Créez un fichier `.env` à la racine du dossier `frontend/` :

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Pour la production sur Render, utilisez l'URL de votre backend :
```env
REACT_APP_API_URL=https://votre-backend-url.onrender.com/api
```

## Démarrage

```bash
npm install
npm start
```

L'application sera accessible sur http://localhost:3000

## Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `build/`.
