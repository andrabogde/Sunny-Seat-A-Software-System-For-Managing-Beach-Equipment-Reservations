/**
 * OffersService - Serviciu pentru gestionarea ofertelor pentru plaje
 * Sincronizează ofertele între pagina Oferte și paginile individuale de plaje
 */

// Constante pentru storage
const OFFERS_STORAGE_KEY = 'sunnyseat_current_offers';
const OFFERS_TIMESTAMP_KEY = 'sunnyseat_offers_timestamp';
const OFFERS_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 oră în milisecunde

class OffersService {
  constructor() {
    this.listeners = [];
    this.currentOffers = this.loadOffersFromStorage() || [];
  }

  /**
   * Adaugă un listener pentru schimbările de oferte
   * @param {Function} callback - Funcția care va fi apelată când se schimbă ofertele
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Elimină un listener
   * @param {Function} callback - Funcția de eliminat
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notifică toți listeners-ii despre schimbarea ofertelor
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.currentOffers);
      } catch (error) {
        console.error('Eroare la notificarea listener-ului:', error);
      }
    });
  }

  /**
   * Generează oferte aleatorii pentru o listă de plaje
   * @param {Array} beaches - Lista de plaje
   * @param {number} count - Numărul de oferte de generat (default: 5)
   * @returns {Array} - Lista de oferte generate
   */
  generateRandomOffers(beaches, count = 5) {
    if (!beaches || beaches.length === 0) return [];

    // Selectează plaje aleatorii
    const shuffled = [...beaches].sort(() => 0.5 - Math.random());
    const selectedBeaches = shuffled.slice(0, Math.min(count, beaches.length));

    const offers = selectedBeaches.map(beach => {
      const originalPrice = Math.floor(Math.random() * 50) + 40; // 40-90 RON
      const discountPercent = Math.floor(Math.random() * 20) + 30; // 30-50% reducere
      const discountedPrice = Math.floor(originalPrice * (100 - discountPercent) / 100);
      
      return {
        id: beach.id,
        beachId: beach.id, // ID-ul plajei pentru referință
        name: beach.denumire || 'Plajă',
        location: beach.statiune?.denumire || 'Litoral',
        image: this.getBeachImage(beach),
        originalPrice,
        discountedPrice,
        discount: discountPercent,
        rating: beach.detaliiWeb?.rating || (4.0 + Math.random() * 1).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 50,
        facilities: this.generateFacilities(beach),
        createdAt: Date.now(),
        expiresAt: Date.now() + OFFERS_REFRESH_INTERVAL
      };
    });

    return offers;
  }

  /**
   * Obține imaginea pentru o plajă
   * @param {Object} beach - Obiectul plajă
   * @returns {string} - URL-ul imaginii
   */
  getBeachImage(beach) {
    if (beach.detaliiWeb?.images && beach.detaliiWeb.images.length > 0) {
      return beach.detaliiWeb.images[0].replace("maxwidth=400", "maxwidth=800");
    }
    
    // Imagini default bazate pe locația plajei
    const defaultImages = {
      'mamaia': "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      'eforie': "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      'costinesti': "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      'neptun': "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      'jupiter': "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    };

    const location = (beach.statiune?.denumire || '').toLowerCase();
    return defaultImages[location] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  }

  /**
   * Generează facilitățile pe baza datelor plajei
   * @param {Object} beach - Obiectul plajă
   * @returns {Array} - Lista de facilități
   */
  generateFacilities(beach) {
    const allFacilities = [
      'Restaurant', 'Bar', 'Duș', 'WiFi', 'Salvare', 
      'Parcare', 'Animație', 'Spa', 'Club', 'Sport nautic',
      'Loc de joacă', 'Magazin', 'Cafenea'
    ];
    
    // Dacă plaja are facilități specificate, folosește-le
    if (beach.facilitati && beach.facilitati.length > 0) {
      return beach.facilitati.slice(0, 4);
    }
    
    // Altfel generează aleatoriu
    const numFacilities = Math.floor(Math.random() * 3) + 2; // 2-4 facilități
    return allFacilities.sort(() => 0.5 - Math.random()).slice(0, numFacilities);
  }

  /**
   * Verifică dacă ofertele trebuie reîmprospătate
   * @returns {boolean}
   */
  shouldRefreshOffers() {
    const lastUpdate = localStorage.getItem(OFFERS_TIMESTAMP_KEY);
    if (!lastUpdate) return true;
    
    const now = Date.now();
    const timeDiff = now - parseInt(lastUpdate);
    return timeDiff >= OFFERS_REFRESH_INTERVAL;
  }

  /**
   * Salvează ofertele în localStorage
   * @param {Array} offers - Lista de oferte
   */
  saveOffersToStorage(offers) {
    try {
      localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
      localStorage.setItem(OFFERS_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Eroare la salvarea ofertelor în storage:', error);
    }
  }

  /**
   * Încarcă ofertele din localStorage
   * @returns {Array|null} - Lista de oferte sau null
   */
  loadOffersFromStorage() {
    try {
      const stored = localStorage.getItem(OFFERS_STORAGE_KEY);
      if (!stored) return null;
      
      const offers = JSON.parse(stored);
      
      // Verifică dacă ofertele nu au expirat
      const now = Date.now();
      const validOffers = offers.filter(offer => {
        return offer.expiresAt && offer.expiresAt > now;
      });
      
      return validOffers.length > 0 ? validOffers : null;
    } catch (error) {
      console.error('Eroare la citirea ofertelor din storage:', error);
      return null;
    }
  }

  /**
   * Actualizează ofertele cu o listă nouă de plaje
   * @param {Array} beaches - Lista de plaje
   * @param {number} count - Numărul de oferte (default: 5)
   */
  updateOffers(beaches, count = 5) {
    const newOffers = this.generateRandomOffers(beaches, count);
    this.currentOffers = newOffers;
    this.saveOffersToStorage(newOffers);
    this.notifyListeners();
    
    console.log(`Oferte actualizate: ${newOffers.length} oferte noi generate`);
    return newOffers;
  }

  /**
   * Obține ofertele curente
   * @returns {Array} - Lista ofertelor curente
   */
  getCurrentOffers() {
    return this.currentOffers || [];
  }

  /**
   * Verifică dacă o plajă specifică are ofertă activă
   * @param {number|string} beachId - ID-ul plajei
   * @returns {Object|null} - Oferta pentru plajă sau null
   */
  getOfferForBeach(beachId) {
    const offers = this.getCurrentOffers();
    return offers.find(offer => offer.beachId == beachId) || null;
  }

  /**
   * Calculează timpul rămas până la următoarea actualizare
   * @returns {Object} - Obiect cu ore, minute și secunde
   */
  getTimeUntilNextRefresh() {
    const lastUpdate = localStorage.getItem(OFFERS_TIMESTAMP_KEY);
    if (!lastUpdate) return { hours: 1, minutes: 0, seconds: 0 };

    const nextUpdate = parseInt(lastUpdate) + OFFERS_REFRESH_INTERVAL;
    const now = Date.now();
    const timeLeft = Math.max(0, nextUpdate - now);

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  /**
   * Forțează actualizarea ofertelor (pentru testare)
   * @param {Array} beaches - Lista de plaje
   */
  forceRefresh(beaches) {
    // Șterge timestamp-ul pentru a forța refresh
    localStorage.removeItem(OFFERS_TIMESTAMP_KEY);
    return this.updateOffers(beaches);
  }

  /**
   * Curăță toate datele de oferte
   */
  clearOffers() {
    localStorage.removeItem(OFFERS_STORAGE_KEY);
    localStorage.removeItem(OFFERS_TIMESTAMP_KEY);
    this.currentOffers = [];
    this.notifyListeners();
  }

  /**
   * Obține statistici despre oferte
   * @returns {Object} - Statistici
   */
  getOffersStats() {
    const offers = this.getCurrentOffers();
    if (offers.length === 0) {
      return {
        totalOffers: 0,
        averageDiscount: 0,
        maxDiscount: 0,
        totalSavings: 0
      };
    }

    const totalDiscount = offers.reduce((sum, offer) => sum + offer.discount, 0);
    const totalSavings = offers.reduce((sum, offer) => sum + (offer.originalPrice - offer.discountedPrice), 0);
    const maxDiscount = Math.max(...offers.map(offer => offer.discount));

    return {
      totalOffers: offers.length,
      averageDiscount: Math.round(totalDiscount / offers.length),
      maxDiscount: maxDiscount,
      totalSavings: totalSavings
    };
  }

  /**
   * Verifică dacă serviciul de oferte este activ
   * @returns {boolean}
   */
  isActive() {
    return this.currentOffers && this.currentOffers.length > 0;
  }
}

// Creează o instanță singleton
const offersService = new OffersService();

export default offersService;