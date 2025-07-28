// src/services/ApiService.js

const API_BASE_URL = 'http://localhost:8080';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper pentru a seta token-ul în headers - ACTUALIZAT
  getAuthHeaders() {
    // Caută token-ul în mai multe locații posibile
    const token = localStorage.getItem('authToken') || 
                  localStorage.getItem('token') ||
                  sessionStorage.getItem('authToken') ||
                  sessionStorage.getItem('token');
                  
    console.log('🔍 Searching for auth token...');
    console.log('📦 localStorage.authToken:', localStorage.getItem('authToken') ? '✅ Found' : '❌ Not found');
    console.log('📦 localStorage.token:', localStorage.getItem('token') ? '✅ Found' : '❌ Not found');
    console.log('📦 sessionStorage.authToken:', sessionStorage.getItem('authToken') ? '✅ Found' : '❌ Not found');
    console.log('📦 sessionStorage.token:', sessionStorage.getItem('token') ? '✅ Found' : '❌ Not found');
    console.log('🔐 Using token:', token ? token.substring(0, 20) + '...' : 'NONE');
    
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Metodă pentru sincronizarea token-urilor - NOUĂ
  syncTokens() {
    const authToken = localStorage.getItem('authToken');
    const token = localStorage.getItem('token');
    
    // Dacă ai token dar nu authToken, copiază-l
    if (token && !authToken) {
      localStorage.setItem('authToken', token);
      console.log('🔄 Synced token to authToken');
    }
    
    // Sau invers
    if (authToken && !token) {
      localStorage.setItem('token', authToken);
      console.log('🔄 Synced authToken to token');
    }
  }

  // Helper pentru curățarea datelor de autentificare - NOUĂ
  clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('user');
    console.log('🧹 Auth data cleared from all storage locations');
  }

  // Helper pentru request-uri - ACTUALIZAT
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Sincronizează token-urile înainte de request
    this.syncTokens();
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      credentials: 'include', // Pentru cookies (refresh token)
    };

    console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
    console.log('📋 Request headers:', config.headers);
    console.log('📤 Request body:', options.body ? JSON.parse(options.body) : 'No body');

    try {
      const response = await fetch(url, config);
      
      console.log(`📨 Response status: ${response.status} ${response.statusText}`);
      
      // Dacă primim 401, token-ul a expirat
      if (response.status === 401) {
        console.log('🔒 Received 401 - attempting token refresh...');
        
        // Încearcă să reînnoiești token-ul
        const refreshed = await this.refreshToken();
        if (refreshed) {
          console.log('✅ Token refreshed successfully, retrying request...');
          // Reîncearcă request-ul original cu noul token
          config.headers = {
            ...config.headers,
            ...this.getAuthHeaders(),
          };
          const retryResponse = await fetch(url, config);
          return this.handleResponse(retryResponse);
        } else {
          console.log('❌ Token refresh failed, clearing auth data...');
          // Nu s-a putut reînnoi token-ul, curăță datele
          this.clearAuthData();
          
          // Nu redirecta automat aici, lasă componenta să decidă
          const error = {
            status: 401,
            statusText: 'Unauthorized',
            message: 'Session expired. Please login again.',
            needsLogin: true
          };
          throw error;
        }
      }
      
      return this.handleResponse(response);
    } catch (error) {
      console.error('❌ API Request Error:', error);
      
      // Dacă e eroare de rețea sau altă eroare, păstrează structura
      if (!error.status) {
        throw {
          status: 500,
          statusText: 'Network Error',
          message: error.message || 'Network or server error',
          originalError: error
        };
      }
      
      throw error;
    }
  }

  // Gestionează răspunsul - ACTUALIZAT
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    
    let data;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (parseError) {
      console.warn('⚠️ Could not parse response:', parseError);
      data = null;
    }

    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
        message: data?.message || data?.error || data || `HTTP error! status: ${response.status}`,
        data: data
      };
      
      console.error('❌ HTTP Error:', error);
      throw error;
    }

    console.log('✅ Response successful:', data);
    return data;
  }

  // AUTH ENDPOINTS
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async loginWithVerification(email, password, code) {
    return this.request('/auth/login/verify', {
      method: 'POST',
      body: JSON.stringify({ email, password, code }),
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/logout', {
      method: 'POST',
    });
  }

  async refreshToken() {
    try {
      console.log('🔄 Attempting to refresh token...');
      const response = await this.request('/auth/access-token', {
        method: 'GET',
      });
      
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('token', response.accessToken); // Sincronizează ambele
        console.log('✅ Token refreshed successfully');
        return true;
      }
      console.log('❌ No access token in refresh response');
      return false;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return false;
    }
  }

  async getDashboardStats() {
    return this.request('/api/admin/dashboard/stats', {
      method: 'GET',
    });
  }

  async getRecentReservations() {
    return this.request('/api/admin/dashboard/recent-reservations?limit=10', {
      method: 'GET',
    });
  }

  async getDashboardAlerts() {
    return this.request('/api/admin/dashboard/alerts', {
      method: 'GET',
    });
  }


  // USER ENDPOINTS
  async getCurrentUser() {
    return this.request('/user/me', {
      method: 'GET',
    });
  }

  async getAllUsers() {
    return this.request('/users', {
      method: 'GET',
    });
  }

  // USER MANAGEMENT ENDPOINTS (pentru ADMIN)
  async getUserById(id) {
    return this.request(`/users/${id}`, {
      method: 'GET',
    });
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleEmailVerification(id) {
    return this.request(`/users/${id}/email-verification`, {
      method: 'PATCH',
    });
  }

  async updateProfile(userData) {
    return this.request('/update-profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async cancelAccount() {
    return this.request('/cancel-account', {
      method: 'POST',
    });
  }

  // 2FA ENDPOINTS
  async setupTwoFactor() {
    return this.request('/two-factor-setup', {
      method: 'POST',
    });
  }

  async verifyTwoFactor(code) {
    return this.request('/verify-two-factor', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  async disableTwoFactor() {
    return this.request('/disable-two-factor', {
      method: 'PUT',
    });
  }

  // PLAJE ENDPOINTS
  async getAllPlaje() {
    return this.request('/plaje', {
      method: 'GET',
    });
  }

  async getPlajaById(id) {
    return this.request(`/plaje/${id}`, {
      method: 'GET',
    });
  }

  async createPlaja(plajaData) {
    return this.request('/plaje', {
      method: 'POST',
      body: JSON.stringify(plajaData),
    });
  }

  async updatePlaja(id, plajaData) {
    return this.request(`/plaje/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plajaData),
    });
  }

  async deletePlaja(id) {
    return this.request(`/plaje/${id}`, {
      method: 'DELETE',
    });
  }

  // REZERVĂRI ENDPOINTS
 // Adaugă aceste metode în clasa ApiService din src/services/ApiService.js

// STĂRI REZERVARE ENDPOINTS
async getAllStariRezervare() {
    return this.request('/stari-rezervare', {
      method: 'GET',
    });
  }
  
  async getStareRezervareById(id) {
    return this.request(`/stari-rezervare/${id}`, {
      method: 'GET',
    });
  }
  
  async createStareRezervare(stareData) {
    return this.request('/stari-rezervare', {
      method: 'POST',
      body: JSON.stringify(stareData),
    });
  }
  
  async updateStareRezervare(id, stareData) {
    return this.request(`/stari-rezervare/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stareData),
    });
  }
  
  async deleteStareRezervare(id) {
    return this.request(`/stari-rezervare/${id}`, {
      method: 'DELETE',
    });
  }
  
  // REZERVARE LINII ENDPOINTS  
  async getAllRezervari() {
    return this.request('/rezervari', {
      method: 'GET',
    });
  }
  
  async createRezervare(rezervareData) {
    return this.request('/rezervari', {
      method: 'POST',
      body: JSON.stringify(rezervareData),
    });
  }
  
  async updateRezervare(id, rezervareData) {
    return this.request(`/rezervari/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rezervareData),
    });
  }
  
  async deleteRezervare(id) {
    return this.request(`/rezervari/${id}`, {
      method: 'DELETE',
    });
  }
  
  // STĂRI REZERVARE ENDPOINTS
  async getAllStariRezervare() {
    return this.request('/stari-rezervare', {
      method: 'GET',
    });
  }
  
  async getStareRezervareById(id) {
    return this.request(`/stari-rezervare/${id}`, {
      method: 'GET',
    });
  }
  
  async createStareRezervare(stareData) {
    return this.request('/stari-rezervare', {
      method: 'POST',
      body: JSON.stringify(stareData),
    });
  }
  
  async updateStareRezervare(id, stareData) {
    return this.request(`/stari-rezervare/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stareData),
    });
  }
  
  async deleteStareRezervare(id) {
    return this.request(`/stari-rezervare/${id}`, {
      method: 'DELETE',
    });
  }
  
  // REZERVARE LINII ENDPOINTS  
 // Adaugă aceste metode în clasa ApiService din src/services/ApiService.js

