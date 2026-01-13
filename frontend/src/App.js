import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './App.css';

// Utiliser l'URL relative en production (même domaine) ou l'URL configurée
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

function App() {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    chargerPostulations();
  }, []);

  const chargerPostulations = async () => {
    try {
      const response = await axios.get(`${API_URL}/postulations`);
      setPostulations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setLoading(false);
    }
  };

  const ajouterLigne = async () => {
    try {
      const nouvellePostulation = {
        nomEntreprise: '',
        poste: '',
        plateforme: '',
        lien: '',
        coche: false
      };
      const response = await axios.post(`${API_URL}/postulations`, nouvellePostulation);
      setPostulations([...postulations, response.data]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.data);
        alert('Erreur lors de l\'ajout: ' + (error.response.data.message || 'Erreur inconnue'));
      } else {
        alert('Erreur de connexion au serveur');
      }
    }
  };

  const mettreAJourPostulation = async (id, champ, valeur) => {
    try {
      const postulation = postulations.find(p => p._id === id);
      const updated = { ...postulation, [champ]: valeur };
      await axios.put(`${API_URL}/postulations/${id}`, updated);
      setPostulations(postulations.map(p => p._id === id ? updated : p));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const activerEdition = (postulation) => {
    setEditingId(postulation._id);
    setEditData({
      nomEntreprise: postulation.nomEntreprise || '',
      poste: postulation.poste || '',
      plateforme: postulation.plateforme || '',
      lien: postulation.lien || '',
      coche: postulation.coche || false
    });
  };

  const annulerEdition = () => {
    setEditingId(null);
    setEditData({});
  };

  const sauvegarderEdition = async (id) => {
    try {
      await axios.put(`${API_URL}/postulations/${id}`, editData);
      setPostulations(postulations.map(p => p._id === id ? { ...p, ...editData } : p));
      setEditingId(null);
      setEditData({});
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const supprimerPostulation = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette postulation ?')) {
      try {
        await axios.delete(`${API_URL}/postulations/${id}`);
        setPostulations(postulations.filter(p => p._id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const exporterExcel = () => {
    // Préparer les données
    const data = postulations.map(p => ({
      'Nom Entreprise': p.nomEntreprise || '',
      'Poste': p.poste || '',
      'Plateforme': p.plateforme || '',
      'Lien': p.lien || '',
      'Coché': p.coche ? 'Oui' : 'Non',
      'Date de création': p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : ''
    }));

    // Créer un workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Ajuster la largeur des colonnes
    const colWidths = [
      { wch: 25 }, // Nom Entreprise
      { wch: 25 }, // Poste
      { wch: 15 }, // Plateforme
      { wch: 40 }, // Lien
      { wch: 10 }, // Coché
      { wch: 15 }  // Date
    ];
    ws['!cols'] = colWidths;

    // Ajouter la feuille au workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Postulations');

    // Générer le fichier Excel
    const fileName = `postulations_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <div className="header-title">
          <h1>📋 Suivi des Postulations</h1>
          <p className="subtitle">Gérez vos candidatures en un seul endroit</p>
        </div>
        <div className="header-buttons">
          <button onClick={ajouterLigne} className="btn btn-primary">
            <span className="btn-icon">➕</span>
            Ajouter une ligne
          </button>
          <button onClick={exporterExcel} className="btn btn-secondary">
            <span className="btn-icon">📊</span>
            Exporter en Excel
          </button>
        </div>
      </header>

      <div className="table-wrapper">
        {postulations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>Aucune postulation</h3>
            <p>Cliquez sur "Ajouter une ligne" pour commencer à suivre vos candidatures</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="col-checkbox">✓</th>
                <th>Nom de l'entreprise</th>
                <th>Poste</th>
                <th>Plateforme / Lien</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {postulations.map((postulation) => {
                const isEditing = editingId === postulation._id;
                return (
                  <tr key={postulation._id} className={isEditing ? 'editing' : ''}>
                    <td className="checkbox-cell">
                      {isEditing ? (
                        <input
                          type="checkbox"
                          checked={editData.coche || false}
                          onChange={(e) => setEditData({ ...editData, coche: e.target.checked })}
                          className="checkbox-input"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={postulation.coche || false}
                          onChange={(e) => mettreAJourPostulation(postulation._id, 'coche', e.target.checked)}
                          className="checkbox-input"
                        />
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.nomEntreprise}
                          onChange={(e) => setEditData({ ...editData, nomEntreprise: e.target.value })}
                          placeholder="Nom de l'entreprise"
                          className="table-input"
                        />
                      ) : (
                        <div className="cell-content">
                          {postulation.nomEntreprise || <span className="placeholder">—</span>}
                        </div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.poste}
                          onChange={(e) => setEditData({ ...editData, poste: e.target.value })}
                          placeholder="Poste"
                          className="table-input"
                        />
                      ) : (
                        <div className="cell-content">
                          {postulation.poste || <span className="placeholder">—</span>}
                        </div>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="edit-platform">
                          <select
                            value={editData.plateforme}
                            onChange={(e) => setEditData({ ...editData, plateforme: e.target.value })}
                            className="table-select"
                          >
                            <option value="">Sélectionner...</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Indeed">Indeed</option>
                            <option value="Autre">Autre plateforme</option>
                          </select>
                          {(editData.plateforme === 'Autre' || (editData.plateforme && editData.plateforme !== 'Autre')) && (
                            <input
                              type="text"
                              value={editData.lien}
                              onChange={(e) => setEditData({ ...editData, lien: e.target.value })}
                              placeholder={editData.plateforme === 'Autre' ? 'Nom de la plateforme' : 'Lien (optionnel)'}
                              className="table-input"
                              style={{ marginTop: '8px' }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="cell-content">
                          <div className="platform-info">
                            {postulation.plateforme && (
                              <span className="platform-badge">{postulation.plateforme}</span>
                            )}
                            {postulation.lien && (
                              <span className="platform-link" title={postulation.lien}>
                                {postulation.lien.length > 30 ? postulation.lien.substring(0, 30) + '...' : postulation.lien}
                              </span>
                            )}
                            {!postulation.plateforme && !postulation.lien && (
                              <span className="placeholder">—</span>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="actions-cell">
                      {isEditing ? (
                        <div className="action-buttons">
                          <button
                            onClick={() => sauvegarderEdition(postulation._id)}
                            className="btn-action btn-save"
                            title="Sauvegarder"
                          >
                            ✓
                          </button>
                          <button
                            onClick={annulerEdition}
                            className="btn-action btn-cancel"
                            title="Annuler"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button
                            onClick={() => activerEdition(postulation)}
                            className="btn-action btn-edit"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => supprimerPostulation(postulation._id)}
                            className="btn-action btn-delete"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
