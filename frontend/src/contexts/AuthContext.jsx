// src/contexts/AuthContext.js
// VERSIUNEA COMPLETĂ CU FUNCȚIILE DE RESET PAROLĂ INTEGRATE

import React, { createContext, useState, useEffect } from 'react';

// Creare context pentru autentificare
export const AuthContext = createContext();

/**
 * Provider pentru context-ul de autentificare
 * Gestionează starea de autentificare și oferă metodele necesare
 */
export const AuthProvider = ({ children }) => {
  // Starea pentru datele utilizatorului autentificat
  const [user, setUser] = useState(null);
  // Starea pentru verificarea dacă utilizatorul este autentificat
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Starea pentru loading în timp ce verificăm autentificarea
  const [loading, setLoading] = useState(true);

  // Verificăm autentificarea la încărcarea aplicației
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 INIT AUTH - Start');
      
      const token = localStorage.getItem('authToken');
      console.log('🔑 Token din localStorage:', token ? 'EXISTS' : 'MISSING');
      
      if (!token) {
        console.log('🏁 INIT AUTH - No token, setez loading = false');
        setLoading(false);
        return;
      }

      console.log('🔍 Verificare token la startup...');
      
      try {
        // OPȚIUNEA 1: Încearcă să decodezi JWT-ul local (nu necesar request la server)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          console.log('❌ Token expirat local');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
          setLoading(false);
          return;
        }
        
        // OPȚIUNEA 2: Sau folosește un endpoint care există (ex: /profile sau /user/me)
        const response = await fetch('http://localhost:8080/user/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        console.log('📡 Profile response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('✅ Token valid, utilizator găsit:', userData);
          
          const transformedUser = transformUserData({ user: userData, accessToken: token });
          setUser(transformedUser);
          setIsAuthenticated(true);
        } else {
          console.log('❌ Token invalid sau expired, response:', response.status);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
        
      } catch (error) {
        console.error('❌ Eroare la verificarea token-ului:', error);
        
        // OPȚIUNEA 3: Dacă nu ai endpoint de verificare, doar restaurează din localStorage
        const savedUser = localStorage.getItem('userData');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            console.log('🔄 Restaurare user din localStorage:', parsedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (parseError) {
            console.error('❌ Eroare parsare user din localStorage:', parseError);
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
          }
        }
      } finally {
        console.log('🏁 INIT AUTH - Finalizare, setez loading = false');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Transformă datele utilizatorului din API în formatul aplicației
   * @param {Object} apiUserData - Datele utilizatorului din API
   * @returns {Object} - Datele transformate
   */
  const transformUserData = (apiUserData) => {
    console.log('🔧 Transformare date utilizator din API:', apiUserData);
    
    // Verificăm structura datelor primite
    const userData = apiUserData.user || apiUserData;
    console.log('📋 Date utilizator de procesat:', userData);
    
    // ✅ CĂUTARE INTENSIVĂ A ROLULUI
    console.log('🔍 CĂUTARE INTENSIVĂ ROL:');
    
    // Toate locațiile posibile unde poate fi rolul
    const rolePaths = [
      userData.role,
      userData.user_role,
      userData.userRole,
      userData.authorities?.[0],
      userData.roles?.[0],
      apiUserData.role,
      apiUserData.user_role,
      apiUserData.userRole,
      apiUserData.authorities?.[0],
      apiUserData.roles?.[0]
    ];
    
    console.log('📍 Toate căile verificate pentru rol:', rolePaths);
    
    // Găsim primul rol valid
    let userRole = null;
    for (let i = 0; i < rolePaths.length; i++) {
      const roleCandidate = rolePaths[i];
      if (roleCandidate !== undefined && roleCandidate !== null) {
        console.log(`✅ Rol găsit la indexul ${i}:`, roleCandidate, typeof roleCandidate);
        userRole = roleCandidate;
        break;
      }
    }
    
    if (!userRole) {
      console.log('❌ NU S-A GĂSIT ROLUL! Folosind fallback USER');
      userRole = 'USER';
    }
    
    // Gestionăm rolul ca enum sau string
    console.log('🔄 Procesare rol găsit:', userRole, typeof userRole);
    
    // Dacă rolul este un obiect enum din Java (de ex: {name: "ADMIN"})
    if (userRole && typeof userRole === 'object' && userRole.name) {
      userRole = userRole.name;
      console.log('🔄 Rol extras din enum:', userRole);
    }
    // Dacă rolul începe cu ROLE_ (Spring Security format)
    else if (typeof userRole === 'string' && userRole.startsWith('ROLE_')) {
      userRole = userRole.replace('ROLE_', '');
      console.log('🔄 Rol extras din ROLE_ prefix:', userRole);
    }
    // Dacă rolul este direct string
    else if (typeof userRole === 'string') {
      console.log('📝 Rol este string:', userRole);
    }
    // Alte cazuri
    else {
      console.log('⚠️ Rol în format neașteptat:', userRole, typeof userRole);
      userRole = 'USER'; // fallback
    }
    
    // Gestionăm authProvider similar
    let authProvider = userData.authProvider || userData.auth_provider || apiUserData.authProvider || apiUserData.auth_provider;
    if (authProvider && typeof authProvider === 'object' && authProvider.name) {
      authProvider = authProvider.name;
    } else if (!authProvider) {
      authProvider = 'local'; // fallback
    }
    
    // ✅ CĂUTARE INTENSIVĂ A TELEFONULUI
    console.log('📱 CĂUTARE INTENSIVĂ TELEFON:');
    const phonePaths = [
      userData.numarTelefon,
      userData.phone,
      userData.telefon,
      userData.phoneNumber,
      userData.phone_number,
      userData.numero_telefon,
      apiUserData.numarTelefon,
      apiUserData.phone,
      apiUserData.telefon,
      apiUserData.phoneNumber,
      apiUserData.phone_number
    ];
    
    console.log('📍 Toate căile verificate pentru telefon:', phonePaths);
    
    let userPhone = null;
    for (let i = 0; i < phonePaths.length; i++) {
      const phoneCandidate = phonePaths[i];
      if (phoneCandidate !== undefined && phoneCandidate !== null && phoneCandidate !== '') {
        console.log(`✅ Telefon găsit la indexul ${i}:`, phoneCandidate);
        userPhone = phoneCandidate;
        break;
      }
    }
    
    // ✅ PARSĂM NUMELE COMPLET
    const fullName = userData.name || userData.fullName || userData.full_name || '';
    const nameParts = fullName.trim().split(' ');
    const nume = nameParts[0] || '';
    const prenume = nameParts.slice(1).join(' ') || '';
    
    console.log('👤 Parsare nume:', { fullName, nume, prenume });
    
    const transformedData = {
      id: userData.id,
      email: userData.email,
      name: fullName, // Numele complet
      nume: nume, // Primul cuvânt din nume
      prenume: prenume, // Restul numelui
      numarTelefon: userPhone, // ✅ Telefon din backend
      telefon: userPhone, // ✅ Alias pentru compatibilitate
      role: userRole,
      permissions: getPermissionsForRole(userRole),
      emailVerified: userData.emailVerified || userData.email_verified || false,
      twoFactorEnabled: userData.twoFactorEnabled || userData.two_factor_enabled || false,
      authProvider: authProvider,
      firmaId: userData.firma_id || userData.firmaId,
      profileImage: userData.profileImage || getDefaultAvatar(fullName || userData.email),
      createdAt: userData.created_at || userData.createdAt,
      updatedAt: userData.updated_at || userData.updatedAt
    };
    
    console.log('✨ Date utilizator transformate final:', transformedData);
    console.log('🎭 Rol detectat și procesat:', transformedData.role);
    console.log('📱 Telefon detectat și procesat:', transformedData.numarTelefon);
    console.log('🔑 Permisiuni generate:', transformedData.permissions);
    
    return transformedData;
  };

   /**
   * 🆕 FUNCȚIE PENTRU REFRESH USER DATA
   * Reîncarcă datele utilizatorului din backend
   */
   const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('🔍 No token found for refresh');
        return { success: false, error: 'Nu există token de autentificare' };
      }

      console.log('🔄 Refreshing user data...');
      
      const response = await fetch('http://localhost:8080/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      console.log('📡 Refresh response status:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('✅ Fresh user data received:', userData);
        
        const transformedUser = transformUserData({ user: userData, accessToken: token });
        
        // Actualizăm starea și localStorage
        setUser(transformedUser);
        localStorage.setItem('userData', JSON.stringify(transformedUser));
        
        console.log('🔄 User data refreshed successfully');
        return { success: true, user: transformedUser };
      } else {
        console.log('❌ Failed to refresh user data:', response.status);
        return { success: false, error: 'Nu s-au putut reîncărca datele utilizatorului' };
      }
      
    } catch (error) {
      console.error('❌ Error refreshing user data:', error);
      return { success: false, error: 'Eroare la reîncărcarea datelor' };
    }
  };

  /**
   * Autentificare utilizator cu API
   * @param {string} email - Email-ul utilizatorului
   * @param {string} password - Parola utilizatorului
   * @returns {Promise} - Promise cu rezultatul autentificării
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      console.log('🔐 Încercare de autentificare pentru:', email);
      
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password
        }),
        credentials: 'include'
      });
      
      console.log('📡 Status răspuns login:', response.status);
      
      // Gestionăm diferite tipuri de erori
      if (!response.ok) {
        let errorMessage = 'Eroare la autentificare';
        
        try {
          const errorData = await response.json();
          console.log('❌ Date eroare de la server:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          switch (response.status) {
            case 401:
              errorMessage = 'Email sau parolă incorectă';
              break;
            case 403:
              errorMessage = 'Contul este blocat sau suspendat';
              break;
            case 404:
              errorMessage = 'Utilizatorul nu există';
              break;
            case 422:
              errorMessage = 'Date de autentificare invalide';
              break;
            case 500:
              errorMessage = 'Eroare de server. Încercați din nou.';
              break;
            default:
              errorMessage = `Eroare HTTP ${response.status}`;
          }
        }
        
        return { success: false, error: errorMessage };
      }
      
      const data = await response.json();
      console.log('✅ Răspuns complet de la server:', data);
      
      // Transformăm datele utilizatorului
      const userData = transformUserData(data);
      
      // Salvăm token-ul
      const possibleTokens = [
        data.token,
        data.accessToken,
        data.access_token,
        data.authToken,
        data.auth_token,
        data.jwt,
        data.jwtToken
      ];
      
      let foundToken = null;
      for (let i = 0; i < possibleTokens.length; i++) {
        if (possibleTokens[i]) {
          foundToken = possibleTokens[i];
          console.log(`💾 Token găsit:`, foundToken.substring(0, 20) + '...');
          break;
        }
      }
      
      if (foundToken) {
        localStorage.setItem('authToken', foundToken);
        console.log('✅ Token salvat în localStorage');
      }
      
      // Salvăm datele utilizatorului
      localStorage.setItem('userData', JSON.stringify(userData));
      console.log('💾 Date utilizator salvate în localStorage');
      
      // Actualizăm starea
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('🎉 Utilizator autentificat cu succes!');
      
      return { success: true, user: userData, role: userData.role };
      
    } catch (error) {
      console.error('❌ Eroare la autentificare (catch):', error);
      
      let errorMessage = 'Nu s-a putut conecta la server';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verificați că backend-ul rulează pe http://localhost:8080';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🆕 AUTENTIFICARE CU COD 2FA
   * @param {string} email - Email-ul utilizatorului
   * @param {string} password - Parola utilizatorului
   * @param {string} verificationCode - Codul 2FA
   * @returns {Promise} - Promise cu rezultatul autentificării 2FA
   */
  const loginWithVerification = async (email, password, verificationCode) => {
    try {
      setLoading(true);
      
      console.log('🔐 Autentificare 2FA pentru:', email);
      
      const response = await fetch('http://localhost:8080/auth/login/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
          verificationCode: verificationCode
        }),
        credentials: 'include'
      });
      
      console.log('📡 Status răspuns 2FA login:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Eroare la autentificarea 2FA';
        
        try {
          const errorData = await response.json();
          console.log('❌ Date eroare 2FA:', errorData);
          if (errorData.message === 'invalidVerificationCode') {
            errorMessage = 'Codul de verificare nu este corect';
          } else {
            errorMessage = errorData.message || errorMessage;
          }
        } catch (e) {
          switch (response.status) {
            case 401:
              errorMessage = 'Cod de verificare invalid';
              break;
            case 403:
              errorMessage = 'Prea multe încercări. Așteptați și încercați din nou';
              break;
            default:
              errorMessage = `Eroare HTTP ${response.status}`;
          }
        }
        
        return { success: false, error: errorMessage };
      }
      
      const data = await response.json();
      console.log('✅ Răspuns 2FA complet:', data);
      
      // Transformăm datele utilizatorului
      const userData = transformUserData(data);
      
      // Salvăm token-ul
      const token = data.accessToken || data.token || data.authToken;
      if (token) {
        localStorage.setItem('authToken', token);
        console.log('✅ Token 2FA salvat în localStorage');
      }
      
      // Salvăm datele utilizatorului
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Actualizăm starea
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log('🎉 Autentificare 2FA reușită!');
      
      return { success: true, user: userData, role: userData.role };
      
    } catch (error) {
      console.error('❌ Eroare la autentificare 2FA (catch):', error);
      
      let errorMessage = 'Nu s-a putut conecta la server';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verificați că backend-ul rulează pe http://localhost:8080';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🆕 SOLICITARE RESETARE PAROLĂ
   * @param {string} email - Email-ul utilizatorului
   * @returns {Promise} - Promise cu rezultatul solicitării
   */
  const forgotPassword = async (email) => {
    try {
      console.log('🔑 Solicitare resetare parolă pentru:', email);
      
      const response = await fetch('http://localhost:8080/auth/forgotten-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
        credentials: 'include'
      });
      
      console.log('📡 Status răspuns forgot password:', response.status);
      
      const data = await response.json();
      console.log('📦 Răspuns forgot password:', data);
      
      if (!response.ok) {
        let errorMessage = 'Eroare la trimiterea email-ului de resetare';
        
        // Mapăm erorile conform backend-ului Spring Boot
        if (data.message === 'userNotFound') {
          errorMessage = 'Nu există un cont cu această adresă de email';
        } else if (data.message === 'accountNotActivated') {
          errorMessage = 'Contul nu este activat. Verificați email-ul pentru activare';
        } else if (data.message && data.message.includes('email.notEmpty')) {
          errorMessage = 'Email-ul este obligatoriu';
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        console.log('❌ Eroare forgot password:', errorMessage);
        return { success: false, error: errorMessage };
      }
      
      console.log('✅ Solicitare resetare parolă reușită');
      return { 
        success: data.success || true, 
        message: data.message || 'Email de resetare trimis cu succes' 
      };
      
    } catch (error) {
      console.error('❌ Eroare la forgot password (catch):', error);
      
      let errorMessage = 'Nu s-a putut conecta la server';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verificați că backend-ul rulează pe http://localhost:8080';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  /**
   * 🆕 RESETAREA PAROLEI CU TOKEN
   * @param {string} email - Email-ul utilizatorului
   * @param {string} token - Token-ul de resetare
   * @param {string} password - Parola nouă
   * @returns {Promise} - Promise cu rezultatul resetării
   */
  const resetPassword = async (email, token, password) => {
    try {
      console.log('🔄 Resetare parolă pentru:', email);
      
      const response = await fetch('http://localhost:8080/auth/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          token, 
          password 
        }),
        credentials: 'include'
      });
      
      console.log('📡 Status răspuns reset password:', response.status);
      
      const data = await response.json();
      console.log('📦 Răspuns reset password:', data);
      
      if (!response.ok) {
        let errorMessage = 'Eroare la resetarea parolei';
        
        // Mapăm erorile conform backend-ului Spring Boot
        if (data.message === 'userNotFound') {
          errorMessage = 'Utilizatorul nu a fost găsit';
        } else if (data.message === 'invalidToken') {
          errorMessage = 'Token invalid';
        } else if (data.message === 'tokenExpired') {
          errorMessage = 'Token-ul a expirat. Solicitați un link nou';
        } else if (data.message && data.message.includes('password.blank')) {
          errorMessage = 'Parola este obligatorie';
        } else if (data.message && data.message.includes('token.blank')) {
          errorMessage = 'Token-ul este obligatoriu';
        } else if (data.message && data.message.includes('email.invalidFormat')) {
          errorMessage = 'Formatul email-ului nu este valid';
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        console.log('❌ Eroare reset password:', errorMessage);
        return { success: false, error: errorMessage };
      }
      
      console.log('✅ Resetare parolă reușită');
      return { 
        success: data.success || true, 
        message: data.message || 'Parola a fost resetată cu succes' 
      };
      
    } catch (error) {
      console.error('❌ Eroare la reset password (catch):', error);
      
      let errorMessage = 'Nu s-a putut conecta la server';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verificați că backend-ul rulează pe http://localhost:8080';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  /**
   * 🆕 SCHIMBAREA PAROLEI PENTRU UTILIZATORUL AUTENTIFICAT
   * @param {string} currentPassword - Parola curentă
   * @param {string} newPassword - Parola nouă
   * @returns {Promise} - Promise cu rezultatul schimbării
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, error: 'Nu sunteți autentificat' };
      }
      
      console.log('🔄 Schimbare parolă pentru utilizatorul autentificat');
      
      const response = await fetch('http://localhost:8080/user/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        }),
        credentials: 'include'
      });
      
      console.log('📡 Status răspuns change password:', response.status);
      
      const data = await response.json();
      console.log('📦 Răspuns change password:', data);
      
      if (!response.ok) {
        let errorMessage = 'Eroare la schimbarea parolei';
        
        if (data.message && data.message.includes('password.blank')) {
          errorMessage = 'Parola curentă este obligatorie';
        } else if (response.status === 401) {
          errorMessage = 'Parola curentă nu este corectă';
        } else if (data.message) {
          errorMessage = data.message;
        }
        
        console.log('❌ Eroare change password:', errorMessage);
        return { success: false, error: errorMessage };
      }
      
      console.log('✅ Schimbare parolă reușită');
      return { 
        success: data.success || true, 
        message: data.message || 'Parola a fost schimbată cu succes' 
      };
      
    } catch (error) {
      console.error('❌ Eroare la change password (catch):', error);
      
      let errorMessage = 'Nu s-a putut conecta la server';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verificați că backend-ul rulează pe http://localhost:8080';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Înregistrare utilizator nou
   * @param {Object} userData - Datele utilizatorului
   * @returns {Promise} - Promise cu rezultatul înregistrării
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      
      console.log('📝 Încercare de înregistrare pentru:', userData.email);
      console.log('📱 Date primite în AuthContext:', userData);
      
      // ✅ CORECTARE: Trimitem numarTelefon, nu phone
      const requestBody = {
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        name: userData.name,  // Deja combinat în RegisterForm
        numarTelefon: userData.numarTelefon,  // ✅ CORECT: numarTelefon
        role: userData?.role||'USER',
      };
      let apiCreate='signup';
      console.log('📤 Request body către server:', requestBody);
      if(requestBody.role==='MANAGER'){
        apiCreate='signup-manager';
      }
      
      const response = await fetch(`http://localhost:8080/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include'
      });
      
      console.log('📡 Status răspuns register:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Eroare la înregistrare';
        
        try {
          const errorData = await response.json();
          console.log('❌ Eroare înregistrare:', errorData);
          
          // Mapăm erorile specifice
          if (errorData.message === 'emailInUse' || errorData.code === 'emailInUse') {
            errorMessage = 'Această adresă de email este deja folosită';
          } else if (errorData.message === 'usernameInUse' || errorData.code === 'usernameInUse') {
            errorMessage = 'Acest nume de utilizator este deja folosit';
          } else if (errorData.message === 'phoneNumberInUse' || errorData.code === 'phoneNumberInUse') {
            errorMessage = 'Acest număr de telefon este deja folosit';
          } else if (errorData.message && errorData.message.includes('telefon')) {
            errorMessage = errorData.message;
          } else if (errorData.fieldErrors && errorData.fieldErrors.numarTelefon) {
            errorMessage = errorData.fieldErrors.numarTelefon;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (e) {
          switch (response.status) {
            case 409:
              errorMessage = 'Adresa de email sau numărul de telefon este deja utilizat';
              break;
            case 422:
              errorMessage = 'Datele introduse nu sunt valide';
              break;
            case 500:
              errorMessage = 'Eroare de server. Încercați din nou.';
              break;
            default:
              errorMessage = `Eroare HTTP ${response.status}`;
          }
        }
        
        return { success: false, error: errorMessage };
      }
      
      const data = await response.json();
      console.log('✅ Înregistrare reușită:', data);
      
      return { 
        success: data.success || true, 
        message: data.message || 'Înregistrare reușită' ,
        user: data.user||null,
      };
      
    } catch (error) {
      console.error('❌ Eroare la înregistrare:', error);
      
      let errorMessage = 'Nu s-a putut conecta la server';
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        errorMessage = 'Nu s-a putut conecta la server. Verificați că backend-ul rulează pe http://localhost:8080';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  /**
   * Returnează permisiunile pentru un anumit rol
   * @param {string|object} role - Rolul pentru care vrem permisiunile (poate fi string sau enum)
   * @returns {Array} - Array cu permisiunile
   */
  const getPermissionsForRole = (role) => {
    console.log('🔑 Generare permisiuni pentru rolul (raw):', role, typeof role);
    
    // Gestionăm cazul în care rolul este un enum object
    let roleString = role;
    if (role && typeof role === 'object' && role.name) {
      roleString = role.name;
      console.log('🔄 Rol extras din enum pentru permisiuni:', roleString);
    } else if (typeof role === 'string') {
      console.log('📝 Rol este string pentru permisiuni:', roleString);
    } else {
      console.log('⚠️ Rol în format neașteptat pentru permisiuni:', role);
      roleString = 'USER'; // fallback sigur
    }
    
    const normalizedRole = roleString?.toString().toUpperCase();
    console.log('🔄 Rol normalizat pentru permisiuni:', normalizedRole);
    
    let permissions = [];
    
    switch (normalizedRole) {
      case 'ADMIN':
      case 'ADMINISTRATOR':
        permissions = [
          'manage_users', 
          'manage_plaje', 
          'view_analytics', 
          'manage_system', 
          'manage_companies',
          'manage_reservations',
          'view_all_data'
        ];
        break;
      case 'MANAGER':
        permissions = [
          'manage_beach', 
          'view_reservations', 
          'manage_equipment',
          'manage_beach_users',
          'view_beach_analytics'
        ];
        break;
      case 'USER':
      case 'CLIENT':
        permissions = [
          'make_reservations', 
          'view_profile',
          'edit_profile',
          'view_own_reservations'
        ];
        break;
      default:
        console.log('⚠️ Rol necunoscut, se folosesc permisiuni default pentru:', normalizedRole);
        permissions = ['view_profile'];
    }
    
    console.log('✅ Permisiuni generate pentru', normalizedRole, ':', permissions);
    return permissions;
  };

  /**
   * Generează un avatar default pe baza numelui/email-ului
   * @param {string} nameOrEmail - Numele sau email-ul utilizatorului
   * @returns {string} - URL-ul avatar-ului
   */
  const getDefaultAvatar = (nameOrEmail) => {
    if (!nameOrEmail) return 'https://ui-avatars.com/api/?name=U&background=0d6efd&color=fff&size=80';
    
    const name = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d6efd&color=fff&size=80`;
  };

  /**
   * Verifică dacă utilizatorul are un anumit rol
   * @param {string} role - Rolul de verificat
   * @returns {boolean}
   */
  const hasRole = (role) => {
    const result = user?.role?.toUpperCase() === role?.toUpperCase();
    console.log(`🔍 Verificare rol: user.role="${user?.role}" vs "${role}" = ${result}`);
    return result;
  };

  /**
   * Verifică dacă utilizatorul are una dintre rolurile specificate
   * @param {Array} roles - Array cu rolurile de verificat
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    if (!Array.isArray(roles) || !user?.role) return false;
    const result = roles.some(role => role?.toUpperCase() === user.role?.toUpperCase());
    console.log(`🔍 Verificare roluri multiple: user.role="${user?.role}" în [${roles.join(', ')}] = ${result}`);
    return result;
  };

  /**
   * Verifică dacă utilizatorul are o anumită permisiune
   * @param {string} permission - Permisiunea de verificat
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    const result = user?.permissions?.includes(permission) || false;
    console.log(`🔍 Verificare permisiune: "${permission}" în [${user?.permissions?.join(', ') || 'none'}] = ${result}`);
    return result;
  };

  /**
   * Returnează numele de afișare pentru rol
   * @param {string} role - Rolul pentru care vrem numele
   * @returns {string}
   */
  const getRoleDisplayName = (role = user?.role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
      case 'ADMINISTRATOR':
        return 'Administrator';
      case 'MANAGER':
        return 'Manager Plajă';
      case 'USER':
      case 'CLIENT':
        return 'Client';
      default:
        return 'Utilizator';
    }
  };

  /**
   * Deconectare utilizator
   */
  const logout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        // Încearcăm să anunțăm serverul despre logout
        try {
          await fetch('http://localhost:8080/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
        } catch (error) {
          console.log('Info: Nu s-a putut anunța serverul despre logout:', error.message);
        }
      }
    } catch (error) {
      console.log('Info: Eroare la logout de pe server:', error.message);
    }
    
    // Ștergem datele din localStorage oricum
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Resetăm starea
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('👋 Utilizator deconectat');
  };

 /**
   * Actualizează datele utilizatorului
   * @param {Object} updatedUserData - Datele actualizate ale utilizatorului
   * @returns {Promise} - Promise cu rezultatul actualizării
   */
 const updateUserData = async (updatedUserData) => {
  try {
    setLoading(true);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, error: 'Nu sunteți autentificat' };
    }
    
    console.log('🔄 Actualizare date utilizator...', updatedUserData);
    
    // ✅ PREGĂTIM DATELE PENTRU BACKEND - TRIMITEM numarTelefon
    const requestData = {
      name: updatedUserData.name || (updatedUserData.nume && updatedUserData.prenume 
        ? `${updatedUserData.nume} ${updatedUserData.prenume}`.trim()
        : user?.name),
      numarTelefon: updatedUserData.numarTelefon || updatedUserData.telefon || null
    };
    
    console.log('📤 Request data to backend:', requestData);
    
    const response = await fetch('http://localhost:8080/user/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
      credentials: 'include'
    });
    
    console.log('📡 Update response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Eroare la actualizarea datelor';
      
      try {
        const errorData = await response.json();
        console.log('❌ Update error data:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Eroare HTTP ${response.status}`;
      }
      
      return { success: false, error: errorMessage };
    }
    
    const data = await response.json();
    console.log('✅ Update response data:', data);
    
    // ✅ VERIFICĂM DACĂ RĂSPUNSUL ESTE ÎN FORMATUL AȘTEPTAT
    if (data.success !== undefined && !data.success) {
      return { success: false, error: data.message || 'Eroare la actualizarea datelor' };
    }
    
    // Transformăm datele primite
    const updatedUser = transformUserData(data);
    
    // Salvăm datele actualizate în localStorage
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    
    // Actualizăm starea
    setUser(updatedUser);
    
    console.log('✅ Date utilizator actualizate cu succes');
    
    return { success: true, user: updatedUser };
    
  } catch (error) {
    console.error('❌ Eroare la actualizarea datelor:', error);
    
    let errorMessage = 'Nu s-a putut conecta la server';
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Nu s-a putut conecta la server. Verificați conexiunea.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};


