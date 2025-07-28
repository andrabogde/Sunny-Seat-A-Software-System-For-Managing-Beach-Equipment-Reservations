import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  IconEye, 
  IconEyeOff, 
  IconMail, 
  IconLock, 
  IconUser, 
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconId,
  IconUsers,
  IconUserCheck
} from '@tabler/icons-react';

/**
 * Componentă modernizată pentru formularul de înregistrare cu suport pentru manageri
 */
const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  
  // CONSTANTA PENTRU BACKEND URL
  const BACKEND_URL = 'http://localhost:8080';
  
  // Tip de cont selectat
  const [accountType, setAccountType] = useState('client'); // 'client' sau 'manager'
  
  // Date utilizator
  const [formData, setFormData] = useState({
    prenume: '',
    nume: '',
    email: '',
    telefon: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // Date firmă (pentru manageri)
  const [firmaData, setFirmaData] = useState({
    cui: '',
    denumire: '',
    adresa: '',
    telefon: '',
    email: '',
    localitateId: ''
  });
  
  // Lista de localități
  const [localitati, setLocalitati] = useState([]);
  
  // Stări UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [cuiCheckLoading, setCuiCheckLoading] = useState(false);
  const [cuiValid, setCuiValid] = useState(null);

  // Încărcăm localitățile la montarea componentei
 // Încărcăm localitățile la montarea componentei
useEffect(() => {
  const loadLocalitati = async () => {
    try {
      console.log('🏘️ Loading localitati from API...');
      const response = await fetch(`${BACKEND_URL}/api/localitati`);
      
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        console.log('✅ Localitati loaded from API:', data);
        
        // Verifică structura datelor
        if (Array.isArray(data) && data.length > 0) {
          setLocalitati(data);
          console.log(`📊 Loaded ${data.length} localitati from API`);
        } else {
          console.warn('⚠️ API returned empty or invalid data, using fallback');
          throw new Error('Empty data from API');
        }
      } else {
        console.warn('⚠️ API response not OK:', response.status);
        throw new Error('API not available or returned non-JSON');
      }
    } catch (error) {
      console.warn('⚠️ API not available, using fallback data:', error.message);
      

      
      // ✅ NOTIFICARE PENTRU DEVELOPER
      if (process.env.NODE_ENV === 'development') {
        console.error('🚨 DEVELOPER NOTICE: Localitati API is not working!');
        console.error('   Expected endpoint: http://localhost:8080/api/localitati');
        console.error('   Please check backend endpoint');
      }
    }
  };
  
  loadLocalitati();
}, []);

  /**
   * Handler pentru schimbarea tipului de cont
   */
  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setErrors({}); // Resetăm erorile când schimbăm tipul
    setCuiValid(null); // Resetăm validarea CUI
  };

  /**
   * Handler pentru câmpurile utilizatorului
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  /**
   * Handler pentru câmpurile firmei
   */
  /**
   * Handler pentru câmpurile firmei - VERSIUNEA CORECTATĂ
   */
  const handleFirmaChange = (e) => {
    const { name, value } = e.target;
    
    // ✅ CORECTARE: Map numele câmpurilor la structura corectă pentru CerereManagerDto
    let fieldName = name;
    let fieldValue = value;
    
    // Mapează câmpurile pentru a fi compatibile cu CerereManagerDto
    if (name === 'telefonFirma') {
      fieldName = 'telefon'; // CerereManagerDto așteaptă 'telefon', nu 'telefonFirma'
    } else if (name === 'emailFirma') {
      fieldName = 'email'; // CerereManagerDto așteaptă 'email', nu 'emailFirma'
    } else if (name === 'localitateId') {
      // Asigură-te că localitateId e număr
      fieldValue = value ? parseInt(value) : '';
    }
    
    setFirmaData({
      ...firmaData,
      [fieldName]: fieldValue
    });
    
    if (errors[name] || errors[fieldName]) {
      setErrors({ 
        ...errors, 
        [name]: null,
        [fieldName]: null 
      });
    }
    
    // Dacă se schimbă CUI-ul, resetăm validarea
    if (name === 'cui') {
      setCuiValid(null);
    }
  };

  /**
   * Verifică disponibilitatea CUI-ului cu debouncing
   */
  const checkCuiDisponibilitate = async (cui) => {
    if (!cui || cui.length < 2) {
      setCuiValid(null);
      return;
    }
    
    try {
      setCuiCheckLoading(true);
      console.log('🔍 Checking CUI availability:', cui);
      
      const response = await fetch(`${BACKEND_URL}/api/cereri-manageri/verifica-cui/${cui}`);
      
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json();
        console.log('✅ CUI check result:', data);
        setCuiValid(data.disponibil);
        return data.disponibil;
      } else {
        console.warn('⚠️ CUI check API not available');
        setCuiValid(null);
        return true; // Presupunem că e disponibil dacă API-ul nu răspunde
      }
    } catch (error) {
      console.warn('⚠️ CUI check error:', error.message);
      setCuiValid(null);
      return true; // Presupunem că e disponibil în caz de eroare
    } finally {
      setCuiCheckLoading(false);
    }
  };

  // Debounced CUI check
  useEffect(() => {
    if (accountType === 'manager' && firmaData.cui) {
      const timer = setTimeout(() => {
        checkCuiDisponibilitate(firmaData.cui);
      }, 500); // Așteaptă 500ms după ultima modificare
      
      return () => clearTimeout(timer);
    }
  }, [firmaData.cui, accountType]);

  /**
   * Validează formularul - VERSIUNEA CORECTATĂ
   */
  const validateForm = async () => {
    const newErrors = {};
    
    // Validări comune
    if (!formData.prenume.trim()) newErrors.prenume = 'Prenumele este obligatoriu';
    if (!formData.nume.trim()) newErrors.nume = 'Numele este obligatoriu';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Adresa de email nu este validă';
    }
    
    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Numărul de telefon este obligatoriu';
    } else if (!/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/.test(formData.telefon)) {
      newErrors.telefon = 'Numărul de telefon nu este valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Parola este obligatorie';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Parola trebuie să aibă minim 6 caractere';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu coincid';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Trebuie să fiți de acord cu termenii și condițiile';
    }
    
    // Validări specifice pentru manager - VERSIUNEA CORECTATĂ
    if (accountType === 'manager') {
      if (!firmaData.cui.trim()) {
        newErrors.cui = 'CUI-ul este obligatoriu';
      } else if (!/^[A-Z0-9]{2,10}$/.test(firmaData.cui.toUpperCase())) {
        newErrors.cui = 'CUI-ul poate conține doar litere mari și cifre (2-10 caractere)';
      } else if (cuiValid === false) {
        newErrors.cui = 'CUI-ul este deja folosit';
      }
      
      if (!firmaData.denumire.trim()) {
        newErrors.denumire = 'Denumirea firmei este obligatorie';
      } else if (firmaData.denumire.length < 3) {
        newErrors.denumire = 'Denumirea trebuie să aibă minim 3 caractere';
      }
      
      if (!firmaData.adresa.trim()) {
        newErrors.adresa = 'Adresa este obligatorie';
      } else if (firmaData.adresa.length < 5) {
        newErrors.adresa = 'Adresa trebuie să aibă minim 5 caractere';
      }
      
      // ✅ CORECTARE: validează 'telefon', nu 'telefonFirma'
      if (!firmaData.telefon.trim()) {
        newErrors.telefon = 'Telefonul firmei este obligatoriu';
      } else if (!/^[0-9]{10}$/.test(firmaData.telefon)) {
        newErrors.telefon = 'Telefonul trebuie să conțină exact 10 cifre';
      }
      
      // ✅ CORECTARE: validează 'email', nu 'emailFirma'
      if (!firmaData.email.trim()) {
        newErrors.email = 'Email-ul firmei este obligatoriu';
      } else if (!/\S+@\S+\.\S+/.test(firmaData.email)) {
        newErrors.email = 'Email-ul firmei nu este valid';
      }
      
      if (!firmaData.localitateId) {
        newErrors.localitateId = 'Localitatea este obligatorie';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handler pentru trimiterea formularului - VERSIUNEA ÎMBUNĂTĂȚITĂ
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!(await validateForm())) {
      return;
    }
    
    try {
      setLoading(true);
      
      console.log('accountType', accountType);

      if (accountType === 'client') {
        // ========== FLOW PENTRU CLIENȚI ==========
        console.log('👤 Registering as CLIENT');
        
        const userData = {
          name: `${formData.prenume} ${formData.nume}`.trim(),
          email: formData.email,
          password: formData.password,
          numarTelefon: formData.telefon
        };
        
        console.log('📤 Sending client registration to /auth/signup:', userData);
        
        const result = await register(userData); // Folosește metoda existentă din AuthContext
        
        if (result.success) {
          console.log('✅ Client registration successful');
          navigate('/', {
            state: {
              message: 'Contul a fost creat cu succes! Bun venit pe SunnySeat!',
              type: 'success'
            }
          });
        } else {
          setErrors({ general: result.error || 'Eroare la înregistrare. Încercați din nou.' });
        }
        
      } else {
        // ========== FLOW PENTRU MANAGERI - VERSIUNEA CORECTĂ ==========
        console.log('🏢 Registering as MANAGER with company data');
        
        // PASUL 1: Înregistrează utilizatorul ca CLIENT normal folosind endpoint-ul standard
        const userData = {
          role: 'MANAGER',
          name: `${formData.prenume} ${formData.nume}`.trim(),
          email: formData.email,
          password: formData.password,
          numarTelefon: formData.telefon
          
        };
        
        console.log('📤 Step 1: Registering user as CLIENT first:', userData);
        
        const userResult = await register(userData); // Folosește metoda existentă din AuthContext
        
        if (!userResult.success) {
          setErrors({ general: userResult.error || 'Eroare la crearea contului de utilizator.' });
          return;
        }
        
        console.log('✅ User registered successfully as CLIENT');
        console.log('🔑 User details:', userResult);
        
        // PASUL 2: Obține userId-ul pentru cererea de manager
        let userId = userResult.user?.id;
        let authToken = userResult.token /*|| token*/ || localStorage.getItem('authToken');
        
        // Dacă nu avem userId din register, încearcă să-l obții din profil
        if (!userId && authToken) {
          console.log('🔍 Getting userId from user profile...');
          
          try {
            const userResponse = await fetch(`${BACKEND_URL}/api/user/profile`, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (userResponse.ok) {
              const userProfile = await userResponse.json();
              userId = userProfile.id;
              console.log('✅ Got userId from profile:', userId);
            } else {
              console.warn('⚠️ Could not get user profile, response:', userResponse.status);
            }
          } catch (profileError) {
            console.warn('⚠️ Error getting user profile:', profileError.message);
          }
        }
        
        if (!userId) {
          console.error('❌ Could not obtain userId for manager request');
          // Totuși, încearcă să faci cererea fără userId - backend-ul ar putea să-l determine din token
          console.log('⚠️ Proceeding without userId, backend should determine it from token');
        }
        
        // PASUL 3: Creează cererea de manager cu structura CORECTĂ pentru CerereManagerDto
        const cerereData = {
          userId: userId, // Va fi setat în backend din token dacă lipsește
          localitateId: parseInt(firmaData.localitateId), // ✅ CORECTARE: localitateId, nu localitate
          cui: firmaData.cui.toUpperCase(),
          denumire: firmaData.denumire,
          adresa: firmaData.adresa,
          telefon: firmaData.telefon, // ✅ CORECTARE: telefon, nu telefonFirma
          email: firmaData.email // ✅ CORECTARE: email, nu emailFirma
        };
        
        console.log('📤 Step 2: Creating manager request with correct structure:', cerereData);
        
        // Salvează token-ul dacă nu e deja salvat
        if (authToken && !localStorage.getItem('authToken')) {
          localStorage.setItem('authToken', authToken);
        }
        
        const cerereResponse = await fetch(`${BACKEND_URL}/api/cereri-manageri`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(cerereData)
        });
        
        console.log('📡 Manager request response status:', cerereResponse.status);
        console.log('📡 Manager request response headers:', Object.fromEntries(cerereResponse.headers.entries()));
        
        const cerereResponseText = await cerereResponse.text();
        console.log('📄 Manager request response body:', cerereResponseText);
        
        if (cerereResponse.ok) {
          try {
            const cerereResult = JSON.parse(cerereResponseText);
            console.log('✅ Manager request created successfully:', cerereResult);
            
            if (cerereResult.success !== false) { // Acceptă și răspunsuri fără câmpul success
              navigate('/', { 
                state: { 
                  message: `🎉 Contul a fost creat cu succes!\n\nSunteți înregistrat ca CLIENT și puteți face rezervări imediat.\n\nCererea pentru firma "${cerereResult.cerere?.denumire || firmaData.denumire}" (CUI: ${cerereResult.cerere?.cui || firmaData.cui}) a fost trimisă și va fi analizată de administratori în maxim 2-3 zile lucrătoare.\n\nVeți primi o notificare prin email când cererea va fi procesată.`,
                  type: 'success'
                }
              });
              return;
            } else {
              console.warn('⚠️ Manager request failed with success=false:', cerereResult.message);
              setErrors({ general: cerereResult.message || 'Cererea de manager nu a putut fi procesată.' });
            }
          } catch (parseError) {
            console.error('❌ JSON parse error for manager request:', parseError);
            console.error('📄 Raw response was:', cerereResponseText);
            
            // Verifică dacă răspunsul pare să fie HTML (eroare de server)
            if (cerereResponseText.includes('<!DOCTYPE') || cerereResponseText.includes('<html')) {
              setErrors({ 
                general: `Serverul a returnat o pagină HTML în loc de JSON.\n\nAcesta indică o problemă cu endpoint-ul /api/cereri-manageri.\n\nVerificați:\n- Dacă backend-ul rulează pe localhost:8080\n- Dacă endpoint-ul /api/cereri-manageri există\n- Dacă nu există o problemă de autentificare`
              });
            } else {
              setErrors({ 
                general: `Răspuns invalid de la server pentru cererea de manager.\n\nRăspuns primit: ${cerereResponseText.substring(0, 200)}...\n\nVerificați în Network Tab pentru mai multe detalii.`
              });
            }
          }
        } else {
          // Gestionează erorile HTTP pentru cererea de manager
          console.error('❌ Manager request HTTP error:', cerereResponse.status, cerereResponse.statusText);
          
          let errorMessage = `Eroare ${cerereResponse.status}: ${cerereResponse.statusText}`;
          
          try {
            const errorData = JSON.parse(cerereResponseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
            
            // Dacă e eroare de validare, arată detaliile
            if (errorData.errors && typeof errorData.errors === 'object') {
              const validationErrors = Object.entries(errorData.errors)
                .map(([field, message]) => `${field}: ${message}`)
                .join('\n');
              errorMessage += '\n\nErori de validare:\n' + validationErrors;
            }
          } catch {
            if (cerereResponseText.includes('<!DOCTYPE') || cerereResponseText.includes('<html')) {
              if (cerereResponse.status === 404) {
                errorMessage = 'Endpoint-ul /api/cereri-manageri nu există. Verificați că backend-ul are acest endpoint implementat.';
              } else if (cerereResponse.status === 401) {
                errorMessage = 'Token de autentificare invalid sau expirat. Încercați să vă reconectați.';
              } else if (cerereResponse.status === 403) {
                errorMessage = 'Nu aveți permisiuni pentru a crea cereri de manager.';
              } else {
                errorMessage = 'Serverul a returnat o pagină HTML în loc de JSON. Verificați configurația backend-ului.';
              }
            } else if (cerereResponseText) {
              errorMessage = `Eroare server: ${cerereResponseText.substring(0, 200)}`;
            }
          }
          
          console.error('❌ Final error message:', errorMessage);
          setErrors({ general: errorMessage });
        }
      }
      
    } catch (err) {
      console.error('❌ Registration error:', err);
      
      let errorMessage = 'Eroare neașteptată. Verificați conexiunea la internet și încercați din nou.';
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Nu se poate conecta la server. Verificați că backend-ul rulează pe localhost:8080.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  return (
    <div className="auth-container">
      {errors.general && (
        <div className="alert alert-danger mb-4 rounded-3 border-0 shadow-sm">
          <i className="ti ti-alert-circle me-2"></i>
          <div style={{ whiteSpace: 'pre-line' }}>{errors.general}</div>
          
          {/* Debugging info pentru erori tehnice */}
          {(errors.general.includes('Eroare') || errors.general.includes('server')) && (
            <div className="mt-3">
              <details>
                <summary className="btn btn-sm btn-outline-danger">
                  Vezi detalii tehnice
                </summary>
                <div className="mt-2 p-2 bg-light rounded">
                  <small>
                    <strong>Backend URL:</strong> {BACKEND_URL}<br/>
                    <strong>Endpoint Manager:</strong> {BACKEND_URL}/auth/signup-manager<br/>
                    <strong>Tip cont:</strong> {accountType}<br/>
                    <strong>Soluții posibile:</strong>
                    <ul className="mb-0 mt-1">
                      <li>Verifică că backend-ul rulează pe localhost:8080</li>
                      <li>Verifică că endpoint-ul /auth/signup-manager există în backend</li>
                      <li>Verifică în Network Tab (F12) detaliile request-ului</li>
                      <li>Testează direct endpoint-ul în Swagger</li>
                    </ul>
                  </small>
                </div>
              </details>
            </div>
          )}
        </div>
      )}
      
      {/* Selector tip cont */}
      <div className="mb-4">
        <h6 className="fw-semibold mb-3">Tipul contului</h6>
        <div className="row g-2">
          <div className="col-6">
            <button
              type="button"
              className={`btn w-100 py-3 rounded-3 border ${
                accountType === 'client' 
                  ? 'btn-primary' 
                  : 'btn-outline-primary'
              }`}
              onClick={() => handleAccountTypeChange('client')}
              disabled={loading}
            >
              <IconUsers className="mb-2" size={24} />
              <div className="fw-semibold">Client</div>
              <small className="text-muted">Pentru rezervări</small>
            </button>
          </div>
          <div className="col-6">
            <button
              type="button"
              className={`btn w-100 py-3 rounded-3 border ${
                accountType === 'manager' 
                  ? 'btn-primary' 
                  : 'btn-outline-primary'
              }`}
              onClick={() => handleAccountTypeChange('manager')}
              disabled={loading}
            >
              <IconUserCheck className="mb-2" size={24} />
              <div className="fw-semibold">Manager</div>
              <small className="text-muted">Pentru plaje</small>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-4">
        {/* Secțiunea date utilizator */}
        <div className="card border-0 shadow-sm rounded-3 mb-4">
          <div className="card-header bg-light py-3">
            <h6 className="fw-semibold mb-0">
              <IconUser className="me-2" size={20} />
              Date personale
            </h6>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              {/* Prenume Field */}
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="form-floating">
                  <div className="position-relative">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control rounded-3 ${errors.prenume ? 'is-invalid' : ''}`}
                        style={{ paddingLeft: '45px' }}
                        id="prenume"
                        name="prenume"
                        placeholder="Prenumele tău"
                        required
                        value={formData.prenume}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label htmlFor="prenume" style={{ paddingLeft: '45px' }}>Prenume</label>
                    </div>
                    <IconUser
                      className="position-absolute text-muted"
                      style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                      size={18}
                    />
                    {errors.prenume && <div className="invalid-feedback">{errors.prenume}</div>}
                  </div>
                </div>
              </div>
              
              {/* Nume Field */}
              <div className="col-md-6">
                <div className="form-floating">
                  <div className="position-relative">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control rounded-3 ${errors.nume ? 'is-invalid' : ''}`}
                        style={{ paddingLeft: '45px' }}
                        id="nume"
                        name="nume"
                        placeholder="Numele tău"
                        required
                        value={formData.nume}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label htmlFor="nume" style={{ paddingLeft: '45px' }}>Nume</label>
                    </div>
                    <IconUser
                      className="position-absolute text-muted"
                      style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                      size={18}
                    />
                    {errors.nume && <div className="invalid-feedback">{errors.nume}</div>}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email Field */}
            <div className="form-floating mb-3">
              <div className="position-relative">
                <div className="form-floating">
                  <input
                    type="email"
                    className={`form-control rounded-3 ${errors.email ? 'is-invalid' : ''}`}
                    style={{ paddingLeft: '45px' }}
                    id="email"
                    name="email"
                    placeholder="nume@exemplu.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="email" style={{ paddingLeft: '45px' }}>Adresă Email</label>
                </div>
                <IconMail
                  className="position-absolute text-muted"
                  style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  size={18}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
            </div>
            
            {/* Telefon Field */}
            <div className="form-floating mb-3">
              <div className="position-relative">
                <div className="form-floating">
                  <input
                    type="tel"
                    className={`form-control rounded-3 ${errors.telefon ? 'is-invalid' : ''}`}
                    style={{ paddingLeft: '45px' }}
                    id="telefon"
                    name="telefon"
                    placeholder="+40 700 000 000"
                    required  
                    value={formData.telefon}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="telefon" style={{ paddingLeft: '45px' }}>Telefon</label>
                </div>
                <IconPhone
                  className="position-absolute text-muted"
                  style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  size={18}
                />
                {errors.telefon && <div className="invalid-feedback">{errors.telefon}</div>}
              </div>
            </div>
            
            {/* Password Field */}
            <div className="form-floating mb-3">
              <div className="position-relative">
                <div className="form-floating">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control rounded-3 ${errors.password ? 'is-invalid' : ''}`}
                    style={{ paddingLeft: '45px', paddingRight: '45px' }}
                    id="password"
                    name="password"
                    placeholder="Parola ta"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="password" style={{ paddingLeft: '45px' }}>Parolă</label>
                </div>
                <IconLock
                  className="position-absolute text-muted"
                  style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  size={18}
                />
                <button
                  type="button"
                  className="btn position-absolute bg-transparent border-0 p-0"
                  style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                  disabled={loading}
                >
                  {showPassword ? (
                    <IconEyeOff size={18} className="text-muted" />
                  ) : (
                    <IconEye size={18} className="text-muted" />
                  )}
                </button>
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>
            </div>
            
            {/* Confirm Password Field */}
            <div className="form-floating">
              <div className="position-relative">
                <div className="form-floating">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control rounded-3 ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    style={{ paddingLeft: '45px', paddingRight: '45px' }}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirmă parola"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <label htmlFor="confirmPassword" style={{ paddingLeft: '45px' }}>Confirmă Parola</label>
                </div>
                <IconLock
                  className="position-absolute text-muted"
                  style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  size={18}
                />
                <button
                  type="button"
                  className="btn position-absolute bg-transparent border-0 p-0"
                  style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                  onClick={toggleConfirmPasswordVisibility}
                  tabIndex="-1"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <IconEyeOff size={18} className="text-muted" />
                  ) : (
                    <IconEye size={18} className="text-muted" />
                  )}
                </button>
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Secțiunea date firmă (doar pentru manageri) */}
        {accountType === 'manager' && (
          <div className="card border-0 shadow-sm rounded-3 mb-4">
            <div className="card-header bg-warning bg-opacity-10 py-3">
              <h6 className="fw-semibold mb-0">
                <IconBuilding className="me-2" size={20} />
                Date firmă
              </h6>
              <small className="text-muted">Aceste informații vor fi verificate de administratori</small>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                {/* CUI Field cu verificare în timp real */}
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="form-floating">
                    <div className="position-relative">
                      <div className="form-floating">
                        <input
                          type="text"
                          className={`form-control rounded-3 ${
                            errors.cui ? 'is-invalid' : 
                            cuiValid === true ? 'is-valid' : 
                            cuiValid === false ? 'is-invalid' : ''
                          }`}
                          style={{ paddingLeft: '45px', paddingRight: cuiCheckLoading ? '45px' : '15px' }}
                          id="cui"
                          name="cui"
                          placeholder="RO12345678"
                          required
                          value={firmaData.cui}
                          onChange={handleFirmaChange}
                          disabled={loading}
                        />
                        <label htmlFor="cui" style={{ paddingLeft: '45px' }}>CUI</label>
                      </div>
                      <IconId
                        className="position-absolute text-muted"
                        style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                        size={18}
                      />
                      {cuiCheckLoading && (
                        <div 
                          className="position-absolute" 
                          style={{ right: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                        >
                          <div className="spinner-border spinner-border-sm text-primary" role="status">
                            <span className="visually-hidden">Se verifică...</span>
                          </div>
                        </div>
                      )}
                      {errors.cui && <div className="invalid-feedback">{errors.cui}</div>}
                      {!errors.cui && cuiValid === true && (
                        <div className="valid-feedback">CUI disponibil</div>
                      )}
                      {!errors.cui && cuiValid === false && (
                        <div className="invalid-feedback">CUI deja folosit</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Localitate Field */}
                <div className="col-md-6">
                  <div className="form-floating">
                    <div className="position-relative">
                      <div className="form-floating">
                        <select
                          className={`form-select rounded-3 ${errors.localitateId ? 'is-invalid' : ''}`}
                          style={{ paddingLeft: '45px' }}
                          id="localitateId"
                          name="localitateId"
                          required
                          value={firmaData.localitateId}
                          onChange={handleFirmaChange}
                          disabled={loading}
                        >
                          <option value="">Selectează localitatea</option>
                          {localitati.map(localitate => (
                            <option key={localitate.id} value={localitate.id}>
                              {localitate.denumire}
                            </option>
                          ))}
                        </select>
                        <label htmlFor="localitateId" style={{ paddingLeft: '45px' }}>Localitatea</label>
                      </div>
                      <IconMapPin
                        className="position-absolute text-muted"
                        style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                        size={18}
                      />
                      {errors.localitateId && <div className="invalid-feedback">{errors.localitateId}</div>}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Denumire firmă */}
              <div className="form-floating mb-3">
                <div className="position-relative">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control rounded-3 ${errors.denumire ? 'is-invalid' : ''}`}
                      style={{ paddingLeft: '45px' }}
                      id="denumire"
                      name="denumire"
                      placeholder="SC Exemplu SRL"
                      required
                      value={firmaData.denumire}
                      onChange={handleFirmaChange}
                      disabled={loading}
                    />
                    <label htmlFor="denumire" style={{ paddingLeft: '45px' }}>Denumirea firmei</label>
                  </div>
                  <IconBuilding
                    className="position-absolute text-muted"
                    style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                    size={18}
                  />
                  {errors.denumire && <div className="invalid-feedback">{errors.denumire}</div>}
                </div>
              </div>
              
              {/* Adresă */}
              <div className="form-floating mb-3">
                <div className="position-relative">
                  <div className="form-floating">
                    <input
                      type="text"
                      className={`form-control rounded-3 ${errors.adresa ? 'is-invalid' : ''}`}
                      style={{ paddingLeft: '45px' }}
                      id="adresa"
                      name="adresa"
                      placeholder="Str. Exemplu nr. 123"
                      required
                      value={firmaData.adresa}
                      onChange={handleFirmaChange}
                      disabled={loading}
                    />
                    <label htmlFor="adresa" style={{ paddingLeft: '45px' }}>Adresa</label>
                  </div>
                  <IconMapPin
                    className="position-absolute text-muted"
                    style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
                    size={18}
                  />
                  {errors.adresa && <div className="invalid-feedback">{errors.adresa}</div>}
                </div>
              </div>
              
              <div className="row">
                 {/* Telefon firmă - CORECTARE */}
  <div className="col-md-6 mb-3 mb-md-0">
    <div className="form-floating">
      <div className="position-relative">
        <div className="form-floating">
          <input
            type="tel"
            className={`form-control rounded-3 ${errors.telefon ? 'is-invalid' : ''}`}
            style={{ paddingLeft: '45px' }}
            id="telefon"
            name="telefon"  // ✅ CORECTARE: name="telefon", nu "telefonFirma"
            placeholder="0700000000"
            required
            value={firmaData.telefon}  // ✅ CORECTARE: firmaData.telefon
            onChange={handleFirmaChange}
            disabled={loading}
          />
          <label htmlFor="telefon" style={{ paddingLeft: '45px' }}>Telefon firmă</label>
        </div>
        <IconPhone
          className="position-absolute text-muted"
          style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          size={18}
        />
        {errors.telefon && <div className="invalid-feedback">{errors.telefon}</div>}
      </div>
    </div>
  </div>
  
  {/* Email firmă - CORECTARE */}
  <div className="col-md-6">
    <div className="form-floating">
      <div className="position-relative">
        <div className="form-floating">
          <input
            type="email"
            className={`form-control rounded-3 ${errors.email ? 'is-invalid' : ''}`}
            style={{ paddingLeft: '45px' }}
            id="emailFirma"
            name="email"  // ✅ CORECTARE: name="email", nu "emailFirma"
            placeholder="contact@firma.ro"
            required
            value={firmaData.email}  // ✅ CORECTARE: firmaData.email
            onChange={handleFirmaChange}
            disabled={loading}
          />
          <label htmlFor="emailFirma" style={{ paddingLeft: '45px' }}>Email firmă</label>
        </div>
        <IconMail
          className="position-absolute text-muted"
          style={{ left: '15px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
          size={18}
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>
    </div>
  </div>
</div>
              
              {/* Notificare pentru manageri */}
              <div className="alert alert-info border-0 rounded-3 mt-3">
                <div className="d-flex">
                  <IconBuilding className="me-2 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <strong>Informație importantă:</strong>
                    <p className="mb-0 mt-1">
                      Cererea dumneavoastră va fi analizată de administratori. 
                      Veți fi notificat prin email despre statusul cererii în maxim 2-3 zile lucrătoare.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Terms Checkbox */}
        <div className={`form-check mb-4 ${errors.agreeTerms ? 'is-invalid' : ''}`}>
          <input
            type="checkbox"
            className="form-check-input"
            id="agreeTerms"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleChange}
            disabled={loading}
            required
          />
          <label className="form-check-label" htmlFor="agreeTerms">
            Sunt de acord cu <Link to="/termeni-conditii" target="_blank" className="text-primary">Termenii și Condițiile</Link>
            {accountType === 'manager' && (
              <span> și înțeleg că datele firmei vor fi verificate</span>
            )}
          </label>
          {errors.agreeTerms && <div className="invalid-feedback d-block">{errors.agreeTerms}</div>}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100 py-3 rounded-3 fw-semibold"
          disabled={loading || (accountType === 'manager' && cuiValid === false)}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Se procesează...
            </>
          ) : (
            <>
              {accountType === 'client' ? 'Creează cont CLIENT' : 'Creează cont + Cerere MANAGER'}
              <div className="small mt-1 opacity-75">
                {accountType === 'client' 
                  ? 'Vei putea face rezervări imediat' 
                  : 'Vei fi CLIENT până la aprobarea cererii'
                }
              </div>
            </>
          )}
        </button>
      </form>
      
      {/* Link către login */}
      <div className="text-center">
        <p className="text-muted">
          Ai deja cont? <Link to="/login" className="text-primary fw-semibold">Conectează-te</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;