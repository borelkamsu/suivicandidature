const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const postulationsRoutes = require('./routes/postulations');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers uploadés
const uploadsPath = path.join(__dirname, 'uploads');
if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath));
}

// Routes API
app.use('/api/postulations', postulationsRoutes);

// Vérifier si le dossier build existe
const buildPath = path.join(__dirname, '../frontend/build');
const buildExists = fs.existsSync(buildPath);

// Servir les fichiers statiques du frontend si le dossier build existe
if (buildExists) {
  console.log('Dossier build trouvé, service des fichiers statiques du frontend');
  // Servir les fichiers statiques depuis le dossier build du frontend
  app.use(express.static(buildPath));

  // Toutes les routes non-API renvoient vers index.html (pour React Router)
  app.get('*', (req, res) => {
    // Ne pas intercepter les routes API
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'Route API non trouvée' });
    }
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('Dossier build non trouvé, mode API uniquement');
  // Route de test si le build n'existe pas
  app.get('/', (req, res) => {
    res.json({ 
      message: 'API Suivi Postulation',
      note: 'Le frontend n\'a pas été buildé. Exécutez "npm run build" dans le dossier frontend.'
    });
  });
}

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Mode production: Frontend servi depuis /frontend/build');
  }
});
