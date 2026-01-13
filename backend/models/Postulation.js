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
  },
  cvPath: {
    type: String,
    trim: true,
    default: ''
  },
  cvOriginalName: {
    type: String,
    trim: true,
    default: ''
  },
  cvFileName: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Postulation', postulationSchema);
