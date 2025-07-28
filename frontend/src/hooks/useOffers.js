import { useState, useEffect, useCallback } from 'react';
import offersService from '../services/OffersService';

/**
 * Hook pentru gestionarea ofertelor în componentele React
 * @param {Array} beaches - Lista de plaje (opțional)
 * @returns {Object} - Obiect cu datele și funcțiile pentru oferte
 */
const useOffers = (beaches = null) => {
  const [offers, setOffers] = useState(offersService.getCurrentOffers());
  const [timeRemaining, setTimeRemaining] = useState(offersService.getTimeUntilNextRefresh());
  const [isLoading, setIsLoading] = useState(false);

  // Handler pentru actualizarea ofertelor
  const handleOffersUpdate = useCallback((newOffers) => {
    setOffers(newOffers);
  }, []);

  // Effect pentru înregistrarea listener-ului
  useEffect(() => {
    offersService.addListener(handleOffersUpdate);
    
    return () => {
      offersService.removeListener(handleOffersUpdate);
    };
  }, [handleOffersUpdate]);

  // Effect pentru actualizarea automată a ofertelor
  useEffect(() => {
    if (beaches && beaches.length > 0) {
      // Verifică dacă ofertele trebuie actualizate
      if (offersService.shouldRefreshOffers()) {
        setIsLoading(true);
        setTimeout(() => {
          offersService.updateOffers(beaches);
          setIsLoading(false);
        }, 500); // Mic delay pentru UX mai bun
      }
    }
  }, [beaches]);

  // Timer pentru countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = offersService.getTimeUntilNextRefresh();
      setTimeRemaining(remaining);

      // Dacă timpul a expirat și avem plaje, actualizează ofertele
      if (remaining.hours === 0 && remaining.minutes === 0 && remaining.seconds === 0) {
        if (beaches && beaches.length > 0) {
          offersService.updateOffers(beaches);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [beaches]);

  // Funcție pentru obținerea ofertei unei plaje specifice
  const getOfferForBeach = useCallback((beachId) => {
    return offersService.getOfferForBeach(beachId);
  }, []);

  // Funcție pentru forțarea actualizării ofertelor
  const refreshOffers = useCallback(() => {
    if (beaches && beaches.length > 0) {
      setIsLoading(true);
      setTimeout(() => {
        offersService.forceRefresh(beaches);
        setIsLoading(false);
      }, 500);
    }
  }, [beaches]);

  // Funcție pentru obținerea statisticilor
  const getStats = useCallback(() => {
    return offersService.getOffersStats();
  }, []);

  return {
    // Date
    offers,
    timeRemaining,
    isLoading,
    isActive: offersService.isActive(),
    
    // Funcții
    getOfferForBeach,
    refreshOffers,
    getStats,
    
    // Statistici
    stats: getStats()
  };
};

export default useOffers;