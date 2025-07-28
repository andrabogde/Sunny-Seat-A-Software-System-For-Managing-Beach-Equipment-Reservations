// SOLUȚIE SIMPLĂ - Înlocuiește COMPLET PaymentPage.jsx cu acest cod:

import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../services/stripeConfig';
import stripeService from '../services/stripeService';

// Componentă STATICĂ pentru formularul Stripe - NU se re-randează
const StaticStripeForm = ({ amount, onSuccess, onError, onBack, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState('');
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event) => {
    console.log('🔵 Card change:', event.complete);
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !cardComplete) {
      onError('Te rugăm să completezi toate detaliile cardului.');
      return;
    }

    console.log('🔵 Starting payment...');

    try {
      // Creează PaymentIntent
      const { clientSecret } = await stripeService.createPaymentIntent(amount);
      console.log('🔵 PaymentIntent created');

      // Confirmă plata IMEDIAT
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: 'Test Customer' }
        }
      });

      if (result.error) {
        console.error('❌ Payment failed:', result.error.message);
        onError(result.error.message);
      } else {
        console.log('✅ Payment succeeded:', result.paymentIntent.id);
        onSuccess(result.paymentIntent.id);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      onError(error.message);
    }
  };

  return (
    <div className="card shadow-lg">
      <div className="card-header bg-primary text-white py-4">
        <h3 className="mb-0">💳 Plată cu cardul</h3>
      </div>
      
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-bold mb-3">Detaliile cardului</label>
            <div className="p-3 border rounded bg-light">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': { color: '#aab7c4' }
                    },
                    invalid: { color: '#9e2146' }
                  },
                  hidePostalCode: true
                }}
                onChange={handleCardChange}
              />
            </div>
            <small className="text-muted mt-2 d-block">
              <strong>Test:</strong> 4242 4242 4242 4242, 12/25, 123
            </small>
          </div>

          {cardError && (
            <div className="alert alert-danger">⚠️ {cardError}</div>
          )}

          <div className="alert alert-info">
            🛡️ <strong>Securizat prin Stripe</strong>
          </div>

          <div className="d-flex gap-2">
            <button 
              type="button" 
              onClick={onBack}
              className="btn btn-secondary flex-fill"
              disabled={disabled}
            >
              ← Înapoi
            </button>
            <button 
              type="submit"
              className="btn btn-primary flex-fill"
              disabled={disabled || !cardComplete || !stripe}
            >
              {disabled ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Procesez...
                </>
              ) : (
                `Plătește ${amount} RON`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componentă principală
const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const reservationData = location.state?.reservationData;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentOption, setPaymentOption] = useState('full');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Verifică datele rezervării
  useEffect(() => {
    if (!reservationData) {
      navigate('/plaje');
    }
  }, [reservationData, navigate]);

  // Calculează prețul
  const totalPrice = useMemo(() => {
    if (!reservationData) return 0;
    
    if (reservationData.totalCalculat) {
      return reservationData.totalCalculat;
    }
    
    const days = 1; // sau calculează zilele
    const sezlonguri = (reservationData.nrSezlonguri || 0) * 25 * days;
    const umbrele = (reservationData.nrUmbrele || 0) * 30 * days;
    const taxa = 15;
    
    return sezlonguri + umbrele + taxa;
  }, [reservationData]);

  const paymentAmount = paymentOption === 'full' ? totalPrice : Math.round(totalPrice / 2);

  // Handlers
  // În PaymentPage.jsx - înlocuiește handlePaymentSuccess
