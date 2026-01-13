import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Utiliser l'URL relative en production (même domaine) ou l'URL configurée
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api');

function App() {
  const [postulations, setPostulations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const supprimerPostulation = async (id) => {
    try {
      await axios.delete(`${API_URL}/postulations/${id}`);
      setPostulations(postulations.filter(p => p._id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const exporterCSV = () => {
    const enTetes = ['Nom Entreprise', 'Poste', 'Plateforme', 'Lien', 'Coché'];
    const lignes = postulations.map(p => [
      p.nomEntreprise || '',
      p.poste || '',
      p.plateforme || '',
      p.lien || '',
      p.coche ? 'Oui' : 'Non'
    ]);

    const csvContent = [
      enTetes.join(','),
      ...lignes.map(ligne => ligne.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const lien = document.createElement('a');
    const url = URL.createObjectURL(blob);
    lien.setAttribute('href', url);
    lien.setAttribute('download', `postulations_${new Date().toISOString().split('T')[0]}.csv`);
    lien.style.visibility = 'hidden';
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
  };

  if (loading) {
    return <div className="container">Chargement...</div>;
  }

  return (
    <div className="container">
      <header>
        <h1>Suivi des Postulations</h1>
        <div className="header-buttons">
          <button onClick={ajouterLigne} className="btn btn-primary">
            + Ajouter une ligne
          </button>
          <button onClick={exporterCSV} className="btn btn-secondary">
            📥 Exporter en CSV
          </button>
        </div>
      </header>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Coché</th>
              <th>Nom de l'entreprise</th>
              <th>Poste</th>
              <th>Plateforme / Lien</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {postulations.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">
                  Aucune postulation. Cliquez sur "Ajouter une ligne" pour commencer.
                </td>
              </tr>
            ) : (
              postulations.map((postulation) => (
                <tr key={postulation._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={postulation.coche || false}
                      onChange={(e) => mettreAJourPostulation(postulation._id, 'coche', e.target.checked)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={postulation.nomEntreprise || ''}
                      onChange={(e) => mettreAJourPostulation(postulation._id, 'nomEntreprise', e.target.value)}
                      placeholder="Nom de l'entreprise"
                      className="table-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={postulation.poste || ''}
                      onChange={(e) => mettreAJourPostulation(postulation._id, 'poste', e.target.value)}
                      placeholder="Poste"
                      className="table-input"
                    />
                  </td>
                  <td>
                    <select
                      value={postulation.plateforme || ''}
                      onChange={(e) => mettreAJourPostulation(postulation._id, 'plateforme', e.target.value)}
                      className="table-select"
                    >
                      <option value="">Sélectionner...</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Autre">Autre plateforme</option>
                    </select>
                    {postulation.plateforme === 'Autre' && (
                      <input
                        type="text"
                        value={postulation.lien || ''}
                        onChange={(e) => mettreAJourPostulation(postulation._id, 'lien', e.target.value)}
                        placeholder="Nom de la plateforme"
                        className="table-input"
                        style={{ marginTop: '5px' }}
                      />
                    )}
                    {postulation.plateforme && postulation.plateforme !== 'Autre' && (
                      <input
                        type="text"
                        value={postulation.lien || ''}
                        onChange={(e) => mettreAJourPostulation(postulation._id, 'lien', e.target.value)}
                        placeholder="Lien (optionnel)"
                        className="table-input"
                        style={{ marginTop: '5px' }}
                      />
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => supprimerPostulation(postulation._id)}
                      className="btn-delete"
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
