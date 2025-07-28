import React from 'react';
import { IconSun, IconMapPin, IconCrown } from '@tabler/icons-react';

/**
 * Componentă pentru secțiunea de beneficii/caracteristici
 * Înlocuiește secțiunea actuală cu carduri de beneficii
 */
const FeatureSection = () => {
  // Definim culorile personalizate pentru interfață
  const colors = {
    primary: '#3498db',     // Albastru
    accent: '#f39c12',      // Portocaliu
    turquoise: '#20c997',   // Turcoaz
    dark: '#2c3e50',        // Albastru închis
  };

  // Lista de facilități
  const features = [
    {
      icon: <IconSun size={32} />,
      title: 'Rezervare simplă',
      description: 'Rezervă-ți șezlongurile și umbrelele direct de pe telefon sau calculator, în câteva minute.',
      color: colors.primary
    },
    {
      icon: <IconMapPin size={32} />,
      title: 'Plaje de top',
      description: 'Descoperă cele mai frumoase plaje din România, cu toate facilitățile și serviciile disponibile.',
      color: colors.accent
    },
    {
      icon: <IconCrown size={32} />,
      title: 'Experiență premium',
      description: 'Sistem de recenzii verificate pentru a-ți oferi cea mai bună experiență la plajă.',
      color: colors.turquoise
    }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-4">
              <div className="card border-0 h-100 shadow-sm rounded-4 p-4 text-center hover-lift" 
                   style={{ 
                     transition: 'all 0.3s ease',
                     transform: 'translateY(0)',
                   }}
                   onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                   onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body p-4">
                  <div className="mb-4">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle text-white p-3 mb-2"
                          style={{ 
                            width: '80px', 
                            height: '80px', 
                            backgroundColor: feature.color,
                            boxShadow: `0 10px 20px ${feature.color}40`
                          }}>
                      {feature.icon}
                    </span>
                    <h3 className="h4 mt-4 mb-3">{feature.title}</h3>
                  </div>
                  <p className="text-muted mb-4">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;