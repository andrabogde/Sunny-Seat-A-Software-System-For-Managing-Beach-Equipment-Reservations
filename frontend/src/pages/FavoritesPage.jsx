import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconHeart, IconHeartOff, IconBeach, IconMapPin, IconStar, IconSun } from '@tabler/icons-react';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { AuthContext } from '../contexts/AuthContext';
import FavoriteApiClient from '../services/FavoriteApiClient';
import PlajaCard from '../components/plaje/PlajaCard';

const FavoritesPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const { favorites, favoritesCount, removeFavorite } = useContext(FavoritesContext);
    
    const [plajeFavorite, setPlajeFavorite] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Încărcăm detaliile complete ale plajelor favorite
    useEffect(() => {
        const loadFavoritePlaje = async () => {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            if (favorites.length === 0) {
                setPlajeFavorite([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // Obținem detaliile complete ale plajelor favorite din backend
                const favoritesData = await FavoriteApiClient.getUserFavorites();
                console.log(favoritesData);
                setPlajeFavorite(favoritesData);
                
            } catch (err) {
                console.error("Eroare la încărcarea plajelor favorite:", err);
                setError("Nu s-au putut încărca plajele favorite. Încercați din nou mai târziu.");
            } finally {
                setLoading(false);
            }
        };

        loadFavoritePlaje();
    }, [favorites, isAuthenticated, navigate]);

    // Handler pentru eliminarea unei plaje din favorite
    const handleRemoveFavorite = async (plajaId, e) => {
        e.stopPropagation();
        
        try {
            const success = await removeFavorite(plajaId);
            if (success) {
                // Actualizează lista locală
                setPlajeFavorite(prev => prev.filter(plaja => plaja.plajaId !== plajaId));
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    // Handler pentru navigarea la pagina de detalii a plajei
    const handleNavigateToDetails = (plajaId) => {
        navigate(`/plaja/${plajaId}`);
    };

    if (!isAuthenticated) {
        return (
            <div className="container my-5">
                <div className="alert alert-warning">
                    <h5>Autentificare necesară</h5>
                    <p>Pentru a vedea plajele favorite, trebuie să te autentifici.</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate('/login')}
                    >
                        Conectează-te
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container my-5">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <IconHeart size={36} className="me-3 text-danger" />
                            <div>
                                <h2 className="mb-0">Plajele mele favorite</h2>
                                <p className="text-muted mb-0">
                                    {favoritesCount} plaje salvate
                                </p>
                            </div>
                        </div>
                        
                        <button 
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/plaje')}
                        >
                            Explorează plaje
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading state */}
            {loading && (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Se încarcă...</span>
                    </div>
                    <p className="text-muted">Se încarcă plajele favorite...</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center">
                    <IconHeart size={24} className="me-2" />
                    <div>
                        <h6 className="alert-heading mb-1">Eroare la încărcare</h6>
                        <small>{error}</small>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && favorites.length === 0 && (
                <div className="text-center py-5">
                    <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>💔</div>
                    <h4 className="text-muted mb-3">Nu ai nicio plajă favorită</h4>
                    <p className="text-muted mb-4">
                        Explorează plajele disponibile și adaugă-le la favorite pentru a le accesa rapid.
                    </p>
                    <button 
                        className="btn btn-primary rounded-pill px-4"
                        onClick={() => navigate('/plaje')}
                    >
                        <IconBeach className="me-2" size={18} />
                        Descoperă plaje
                    </button>
                </div>
            )}

            {/* Lista plajelor favorite */}
            {!loading && !error && plajeFavorite.length > 0 && (
                <div className="row g-4">
                    {plajeFavorite.map((favorite) => (
                        <div key={favorite.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                            <div className="card h-100 shadow-sm border-0 rounded-4 position-relative">
                                {/* Buton pentru eliminarea din favorite */}
                                <button
                                    className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle border-0 shadow-sm"
                                    style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        zIndex: 10,
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                                    }}
                                    onClick={(e) => handleRemoveFavorite(favorite.plajaId, e)}
                                    title="Elimină din favorite"
                                >
                                    <IconHeartOff size={18} className="text-danger" />
                                </button>

                                {/* Imagine plajă */}
                                <div 
                                    className="position-relative overflow-hidden rounded-top-4"
                                    style={{ height: '200px', cursor: 'pointer' }}
                                    onClick={() => handleNavigateToDetails(favorite.plajaId)}
                                >
                                    <img
                                        src={favorite.imagineUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&crop=center&auto=format&q=80'}
                                        className="w-100 h-100"
                                        alt={favorite.numePlaja}
                                        style={{ objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&crop=center&auto=format&q=80';
                                        }}
                                    />
                                    
                                    {/* Overlay gradient */}
                                    <div 
                                        className="position-absolute bottom-0 start-0 w-100"
                                        style={{
                                            height: '60px',
                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                            pointerEvents: 'none'
                                        }}
                                    />

                                    {/* Rating badge */}
                                    {favorite.rating && (
                                        <div className="position-absolute bottom-0 start-0 m-2">
                                            <span className="badge bg-warning text-dark px-2 py-1 rounded-pill shadow">
                                                <IconStar size={14} className="me-1" />
                                                {favorite.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Card body */}
                                <div className="card-body p-3">
                                    <h6 className="card-title mb-2 fw-bold">
                                        {favorite.numePlaja}
                                    </h6>
                                    
                                    <div className="d-flex align-items-center text-muted mb-2">
                                        <IconMapPin size={16} className="me-1" />
                                        <small>{favorite.numeStatiune || 'România'}</small>
                                    </div>

                                    {favorite.numarSezlonguri && (
                                        <div className="d-flex align-items-center text-muted mb-3">
                                            <IconSun size={16} className="me-1" />
                                            <small>{favorite.numarSezlonguri} șezlonguri</small>
                                        </div>
                                    )}

                                    <div className="d-flex align-items-center justify-content-between text-muted mb-3">
                                        <small>
                                            Adăugat: {new Date(favorite.dataOraAdaugare).toLocaleDateString('ro-RO')}
                                        </small>
                                        <IconHeart size={16} className="text-danger" />
                                    </div>

                                    <button 
                                        className="btn btn-primary btn-sm w-100"
                                        onClick={() => handleNavigateToDetails(favorite.plajaId)}
                                    >
                                        <IconBeach size={16} className="me-1" />
                                        Vezi detalii
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Acțiuni suplimentare */}
            {!loading && !error && plajeFavorite.length > 0 && (
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4 bg-light">
                            <div className="card-body p-4 text-center">
                                <h5 className="card-title mb-3">Gestionează favoritele</h5>
                                <p className="text-muted mb-4">
                                    Ai {favoritesCount} plaje salvate la favorite. Explorează mai multe plaje sau planifică-ți următoarea vacanță.
                                </p>
                                <div className="d-flex gap-3 justify-content-center flex-wrap">
                                    <button 
                                        className="btn btn-outline-primary"
                                        onClick={() => navigate('/plaje')}
                                    >
                                        Explorează mai multe plaje
                                    </button>
                                    <button 
                                        className="btn btn-outline-secondary"
                                        onClick={() => navigate('/rezervari')}
                                    >
                                        Rezervările mele
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoritesPage;