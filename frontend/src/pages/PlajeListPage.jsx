import React, { useState, useEffect } from 'react';
import { IconBeach, IconWaveSine } from '@tabler/icons-react';
import PlajasList from '../components/plaje/PlajasList';
import PlajaFilters from '../components/plaje/PlajaFilters'; // Componenta de filtre
import ApiClient from "../api/src/ApiClient";
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";

// Definim culorile personalizate
const colors = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#f39c12',
  turquoise: '#20c997',
  dark: '#2c3e50',
  light: '#ecf0f1'
};

// Inițializăm client-ul API
const apiClient = new ApiClient();
apiClient.enableCookies = true;
const plajaApi = new PlajaControllerApi(apiClient);

/**
 * Pagina de listare completă a plajelor cu filtre
 */
const PlajeListPage = () => {
  const [plaje, setPlaje] = useState([]);
  const [filtratedPlaje, setFiltratedPlaje] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    statiune: "",
    rating: 0,
    sezlonguri: 0
  });
  
  // Lista stațiunilor pentru filtru
  const [statiuni, setStatiuni] = useState([]);
  // Numărul maxim de șezlonguri pentru slider
  const [maxSezlonguri, setMaxSezlonguri] = useState(200);

  useEffect(() => {
    // Funcție pentru încărcarea plajelor
    const loadPlaje = async () => {
      try {
        setLoading(true);
        
        // Folosim API-ul pentru a obține toate plajele
        plajaApi.getAllPlajeUsingGET((error, data) => {
          if (error) {
            console.error("Eroare la încărcarea plajelor:", error);
            setError("Nu s-au putut încărca plajele. Încercați din nou mai târziu.");
          } else {
            // Setăm toate plajele
            const plajeData = data || [];
            setPlaje(plajeData);
            setFiltratedPlaje(plajeData);
            
            // Extragem stațiunile unice pentru filtru
            const uniqueStatiuni = [...new Set(plajeData
              .filter(plaja => plaja.statiune?.denumire)
              .map(plaja => plaja.statiune.denumire))]
              .sort();
            setStatiuni(uniqueStatiuni);
            
            // Calculăm numărul maxim de șezlonguri pentru slider
            const maxSezlonguriValue = plajeData.reduce((max, plaja) => {
              const sezlonguri = plaja.detaliiWeb?.sezlonguri || 0;
              return sezlonguri > max ? sezlonguri : max;
            }, 0);
            setMaxSezlonguri(Math.max(200, maxSezlonguriValue));
            
            setError(null);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Eroare neașteptată:", err);
        setError("A apărut o eroare neașteptată. Încercați din nou mai târziu.");
        setLoading(false);
      }
    };

    loadPlaje();
  }, []);

  // Aplicăm filtrele când se schimbă
  useEffect(() => {
    if (!loading && plaje.length > 0) {
      let result = [...plaje];
      
      // Filtrare după stațiune
      if (filters.statiune) {
        result = result.filter(plaja => 
          plaja.statiune?.denumire === filters.statiune
        );
      }
      
      // Filtrare după rating minim
      if (filters.rating > 0) {
        result = result.filter(plaja => 
          (plaja.detaliiWeb?.rating || 0) >= filters.rating
        );
      }
      
      // Filtrare după număr minim de șezlonguri
      if (filters.sezlonguri > 0) {
        result = result.filter(plaja => 
          (plaja.detaliiWeb?.sezlonguri || 0) >= filters.sezlonguri
        );
      }
      
      setFiltratedPlaje(result);
    }
  }, [filters, plaje, loading]);

  return (
    <div className="py-5">
      <div className="container">
        {/* Header pagină */}
        <div className="row mb-5">
          <div className="col-lg-8">
            <h1 className="fw-bold mb-3 position-relative border-start ps-4" style={{ 
                borderLeftWidth: '4px !important', 
                borderLeftColor: `${colors.turquoise} !important` 
              }}>
              <IconBeach size={38} className="me-2" style={{ color: colors.turquoise }} />
              Toate Plajele
            </h1>
            <div className="d-flex align-items-center mb-4">
              <IconWaveSine size={22} className="me-2" style={{ color: colors.primary }} />
              <p className="lead mb-0">Găsește plaja perfectă pentru vacanța ta și rezervă acum</p>
            </div>
          </div>
        </div>
        
        {/* Bara de filtre */}
        <div className="mb-5">
          <PlajaFilters 
            filters={filters} 
            setFilters={setFilters} 
            statiuni={statiuni} 
            maxSezlonguri={maxSezlonguri}
          />
        </div>
        
        {/* Afișăm numărul de rezultate după filtrare */}
        {!loading && (
          <div className="mb-4">
            <p className="text-muted">
              {filtratedPlaje.length} {filtratedPlaje.length === 1 ? 'plajă găsită' : 'plaje găsite'}
              {(filters.statiune || filters.rating > 0 || filters.sezlonguri > 0) && ' conform filtrelor selectate'}
            </p>
          </div>
        )}
        
        {/* Lista de plaje filtrate */}
        <PlajasList 
          plaje={filtratedPlaje} 
          loading={loading} 
          error={error} 
        />
      </div>
    </div>
  );
};

export default PlajeListPage;