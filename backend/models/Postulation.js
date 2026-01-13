const mongoose = require('mongoose');

const postulationSchema = new mongoose.Schema({
  nomEntreprise: {
    type: String,
    required: true,
    trim: true
  },
  poste: {
    type: String,
    required: true,
    trim: true
  },
  plateforme: {
    type: String,
    required: true,
    trim: true
  },
  lien: {
    type: String,
    trim: true,
    default: ''
  },
  coche: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Postulation', postulationSchema);