const handlePaymentSuccess = async (paymentIntentId) => {
  setIsProcessing(true);
  
  try {
    console.log('✅ Processing successful payment:', paymentIntentId);
    console.log('📦 Reservation data to send:', reservationData);
    
    // 🆕 PREGĂTEȘTE DATELE PENTRU BACKEND STRIPE
    const backendReservationData = {
      // Date utilizator
      utilizatorId: reservationData.utilizatorId,
      
      // Date plajă
      plajaId: reservationData.plajaId,
      numePlaja: reservationData.numePlaja,
      statiune: reservationData.statiune,
      
      // Date rezervare
      dataRezervare: reservationData.dataRezervare,  // Data principală în format YYYY-MM-DD
      dataInceput: reservationData.dataInceput,
      dataSfarsit: reservationData.dataSfarsit,
      
      // 🔑 POZIȚIA PRINCIPALĂ - pentru notificare
      pozitiaSezlong: reservationData.pozitiaSezlong,
      
      // Date suplimentare
      totalCalculat: reservationData.totalCalculat,
      paymentOption: paymentOption,
      pozitiiSelectate: reservationData.pozitiiSelectate || [],
      
      // Debugging info
      numarPozitii: reservationData.numarPozitii,
      tipuriSelectate: reservationData.tipuriSelectate
    };
    
    console.log('🚀 Sending to backend:', backendReservationData);
    
    // Confirmă rezervarea pe backend
    const result = await stripeService.confirmPayment(paymentIntentId, backendReservationData);
    
    if (result.success) {
      console.log('✅ Backend confirmation successful:', result);
      setPaymentResult({
        codRezervare: result.codRezervare,
        paymentIntentId: paymentIntentId,
        amount: paymentAmount,
        rezervareId: result.rezervareId,
        stareRezervare: result.stareRezervare
      });
      setSuccess(true);
    } else {
      console.error('❌ Backend confirmation failed:', result);
      setError('Eroare la confirmarea rezervării: ' + result.message);
    }
  } catch (error) {
    console.error('❌ Error confirming reservation:', error);
    setError('Eroare la confirmarea rezervării: ' + error.message);
  } finally {
    setIsProcessing(false);
  }
};

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
    setIsProcessing(false);
  };

  // Step 1: Confirmarea rezervării
  const ConfirmationStep = () => (
    <div className="card shadow-lg">
      <div className="card-header bg-success text-white py-4">
        <h3 className="mb-0">✅ Confirmă rezervarea</h3>
      </div>
      <div className="card-body p-4">
        <div className="row mb-4">
          <div className="col-md-8">
            <h4>{reservationData.plajaDenumire}</h4>
            <p className="text-muted">{reservationData.statiune}, România</p>
            <p>
              <strong>Perioada:</strong> {reservationData.dataInceput} - {reservationData.dataSfarsit}
            </p>
            
            {reservationData.pozitiiSelectate && (
              <div>
                <strong>Poziții:</strong>
                {reservationData.pozitiiSelectate.map(pos => 
                  ` R${pos.row + 1}C${pos.col + 1} (${pos.type})`
                ).join(', ')}
              </div>
            )}
          </div>
          <div className="col-md-4 text-end">
            <div className="h3 text-primary">{totalPrice} RON</div>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex-fill"
          >
            ← Înapoi
          </button>
          <button 
            onClick={() => setCurrentStep(2)}
            className="btn btn-primary flex-fill"
          >
            Continuă la plată →
          </button>
        </div>
      </div>
    </div>
  );

  // Step 2: Opțiuni de plată
  const PaymentOptionsStep = () => (
    <div className="card shadow-lg">
      <div className="card-header bg-info text-white py-4">
        <h3 className="mb-0">💳 Opțiuni de plată</h3>
      </div>
      <div className="card-body p-4">
        <div className="mb-4">
          <div className="form-check mb-3 p-3 border rounded">
            <input
              className="form-check-input"
              type="radio"
              name="paymentOption"
              value="full"
              checked={paymentOption === 'full'}
              onChange={(e) => setPaymentOption(e.target.value)}
            />
            <label className="form-check-label">
              <strong>Plată integrală: {totalPrice} RON</strong>
              <div className="text-muted">Plătești toată suma acum</div>
            </label>
          </div>
          
          <div className="form-check mb-3 p-3 border rounded">
            <input
              className="form-check-input"
              type="radio"
              name="paymentOption"
              value="partial"
              checked={paymentOption === 'partial'}
              onChange={(e) => setPaymentOption(e.target.value)}
            />
            <label className="form-check-label">
              <strong>Plată parțială: {Math.round(totalPrice / 2)} RON</strong>
              <div className="text-muted">Restul de {totalPrice - Math.round(totalPrice / 2)} RON la check-in</div>
            </label>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <button 
            onClick={() => setCurrentStep(1)}
            className="btn btn-secondary flex-fill"
          >
            ← Înapoi
          </button>
          <button 
            onClick={() => setCurrentStep(3)}
            className="btn btn-primary flex-fill"
          >
            Continuă la card →
          </button>
        </div>
      </div>
    </div>
  );

  // Step 3: Plata cu cardul (cu Elements wrapper)
  const PaymentStep = () => (
    <Elements stripe={stripePromise} options={{ locale: 'ro' }}>
      <StaticStripeForm
        amount={paymentAmount}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onBack={() => setCurrentStep(2)}
        disabled={isProcessing}
      />
    </Elements>
  );

  // Pagina de success
  const SuccessStep = () => (
    <div className="card shadow-lg">
      <div className="card-header bg-success text-white text-center py-4">
        <h2 className="mb-0">🎉 Plată Confirmată!</h2>
        {paymentResult && (
          <div className="mt-3">
            <div className="badge bg-light text-dark p-2">
              Cod: <strong>{paymentResult.codRezervare}</strong>
            </div>
          </div>
        )}
      </div>
      <div className="card-body p-4 text-center">
        <p className="fs-5 mb-4">
          Rezervarea ta la <strong>{reservationData.plajaDenumire}</strong> a fost confirmată!
        </p>
        
        {paymentResult && (
          <div className="alert alert-info">
            <strong>Suma plătită:</strong> {paymentResult.amount} RON<br />
            <strong>ID Plată:</strong> {paymentResult.paymentIntentId}
          </div>
        )}
        
        <div className="d-flex gap-2 justify-content-center">
          <button 
            onClick={() => navigate('/')}
            className="btn btn-outline-primary"
          >
            🏠 Acasă
          </button>
          <button 
            onClick={() => navigate('/rezervari')}
            className="btn btn-primary"
          >
            🎫 Rezervările mele
          </button>
        </div>
      </div>
    </div>
  );

  // Guard pentru datele lipsă
  if (!reservationData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Nu au fost găsite datele rezervării.
        </div>
      </div>
    );
  }

  // Dacă plata a fost reușită
  if (success) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <SuccessStep />
          </div>
        </div>
      </div>
    );
  }

  // Steps configuration
  const steps = [
    { id: 1, title: 'Confirmare', component: ConfirmationStep },
    { id: 2, title: 'Opțiuni plată', component: PaymentOptionsStep },
    { id: 3, title: 'Plată card', component: PaymentStep }
  ];

  const CurrentComponent = steps.find(step => step.id === currentStep)?.component;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="d-flex justify-content-between">
              {steps.map((step, index) => (
                <div key={step.id} className="d-flex align-items-center">
                  <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                    currentStep >= step.id ? 'bg-primary text-white' : 'bg-light text-muted'
                  }`} style={{ width: '40px', height: '40px' }}>
                    {step.id}
                  </div>
                  <span className={`ms-2 ${currentStep >= step.id ? 'text-primary' : 'text-muted'}`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`mx-3 ${currentStep > step.id ? 'bg-primary' : 'bg-light'}`} 
                         style={{ height: '2px', width: '50px' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="alert alert-danger mb-4">
              ⚠️ {error}
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {/* Current Step */}
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;