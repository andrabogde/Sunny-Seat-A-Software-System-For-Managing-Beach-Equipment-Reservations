// Componenta pentru formularul Stripe
const StripeCardForm = ({ amount, onPaymentSuccess, onPaymentError, onBack, isProcessing, setIsProcessing }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
  
    const cardElementOptions = {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
          padding: '12px',
        },
        invalid: {
          color: '#9e2146',
        },
      },
      hidePostalCode: true,
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setError(null);
      setIsProcessing(true);
  
      if (!stripe || !elements) {
        setIsProcessing(false);
        return;
      }
  
      try {
        // 1. Creează PaymentIntent pe backend
        console.log('🔵 Creez PaymentIntent pentru suma:', amount);
        const { clientSecret } = await stripeService.createPaymentIntent(amount);
  
        // 2. Confirmă plata cu Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          }
        });
  
        if (error) {
          console.error('❌ Eroare Stripe:', error);
          setError(error.message);
          onPaymentError(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          console.log('✅ Plata reușită:', paymentIntent.id);
          onPaymentSuccess(paymentIntent.id);
        }
      } catch (err) {
        console.error('❌ Eroare procesare plată:', err);
        setError(err.message);
        onPaymentError(err.message);
      } finally {
        setIsProcessing(false);
      }
    };
  
    return (
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white py-4">
          <h3 className="mb-0 fw-bold">
            <span style={{ fontSize: '1.5rem' }} className="me-3">💳</span>
            Plată securizată cu Stripe
          </h3>
        </div>
        
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-semibold mb-3">Detaliile cardului</label>
              <div className="stripe-card-element p-3 border rounded">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
  
            {error && (
              <div className="alert alert-danger">
                <i className="ti ti-alert-circle me-2"></i>
                {error}
              </div>
            )}
  
            <div className="alert alert-info">
              <i className="ti ti-shield-check me-2"></i>
              <strong>Plată 100% securizată</strong> - Procesată prin Stripe. Datele cardului nu sunt stocate pe serverele noastre.
            </div>
  
            <div className="d-flex gap-2">
              <button 
                type="button"
                onClick={onBack}
                className="btn btn-secondary flex-fill"
                disabled={isProcessing}
              >
                Înapoi
              </button>
              <button 
                type="submit"
                className="btn btn-primary flex-fill"
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Procesez plata...
                  </>
                ) : (
                  `Plătește ${amount} RON`
                )}
              </button>
            </div>
          </form>
        </div>
  
        <style jsx="true">{`
          .stripe-card-element {
            background: #f8f9fa;
            border: 2px solid #dee2e6 !important;
            border-radius: 8px;
            transition: border-color 0.3s ease;
          }
          
          .stripe-card-element:focus-within {
            border-color: #0d6efd !important;
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          }
        `}</style>
      </div>
    );
  };