// 2. Hook pentru gestionarea autentificării (useAuth.js)
import { useNavigate } from 'react-router-dom';
import apiService from '../services/ApiService';

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Șterge toate datele de autentificare
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirectionează către pagina principală
    navigate('/', { 
      state: { 
        message: 'Ai fost deconectat cu succes', 
        type: 'info' 
      } 
    });
  };

  const deleteAccountAndLogout = async (userId) => {
    try {
    
      // Șterge contul
      const result = await apiService.deleteUser(userId);
      
      // Logout și redirect
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Redirectionează cu mesaj de succes
      navigate('/', {
        state: {
          message: result.message || 'Contul a fost șters cu succes',
          type: 'success'
        }
      });

    } catch (error) {
     // addNotification(error.message, 'error');
      throw error;
    }
  };

  return {
    logout,
    deleteAccountAndLogout
  };
};