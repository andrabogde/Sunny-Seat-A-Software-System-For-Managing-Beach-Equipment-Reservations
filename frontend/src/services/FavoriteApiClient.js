// ====================
// FIȘIER: src/services/FavoriteApiClient.js
// ====================

class FavoriteApiClient {
    constructor() {
        // Detectarea automată a base URL-ului
        this.baseUrl = this.getBaseUrl();
        this.apiPath = '/api/favorite';
    }

    // Determină base URL-ul automat
    getBaseUrl() {
        // În development, folosește localhost
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8080';
        }
        
        // În production, folosește același host ca și frontend-ul
        return `${window.location.protocol}//${window.location.host}`;
    }

    // Helper pentru obținerea token-ului de autentificare
    getAuthToken() {
        // Caută token-ul în diferite locații
        const token = localStorage.getItem('authToken') || 
                      localStorage.getItem('token') || 
                      sessionStorage.getItem('authToken') ||
                      sessionStorage.getItem('token');
        
        console.log('🔑 FavoriteApiClient - Token status:', token ? 'EXISTS' : 'MISSING');
        return token;
    }

    // Helper pentru fetch cu autentificare
    async fetchWithAuth(endpoint, options = {}) {
        const url = `${this.baseUrl}${this.apiPath}${endpoint}`;
        
        // Obține token-ul din localStorage
        let token = this.getAuthToken();
        
        if (!token) {
            console.error('❌ FavoriteApiClient - No auth token found');
            this.redirectToLogin();
            throw new Error('Nu sunteți autentificat. Vă rugăm să vă logați din nou.');
        }

        // Verifică dacă token-ul a expirat
        if (this.isTokenExpired(token)) {
            console.warn('⚠️ Token expired, attempting refresh...');
            
            // Încearcă să refresh-ezi token-ul
            const refreshed = await this.attemptTokenRefresh();
            if (refreshed) {
                token = this.getAuthToken(); // Ia noul token
            } else {
                console.error('❌ Could not refresh token');
                this.redirectToLogin();
                throw new Error('Sesiunea a expirat. Vă rugăm să vă logați din nou.');
            }
        }
        
        const defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // ✅ ADAUGĂ TOKEN-UL ÎN HEADER
                ...options.headers
            }
        };

        console.log('📡 FavoriteApiClient - Making request to:', url);
        console.log('📋 FavoriteApiClient - Request options:', {
            method: options.method || 'GET',
            headers: { ...defaultOptions.headers, Authorization: token ? 'Bearer [HIDDEN]' : 'MISSING' }
        });

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            
            console.log('📥 FavoriteApiClient - Response status:', response.status);
            console.log('📥 FavoriteApiClient - Response headers:', Object.fromEntries(response.headers.entries()));
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorText = await response.text();
                    console.error('❌ FavoriteApiClient - Error response body:', errorText);
                    
                    // Încearcă să parsezi JSON-ul de eroare
                    try {
                        const errorJson = JSON.parse(errorText);
                        errorMessage = errorJson.message || errorJson.error || errorText;
                    } catch (e) {
                        errorMessage = errorText || errorMessage;
                    }
                } catch (e) {
                    console.log('❌ FavoriteApiClient - Could not read error response');
                }

                // Gestionează diferite tipuri de erori
                if (response.status === 401) {
                    throw new Error('Sesiunea a expirat. Vă rugăm să vă logați din nou.');
                } else if (response.status === 403) {
                    throw new Error('Nu aveți permisiunea să accesați această resursă.');
                } else if (response.status === 404) {
                    throw new Error('Resursa solicitată nu a fost găsită.');
                } else if (response.status === 500) {
                    throw new Error('Eroare internă de server. Încercați din nou mai târziu.');
                } else {
                    throw new Error(errorMessage);
                }
            }

            // Dacă response-ul este gol (204 No Content), returnează null
            if (response.status === 204) {
                console.log('✅ FavoriteApiClient - Empty response (204 No Content)');
                return null;
            }

            // Verifică dacă răspunsul are conținut JSON
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                console.warn('⚠️ FavoriteApiClient - Response is not JSON:', contentType);
                const textResponse = await response.text();
                console.log('📄 FavoriteApiClient - Text response:', textResponse);
                return textResponse;
            }

            const data = await response.json();
            console.log('✅ FavoriteApiClient - Success response:', data);
            return data;
            
        } catch (error) {
            console.error(`❌ FavoriteApiClient error for ${url}:`, error);
            
            // Verifică dacă este o eroare de rețea
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Eroare de conexiune. Verificați conexiunea la internet.');
            }
            
            throw error;
        }
    }

    // Obține toate favoritele utilizatorului (cu detalii complete)
    async getUserFavorites() {
        try {
            console.log('📋 FavoriteApiClient - Getting user favorites...');
            const result = await this.fetchWithAuth('');
            console.log('✅ FavoriteApiClient - Favorites received:', result);
            return result || [];
        } catch (error) {
            console.error('❌ Error fetching favorites:', error);
            throw new Error('Nu s-au putut încărca favoritele');
        }
    }

    // Obține lista de ID-uri ale plajelor favorite
    async getUserFavoriteIds() {
        try {
            console.log('🆔 FavoriteApiClient - Getting user favorite IDs...');
            const result = await this.fetchWithAuth('/ids');
            console.log('✅ FavoriteApiClient - Favorite IDs received:', result);
            
            // Gestionează diferite formate de răspuns
            if (Array.isArray(result)) {
                return result.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            }
            if (result && Array.isArray(result.ids)) {
                return result.ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            }
            if (result && Array.isArray(result.favoriteIds)) {
                return result.favoriteIds.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
            }
            
            console.warn('⚠️ Unexpected response format for favorite IDs:', result);
            return [];
            
        } catch (error) {
            console.error('❌ Error fetching favorite IDs:', error);
            return []; // Returnează array gol în caz de eroare pentru a nu bloca UI-ul
        }
    }

    // Verifică dacă o plajă este favorită
    async checkIsFavorite(plajaId) {
        try {
            console.log('🔍 FavoriteApiClient - Checking if favorite:', plajaId);
            const data = await this.fetchWithAuth(`/check/${plajaId}`);
            
            // Gestionează diferite formate de răspuns
            if (typeof data === 'boolean') {
                return data;
            }
            if (data && typeof data.isFavorite === 'boolean') {
                return data.isFavorite;
            }
            if (data && typeof data.favorite === 'boolean') {
                return data.favorite;
            }
            if (data && typeof data.exists === 'boolean') {
                return data.exists;
            }
            
            console.log('✅ FavoriteApiClient - Is favorite result:', data);
            return Boolean(data); // Fallback la boolean conversion
            
        } catch (error) {
            console.error('❌ Error checking favorite status:', error);
            return false; // În caz de eroare, presupunem că nu e favorit
        }
    }

    // Adaugă la favorite
    async addToFavorites(plajaId) {
        try {
            console.log('➕ FavoriteApiClient - Adding to favorites:', plajaId);
            const result = await this.fetchWithAuth(`/${plajaId}`, {
                method: 'POST',
                body: JSON.stringify({ plajaId: parseInt(plajaId, 10) })
            });
            console.log('✅ FavoriteApiClient - Added to favorites:', result);
            return result;
        } catch (error) {
            console.error('❌ Error adding to favorites:', error);
            throw new Error('Nu s-a putut adăuga la favorite');
        }
    }

    // Elimină din favorite
    async removeFromFavorites(plajaId) {
        try {
            console.log('➖ FavoriteApiClient - Removing from favorites:', plajaId);
            const result = await this.fetchWithAuth(`/${plajaId}`, {
                method: 'DELETE'
            });
            console.log('✅ FavoriteApiClient - Removed from favorites:', result);
            return result;
        } catch (error) {
            console.error('❌ Error removing from favorites:', error);
            throw new Error('Nu s-a putut elimina din favorite');
        }
    }

    // Toggle favorite (adaugă dacă nu există, elimină dacă există)
    async toggleFavorite(plajaId) {
        try {
            console.log('🔄 FavoriteApiClient - Toggling favorite:', plajaId);
            const result = await this.fetchWithAuth(`/toggle/${plajaId}`, {
                method: 'POST',
                body: JSON.stringify({ plajaId: parseInt(plajaId, 10) })
            });
            console.log('✅ FavoriteApiClient - Toggle result:', result);
            
            // Gestionează diferite formate de răspuns pentru toggle
            if (result === null || result === undefined) {
                console.log('📝 FavoriteApiClient - Toggle returned null, checking current status...');
                // Dacă toggle returnează null, verifică starea curentă
                const isFavorite = await this.checkIsFavorite(plajaId);
                return { isFavorite };
            }
            if (typeof result === 'boolean') {
                return { isFavorite: result };
            }
            if (result && typeof result.isFavorite === 'boolean') {
                return result;
            }
            if (result && typeof result.favorite === 'boolean') {
                return { isFavorite: result.favorite };
            }
            if (result && typeof result.success === 'boolean') {
                return { isFavorite: result.success };
            }
            
            // Fallback: verifică starea curentă
            console.log('📝 FavoriteApiClient - Unknown toggle result format, checking status...');
            const isFavorite = await this.checkIsFavorite(plajaId);
            return { isFavorite };
            
        } catch (error) {
            console.error('❌ Error toggling favorite:', error);
            throw new Error('Nu s-a putut actualiza statusul favorit');
        }
    }

    // Obține numărul de favorite
    async getFavoritesCount() {
        try {
            console.log('🔢 FavoriteApiClient - Getting favorites count...');
            const data = await this.fetchWithAuth('/count');
            
            // Gestionează diferite formate de răspuns
            if (typeof data === 'number') {
                return data;
            }
            if (data && typeof data.count === 'number') {
                return data.count;
            }
            if (data && typeof data.total === 'number') {
                return data.total;
            }
            
            console.log('✅ FavoriteApiClient - Favorites count:', data);
            return parseInt(data, 10) || 0;
            
        } catch (error) {
            console.error('❌ Error getting favorites count:', error);
            return 0; // Returnează 0 în caz de eroare
        }
    }

    // Șterge toate favoritele utilizatorului
    async clearAllFavorites() {
        try {
            console.log('🗑️ FavoriteApiClient - Clearing all favorites...');
            const result = await this.fetchWithAuth('/clear', {
                method: 'DELETE'
            });
            console.log('✅ FavoriteApiClient - All favorites cleared:', result);
            return result;
        } catch (error) {
            console.error('❌ Error clearing favorites:', error);
            throw new Error('Nu s-au putut șterge favoritele');
        }
    }

    // Verifică dacă token-ul a expirat
    isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            const isExpired = payload.exp && payload.exp < now;
            
            if (isExpired) {
                console.log('⏰ Token expired at:', new Date(payload.exp * 1000));
            }
            
            return isExpired;
        } catch (error) {
            console.error('❌ Error checking token expiration:', error);
            return true; // Dacă nu poate fi decodat, consideră expirat
        }
    }

    // Încearcă să refresh-eze token-ul
    async attemptTokenRefresh() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.log('❌ No refresh token available');
                return false;
            }

            console.log('🔄 Attempting token refresh...');
            const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ refreshToken })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.accessToken || data.authToken || data.token) {
                    const newToken = data.accessToken || data.authToken || data.token;
                    localStorage.setItem('authToken', newToken);
                    console.log('✅ Token refreshed successfully');
                    return true;
                }
            }
            
            console.log('❌ Token refresh failed:', response.status);
            return false;
        } catch (error) {
            console.error('❌ Token refresh error:', error);
            return false;
        }
    }

    // Redirect la login
    redirectToLogin() {
        console.log('🔄 Redirecting to login...');
        
        // Curăță token-urile expirate
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        
        // Redirect la login (ajustează calea conform aplicației tale)
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    }
    async testConnection() {
        try {
            console.log(`🧪 Testing connection to: ${this.baseUrl}${this.apiPath}`);
            
            // Testează un endpoint simplu
            await this.getUserFavoriteIds();
            
            console.log('✅ Connection test successful');
            return true;
        } catch (error) {
            console.error('❌ Connection test failed:', error);
            return false;
        }
    }

    // Metodă pentru debugging - afișează toate endpoint-urile disponibile
    getEndpoints() {
        const baseEndpoint = `${this.baseUrl}${this.apiPath}`;
        return {
            getUserFavorites: `GET ${baseEndpoint}`,
            getUserFavoriteIds: `GET ${baseEndpoint}/ids`,
            checkIsFavorite: `GET ${baseEndpoint}/check/{id}`,
            addToFavorites: `POST ${baseEndpoint}/{id}`,
            removeFromFavorites: `DELETE ${baseEndpoint}/{id}`,
            toggleFavorite: `POST ${baseEndpoint}/toggle/{id}`,
            getFavoritesCount: `GET ${baseEndpoint}/count`,
            clearAllFavorites: `DELETE ${baseEndpoint}/clear`
        };
    }

    // Metodă pentru debugging - testează toate endpoint-urile
    async debugAllEndpoints(testPlajaId = 1) {
        console.log('🔍 Starting comprehensive API debug...');
        console.log('📋 Available endpoints:', this.getEndpoints());
        
        const results = {};
        
        try {
            console.log('1. Testing getUserFavoriteIds...');
            results.getUserFavoriteIds = await this.getUserFavoriteIds();
        } catch (error) {
            results.getUserFavoriteIds = { error: error.message };
        }

        try {
            console.log('2. Testing checkIsFavorite...');
            results.checkIsFavorite = await this.checkIsFavorite(testPlajaId);
        } catch (error) {
            results.checkIsFavorite = { error: error.message };
        }

        try {
            console.log('3. Testing getFavoritesCount...');
            results.getFavoritesCount = await this.getFavoritesCount();
        } catch (error) {
            results.getFavoritesCount = { error: error.message };
        }

        try {
            console.log('4. Testing toggleFavorite...');
            results.toggleFavorite = await this.toggleFavorite(testPlajaId);
        } catch (error) {
            results.toggleFavorite = { error: error.message };
        }

        console.log('✅ Debug results:', results);
        return results;
    }
}

// Exportăm o instanță singleton
const favoriteApiClient = new FavoriteApiClient();

// Log pentru debugging în development
if (window.location.hostname === 'localhost') {
    console.log('🚀 FavoriteApiClient initialized with base URL:', favoriteApiClient.baseUrl);
    console.log('📋 Available endpoints:', favoriteApiClient.getEndpoints());
    
    // Expune API client-ul în window pentru debugging în consolă
    window.FavoriteApiClient = favoriteApiClient;
}

export default favoriteApiClient;