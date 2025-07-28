import React, { useState } from 'react';
import { IconCalendar, IconCheck, IconUsers, IconClock, IconBeach, IconX } from '@tabler/icons-react';

// Folosim aceleași culori personalizate din aplicația existentă
const colors = {
  primary: '#3498db',     // Albastru
  secondary: '#2ecc71',   // Verde
  accent: '#f39c12',      // Portocaliu
  turquoise: '#20c997',   // Turcoaz
  dark: '#2c3e50',        // Albastru închis
  light: '#ecf0f1'        // Gri deschis
};

/**
 * Formular de rezervare integrat în chatbot
 */
const BookingForm = ({ onSubmit, onCancel }) => {
  // Starea formularului
  const [formData, setFormData] = useState({
    beach: '',
    date: '',
    numberOfSeats: 1,
    timeSlot: 'fullDay'
  });
  
  // Opțiuni disponibile
  const beaches = ['Mamaia Nord', 'Mamaia Centru', 'Mamaia Sud', 'Eforie Nord', 'Costinești', 'Neptun', 'Jupiter'];
  const timeSlots = [
    { id: 'morning', label: 'Dimineața (8:00 - 13:00)' },
    { id: 'afternoon', label: 'După-amiaza (13:00 - 19:00)' },
    { id: 'fullDay', label: 'Toată ziua (8:00 - 19:00)' }
  ];
  
  // Handler pentru schimbări în formular
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handler pentru submit
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  // Calcularea datei minime (azi) pentru input date
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div 
      className="booking-form p-3 rounded-3 mb-3"
      style={{
        border: `1px solid ${colors.light}`,
        backgroundColor: 'white'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="m-0 fw-bold" style={{ color: colors.turquoise }}>Rezervare șezlong</h6>
        <button 
          className="btn btn-sm p-0"
          onClick={onCancel}
          style={{ color: colors.dark, background: 'none', border: 'none' }}
        >
          <IconX size={18} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Selectare plajă */}
        <div className="mb-3">
          <label 
            className="form-label d-flex align-items-center gap-2 mb-2 small"
            style={{ color: colors.dark }}
          >
            <IconBeach size={16} />
            Selectează plaja
          </label>
          <select
            className="form-select form-select-sm"
            name="beach"
            value={formData.beach}
            onChange={handleChange}
            required
            style={{
              borderRadius: '0.5rem',
              padding: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            <option value="">-- Selectează plaja --</option>
            {beaches.map(beach => (
              <option key={beach} value={beach}>{beach}</option>
            ))}
          </select>
        </div>
        
        {/* Selectare dată */}
        <div className="mb-3">
          <label 
            className="form-label d-flex align-items-center gap-2 mb-2 small"
            style={{ color: colors.dark }}
          >
            <IconCalendar size={16} />
            Data
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={today}
            required
            style={{
              borderRadius: '0.5rem',
              padding: '0.5rem',
              fontSize: '0.9rem'
            }}
          />
        </div>
        
        {/* Număr șezlonguri */}
        <div className="mb-3">
          <label 
            className="form-label d-flex align-items-center gap-2 mb-2 small"
            style={{ color: colors.dark }}
          >
            <IconUsers size={16} />
            Număr șezlonguri
          </label>
          <div className="d-flex align-items-center">
            <input
              type="range"
              className="form-range me-2"
              name="numberOfSeats"
              min="1"
              max="8"
              value={formData.numberOfSeats}
              onChange={handleChange}
            />
            <span 
              className="badge rounded-pill px-2 py-1"
              style={{ 
                backgroundColor: colors.turquoise,
                color: 'white',
                minWidth: '24px',
                textAlign: 'center'
              }}
            >
              {formData.numberOfSeats}
            </span>
          </div>
        </div>
        
        {/* Interval orar */}
        <div className="mb-3">
          <label 
            className="form-label d-flex align-items-center gap-2 mb-2 small"
            style={{ color: colors.dark }}
          >
            <IconClock size={16} />
            Interval orar
          </label>
          <div>
            {timeSlots.map(slot => (
              <div className="form-check mb-1" key={slot.id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="timeSlot"
                  id={`timeSlot-${slot.id}`}
                  value={slot.id}
                  checked={formData.timeSlot === slot.id}
                  onChange={handleChange}
                  style={{ 
                    cursor: 'pointer',
                    accentColor: colors.turquoise
                  }}
                />
                <label 
                  className="form-check-label small"
                  htmlFor={`timeSlot-${slot.id}`}
                  style={{ cursor: 'pointer' }}
                >
                  {slot.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Buton submit */}
        <button
          type="submit"
          className="btn w-100 mt-2"
          style={{
            backgroundColor: colors.turquoise,
            color: 'white',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            fontSize: '0.9rem'
          }}
        >
          <IconCheck size={18} className="me-2" />
          Verifică disponibilitatea
        </button>
      </form>
    </div>
  );
};

export default BookingForm;