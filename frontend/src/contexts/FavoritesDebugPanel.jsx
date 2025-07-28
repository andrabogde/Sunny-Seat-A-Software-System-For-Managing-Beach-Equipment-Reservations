import React, { useContext } from 'react';
import { FavoritesContext } from './FavoritesContext';
import { AuthContext } from './AuthContext';

// Componentă temporară pentru debug - adaugă-o în pagina cu plajele
const FavoritesDebugPanel = () => {
  const favoritesContext = useContext(FavoritesContext);
  const authContext = useContext(AuthContext);

  if (!favoritesContext || !authContext) {
    return (
      <div className="alert alert-danger">
        <h5>🚨 Context Debug</h5>
        <p>FavoritesContext: {favoritesContext ? '✅' : '❌'}</p>
        <p>AuthContext: {authContext ? '✅' : '❌'}</p>
      </div>
    );
  }

  const { 
    favorites, 
    favoritesCount, 
    loading, 
    error, 
    toggleFavorite 
  } = favoritesContext;

  const { isAuthenticated, user } = authContext;

  const testToggle = async () => {
    console.log('🧪 Testing toggle with sample ID: 1');
    const result = await toggleFavorite(1);
    console.log('🧪 Test result:', result);
  };

  return (
    <div className="card mt-3 mb-3">
      <div className="card-header">
        <h5>🔍 Favorites Debug Panel</h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6">
            <h6>Auth Status:</h6>
            <ul className="list-unstyled">
              <li>Authenticated: {isAuthenticated ? '✅' : '❌'}</li>
              <li>User: {user ? '✅' : '❌'}</li>
              {user && (
                <>
                  <li>User ID: {user.id}</li>
                  <li>User Email: {user.email}</li>
                </>
              )}
            </ul>
          </div>
          <div className="col-md-6">
            <h6>Favorites Status:</h6>
            <ul className="list-unstyled">
              <li>Loading: {loading ? '⏳' : '✅'}</li>
              <li>Count: {favoritesCount}</li>
              <li>Array Length: {favorites.length}</li>
              <li>Error: {error ? '❌' : '✅'}</li>
              {error && <li className="text-danger">Error: {error}</li>}
            </ul>
          </div>
        </div>
        
        <div className="mt-3">
          <h6>Current Favorites:</h6>
          <p className="small text-muted">
            {favorites.length > 0 
              ? `[${favorites.join(', ')}]` 
              : 'Nicio favorită încărcată'
            }
          </p>
        </div>

        <div className="mt-3">
          <button 
            className="btn btn-sm btn-primary me-2" 
            onClick={testToggle}
            disabled={loading || !isAuthenticated}
          >
            🧪 Test Toggle (ID: 1)
          </button>
          
          <button 
            className="btn btn-sm btn-secondary" 
            onClick={() => console.log('Current state:', { 
              favorites, 
              favoritesCount, 
              loading, 
              error, 
              isAuthenticated, 
              user: !!user 
            })}
          >
            📝 Log State
          </button>
        </div>

        {/* Instrucțiuni pentru utilizator */}
        <div className="alert alert-info mt-3">
          <small>
            <strong>Pentru debug:</strong><br/>
            1. Deschide Console (F12)<br/>
            2. Apasă pe un buton de favorite de la o plajă<br/>
            3. Urmărește mesajele care încep cu 🔍, ✅, ❌<br/>
            4. Verifică dacă se fac request-uri în Network tab
          </small>
        </div>
      </div>
    </div>
  );
};

export default FavoritesDebugPanel;