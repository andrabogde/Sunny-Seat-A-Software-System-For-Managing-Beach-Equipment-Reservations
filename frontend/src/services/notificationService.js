// src/services/notificationService.js
class NotificationService {
    constructor() {
      this.baseURL = 'http://localhost:8080/api/notificari';
    }
  
    getAuthToken() {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
  
    getHeaders() {
      const token = this.getAuthToken();
      const headers = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      return headers;
    }
  
    /**
     * Preia notificările utilizatorului cu paginare
     */
    async fetchNotifications(page = 0, size = 10) {
      try {
        console.log('🔍 Fetching notifications...', { page, size });
        
        const token = this.getAuthToken();
        if (!token) {
          throw new Error('Nu ești autentificat. Te rugăm să te loghezi.');
        }
  
        const url = `${this.baseURL}?page=${page}&size=${size}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getHeaders(),
          credentials: 'include'
        });
  
        console.log('📡 Response status:', response.status);
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Response error:', errorText);
          throw new Error(`Eroare ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log('✅ Notifications data received:', data);
        
        // Transformă datele pentru compatibilitate cu interfața
        const transformedNotifications = data.content.map(notif => ({
          id: notif.id,
          tip: this.getTipFromContent(notif.continut),
          titlu: this.getTitluFromContent(notif.continut),
          mesaj: notif.continut,
          codRezervare: this.extractCodRezervare(notif.continut),
          data: new Date(notif.dataOra),
          citita: false, // Backend-ul nu gestionează starea citită momentan
          important: this.isImportant(notif.continut),
          rezervareId: notif.rezervareId
        }));
  
        return {
          content: transformedNotifications,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          currentPage: data.number,
          size: data.size
        };
        
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        throw error;
      }
    }
  
    /**
     * Preia ultimele notificări
     */
    async fetchRecentNotifications() {
      try {
        console.log('🔍 Fetching recent notifications...');
        
        const response = await fetch(`${this.baseURL}/recente`, {
          method: 'GET',
          headers: this.getHeaders(),
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error(`Eroare ${response.status}: ${response.statusText}`);
        }
  
        const data = await response.json();
        
        // Transformă datele
        return data.map(notif => ({
          id: notif.id,
          tip: this.getTipFromContent(notif.continut),
          titlu: this.getTitluFromContent(notif.continut),
          mesaj: notif.continut,
          codRezervare: this.extractCodRezervare(notif.continut),
          data: new Date(notif.dataOra),
          citita: false,
          important: this.isImportant(notif.continut),
          rezervareId: notif.rezervareId
        }));
        
      } catch (error) {
        console.error('❌ Error fetching recent notifications:', error);
        throw error;
      }
    }
  
    /**
     * Șterge o notificare
     */
    async deleteNotification(notificationId) {
      try {
        console.log('🗑️ Deleting notification:', notificationId);
        
        const response = await fetch(`${this.baseURL}/${notificationId}`, {
          method: 'DELETE',
          headers: this.getHeaders(),
          credentials: 'include'
        });
  
        if (!response.ok) {
          throw new Error('Eroare la ștergerea notificării');
        }
  
        const data = await response.json();
        console.log('✅ Notification deleted:', data.message);
        return true;
        
      } catch (error) {
        console.error('❌ Error deleting notification:', error);
        throw error;
      }
    }
  
    /**
     * Șterge notificările selectate
     */
    async deleteNotifications(notificationIds) {
      try {
        console.log('🗑️ Deleting notifications:', notificationIds);
        
        const response = await fetch(`${this.baseURL}/bulk`, {
          method: 'DELETE',
          headers: this.getHeaders(),
          credentials: 'include',
          body: JSON.stringify(notificationIds)
        });
  
        if (!response.ok) {
          throw new Error('Eroare la ștergerea notificărilor');
        }
  
        const data = await response.json();
        console.log('✅ Notifications deleted:', data.message);
        return true;
        
      } catch (error) {
        console.error('❌ Error deleting notifications:', error);
        throw error;
      }
    }
  
    /**
     * Test endpoint pentru verificarea conectivității
     */
    async testConnection() {
      try {
        const response = await fetch(`${this.baseURL}/test`, {
          method: 'GET',
          headers: this.getHeaders()
        });
  
        if (!response.ok) {
          throw new Error(`Test failed: ${response.status}`);
        }
  
        const result = await response.text();
        console.log('✅ Connection test successful:', result);
        return result;
        
      } catch (error) {
        console.error('❌ Connection test failed:', error);
        throw error;
      }
    }
  
    // Helper functions pentru parsarea conținutului
    getTipFromContent(continut) {
      const content = continut.toLowerCase();
      if (content.includes('confirmată') || content.includes('confirmata')) return 'rezervare';
      if (content.includes('anulată') || content.includes('anulata')) return 'anulare';
      if (content.includes('modificată') || content.includes('modificata')) return 'modificare';
      if (content.includes('reminder') || content.includes('nu uita')) return 'reminder';
      if (content.includes('sistem') || content.includes('actualizare')) return 'system';
      if (content.includes('ofertă') || content.includes('reducere')) return 'oferta';
      return 'system';
    }
  
    getTitluFromContent(continut) {
      const content = continut.toLowerCase();
      if (content.includes('confirmată') || content.includes('confirmata')) return '✅ Rezervare confirmată';
      if (content.includes('anulată') || content.includes('anulata')) return '❌ Rezervare anulată';
      if (content.includes('modificată') || content.includes('modificata')) return '🔄 Rezervare modificată';
      if (content.includes('reminder')) return '⏰ Reminder rezervare';
      if (content.includes('sistem')) return '🔧 Notificare sistem';
      if (content.includes('ofertă')) return '🎁 Ofertă specială';
      return '📢 Notificare';
    }
  
    extractCodRezervare(continut) {
      const match = continut.match(/RZ\d+/);
      return match ? match[0] : null;
    }
  
    isImportant(continut) {
      const content = continut.toLowerCase();
      return content.includes('confirmată') || 
             content.includes('confirmata') || 
             content.includes('anulată') || 
             content.includes('anulata') ||
             content.includes('important');
    }
  }
  
  export default new NotificationService();