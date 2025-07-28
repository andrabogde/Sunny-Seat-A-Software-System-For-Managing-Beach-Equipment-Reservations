// src/services/ReservationApiService.js

class ReservationApiService {
    constructor() {
      this.baseURL = 'http://localhost:8080'; // URL-ul backend-ului tău
    }
  
    // Obține token-ul de autentificare din localStorage
    getAuthToken() {
      return localStorage.getItem('authToken') || '';
    }
  
    // Obține user ID din localStorage
    getUserId() {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.id || null;
        } catch (error) {
          console.error('Eroare la parsarea datelor utilizatorului:', error);
          return null;
        }
      }
      return null;
    }
  
    // Headers comune pentru request-uri
    getHeaders() {
      const token = this.getAuthToken();
      return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
    }
  
    /**
     * 🆕 Creează rezervare completă cu notificare automată
     */
    async createReservation(reservationData, userId = null) {
      try {
        console.log("📤 Creez rezervarea:", reservationData);
  
        // Folosește userId-ul pasat ca parametru sau încearcă să-l obții din localStorage
        const targetUserId = userId || this.getUserId();
        
        if (!targetUserId) {
          throw new Error('Nu s-a putut identifica utilizatorul. Vă rugăm să vă autentificați din nou.');
        }
  
        // 1. Creează rezervarea principală
        const rezervarePayload = {
          utilizator: { 
            id: targetUserId 
          },
          stareRezervare: "CONFIRMATA"
          // codRezervare și createdAt se generează automat
        };
  
        console.log("📤 Payload rezervare:", rezervarePayload);
  
        const rezervareResponse = await fetch(`${this.baseURL}/rezervari`, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(rezervarePayload)
        });
  
        if (!rezervareResponse.ok) {
          const errorText = await rezervareResponse.text();
          throw new Error(`HTTP ${rezervareResponse.status}: ${errorText || rezervareResponse.statusText}`);
        }
  
        const rezervareResult = await rezervareResponse.json();
  
        if (!rezervareResult.success) {
          throw new Error(rezervareResult.message || 'Eroare la crearea rezervării');
        }
  
        console.log("✅ Rezervare creată:", rezervareResult);
  
        // 2. Creează liniile rezervării (pozițiile selectate)
        if (reservationData.selectedPositions && reservationData.selectedPositions.length > 0) {
          await this.createReservationLines(
            rezervareResult.rezervareId, 
            reservationData.selectedPositions
          );
        }
  
        // 🔔 3. NOTIFICAREA SE CREEAZĂ AUTOMAT ÎN BACKEND!
        console.log("🔔 Notificare creată automat pentru codul:", rezervareResult.codRezervare);
  
        return {
          success: true,
          rezervareId: rezervareResult.rezervareId,
          codRezervare: rezervareResult.codRezervare,
          stareRezervare: rezervareResult.stareRezervare,
          message: `Rezervare confirmată cu codul ${rezervareResult.codRezervare}`
        };
  
      } catch (error) {
        console.error("❌ Eroare la crearea rezervării:", error);
        return {
          success: false,
          message: error.message || 'Eroare neașteptată la crearea rezervării'
        };
      }
    }
  
    /**
     * Creează liniile rezervării (pozițiile selectate)
     */
    async createReservationLines(rezervareId, selectedPositions) {
      try {
        const selectablePositions = selectedPositions.filter(pos => pos.selectable);
        
        for (const position of selectablePositions) {
          const liniePayload = {
            rezervare: { id: rezervareId },
            tipEchipament: { 
              id: this.getTipEchipamentId(position.type) 
            },
            echipament: { 
              id: this.generateEchipamentId(position) 
            },
            pretBucata: position.price
          };
  
          const response = await fetch(`${this.baseURL}/rezervari-linii`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(liniePayload)
          });
  
          if (!response.ok) {
            console.warn(`⚠️ Eroare la salvarea liniei pentru poziția ${position.id}`);
          }
        }
  
        console.log(`✅ ${selectablePositions.length} linii de rezervare salvate`);
  
      } catch (error) {
        console.error("❌ Eroare la crearea liniilor rezervării:", error);
        // Nu aruncăm eroare pentru că rezervarea principală e deja creată
      }
    }
  
    /**
     * 🔍 Obține rezervările utilizatorului
     */
    async getUserReservations() {
      try {
        const response = await fetch(`${this.baseURL}/rezervari/my`, {
          headers: this.getHeaders()
        });
  
        if (!response.ok) {
          throw new Error('Eroare la obținerea rezervărilor');
        }
  
        const result = await response.json();
        return result.success ? result.rezervari : [];
  
      } catch (error) {
        console.error("❌ Eroare la obținerea rezervărilor:", error);
        return [];
      }
    }
  
    /**
     * ❌ Anulează rezervare
     */
    async cancelReservation(rezervareId) {
      try {
        const response = await fetch(`${this.baseURL}/rezervari/${rezervareId}/anuleaza`, {
          method: 'PUT',
          headers: this.getHeaders()
        });
  
        const result = await response.json();
  
        if (result.success) {
          console.log("❌ Rezervare anulată cu succes");
          // 🔔 Notificarea de anulare se creează automat în backend!
        }
  
        return result;
  
      } catch (error) {
        console.error("❌ Eroare la anularea rezervării:", error);
        return {
          success: false,
          message: error.message || 'Eroare la anularea rezervării'
        };
      }
    }
  
    /**
     * 🛠️ HELPER METHODS
     */
  
    // Mapează tipul poziției la ID-ul din baza de date
    getTipEchipamentId(positionType) {
      const tipuriMap = {
        'sezlong': 1,
        'baldachin': 2,
        'umbrella': 3
      };
      return tipuriMap[positionType] || 1;
    }
  
    // Generează ID pentru echipament bazat pe poziție
    generateEchipamentId(position) {
      // Creează un ID unic bazat pe row și col
      return (position.row * 1000) + position.col;
    }
  
    /**
     * 🔔 Obține notificările utilizatorului (helper)
     */
    async getUserNotifications() {
      try {
        const response = await fetch(`${this.baseURL}/api/notificari/recente`, {
          headers: this.getHeaders()
        });
  
        if (!response.ok) {
          return [];
        }
  
        const notifications = await response.json();
        return notifications || [];
  
      } catch (error) {
        console.error("❌ Eroare la obținerea notificărilor:", error);
        return [];
      }
    }
  }
  
  // Export ca singleton
  const reservationApiService = new ReservationApiService();
  export default reservationApiService;