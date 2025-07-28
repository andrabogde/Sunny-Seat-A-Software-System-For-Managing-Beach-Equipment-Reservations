import React, { useState, useEffect } from 'react';
import PositiveNumberInput from '../components/common/PositiveNumberInput';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({});
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  const Icon = ({ name, size = 18, className = "" }) => {
    const icons = {
      settings: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      user: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      mail: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-10 5L2 7"></path>
        </svg>
      ),
      shield: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
      bell: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
      ),
      creditCard: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
          <line x1="1" y1="10" x2="23" y2="10"></line>
        </svg>
      ),
      database: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"></path>
          <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"></path>
        </svg>
      ),
      globe: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
      ),
      check: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      ),
      x: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m18 6-12 12"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      ),
      save: (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17,21 17,13 7,13 7,21"></polyline>
          <polyline points="7,3 7,8 15,8"></polyline>
        </svg>
      )
    };
    
    return icons[name] || icons.settings;
  };

  const mockSettings = {
    general: {
      siteName: 'SunnySeat',
      siteDescription: 'Platforma de rezervare a șezlongurilor pe plajă',
      contactEmail: 'admin@sunnyseat.ro',
      contactPhone: '0231456789',
      address: 'Bulevardul Mamaia 123, Constanța',
      timezone: 'Europe/Bucharest',
      language: 'ro',
      currency: 'RON'
    },
    payment: {
      enableOnlinePayments: true,
      paymentMethods: ['card', 'transfer', 'cash'],
      defaultCommission: 15,
      minBookingAmount: 20,
      maxBookingAmount: 1000,
      refundPolicy: 'flexible',
      paymentGateway: 'stripe'
    },
    /* notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      notifyNewBookings: true,
      notifyPayments: true,
      notifyCancellations: true,
      notifyReviews: false,
      adminEmail: 'admin@sunnyseat.ro'
    }, */
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: 'medium',
      loginAttempts: 5,
      enableLogging: true,
      dataRetention: 365
    }
    /* api: {
      apiEnabled: true,
      rateLimiting: true,
      requestsPerMinute: 100,
      apiVersion: 'v1',
      webhookEnabled: false,
      webhookUrl: ''
    } */
  };

  useEffect(() => {
    setSettings(mockSettings);
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'payment', label: 'Plăți', icon: 'creditCard' },
    // { id: 'notifications', label: 'Notificări', icon: 'bell' },
    { id: 'security', label: 'Securitate', icon: 'shield' }
    // { id: 'api', label: 'API', icon: 'globe' }
  ];

  const handleSave = () => {
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const GeneralSettings = () => (
    <div className="space-y-4">
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Nume Site</label>
          <input 
            type="text" 
            className="form-control" 
            value={settings.general?.siteName || ''}
            onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Limba</label>
          <select 
            className="form-select"
            value={settings.general?.language || 'ro'}
            onChange={(e) => updateSetting('general', 'language', e.target.value)}
          >
            <option value="ro">Română</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label fw-semibold">Descriere Site</label>
        <textarea 
          className="form-control" 
          rows="3"
          value={settings.general?.siteDescription || ''}
          onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
        />
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Email Contact</label>
          <input 
            type="email" 
            className="form-control" 
            value={settings.general?.contactEmail || ''}
            onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Telefon Contact</label>
          <input 
            type="tel" 
            className="form-control" 
            value={settings.general?.contactPhone || ''}
            onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label fw-semibold">Adresă</label>
        <input 
          type="text" 
          className="form-control" 
          value={settings.general?.address || ''}
          onChange={(e) => updateSetting('general', 'address', e.target.value)}
        />
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Fus Orar</label>
          <select 
            className="form-select"
            value={settings.general?.timezone || 'Europe/Bucharest'}
            onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
          >
            <option value="Europe/Bucharest">Europe/Bucharest</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Monedă</label>
          <select 
            className="form-select"
            value={settings.general?.currency || 'RON'}
            onChange={(e) => updateSetting('general', 'currency', e.target.value)}
          >
            <option value="RON">RON</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>
    </div>
  );

  const PaymentSettings = () => (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            checked={settings.payment?.enableOnlinePayments || false}
            onChange={(e) => updateSetting('payment', 'enableOnlinePayments', e.target.checked)}
          />
          <label className="form-check-label fw-semibold">
            Activează plățile online
          </label>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Comision implicit (%)</label>
          <PositiveNumberInput 
            // type="number" 
            className="form-control" 
            value={settings.payment?.defaultCommission || ''}
            onChange={(e) => updateSetting('payment', 'defaultCommission', parseInt(e.target.value))}
            min="0"
            max="100"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Gateway de plată</label>
          <select 
            className="form-select"
            value={settings.payment?.paymentGateway || 'stripe'}
            onChange={(e) => updateSetting('payment', 'paymentGateway', e.target.value)}
          >
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="netopia">Netopia</option>
          </select>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Suma minimă rezervare (RON)</label>
          <PositiveNumberInput 
            // type="number" 
            className="form-control" 
            value={settings.payment?.minBookingAmount || ''}
            onChange={(e) => updateSetting('payment', 'minBookingAmount', parseInt(e.target.value))}
            min="1"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Suma maximă rezervare (RON)</label>
          <PositiveNumberInput 
            // type="number" 
            className="form-control" 
            value={settings.payment?.maxBookingAmount || ''}
            onChange={(e) => updateSetting('payment', 'maxBookingAmount', parseInt(e.target.value))}
            min="1"
          />
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label fw-semibold">Politica de rambursare</label>
        <select 
          className="form-select"
          value={settings.payment?.refundPolicy || 'flexible'}
          onChange={(e) => updateSetting('payment', 'refundPolicy', e.target.value)}
        >
          <option value="flexible">Flexibilă</option>
          <option value="moderate">Moderată</option>
          <option value="strict">Strictă</option>
        </select>
      </div>
      
      <div className="mb-3">
        <label className="form-label fw-semibold">Metode de plată acceptate</label>
        <div className="mt-2">
          {['card', 'transfer', 'cash'].map(method => (
            <div key={method} className="form-check">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={settings.payment?.paymentMethods?.includes(method) || false}
                onChange={(e) => {
                  const methods = settings.payment?.paymentMethods || [];
                  if (e.target.checked) {
                    updateSetting('payment', 'paymentMethods', [...methods, method]);
                  } else {
                    updateSetting('payment', 'paymentMethods', methods.filter(m => m !== method));
                  }
                }}
              />
              <label className="form-check-label">
                {method === 'card' ? 'Card bancar' : method === 'transfer' ? 'Transfer bancar' : 'Numerar'}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* const NotificationSettings = () => (
    <div className="space-y-4">
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">Tipuri de notificări</h6>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={settings.notifications?.emailNotifications || false}
                onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
              />
              <label className="form-check-label">Email</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={settings.notifications?.smsNotifications || false}
                onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
              />
              <label className="form-check-label">SMS</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={settings.notifications?.pushNotifications || false}
                onChange={(e) => updateSetting('notifications', 'pushNotifications', e.target.checked)}
              />
              <label className="form-check-label">Push</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">Evenimente pentru notificare</h6>
        <div className="space-y-2">
          {[
            { key: 'notifyNewBookings', label: 'Rezervări noi' },
            { key: 'notifyPayments', label: 'Plăți confirmate' },
            { key: 'notifyCancellations', label: 'Anulări' },
            { key: 'notifyReviews', label: 'Recenzii noi' }
          ].map(item => (
            <div key={item.key} className="form-check form-switch">
              <input 
                className="form-check-input" 
                type="checkbox" 
                checked={settings.notifications?.[item.key] || false}
                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
              />
              <label className="form-check-label">{item.label}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-3">
        <label className="form-label fw-semibold">Email administrator pentru notificări</label>
        <input 
          type="email" 
          className="form-control" 
          value={settings.notifications?.adminEmail || ''}
          onChange={(e) => updateSetting('notifications', 'adminEmail', e.target.value)}
        />
      </div>
    </div>
  ); */

  const SecuritySettings = () => (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            checked={settings.security?.twoFactorAuth || false}
            onChange={(e) => updateSetting('security', 'twoFactorAuth', e.target.checked)}
          />
          <label className="form-check-label fw-semibold">
            Autentificare cu doi factori (2FA)
          </label>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Timeout sesiune (minute)</label>
          <PositiveNumberInput 
            // type="number" 
            className="form-control" 
            value={settings.security?.sessionTimeout || ''}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="1440"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Tentative de login permise</label>
          <PositiveNumberInput 
            // type="number" 
            className="form-control" 
            value={settings.security?.loginAttempts || ''}
            onChange={(e) => updateSetting('security', 'loginAttempts', parseInt(e.target.value))}
            min="3"
            max="10"
          />
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Politica de parole</label>
          <select 
            className="form-select"
            value={settings.security?.passwordPolicy || 'medium'}
            onChange={(e) => updateSetting('security', 'passwordPolicy', e.target.value)}
          >
            <option value="weak">Slabă (min 6 caractere)</option>
            <option value="medium">Medie (min 8 caractere, cifre)</option>
            <option value="strong">Puternică (min 12 caractere, simboluri)</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Retenție date (zile)</label>
          <PositiveNumberInput 
            // type="number" 
            className="form-control" 
            value={settings.security?.dataRetention || ''}
            onChange={(e) => updateSetting('security', 'dataRetention', parseInt(e.target.value))}
            min="30"
            max="3650"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            checked={settings.security?.enableLogging || false}
            onChange={(e) => updateSetting('security', 'enableLogging', e.target.checked)}
          />
          <label className="form-check-label fw-semibold">
            Activează jurnalizarea activității
          </label>
        </div>
      </div>
    </div>
  );

  /* const ApiSettings = () => (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            checked={settings.api?.apiEnabled || false}
            onChange={(e) => updateSetting('api', 'apiEnabled', e.target.checked)}
          />
          <label className="form-check-label fw-semibold">
            Activează API
          </label>
        </div>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Versiune API</label>
          <select 
            className="form-select"
            value={settings.api?.apiVersion || 'v1'}
            onChange={(e) => updateSetting('api', 'apiVersion', e.target.value)}
          >
            <option value="v1">v1</option>
            <option value="v2">v2 (Beta)</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Cereri per minut</label>
          <input 
            type="number" 
            className="form-control" 
            value={settings.api?.requestsPerMinute || ''}
            onChange={(e) => updateSetting('api', 'requestsPerMinute', parseInt(e.target.value))}
            min="10"
            max="1000"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            checked={settings.api?.rateLimiting || false}
            onChange={(e) => updateSetting('api', 'rateLimiting', e.target.checked)}
          />
          <label className="form-check-label fw-semibold">
            Limitare rată cereri
          </label>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="form-check form-switch">
          <input 
            className="form-check-input" 
            type="checkbox" 
            checked={settings.api?.webhookEnabled || false}
            onChange={(e) => updateSetting('api', 'webhookEnabled', e.target.checked)}
          />
          <label className="form-check-label fw-semibold">
            Activează Webhooks
          </label>
        </div>
      </div>
      
      {settings.api?.webhookEnabled && (
        <div className="mb-3">
          <label className="form-label fw-semibold">URL Webhook</label>
          <input 
            type="url" 
            className="form-control" 
            value={settings.api?.webhookUrl || ''}
            onChange={(e) => updateSetting('api', 'webhookUrl', e.target.value)}
            placeholder="https://api.yoursite.com/webhook"
          />
        </div>
      )}
      
      <div className="alert alert-info">
        <h6 className="alert-heading">Informații API</h6>
        <p className="mb-2">
          <strong>Endpoint de bază:</strong> https://api.sunnyseat.ro/{settings.api?.apiVersion || 'v1'}/
        </p>
        <p className="mb-0">
          <strong>Documentație:</strong> <a href="#" className="alert-link">Vizualizează documentația API</a>
        </p>
      </div>
    </div>
  ); */

  const renderTabContent = () => {
    switch(activeTab) {
      case 'general': return <GeneralSettings />;
      case 'payment': return <PaymentSettings />;
      // case 'notifications': return <NotificationSettings />;
      case 'security': return <SecuritySettings />;
      // case 'api': return <ApiSettings />;
      default: return <GeneralSettings />;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Setări Sistem</h2>
          <p className="text-muted mb-0">Configurează sistemul și preferințele aplicației</p>
        </div>
        <button className="btn btn-success" onClick={handleSave}>
          <Icon name="save" size={18} className="me-2" />
          Salvează Modificările
        </button>
      </div>

      {showSaveNotification && (
        <div className="alert alert-success alert-dismissible fade show mb-4">
          <Icon name="check" size={18} className="me-2" />
          Setările au fost salvate cu succes!
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowSaveNotification(false)}
          ></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-3">
          <div className="bg-white rounded-lg shadow-sm border p-0">
            <div className="list-group list-group-flush">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`list-group-item list-group-item-action d-flex align-items-center ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon name={tab.icon} size={18} className="me-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="mb-4">
              <h4 className="fw-bold mb-2">
                <Icon name={tabs.find(t => t.id === activeTab)?.icon} size={24} className="me-2" />
                {tabs.find(t => t.id === activeTab)?.label}
              </h4>
              <hr />
            </div>
            
            {renderTabContent()}
            
            <div className="mt-4 pt-4 border-top d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary">
                Resetează
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Icon name="save" size={16} className="me-2" />
                Salvează
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;