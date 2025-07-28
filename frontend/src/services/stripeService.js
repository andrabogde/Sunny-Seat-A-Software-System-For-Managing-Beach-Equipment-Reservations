// src/services/stripeService.js
class StripeService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api/stripe';
  }

  getAuthToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }

  getHeaders() {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async createPaymentIntent(amount, currency = 'ron') {
    try {
      console.log('🔵 Creating PaymentIntent for amount:', amount);
      
      if (!amount || amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Converteste amountul in bani (cents pentru RON)
      const amountInCents = Math.round(amount * 100);
      
      const response = await fetch(`${this.baseURL}/create-payment-intent`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          amount: amountInCents,
          currency: currency
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ PaymentIntent creation failed:', response.status, data);
        throw new Error(data.error || `HTTP ${response.status}: ${JSON.stringify(data)}`);
      }

      console.log('✅ PaymentIntent created successfully');
      return data;
    } catch (error) {
      console.error('Eroare createPaymentIntent:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId, reservationData) {
    try {
      console.log('🔵 Confirming payment for:', paymentIntentId);
      
      const response = await fetch(`${this.baseURL}/confirm-payment`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          paymentIntentId: paymentIntentId,
          reservationData: reservationData
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Payment confirmation failed:', response.status, data);
        throw new Error(data.error || `HTTP ${response.status}: ${JSON.stringify(data)}`);
      }

      console.log('✅ Payment confirmed successfully');
      return data;
    } catch (error) {
      console.error('Eroare confirmPayment:', error);
      throw error;
    }
  }
}

export default new StripeService();