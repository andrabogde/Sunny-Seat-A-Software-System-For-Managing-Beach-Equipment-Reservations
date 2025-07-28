import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  IconBeach, 
  IconSearch, 
  IconUser, 
  IconHeart, 
  IconTicket, 
  IconMenu2, 
  IconUmbrella,
  IconHome, 
  IconMap, 
  IconInfoCircle,
  IconLogout,
  IconSettings,
  IconUserCircle,
  IconBell
} from '@tabler/icons-react';
import { AuthContext } from '../../contexts/AuthContext';

/**
 * Componentă îmbunătățită pentru bara de navigare
 */
const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3); // Mock pentru notificări necitite
  const navigate = useNavigate();

  // ✅ FUNCȚIE PENTRU OBȚINEREA IMAGINII DE PROFIL
  const getProfileImageUrl = () => {
    // Verificăm mai întâi dacă există imaginea uploadată
    if (user?.profileImage?.data) {
      return `data:${user.profileImage.mimeType};base64,${user.profileImage.data}`;
    } 
    // Dacă nu, verificăm dacă există URL-ul imaginii
    else if (user?.profileImage?.url) {
      return user.profileImage.url;
    }
    // Dacă utilizatorul are un avatar setat
    else if (user?.avatar) {
      return user.avatar;
    }
    // Dacă nimic nu e setat, generăm avatar cu inițialele
    else if (user?.name) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=80&background=0066ff&color=ffffff&format=png&rounded=true`;
    }
    // Fallback final
    else {
      return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80";
    }
  };

  // Efect pentru detectarea scroll-ului
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Efect pentru închiderea dropdown-ului la click în afara lui
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('#userDropdown') && !event.target.closest('.dropdown-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  // Handler îmbunătățit pentru logout cu redirecționare
  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    logout();
    setIsMenuOpen(false);
    setShowDropdown(false);
    navigate('/');
    
    console.log('Utilizator deconectat cu succes');
  };

  // Handler pentru a naviga către profil și a închide meniul
  const navigateToProfile = () => {
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate('/profil');
  };

  // Toggle pentru dropdown
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // ✅ FUNCȚIE PENTRU OBȚINEREA NUMELUI DE AFIȘARE
  const getDisplayName = () => {
    if (user?.name) {
      // Dacă numele este complet (ex: "Ion Popescu"), luăm primul cuvânt
      return user.name.split(' ')[0];
    } else if (user?.nume) {
      return user.nume;
    } else if (user?.prenume) {
      return user.prenume;
    } else {
      return 'Utilizator';
    }
  };

  // ✅ FUNCȚIE PENTRU NUMELE COMPLET ÎN DROPDOWN
  const getFullName = () => {
    if (user?.name) {
      return user.name;
    } else if (user?.prenume && user?.nume) {
      return `${user.prenume} ${user.nume}`;
    } else if (user?.nume) {
      return user.nume;
    } else {
      return 'Utilizator';
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <IconBeach className="me-2 text-primary" size={32} stroke={1.5} />
          <span className="fw-bold">SunnySeat</span>
        </Link>
        
        <button 
          className={`navbar-toggler border-0 ${isMenuOpen ? 'active' : ''}`} 
          type="button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="navbarNav" 
          aria-expanded={isMenuOpen ? 'true' : 'false'} 
          aria-label="Toggle navigation"
        >
          <IconMenu2 size={24} />
        </button>
        
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                <IconHome size={18} className="me-2" />Acasă
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                to="/statiuni"
                onClick={() => setIsMenuOpen(false)}
              >
                <IconMap size={18} className="me-2" />Stațiuni
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                to="/plaje"
                onClick={() => setIsMenuOpen(false)}
              >
                <IconUmbrella size={18} className="me-2" />Plaje
              </NavLink>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink 
                    className={({isActive}) => `nav-link ${isActive ? 'active' : ''} position-relative`} 
                    to="/notificari"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconBell size={18} className="me-2" />
                    Notificări
                    {/* {unreadNotifications > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{fontSize: '0.6rem', padding: '2px 6px'}}>
                        {unreadNotifications}
                      </span>
                    )} */}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                    to="/favorite"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconHeart size={18} className="me-2" />Favorite
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink 
                    className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                    to="/rezervari"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <IconTicket size={18} className="me-2" />Rezervările Mele
                  </NavLink>
                </li>
              </>
            )}
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} 
                to="/despre-noi"
                onClick={() => setIsMenuOpen(false)}
              >
                <IconInfoCircle size={18} className="me-2" />Despre Noi
              </NavLink>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {/* Buton de căutare - opțional */}
            <button type="button" className="btn btn-link text-dark me-3 d-none d-lg-block p-0">
              <IconSearch size={22} />
            </button>
            
            {isAuthenticated ? (
              <div className="dropdown">
                <button 
                  className="btn btn-link d-flex align-items-center text-decoration-none p-0" 
                  type="button"
                  id="userDropdown" 
                  onClick={toggleDropdown}
                  aria-expanded={showDropdown ? 'true' : 'false'}
                >
                  <div className="position-relative">
                    {/* ✅ FOLOSEȘTE FUNCȚIA PENTRU IMAGINEA DE PROFIL */}
                    <img 
                      src={getProfileImageUrl()} 
                      alt="User Avatar" 
                      className="rounded-circle border border-2 border-primary" 
                      width="40" 
                      height="40" 
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback în caz că imaginea nu se încarcă
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&size=80&background=0066ff&color=ffffff&format=png&rounded=true`;
                      }}
                    />
                    <span className="position-absolute top-0 end-0 translate-middle badge rounded-pill bg-accent">
                      <span className="visually-hidden">notifications</span>
                    </span>
                  </div>
                  {/* ✅ FOLOSEȘTE FUNCȚIA PENTRU NUMELE DE AFIȘARE */}
                  <span className="d-none d-md-inline ms-2 text-dark">{getDisplayName()}</span>
                </button>
                <ul className={`dropdown-menu dropdown-menu-end shadow border-0 rounded-beach mt-2 ${showDropdown ? 'show' : ''}`} aria-labelledby="userDropdown" style={{display: showDropdown ? 'block' : 'none'}}>
                  <li>
                    <div className="px-3 py-2 text-center border-bottom">
                      {/* ✅ ADAUGĂ ȘI IMAGINEA ÎN DROPDOWN */}
                      <div className="mb-2">
                        <img 
                          src={getProfileImageUrl()} 
                          alt="User Avatar" 
                          className="rounded-circle border border-2 border-primary" 
                          width="50" 
                          height="50" 
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getDisplayName())}&size=100&background=0066ff&color=ffffff&format=png&rounded=true`;
                          }}
                        />
                      </div>
                      {/* ✅ FOLOSEȘTE FUNCȚIA PENTRU NUMELE COMPLET */}
                      <p className="mb-0 fw-bold">{getFullName()}</p>
                      <small className="text-muted">{user?.email}</small>
                    </div>
                  </li>
                  <li>
                    <button 
                      className="dropdown-item py-2" 
                      onClick={navigateToProfile}
                      type="button"
                    >
                      <IconUserCircle size={18} className="me-2" />Contul meu
                    </button>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item py-2 position-relative" 
                      to="/notificari"
                      onClick={() => setShowDropdown(false)}
                    >
                      <IconBell size={18} className="me-2" />Notificări
                      {unreadNotifications > 0 && (
                        <span className="badge bg-danger rounded-pill ms-auto" style={{fontSize: '0.6rem'}}>
                          {unreadNotifications}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item py-2" 
                      to="/favorite"
                      onClick={() => setShowDropdown(false)}
                    >
                      <IconHeart size={18} className="me-2" />Plaje Favorite
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item py-2" 
                      to="/rezervari"
                      onClick={() => setShowDropdown(false)}
                    >
                      <IconTicket size={18} className="me-2" />Rezervări
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger py-2 d-flex align-items-center w-100 text-start" 
                      onClick={handleLogout}
                      type="button"
                    >
                      <IconLogout size={18} className="me-2" />Deconectare
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  <i className="ti ti-login me-1"></i>Conectare
                </Link>
                <Link to="/register" className="btn btn-primary">
                  <i className="ti ti-user-plus me-1"></i>Înregistrare
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;