const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
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

// Routes API
app.use('/api/postulations', postulationsRoutes);

// Servir les fichiers statiques du frontend en production
if (process.env.NODE_ENV === 'production') {
  // Servir les fichiers statiques depuis le dossier build du frontend
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // Toutes les routes non-API renvoient vers index.html (pour React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  // Route de test en développement
  app.get('/', (req, res) => {
    res.json({ message: 'API Suivi Postulation - Mode développement' });
  });
}

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Mode production: Frontend servi depuis /frontend/build');
  }
});
