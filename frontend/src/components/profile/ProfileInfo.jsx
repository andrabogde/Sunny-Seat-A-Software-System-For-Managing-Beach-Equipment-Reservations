import React, { useState, useEffect, useRef } from 'react';

const ProfileInfo = ({ user, onUpdate, onImageUpload, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    numarTelefon: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        numarTelefon: user.numarTelefon || user.telefon || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Numele este obligatoriu';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Numele trebuie să aibă cel puțin 2 caractere';
    }
    if (formData.numarTelefon && formData.numarTelefon.trim()) {
      if (!/^((\+4|0)?[0-9]{9,10})$/.test(formData.numarTelefon.trim())) {
        newErrors.numarTelefon = 'Numărul de telefon nu este valid (ex: 0721234567)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const updateData = {
        name: formData.name.trim(),
        numarTelefon: formData.numarTelefon.trim()
      };
      
      const result = await onUpdate(updateData);
      if (result.success) {
        setSuccessMessage('Profil actualizat cu succes!');
        setIsEditing(false);
        setErrors({});
      } else {
        setErrors({ general: result.message || 'Eroare la actualizarea profilului' });
      }
    } catch (error) {
      setErrors({ general: 'Eroare neașteptată. Încercați din nou.' });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      numarTelefon: user?.numarTelefon || user?.telefon || ''
    });
    setErrors({});
    setSuccessMessage('');
    setIsEditing(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && onImageUpload) {
      try {
        const result = await onImageUpload(file);
        if (result.success) {
          setSuccessMessage('Poza de profil a fost actualizată!');
        } else {
          setErrors({ general: result.message || 'Eroare la încărcarea imaginii' });
        }
      } catch (error) {
        setErrors({ general: 'Eroare la încărcarea imaginii' });
      }
    }
  };

  const getProfileImage = () => {
    if (user?.profileImage?.data) {
      return `data:${user.profileImage.mimeType};base64,${user.profileImage.data}`;
    } else if (user?.profileImage?.url) {
      return user.profileImage.url;
    } else if (user?.profileImage) {
      return user.profileImage;
    } else {
      // Folosește numele real al utilizatorului conectat pentru inițiale
      const userName = user?.name || user?.nume || user?.prenume || 'User';
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=200&background=667eea&color=ffffff&format=png`;
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Se încarcă informațiile profilului...</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <div className="header-info">
            <div className="header-icon">👤</div>
            <div className="header-text">
              <h4>Informații personale</h4>
              <p>Gestionează datele tale din baza de date</p>
            </div>
          </div>
          {!isEditing && (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
              disabled={loading}
            >
              ✏️ Editează
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="profile-body">
        {/* Messages */}
        {successMessage && (
          <div className="alert alert-success">
            ✅ {successMessage}
          </div>
        )}
        
        {errors.general && (
          <div className="alert alert-error">
            ⚠️ {errors.general}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="edit-form">
            {/* Profile Image Section */}
            <div className="form-section">
              <div className="section-header">
                <h5>📷 Poza de profil</h5>
                <p>Actualizează imaginea ta de profil</p>
              </div>
              
              <div className="image-upload-area">
                <div className="image-container" onClick={handleImageClick}>
                  <img 
                    src={getProfileImage()} 
                    alt="Poza de profil" 
                    className="profile-image-edit"
                  />
                  <div className="image-overlay">
                    <span className="overlay-icon">📷</span>
                    <span>Schimbă poza</span>
                  </div>
                </div>
                <div className="image-info">
                  <p>Fă clic pe imagine pentru a o schimba</p>
                  <div className="image-specs">
                    <span>Format: JPG, PNG</span>
                    <span>Max: 5MB</span>
                  </div>
                </div>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>

            {/* Form Fields */}
            <div className="form-section">
              <div className="section-header">
                <h5>📝 Informații de contact</h5>
                <p>Actualizează datele tale personale</p>
              </div>
              
              <div className="form-grid">
                {/* Name Field */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👤</span>
                    <span>Nume complet *</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Ex: Ion Popescu"
                    required
                    className={`form-input ${errors.name ? 'error' : ''}`}
                  />
                  {errors.name && (
                    <div className="error-msg">
                      ⚠️ {errors.name}
                    </div>
                  )}
                </div>

                {/* Phone Field */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📞</span>
                    <span>Numărul de telefon</span>
                  </label>
                  <input 
                    type="tel" 
                    name="numarTelefon"
                    value={formData.numarTelefon}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Ex: 0721234567"
                    className={`form-input ${errors.numarTelefon ? 'error' : ''}`}
                  />
                  {errors.numarTelefon && (
                    <div className="error-msg">
                      ⚠️ {errors.numarTelefon}
                    </div>
                  )}
                  <div className="help-text">
                    💡 Format: 0721234567 sau +40721234567
                  </div>
                </div>

                {/* Email Field (readonly) */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📧</span>
                    <span>Adresa de email</span>
                  </label>
                  <div className="readonly-field">
                    <div className="readonly-content">
                      <span className="email-value">{user.email}</span>
                      {user.emailVerified ? (
                        <span className="badge verified">✅ Verificat</span>
                      ) : (
                        <span className="badge unverified">⏰ Neverificat</span>
                      )}
                    </div>
                    <div className="help-text">
                      🔒 Email-ul nu poate fi modificat din profil
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <span className="spinner-sm"></span>
                    Se salvează...
                  </>
                ) : (
                  <>💾 Salvează modificările</>
                )}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                disabled={loading}
                className="btn btn-secondary"
              >
                ❌ Anulează
              </button>
            </div>
          </form>
        ) : (
          <div className="display-mode">
            {/* Profile Image Display */}
            <div className="image-display">
              <img 
                src={getProfileImage()} 
                alt="Poza de profil" 
                className="profile-image-display"
              />
              <div>
                <h6>Poza de profil</h6>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-sm"
                >
                  ✏️ Schimbă poza
                </button>
              </div>
            </div>

            {/* Info Display */}
            <div className="info-display">
              <div className="info-item">
                <div className="info-icon">👤</div>
                <div>
                  <label>Nume complet</label>
                  <p>{user.name || 'Nu este setat'}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📞</div>
                <div>
                  <label>Numărul de telefon</label>
                  <p>
                    {(user.numarTelefon || user.telefon) ? (
                      user.numarTelefon || user.telefon
                    ) : (
                      <span className="text-muted">
                        Nu este setat
                        <button 
                          className="btn-link"
                          onClick={() => setIsEditing(true)}
                        >
                          Adaugă telefon
                        </button>
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">📧</div>
                <div>
                  <label>Adresa de email</label>
                  <div className="email-display">
                    <span>{user.email}</span>
                    {user.emailVerified ? (
                      <span className="badge verified">✅ Verificat</span>
                    ) : (
                      <span className="badge unverified">⏰ Neverificat</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .profile-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          color: white;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          font-size: 1.5rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .header-text h4 {
          margin: 0 0 0.25rem 0;
          font-weight: 600;
        }

        .header-text p {
          margin: 0;
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .profile-body {
          padding: 0;
        }

        .alert {
          margin: 2rem 2rem 0 2rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .alert-success {
          background: #d4edda;
          color: #155724;
          border-left: 4px solid #28a745;
        }

        .alert-error {
          background: #f8d7da;
          color: #721c24;
          border-left: 4px solid #dc3545;
        }

        .edit-form {
          display: flex;
          flex-direction: column;
        }

        .form-section {
          padding: 2rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .form-section:nth-child(2) {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .section-header {
          margin-bottom: 1.5rem;
        }

        .section-header h5 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
        }

        .section-header p {
          margin: 0;
          color: #64748b;
          font-size: 0.9rem;
        }

        .image-upload-area {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .image-container {
          position: relative;
          cursor: pointer;
        }

        .profile-image-edit {
          width: 120px;
          height: 120px;
          border-radius: 20px;
          object-fit: cover;
          border: 4px solid white;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .image-container:hover .profile-image-edit {
          transform: scale(1.05);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(102, 126, 234, 0.9);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          color: white;
          text-align: center;
        }

        .image-container:hover .image-overlay {
          opacity: 1;
        }

        .overlay-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .image-info {
          flex: 1;
        }

        .image-info p {
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .image-specs {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .image-specs span {
          font-size: 0.8rem;
          color: #6b7280;
          padding: 0.25rem 0.75rem;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 8px;
          border-left: 3px solid #6366f1;
        }

        .form-grid {
          display: grid;
          gap: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .label-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .error-msg {
          color: #dc2626;
          font-size: 0.875rem;
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border-radius: 8px;
          border-left: 4px solid #ef4444;
        }

        .help-text {
          font-size: 0.8rem;
          color: #6b7280;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .readonly-field {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem 1.25rem;
        }

        .readonly-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .email-value {
          font-weight: 500;
          color: #374151;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .badge.verified {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .badge.unverified {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .form-actions {
          padding: 2rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          border: 2px solid;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .btn-secondary {
          background: white;
          border-color: #d1d5db;
          color: #6b7280;
        }

        .btn-secondary:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .display-mode {
          padding: 2rem;
        }

        .image-display {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .profile-image-display {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          object-fit: cover;
          border: 3px solid #e2e8f0;
        }

        .image-display h6 {
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: 1px solid #3b82f6;
          background: white;
          color: #3b82f6;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .info-display {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          margin-bottom: 1rem;
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .info-item:last-child {
          margin-bottom: 0;
        }

        .info-item:hover {
          background: #edf2f7;
          transform: translateY(-1px);
        }

        .info-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #3182ce;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .info-item label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .info-item p {
          margin: 0;
          font-weight: 500;
          color: #2d3748;
          font-size: 1rem;
        }

        .email-display {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .text-muted {
          color: #6b7280;
        }

        .btn-link {
          background: none;
          border: none;
          color: #3b82f6;
          text-decoration: underline;
          cursor: pointer;
          font-size: inherit;
          margin-left: 0.5rem;
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: stretch;
          }

          .header-info {
            justify-content: center;
            text-align: center;
          }

          .edit-btn {
            width: 100%;
            justify-content: center;
          }

          .form-section {
            padding: 1.5rem;
          }

          .image-upload-area {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }

          .image-display {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .info-item {
            flex-direction: column;
            text-align: center;
            gap: 0.75rem;
          }

          .info-icon {
            align-self: center;
          }

          .readonly-content {
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileInfo;