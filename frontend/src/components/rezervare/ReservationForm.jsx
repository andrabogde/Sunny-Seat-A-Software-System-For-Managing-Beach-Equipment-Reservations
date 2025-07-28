import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import PositiveNumberInput from '../common/PositiveNumberInput';

/**
 * Componentă pentru formularul de rezervare
 * @param {Object} props 
 * @param {Object} props.plaja - Datele plajei pentru care se face rezervarea
 */
const ReservationForm = ({ plaja }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);

  // Funcție pentru formatarea datei în dd/mm/yyyy
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Funcție pentru convertirea din dd/mm/yyyy în format ISO pentru input type="date"
  const convertToISODate = (ddmmyyyy) => {
    if (!ddmmyyyy || ddmmyyyy.length !== 10) return '';
    const [day, month, year] = ddmmyyyy.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Funcție pentru validarea formatului dd/mm/yyyy
  const isValidDateFormat = (dateString) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) return false;
    
    const [, day, month, year] = match;
    const date = new Date(year, month - 1, day);
    
    return date.getDate() == day && 
           date.getMonth() == (month - 1) && 
           date.getFullYear() == year;
  };

  // Stare pentru câmpurile formularului
  const [formData, setFormData] = useState({
    dataInceput: '', // Goală la început
    dataSfarsit: '', // Goală la început
    nrSezlonguri: 2,
    nrUmbrele: 1,
    pozitie: '',
    observatii: ''
  });

  // Calculare prețuri
  const [prices, setPrices] = useState({
    pretSezlong: 40,
    pretUmbrela: 30,
    taxaRezervare: 15
  });

  // Stare pentru validare
  const [errors, setErrors] = useState({});
  
  // Calculăm prețul total
  const totalSezlonguri = formData.nrSezlonguri * prices.pretSezlong;
  const totalUmbrele = formData.nrUmbrele * prices.pretUmbrela;
  const total = totalSezlonguri + totalUmbrele + prices.taxaRezervare;

  // Ajustăm prețurile în funcție de plajă și sezon
  useEffect(() => {
    if (plaja) {
      const rating = plaja.detaliiWeb?.rating || 0;
      const ratingFactor = 1 + (rating / 10);
      
      setPrices({
        pretSezlong: Math.round(40 * ratingFactor),
        pretUmbrela: Math.round(30 * ratingFactor),
        taxaRezervare: 15
      });
    }
  }, [plaja]);

  // Handler pentru schimbarea câmpurilor formularului
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Resetăm eroarea pentru câmpul respectiv
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handler special pentru câmpurile de dată
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatăm automat în timpul tastării
    if (value.length === 2 || value.length === 5) {
      if (!value.endsWith('/')) {
        formattedValue = value + '/';
      }
    }

    // Limităm la 10 caractere (dd/mm/yyyy)
    if (formattedValue.length > 10) {
      formattedValue = formattedValue.substring(0, 10);
    }

    setFormData({
      ...formData,
      [name]: formattedValue
    });

    // Resetăm eroarea pentru câmpul respectiv
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handler pentru increment/decrement
  const handleQuantityChange = (field, increment) => {
    const currentValue = formData[field];
    const min = field === 'nrUmbrele' ? 0 : 1;
    const max = field === 'nrSezlonguri' ? 10 : 5;
    
    let newValue = increment ? currentValue + 1 : currentValue - 1;
    newValue = Math.min(Math.max(newValue, min), max);
    
    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  // Validare formular
  const validateForm = () => {
    const newErrors = {};

    if (!formData.dataInceput) {
      newErrors.dataInceput = 'Vă rugăm să introduceți data de început';
    } else if (!isValidDateFormat(formData.dataInceput)) {
      newErrors.dataInceput = 'Formatul datei trebuie să fie dd/mm/yyyy (ex: 12/06/2025)';
    } else {
      // Verificăm ca data să nu fie în trecut
      const inputDate = new Date(convertToISODate(formData.dataInceput));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (inputDate < today) {
        newErrors.dataInceput = 'Data de început nu poate fi în trecut';
      }
    }

    if (!formData.dataSfarsit) {
      newErrors.dataSfarsit = 'Vă rugăm să introduceți data de sfârșit';
    } else if (!isValidDateFormat(formData.dataSfarsit)) {
      newErrors.dataSfarsit = 'Formatul datei trebuie să fie dd/mm/yyyy (ex: 15/06/2025)';
    } else if (formData.dataInceput && isValidDateFormat(formData.dataInceput)) {
      // Verificăm ca data de sfârșit să fie după data de început
      const startDate = new Date(convertToISODate(formData.dataInceput));
      const endDate = new Date(convertToISODate(formData.dataSfarsit));
      
      if (endDate < startDate) {
        newErrors.dataSfarsit = 'Data de sfârșit trebuie să fie după data de început';
      }
    }

    if (!formData.nrSezlonguri || formData.nrSezlonguri < 1) {
      newErrors.nrSezlonguri = 'Trebuie să rezervați cel puțin un șezlong';
    }

    if (!formData.pozitie) {
      newErrors.pozitie = 'Vă rugăm să selectați o poziție pe plajă';
    }

    if (!isAuthenticated) {
      newErrors.auth = 'Trebuie să fiți autentificat pentru a face o rezervare';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler alternativ pentru buton, independent de form
  const handlePaymentRedirect = () => {
    console.log('Buton plată apăsat direct!');
    
    if (validateForm()) {
      const paymentData = {
        // Date plajă
        plajaId: plaja.id,
        plajaDenumire: plaja.denumire,
        statiune: plaja.statiune?.denumire,
        
        // Date din formular - TOATE
        dataInceput: formData.dataInceput,
        dataSfarsit: formData.dataSfarsit,
        nrSezlonguri: formData.nrSezlonguri,
        nrUmbrele: formData.nrUmbrele,
        pozitie: formData.pozitie,
        observatii: formData.observatii,
        
        // Date preț - COMPLETE
        pret: {
          pretSezlong: prices.pretSezlong,
          pretUmbrela: prices.pretUmbrela,
          taxaRezervare: prices.taxaRezervare
        },
        
        // Total calculat
        totalCalculat: total
      };
  
      console.log('🚀 Navigating cu date COMPLETE:', paymentData);
      
      navigate('/payment', { 
        state: { 
          reservationData: paymentData 
        } 
      });
    }
  };

  // Handler pentru submit-ul formularului
  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Oprește propagarea evenimentului
    
    console.log('HandleSubmit apelat!'); // Debug
    
    // Apelăm direct handler-ul de redirecționare
    handlePaymentRedirect();
  };

  return (
    <div className="card shadow-sm rounded-4 mb-4 border-primary border-top border-4">
      <div className="card-body">
        <h4 className="card-title text-center mb-4">Rezervă acum</h4>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="dataInceput" className="form-label">Data de început</label>
            <input 
              type="text" 
              className={`form-control form-control-lg ${errors.dataInceput ? 'is-invalid' : ''}`}
              id="dataInceput"
              name="dataInceput"
              value={formData.dataInceput}
              onChange={handleDateChange}
              placeholder="dd/mm/yyyy"
              maxLength="10"
              required
            />
            {errors.dataInceput && <div className="invalid-feedback">{errors.dataInceput}</div>}
            <div className="form-text">Format: dd/mm/yyyy (ex: 12/06/2025)</div>
          </div>

          <div className="mb-3">
            <label htmlFor="dataSfarsit" className="form-label">Data de sfârșit</label>
            <input 
              type="text" 
              className={`form-control form-control-lg ${errors.dataSfarsit ? 'is-invalid' : ''}`}
              id="dataSfarsit"
              name="dataSfarsit"
              value={formData.dataSfarsit}
              onChange={handleDateChange}
              placeholder="dd/mm/yyyy"
              maxLength="10"
              required
            />
            {errors.dataSfarsit && <div className="invalid-feedback">{errors.dataSfarsit}</div>}
            <div className="form-text">Format: dd/mm/yyyy (ex: 15/06/2025)</div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="nrSezlonguri" className="form-label">Număr șezlonguri</label>
            <div className="input-group">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => handleQuantityChange('nrSezlonguri', false)}
              >
                <i className="ti ti-minus"></i>
              </button>
              <PositiveNumberInput 
                // type="number" 
                className={`form-control form-control-lg text-center ${errors.nrSezlonguri ? 'is-invalid' : ''}`}
                id="nrSezlonguri"
                name="nrSezlonguri"
                min="1"
                max="10"
                value={formData.nrSezlonguri}
                onChange={handleChange}
                required
              />
          

              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => handleQuantityChange('nrSezlonguri', true)}
              >
                <i className="ti ti-plus"></i>
              </button>
            </div>
            {errors.nrSezlonguri && <div className="text-danger mt-1 small">{errors.nrSezlonguri}</div>}
          </div>
          
          <div className="mb-3">
            <label htmlFor="nrUmbrele" className="form-label">Umbrele</label>
            <div className="input-group">
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => handleQuantityChange('nrUmbrele', false)}
              >
                <i className="ti ti-minus"></i>
              </button>
              <PositiveNumberInput 
                // type="number" 
                className="form-control form-control-lg text-center"
                id="nrUmbrele"
                name="nrUmbrele"
                min="0"
                max="5"
                value={formData.nrUmbrele}
                onChange={handleChange}
              />
              <button 
                type="button" 
                className="btn btn-outline-secondary" 
                onClick={() => handleQuantityChange('nrUmbrele', true)}
              >
                <i className="ti ti-plus"></i>
              </button>
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="pozitie" className="form-label">Poziție pe plajă</label>
            <select 
              className={`form-select form-select-lg ${errors.pozitie ? 'is-invalid' : ''}`}
              id="pozitie"
              name="pozitie"
              value={formData.pozitie}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selectează poziția preferată</option>
              <option value="fata">Primul rând (lângă mare)</option>
              <option value="mijloc">Rândurile din mijloc</option>
              <option value="spate">Rândurile din spate</option>
            </select>
            {errors.pozitie && <div className="invalid-feedback">{errors.pozitie}</div>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="observatii" className="form-label">Observații (opțional)</label>
            <textarea 
              className="form-control"
              id="observatii"
              name="observatii"
              rows="3"
              placeholder="Specificați orice cerințe suplimentare..."
              value={formData.observatii}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <div className="reservation-summary mb-4">
            <h5 className="border-bottom pb-2 mb-3">Sumar rezervare</h5>
            <div className="reservation-item">
              <span>Șezlonguri ({formData.nrSezlonguri} x {prices.pretSezlong} RON)</span>
              <span>{totalSezlonguri} RON</span>
            </div>
            <div className="reservation-item">
              <span>Umbrele ({formData.nrUmbrele} x {prices.pretUmbrela} RON)</span>
              <span>{totalUmbrele} RON</span>
            </div>
            <div className="reservation-item">
              <span>Taxă de rezervare</span>
              <span>{prices.taxaRezervare} RON</span>
            </div>
            <div className="reservation-total d-flex justify-content-between">
              <span>Total</span>
              <span className="text-primary">{total} RON</span>
            </div>
          </div>
          
          {errors.auth && <div className="alert alert-warning mb-3">{errors.auth}</div>}
          
          <button 
            type="button"
            onClick={handlePaymentRedirect}
            className="btn btn-primary btn-lg w-100"
            disabled={!isAuthenticated}
          >
            <i className="ti ti-check me-1"></i> Continuă la plată
          </button>
          
          {!isAuthenticated && (
            <div className="text-center mt-3">
              <small className="text-muted">
                Trebuie să te <a href="/login" className="text-decoration-none">conectezi</a> pentru a putea face o rezervare
              </small>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;