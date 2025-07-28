import React from 'react';
import { Link } from 'react-router-dom';
import { IconUmbrella, IconSun, IconUsers, IconStar } from '@tabler/icons-react';

/**
 * Componentă Hero Section cu statistici și design curat
 */
const HeroSection = () => {
  return (
    <div className="position-relative">
      {/* Imagine fundal și overlay */}
      <div
        className="hero-section position-relative overflow-hidden"
        style={{
          height: '88vh',
          backgroundImage:
            'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          paddingTop: '80px',
          paddingBottom: '80px',
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.6), rgba(0,0,0,0.3))',
            zIndex: 0,
          }}
        />

        {/* Conținut Hero */}
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-lg-7 col-md-9 text-white">
              <h1 className="display-1 fw-bold mb-4" style={{ lineHeight: '1.1', fontSize: '5rem' }}>
                Plajă
              </h1>

              <p className="lead mb-5" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
                Rezervă-ți locul la cele mai frumoase plaje din România. Șezlonguri, umbrele, activități și mai mult într-un singur loc.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-5">
                <Link
                  to="/plaje"
                  className="btn btn-primary px-4 py-2"
                  style={{
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    minWidth: '180px',
                    textAlign: 'center',
                  }}
                >
                  Descoperă Plajele
                </Link>
                <Link
                  to="/rezerva"
                  className="btn btn-outline-light px-4 py-2"
                  style={{
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: '500',
                    minWidth: '180px',
                    textAlign: 'center',
                    border: '1px solid rgba(255,255,255,0.5)',
                  }}
                >
                  Rezervă Acum
                </Link>
              </div>
            </div>
          </div>

          {/* Statistic Cards */}
          <div className="row text-white g-4 mt-4">
            {/* Card 1 */}
            <div className="col-lg-3 col-sm-6">
              <div
                className="text-center h-100 py-3 px-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: '#3498db',
                  }}
                >
                  <IconUmbrella size={20} color="white" />
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: '1.8rem' }}>
                  30+
                </h3>
                <p className="mb-0 small" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Plaje în România
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-lg-3 col-sm-6">
              <div
                className="text-center h-100 py-3 px-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: '#20c997',
                  }}
                >
                  <IconSun size={20} color="white" />
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: '1.8rem' }}>
                  5K+
                </h3>
                <p className="mb-0 small" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Șezlonguri disponibile
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-lg-3 col-sm-6">
              <div
                className="text-center h-100 py-3 px-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: '#f39c12',
                  }}
                >
                  <IconUsers size={20} color="white" />
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: '1.8rem' }}>
                  10K+
                </h3>
                <p className="mb-0 small" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Rezervări lunare
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-lg-3 col-sm-6">
              <div
                className="text-center h-100 py-3 px-2"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  className="rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                  style={{
                    width: '45px',
                    height: '45px',
                    backgroundColor: '#2ecc71',
                  }}
                >
                  <IconStar size={20} color="white" />
                </div>
                <h3 className="fw-bold mb-0" style={{ fontSize: '1.8rem' }}>
                  4.8
                </h3>
                <p className="mb-0 small" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Rating mediu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Efect de undă */}
        <div className="position-absolute bottom-0 start-0 w-100" style={{ zIndex: 1 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" style={{ display: 'block', width: '100%', height: 'auto', marginBottom: '-5px' }}>
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,202.7C1120,203,1280,181,1360,170.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
