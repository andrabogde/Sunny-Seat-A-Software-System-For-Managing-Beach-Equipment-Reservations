import React, { createContext, useState, useEffect } from 'react';
import FavoriteApiClient from '../services/FavoriteApiClient';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children, isAuthenticated, user }) => {
    const [favorites, setFavorites] = useState([]);
    const [favoritesCount, setFavoritesCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log('🔄 FavoritesProvider rendered with:', { 
        isAuthenticated, 
        user: !!user,
        userDetails: user ? { id: user.id, email: user.email } : null 
    });

    useEffect(() => {
        console.log('📝 FavoritesProvider useEffect triggered:', { 
            isAuthenticated, 
            user: !!user,
            currentFavorites: favorites.length 
        });
        
        if (isAuthenticated && user) {
            console.log('✅ User is authenticated, loading favorites...');
            loadFavorites();
        } else {
            console.log('❌ User not authenticated, clearing favorites...');
            setFavorites([]);
            setFavoritesCount(0);
            setError(null);
        }
    }, [isAuthenticated, user]);

    // Încarcă lista de ID-uri ale favoritelor
    const loadFavorites = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('📥 Loading favorites...');
            
            const favoriteIds = await FavoriteApiClient.getUserFavoriteIds();
            console.log('✅ Favorites loaded successfully:', favoriteIds);
            
            // Asigură-te că sunt numere pentru comparații corecte
            const normalizedIds = favoriteIds.map(id => 
                typeof id === 'string' ? parseInt(id, 10) : id
            );
            
            setFavorites(normalizedIds);
            setFavoritesCount(normalizedIds.length);
            
            console.log('📊 Favorites state updated:', {
                count: normalizedIds.length,
                ids: normalizedIds
            });
            
        } catch (error) {
            console.error('❌ Error loading favorites:', error);
            setFavorites([]);
            setFavoritesCount(0);
            setError(error.message || 'Eroare la încărcarea favoritelor');
            
            // Log detalii despre eroare
            if (error.status) {
                console.error('📱 HTTP Status:', error.status);
            }
            if (error.response) {
                console.error('📄 Response:', error.response);
            }
        } finally {
            setLoading(false);
        }
    };

    // Adaugă la favorite
    const addFavorite = async (plajaId) => {
        const normalizedId = typeof plajaId === 'string' ? parseInt(plajaId, 10) : plajaId;
        
        try {
            console.log('➕ Adding favorite:', normalizedId);
            await FavoriteApiClient.addToFavorites(normalizedId);
            
            setFavorites(prev => {
                if (!prev.includes(normalizedId)) {
                    const newFavorites = [...prev, normalizedId];
                    console.log('✅ Added to favorites locally:', newFavorites);
                    return newFavorites;
                }
                return prev;
            });
            setFavoritesCount(prev => prev + 1);
            return true;
        } catch (error) {
            console.error('❌ Error adding favorite:', error);
            setError(error.message || 'Eroare la adăugarea favoritei');
            return false;
        }
    };

    // Elimină din favorite
    const removeFavorite = async (plajaId) => {
        const normalizedId = typeof plajaId === 'string' ? parseInt(plajaId, 10) : plajaId;
        
        try {
            console.log('➖ Removing favorite:', normalizedId);
            await FavoriteApiClient.removeFromFavorites(normalizedId);
            
            setFavorites(prev => {
                const newFavorites = prev.filter(id => id !== normalizedId);
                console.log('✅ Removed from favorites locally:', newFavorites);
                return newFavorites;
            });
            setFavoritesCount(prev => prev - 1);
            return true;
        } catch (error) {
            console.error('❌ Error removing favorite:', error);
            setError(error.message || 'Eroare la eliminarea favoritei');
            return false;
        }
    };

    // Toggle favorite
    const toggleFavorite = async (plajaId) => {
        const normalizedId = typeof plajaId === 'string' ? parseInt(plajaId, 10) : plajaId;
        
        console.log('🔄 Toggle favorite called for plajaId:', normalizedId, {
            currentFavorites: favorites,
            isCurrentlyFavorite: favorites.includes(normalizedId)
        });
        
        if (!isAuthenticated || !user) {
            console.warn('❌ User not authenticated, cannot toggle favorite');
            setError('Trebuie să fii autentificat pentru a adăuga favorite');
            return null;
        }

        if (loading) {
            console.warn('⏳ Already loading, ignoring toggle request');
            return null;
        }

        try {
            setError(null);
            console.log('🚀 Calling API toggleFavorite with:', normalizedId);
            
            const result = await FavoriteApiClient.toggleFavorite(normalizedId);
            console.log('✅ API Toggle result:', result);
            
            if (result && typeof result.isFavorite === 'boolean') {
                if (result.isFavorite) {
                    setFavorites(prev => {
                        if (!prev.includes(normalizedId)) {
                            const newFavorites = [...prev, normalizedId];
                            console.log('➕ Added to favorites, new list:', newFavorites);
                            return newFavorites;
                        }
                        return prev;
                    });
                    setFavoritesCount(prev => prev + 1);
                } else {
                    setFavorites(prev => {
                        const newFavorites = prev.filter(id => id !== normalizedId);
                        console.log('➖ Removed from favorites, new list:', newFavorites);
                        return newFavorites;
                    });
                    setFavoritesCount(prev => prev - 1);
                }
                
                return result.isFavorite;
            } else {
                console.error('❌ Invalid API response format:', result);
                setError('Răspuns invalid de la server');
                return null;
            }
        } catch (error) {
            console.error('❌ Error toggling favorite:', error);
            setError(error.message || 'Eroare la modificarea favoritei');
            return null;
        }
    };

    // Verifică dacă o plajă este favorită
    const isFavorite = (plajaId) => {
        const normalizedId = typeof plajaId === 'string' ? parseInt(plajaId, 10) : plajaId;
        const result = favorites.includes(normalizedId);
        
        console.log(`🔍 Checking if plaja ${normalizedId} is favorite:`, result, 'from list:', favorites);
        return result;
    };

    // Curăță erorile
    const clearError = () => {
        setError(null);
    };

    const value = {
        favorites,
        favoritesCount,
        loading,
        error,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        loadFavorites,
        clearError
    };

    console.log('📦 FavoritesContext value updated:', { 
        favoritesCount: value.favoritesCount, 
        favoritesLength: value.favorites.length,
        loading: value.loading,
        error: value.error,
        isAuthenticated,
        hasUser: !!user
    });

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};