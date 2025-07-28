import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Routes from './routes/Routes';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ChatBot from './components/common/ChatBot';
import './assets/css/styles.css';

// Import bootstrap și alte dependențe
import '@tabler/core/dist/css/tabler.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'animate.css';

// Componentă internă pentru a avea acces la useLocation
const AppLayout = () => {
  const location = useLocation();
     
  // Verifică dacă suntem pe o rută admin (doar admin-ul nu trebuie să aibă navbar public)
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/manager');
  
  // Rutele publice includ și paginile de autentificare - utilizatorii neautentificați pot naviga liber
  const isPublicRoute = !isAdminRoute;
     
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {/* Navbar - se afișează pentru toate rutele publice (inclusiv login/register) */}
      {isPublicRoute && <Navbar />}
             
      {/* Main content */}
      <main className={isAdminRoute ? 'flex-grow-1 p-0' : 'flex-grow-1'}>
        <Routes />
      </main>
             
      {/* Footer - se afișează pentru toate rutele publice (inclusiv login/register) */}
      {isPublicRoute && <Footer />}
             
      {/* ChatBot - se afișează pentru toate rutele publice (inclusiv login/register) */}
      {isPublicRoute && <ChatBot />}
    </div>
  );
};

// Componentă wrapper pentru FavoritesProvider care are acces la AuthContext
const FavoritesWrapper = ({ children }) => {
  const authContext = useContext(AuthContext);
  
  // Debug pentru a vedea ce primește FavoritesWrapper
  console.log('🔍 FavoritesWrapper Debug:', {
    authContext: !!authContext,
    isAuthenticated: authContext?.isAuthenticated,
    user: !!authContext?.user,
    userDetails: authContext?.user ? {
      id: authContext.user.id,
      email: authContext.user.email,
      name: authContext.user.name
    } : null
  });
  
  // Verifică dacă AuthContext este disponibil
  if (!authContext) {
    console.error('❌ AuthContext nu este disponibil în FavoritesWrapper');
    return children; // Returnează children fără FavoritesProvider
  }
  
  const { isAuthenticated, user } = authContext;
  
  // Pentru debug - afișează starea de autentificare
  console.log('🔐 Auth State în FavoritesWrapper:', {
    isAuthenticated,
    hasUser: !!user,
    userId: user?.id
  });
  
  return (
    <FavoritesProvider isAuthenticated={isAuthenticated} user={user}>
      {children}
    </FavoritesProvider>
  );
};

function App() {
  useEffect(() => {
    // Adăugăm fonturile la runtime
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
         
    // Curățare la demontare
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
 
  return (
    <Router>
      <AuthProvider>
        <FavoritesWrapper>
          <AppLayout />
        </FavoritesWrapper>
      </AuthProvider>
    </Router>
  );
}

export default App;