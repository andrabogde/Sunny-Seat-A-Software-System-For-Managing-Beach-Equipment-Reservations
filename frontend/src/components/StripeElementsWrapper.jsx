import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import stripePromise, { isStripeReady } from '../services/stripeConfig';

const StripeElementsWrapper = ({ children }) => {
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initializeStripe = async () => {
      try {
        console.log('🔵 Checking Stripe readiness...');
        
        // Verifică direct promisiunea
        const stripe = await stripePromise;
        
        if (!mounted) return;

        if (stripe) {
          console.log('✅ Stripe is ready');
          setStripeReady(true);
          setStripeError(null);
        } else {
          console.error('❌ Stripe is null');
          setStripeError('Stripe failed to load');
        }
      } catch (error) {
        console.error('❌ Error initializing Stripe:', error);
        if (mounted) {
          setStripeError(error.message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeStripe();

    return () => {
      mounted = false;
    };
  }, []);

  // Opțiuni simple pentru Elements
  const elementsOptions = {
    locale: 'ro'
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Se încarcă sistemul de plată...</p>
        </div>
      </div>
    );
  }

  if (stripeError) {
    return (
      <div className="alert alert-danger">
        <div className="d-flex align-items-center">
          <span className="me-3" style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <strong>Eroare la încărcarea sistemului de plată</strong>
            <br />
            <small>{stripeError}</small>
            <br />
            <button 
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={() => window.location.reload()}
            >
              Reîncarcă pagina
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stripeReady) {
    return (
      <div className="alert alert-warning">
        <div className="d-flex align-items-center">
          <span className="me-3" style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div>
            <strong>Sistemul de plată nu este disponibil</strong>
            <br />
            <small>Te rugăm să reîmprospătezi pagina sau să încerci din nou.</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      {children}
    </Elements>
  );
};

export default StripeElementsWrapper;