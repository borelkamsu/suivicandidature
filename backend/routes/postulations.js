const express = require('express');
const router = express.Router();
const Postulation = require('../models/Postulation');

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
    const postulation = await Postulation.findByIdAndDelete(req.params.id);
    if (!postulation) {
      return res.status(404).json({ message: 'Postulation non trouvée' });
    }
    res.json({ message: 'Postulation supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
