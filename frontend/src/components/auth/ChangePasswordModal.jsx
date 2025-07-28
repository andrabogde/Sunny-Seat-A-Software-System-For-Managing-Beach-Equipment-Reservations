import React, { useState } from 'react';

const ChangePasswordModal = ({ show, onHide, onSuccess, onPasswordChange }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'danger' });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Parola curentă este obligatorie';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Parola nouă este obligatorie';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Parola nouă trebuie să aibă cel puțin 6 caractere';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu se potrivesc';
    }
    
    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'Parola nouă trebuie să fie diferită de cea curentă';
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setAlert({ show: false, message: '', type: 'danger' });

    try {
      const result = await onPasswordChange(formData.currentPassword, formData.newPassword);

      if (result.success) {
        setAlert({
          show: true,
          message: 'Parola a fost schimbată cu succes!',
          type: 'success'
        });

        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        if (result.field && result.field === 'currentPassword') {
          setErrors({ currentPassword: result.message });
        } else {
          setAlert({
            show: true,
            message: result.message,
            type: 'danger'
          });
        }
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setAlert({
        show: true,
        message: 'A apărut o eroare neașteptată',
        type: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setAlert({ show: false, message: '', type: 'danger' });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              🔐 Schimbă parola
            </h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
                  {alert.message}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setAlert({ show: false, message: '', type: 'danger' })}
                  ></button>
                </div>
              )}

              {/* Parola curentă */}
              <div className="mb-3">
                <label className="form-label">Parola curentă *</label>
                <div className="input-group">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    name="currentPassword"
                    className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Introdu parola curentă"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => togglePasswordVisibility('current')}
                    disabled={loading}
                  >
                    {showPasswords.current ? '🙈' : '👁️'}
                  </button>
                  {errors.currentPassword && (
                    <div className="invalid-feedback">
                      {errors.currentPassword}
                    </div>
                  )}
                </div>
              </div>

              {/* Parola nouă */}
              <div className="mb-3">
                <label className="form-label">Parola nouă *</label>
                <div className="input-group">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Introdu parola nouă (min. 6 caractere)"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={loading}
                  >
                    {showPasswords.new ? '🙈' : '👁️'}
                  </button>
                  {errors.newPassword && (
                    <div className="invalid-feedback">
                      {errors.newPassword}
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmă parola nouă */}
              <div className="mb-3">
                <label className="form-label">Confirmă parola nouă *</label>
                <div className="input-group">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirmă parola nouă"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={loading}
                  >
                    {showPasswords.confirm ? '🙈' : '👁️'}
                  </button>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>

              <div className="alert alert-info">
                <strong>Cerințe parolă:</strong>
                <ul className="mb-0 mt-1">
                  <li>Minimum 6 caractere</li>
                  <li>Diferită de parola curentă</li>
                </ul>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose} 
                disabled={loading}
              >
                Anulează
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Se schimbă...
                  </>
                ) : (
                  <>
                    🔐 Schimbă parola
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;