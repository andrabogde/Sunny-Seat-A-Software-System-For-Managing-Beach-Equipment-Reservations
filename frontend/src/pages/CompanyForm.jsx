import React, { useState, useEffect, useContext, useCallback } from 'react';
import apiService from '../services/ApiService';
import { AuthContext } from '../contexts/AuthContext';
// import Icon from './components/Icon'; // componenta ta de iconițe
// import { localitati } from './data/localitati'; // sau din unde vin localitățile

const CompanyForm = ({ 
  company, 
  title = "Detalii Firmă", 
  isAdd = false, 
  readOnly = false,
  onSave,
  onCancel,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    cui: '',
    denumire: '',
    adresa: '',
    telefon: '',
    email: '',
    activ: true,
    localitate: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);
  const [localitati, setLocalitati]=useState([]);

  
   const loadLocalitati = useCallback(async() => {
      console.log('🏘️ Loading localitati from API...');
      const localitatiData= await apiService.getLocalitati();
      console.log('localitatiData',localitatiData);
      setLocalitati(localitatiData);
    },[]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
    
        try {
          setLoading(true);
          const companyData = await apiService.getDetaliiFirmaByUserId(user.id);      
          console.log('Detaliile firmei', companyData);      
          setFormData({
            cui: companyData.cui || '',
            denumire: companyData.denumire || companyData.nume || '',
            adresa: companyData.adresa || '',
            telefon: companyData.telefon || '',
            email: companyData.email || '',
            activ: companyData.activ !== undefined ? companyData.activ : true,
            localitate: companyData.localitate || ''
          });
        } catch (error) {
          console.error('Eroare la încărcarea firmei:', error);
          alert('Eroare la încărcarea detaliilor firmei!');
        } finally {
          setLoading(false);
        }
      
    };
    fetchCompanyDetails();
    loadLocalitati();

  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.denumire.trim()) {
      alert('Denumirea firmei este obligatorie!');
      return;
    }
    if (!formData.cui.trim()) {
      alert('CUI-ul este obligatoriu!');
      return;
    }
    if (!formData.email.trim()) {
      alert('Email-ul este obligatoriu!');
      return;
    }
    if (!formData.telefon.trim()) {
      alert('Telefonul este obligatoriu!');
      return;
    }
    if (!formData.adresa.trim()) {
      alert('Adresa este obligatorie!');
      return;
    }

    setSaving(true);
    
    try {
      if (isAdd) {
        await apiService.createCompany(formData);
        alert('Firma adăugată cu succes!');
      } else {
        await apiService.updateCompany(company.id, formData);
        alert('Firma actualizată cu succes!');
      }
      
      if (onSave) onSave();
    } catch (error) {
      console.error('Eroare la salvare:', error);
      alert(`Eroare la salvare: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h5 className="card-title mb-0">{title}</h5>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Se încarcă...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Denumire firmă *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.denumire}
                  onChange={(e) => handleInputChange('denumire', e.target.value)}
                  placeholder="Numele firmei"
                  readOnly={readOnly}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">CUI *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={formData.cui}
                  onChange={(e) => handleInputChange('cui', e.target.value)}
                  placeholder="RO12345678"
                  maxLength="10"
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Adresă *</label>
              <input 
                type="text" 
                className="form-control" 
                value={formData.adresa}
                onChange={(e) => handleInputChange('adresa', e.target.value)}
                placeholder="Adresa completă"
                maxLength="200"
                readOnly={readOnly}
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Localitate *</label>
                <select 
                  className="form-select" 
                  value={formData.localitate || ''}
                  onChange={(e) => handleInputChange('localitate', e.target.value)}
                  required
                  disabled={readOnly}
                >
                  <option value="">Selectează localitatea...</option>
                  {/* Decomentează când ai localitățile disponibile */}
                  {localitati.length > 0 ? (
                    localitati.map(localitate => (
                      <option key={localitate.id} value={localitate.id}>
                        {localitate.denumire}
                      </option>
                    ))
                  ) : (
                    <option disabled>Se încarcă localitățile...</option>
                  )}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Telefon *</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  value={formData.telefon}
                  onChange={(e) => handleInputChange('telefon', e.target.value)}
                  placeholder="0231456789"
                  maxLength="10"
                  readOnly={readOnly}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Email *</label>
              <input 
                type="email" 
                className="form-control" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="contact@firma.ro"
                maxLength="150"
                readOnly={readOnly}
              />
            </div>
            <div className="form-check mb-3">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="activCheck"
                checked={formData.activ}
                onChange={(e) => handleInputChange('activ', e.target.checked)}
                disabled={readOnly}
              />
              <label className="form-check-label" htmlFor="activCheck">
                Firmă activă
              </label>
            </div>
          </>
        )}
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-end gap-2">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              {readOnly ? 'Închide' : 'Anulează'}
            </button>
          )}
          {/* {!readOnly && (
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2"></div>
                  Salvează...
                </>
              ) : (
                <>
                  ✓ {isAdd ? 'Creează' : 'Actualizează'} Firma
                </>
              )}
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;