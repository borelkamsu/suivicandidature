const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Postulation = require('../models/Postulation');
const upload = require('../middleware/upload');

// Obtenir toutes les postulations
router.get('/', async (req, res) => {
  try {
    const postulations = await Postulation.find().sort({ createdAt: -1 });
    res.json(postulations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une nouvelle postulation
router.post('/', async (req, res) => {
  try {
    const postulation = new Postulation({
      nomEntreprise: req.body.nomEntreprise || '',
      poste: req.body.poste || '',
      plateforme: req.body.plateforme || '',
      lien: req.body.lien || '',
      coche: req.body.coche || false
    });
    const nouvellePostulation = await postulation.save();
    res.status(201).json(nouvellePostulation);
  } catch (error) {
    console.error('Erreur lors de la création de la postulation:', error);
    res.status(400).json({ 
      message: error.message,
      details: error.errors ? Object.values(error.errors).map(e => e.message) : []
    });
  }
});

// Mettre à jour une postulation
router.put('/:id', async (req, res) => {
  try {
    const postulation = await Postulation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!postulation) {
      return res.status(404).json({ message: 'Postulation non trouvée' });
    }
    res.json(postulation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une postulation
router.delete('/:id', async (req, res) => {
  try {
    const postulation = await Postulation.findById(req.params.id);
    if (!postulation) {
      return res.status(404).json({ message: 'Postulation non trouvée' });
    }
    
    // Supprimer le fichier CV s'il existe
    if (postulation.cvPath) {
      const filePath = path.join(__dirname, '../uploads', path.basename(postulation.cvPath));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Postulation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Postulation supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload CV pour une postulation
router.post('/:id/cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }

    const postulation = await Postulation.findById(req.params.id);
    if (!postulation) {
      // Supprimer le fichier uploadé si la postulation n'existe pas
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Postulation non trouvée' });
    }

    // Supprimer l'ancien CV s'il existe
    if (postulation.cvFileName) {
      const oldFilePath = path.join(__dirname, '../uploads', postulation.cvFileName);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    // Mettre à jour la postulation avec le nouveau CV
    postulation.cvPath = `/api/postulations/${req.params.id}/cv/download`;
    postulation.cvOriginalName = req.file.originalname;
    postulation.cvFileName = req.file.filename;
    await postulation.save();

    res.json({
      message: 'CV uploadé avec succès',
      cvPath: postulation.cvPath,
      cvOriginalName: postulation.cvOriginalName
    });
  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// Télécharger le CV d'une postulation
router.get('/:id/cv/download', async (req, res) => {
  try {
    const postulation = await Postulation.findById(req.params.id);
    if (!postulation || !postulation.cvPath || !postulation.cvFileName) {
      return res.status(404).json({ message: 'CV non trouvé' });
    }

    const uploadsDir = path.join(__dirname, '../uploads');
    const filePath = path.join(uploadsDir, postulation.cvFileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Fichier CV non trouvé sur le serveur' });
    }

    const fileName = postulation.cvOriginalName || postulation.cvFileName;
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Erreur lors du téléchargement:', err);
        res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer le CV d'une postulation
router.delete('/:id/cv', async (req, res) => {
  try {
    const postulation = await Postulation.findById(req.params.id);
    if (!postulation) {
      return res.status(404).json({ message: 'Postulation non trouvée' });
    }

    if (postulation.cvFileName) {
      const uploadsDir = path.join(__dirname, '../uploads');
      const filePath = path.join(uploadsDir, postulation.cvFileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    postulation.cvPath = '';
    postulation.cvOriginalName = '';
    postulation.cvFileName = '';
    await postulation.save();

    res.json({ message: 'CV supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
