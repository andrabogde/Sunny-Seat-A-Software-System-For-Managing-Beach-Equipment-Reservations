import React, { useContext } from 'react';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { FavoritesContext } from '../../contexts/FavoritesContext';
import { AuthContext } from '../../contexts/AuthContext';

const FavoriteButton = ({ plajaId, className = '', size = 'medium', position = 'card' }) => {
  const favoritesContext = useContext(FavoritesContext);
  const authContext = useContext(AuthContext);
  
  // Debug logs
  console.log('🔍 FavoriteButton Debug pentru plajaId:', plajaId, {
    plajaId,
    plajaIdType: typeof plajaId,
    plajaIdValid: plajaId != null && plajaId !== '',
    favoritesContext: !!favoritesContext,
    authContext: !!authContext,
    isAuthenticated: authContext?.isAuthenticated,
    user: !!authContext?.user,
    favorites: favoritesContext?.favorites,
    favoritesLength: favoritesContext?.favorites?.length,
    loading: favoritesContext?.loading
  });

  // Verificări de siguranță
  if (!plajaId || plajaId === '') {
    console.error('❌ plajaId is invalid:', plajaId);
    return null;
  }

  if (!favoritesContext) {
    console.error('❌ FavoritesContext is not available');
    return null;
  }
  
  if (!authContext) {
    console.error('❌ AuthContext is not available');
    return null;
  }

  const { favorites, toggleFavorite, loading } = favoritesContext;
  const { isAuthenticated, user } = authContext;
  
  // ✅ ASCUNDE COMPLET BUTONUL dacă utilizatorul nu e autentificat
  if (!isAuthenticated || !user) {
    console.log('👤 User not authenticated pentru plajaId:', plajaId, '- ascund butonul complet');
    return null; // Nu afișează nimic deloc
  }

  // Convertește plajaId la număr dacă este string
  const normalizedPlajaId = typeof plajaId === 'string' ? parseInt(plajaId, 10) : plajaId;
  console.log('🔄 Normalized plajaId:', normalizedPlajaId, 'from:', plajaId);

  const isFavorite = favorites.includes(normalizedPlajaId);
  console.log(`❤️ Is plaja ${normalizedPlajaId} favorite?`, isFavorite, 'din lista:', favorites);

  const sizeMap = {
    small: 16,
    medium: 20,
    large: 24,
  };

  const handleClick = async (e) => {
    console.log('🖱️ Favorite button clicked for plajaId:', normalizedPlajaId);
    
    // Oprește propagarea evenimentului
    e.stopPropagation();
    e.preventDefault();
    
    if (loading) {
      console.log('⏳ Still loading favorites, ignoring click');
      return;
    }
    
    try {
      console.log('🚀 Calling toggleFavorite with:', normalizedPlajaId);
      const result = await toggleFavorite(normalizedPlajaId);
      console.log('✅ Toggle result pentru plajaId', normalizedPlajaId, ':', result);
      
      if (result === null) {
        console.error('❌ toggleFavorite returned null - verifică API-ul');
        alert('Eroare la adăugarea/eliminarea de la favorite. Verifică consola pentru detalii.');
      }
    } catch (error) {
      console.error('❌ Error in handleClick pentru plajaId', normalizedPlajaId, ':', error);
      alert('Eroare la adăugarea/eliminarea de la favorite. Încearcă din nou.');
    }
  };

  // Stiluri inline pentru a asigura funcționalitatea
  const buttonStyle = {
    cursor: loading ? 'wait' : 'pointer',
    pointerEvents: 'auto', // Foarte important!
    zIndex: 999, // Asigură-te că butonul e deasupra altor elemente
    position: 'relative',
    border: 'none',
    background: 'transparent',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Stiluri diferite bazate pe poziție
  if (position === 'card') {
    buttonStyle.background = 'rgba(255, 255, 255, 0.9)';
    buttonStyle.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    buttonStyle.backdropFilter = 'blur(4px)';
  }

  return (
    <button 
      onClick={handleClick}
      onMouseDown={(e) => {
        console.log('🖱️ Mouse down on favorite button');
        e.stopPropagation();
      }}
      onMouseUp={(e) => {
        console.log('🖱️ Mouse up on favorite button');
        e.stopPropagation();
      }}
      className={className}
      title={isFavorite ? "Șterge de la favorite" : "Adaugă la favorite"}
      aria-label={isFavorite ? "Șterge de la favorite" : "Adaugă la favorite"}
      disabled={loading}
      type="button"
      style={buttonStyle}
    >
      {loading ? (
        <div className="spinner-border spinner-border-sm" role="status" style={{ width: '16px', height: '16px' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
          {isFavorite ? (
            <IconHeartFilled 
              size={sizeMap[size]} 
              className="text-danger" 
            />
          ) : (
            <IconHeart 
              size={sizeMap[size]} 
              className="text-secondary" 
            />
          )}
        </>
      )}
    </button>
  );
};

export default FavoriteButton;