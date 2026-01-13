const mongoose = require('mongoose');

const postulationSchema = new mongoose.Schema({
  nomEntreprise: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  poste: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  plateforme: {
    type: String,
    required: false,
    trim: true,
    default: ''
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
