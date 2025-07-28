import React from 'react';
import { Link } from 'react-router-dom';
import { IconBeach, IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube, IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
// Importă fișierul CSS dacă creezi unul separat
import '../../assets/css/footer.css';

/**
 * Componentă îmbunătățită pentru footer
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Stiluri inline pentru iconițele de contact (alternativă la fișier CSS separat)
  const contactIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px', // Ajustează după preferințe
    height: '32px', // Ajustează după preferințe
    // backgroundColor: '#0d6efd', // Culoarea primară Bootstrap (sau culoarea ta) - este deja aplicată prin bg-primary
    // color: 'white', // Este deja aplicată prin text-white
    // borderRadius: '50%', // Este deja aplicată prin rounded-circle
    // marginRight: '0.75rem' // clasa me-3
  };


  return (
    <footer className="footer bg-dark text-white pt-5 pb-4"> {/* Am adăugat bg-dark și am ajustat padding-ul */}
      <div className="container"> {/* Am scos py-5 de aici pentru a-l pune pe footer direct */}
        <div className="row gy-4 gx-5">
          <div className="col-lg-4 col-md-6"> {/* Am ajustat coloana pentru md */}
            <Link className="d-flex align-items-center mb-3 text-white text-decoration-none" to="/">
              <IconBeach className="me-2" size={32} />
              <span className="fs-4 fw-bold">SunnySeat</span>
            </Link>
            <p className="text-white-50 mb-3"> {/* Am ajustat mb */}
              Platforma ta pentru descoperirea și rezervarea celor mai frumoase plaje din România.
              Rezervă-ți locul perfect la plajă în câteva minute, direct de pe telefon sau calculator.
            </p>
            <div className="d-flex gap-2"> {/* Am scos mt-4 */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white-50" aria-label="Facebook">
                <IconBrandFacebook size={24} /> {/* Mărit puțin iconițele */}
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white-50" aria-label="Instagram">
                <IconBrandInstagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white-50" aria-label="Twitter">
                <IconBrandTwitter size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon text-white-50" aria-label="YouTube"> {/* Corectat link-ul pentru YouTube */}
                <IconBrandYoutube size={24} />
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6"> {/* Ajustat coloanele */}
            <h5 className="text-white mb-3 border-start border-primary border-3 ps-3">Navigare</h5>
            <ul className="list-unstyled footer-links"> {/* Adăugat o clasă custom 'footer-links' */}
              <li className="mb-2">
                <Link to="/" className="text-white-50 text-decoration-none footer-link-item">
                  Acasă
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/statiuni" className="text-white-50 text-decoration-none footer-link-item">
                  Stațiuni
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/plaje" className="text-white-50 text-decoration-none footer-link-item">
                  Plaje
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/favorite" className="text-white-50 text-decoration-none footer-link-item">
                  Favorite
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/rezervari" className="text-white-50 text-decoration-none footer-link-item">
                  Rezervări
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6 col-6"> {/* Ajustat coloanele */}
            <h5 className="text-white mb-3 border-start border-primary border-3 ps-3">Informații</h5>
            <ul className="list-unstyled footer-links"> {/* Adăugat o clasă custom 'footer-links' */}
              <li className="mb-2">
                <Link to="/despre-noi" className="text-white-50 text-decoration-none footer-link-item">
                  Despre noi
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/termeni-conditii" className="text-white-50 text-decoration-none footer-link-item">
                  Termeni și condiții
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/politica-confidentialitate" className="text-white-50 text-decoration-none footer-link-item">
                  Politica de confidențialitate
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/politica-cookies" className="text-white-50 text-decoration-none footer-link-item">
                  Politica de cookies
                </Link>
              </li>
              
            </ul>
          </div>

          <div className="col-lg-4 col-md-6"> {/* Am ajustat coloana pentru md */}
            <h5 className="text-white mb-3 border-start border-primary border-3 ps-3">Contact</h5>
            <ul className="list-unstyled">
              <li className="d-flex align-items-start mb-3 text-white-50"> {/* Schimbat align-items-center cu align-items-start pentru text multilinie */}
                <div className="me-3 p-2 bg-primary rounded-circle text-white flex-shrink-0" style={contactIconStyle}> {/* Adăugat flex-shrink-0 */}
                  <IconMapPin size={18} />
                </div>
                <div>Bulevardul Mamaia nr. 123, Constanța, România</div>
              </li>
              <li className="d-flex align-items-start mb-3 text-white-50">
                <div className="me-3 p-2 bg-primary rounded-circle text-white flex-shrink-0" style={contactIconStyle}>
                  <IconMail size={18} />
                </div>
                <div>
                  <a href="mailto:contact@SunnySeat.ro" className="text-white-50 text-decoration-none">contact@SunnySeat.ro</a>
                </div>
              </li>
              <li className="d-flex align-items-start mb-3 text-white-50"> {/* Ajustat mb */}
                <div className="me-3 p-2 bg-primary rounded-circle text-white flex-shrink-0" style={contactIconStyle}>
                  <IconPhone size={18} />
                </div>
                <div>
                  <a href="tel:+40722123456" className="text-white-50 text-decoration-none">0722 123 456</a>
                </div>
              </li>
            </ul>

          </div>
        </div>

        <hr className="mt-5 mb-4 border-secondary" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0"> {/* Adăugat spațiu jos pe mobil */}
            <p className="text-white-50 mb-0 small">© {currentYear} SunnySeat. Toate drepturile rezervate.</p> {/* Făcut textul puțin mai mic */}
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-white-50 mb-0 small"> {/* Făcut textul puțin mai mic */}
              Dezvoltat cu <span className="text-danger">❤</span> pentru iubitorii de plaje
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;