// REZERVĂRI ENDPOINTS - CORECTATE
async getAllRezervari() {
    return this.request('/rezervari', {
      method: 'GET',
    });
  }

  async getAllRezervariByUser() {
    return this.request('/api/rezervari/user', {
      method: 'GET',
    });
  }


  async getAllPlajeByUser() {
    return this.request('/plaje/user', {
      method: 'GET',
    });
  }

  async getAllRezervari() {
    return this.request('/api/rezervari', {
      method: 'GET',
    });
  }
  
  async createRezervare(rezervareData) {
    return this.request('/rezervari', {
      method: 'POST',
      body: JSON.stringify(rezervareData),
    });
  }
  
  async updateRezervare(id, rezervareData) {
    return this.request(`/rezervari/${id}`, {
      method: 'PUT',
      body: JSON.stringify(rezervareData),
    });
  }
  
  async deleteRezervare(id) {
    return this.request(`/rezervari/${id}`, {
      method: 'DELETE',
    });
  }
  
  // STĂRI REZERVARE ENDPOINTS - CORECTATE pentru backend-ul tău
  async getAllStariRezervare() {
    return this.request('/stari-rezervari', {
      method: 'GET',
    });
  }
  
  async getStareRezervareById(id) {
    return this.request(`/stari-rezervari/${id}`, {
      method: 'GET',
    });
  }
  
  async createStareRezervare(stareData) {
    return this.request('/stari-rezervari', {
      method: 'POST',
      body: JSON.stringify(stareData),
    });
  }
  
  async updateStareRezervare(id, stareData) {
    return this.request(`/stari-rezervari/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stareData),
    });
  }
  
  async deleteStareRezervare(id) {
    return this.request(`/stari-rezervari/${id}`, {
      method: 'DELETE',
    });
  }
  
  // REZERVARE LINII ENDPOINTS  
  async getAllRezervareLinii() {
    return this.request('/rezervare-linii', {
      method: 'GET',
    });
  }
  
  async getRezervareLinieById(id) {
    return this.request(`/rezervare-linii/${id}`, {
      method: 'GET',
    });
  }
  
  async getRezervareLiniiByRezervareId(rezervareId) {
    return this.request(`/rezervare-linii/by-rezervare/${rezervareId}`, {
      method: 'GET',
    });
  }
  
  async getRezervareLiniiByEchipamentId(echipamentId) {
    return this.request(`/rezervare-linii/by-echipament/${echipamentId}`, {
      method: 'GET',
    });
  }
  
  async getRezervareLiniiByTipEchipamentId(tipEchipamentId) {
    return this.request(`/rezervare-linii/by-tip-echipament/${tipEchipamentId}`, {
      method: 'GET',
    });
  }
  
  async createRezervareLinie(liniaData) {
    return this.request('/rezervare-linii', {
      method: 'POST',
      body: JSON.stringify(liniaData),
    });
  }
  
  async updateRezervareLinie(id, liniaData) {
    return this.request(`/rezervare-linii/${id}`, {
      method: 'PUT',
      body: JSON.stringify(liniaData),
    });
  }
  
  async deleteRezervareLinie(id) {
    return this.request(`/rezervare-linii/${id}`, {
      method: 'DELETE',
    });
  }
  
  async deleteRezervareLiniiByRezervareId(rezervareId) {
    return this.request(`/rezervare-linii/by-rezervare/${rezervareId}`, {
      method: 'DELETE',
    });
  }
  
  async getTotalPretForRezervare(rezervareId) {
    return this.request(`/rezervare-linii/total-pret/${rezervareId}`, {
      method: 'GET',
    });
  }
  
  async countRezervareLiniiByRezervareId(rezervareId) {
    return this.request(`/rezervare-linii/count/${rezervareId}`, {
      method: 'GET',
    });
  }
  
  // TIPURI ECHIPAMENTE ENDPOINTS
  async getAllTipuriEchipamentePlaja() {
    return this.request('/tipuri-echipamente-plaja', {
      method: 'GET',
    });
  }
  
  async getTipEchipamentPlajaById(id) {
    return this.request(`/tipuri-echipamente-plaja/${id}`, {
      method: 'GET',
    });
  }
  async getAllEchipamentePlaja() {
    return this.request(`/echipamente-plaja`, {
      method: 'GET',
    });
  }

  async createTipEchipamentPlaja(tipData) {
    return this.request('/tipuri-echipamente-plaja', {
      method: 'POST',
      body: JSON.stringify(tipData),
    });
  }
  
  async updateTipEchipamentPlaja(id, tipData) {
    return this.request(`/tipuri-echipamente-plaja/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tipData),
    });
  }
  
  async deleteTipEchipamentPlaja(id) {
    return this.request(`/tipuri-echipamente-plaja/${id}`, {
      method: 'DELETE',
    });
  }
  // FIRME ENDPOINTS
  async getAllFirme() {
    return this.request('/firme', {
      method: 'GET',
    });
  }

  async getFirmaById(id) {
    return this.request(`/firme/${id}`, {
      method: 'GET',
    });
  }

  async createFirma(firmaData) {
    return this.request('/firme', {
      method: 'POST',
      body: JSON.stringify(firmaData),
    });
  }

  async updateFirma(id, firmaData) {
    return this.request(`/firme/${id}`, {
      method: 'PUT',
      body: JSON.stringify(firmaData),
    });
  }

  async deleteFirma(id) {
    return this.request(`/firme/${id}`, {
      method: 'DELETE',
    });
  }

  // STAȚIUNI ENDPOINTS
  async getAllStatiuni() {
    return this.request('/statiuni', {
      method: 'GET',
    });
  }

  async getLastXPlajaPerformances() {
    return this.request('/api/statistics/beaches/performance?limit=10', {
      method: 'GET',
    });
  }

  async getDetaliiFirmaByUserId(userId){
    return this.request(`/firme/user/${userId}`,{
      method:'GET',
    });
  }

  async getTopClients() {
    return this.request('/api/statistics/clients/top-active?limit=10', {
      method: 'GET',
    });
  }

  async getInactiveClients() {
    return this.request('/api/statistics/clients/inactive', {
      method: 'GET',
    });
  }
  ///api/statistics/equipment
  async getStatisticsEchipamente() {
    return this.request('/api/statistics/equipment', {
      method: 'GET',
    });
  }
  async getStatisticsUtilizatori() {
    return this.request('/api/statistics/users', {
      method: 'GET',
    });
  }

  async getStatisticsSeasonal() {
    return this.request('/api/statistics/seasonal', {
      method: 'GET',
    });
  }

  async getLocalitati() {
    return this.request('/api/localitati', {
      method: 'GET',
    });
  }

  async getStatisticsResorts() {
    return this.request('/api/statistics/resorts', {
      method: 'GET',
    });
  }

  async getStatisticsReservations() {
    return this.request('/api/statistics/reservations', {
      method: 'GET',
    });
  }

  async getStatiuneById(id) {
    return this.request(`/statiuni/${id}`, {
      method: 'GET',
    });
  }

  async createStatiune(statiuneData) {
    return this.request('/statiuni', {
      method: 'POST',
      body: JSON.stringify(statiuneData),
    });
  }

  async updateStatiune(id, statiuneData) {
    return this.request(`/statiuni/${id}`, {
      method: 'PUT',
      body: JSON.stringify(statiuneData),
    });
  }

  async deleteStatiune(id) {
    return this.request(`/statiuni/${id}`, {
      method: 'DELETE',
    });
  }

  // UTILITY METHODS - NOI
  
  // Verifică dacă utilizatorul este autentificat
  isAuthenticated() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  // Obține informații despre utilizatorul curent din token
  getCurrentUserFromToken() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        sub: payload.sub,
        exp: payload.exp,
        iat: payload.iat,
        iss: payload.iss
      };
    } catch {
      return null;
    }
  }

  // Metodă de debugging pentru token
  debugToken() {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found');
      return null;
    }
    
    try {
      const parts = token.split('.');
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      
      console.log('🔍 Token Debug Info:');
      console.log('📋 Header:', header);
      console.log('📋 Payload:', payload);
      console.log('🕐 Expires:', new Date(payload.exp * 1000));
      console.log('🕐 Current:', new Date());
      console.log('✅ Valid:', payload.exp > Date.now() / 1000);
      
      return { header, payload };
    } catch (error) {
      console.error('❌ Error debugging token:', error);
      return null;
    }
  }
    async getPreturiWithFullDetails() {
    console.log('🔐 Checking authentication before request...');
    this.debugToken(); // opțional, doar pentru debug

    const response = await this.request('/api/preturi/with-full-details', {
      method: 'GET',
    });

    console.log('📋 Preturi with full details response:', response);
    return response;
  }

  async getPreturiWithDetails() {
  console.log('🔐 Checking authentication before request...');
  this.debugToken(); // Afișează informații despre token
  
  const response = await this.request('/api/preturi/with-details', {
    method: 'GET',
  });
  
  console.log('📋 Preturi with details response:', response);
  return response;
}


}

// Creăm o instanță singleton
const apiService = new ApiService();

export default apiService;