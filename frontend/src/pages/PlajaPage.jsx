import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlajaDetails from '../components/plaje/PlajaDetails';
import ApiClient from "../api/src/ApiClient"; 
import PlajaControllerApi from "../api/src/api/PlajaControllerApi";

const apiClient = new ApiClient();
apiClient.enableCookies = true;
const plajaApi = new PlajaControllerApi(apiClient);

const PlajaPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [plaja, setPlaja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlajaDetails = async () => {
      try {
        setLoading(true);
        plajaApi.getPlajaByIdUsingGET(id, (error, data) => {
          if (error) {
            console.error("Eroare la încărcarea detaliilor plajei:", error);
            setError("Nu s-au putut încărca detaliile plajei. Încercați din nou mai târziu.");
          } else {
            setPlaja(data);
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

    if (id) {
      loadPlajaDetails();
    } else {
      setError("ID-ul plajei lipsește.");
      setLoading(false);
    }
  }, [id]);

  // Handler pentru navigarea către pagina de rezervare
  const handleReservationClick = (plajaId) => {
    navigate(`/rezervare/${plajaId}`);
  };

  return (
    <div>
      {loading ? (
        <div className="container my-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Se încarcă...</span>
          </div>
          <p className="mt-3">Se încarcă detaliile plajei...</p>
        </div>
      ) : error ? (
        <div className="container my-5">
          <div className="alert alert-danger">
            <h4 className="alert-heading">Eroare!</h4>
            <p>{error}</p>
            <hr />
            <p className="mb-0">
              <button 
                className="btn btn-outline-danger" 
                onClick={() => navigate(-1)}
              >
                Înapoi
              </button>
            </p>
          </div>
        </div>
      ) : (
        <PlajaDetails 
          plaja={plaja} 
          onReservationClick={handleReservationClick} 
        />
      )}
    </div>
  );
};

export default PlajaPage;