/**
   * 🆕 UPLOAD IMAGINE DE PROFIL
   * @param {File} imageFile - Fișierul imagine
   * @returns {Promise} - Promise cu rezultatul upload-ului
   */
const uploadProfileImage = async (imageFile) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return { success: false, error: 'Nu sunteți autentificat' };
    }
    
    console.log('📸 Uploading profile image:', imageFile.name, imageFile.size, imageFile.type);
    
    // Creăm FormData pentru upload
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch('http://localhost:8080/user/profile-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // NU setăm Content-Type - browser-ul îl setează automat pentru FormData
      },
      body: formData,
      credentials: 'include'
    });
    
    console.log('📡 Upload response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Eroare la încărcarea imaginii';
      
      try {
        const errorData = await response.json();
        console.log('❌ Upload error data:', errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        switch (response.status) {
          case 413:
            errorMessage = 'Fișierul este prea mare (max 5MB)';
            break;
          case 415:
            errorMessage = 'Tipul fișierului nu este suportat (doar JPG, PNG, GIF)';
            break;
          default:
            errorMessage = `Eroare HTTP ${response.status}`;
        }
      }
      
      return { success: false, error: errorMessage };
    }
    
    const data = await response.json();
    console.log('✅ Upload response data:', data);
    
    // Verificăm dacă upload-ul a fost reușit
    if (data.success !== undefined && !data.success) {
      return { success: false, error: data.message || 'Eroare la încărcarea imaginii' };
    }
    
    // ✅ ACTUALIZĂM UTILIZATORUL CU NOUA IMAGINE ȘI REFRESH COMPLET
    const updatedUser = {
      ...user,
      profileImage: data.profileImage,
      // Adăugăm și avatar pentru compatibilitate cu Navbar
      avatar: data.profileImage ? `data:${data.profileImage.mimeType};base64,${data.profileImage.data}` : user.avatar
    };
    
    console.log('🔄 Updated user with new profile image:', updatedUser);
    
    // Salvăm în localStorage și actualizăm starea
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // ✅ OPȚIONAL: REÎNCĂRCĂM DATELE UTILIZATORULUI PENTRU SINCRONIZARE COMPLETĂ
    try {
      await refreshUserData();
    } catch (refreshError) {
      console.log('ℹ️ Could not refresh user data, but upload was successful:', refreshError);
    }
    
    console.log('✅ Profile image uploaded successfully');
    
    return { 
      success: true, 
      user: updatedUser,
      message: data.message || 'Poza de profil a fost actualizată cu succes!'
    };
    
  } catch (error) {
    console.error('❌ Error uploading profile image:', error);
    
    let errorMessage = 'Nu s-a putut conecta la server';
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorMessage = 'Nu s-a putut conecta la server. Verificați conexiunea.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

  // Log pentru debugging
  console.log('🎭 AuthContext State:', { 
    user: user ? { id: user.id, email: user.email, role: user.role } : null, 
    isAuthenticated, 
    loading 
  });

  // Valorile expuse prin context - 🆕 CU FUNCȚIILE NOI DE RESET PAROLĂ
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    loginWithVerification,    // 🆕 PENTRU 2FA
    register,
    logout,
    updateUserData,
    refreshUserData,          // 🆕 PENTRU REFRESH DATE UTILIZATOR
    uploadProfileImage,       // 🆕 PENTRU UPLOAD IMAGINE PROFIL
    forgotPassword,          // 🆕 PENTRU RESET PAROLĂ
    resetPassword,           // 🆕 PENTRU RESET PAROLĂ
    changePassword,          // 🆕 PENTRU SCHIMBARE PAROLĂ
    hasRole,
    hasAnyRole,
    hasPermission,
    getRoleDisplayName
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;